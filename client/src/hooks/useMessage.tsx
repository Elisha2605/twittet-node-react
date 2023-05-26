import { useState, useEffect } from 'react';

interface Message {
  text: string;
  type: 'success' | 'error';
  timer?: number; // Optional timer property
}

export const useMessageHook = (defaultTimer: number = 3000) => {
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (message) {
      const timer = message.timer !== undefined ? message.timer : defaultTimer;
      timeout = setTimeout(() => {
        setMessage(null);
      }, timer);
      clearTimeout(timeout)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [message, defaultTimer]);

  const showMessage = (text: string, type: 'success' | 'error', timer?: number) => {
    setMessage({ text, type, timer });
  };

  return { message, showMessage };
};
