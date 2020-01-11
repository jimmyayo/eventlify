import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';

const Navbar = () => {
   return (
      <Menu inverted fixed='top'>
         <Container>
            <Menu.Item header>
               <img src="/assets/logo.png" alt="logo"
                  style={{marginRight: '10px'}} />
               Eventlify
            </Menu.Item>
            <Menu.Item name='Eventlify' />
            <Menu.Item>
               <Button positive content='Create Activity' />
            </Menu.Item>
         </Container>

      </Menu>
   )
};

export default Navbar;