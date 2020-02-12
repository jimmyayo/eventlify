import {RootStore }from './rootStore';
import { observable, action, runInAction, computed, reaction } from 'mobx';
import { IProfile, IPhoto, IUserActivity } from '../models/profile';
import agent from '../api/agent';
import { toast } from 'react-toastify';


export default class ProfileStore {
   rootStore: RootStore;

   constructor(rootStore: RootStore) {
      this.rootStore = rootStore;

      reaction(() => this.activeTab,
      activeTab => {
         if (activeTab === 3 || activeTab === 4) {
            const predicate = activeTab === 3 ? 'followers' : 'following';
            this.loadFollowings(predicate);
         } else {
            this.followings = [];
         }
      })
   }


   @observable profile: IProfile | null = null;
   @observable loadingProfile = true;
   @observable isUploading = false;
   @observable isLoading = false;
   @observable isDeleting = false;
   @observable isSaving = false;
   @observable followings: IProfile[] = [];
   @observable activeTab: number = 0;
   @observable userActivities: IUserActivity[] = [];
   @observable isLoadingActivities = false;

   @computed get isCurrentUser() {
      if (this.rootStore.userStore.user && this.profile) {
         return this.rootStore.userStore.user.userName === this.profile.userName;
      }
      return false;
   }

   @action loadUserActivities = async (username: string, predicate?: string) => {
      this.isLoadingActivities = true;
      try {
         const activities = await agent.Profiles.listActivities(username, predicate!);
         runInAction(() => {
            this.userActivities = activities;
            this.isLoadingActivities = false;
         })
      } catch (error) {
         toast.error('Problem loading user activities');
         runInAction(() => {
            this.isLoadingActivities = false;
         })
      }
   }

   @action setActiveTab = (activeIndex: number) => {
      this.activeTab = activeIndex;
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

   @action updateProfile = async (profile: Partial<IProfile>) => {
      this.isSaving = true;
      try {
         await agent.Profiles.updateProfile(profile);
         runInAction(() => {
            if (profile.displayName !==  this.rootStore.userStore.user!.displayName) {
               this.rootStore.userStore.user!.displayName = profile.displayName!;
            }
            this.isSaving = false;
            this.profile = {...this.profile!, ...profile};
         })
      } catch (error) {
         runInAction(() => {
            this.isSaving = false;
         });
         toast.error('There was a problem saving your profile.');
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

   @action deletePhoto = async (photo: IPhoto) => {
      this.isDeleting = true;
      try {
         await agent.Profiles.deletePhoto(photo.id);
         runInAction(() => {
            this.profile!.photos = 
               this.profile!.photos.filter(a => a.id !== photo.id);
            this.isDeleting = false;
         })
      } catch (error) {
         toast.error('Problem deleting photo');
         runInAction(() => this.isDeleting = false);
      }
   }

   @action follow = async (username: string ) => {
      this.isLoading = true;
      try {
         await agent.Profiles.follow(username);
         runInAction(() => {
            this.profile!.following = true;
            this.profile!.followersCount ++;
            this.isLoading = false;
         })
      } catch (error) {
         toast.error('Problem following user.');
         runInAction(() => {
            this.isLoading = false;
         })
      }
   }

   @action unfollow = async (username: string ) => {
      this.isLoading = true;
      try {
         await agent.Profiles.unfollow(username);
         runInAction(() => {
            this.profile!.following = false;
            this.profile!.followersCount --;
            this.isLoading = false;
         })
      } catch (error) {
         toast.error('Problem unfollowing user.');
         runInAction(() => {
            this.isLoading = false;
         })
      }
   }

   @action loadFollowings = async (predicate: string) => {
      this.isLoading = true;
      try {
         const profiles = await agent.Profiles.listFollowings(this.profile!.userName, predicate);
         runInAction(() => {
            this.followings = profiles;
            this.isLoading = false;
         })
      } catch (error) {
         toast.error('Problem loading followers.');
         runInAction(() => {
            this.isLoading = false;
         })
      }
   }
}