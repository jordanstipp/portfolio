import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const EmojiContext = createContext();
const socket = io(
  import.meta.env.REACT_APP_SERVER_URL || 'http://localhost:4000'
);

export function EmojiProvider({ children }) {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    const handleEmoji = ({ symbol, origin, drift }) => {
      console.log('Received emoji from server:', symbol, origin);
      if (origin?.x != null && origin?.y != null) {
        setEmojis((list) => [
          ...list,
          { id: Date.now() + Math.random(), symbol, origin, drift: drift || 0 },
        ]);
      }
    };
    socket.on('emoji', handleEmoji);
    console.log('Socket connected:', socket.connected);
    return () => {
      console.log('Cleaning up socket listener');
      socket.off('emoji', handleEmoji);
    };
  }, []);

  const sendEmoji = ({ symbol, origin, drift }) => {
    console.log('Sending emoji:', { symbol, origin, drift });
    // setEmojis((list) => [
    //   ...list,
    //   { id: Date.now() + Math.random(), symbol, origin, drift },
    // ]);
    // Emit the emoji to the server
    socket.emit('emoji', { symbol, origin, drift });
  };

  const removeEmoji = (id) => {
    console.log('Removing emoji with id:', id);
    setEmojis((list) => list.filter((e) => e.id !== id));
  };

  return (
    <EmojiContext.Provider value={{ emojis, sendEmoji, removeEmoji }}>
      {children}
    </EmojiContext.Provider>
  );
}

export function useEmoji() {
  return useContext(EmojiContext);
}
