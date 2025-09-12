import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const StaticAreaTest: React.FC = () => {
  const { trackConfig, calibrationMode } = useAppStore();
  const [positions, setPositions] = useState<{ x: number; y: number; timestamp: number }[]>([]);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (!calibrationMode) return;

    const { scale, offsetX, offsetY, position, imageWidth } = trackConfig;
    
    // Posição fixa na parede virtual
    const testImageX = 658; // Posição fixa na parede virtual
    const testImageY = 220;
    
    // Calcular movimento do background baseado na parede virtual de 6159px
    const maxMovement = imageWidth - 1080; // 5079px (6159 - 1080)
    const horizontalOffset = (position / 100) * maxMovement;
    
    // Para a área ficar FIXA na tela, ela compensa o movimento do background
    const screenX = (testImageX * scale) + offsetX + horizontalOffset;
    const screenY = (testImageY * scale) + offsetY;
    
    const newPosition = { x: screenX, y: screenY, timestamp: Date.now() };
    
    setPositions(prev => {
      const updated = [...prev, newPosition].slice(-10); // Manter últimas 10 posições
      
      // Verificar se está se movendo (NÃO deve se mover)
      if (updated.length > 1) {
        const last = updated[updated.length - 1];
        const previous = updated[updated.length - 2];
        const moved = Math.abs(last.x - previous.x) > 0.1 || Math.abs(last.y - previous.y) > 0.1;
        setIsMoving(moved);
      }
      
      return updated;
    });
  }, [trackConfig, calibrationMode]);

  if (!calibrationMode) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '20px',
      transform: 'translateY(-50%)',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '11px',
      zIndex: 200,
      fontFamily: 'monospace',
      minWidth: '250px',
      border: `2px solid ${isMoving ? '#ff6b6b' : '#4CAF50'}`
    }}>
      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '10px', 
        color: isMoving ? '#ff6b6b' : '#4CAF50',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        {isMoving ? '❌ ÁREA SE MOVENDO' : '✅ ÁREA FIXA'}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontWeight: 'bold', color: '#ffaa00', marginBottom: '5px' }}>
          📊 Posições Recentes:
        </div>
        {positions.slice(-5).map((pos, index) => (
          <div key={index} style={{ fontSize: '10px', marginBottom: '2px' }}>
            {index + 1}: X:{pos.x.toFixed(1)}, Y:{pos.y.toFixed(1)}
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '10px', 
        padding: '8px', 
        background: isMoving ? 'rgba(255, 107, 107, 0.2)' : 'rgba(76, 175, 80, 0.2)', 
        borderRadius: '4px',
        fontSize: '10px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
          {isMoving ? '⚠️ PROBLEMA:' : '✅ CORRETO:'}
        </div>
        <div>
          {isMoving 
            ? 'A área está se movendo (INCORRETO)'
            : 'A área está fixa na tela (CORRETO)'
          }
        </div>
      </div>

      <div style={{ 
        marginTop: '10px', 
        padding: '8px', 
        background: 'rgba(0, 122, 204, 0.2)', 
        borderRadius: '4px',
        fontSize: '10px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '3px', color: '#007acc' }}>
          🧪 Teste Câmera:
        </div>
        <div>• Mova o trilho com as setas</div>
        <div>• VERDE = câmera se movendo (correto)</div>
        <div>• VERMELHO = câmera parada (problema)</div>
        <div>• Área fica fixa no espaço da imagem</div>
      </div>
    </div>
  );
};
