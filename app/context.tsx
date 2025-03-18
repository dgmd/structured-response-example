'use client'

import { ReactNode, createContext, useCallback, useContext, useState } from 'react';

// Define types
interface Applicant {
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

interface Message {
  message: string;
  speaker: 'user' | 'bot';
}

interface AppContextType {
  Applicant: Applicant;
  updateApplicant: (updates: Partial<Applicant>) => void;
  messages: Message[];
  sendMessage: (message: string) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create provider
export function AppProvider({ children }: { children: ReactNode }) {
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

  const [messages, setMessages] = useState<Message[]>([]);

  const updateApplicant = useCallback((updates: Partial<Applicant>) => {
    setApplicant(prev => ({ ...prev, ...updates }));
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (message.trim()) {
      setMessages(prev => [...prev, { message, speaker: 'user' }]);
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          message: `AI suggestion for ${Applicant.name || 'your Applicant'}...`, 
          speaker: 'bot' 
        }]);
      }, 1000);
    }
  }, [Applicant.name]);

  return (
    <AppContext.Provider value={{ Applicant, updateApplicant, messages, sendMessage }}>
      {children}
    </AppContext.Provider>
  );
}

// Create hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}