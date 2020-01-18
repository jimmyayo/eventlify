import React, { useContext } from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';


const ActivityList = () => {
   const activityStore = useContext(ActivityStore);
   const { activitiesByDate, selectActivity, deleteActivity, isSubmitting, target } = activityStore;
   return (
      <Segment clearing>
         <Item.Group divided>
            {activitiesByDate.map(activity => (
               <Item key={activity.id}>
                  <Item.Content>
                     <Item.Header as='a'>{activity.title}</Item.Header>
                     <Item.Meta>{activity.date}</Item.Meta>
                     <Item.Description>
                        <div>{activity.description}</div>
                        <div>{activity.city}, {activity.venue}</div>
                     </Item.Description>
                     <Item.Extra>
                        <Button
                           as={Link} to={`/activities/${activity.id}`}
                           floated='right'
                           content='View'
                           color='blue'
                        />
                        <Button
                           name={activity.id}
                           floated='right'
                           content='Delete'
                           color='red'
                           onClick={(e) => deleteActivity(e, activity.id)}
                           loading={target === activity.id && isSubmitting} />
                        <Label basic content={activity.category} />
                     </Item.Extra>
                  </Item.Content>
               </Item>
            ))}
         </Item.Group>
      </Segment>
   )
}

export default observer(ActivityList);
