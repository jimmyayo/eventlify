import React, { useContext, useState } from 'react';
import { Tab, Header, Card, Image, Button, Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import PhotoUploadWidget from '../../app/common/photoUpload/PhotoUploadWidget';
import { observer } from 'mobx-react-lite';

const ProfilePhotos = () => {

   const rootStore = useContext(RootStoreContext);
   const { profile, isCurrentUser, uploadPhoto, isUploading,
      setMainPhoto, isLoading, isDeleting, deletePhoto } = rootStore.profileStore;

   const [isAddPhotoMode, setIsAddPhotoMode] = useState(false);
   const [target, setTarget] = useState<string | undefined>(undefined);
   const [deleteTarget, setDeleteTarget] = useState<string | undefined>(undefined);

   const handleUploadImage = (photo: Blob) => {
      uploadPhoto(photo)
         .then(() => setIsAddPhotoMode(false));
   }

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
                  <PhotoUploadWidget uploadPhoto={handleUploadImage} isLoading={isUploading} />
               )
                  :
                  (
                     <Card.Group itemsPerRow={5}>
                        {profile && profile.photos.map(photo => (
                           <Card key={photo.id}>
                              <Image src={photo.url} />
                              {isCurrentUser && (
                                 <Button.Group fluid widths={2}>
                                    <Button
                                       basic
                                       positive
                                       content='Main'
                                       loading={isLoading && target === photo.id}
                                       onClick={(e) => {
                                          setMainPhoto(photo);
                                          setTarget(e.currentTarget.name)
                                       }}
                                       disabled={photo.isMain}
                                       name={photo.id} />
                                    <Button
                                       basic
                                       negative
                                       icon='trash'
                                       loading={isDeleting && deleteTarget === photo.id}
                                       onClick={(e) => {
                                          deletePhoto(photo);
                                          setDeleteTarget(e.currentTarget.name)
                                       }}
                                       disabled={photo.isMain}
                                       name={photo.id} />
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

export default observer(ProfilePhotos);
