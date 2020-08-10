import React, { useState } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import { Application } from './components/canvas/Application';

function App() {
  var app = new Application();

  return (
    <div className="App">
      <Dashboard app={app}/>
    </div>
  );
}

export default App;
