export interface IActivity {
   id: string;
   title: string;
   description: string;
   category: string;
   date: Date;
   city: string;
   venue: string;
   isGoing: boolean;
   isHost: boolean;
   attendees: IAttendee[];
}

export interface IActivityFormValues extends Partial<IActivity> {
   time?: Date
}

export interface IAttendee {
   userName: string;
   displayName: string;
   image: string;
   isHost: boolean;
}