import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import SuccessMessage from '../components/ui/SuccessMessage';

interface MessageContextProps {
  showMessage: (message: string, type: 'success' | 'error') => void;
}

const MessageContext = createContext<MessageContextProps>({
  showMessage: () => {},
});

interface SuccessMessageProviderProps {
  children: ReactNode;
}

export const SuccessMessageProvider: React.FC<SuccessMessageProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const showMessage = (message: string, type: 'success' | 'error') => {
    setMessage(message);
    setMessageType(type);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (message) {
      timeout = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000); // Custom timeout in milliseconds (3 seconds in this example)
    }

    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      {message && <SuccessMessage message={message} type={messageType!} />}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
