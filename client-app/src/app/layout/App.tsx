import React, { Component } from 'react';
import { Header, Icon, List } from 'semantic-ui-react';
import './styles.css';
import axios from 'axios';

class App extends Component {
  state = {
    activities: []
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/activities')
      .then((response) => {
        this.setState({
          activities: response.data
        })
      });
  }

  render() {
    return (
      <div className="App">
        <Header as='h2' icon>
          <Icon name='users' />
          Eventlify
          <Header.Subheader>
            activities
          </Header.Subheader>
        </Header>
        <List>
          {
            this.state.activities.map((activity: any) => (
              <List.Item key={activity.id}>{activity.name}</List.Item>
            ))
          }
        </List>
        <ul>

        </ul>
      </div>
    );
  }
}

export default App;
