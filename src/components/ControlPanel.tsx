import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export const ControlPanel: React.FC = () => {
  const {
    controlPanel,
    trackConfig,
    udp,
    calibrationMode,
    toggleControlPanel,
    setControlPanelPosition,
    setControlPanelDragging,
    updateTrackConfig,
    setPosition,
    setScale,
    setOffset,
    toggleUDP,
    toggleCalibrationMode,
    resetCalibration,
    saveConfig,
    loadConfig
  } = useAppStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('panel-header')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setControlPanelDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      const newX = Math.max(10, Math.min(window.innerWidth - 250, controlPanel.position.x + deltaX));
      const newY = Math.max(10, Math.min(window.innerHeight - 100, controlPanel.position.y + deltaY));
      setControlPanelPosition(newX, newY);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setControlPanelDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <motion.div
      className={`control-panel ${controlPanel.isCollapsed ? 'collapsed' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'fixed',
        left: controlPanel.position.x,
        top: controlPanel.position.y,
        width: controlPanel.isCollapsed ? 50 : 300,
        background: 'rgba(42, 42, 42, 0.95)',
        border: '1px solid #444',
        borderRadius: '8px',
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'width 0.3s ease'
      }}
      onMouseDown={handleMouseDown}
      animate={{
        width: controlPanel.isCollapsed ? 50 : 300,
        x: controlPanel.position.x,
        y: controlPanel.position.y
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="panel-header" style={{
        background: 'rgba(26, 26, 26, 0.9)',
        padding: '0.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #444',
        cursor: 'move',
        userSelect: 'none',
        borderRadius: '8px 8px 0 0'
      }}>
        <h1 style={{
          flex: 1,
          textAlign: 'center',
          margin: 0,
          fontSize: '1rem',
          color: '#fff',
          cursor: 'move',
          display: controlPanel.isCollapsed ? 'none' : 'block'
        }}>
          Controles
        </h1>
        <button
          className="toggle-panel"
          onClick={toggleControlPanel}
          style={{
            background: '#555',
            color: 'white',
            border: 'none',
            padding: '0.3rem 0.6rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.2s ease'
          }}
        >
          {controlPanel.isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      <AnimatePresence>
        {!controlPanel.isCollapsed && (
          <motion.div
            className="panel-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: '0.8rem',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              maxHeight: '60vh'
            }}
          >
            {/* Status */}
            <div className="section" style={{
              background: '#333',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #555'
            }}>
              <h3 style={{ color: '#007acc', fontSize: '1.1rem', marginBottom: '1rem' }}>
                Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Modo:</span>
                  <span style={{ color: calibrationMode ? '#ffaa00' : '#00ff00' }}>
                    {calibrationMode ? 'Calibração' : 'Uso'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>UDP:</span>
                  <span style={{ color: udp.connected ? '#00ff00' : '#ff0000' }}>
                    {udp.enabled ? (udp.connected ? 'Conectado' : 'Desconectado') : 'Desabilitado'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Posição:</span>
                  <span style={{ color: '#007acc', fontWeight: 'bold' }}>
                    {trackConfig.position.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Controles de Calibração */}
            <div className="section" style={{
              background: '#333',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #555'
            }}>
              <h3 style={{ color: '#007acc', fontSize: '1.1rem', marginBottom: '1rem' }}>
                Calibração
              </h3>
              
              {/* Escala */}
              <div className="control-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                  Escala: <span style={{ color: '#007acc', fontWeight: 'bold' }}>{trackConfig.scale.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.01"
                  value={trackConfig.scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.01"
                  value={trackConfig.scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  style={{
                    width: '80px',
                    padding: '0.25rem 0.5rem',
                    background: '#444',
                    border: '1px solid #666',
                    borderRadius: '3px',
                    color: 'white',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                  }}
                />
              </div>

              {/* Offset X */}
              <div className="control-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                  X: <span style={{ color: '#007acc', fontWeight: 'bold' }}>{trackConfig.offsetX}</span>
                </label>
                <input
                  type="range"
                  min="-5000"
                  max="5000"
                  step="1"
                  value={trackConfig.offsetX}
                  onChange={(e) => setOffset(parseInt(e.target.value), trackConfig.offsetY)}
                  style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                <input
                  type="number"
                  min="-5000"
                  max="5000"
                  step="1"
                  value={trackConfig.offsetX}
                  onChange={(e) => setOffset(parseInt(e.target.value), trackConfig.offsetY)}
                  style={{
                    width: '80px',
                    padding: '0.25rem 0.5rem',
                    background: '#444',
                    border: '1px solid #666',
                    borderRadius: '3px',
                    color: 'white',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                  }}
                />
              </div>

              {/* Offset Y */}
              <div className="control-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                  Y: <span style={{ color: '#007acc', fontWeight: 'bold' }}>{trackConfig.offsetY}</span>
                </label>
                <input
                  type="range"
                  min="-5000"
                  max="5000"
                  step="1"
                  value={trackConfig.offsetY}
                  onChange={(e) => setOffset(trackConfig.offsetX, parseInt(e.target.value))}
                  style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                <input
                  type="number"
                  min="-5000"
                  max="5000"
                  step="1"
                  value={trackConfig.offsetY}
                  onChange={(e) => setOffset(trackConfig.offsetX, parseInt(e.target.value))}
                  style={{
                    width: '80px',
                    padding: '0.25rem 0.5rem',
                    background: '#444',
                    border: '1px solid #666',
                    borderRadius: '3px',
                    color: 'white',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                  }}
                />
              </div>
            </div>

            {/* Controles Rápidos */}
            <div className="section" style={{
              background: '#333',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #555'
            }}>
              <h3 style={{ color: '#007acc', fontSize: '1.1rem', marginBottom: '1rem' }}>
                Controles Rápidos
              </h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => setPosition(0)}
                  style={{
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Reset Pos
                </button>
                <button
                  onClick={() => setOffset(0, 0)}
                  style={{
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Centralizar
                </button>
                <button
                  onClick={toggleCalibrationMode}
                  style={{
                    background: calibrationMode ? '#ff9800' : '#9C27B0',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {calibrationMode ? 'Modo Uso' : 'Modo Calibração'}
                </button>
                <button
                  onClick={toggleUDP}
                  style={{
                    background: udp.enabled ? '#4CAF50' : '#666',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  UDP {udp.enabled ? 'ON' : 'OFF'}
                </button>
                {udp.enabled && (
                  <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                    <button
                      onClick={() => {
                        if (window.sendEncoderData) {
                          window.sendEncoderData(0);
                        }
                      }}
                      style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Test 0%
                    </button>
                    <button
                      onClick={() => {
                        if (window.sendEncoderData) {
                          window.sendEncoderData(0.5);
                        }
                      }}
                      style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Test 50%
                    </button>
                    <button
                      onClick={() => {
                        if (window.sendEncoderData) {
                          window.sendEncoderData(1);
                        }
                      }}
                      style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Test 100%
                    </button>
                  </div>
                )}
                <button
                  onClick={resetCalibration}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Reset
                </button>
                <button
                  onClick={saveConfig}
                  style={{
                    background: '#607D8B',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Salvar
                </button>
                <button
                  onClick={loadConfig}
                  style={{
                    background: '#795548',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Carregar
                </button>
              </div>
            </div>

            {/* Atalhos de Teclado */}
            <div className="section" style={{
              background: '#333',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #555'
            }}>
              <h3 style={{ color: '#007acc', fontSize: '1.1rem', marginBottom: '1rem' }}>
                Atalhos
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: '1.4' }}>
                <div><strong>Tab:</strong> Toggle painel</div>
                <div><strong>←→:</strong> Mover posição</div>
                <div><strong>Ctrl+←→↑↓:</strong> Mover offset</div>
                <div><strong>Ctrl+±:</strong> Zoom</div>
                <div><strong>C:</strong> Toggle calibração</div>
                <div><strong>U:</strong> Toggle UDP</div>
                <div><strong>R:</strong> Reset (calibração)</div>
                <div><strong>Ctrl+S:</strong> Salvar</div>
                <div><strong>Ctrl+O:</strong> Carregar</div>
                <div><strong>Esc:</strong> Sair edição</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

