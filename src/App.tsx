import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useUDP } from './hooks/useUDP';
import { BackgroundImage } from './components/BackgroundImage';
import { InteractionArea } from './components/InteractionArea';
import { ControlPanel } from './components/ControlPanel';
import { PositionSlider } from './components/PositionSlider';
import { PositionDisplay } from './components/PositionDisplay';
import { DebugInfo } from './components/DebugInfo';
import { DebugCamera } from './components/DebugCamera';
import { DebugAreas } from './components/DebugAreas';
import { StaticAreaTest } from './components/StaticAreaTest';
import { AreaManager } from './components/AreaManager';
import './App.css';

const App: React.FC = () => {
  const { loadConfig, interactionAreas } = useAppStore();
  
  // Configurar atalhos de teclado
  useKeyboardShortcuts();
  
  // Configurar UDP
  useUDP();

  // Carregar configuração salva na inicialização
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <div className="app">
      {/* Viewport Principal */}
      <div className="main-viewport">
        {/* Imagem de Fundo */}
        <BackgroundImage />
        
        {/* Áreas de Interação */}
        {interactionAreas.map((area) => (
          <InteractionArea key={area.id} area={area} />
        ))}
      </div>

      {/* Painel de Controle */}
      <ControlPanel />

      {/* Slider de Posição */}
      <PositionSlider />

      {/* Display de Posição */}
      <PositionDisplay />

      {/* Debug Info (apenas no modo calibração) */}
      <DebugInfo />

      {/* Debug Camera (apenas no modo calibração) */}
      <DebugCamera />

      {/* Debug Areas (apenas no modo calibração) */}
      <DebugAreas />

      {/* Teste de Área Estática (apenas no modo calibração) */}
      <StaticAreaTest />

      {/* Gerenciador de Áreas (apenas no modo calibração) */}
      <AreaManager />

      {/* Overlay de Instruções (apenas no modo calibração) */}
      <InstructionsOverlay />
    </div>
  );
};

const InstructionsOverlay: React.FC = () => {
  const { calibrationMode } = useAppStore();

  if (!calibrationMode) return null;

  return (
    <motion.div
      className="instructions-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 50,
        textAlign: 'center',
        maxWidth: '600px'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' }}>
        🎯 Modo Calibração Ativo
      </div>
      <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
        Use as setas para mover a posição • Ctrl+setas para ajustar offset • Ctrl+± para zoom • 
        Duplo clique nas áreas para editar • Botão "🎯 Áreas" para gerenciar • Tab para toggle painel • C para sair do modo calibração
        <br/><strong>Debug:</strong> Painéis de debug mostram posições da câmera e áreas em tempo real
      </div>
    </motion.div>
  );
};

export default App;
