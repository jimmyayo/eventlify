import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import { category } from '../../../features/activities/form/options/categoryOptions';

interface DetailParams {
   id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
   const activityStore = useContext(ActivityStore);
   const {
      createActivity,
      editActivity,
      loadActivity,
      isSubmitting,
      clearActivity,
      activity: initialFormState
   } = activityStore;


   const [activity, setActivity] = useState<IActivity>(
      {
         id: '',
         title: '',
         description: '',
         city: '',
         category: '',
         date: null,
         venue: ''
      }
   );

   useEffect(() => {
      if (match.params.id && activity.id.length === 0) {
         loadActivity(match.params.id).then(() =>
            initialFormState && setActivity(initialFormState))
      }
      return () => {
         clearActivity();
      }
   }, [loadActivity, clearActivity, match.params.id, initialFormState, activity.id.length]);


   // const handleSubmit = () => {
   //    if (activity.id.length === 0) {
   //       let newActivity: IActivity = { ...activity, id: uuid() };
   //       createActivity(newActivity).then(() =>
   //          history.push(`/activities/${newActivity.id}`));
   //    } else {
   //       editActivity(activity).then(() =>
   //          history.push(`/activities/${activity.id}`))
   //    }
   // };

   const handleFinalFormSubmit = (values: any) => {
      console.log(values);
   }

   return (
      <Grid>
         <Grid.Column width={10}>
            <Segment clearing>
               <FinalForm
                  onSubmit={handleFinalFormSubmit}
                  render={({ handleSubmit }) => (
                     <Form onSubmit={handleSubmit}>
                        <Field
                           placeholder='Title'
                           name='title'
                           value={activity.title}
                           component={TextInput} />
                        <Field
                           placeholder='Description'
                           name='description'
                           rows={3}
                           value={activity.description}
                           component={TextAreaInput} />
                        <Field
                           component={SelectInput}
                           placeholder='Category'
                           name='category'
                           value={activity.category}
                           options={category} />
                        <Field
                           component={DateInput}
                           placeholder='Date'
                           name='date'
                           value={activity.date!} />
                        <Field
                           component={TextInput}
                           placeholder='City'
                           name='city'
                           value={activity.city} />
                        <Field
                           component={TextInput}
                           placeholder='Venue'
                           name='venue'
                           value={activity.venue} />
                        <Button floated='right' positive type='submit' content='Submit' loading={isSubmitting} />
                        <Button onClick={() => history.push('/activities')} floated='right' type='button' content='Cancel' />
                     </Form>
                  )} />

            </Segment>
         </Grid.Column>
      </Grid>

   )
}

export default observer(ActivityForm);
