import React, { useState, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { InteractionArea as InteractionAreaType } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useInteractionPosition } from '../hooks/useInteractionPosition';

interface InteractionAreaProps {
  area: InteractionAreaType;
}

export const InteractionArea: React.FC<InteractionAreaProps> = ({ area }) => {
  const { updateInteractionArea, setEditingArea, trackConfig } = useAppStore();
  const position = useInteractionPosition(area);
  const [isHovered, setIsHovered] = useState(false);
  const dragControls = useDragControls();
  const areaRef = useRef<HTMLDivElement>(null);

  const handleDrag = (event: any, info: any) => {
    // Converter movimento da tela de volta para posição na imagem
    const { scale, offsetX, offsetY, position: trackPosition, imageWidth } = trackConfig;
    const maxMovement = imageWidth - 1080; // 5079px (6159 - 1080)
    const realMaxMovement = maxMovement * 0.175; // 17.5% do movimento total
    const horizontalOffset = (trackPosition / 100) * realMaxMovement;
    const translateX = offsetX - horizontalOffset;
    const translateY = offsetY;
    
    const newScreenX = position.x + info.offset.x;
    const newScreenY = position.y + info.offset.y;
    
    // Converter de volta para coordenadas da imagem
    const newImageX = (newScreenX - translateX) / scale;
    const newImageY = (newScreenY - translateY) / scale;
    
    updateInteractionArea(area.id, {
      x: newImageX,
      y: newImageY,
      isDragging: true
    });
  };

  const handleDragEnd = () => {
    updateInteractionArea(area.id, {
      isDragging: false
    });
  };

  const handleDoubleClick = () => {
    setEditingArea(area.id);
  };

  const handleClick = () => {
    if (!area.isEditing) {
      console.log('🎮 Interação com área:', area.text);
      // Aqui você pode adicionar lógica de interação
    }
  };

  // Não renderizar se não estiver visível
  if (!position.isVisible) {
    return null;
  }

  return (
    <motion.div
      ref={areaRef}
      className={`interaction-area ${area.isEditing ? 'editing' : ''} ${area.isDragging ? 'dragging' : ''}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        zIndex: 20
      }}
      drag
      dragControls={dragControls}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        borderColor: area.isEditing ? '#00ff00' : isHovered ? '#ffff00' : '#ff0000',
        boxShadow: area.isEditing 
          ? '0 0 15px rgba(0, 255, 0, 0.7)'
          : isHovered 
          ? '0 0 10px rgba(255, 255, 0, 0.5)'
          : 'none'
      }}
      transition={{ duration: 0.1 }}
    >
      <div className="interaction-icon" style={{ 
        fontSize: `${30 * position.scale}px`, 
        marginBottom: `${5 * position.scale}px` 
      }}>
        {area.icon}
      </div>
      <div className="interaction-text" style={{ 
        fontSize: `${8 * position.scale}px`, 
        fontWeight: 'bold', 
        color: 'white' 
      }}>
        {area.text}
      </div>
      
      {area.isEditing && (
        <InteractionEditor area={area} />
      )}
    </motion.div>
  );
};

interface InteractionEditorProps {
  area: InteractionAreaType;
}

const InteractionEditor: React.FC<InteractionEditorProps> = ({ area }) => {
  const { updateInteractionArea, setEditingArea } = useAppStore();
  const [formData, setFormData] = useState({
    icon: area.icon,
    text: area.text,
    width: area.width,
    height: area.height
  });

  const handleSave = () => {
    updateInteractionArea(area.id, {
      ...formData,
      isEditing: false
    });
  };

  const handleCancel = () => {
    setEditingArea(null);
  };

  return (
    <motion.div
      className="interaction-editor"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        position: 'absolute',
        top: -60,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid #00ff00',
        borderRadius: '8px',
        padding: '10px',
        zIndex: 40,
        minWidth: '200px'
      }}
    >
      <input
        type="text"
        value={formData.icon}
        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
        placeholder="Ícone (emoji)"
        style={{
          width: '100%',
          padding: '5px',
          margin: '5px 0',
          border: '1px solid #555',
          background: '#222',
          color: 'white',
          borderRadius: '3px',
          fontSize: '12px'
        }}
      />
      <input
        type="text"
        value={formData.text}
        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        placeholder="Texto"
        style={{
          width: '100%',
          padding: '5px',
          margin: '5px 0',
          border: '1px solid #555',
          background: '#222',
          color: 'white',
          borderRadius: '3px',
          fontSize: '12px'
        }}
      />
      <input
        type="number"
        value={formData.width}
        onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 0 })}
        placeholder="Largura (px)"
        style={{
          width: '100%',
          padding: '5px',
          margin: '5px 0',
          border: '1px solid #555',
          background: '#222',
          color: 'white',
          borderRadius: '3px',
          fontSize: '12px'
        }}
      />
      <input
        type="number"
        value={formData.height}
        onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
        placeholder="Altura (px)"
        style={{
          width: '100%',
          padding: '5px',
          margin: '5px 0',
          border: '1px solid #555',
          background: '#222',
          color: 'white',
          borderRadius: '3px',
          fontSize: '12px'
        }}
      />
      <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
        <button
          onClick={handleSave}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          💾 Salvar
        </button>
        <button
          onClick={handleCancel}
          style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          ❌ Cancelar
        </button>
      </div>
    </motion.div>
  );
};
