// CipherTalk — AuraBot Memory System

// Memory save karo
export function saveMemory(key, value) {
  try {
    const memories = getallMemories();
    memories[key] = {
      value: value,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };
    localStorage.setItem('aurabot_memory', JSON.stringify(memories));
    return true;
  } catch (error) {
    console.log('Memory save error:', error);
    return false;
  }
}

// Saari memories lo
export function getallMemories() {
  try {
    const data = localStorage.getItem('aurabot_memory');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
}

// Memory se context banao AuraBot ke liye
export function getMemoryContext() {
  const memories = getallMemories();
  const keys = Object.keys(memories);
  
  if (keys.length === 0) {
    return "No previous memories.";
  }

  let context = "Important things to remember about this user:\n";
  keys.forEach(key => {
    context += `- ${key}: ${memories[key].value} (${memories[key].date})\n`;
  });
  
  return context;
}

// Message se memory extract karo automatically
export function extractAndSaveMemory(message) {
  const msg = message.toLowerCase();
  
  // Exam detect karo
  if (msg.includes('exam') || msg.includes('test') || msg.includes('paper')) {
    saveMemory('exam_info', message);
  }
  
  // Name detect karo
  if (msg.includes('mera naam') || msg.includes('my name') || msg.includes('main hoon')) {
    saveMemory('user_name', message);
  }
  
  // Feeling detect karo
  if (msg.includes('sad') || msg.includes('dukhi') || msg.includes('rona') || msg.includes('bura')) {
    saveMemory('last_feeling', 'feeling sad: ' + message);
  }
  
  // Achievement detect karo
  if (msg.includes('pass') || msg.includes('marks') || msg.includes('%') || msg.includes('result')) {
    saveMemory('achievement', message);
  }
  
  // Project detect karo
  if (msg.includes('project') || msg.includes('assignment') || msg.includes('deadline')) {
    saveMemory('project_info', message);
  }

  // Family detect karo
  if (msg.includes('mummy') || msg.includes('papa') || msg.includes('bhai') || msg.includes('didi')) {
    saveMemory('family_info', message);
  }
}

// Mood detect karo
export function detectMood(message) {
  const msg = message.toLowerCase();
  
  // Happy mood
  const happyWords = ['khush', 'happy', 'great', 'amazing', 'awesome', 
                      'badhiya', 'mast', 'accha', 'best', '😊', '😄', 
                      '🎉', 'yay', 'woohoo', 'pass', '%', 'result'];
  
  // Sad mood  
  const sadWords = ['sad', 'dukhi', 'bura', 'rona', 'rone', 'thaka', 
                    'tired', 'tension', 'stress', 'anxious', 'worried',
                    'problem', 'mushkil', 'pareshan', '😢', '😭', 'fail'];
  
  // Angry mood
  const angryWords = ['gussa', 'angry', 'irritated', 'frustrated', 
                      'bakwas', 'stupid', 'bura lag', '😠', '😤'];

  // Excited mood
  const excitedWords = ['excited', 'can\'t wait', 'so happy', 'omg', 
                        'wow', 'yaar sun', 'kal', 'party', '🎊', '🔥'];

  let happyScore = 0;
  let sadScore = 0;
  let angryScore = 0;
  let excitedScore = 0;

  happyWords.forEach(word => { if (msg.includes(word)) happyScore++; });
  sadWords.forEach(word => { if (msg.includes(word)) sadScore++; });
  angryWords.forEach(word => { if (msg.includes(word)) angryScore++; });
  excitedWords.forEach(word => { if (msg.includes(word)) excitedScore++; });

  if (excitedScore > 0) return 'excited';
  if (happyScore > sadScore && happyScore > angryScore) return 'happy';
  if (sadScore > happyScore && sadScore > angryScore) return 'sad';
  if (angryScore > 0) return 'angry';
  return 'neutral';
}

// Mood ke hisaab se color theme do
export function getMoodTheme(mood) {
  switch(mood) {
    case 'happy':
      return { bg: 'rgba(34, 197, 94, 0.1)', accent: '#22c55e', emoji: '😊' };
    case 'excited':
      return { bg: 'rgba(251, 191, 36, 0.1)', accent: '#fbbf24', emoji: '🎉' };
    case 'sad':
      return { bg: 'rgba(99, 102, 241, 0.1)', accent: '#6366f1', emoji: '🤍' };
    case 'angry':
      return { bg: 'rgba(239, 68, 68, 0.1)', accent: '#ef4444', emoji: '😤' };
    default:
      return { bg: 'rgba(139, 92, 246, 0.1)', accent: '#8b5cf6', emoji: '💭' };
  }
}