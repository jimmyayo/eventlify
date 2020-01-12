import React, { useState, FormEvent } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';

interface IProps {
   setIsEditing: (isEditing: boolean) => void;
   selectedActivity: IActivity;
}


const ActivityForm: React.FC<IProps> = ({ setIsEditing, selectedActivity }) => {

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
      console.log(activity);
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
               type='date'
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
            <Button floated='right' positive type='submit' content='Submit' />
            <Button onClick={() => setIsEditing(false)} floated='right' type='button' content='Cancel' />
         </Form>
      </Segment>
   )
}

export default ActivityForm
