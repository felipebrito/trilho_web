import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export const AreaManager: React.FC = () => {
  const { 
    interactionAreas, 
    addInteractionArea, 
    removeInteractionArea, 
    calibrationMode 
  } = useAppStore();
  
  const [showManager, setShowManager] = useState(false);

  if (!calibrationMode) return null;

  const handleAddArea = () => {
    const newArea = {
      x: 100, // Posição inicial
      y: 100,
      width: 50,
      height: 50,
      icon: '🎯',
      text: `Área ${interactionAreas.length + 1}`
    };
    
    addInteractionArea(newArea);
  };

  const handleRemoveArea = (id: string) => {
    if (interactionAreas.length > 1) { // Manter pelo menos uma área
      removeInteractionArea(id);
    }
  };

  return (
    <>
      {/* Botão para abrir/fechar o gerenciador */}
      <motion.button
        onClick={() => setShowManager(!showManager)}
        style={{
          position: 'fixed',
          bottom: '200px',
          right: '20px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 150,
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showManager ? '📋 Fechar' : '🎯 Áreas'}
      </motion.button>

      {/* Painel do gerenciador */}
      {showManager && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'fixed',
            bottom: '250px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: 150,
            minWidth: '250px',
            border: '1px solid #444'
          }}
        >
          <div style={{ 
            fontWeight: 'bold', 
            marginBottom: '10px', 
            color: '#4CAF50',
            fontSize: '14px'
          }}>
            🎯 Gerenciar Áreas de Interação
          </div>

          {/* Lista de áreas existentes */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
              Áreas Existentes ({interactionAreas.length}):
            </div>
            {interactionAreas.map((area, index) => (
              <div
                key={area.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '5px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  marginBottom: '3px'
                }}
              >
                <div>
                  <span style={{ marginRight: '5px' }}>{area.icon}</span>
                  <span>{area.text}</span>
                  <div style={{ fontSize: '10px', color: '#ccc' }}>
                    X:{area.x.toFixed(0)}, Y:{area.y.toFixed(0)}
                  </div>
                </div>
                {interactionAreas.length > 1 && (
                  <button
                    onClick={() => handleRemoveArea(area.id)}
                    style={{
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Botões de ação */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddArea}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                flex: 1
              }}
            >
              ➕ Adicionar Área
            </button>
          </div>

          {/* Instruções */}
          <div style={{ 
            marginTop: '10px', 
            padding: '8px', 
            background: 'rgba(0, 122, 204, 0.2)', 
            borderRadius: '4px',
            fontSize: '10px',
            lineHeight: '1.4'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
              💡 Instruções:
            </div>
            <div>• Duplo clique na área para editar</div>
            <div>• Arraste para mover</div>
            <div>• Pressione E para editar rapidamente</div>
            <div>• Esc para sair da edição</div>
          </div>
        </motion.div>
      )}
    </>
  );
};

