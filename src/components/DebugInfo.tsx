import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

// Componente separado para cada área de interação
const DebugAreaInfo: React.FC<{ area: any; index: number }> = ({ area, index }) => {
  const { trackConfig } = useAppStore();
  
  const position = useMemo(() => {
    const { scale, offsetX, offsetY, position: trackPosition, imageWidth } = trackConfig;
    
    // Posição da área na imagem original (em pixels)
    const imageX = area.x;
    const imageY = area.y;
    
    // Calcular movimento do background baseado na parede virtual de 6159px
    const maxMovement = imageWidth - 1080; // 5079px (6159 - 1080)
    const realMaxMovement = maxMovement * 0.175; // 17.5% do movimento total
    const horizontalOffset = (trackPosition / 100) * realMaxMovement;
    
    // Aplicar escala e offset base junto com compensação do movimento
    const screenX = (imageX * scale) + offsetX + horizontalOffset;
    const screenY = (imageY * scale) + offsetY;
    
    // Calcular se a área está visível na tela
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const areaWidth = area.width * scale;
    const areaHeight = area.height * scale;
    
    const isVisible = screenX < screenWidth && 
                     screenX + areaWidth > 0 && 
                     screenY < screenHeight && 
                     screenY + areaHeight > 0;
    
    return {
      x: screenX,
      y: screenY,
      scale: scale,
      width: areaWidth,
      height: areaHeight,
      isVisible
    };
  }, [area.x, area.y, area.width, area.height, trackConfig.scale, trackConfig.offsetX, trackConfig.offsetY, trackConfig.position, trackConfig.imageWidth]);

  return (
    <div style={{ 
      marginBottom: '3px', 
      padding: '2px',
      background: position.isVisible ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
      borderRadius: '3px'
    }}>
      <div><strong>Área {index + 1}:</strong> {area.text}</div>
      <div>Imagem: X:{area.x.toFixed(1)}, Y:{area.y.toFixed(1)}</div>
      <div>Tela: X:{position.x.toFixed(1)}, Y:{position.y.toFixed(1)}</div>
      <div>Visível: {position.isVisible ? '✅' : '❌'}</div>
      <div>Tamanho: {position.width.toFixed(1)}x{position.height.toFixed(1)}</div>
    </div>
  );
};

export const DebugInfo: React.FC = () => {
  const { trackConfig, interactionAreas, calibrationMode } = useAppStore();
  
  if (!calibrationMode) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '120px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 200,
      fontFamily: 'monospace'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#4CAF50' }}>
        🐛 Debug Info
      </div>
      
      <div style={{ marginBottom: '3px' }}>
        <strong>Trilho:</strong> {trackConfig.position.toFixed(1)}%
      </div>
      
      <div style={{ marginBottom: '3px' }}>
        <strong>Scale:</strong> {trackConfig.scale.toFixed(3)}
      </div>
      
      <div style={{ marginBottom: '3px' }}>
        <strong>Offset:</strong> X:{trackConfig.offsetX}, Y:{trackConfig.offsetY}
      </div>
      
      <div style={{ marginBottom: '5px' }}>
        <strong>Áreas:</strong> {interactionAreas.length}
      </div>
      
      {interactionAreas.map((area, index) => (
        <DebugAreaInfo key={area.id} area={area} index={index} />
      ))}
    </div>
  );
};
