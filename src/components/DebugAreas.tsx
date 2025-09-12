import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

export const DebugAreas: React.FC = () => {
  const { interactionAreas, trackConfig, calibrationMode } = useAppStore();

  const areasDebug = useMemo(() => {
    return interactionAreas.map((area, index) => {
      const { scale, offsetX, offsetY, position, imageWidth } = trackConfig;
      
      // Posição da área na parede virtual
      const imageX = area.x;
      const imageY = area.y;
      
      // Calcular movimento do background baseado na parede virtual de 6159px
      const maxMovement = imageWidth - 1080; // 5079px (6159 - 1080)
      const horizontalOffset = (position / 100) * maxMovement;
      const backgroundTranslateX = offsetX - horizontalOffset;
      
      // Para a área ficar FIXA na tela, ela compensa o movimento do background
      const screenX = (imageX * scale) + offsetX + horizontalOffset;
      const screenY = (imageY * scale) + offsetY;
      
      return {
        id: area.id,
        text: area.text,
        imagePos: { x: imageX, y: imageY },
        screenPos: { x: screenX, y: screenY },
        backgroundTranslateX: backgroundTranslateX,
        horizontalOffset: horizontalOffset,
        maxMovement: maxMovement,
        scale: scale,
        width: area.width * scale,
        height: area.height * scale
      };
    });
  }, [interactionAreas, trackConfig.scale, trackConfig.offsetX, trackConfig.offsetY, trackConfig.position, trackConfig.imageWidth]);

  if (!calibrationMode) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '11px',
      zIndex: 200,
      fontFamily: 'monospace',
      minWidth: '300px',
      border: '2px solid #4CAF50'
    }}>
      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '10px', 
        color: '#4CAF50',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        🎯 DEBUG ÁREAS
      </div>

      {areasDebug.map((area, index) => (
        <div key={area.id} style={{
          marginBottom: '10px',
          padding: '8px',
          background: 'rgba(76, 175, 80, 0.2)',
          borderRadius: '4px',
          border: '1px solid #4CAF50'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#4CAF50' }}>
            Área {index + 1}: {area.text}
          </div>
          
          <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
            <div><strong>Parede Virtual:</strong> X:{area.imagePos.x.toFixed(1)}, Y:{area.imagePos.y.toFixed(1)}</div>
            <div><strong>Área Tela:</strong> X:{area.screenPos.x.toFixed(1)}, Y:{area.screenPos.y.toFixed(1)}</div>
            <div><strong>Background:</strong> translateX:{area.backgroundTranslateX.toFixed(1)}</div>
            <div><strong>Compensação:</strong> +{area.horizontalOffset.toFixed(1)}</div>
            <div><strong>Scale:</strong> {area.scale.toFixed(3)}</div>
            <div><strong>Max Movement:</strong> {area.maxMovement.toFixed(1)}px (6159-1080)</div>
            <div><strong>Tamanho:</strong> {area.width.toFixed(1)}x{area.height.toFixed(1)}</div>
          </div>
        </div>
      ))}

      <div style={{ 
        marginTop: '10px', 
        padding: '8px', 
        background: 'rgba(0, 122, 204, 0.2)', 
        borderRadius: '4px',
        fontSize: '10px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '3px', color: '#007acc' }}>
          💡 Observação:
        </div>
        <div>• As posições da tela devem ser FIXAS</div>
        <div>• Não devem mudar quando mover o trilho</div>
        <div>• Se mudarem, há problema no cálculo</div>
      </div>
    </div>
  );
};
