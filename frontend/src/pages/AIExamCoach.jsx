import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Brain, Bot, User, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FormattedText } from '../utils/textFormatter';

export default function AIExamCoach({ setActiveTab }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "What should I study today?",
    "I only have 1 hour today. What should I study?",
    "What are my weakest topics?",
    "I missed yesterday's plan. How should I adjust?",
    "How prepared am I for the exam?",
    "What should I revise next?"
  ];

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        sender: 'ai',
        text: `Hello ${user?.name || 'Candidate'}! I am your **Personal AI Exam Coach** for ${user?.targetExam?.name || 'your target exam'}.

I continuously monitor your available study time, test scores, mistakes, and revision needs.

How can I optimize your preparation today? Pick a quick option below or type any question:`
      }
    ]);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const newMsgList = [...messages, { sender: 'user', text }];
    setMessages(newMsgList);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/coach/chat', { message: text });
      if (res.success) {
        setMessages([...newMsgList, { sender: 'ai', text: res.reply, actionTaken: res.actionTaken }]);
      }
    } catch (e) {
      setMessages([...newMsgList, { sender: 'ai', text: 'Sorry, I encountered an issue connecting to the AI orchestration layer. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--header-height) - 3rem)' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Brain size={28} color="#2563eb" />
          <span>AI Government Exam Coach</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Live conversational intelligence connected directly to your schedule, tests, and weakness logs.
        </p>
      </div>

      {/* Chat Messages Container */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1.25rem' }}>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {messages.map((m, idx) => {
            const isAI = m.sender === 'ai';
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  alignSelf: isAI ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}
              >
                {isAI && (
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={18} />
                  </div>
                )}

                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: isAI ? '0 16px 16px 16px' : '16px 0 16px 16px',
                  backgroundColor: isAI ? 'var(--bg-primary)' : 'var(--brand-primary)',
                  color: isAI ? 'var(--text-primary)' : '#ffffff',
                  fontSize: '0.94rem',
                  lineHeight: 1.6,
                  border: isAI ? '1px solid var(--border-subtle)' : 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {isAI ? <FormattedText text={m.text} /> : m.text}
                </div>

                {!isAI && (
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--border-medium)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontWeight: 700
                  }}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', gap: '0.85rem', alignSelf: 'flex-start' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} />
              </div>
              <div style={{ padding: '0.85rem 1.25rem', borderRadius: '0 16px 16px 16px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Analyzing profile & calculating optimal recommendations...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '1rem 0 0.75rem 0', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp)}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem' }}
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{ display: 'flex', gap: '0.75rem' }}
        >
          <input
            type="text"
            placeholder="Ask your AI Exam Coach anything (e.g. 'I only have 45 minutes today')..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={loading || !inputMessage.trim()} className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
            <Send size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
