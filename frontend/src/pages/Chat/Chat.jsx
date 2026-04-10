import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Alice', text: 'Hey team, just uploaded the new specs for the Q3 project.', time: '10:30 AM', type: 'received' },
        { id: 2, sender: 'Bob', text: 'Thanks Alice! Checking them now.', time: '10:32 AM', type: 'received' },
        { id: 3, sender: 'You', text: 'Great work on the timeline updates btw.', time: '10:35 AM', type: 'sent' },
        { id: 4, sender: 'Charlie', text: 'Is anyone free for a quick sync at 2?', time: '11:00 AM', type: 'received' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: messages.length + 1,
            sender: 'You',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'sent'
        };

        setMessages([...messages, message]);
        setNewMessage('');
        
        // Simulate a reply
        setTimeout(() => {
             const reply = {
                id: messages.length + 2,
                sender: 'Alice',
                text: 'Got it!',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'received'
            };
            setMessages(prev => [...prev, reply]);
        }, 3000);
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Team Chat</h2>
                <div style={{fontSize: '0.8rem', color: '#718096'}}>5 Members Online</div>
            </div>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.type}`}>
                        {msg.type === 'received' && <div className="message-sender">{msg.sender}</div>}
                        <div className="message-text">{msg.text}</div>
                        <div className="message-time">{msg.time}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
