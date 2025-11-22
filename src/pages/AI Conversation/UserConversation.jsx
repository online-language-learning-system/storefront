import React, { useState, useRef } from 'react';
import Footer from '@/components/Footer';
import {
  createConversation,
  sendMessage,
  sendVoice,
  translateText
} from "@/api/AIConversationApi";
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

  // ================================ Bắt đầu hội thoại ================================
  const startConversation = async () => {
  if (!level || !topic) {
    alert('Vui lòng chọn level và chủ đề!');
    return;
  }

  setLoading(true);
  try {
    const res = await createConversation(level, topic);

    // Lấy conversation ID từ res.id
    setConversationId(res.id);

    // Lấy message đầu tiên nếu có, nếu chưa có thì hiển thị placeholder
    const firstMessage = res.messages?.[0] || {
      id: crypto.randomUUID(),
      type: 'ai',
      text: 'Chào! Hãy bắt đầu hội thoại.',
      audio: null
    };

    setMessages([
      {
        id: firstMessage.id || crypto.randomUUID(),
        type: firstMessage.type || 'ai',
        text: firstMessage.content || firstMessage.text || 'Chào! Hãy bắt đầu hội thoại.',
        audio: firstMessage.audio_url || firstMessage.audio || null,
      }
    ]);

    setHasStarted(true);
  } catch (err) {
    console.error(err);
    alert('Không thể bắt đầu hội thoại. Thử lại!');
  } finally {
    setLoading(false);
  }
};

  // ================================ Ghi âm ================================
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = e => audioChunks.current.push(e.data);
    mediaRecorder.current.onstop = handleRecordingStop;
    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleRecordingStop = async () => {
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
    setLoading(true);
    try {
      const res = await sendVoice(conversationId, audioBlob, 2);
      pushAIResponse(res);
    } catch (err) {
      console.error(err);
      alert('Gửi giọng nói thất bại!');
    }
    setLoading(false);
  };

  // ================================ Gửi text ================================
  const handleSendText = async () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'user', text: userText }
    ]);
    setInputText('');

    setLoading(true);
    try {
      const res = await sendMessage(conversationId, userText, 2);
      pushAIResponse(res);
    } catch (err) {
      console.error(err);
      alert('Gửi tin nhắn thất bại!');
    }
    setLoading(false);
  };

  // ================================ Thêm phản hồi AI ================================
  const pushAIResponse = (res) => {
    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'user', text: res.user_message.content },
      {
        id: crypto.randomUUID(),
        type: 'ai',
        text: res.ai_message.content,
        audio: res.ai_message.audio_url || null,
        scores: res.overall_score,
        analysis: res.user_message.analysis
      }
    ]);
  };

  // ================================ Dịch ================================
  const translateMessage = async (msgId) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;
    try {
      const res = await translateText(msg.text);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translation: res.translation } : m));
    } catch (err) {
      console.error(err);
      alert('Dịch thất bại!');
    }
  };

  // ================================ Phát audio ================================
  const playAudio = (message) => {
    if (!message.audio) return;
    new Audio(message.audio).play();
  };

  return (
    <>
      <div className="conversation-container">
        <div className="conversation-main">
          <div className="conversation-header">
            <h1>AI-Luyện nói tiếng Nhật</h1>
          </div>

          <div className="conversation-content">
            <div className="messages-container">

              {/* Chọn level & topic ngay trong khung chat nếu chưa bắt đầu */}
              {!hasStarted && (
                <div className="message system-message">
                  <div className="message-bubble">
                    <select value={level} onChange={e => setLevel(e.target.value)}>
                      <option value="">-- Chọn level --</option>
                      <option value="N5">N5</option>
                      <option value="N4">N4</option>
                      <option value="N3">N3</option>
                      <option value="N2">N2</option>
                      <option value="N1">N1</option>
                    </select>

                    <div className="select-row">
                      {suggestedTopics.map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() => setTopic(t)}
                          className={topic === t ? 'selected-topic' : ''}
                        >
                          {t}
                        </button>
                      ))}
                      <input
                        type="text"
                        placeholder="Nhập chủ đề tự do"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                      />
                    </div>

                    <button className="start-btn" onClick={startConversation}>
                      🚀 Bắt đầu luyện nói
                    </button>
                  </div>
                </div>
              )}

              {/* Render tin nhắn */}
              {messages.map(m => (
                <div key={m.id} className={`message ${m.type}-message`}>
                  {m.type === 'ai' && <div className="ai-avatar"><span>AI</span></div>}
                  <div className="message-bubble">
                    <p>{m.text}</p>
                    {(m.audio || !m.translation) && (
                      <div className="message-actions">
                        {m.audio && <button className="audio-btn" onClick={() => playAudio(m)}>🔊</button>}
                        {!m.translation && <button className="translate-btn" onClick={() => translateMessage(m.id)}>🔄</button>}
                      </div>
                    )}

                    {m.translation && <p style={{marginTop:10,fontStyle:'italic',opacity:0.8}}>🇻🇳 {m.translation}</p>}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message ai-message">
                  <div className="ai-avatar"><span>AI</span></div>
                  <div className="message-bubble">⏳ AI đang soạn câu trả lời...</div>
                </div>
              )}
            </div>

            {/* Input row */}
            {hasStarted && (
              <div className="bottom-input-row">
                <input
                  className="text-input"
                  placeholder="Nhập tin nhắn..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendText()}
                />
                <button className="send-btn" onClick={handleSendText}>📩</button>
                <button
                  className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
                  onClick={toggleRecording}
                >
                  <img src="/img/microphoneai.png" alt="mic" style={{ width: 26 }} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {hasStarted && (
          <div className="sidebar">
            <div className="user-stats">
            <h3>Điểm của bạn</h3>

            {latestScores ? (
              <div className="score-box">
                <p>⭐ Từ vựng: {latestScores.vocabulary}</p>
                <p>⭐ Ngữ pháp: {latestScores.grammar}</p>
                <p>⭐ Tự nhiên: {latestScores.naturalness}</p>
                <p>⭐ Trôi chảy: {latestScores.fluency}</p>
                <p><strong>Tổng: {latestScores.total}</strong></p>
              </div>
            ) : (
              <p>Chưa có điểm — hãy gửi tin nhắn!</p>
            )}
          </div>
            <div className="course-recommendation">
              <h3>Gợi ý khóa học</h3>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default UserConversation;
