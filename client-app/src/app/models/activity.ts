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
   comments: IComment[];
}

export interface IComment {
   id: string;
   body: string;
   createdAt: Date;
   userName: string;
   displayName: string;
   image: string;
}

export interface IActivityFormValues extends Partial<IActivity> {
   time?: Date
}

export interface IAttendee {
   userName: string;
   displayName: string;
   image: string;
   isHost: boolean;
   following?: boolean;
}