import React, { useState } from 'react';
import './Home.css';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import TaskTable from '../Tasks/TaskTable';
import TeamView from '../Team/TeamView';
import Chat from '../Chat/Chat';
import AnalyticsView from '../Analytics/AnalyticsView';
import SettingsView from '../Settings/SettingsView';
import DocsView from '../Docs/DocsView';
import Dashboard from '../Dashboard/Dashboard';
import NotificationsView from '../Notifications/NotificationsView';
import AIBotView from '../AIBot/AIBotView'; 

const Home = () => {
  const [activeView, setActiveView] = useState('Home');

  const renderView = () => {
    switch (activeView) {
      case 'Home':
        return <Dashboard />;
      case 'Notifications':
        return <NotificationsView />;
      case 'Tasks':
        return <TaskTable />;
      case 'Team':
        return <TeamView />;
      case 'Chat':
        return <Chat />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'AI Assistant':
          return <AIBotView />;
      case 'Settings':
        return <SettingsView />;
      case 'Docs':
        return <DocsView />;
      default:
        // Handle views that are not yet implemented or unknown
        return (
           <div style={{padding: '2rem', textAlign: 'center', color: '#666'}}>
              <h2>{activeView} View</h2>
              <p>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className='home-layout'>
      <Navbar />
      <div className="main-body">
        <Sidebar active={activeView} setActive={setActiveView} />
        <main className='content-area'>
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Home;
