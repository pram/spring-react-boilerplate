/* @flow */
import React from 'react';
import { Route } from 'react-router-dom';

import { Container } from 'reactstrap';

import Home from '../home';
import About from '../about';
import SignIn from '../signin'
import AppNav from '../appnav';

const App = () => (
  <div>
      <AppNav/>
      <Container>
          <Route exact path="/" component={Home} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/about-us" component={About} />
      </Container>
  </div>
);

export default App;
