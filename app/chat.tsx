'use client'

import {
    Applicant,
    Message
} from './page';
import {
    FC as ReactFC,
    useEffect,
    useRef,
    useState
} from 'react';

import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: string;
  speaker: 'user' | 'bot';
}

interface ChatProps {
  messages: Message[];
  sendMessage: (message: string) => void;
  Applicant: Applicant;
}

const MessageBubble: ReactFC<MessageBubbleProps> = ({ message, speaker }) => {
  return (
    <div className={`flex ${speaker === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`p-3 rounded-lg ${speaker === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
        {speaker === 'bot' ? (
          <div className="markdown">
            <ReactMarkdown>
              {message}
            </ReactMarkdown>
          </div>
        ) : (
          message
        )}
      </div>
    </div>
  );
};

export function Chat({ messages, sendMessage, Applicant, isLoading = false }) {
 
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full p-4 bg-gray-100">
      
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="flex flex-col justify-end min-h-full">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg.message} speaker={msg.speaker} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center my-2">
          <div className="animate-pulse text-blue-500">AI is thinking...</div>
        </div>
      )}

      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-l-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={'Type your message...'}
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-r-lg"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};