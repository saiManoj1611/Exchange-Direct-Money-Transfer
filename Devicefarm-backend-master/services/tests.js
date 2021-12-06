let {OnDemandDevice} = require('../db/schema/onDemandDevice');
let {Test} = require('../db/schema/test');

module.exports.getTests = (req,resp) => {
  Test.find(req.query).then(tests =>{
    resp.json({tests: tests})
  });
}
module.exports.createTest = (req,resp) => {
  let test = new Test(req.body); 
  test.save().then(_ => {
    resp.json({success: true})
  }).catch(e => {throw(e)})
}
module.exports.updateStatus = async (req,resp) => {
  let test = await Test.findById(req.params.id);
  test.status = req.body.status
  test.save().then(_ =>{
    resp.json({test: test});
  })
}
