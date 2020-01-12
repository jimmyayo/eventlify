import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import './styles.css';
import axios from 'axios';
import { IActivity } from '../models/activity';
import Navbar from '../../features/nav/Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setIsEditing(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setIsEditing(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setIsEditing(false);
  }

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id),
      activity]);
    setSelectedActivity(activity);
    setIsEditing(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)]);
  }

  useEffect(() => {
    axios
      .get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response) => {
        let activities: IActivity[] = [];
        response.data.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        });

        setActivities(activities);
      })
  }, []);

  return (
    <>
      <Navbar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard 
          activities={activities} 
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity} />
      </Container>
    </>
  );
}



export default App;
