import React, { useState } from 'react';
import './Settings.css';

const SettingsView = () => {
    const [theme, setTheme] = useState('light');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        updates: true
    });

    const handleNotificationChange = (type) => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Settings</h1>
                <p style={{color: '#718096'}}>Manage your account settings and preferences.</p>
            </div>

            <div className="settings-section">
                <h3>Profile Information</h3>
                <div className="profile-pic-upload">
                    <div className="current-pic">JR</div>
                    <button className="upload-btn">Change Photo</button>
                </div>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue="Jaswanth Reddy" />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue="Jaswanth@worksync.com" />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <input type="text" defaultValue="Product Manager" disabled style={{backgroundColor: '#edf2f7'}} />
                </div>
            </div>

            <div className="settings-section">
                <h3>Appearance</h3>
                <div className="form-group">
                    <label>Theme</label>
                    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                        <option value="system">System Default</option>
                    </select>
                </div>
            </div>

            <div className="settings-section">
                <h3>Notifications</h3>
                <div className="notifications-list">
                    <div className="toggle-switch">
                        <label>Email Notifications</label>
                        <input 
                            type="checkbox" 
                            checked={notifications.email} 
                            onChange={() => handleNotificationChange('email')} 
                        />
                    </div>
                    <div className="toggle-switch">
                        <label>Push Notifications</label>
                        <input 
                            type="checkbox" 
                            checked={notifications.push} 
                            onChange={() => handleNotificationChange('push')} 
                        />
                    </div>
                    <div className="toggle-switch">
                        <label>Product Updates</label>
                        <input 
                            type="checkbox" 
                            checked={notifications.updates} 
                            onChange={() => handleNotificationChange('updates')} 
                        />
                    </div>
                </div>
            </div>

            <button className="save-btn">Save Changes</button>
        </div>
    );
};

export default SettingsView;
