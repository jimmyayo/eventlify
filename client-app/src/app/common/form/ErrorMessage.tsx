import React from 'react'
import { AxiosResponse } from 'axios';
import { Message } from 'semantic-ui-react';


interface IProps {
   error: AxiosResponse,
   text: string
}
const ErrorMessage: React.FC<IProps> = ({ error, text }) => {


   return (
      <Message error>
         <Message.Header>
            {error.statusText}
            {error.data && Object.keys(error.data).length > 0 && (
               <Message.List>
                  {Object.values(error.data.errors).flat().map((err, i) => (
                     <Message.Item key={i}>{err}</Message.Item>
                  ))}
               </Message.List>
            )}
         </Message.Header>
         {text && <Message.Content content={text} />}
      </Message>
   )
}


export default ErrorMessage
