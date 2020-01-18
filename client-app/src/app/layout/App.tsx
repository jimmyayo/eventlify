import React, { useEffect, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import './styles.css';
import Navbar from '../../features/nav/Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from '../layout/LoadingComponent';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';
import { Route } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: '7em' }}>
        {/* <ActivityDashboard /> */}
        <Route exact path='/' component={HomePage} />
        <Route exact path='/activities/' component={ActivityDashboard} />
        <Route exact path='/activities/:id' component={ActivityDetails} />
        <Route exact path='/createActivity' component={ActivityForm} />
      </Container>
    </>
  );
}



export default observer(App);
