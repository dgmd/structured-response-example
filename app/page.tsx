'use client'

import {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  ApplicantForm
} from './form';
import {
  Chat
} from './chat';

// Define types
export interface Applicant {
  name: string;
  gender: string;
  occupation: string;
  dependents: number;
  automobiles: number;
  houses: number;
  debt: number;
  liquidity: number;
  income: number;
  pension: number;
  history: string;
  reason: string;
}

export interface Message {
  message: string;
  speaker: 'user' | 'bot';
}

export default function Page() {
  
  // State for Applicant data
  const [Applicant, setApplicant] = useState<Applicant>({
    name: '',
    gender: '',
    occupation: '',
    dependents: 1,
    automobiles: 0,
    houses: 0,
    debt: 0,
    liquidity: 0,
    income: 0,
    pension: 0,
    history: '',
    reason: '',
  });

  // State for chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);


  // Call API to process Applicant and messages
  const processWithAI = useCallback(async () => {
    if (messages.length === 0) {
      return;
    }
    
    setIsLoading( x => true );
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Applicant, messages }),
      });
      
      if (!response.ok) {
        throw new Error('API call failed');
      }
      
      const data = await response.json();
      if (data.Applicant && data.message) {
      
        // Update Applicant with AI suggestions
        setApplicant(data.Applicant);
        
        // Add bot message
        setMessages(prev => [...prev, data.message]);
      }
      
    }
    catch (error) {
      console.error('Error processing with AI:', error);
    }
    finally {
      setIsLoading(false);
    }
  }, [
    Applicant,
    messages
  ]);

  // Callback for updating Applicant
  const updateApplicant = useCallback(
    (updates: Partial<Applicant>, isFormSubmit: boolean = false) => {
    setApplicant(prev => ({ ...prev, ...updates }));
      
    // Call the API if this was triggered by form submission
    if (isFormSubmit) {
      processWithAI();
    }
  }, [
    processWithAI
  ]);

  // Callback for sending messages
  const sendMessage = useCallback((message: string) => {
    const messageTrimmed = message.trim();
    if (messageTrimmed) {
      // Add user message
      setMessages(prev => {
        const newMessages: Message[] = [...prev, { 
          message: messageTrimmed,
          speaker: 'user'
        }];
        // We'll process with AI after state update
        return newMessages;
      });
    }
  }, [
  ]);
  
  // Process with AI when a new user message is added
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.speaker === 'user') {
      processWithAI();
    }
  }, [
    messages, 
    processWithAI
  ]);

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-4">LOAN APPLICATION HELPER</h1>
      <div className="flex flex-1 overflow-hidden">
      <div className="w-1/2 h-full p-4 bg-white rounded-lg border-4 border-pink-300 mr-2 overflow-hidden">
        <ApplicantForm applicant={Applicant} updateApplicant={updateApplicant} />
      </div>
        <div className="w-1/2 h-full p-4 bg-white rounded-lg border-4 border-blue-300 ml-2 overflow-hidden">
          <Chat 
            messages={messages} 
            sendMessage={sendMessage} 
            Applicant={Applicant} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
}