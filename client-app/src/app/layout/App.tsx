import React, { useState, useEffect } from 'react';
import { Header, Icon, List, Container } from 'semantic-ui-react';
import './styles.css';
import axios from 'axios';
import { IActivity } from '../models/activity';
import Navbar from '../../features/nav/Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityList from '../../features/activities/dashboard/ActivityList';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setIsEditing(true);
  }

  useEffect(() => {
    axios
      .get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response) => {
        setActivities(response.data);
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
          setSelectedActivity={setSelectedActivity} />
      </Container>
    </>
  );
}



export default App;
