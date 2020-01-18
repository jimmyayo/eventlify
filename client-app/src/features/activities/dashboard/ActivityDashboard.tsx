import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';


const ActivityDashboard = () => {
   const activityStore = useContext(ActivityStore);
   const { isEditing, activity: activity } = activityStore;

   return (
      <Grid>
         <Grid.Column width={10}>
            <ActivityList />
         </Grid.Column>
         <Grid.Column width={6}>
            <h2>Activity Filters</h2>
         </Grid.Column>
      </Grid>
   )
}

export default observer(ActivityDashboard);
