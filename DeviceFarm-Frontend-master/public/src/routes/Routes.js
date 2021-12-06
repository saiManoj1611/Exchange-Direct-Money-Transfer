import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import SignIn from '../components/signin';
import SignUp from '../components/signup';
import NavBar from '../components/navbar';
import ManagerProjects from '../components/manager/projects';
import ManagerBilling from '../components/manager/billing';
import ManagerBills from '../components/manager/bills';
import TestersOfProject from '../components/manager/testers';
import TesterProjects from '../components/tester/projects';
import TesterProjectDashboard from '../components/tester/testerProjectDashboard';
import ManagerProjectDashboard from '../components/manager/projectDashboard';
import Bugs from '../components/tester/bugs';
import AdminProjects from '../components/admin/projects';
import AdminBilling from '../components/admin/billing';
import AdminUsers from '../components/admin/users';
import AdminBills from '../components/admin/bills';
import CreateRun from '../components/tester/realdevices/CreateRun';
import RemoteAccessSession from '../components/tester/emulators/RemoteAccessSession';
import ViewTests from '../components/tester/tests';
import Profile from '../components/tester/profile';

class Routes extends Component {
  render() {
    return (
      <div>
        <Route path="/" component={NavBar} />
        <Route path="/signin" component={SignIn} exact />
        <Route path="/signup" component={SignUp} exact />

        <Route path="/manager/projects" exact component={ManagerProjects} />
        <Route path="/manager/billing" exact component={ManagerBilling} />
        <Route path="/manager/viewbills" exact component={ManagerBills} />
        <Route path="/project/:id/testers" exact component={TestersOfProject} />

        <Route path="/tester/projects" exact component={TesterProjects} exact />
        <Route path="/project/:id/dashboard" exact component={TesterProjectDashboard} />
        <Route path="/manager/project/:id/dashboard" exact component={ManagerProjectDashboard} />
        <Route path="/tester/:testerId/project/:id/bugs" exact component={Bugs} />
        <Route path="/admin/projects" exact component={AdminProjects} />
        <Route path="/admin/billing" exact component={AdminBilling} />
        <Route path="/admin/viewbills" exact component={AdminBills} />
        <Route path="/admin/users" exact component={AdminUsers} />
        <Route path="/admin/project/:id/dashboard" exact component={ManagerProjectDashboard} />
        <Route path="/project/:id/createRun" exact component={CreateRun} />
        <Route path="/project/:id/tests" exact component={ViewTests} />
        <Route path="/project/:projectId/remoteAccessSession/:id" exact component={RemoteAccessSession} />
        <Route path="/tester/:testerId/project/:projectId/real_devices/create_run" exact component={CreateRun} />
        <Route path="/tester/:id/profile" exact component={Profile} />
      </div>
    );
  }
}

export default Routes;
