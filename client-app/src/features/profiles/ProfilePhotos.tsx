import React, { useContext, useState } from 'react';
import { Tab, Header, Card, Image, Button, Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const ProfilePhotos = () => {

   const rootStore = useContext(RootStoreContext);
   const { profile, isCurrentUser } = rootStore.profileStore;

   const [isAddPhotoMode, setIsAddPhotoMode] = useState(false);

   return (
      <Tab.Pane>
         <Grid>
            <Grid.Column width={16} style={{ paddingBottom: 0 }} >
               <Header floated='left' icon='image' content='Photos' />
               {isCurrentUser &&
                  <Button 
                     floated='right' 
                     basic 
                     content={isAddPhotoMode ? 'Cancel' : 'Add Photo'}
                     onClick={() => setIsAddPhotoMode(!isAddPhotoMode)} />
               }
            </Grid.Column>
            <Grid.Column width={16}>
               {isAddPhotoMode ? (
                  <p>Photo Widget goes here</p>
               )
                  :
                  (
                     <Card.Group itemsPerRow={5}>
                        {profile && profile.photos.map(photo => (
                           <Card key={photo.id}>
                              <Image src={photo.url} />
                              {isCurrentUser && (
                                 <Button.Group fluid widths={2}>
                                    <Button basic positive content='Main' />
                                    <Button basic negative icon='trash' />
                                 </Button.Group>
                              )}
                           </Card>
                        ))}
                     </Card.Group>
                  )
               }
            </Grid.Column>
         </Grid>


      </Tab.Pane>
   )
}

export default ProfilePhotos