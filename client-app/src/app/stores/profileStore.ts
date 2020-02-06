import {RootStore }from './rootStore';
import { observable, action, runInAction, computed } from 'mobx';
import { IProfile, IPhoto } from '../models/profile';
import agent from '../api/agent';
import { toast } from 'react-toastify';


export default class ProfileStore {
   rootStore: RootStore;

   constructor(rootStore: RootStore) {
      this.rootStore = rootStore;
   }


   @observable profile: IProfile | null = null;
   @observable loadingProfile = true;
   @observable isUploading = false;
   @observable isLoading = false;

   @computed get isCurrentUser() {
      if (this.rootStore.userStore.user && this.profile) {
         return this.rootStore.userStore.user.userName === this.profile.userName;
      }
      return false;
   }
   @action loadProfile = async (username: string) => {
      this.loadingProfile = true;
      try {
         const profile = await agent.Profiles.get(username);
         runInAction(() => {
            this.profile = profile;
            this.loadingProfile = false;
         })
      } catch (error) {
         runInAction(() => {
            this.loadingProfile = false;
            console.log(error);
         })
      }
   }

   @action uploadPhoto = async (file: Blob) => {
      this.isUploading = true;
      try {
         const photo = await agent.Profiles.uploadPhoto(file);
         runInAction(() => {
            if (this.profile) {
               this.profile.photos.push(photo);
               if (photo.isMain && this.rootStore.userStore.user) {
                  this.rootStore.userStore.user.image = photo.url;
                  this.profile.image = photo.url;
               }
            }
            this.isUploading = false;
         })
      } catch (error) {
         console.log(error);
         toast.error('Problem uploading photo');
         runInAction(() => this.isUploading = false);
      }
   }

   @action setMainPhoto = async (photo: IPhoto) => {
      this.isLoading = true;
      try {
         await agent.Profiles.setMainPhoto(photo.id);
         runInAction(() => {
            this.rootStore.userStore.user!.image = photo.url;
            this.profile!.photos.find(a => a.isMain)!.isMain = false;
            this.profile!.photos.find(a => a.id === photo.id )!.isMain = true;
            this.profile!.image = photo.url;
            this.isLoading = false;
         })
      } catch (error) {
         console.log(error);
         toast.error('Problem setting photo as main');
         runInAction(() => this.isLoading = false);
         
      }
   }
}