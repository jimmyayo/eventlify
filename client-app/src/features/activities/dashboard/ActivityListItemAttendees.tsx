import React from 'react'
import { List, Image, Popup } from 'semantic-ui-react';
import { IAttendee } from '../../../app/models/activity';

interface IProps {
   attendees: IAttendee[];
}

const styles = {
   borderColor: 'orange',
   borderWidth: 3
}

const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
   return (
      <List horizontal>
         {attendees.map(attendee => (
            <List.Item key={attendee.userName}>
               <Popup
                  header={attendee.displayName}
                  content={attendee.following? 'You are following this user' : null}
                  trigger={
                     <Image 
                        size='mini' 
                        circular 
                        src={attendee.image || 'assets/user.png'}
                        bordered
                        style={attendee.following ? styles : null} />
                  }
               />
            </List.Item>
         ))}
      </List>
   )
}

export default ActivityListItemAttendees
