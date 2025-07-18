import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmoji } from '../contexts/EmojiContext';

export default function EmojiShooter() {
  const { emojis, sendEmoji, removeEmoji } = useEmoji();
  const buttonRef = useRef(null);

  const handleClick = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    const origin = {
      // center of the button
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const drift = (Math.random() - 0.5) * 80;
    sendEmoji({ symbol: '❤️', origin, drift });
  };

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
        {/* Button in the lower-right corner */}
        <button
          ref={buttonRef}
          onClick={handleClick}
          className="absolute bottom-5 right-5 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 text-2xl shadow-lg pointer-events-auto"
        >
          ❤️
        </button>

        <AnimatePresence>
          {emojis.map((e) => (
            <motion.div
              key={e.id}
              className="absolute text-2xl"
              style={{
                left: 'calc(100% - 60px)',
                top: 'calc(100% - 60px)',
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: e.drift, y: -300, opacity: 0, scale: 1.3 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              onAnimationComplete={() => removeEmoji(e.id)}
            >
              {e.symbol}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
