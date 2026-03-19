import React, { useState } from 'react';
import './AuraBot.css';
import { extractAndSaveMemory, getMemoryContext, detectMood, getMoodTheme } from './memory';

const GEMINI_API_KEY = 'AIzaSyC8cWMdtU_Jljbrgm2KrV-c6lL_G5iu5fE';

const personas = [
  { id: 'girlfriend', emoji: '💕', name: 'Girlfriend',
    prompt: 'You are a loving, caring girlfriend. Talk in Hindi-English mix. Be sweet, caring, sometimes playful. Use emojis. Ask questions back. Show genuine emotions.' },
  { id: 'friend', emoji: '👫', name: 'Best Friend',
    prompt: 'You are a funny, honest best friend. Talk casually in Hindi-English. Be funny, real, sometimes tease. Use bhai/yaar. Show excitement and emotions.' },
  { id: 'mom', emoji: '👩', name: 'Mom',
    prompt: 'You are a loving Indian mom. Talk in Hindi-English. Be warm, worried, caring. Ask about food, sleep, studies. Give gentle advice. Use beta.' },
  { id: 'dad', emoji: '👨', name: 'Dad',
    prompt: 'You are a calm, wise Indian dad. Talk in Hindi-English. Be motivating, proud, give life advice. Sometimes strict but always loving.' },
  { id: 'mentor', emoji: '🧘', name: 'Mentor',
    prompt: 'You are a focused mentor. Talk professionally but warmly. Give guidance on studies and career. Ask about progress. Be encouraging and wise.' },
];

function AuraBot() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [messages, setMessages] = useState([
    { id: Date.now(), text: "Hey! Kaise ho aaj? 🥺 Main hoon na!", sent: false }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState('neutral');
  const [moodTheme, setMoodTheme] = useState(getMoodTheme('neutral'));

  const sendMessage = async () => {
    if (newMessage.trim() === '' || loading) return;

    // Mood detect karo
    const mood = detectMood(newMessage);
    const theme = getMoodTheme(mood);
    setCurrentMood(mood);
    setMoodTheme(theme);

    // Memory mein save karo
    extractAndSaveMemory(newMessage);

    // Memory context lo
    const memoryContext = getMemoryContext();

    const userMsg = {
      id: Date.now(),
      text: newMessage,
      sent: true,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit'
      })
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setLoading(true);

    try {
      // Mood ke hisaab se extra instructions
      let moodInstruction = '';
      if (mood === 'sad') moodInstruction = 'User is sad. Be extra gentle, caring and comforting.';
      if (mood === 'happy') moodInstruction = 'User is happy. Celebrate with them, be enthusiastic!';
      if (mood === 'excited') moodInstruction = 'User is excited. Match their energy, be excited too!';
      if (mood === 'angry') moodInstruction = 'User seems frustrated. Be calm, understanding and patient.';

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${selectedPersona.prompt}
                
${moodInstruction}

${memoryContext}

User said: "${newMessage}"

Reply in 1-3 sentences max. Be natural, emotional and remember past context if relevant.`
              }]
            }]
          })
        }
      );

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);
      if (!data.candidates || !data.candidates[0]) throw new Error('No response');

      const botReply = data.candidates[0].content.parts[0].text;

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botReply,
        sent: false,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit'
        }),
        mood: mood
      }]);

    } catch (error) {
      let errorText = "Thoda network issue hai! Dobara try karo 😅";
      if (error.message.includes('429')) errorText = "1 minute wait karo ⏱️";
      if (error.message.includes('400') || error.message.includes('403')) errorText = "API key check karo ⚠️";

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: errorText,
        sent: false,
      }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const switchPersona = (persona) => {
    setSelectedPersona(persona);
    setMessages([{
      id: Date.now(),
      text: `${persona.emoji} ${persona.name} mode! Bolo kya chal raha hai? 😊`,
      sent: false
    }]);
  };

  return (
    <div className="aurabot-container" style={{ background: `linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 100%)` }}>

      {/* Header with Mood */}
      <div className="aurabot-header" style={{ borderBottom: `1px solid ${moodTheme.accent}40` }}>
        <div className="aurabot-title">🤖 AuraBot {selectedPersona.emoji}</div>
        <div className="aurabot-subtitle">{selectedPersona.name} Mode</div>
        <div className="mood-indicator" style={{ color: moodTheme.accent }}>
          {moodTheme.emoji} {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
        </div>
      </div>

      {/* Persona Selector */}
      <div className="persona-selector">
        {personas.map(persona => (
          <button
            key={persona.id}
            className={`persona-btn ${selectedPersona.id === persona.id ? 'active' : ''}`}
            onClick={() => switchPersona(persona)}
          >
            {persona.emoji} {persona.name}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="aurabot-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`aura-message ${msg.sent ? 'sent' : 'received'}`}>
            {!msg.sent && (
              <div className="bot-avatar">{selectedPersona.emoji}</div>
            )}
            <div className="aura-bubble">
              <div
                className="aura-text"
                style={msg.sent ? {} : { background: moodTheme.bg }}
              >
                {msg.text}
              </div>
              {msg.time && <div className="aura-time">{msg.time}</div>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="aura-message received">
            <div className="bot-avatar">{selectedPersona.emoji}</div>
            <div className="aura-bubble">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="aurabot-input" style={{ borderTop: `1px solid ${moodTheme.accent}40` }}>
        <input
          type="text"
          placeholder={`${selectedPersona.name} se baat karo...`}
          className="aura-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKey}
          disabled={loading}
          style={{ borderColor: loading ? 'rgba(255,255,255,0.1)' : `${moodTheme.accent}60` }}
        />
        <button
          className="aura-send"
          onClick={sendMessage}
          disabled={loading}
          style={{ background: `linear-gradient(135deg, ${moodTheme.accent}, #6366f1)` }}
        >
          {loading ? '...' : '➤'}
        </button>
      </div>

    </div>
  );
}

export default AuraBot;