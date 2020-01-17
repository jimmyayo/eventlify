import React, { useState, FormEvent, useContext } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

interface IProps {
   selectedActivity: IActivity;
}


const ActivityForm: React.FC<IProps> =
   ({ selectedActivity }) => {

      const activityStore = useContext(ActivityStore);
      const { createActivity, editActivity, isSubmitting, cancelEditOpen } = activityStore;

      // returns the selected activity prop, or an empty activity object if null was passed down
      const initializeForm = () => {
         if (selectedActivity) {
            return selectedActivity;
         } else {
            return {
               id: '',
               title: '',
               description: '',
               city: '',
               category: '',
               date: '',
               venue: ''
            }
         }
      }

      const [activity, setActivity] = useState<IActivity>(initializeForm);

      const handleInputChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
         const { name, value } = e.currentTarget;
         setActivity({ ...activity, [name]: value });
      };

      const handleSubmit = () => {
         if (activity.id.length === 0) {
            let newActivity: IActivity = { ...activity, id: uuid() };
            createActivity(newActivity);
         } else {
            editActivity(activity);
         }

      };

      return (
         <Segment clearing>
            <Form onSubmit={handleSubmit}>
               <Form.Input
                  onChange={handleInputChange}
                  placeholder='Title'
                  name='title'
                  value={activity.title} />
               <Form.TextArea
                  onChange={handleInputChange}
                  rows={2}
                  placeholder='Description'
                  name='description'
                  value={activity.description} />
               <Form.Input
                  onChange={handleInputChange}
                  placeholder='Category'
                  name='category'
                  value={activity.category} />
               <Form.Input
                  onChange={handleInputChange}
                  type='datetime-local'
                  placeholder='Date'
                  name='date'
                  value={activity.date} />
               <Form.Input
                  onChange={handleInputChange}
                  placeholder='City'
                  name='city'
                  value={activity.city} />
               <Form.Input
                  onChange={handleInputChange}
                  placeholder='Venue'
                  name='venue'
                  value={activity.venue} />
               <Button floated='right' positive type='submit' content='Submit' loading={isSubmitting} />
               <Button onClick={() => cancelEditOpen()} floated='right' type='button' content='Cancel' />
            </Form>
         </Segment>
      )
   }

export default observer(ActivityForm);
