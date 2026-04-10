import React from 'react';
import './Notifications.css';

const NotificationsView = () => {
  const notifications = [
    { id: 1, text: "New comment on 'Homepage Design'", time: "2 hours ago", read: false },
    { id: 2, text: "Task 'Fix Login Bug' assigned to you", time: "5 hours ago", read: false },
    { id: 3, text: "Meeting with team at 3 PM", time: "Yesterday", read: true },
    { id: 4, text: "Project 'Alpha' status changed to In Progress", time: "2 days ago", read: true },
  ];

  return (
    <div className="notifications-view">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <button className="mark-all-read">Mark all as read</button>
      </div>
      <div className="notifications-list">
        {notifications.map(n => (
          <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
             <div className="notification-content">
                <p>{n.text}</p>
                <span className="notification-time">{n.time}</span>
             </div>
             {!n.read && <span className="unread-dot"></span>}
          </div>
        ))}
        {notifications.length === 0 && <p style={{color:'#718096'}}>No notifications.</p>}
      </div>
    </div>
  );
};

export default NotificationsView;
