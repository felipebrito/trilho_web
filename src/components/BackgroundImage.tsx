import React from 'react';
import { motion } from 'framer-motion';
import { useTrackTransform } from '../hooks/useTrackTransform';
import { useAppStore } from '../store/useAppStore';

export const BackgroundImage: React.FC = () => {
  const { trackConfig } = useAppStore();
  const { transform } = useTrackTransform();

  return (
    <motion.div
      className="background-image"
      style={{
        backgroundImage: `url(${trackConfig.imageUrl})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transformOrigin: 'center center'
      }}
      animate={{
        transform: transform
      }}
      transition={{
        type: 'tween',
        duration: 0.1,
        ease: 'easeOut'
      }}
    />
  );
};

