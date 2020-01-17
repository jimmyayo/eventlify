import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
   @observable activityRegistry = new Map();
   @observable activities: IActivity[] = [];
   @observable selectedActivity: IActivity | undefined;
   @observable loadingInitial = false;
   @observable isEditing = false;
   @observable isSubmitting = false;
   @observable target = '';

   @computed get activitiesByDate() {
      return Array.from(this.activityRegistry.values()).sort(
         (a, b) => Date.parse(a.date) - Date.parse(b.date));
   }

   @action loadActivities = async () => {
      this.loadingInitial = true;
      try {
         const activities = await agent.Activities.list();
         runInAction('loading activities', () => {
            activities.forEach(activity => {
               activity.date = activity.date.split('.')[0];
               this.activityRegistry.set(activity.id, activity);
            });
         });

         this.loadingInitial = false;
      } catch (error) {
         runInAction('load activities error', () => this.loadingInitial = false);
         console.log(error);
      }
   };

   @action selectActivity = (id: string) => {
      this.selectedActivity = this.activityRegistry.get(id);
      this.isEditing = false;
   };

   @action createActivity = async (activity: IActivity) => {
      this.isSubmitting = true;
      try {
         await agent.Activities.create(activity);
         runInAction('creating activity', () => {
            this.activityRegistry.set(activity.id, activity);
            this.activities.push(activity);
            this.isEditing = false;
            this.isSubmitting = false;
         })
      } catch (error) {
         console.log(error);
         runInAction('error creating activity', () => {
            this.isEditing = false;
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
            this.selectedActivity = activity;
            this.isSubmitting = false;
            this.isEditing = false;
         });
      } catch (error) {
         runInAction('error editing activity', () => {
            this.isEditing = false;
            this.isSubmitting = false;
         });
         console.log(error);
      }
   }

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
   }

   @action openEditForm = (id: string) => {
      this.selectedActivity = this.activityRegistry.get(id);
      this.isEditing = true;
   }

   @action cancelSelectedActivity = () => {
      this.selectedActivity = undefined;
   }

   @action cancelEditOpen = () => {
      this.isEditing = false;
   }

   @action openCreateForm = () => {
      this.isEditing = true;
      this.selectedActivity = undefined;
   }
}

export default createContext(new ActivityStore());