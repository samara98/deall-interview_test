import React from 'react';
// import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="*">
            <Redirect to={'/'} />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
