import React from 'react';
import { Container, Segment, Header, Button, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
   return (
      <Segment inverted textAlign='center' vertical className='masthead' >
         <Container text>
            <Header as='h1' inverted>
               <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
               Eventlify
                  </Header>
            <Header as='h2' inverted content='Welcome to Eventlify' />
            <Button as={Link} to='/login' size='huge' inverted>
               login
                  </Button>
         </Container>
      </Segment>
   )
}

export default HomePage
