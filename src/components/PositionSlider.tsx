import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export const PositionSlider: React.FC = () => {
  const { trackConfig, setPosition } = useAppStore();

  return (
    <motion.div
      className="position-slider"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height: '40px',
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '20px',
        padding: '5px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={trackConfig.position}
        onChange={(e) => setPosition(parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: '100%',
          WebkitAppearance: 'none',
          appearance: 'none',
          background: 'transparent',
          outline: 'none',
          cursor: 'pointer'
        }}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          setPosition(parseFloat(target.value));
        }}
      />
      
      {/* Custom slider thumb */}
      <div
        style={{
          position: 'absolute',
          left: `${trackConfig.position}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30px',
          height: '30px',
          background: '#4CAF50',
          borderRadius: '50%',
          pointerEvents: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
      />
    </motion.div>
  );
};

