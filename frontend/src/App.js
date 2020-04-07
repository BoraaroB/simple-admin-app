import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './router';
import { LoginProvider } from './context/loginContext';
import './App.css';

function App() {
  return (
    <div className="App">
     <LoginProvider>
       <Router>
         <Routes />
       </Router>
     </LoginProvider>
    </div>
  );
}

export default App;
