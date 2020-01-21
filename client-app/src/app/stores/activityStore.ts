import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
   @observable activityRegistry = new Map();
   @observable activity: IActivity | null = null;
   @observable loadingInitial = false;
   @observable isSubmitting = false;
   @observable target = '';

   @computed get activitiesByDate() {
      return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
   };

   groupActivitiesByDate(activities: IActivity[]) {
      const sortedActivities = activities.sort(
         (a, b) => Date.parse(a.date) - Date.parse(b.date));
      
      return Object.entries(sortedActivities.reduce((activities, activity) => {
         const date = activity.date.split('T')[0];
         activities[date] = activities[date] ? [...activities[date], activity]: [activity];
         return activities;
      }, {} as {[key: string] : IActivity[]}));

   }

   @action loadActivities = async () => {
      this.loadingInitial = true;
      try {
         const activities = await agent.Activities.list();
         runInAction('loading activities', () => {
            activities.forEach(activity => {
               activity.date = activity.date.split('.')[0];
               this.activityRegistry.set(activity.id, activity);
               this.loadingInitial = false;
            });
         });
         
      } catch (error) {
         runInAction('load activities error', () => this.loadingInitial = false);
         console.log(error);
      }
   };

   @action loadActivity = async (id: string) => {
      let activity = this.getActivityFromRegistry(id);
      if (activity) {
         this.activity = activity;
      } else {
         // couldn't retrieve activity from registry, try retrieving from api
         this.loadingInitial = true;
         try {
            activity = await agent.Activities.details(id);
            runInAction('getting activity', () => {
               this.activity = activity;
               this.loadingInitial = false;
            })
         } catch (error) {
            runInAction('error getting activity', () => this.loadingInitial = false);
            console.log(error);
         }
      }
   }

   @action clearActivity = () => {
      this.activity = null;
   }

   getActivityFromRegistry = (id: string) => {
      return this.activityRegistry.get(id);
   }

   @action selectActivity = (id: string) => {
      this.activity = this.activityRegistry.get(id);
   };

   @action createActivity = async (activity: IActivity) => {
      this.isSubmitting = true;
      try {
         await agent.Activities.create(activity);
         runInAction('creating activity', () => {
            this.activityRegistry.set(activity.id, activity);
            this.isSubmitting = false;
         })
      } catch (error) {
         console.log(error);
         runInAction('error creating activity', () => {
            this.isSubmitting = false;
         })
      }
   };

   @action editActivity = async (activity: IActivity) => {
      this.isSubmitting = true;
      try {
         await agent.Activities.update(activity);
         runInAction('editing activity', () => {
            this.activityRegistry.set(activity.id, activity);
            this.activity = activity;
            this.isSubmitting = false;
         });
      } catch (error) {
         runInAction('error editing activity', () => {
            this.isSubmitting = false;
         });
         console.log(error);
      }
   };

   @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
      this.isSubmitting = true;
      this.target = event.currentTarget.name;
      try {
         await agent.Activities.delete(id);
         runInAction('deleting activity', () => {
            this.activityRegistry.delete(id);
            this.isSubmitting = false;
            this.target = '';
         })
      } catch (error) {
         runInAction('deleting activity', () => {
            this.isSubmitting = false;
            this.target = '';
         })
         console.log(error);
      }
   };

}

export default createContext(new ActivityStore());