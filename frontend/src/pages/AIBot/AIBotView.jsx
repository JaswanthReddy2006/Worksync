import React, { useState, useRef, useEffect } from 'react';
import './AIBot.css';

const AIBotView = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hello! I am WorkSync AI. How can I help you manage your projects today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate API delay
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: " placeholder for the Gemini API",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="ai-bot-container">
            <div className="ai-header">
                <div className="ai-icon-wrapper">
                    ✨
                </div>
                <div>
                    <h2>WorkSync AI</h2>
                    
                </div>
            </div>

            <div className="ai-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`ai-message ${msg.sender}`}>
                        <div className="message-bubble">
                            {msg.text}
                        </div>
                        <span className="message-time">{msg.time}</span>
                    </div>
                ))}
                {isTyping && (
                    <div className="ai-message bot">
                        <div className="message-bubble typing">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="ai-input-area" onSubmit={handleSend}>
                <input 
                    type="text" 
                    placeholder="Ask me anything..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </form>
        </div>
    );
};

export default AIBotView;
