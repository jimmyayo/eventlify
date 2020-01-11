import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';

interface IProps {
   openCreateForm: () => void;
}

const Navbar: React.FC<IProps> = ({openCreateForm}) => {
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
               <Button onClick={openCreateForm} positive content='Create Activity' />
            </Menu.Item>
         </Container>

      </Menu>
   )
};

export default Navbar;