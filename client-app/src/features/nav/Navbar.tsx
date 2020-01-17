import React, { useContext } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import ActivityStore from '../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';


const Navbar: React.FC = () => {
   const activityStore = useContext(ActivityStore);

   return (
      <Menu inverted fixed='top'>
         <Container>
            <Menu.Item header>
               <img src="/assets/logo.png" alt="logo"
                  style={{marginRight: '10px'}} />
               Eventlify
            </Menu.Item>
            <Menu.Item name='Activities' />
            <Menu.Item>
               <Button onClick={activityStore.openCreateForm} positive content='Create Activity' />
            </Menu.Item>
         </Container>

      </Menu>
   )
};

export default observer(Navbar);