import React from 'react';
import { Container } from 'semantic-ui-react';
import './styles.css';
import Navbar from '../../features/nav/Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  
  return (
    <>

      <Route exact path='/' component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <>
          <Navbar />
          <Container style={{ marginTop: '7em' }}>
            <Route exact path='/activities/' component={ActivityDashboard} />
            <Route exact path='/activities/:id' component={ActivityDetails} />
            <Route exact
              key={location.key}
              path={['/createActivity', '/manage/:id']}
              component={ActivityForm} />
          </Container>
        </>
      )} />

    </>
  );
}



export default withRouter(observer(App));
