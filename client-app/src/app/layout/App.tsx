import React, { useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import './styles.css';
import Navbar from '../../features/nav/Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps, Switch } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from '../layout/NotFound';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from '../layout/PrivateRoute';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, appLoaded, token } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      //getUser();
      setAppLoaded();
    }
  },
    [getUser, setAppLoaded, token]);


  if (!appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <>
      <ModalContainer />

      <Route exact path='/' component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <>
          <ToastContainer position='bottom-right' />
          <Navbar />
          <Container style={{ marginTop: '7em' }}>
            <Switch>
              <PrivateRoute exact path='/activities/' component={ActivityDashboard} />
              <PrivateRoute exact path='/activities/:id' component={ActivityDetails} />
              <PrivateRoute exact
                key={location.key}
                path={['/createActivity', '/manage/:id']}
                component={ActivityForm} />
              {/* <Route exact path='/login' component={LoginForm} /> */}
              <PrivateRoute exact path='/profile/:username' component={ProfilePage} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </>
      )} />

    </>
  );
}



export default withRouter(observer(App));
