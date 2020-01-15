import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import './styles.css';
import { IActivity } from '../models/activity';
import Navbar from '../../features/nav/Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from '../layout/LoadingComponent';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setIsEditing(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setIsEditing(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setIsEditing(false);
    });
  };

  const handleEditActivity = (activity: IActivity) => {
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id),
        activity]);
      setSelectedActivity(activity);
      setIsEditing(false);
    })
  };

  const handleDeleteActivity = (id: string) => {
    agent.Activities.delete(id).then( () => {
      setActivities([...activities.filter(a => a.id !== id)]);
    })
  }

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        let activities: IActivity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        });

        setActivities(activities);
      })
      .then(() => setIsLoading(false))
  }, []);

  if (isLoading) return <LoadingComponent content='Loading activities...' />

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
