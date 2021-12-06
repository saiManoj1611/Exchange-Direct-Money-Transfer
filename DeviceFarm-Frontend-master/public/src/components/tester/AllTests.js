import React from 'react';
import EmulatorTests from './EmulatorTests';
import Tests from './tests';

function AllTests(props) {
  return (
    <div>
      <br/>
      <br/>
      <Tests project={props.project} />
      <EmulatorTests project={props.project._id} tester={props.tester}/>
    </div>
  );
}

export default AllTests;