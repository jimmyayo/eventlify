import React, { Component } from 'react';
import { Header, Icon, List } from 'semantic-ui-react';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    values: []
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/values')
      .then((response) => {
        this.setState({
          values: response.data
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
            Values
          </Header.Subheader>
        </Header>
        <List>
          {
            this.state.values.map((value: any) => (
              <List.Item key={value.id}>{value.name}</List.Item>
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
