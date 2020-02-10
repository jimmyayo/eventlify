import React from 'react'
import { Form as FinalForm, Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { Button, Form } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { IProfile } from '../../app/models/profile';

const validate = combineValidators({
   displayName: isRequired('displayName')
});

interface IProps {
   profile: IProfile;
   updateProfile: (profile: IProfile) => void;
}

const ProfileEditForm : React.FC<IProps> = ({profile, updateProfile}) => {

   return (
      <FinalForm
         validate={validate}
         onSubmit={updateProfile}
         initialValues={profile}
         render={(
            {
               handleSubmit,
               invalid,
               pristine,
               submitting
            }
         ) => (
               <Form onSubmit={handleSubmit} error>
                  <Field
                     name='displayName'
                     component={TextInput}
                     value={profile!.displayName}
                     placeholder='Display name'
                  />
                  <Field
                     name='bio'
                     value={profile!.bio}
                     component={TextAreaInput}
                     placeholder='Bio'
                     rows={4}
                  />
                  <Button
                     fluid
                     disabled={(invalid || pristine)}
                     positive
                     loading={submitting}
                     content='Save Profile' />
               </Form>
            )}
      >

      </FinalForm>
   )
}

export default observer(ProfileEditForm);
