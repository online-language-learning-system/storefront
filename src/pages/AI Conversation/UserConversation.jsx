
import React, { useState, useRef } from 'react';
import Footer from '@/components/Footer';
import {
  createConversation,
  sendMessage,
  translateText
} from "@/api/AIConversationApi";
import {
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  SpeakerWaveIcon,
  LanguageIcon,
  AcademicCapIcon,
  BookOpenIcon,
  SparklesIcon,
  RocketLaunchIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import './user-conversation.css';

function UserConversation() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [latestScores, setLatestScores] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  const suggestedTopics = [
    'Món ăn yêu thích',
    'Đồ uống yêu thích',
    'Giới thiệu bản thân',
    'Đất nước của tôi',
    'Sở thích'
  ];
  React.useEffect(() => {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}, []);
  // ======== Conversation Handling ========
  const startConversation = async () => {
    if (!level || !topic) {
      alert('Vui lòng chọn level và chủ đề!');
      return;
    }
    setLoading(true);
    try {
      const res = await createConversation(level, topic);
      setConversationId(res.id);
      const firstMessage = res.messages?.[0] || {
        id: crypto.randomUUID(),
        type: 'ai',
        text: 'Chào! Hãy bắt đầu hội thoại.',
        audio: null
      };
      setMessages([{
        id: firstMessage.id || crypto.randomUUID(),
        type: firstMessage.type || 'ai',
        text: firstMessage.content || firstMessage.text || 'Chào! Hãy bắt đầu hội thoại.',
        audio: firstMessage.audio_url || firstMessage.audio || null,
      }]);
      if (res.overall_score) setLatestScores(res.overall_score);
      setHasStarted(true);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Không thể bắt đầu hội thoại. Thử lại!');
    } finally {
      setLoading(false);
    }
  };
let recognition = null;

const startSpeechRecognition = () => {
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    alert("Trình duyệt không hỗ trợ Speech Recognition!");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "ja-JP"; 
  recognition.interimResults = false;

  recognition.onstart = () => {
    setIsRecording(true);

    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "user",
        text: "🎙️ Đang nghe bạn nói...",
        _pendingVoice: true
      }
    ]);
  };

  recognition.onerror = (err) => {
    console.error(err);
    setIsRecording(false);
    alert("Không nhận diện giọng nói được!");
  };

  recognition.onend = () => {
    setIsRecording(false);
  };

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;

    setMessages(prev => prev.filter(m => !m._pendingVoice));

    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "user",
        text
      }
    ]);

    // Gửi cho AI
    try {
      const res = await sendMessage(conversationId, text);
      pushAIResponse(res);
    } catch (err) {
      alert("Gửi tin nhắn thất bại!");
    }
  };

  recognition.start();
};

const toggleRecording = () => {
  if (isRecording) {
    recognition?.stop();
  } else {
    startSpeechRecognition();
  }
};
const handleRecordingStop = async () => {
  setIsRecording(false);

  const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
  audioChunks.current = [];
  setMessages(prev => {
    const idx = prev.findIndex(x => x._pendingVoice);
    if (idx === -1) return prev;

    const arr = [...prev];
    arr[idx] = {
      id: crypto.randomUUID(),
      type: "user",
      text: "🔊 Đang gửi ghi âm...",
    };
    return arr;
  });

  try {
    if (!conversationId) throw new Error("Chưa có conversation!");

    const res = await sendVoice(conversationId, audioBlob);

    pushAIResponse(res);
  } catch (err) {
    console.error("sendVoice error:", err);
    alert(err.message || "Gửi giọng nói thất bại!");
  }
};

const handleSendText = async () => {
  if (!inputText.trim()) return;

  const text = inputText;
  setInputText("");

  setMessages(prev => [
    ...prev,
    { id: crypto.randomUUID(), type: "user", text }
  ]);

  try {
    const res = await sendMessage(conversationId, text);
    pushAIResponse(res);
  } catch (err) {
    alert("Lỗi gửi tin nhắn!");
  }
};

const pushAIResponse = (res) => {
  if (!res) return;
  setLatestScores(res.overall_score || null);
  const text = res.ai_message?.content || "";

  const aiMsg = {
    id: crypto.randomUUID(),
    type: "ai",
    text,
    analysis: res.ai_message?.analysis || null
  };

  setMessages(prev => [...prev, aiMsg]);

  // 🔊 Tự động đọc
  speakText(text, "ja-JP");
};
  // ======== Translate ========
  const translateMessage = async (msgId) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;
    try {
      const res = await translateText(msg.text);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translation: res.translation } : m));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Dịch thất bại!');
    }
  };
