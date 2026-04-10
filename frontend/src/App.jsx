import React, { useState } from 'react';
import Login from './pages/Login/loginpage';
import Signup from './pages/Signup/signup';
import Home from './pages/Home/Home';
import { ProjectProvider } from './context/ProjectContext'; // Import ProjectProvider

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      <ProjectProvider>
        {isAuthenticated ? (
          <Home />
        ) : isLoginView ? (
          <Login onLogin={handleLogin} onSwitchToSignup={() => setIsLoginView(false)} />
        ) : (
          <Signup onSwitchToLogin={() => setIsLoginView(true)} />
        )}
      </ProjectProvider>
    </div>
  );
}

export default App;