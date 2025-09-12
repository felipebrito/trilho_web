import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { InteractionArea } from '../types';

export const useInteractionPosition = (area: InteractionArea) => {
  const { trackConfig } = useAppStore();

  const position = useMemo(() => {
    const { scale, offsetX, offsetY, position: trackPosition, imageWidth } = trackConfig;
    
    // Posição da área na parede virtual (em pixels)
    const imageX = area.x;
    const imageY = area.y;
    
    // Calcular movimento do background baseado na parede virtual de 6159px
    // A parede virtual tem 6159px (300cm), a tela tem 1080px
    // O movimento máximo é a diferença: 6159 - 1080 = 5079px
    const maxMovement = imageWidth - 1080; // 5079px (6159 - 1080)
    
    // CORREÇÃO: Se 17.5% representa 100% do movimento, então precisamos ajustar a escala
    // 17.5% = 100% do movimento real, então 100% = 17.5% do movimento real
    const realMaxMovement = maxMovement * 0.175; // 17.5% do movimento total
    const horizontalOffset = (trackPosition / 100) * realMaxMovement;
    const backgroundTranslateX = offsetX - horizontalOffset;
    
    // Para a área ficar FIXA na tela, ela deve compensar o movimento do background
    // A área se move na direção OPOSTA ao translate do background
    // Aplicar escala e offsets de calibração junto com a compensação
    const screenX = (imageX * scale) + offsetX + horizontalOffset;
    const screenY = (imageY * scale) + offsetY;
    
    // Calcular se a área está visível na viewport
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
      isVisible,
      imageX,
      imageY,
      backgroundTranslateX,
      horizontalOffset,
      maxMovement: realMaxMovement
    };
  }, [area.x, area.y, area.width, area.height, trackConfig.scale, trackConfig.offsetX, trackConfig.offsetY, trackConfig.position, trackConfig.imageWidth]);

  return position;
};
