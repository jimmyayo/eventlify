import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import { create } from 'domain';

interface IProps {
   activities: IActivity[],
   selectActivity: (id: string) => void;
   selectedActivity: IActivity | null;
   isEditing: boolean;
   setIsEditing: (isEditing: boolean) => void;
   setSelectedActivity: (activity: IActivity | null) => void;
   createActivity: (activity: IActivity) => void;
   editActivity: (activity: IActivity) => void;
}

const ActivityDashboard: React.FC<IProps> = 
      ({ activities, 
         selectActivity, 
         selectedActivity,
         isEditing,
         setIsEditing,
         setSelectedActivity,
         createActivity,
         editActivity }) => {
   return (
      <Grid>
         <Grid.Column width={10}>
            <ActivityList 
               activities={activities} 
               selectActivity={selectActivity} />
         </Grid.Column>
         <Grid.Column width={6}>
            {selectedActivity && !isEditing && 
               <ActivityDetails 
                  activity={selectedActivity} 
                  setIsEditing={setIsEditing} 
                  setSelectedActivity={setSelectedActivity} /> }
            {isEditing && 
               <ActivityForm 
                  key={selectedActivity && selectedActivity.id || 0}
                  setIsEditing={setIsEditing}
                  selectedActivity={selectedActivity!}
                  createActivity={createActivity}
                  editActivity={editActivity} />} 
         </Grid.Column>
      </Grid>
   )
}

export default ActivityDashboard;
