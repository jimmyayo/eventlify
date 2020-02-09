import React, { useContext, useState } from 'react';
import { Tab, Grid, Header, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import ProfileEditForm from './ProfileEditForm';
import { IProfile } from '../../app/models/profile';
import LoadingComponent from '../../app/layout/LoadingComponent';

const ProfileDescription = () => {
   const rootStore = useContext(RootStoreContext);
   const { profile, isCurrentUser, isSaving, updateProfile } = rootStore.profileStore;

   const [isEditMode, setisEditMode] = useState(false);

   const handleUpdate = (profile: IProfile) => {
      updateProfile(profile);
      setisEditMode(false);
   }

   if (isSaving) return <LoadingComponent content='Saving profile...' />

   return (
      <Tab.Pane>
         <Grid>
            <Grid.Column width={16} style={{ paddingBottom: 0 }} >
               <Header floated='left' icon='user' content={`About ${profile!.displayName}`} />
               {
                  isCurrentUser &&
                  (
                     <Button
                        floated='right'
                        basic
                        content={isEditMode ? 'Cancel' : 'Edit Profile'}
                        onClick={() => setisEditMode(!isEditMode)}
                     />
                  )
               }
            </Grid.Column>
            <Grid.Column width={16}>
               {
                  !isEditMode ?
                     <p>{profile?.bio}</p>
                     :
                     <ProfileEditForm profile={profile!} updateProfile={handleUpdate} />
               }

            </Grid.Column>
         </Grid>
      </Tab.Pane>
   )
}

export default observer(ProfileDescription);