const getJapaneseMaleVoice = () => {
  const voices = window.speechSynthesis.getVoices();

  // Ưu tiên giọng nam tiếng Nhật
  return (
    voices.find(v =>
      v.lang === "ja-JP" &&
      /male|otoko|ichiro|takumi|daichi/i.test(v.name)
    )
    ||
    // Fallback: giọng Nhật bất kỳ
    voices.find(v => v.lang === "ja-JP")
    ||
    null
  );
};

  const playAudio = (message) => {
  if (!message?.text) return;

  // BE chỉ trả text → FE đọc
  speakText(message.text, "ja-JP");
};
const speakText = (text) => {
  if (!window.speechSynthesis) {
    alert("Trình duyệt không hỗ trợ TTS");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 1;
  utterance.pitch = 0.9; // giọng nam → trầm hơn
  utterance.volume = 1;

  const voice = getJapaneseMaleVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
};


  return (
    <>
      <div className="conversation-container">
        <div className="conversation-main">
          <div className="conversation-header">
            <div className="header-content">
              <ChatBubbleLeftRightIcon className="header-icon" />
              <h1>AI-Luyện nói tiếng Nhật</h1>
              <SparklesIcon className="header-sparkle" />
            </div>
          </div>

          <div className="conversation-content">
            <div className="messages-container">
              {!hasStarted && (
                <div className="message system-message">
                  <div className="message-bubble">
                    <div className="level-selection">
                      <h3>
                        <AcademicCapIcon className="selection-icon" />
                        Chọn trình độ của bạn
                      </h3>
                      <div className="level-buttons">
                        {['N5', 'N4', 'N3', 'N2', 'N1'].map(levelOption => (
                          <button
                            key={levelOption}
                            onClick={() => setLevel(levelOption)}
                            className={`level-btn ${level === levelOption ? 'selected' : ''}`}
                          >
                            {levelOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="topic-selection">
                      <h3>
                        <BookOpenIcon className="selection-icon" />
                        Chọn chủ đề yêu thích
                      </h3>
                      <div className="select-row">
                        {suggestedTopics.map((t, idx) => (
                          <button
                            key={idx}
                            onClick={() => setTopic(t)}
                            className={`topic-btn ${topic === t ? 'selected-topic' : ''}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        className="custom-topic-input"
                        placeholder="Hoặc nhập chủ đề tự do của bạn..."
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                      />
                    </div>

                    <button
                      className={`start-btn ${loading ? 'loading' : ''}`}
                      onClick={startConversation}
                      disabled={!level || !topic || loading}
                    >
                      {loading ? (
                        <div className="loading-content">
                          <div className="spinner"></div>
                        </div>
                      ) : (
                        <>                          
                          Bắt đầu luyện nói
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {messages.map(m => (
                <div key={m.id} className={`message ${m.type}-message`}>
                  {m.type === 'ai' ? (
                    <div className="ai-avatar">
                      <CpuChipIcon className="avatar-icon" />
                    </div>
                  ) : (
                    <div className="user-avatar">
                      <UserIcon className="avatar-icon" />
                    </div>
                  )}
                  <div className="message-bubble">
                    <p>{m.text}</p>
                    <div className="message-actions">
                      {m.type === 'ai' && (
                      <button
                        className="audio-btn"
                        onClick={() => playAudio(m)}
                        title="Nghe phát âm"
                      >
                        <SpeakerWaveIcon className="action-icon" />
                      </button>
                    )}
                      {!m.translation && m.type === 'ai' && (
                        <button className="translate-btn" onClick={() => translateMessage(m.id)} title="Dịch sang tiếng Việt">
                          <LanguageIcon className="action-icon" />
                        </button>
                      )}
                    </div>
                    {m.translation && (
                      <p className="translation-text">
                        <LanguageIcon className="translation-icon" />
                        {m.translation}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message ai-message">
                  <div className="ai-avatar">
                    <CpuChipIcon className="avatar-icon" />
                  </div>
                  <div className="message-bubble loading-message">
                    <div className="typing-indicator">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="typing-text">AI đang soạn câu trả lời...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {hasStarted && (
              <div className="bottom-input-row">
                <input
                  className="text-input"
                  placeholder="Nhập tin nhắn..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendText()}
                />
                <button className="send-btn" onClick={handleSendText} title="Gửi tin nhắn">
                  <PaperAirplaneIcon className="btn-icon" />
                </button>
                <button
                  className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
                  onClick={toggleRecording}
                  title={isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
                >
                  <MicrophoneIcon className={`mic-icon ${isRecording ? 'recording' : ''}`} />
                  {isRecording && <div className="recording-pulse"></div>}
                </button>
              </div>
            )}
          </div>
        </div>

        {hasStarted && (
          <div className="sidebar">
            <div className="user-stats">
              <h3>
                <AcademicCapIcon className="stats-icon" />
                Điểm của bạn
              </h3>
              {latestScores ? (
                <div className="score-box">
                  <p> Từ vựng: {latestScores.vocabulary}</p>
                  <p> Ngữ pháp: {latestScores.grammar}</p>
                  <p> Tự nhiên: {latestScores.naturalness}</p>
                  <p> Trôi chảy: {latestScores.fluency}</p>
                  <p><strong>Tổng: {latestScores.total}</strong></p>
                </div>
              ) : (
                <p>Chưa có điểm — hãy gửi tin nhắn!</p>
              )}
            </div>
            <div className="course-recommendation">
              <h3>
                <BookOpenIcon className="stats-icon" />
                Gợi ý khóa học
              </h3>
              <div className="recommendation-content">
                <p>Dựa trên điểm số của bạn, chúng tôi sẽ gợi ý các khóa học phù hợp.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default UserConversation;
