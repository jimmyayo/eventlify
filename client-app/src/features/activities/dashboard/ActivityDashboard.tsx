import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface IProps {
   activities: IActivity[],
   selectActivity: (id: string) => void;
   selectedActivity: IActivity | null;
   isEditing: boolean;
   setIsEditing: (isEditing: boolean) => void;
   setSelectedActivity: (activity: IActivity | null) => void;
}

const ActivityDashboard: React.FC<IProps> = 
      ({ activities, 
         selectActivity, 
         selectedActivity,
         isEditing,
         setIsEditing,
         setSelectedActivity }) => {
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
                  setIsEditing={setIsEditing}
                  selectedActivity={selectedActivity!} />} 
         </Grid.Column>
      </Grid>
   )
}

export default ActivityDashboard;
