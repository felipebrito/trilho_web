import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useTrackTransform } from '../hooks/useTrackTransform';

export const DebugCamera: React.FC = () => {
  const { trackConfig, calibrationMode } = useAppStore();
  const { transform } = useTrackTransform();

  const cameraInfo = useMemo(() => {
    const { scale, offsetX, offsetY, position } = trackConfig;
    
    // Calcular movimento horizontal baseado na posição
    const maxMovement = 890; // Movimento máximo em pixels
    const horizontalOffset = (position / 100) * maxMovement;
    
    const translateX = offsetX - horizontalOffset;
    const translateY = offsetY;
    
    return {
      scale,
      offsetX,
      offsetY,
      position,
      maxMovement,
      horizontalOffset,
      translateX,
      translateY,
      transform
    };
  }, [trackConfig, transform]);

  if (!calibrationMode) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '11px',
      zIndex: 200,
      fontFamily: 'monospace',
      minWidth: '400px',
      border: '2px solid #ff6b6b'
    }}>
      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '10px', 
        color: '#ff6b6b',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        📹 DEBUG CÂMERA
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Configuração Atual */}
        <div>
          <div style={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '5px' }}>
            📊 Configuração:
          </div>
          <div>Scale: {cameraInfo.scale.toFixed(3)}</div>
          <div>OffsetX: {cameraInfo.offsetX}</div>
          <div>OffsetY: {cameraInfo.offsetY}</div>
          <div>Position: {cameraInfo.position.toFixed(1)}%</div>
        </div>

        {/* Cálculos de Movimento */}
        <div>
          <div style={{ fontWeight: 'bold', color: '#ffaa00', marginBottom: '5px' }}>
            🎬 Movimento:
          </div>
          <div>MaxMovement: {cameraInfo.maxMovement}px</div>
          <div>HorizontalOffset: {cameraInfo.horizontalOffset.toFixed(1)}px</div>
          <div>TranslateX: {cameraInfo.translateX.toFixed(1)}px</div>
          <div>TranslateY: {cameraInfo.translateY}px</div>
        </div>
      </div>

      {/* Transform Aplicada */}
      <div style={{ 
        marginTop: '10px', 
        padding: '8px', 
        background: 'rgba(255, 107, 107, 0.2)', 
        borderRadius: '4px',
        wordBreak: 'break-all'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '3px', color: '#ff6b6b' }}>
          🔄 Transform Aplicada:
        </div>
        <div style={{ fontSize: '10px' }}>{cameraInfo.transform}</div>
      </div>

      {/* Instruções de Teste */}
      <div style={{ 
        marginTop: '10px', 
        padding: '8px', 
        background: 'rgba(0, 122, 204, 0.2)', 
        borderRadius: '4px',
        fontSize: '10px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '3px', color: '#007acc' }}>
          🧪 Teste:
        </div>
        <div>• Use ← → para mover a câmera</div>
        <div>• Observe como translateX muda</div>
        <div>• A área deve ficar FIXA na tela</div>
        <div>• Apenas a imagem de fundo deve se mover</div>
      </div>
    </div>
  );
};

