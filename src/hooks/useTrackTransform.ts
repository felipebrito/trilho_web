import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useTrackTransform = () => {
  const { trackConfig } = useAppStore();

  const transform = useMemo(() => {
    const { scale, offsetX, offsetY, position, imageWidth } = trackConfig;
    
    // Calcular movimento horizontal baseado na parede virtual de 6159px
    // A parede virtual tem 6159px (300cm), a tela tem 1080px
    // O movimento máximo é a diferença: 6159 - 1080 = 5079px
    const maxMovement = imageWidth - 1080; // 5079px (6159 - 1080)
    
    // CORREÇÃO: Se 17.5% representa 100% do movimento, então precisamos ajustar a escala
    // 17.5% = 100% do movimento real, então 100% = 17.5% do movimento real
    const realMaxMovement = maxMovement * 0.175; // 17.5% do movimento total
    const horizontalOffset = (position / 100) * realMaxMovement;
    
    // Aplicar escala e offsets de calibração junto com o movimento
    const translateX = offsetX - horizontalOffset;
    const translateY = offsetY;
    
    return {
      transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
      translateX,
      translateY,
      scale,
      maxMovement: realMaxMovement,
      horizontalOffset
    };
  }, [trackConfig]);

  return transform;
};
