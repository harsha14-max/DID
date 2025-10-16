'use client';

import { motion } from 'framer-motion';

export function CornerCircleBar() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Brain/Thought Icon */}
        <motion.div
          className="w-6 h-6 relative"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Brain shape */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full text-white"
          >
            <path
              d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1.5 4L7 14c-.5 1-.5 2 0 3l1.5 2c1 1 2.5 1.5 4 1.5s3-.5 4-1.5L18 17c.5-1 .5-2 0-3l-.5-2c1-1 1.5-2.5 1.5-4 0-3.5-2.5-6-6-6z"
              fill="currentColor"
              opacity="0.9"
            />
            <path
              d="M9 8c0-1 .5-2 1.5-2s1.5 1 1.5 2-.5 2-1.5 2S9 9 9 8zM15 8c0-1 .5-2 1.5-2s1.5 1 1.5 2-.5 2-1.5 2S15 9 15 8z"
              fill="currentColor"
              opacity="0.7"
            />
          </svg>
        </motion.div>
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-30 blur-sm"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}












