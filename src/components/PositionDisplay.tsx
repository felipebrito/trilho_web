import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export const PositionDisplay: React.FC = () => {
  const { trackConfig, interactionAreas } = useAppStore();

  return (
    <motion.div
      className="position-display"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '18px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4CAF50' }}>
        Posição: {trackConfig.position.toFixed(1)}%
      </div>
      <div style={{ fontSize: '12px', color: '#ccc' }}>
        Áreas: {interactionAreas.length}
      </div>
    </motion.div>
  );
};

