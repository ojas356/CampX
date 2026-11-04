import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';

export default function MessagesPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [currentUser]);

  useEffect(() => {
    const targetConvId = searchParams.get('conversationId');
    if (targetConvId && conversations.length > 0) {
      const found = conversations.find(c => String(c.id) === String(targetConvId));
      if (found) {
        setActiveConversation(found);
      }
    } else if (!activeConversation && conversations.length > 0) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, searchParams]);

  useEffect(() => {
    if (activeConversation && currentUser) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const list = await api.getConversations(currentUser?.id);
      setConversations(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId) => {
    try {
      const msgList = await api.getMessages(convId, currentUser?.id);
      setMessages(msgList);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const sent = await api.sendMessage(activeConversation.id, content, currentUser);
      setMessages((prev) => [...prev, sent]);
      loadConversations();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="section">
        <div className="container">
          <div className="clay-card p-8 max-w-md mx-auto text-center">
            <h2>Sign in to view messages</h2>
            <p className="text-sm text-[#5a4a34]">Connect directly with APSIT student buyers and sellers.</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn btn-primary mt-4 w-full"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getOtherStudent = (conv) => {
    if (!conv || !currentUser) return { name: 'Student' };
    return String(conv.buyer.id) === String(currentUser.id) ? conv.seller : conv.buyer;
  };

  return (
    <div className="section pt-8">
      <div className="container">
        <div className="section-heading mb-6">
          <span className="eyebrow">Peer-to-Peer Note Exchange</span>
          <h1>Campus Chat &amp; Messages</h1>
          <p className="mb-0">
            Coordinate break-time handovers at the APSIT Canteen, Library Foyer, or Gate 1.
          </p>
        </div>

        <div className="clay-card overflow-hidden flex min-h-[540px] max-h-[700px] border-2 border-[#2c2115]">
          {/* Left: Conversation Threads */}
          <div className={`w-full md:w-80 shrink-0 border-r-2 border-dashed border-[#c9a86a] bg-[#f7efd8]/90 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b-2 border-dashed border-[#c9a86a] bg-[#f1e6cb]">
              <span className="font-['Kalam'] text-lg font-bold text-[#2c2115]">
                Pinned Chats ({conversations.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-dashed divide-[#c9a86a]">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-[#e6d9b8] rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-[#5a4a34]">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-bold text-[#2c2115]">No active chats yet</p>
                  <p className="text-xs mt-1">
                    Open any item on the board and click "Chat with Seller".
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const other = getOtherStudent(conv);
                  const isSelected = activeConversation?.id === conv.id;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setActiveConversation(conv)}
                      className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                        isSelected ? 'bg-[#fdf8ec] shadow-inner' : 'hover:bg-[#fdf8ec]/60'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#b3352c] text-[#fff9ee] font-bold flex items-center justify-center text-sm shrink-0 border-2 border-[#2c2115]">
                        {other.name?.charAt(0) || 'S'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#2c2115] truncate mb-0">{other.name}</h4>
                          <span className="text-[11px] text-[#5a4a34] shrink-0">
                            {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#b3352c] truncate mb-0">
                          {conv.productName} (₹{conv.productPrice})
                        </p>
                        <p className="text-xs text-[#5a4a34] truncate mb-0 mt-0.5">
                          {conv.lastMessage || 'Start conversation...'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Active Chat Thread */}
          <div className={`flex-1 flex flex-col bg-[#fdf8ec] ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {activeConversation ? (
              <>
                <div className="p-4 bg-[#f1e6cb] border-b-2 border-dashed border-[#c9a86a] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setActiveConversation(null)}
                      className="md:hidden btn btn-outline btn-sm"
                      aria-label="Back to conversations list"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-[#2f5b8a] text-[#fff9ee] font-bold flex items-center justify-center text-sm shrink-0 border-2 border-[#2c2115]">
                      {getOtherStudent(activeConversation).name?.charAt(0) || 'S'}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-[#2c2115] truncate mb-0">
                        {getOtherStudent(activeConversation).name} · <span className="text-xs font-normal text-[#5a4a34]">{getOtherStudent(activeConversation).collegeEmail}</span>
                      </h3>
                      <p className="text-xs text-[#5a4a34] truncate mb-0">
                        Item: <strong className="text-[#b3352c]">{activeConversation.productName}</strong> (₹{activeConversation.productPrice})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3">
                  {messages.map((msg) => {
                    const isMe = String(msg.senderId) === String(currentUser.id);

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm border-2 border-[#2c2115] ${
                            isMe
                              ? 'bg-[#b3352c] text-[#fff9ee] shadow-[3px_3px_0_rgba(44,33,21,0.3)]'
                              : 'bg-[#f7efd8] text-[#2c2115] shadow-[3px_3px_0_rgba(44,33,21,0.18)]'
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed mb-0">{msg.content}</p>
                        </div>
                        <span className="text-[11px] text-[#5a4a34] mt-1 px-1">
                          {msg.senderName} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-3.5 bg-[#f1e6cb] border-t-2 border-dashed border-[#c9a86a] flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message (e.g. Can we meet near the Canteen at 1:30 PM?)..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-[#fffdf7] text-[#2c2115] text-sm rounded-lg px-4 py-2.5 border-2 border-[#2c2115]"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="btn btn-primary"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#5a4a34]">
                <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                <h3>Select a conversation</h3>
                <p className="text-sm max-w-xs">
                  Choose a student chat from the left to coordinate your campus meetup.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
