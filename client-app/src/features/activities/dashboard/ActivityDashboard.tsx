import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';


const ActivityDashboard = () => {
   const activityStore = useContext(ActivityStore);
   const { isEditing, selectedActivity } = activityStore;

   return (
      <Grid>
         <Grid.Column width={10}>
            <ActivityList />
         </Grid.Column>
         <Grid.Column width={6}>
            {selectedActivity && !isEditing &&
               <ActivityDetails />
            }
            {isEditing &&
               <ActivityForm
                  key={(selectedActivity && selectedActivity.id) || 0}
                  selectedActivity={selectedActivity!}
               />}
         </Grid.Column>
      </Grid>
   )
}

export default observer(ActivityDashboard);
