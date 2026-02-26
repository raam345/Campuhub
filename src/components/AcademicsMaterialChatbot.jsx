import React, { useState, useEffect, useRef } from 'react';
import { generateAcademicResponse } from '../services/gemini';

const AcademicsMaterialChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: "📚 Welcome to AI Study Assistant!\n\nI can help with:\n\n📖 Concept Explanations\n🎯 Summary & Notes\n❓ Practice Questions\n💡 Study Tips\n🔍 Topic Deep Dives\n\nJust select a subject and ask your questions!",
            isUser: false,
            type: 'intro'
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('mathematics');
    const messagesEndRef = useRef(null);

    const subjects = [
        { id: 'mathematics', name: '🔢 Mathematics', topics: ['Algebra', 'Calculus', 'Geometry', 'Statistics'] },
        { id: 'physics', name: '⚛️ Physics', topics: ['Mechanics', 'Thermodynamics', 'Electricity', 'Optics'] },
        { id: 'chemistry', name: '🧪 Chemistry', topics: ['Organic', 'Inorganic', 'Physical', 'Biochemistry'] },
        { id: 'biology', name: '🧬 Biology', topics: ['Cell Biology', 'Genetics', 'Ecology', 'Physiology'] },
        { id: 'english', name: '📝 English', topics: ['Literature', 'Grammar', 'Writing', 'Speaking'] },
        { id: 'history', name: '📜 History', topics: ['Ancient', 'Medieval', 'Modern', 'Contemporary'] },
        { id: 'economics', name: '💰 Economics', topics: ['Microeconomics', 'Macroeconomics', 'Finance', 'Trade'] },
        { id: 'computer_science', name: '💻 Computer Science', topics: ['Programming', 'Algorithms', 'Data Structures', 'Databases'] }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        console.log("📝 User typed:", input);
        console.log("📚 Selected subject:", selectedSubject);

        const userMessage = { text: input, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const subject = subjects.find(s => s.id === selectedSubject)?.name || selectedSubject;
            const prompt = `As an academic tutor for ${subject}, please help with: "${input}". Provide clear explanations, examples, and relevant concepts. Format your answer with proper headings and bullet points where appropriate.`;

            const result = await generateAcademicResponse(input, selectedSubject);
            console.log("🤖 AI result received:", result);

            setIsTyping(false);
            setMessages(prev => [...prev, {
                text: result.text || result,
                isUser: false,
                type: 'response'
            }]);
        } catch (error) {
            console.error("❌ Error:", error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                text: "Sorry, I couldn't generate a response. Please try again or rephrase your question.",
                isUser: false,
                type: 'error'
            }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all transform hover:scale-110 flex items-center gap-2"
                >
                    <span className="text-2xl">📚</span>
                    <span className="font-medium pr-2">AI Study Assistant</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-96 max-h-[600px] flex flex-col border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 text-white">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <span className="text-xl">📚</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">AI Study Assistant</h3>
                                    <p className="text-blue-100 text-xs">Personalized learning support</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Subject Selection */}
                        <div className="mt-3">
                            <label className="text-xs font-semibold text-blue-100 block mb-2">Select Subject:</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-gray-800 bg-blue-50 border border-blue-300 focus:outline-none text-sm"
                            >
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-xs px-4 py-3 rounded-lg text-sm ${msg.isUser
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : msg.type === 'error'
                                            ? 'bg-red-100 text-red-900 rounded-bl-none'
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                        }`}
                                >
                                    {msg.text.split('\n').map((line, i) => (
                                        <div key={i} className="whitespace-pre-wrap">
                                            {line}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="border-t border-gray-200 p-3 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask a question..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={isTyping || !input.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                            >
                                ➤
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            💡 Try: "Explain [topic]", "Give me practice problems", "Summarize [chapter]"
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AcademicsMaterialChatbot;
