import { observable, action, computed, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity, IActivityFormValues } from '../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore} from './rootStore';


export default class ActivityStore {
   rootStore: RootStore;
   constructor(rootStore: RootStore) {
      this.rootStore = rootStore;
   }

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
         (a, b) => a.date.getTime() - b.date.getTime());

      return Object.entries(sortedActivities.reduce((activities, activity) => {
         const date = activity.date.toISOString().split('T')[0];
         activities[date] = activities[date] ? [...activities[date], activity] : [activity];
         return activities;
      }, {} as { [key: string]: IActivity[] }));

   }

   @action loadActivities = async () => {
      this.loadingInitial = true;
      try {
         const activities = await agent.Activities.list();
         runInAction('loading activities', () => {
            activities.forEach(activity => {
               activity.date = new Date(activity.date);
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
         return activity;
      } else {
         // couldn't retrieve activity from local registry, so retrieve from api
         this.loadingInitial = true;
         try {
            activity = await agent.Activities.details(id);
            runInAction('getting activity', () => {
               activity.date = new Date(activity.date);
               this.activity = activity;
               this.activityRegistry.set(activity.id, activity);
               this.loadingInitial = false;
            })
            return activity;
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
         });
         history.push(`/activities/${activity.id}`);
      } catch (error) {
         runInAction('error creating activity', () => {
            this.isSubmitting = false;
         });
         toast.error('Problem submitting data');
         console.log(error.response);
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
         history.push(`/activities/${activity.id}`);
      } catch (error) {
         runInAction('error editing activity', () => {
            this.isSubmitting = false;
         });
         toast.error('Problem submitting data');
         console.log(error.response);
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
         });
      } catch (error) {
         runInAction('deleting activity', () => {
            this.isSubmitting = false;
            this.target = '';
         });
         console.log(error);
      }
   };

}


export class ActivityFormValues implements IActivityFormValues {
   id?: string = undefined;
   title?: string = '';
   description?: string = '';
   city?: string = '';
   category?: string = '';
   date?: Date = undefined;
   time?: Date = undefined;
   venue?: string = '';

   constructor(init?: IActivityFormValues) {
      if (init && init.date) {
         init.time = init.date;
      }
      Object.assign(this, init);

   }
}