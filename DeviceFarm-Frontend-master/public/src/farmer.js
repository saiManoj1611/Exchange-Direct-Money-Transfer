function Farmer() {
  let videoSocket = null;
  let controlSocket = null;
  let frameRequestIntervalId = null;
  let canvas = null;
  let homeBtn = null;
  let imgContent = null;
  let textPause = 500;
  let text = '';
  let state = 'opening';
  let scaleX = 1;
  let scaleY = 1;

  // start at second slowest FPS rate
  const initialFpsIntervalStepIndex = 1;
  const frameCounters = {
    intervalCounter: 0,
    requestResponseDiff: 0,
  };

  const minFps = 3;
  const maxFps = 15;
  const frameIntervalStepCount = 6;
  /*
   * Scale down at value (difference between requests and response counters) for all but first FPS scaling steps.
   * The values have to be quite low, it was easier to define them separately here with boundaries based on testing,
   * rather than trying to derive them in frameIntervalSteps mapping from the numbers available there.
   */
  const scaleDownAtValues = linspace(Math.log(3), Math.log(5), frameIntervalStepCount - 1)
    .map((num) => Math.round(Math.exp(num)));
  /*
   * FPS scaling steps based on 6 logarithmic steps in range between 3 and 15 fps: 3, 4.14, 5.71, 7.88, 10.87, 15
   * Scale attempt every 2 seconds.
   */
  const frameIntervalSteps = linspace(Math.log(minFps), Math.log(maxFps), frameIntervalStepCount).map((num, index) => {
    const fps = Math.exp(num);
    const frameInterval = Math.round(1000 / fps);
    return {
      // frame request interval in ms
      frameInterval: frameInterval,
      // scale attempt every X frame requests => every 2 seconds
      scaleAttemptFrequency: Math.round(2000 / frameInterval),
      // request - response counter difference to scale down at
      scaleDownAt: index === 0 ? 2 : scaleDownAtValues[index - 1],
      // request - response counter difference to scale up at
      scaleUpAt: index === (frameIntervalStepCount - 1) ? -1 : Math.round(200 / frameInterval),
    }
  });

  // Creates a vector of evenly spaced points in an interval [min, max]. https://gist.github.com/joates/6584908
  function linspace(min, max, count) {
    if (typeof count === "undefined") count = Math.max(Math.round(max - min) + 1, 1);
    if (count < 2) {
      return count === 1 ? [min] : [];
    }
    let i, ret = Array(count);
    count--;
    for (i = count; i >= 0; i--) {
      ret[i] = (i * max + (count - i) * min) / count;
    }
    return ret;
  }

  function initControlSocket(endpoint, logCallback, timeOut) {
    let checkStatusIntervalId;
    controlSocket = new WebSocket(endpoint + '&path=control');

    controlSocket.onopen = function () {
      logCallback(state, '[Control] Socket opened!');
      checkStatusIntervalId = setInterval(checkStatus, 2000);
    };

    controlSocket.onmessage = function (evt) {
      const receivedMsg = evt.data;
      state = 'connected';
      logCallback(state, '[Control] Message received: ' + receivedMsg);
    };

    controlSocket.onclose = function () {
      state = 'disconnected';
      logCallback(state, '[Control] Connection is closed');
      clearInterval(checkStatusIntervalId);
      setTimeout(function () {
        initControlSocket(endpoint, logCallback, timeOut);
      }, timeOut); // try to reconnect in 1 seconds
    };

    controlSocket.onerror = function () {
      state = 'disconnected';
      logCallback(state, '[Control] Connection error');
      clearInterval(checkStatusIntervalId);
    };

    function checkStatus() {
      const action = {
        message: 'StatusMessage',
        parameters: {},
      };
      // can't use sendControlMessage here since the reply from this message
      // is what confirms the connected state
      controlSocket.send(JSON.stringify(action));
    }
  }

  function sendControlMessage(message) {
    if (controlSocket && state === 'connected') {
      controlSocket.send(JSON.stringify(message));
    }
  }

  function initVideoSocket(endpoint, logCallback) {
    videoSocket = new WebSocket(endpoint + '&path=video');
    videoSocket.binaryType = 'arraybuffer';

    videoSocket.onopen = function () {
      logCallback(state, '[Video] Starting streaming');
      videoSocket.send('ack');
      frameCounters.requestResponseDiff++;

      initFrameRequestInterval(initialFpsIntervalStepIndex);
    };

    videoSocket.onmessage = function (evt) {
      frameCounters.requestResponseDiff--;
      const receivedMsg = evt.data;
      const arrayBufferView = new Uint8Array(receivedMsg);
      const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
      const urlCreator = window.URL || window.webkitURL;
      imgContent.src = urlCreator.createObjectURL(blob);
    };

    videoSocket.onclose = function () {
      clearInterval(frameRequestIntervalId);
      logCallback(state, '[Video] Connection is closed');
    };

    videoSocket.onerror = function () {
      clearInterval(frameRequestIntervalId);
      logCallback(state, '[Video] Connection error');
    };
  }

  function initFrameRequestInterval(intervalIndex) {
    const currentIntervalStep = frameIntervalSteps[intervalIndex];

    if (frameRequestIntervalId) {
      clearInterval(frameRequestIntervalId);
      frameCounters.intervalCounter = 0;
    }

    frameRequestIntervalId = setInterval(() => {
      const counterDiff = frameCounters.requestResponseDiff;
      frameCounters.intervalCounter++;

      // only attempt scaling fps at certain intervals
      if (frameCounters.intervalCounter % currentIntervalStep.scaleAttemptFrequency === 0) {

        // scale fps if necessary
        if (counterDiff <= currentIntervalStep.scaleUpAt) {
          initFrameRequestInterval(intervalIndex + 1);
        } else if (intervalIndex !== 0 && counterDiff >= currentIntervalStep.scaleDownAt) {
          initFrameRequestInterval(intervalIndex - 1);
        }
      }

      // don't ask for new frames if responses are starting to fall behind too much
      if (counterDiff <= currentIntervalStep.scaleDownAt) {
        videoSocket.send('ack');
        frameCounters.requestResponseDiff++;
      }
    }, currentIntervalStep.frameInterval);
  }

  function onMouseDown(event) {
    event.preventDefault();
    addTouchListeners();
    const x = event.offsetX * scaleX;
    const y = event.offsetY * scaleY;
    const ratio = this.clientWidth / this.clientHeight;

    sendControlMessage({
      message: 'TouchDownMessage',
      parameters: { x: x, y: y, pointer: 1, pressure: 100, frame_ratio: ratio },
    });
  }

  function onMouseMove(event) {
    const x = event.offsetX * scaleX;
    const y = event.offsetY * scaleY;
    const ratio = canvas.clientWidth / canvas.clientHeight;

    sendControlMessage({
      message: 'TouchMoveMessage',
      parameters: { x: x, y: y, pointer: 1, pressure: 100, frame_ratio: ratio },
    });
  }

  function onMouseUp() {
    removeTouchListeners();
    sendControlMessage({
      message: 'TouchUpMessage',
      parameters: { pointer: 1 },
    });
  }

  function onMouseLeave() {
    removeTouchListeners();
    sendControlMessage({
      message: 'TouchUpMessage',
      parameters: { pointer: 1 },
    });
  }

  function removeTouchListeners() {
    canvas.removeEventListener('mouseleave', onMouseLeave);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
  }

  function addTouchListeners() {
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
  }

  function addListeners() {
    canvas.addEventListener('dragstart', function (event) {
      event.preventDefault();
    });

    canvas.addEventListener('mousedown', onMouseDown);

    homeBtn.addEventListener('click', function () {
      sendControlMessage({
        message: 'HomeScreenMessage',
        parameters: {},
      });
    });
  }

  function sendKey(keycode) {
    sendControlMessage({
      message: 'KeyEventMessage',
      parameters: { keycode: keycode },
    });
  }

  function trackSpecialChars(e) {
    // handle special char events
    if ([8, 9, 13, 27, 32].includes(e.which)) {
      e.preventDefault();
      sendKey(e.which);
    }
  }

  function trackKeyChars(e) {
    e.preventDefault();
    sendKey(e.which);
  }

  function createElements(elementId, dimensions) {
    const container = document.getElementById(elementId);
    homeBtn = document.createElement('button');
    homeBtn.innerHTML = 'Home';
    homeBtn.setAttribute('style', 'margin: 20px auto; display: block;')
    container.appendChild(homeBtn);

    canvas = document.createElement('canvas');
    canvas.width = dimensions.x;
    canvas.height = dimensions.y;
    canvas.setAttribute(
      'style', 'margin: 20px auto; display: block; box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.5), 0 4px 20px 0 rgba(0, 0, 0, 0.5)'
    );
    container.appendChild(canvas);

    imgContent = new Image();
    imgContent.onload = function () {
      // stretch the image to fit the canvas
      canvas.getContext('2d').drawImage(imgContent, 0, 0, dimensions.x, dimensions.y);
    };
  }

  function toggleKeyboard(switchOn) {
    // to control when we want to switch user input on/off
    if (switchOn) {
      document.addEventListener('keypress', trackKeyChars);
      document.addEventListener('keydown', trackSpecialChars);
    } else {
      document.removeEventListener('keypress', trackKeyChars);
      document.removeEventListener('keydown', trackSpecialChars);
    }
  }

  function sendSingleChar() {
    // time input for paste to prevent typing while chars copied in
    if (text.length > 0) {
      sendKey(text.splice(0, 1)[0].charCodeAt(0));
      setTimeout(sendSingleChar.bind(this), textPause);
    } else {
      toggleKeyboard(true);
    }
  }

  function dataURItoBlob() { // thanks to http://stackoverflow.com/a/5100158 for this algo
    // convert base64/URLEncoded data component to raw binary data held in a string
    const dataURI = canvas.toDataURL('image/jpeg', 0.5);
    let byteString = '';
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  return {
    mount: function (settings) {
      textPause = textPause || settings.textPause;
      // if device resolution is not specified, set scaling to 1
      const deviceResolution = settings.deviceResolution || settings.dimensions;
      scaleX = deviceResolution.x / settings.dimensions.x;
      scaleY = deviceResolution.y / settings.dimensions.y;
      createElements(settings.elementId, settings.dimensions);
      initControlSocket(settings.endpoint, settings.logCallback, settings.timeOut);
      initVideoSocket(settings.endpoint, settings.logCallback);
      toggleKeyboard(true);
      addListeners();
    },
    takeScreenshot() { // to be called from beak and returns last screenshot taken
      return dataURItoBlob();
    },
    toggleKeyboardListener(switchOn) { // to control when we want to switch user input on/off
      toggleKeyboard(switchOn);
    },
    sendText(inputText) { // called by beak with all text
      text = inputText.split('');
      toggleKeyboard(false);
      sendSingleChar();
    },
  };
}

module.exports = Farmer;
