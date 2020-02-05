import { IActivity } from "../../models/activity";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
   const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

   const year = date.getFullYear();
   const month = date.getMonth() + 1;
   const day = date.getDate();
   const dateString = `${year}-${month}-${day}`;
   return new Date(dateString + ' ' + timeString);
}

export const setActivityProps = (activity: IActivity, user: IUser) => {
   //console.log(activity.attendees);
   activity.attendees.map(a => {
      console.log(a.userName);
      console.log(a.isHost);
   })
   console.log(user.userName);

   activity.date = new Date(activity.date);
   const going = activity.attendees.some(a => a.userName === user.userName);
   //console.log(going);
   activity.isGoing = going;

   const hosting = activity.attendees.some(a => a.isHost && a.userName === user.userName);
   activity.isHost = hosting;
   //console.log(hosting);

   console.log(`IsGoing: ${activity.isGoing}. IsHost: ${activity.isHost}`);
   return activity;
}