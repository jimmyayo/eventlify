import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { ActivityFormValues } from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import { category } from '../../../features/activities/form/options/categoryOptions';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';
import PlacesAutocomplete from '../../../app/common/form/PlacesAutocomplete';

const validate = combineValidators({
   title: isRequired({ message: 'Event title is required' }),
   category: isRequired('Category'),
   description: composeValidators(
      isRequired('Description'),
      hasLengthGreaterThan(4)({ message: 'Description must be at least 5 characters' })
   )(),
   city: isRequired('city'),
   venue: isRequired('Venue'),
   date: isRequired('Date'),
   time: isRequired('Time')
});

interface DetailParams {
   id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
   const rootStore = useContext(RootStoreContext);
   const {
      createActivity,
      editActivity,
      loadActivity,
      isSubmitting
   } = rootStore.activityStore;


   const [activity, setActivity] = useState(new ActivityFormValues());
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      if (match.params.id) {
         setIsLoading(true);
         loadActivity(match.params.id).then(
            (activity) => setActivity(new ActivityFormValues(activity))
         ).finally(
            () => setIsLoading(false));
      }
   }, [
      loadActivity,
      match.params.id
   ]);

   const handleFinalFormSubmit = (values: any) => {
      const dateAndTime = combineDateAndTime(values.date, values.time);
      const { date, time, ...activity } = values;
      activity.date = dateAndTime;

      if (!activity.id) {
         let newActivity = {
            ...activity,
            id: uuid()
         };
         createActivity(newActivity);
      } else {
         editActivity(activity);
      }
   }

   return (
      <Grid>
         <Grid.Column width={10}>
            <Segment clearing>
               <FinalForm
                  validate={validate}
                  initialValues={activity}
                  onSubmit={handleFinalFormSubmit}
                  render={({
                     handleSubmit,
                     invalid,
                     pristine
                  }) => (
                        <Form onSubmit={handleSubmit} loading={isLoading}>
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
                           <Form.Group widths='equal'>
                              <Field
                                 component={DateInput}
                                 placeholder='Date'
                                 name='date'
                                 date={true}
                                 value={activity.date} />
                              <Field
                                 component={DateInput}
                                 placeholder='Time'
                                 name='time'
                                 time={true}
                                 value={activity.date} />
                           </Form.Group>
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
                              
                           <Button
                              disabled={isLoading || invalid || pristine}
                              floated='right'
                              positive
                              type='submit'
                              content='Submit'
                              loading={isSubmitting} />
                           <Button
                              disabled={isLoading}
                              onClick={activity.id ?
                                 () => history.push(`/activities/${activity.id}`)
                                 :
                                 () => history.push('/activities')}
                              floated='right'
                              type='button'
                              content='Cancel' />
                        </Form>
                     )} />

            </Segment>
         </Grid.Column>
      </Grid>

   )
}

export default observer(ActivityForm);
