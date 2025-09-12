import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppState, TrackConfig, InteractionArea, ControlPanelState, UDPConfig } from '../types';

interface AppStore extends AppState {
  // Track actions
  updateTrackConfig: (config: Partial<TrackConfig>) => void;
  setPosition: (position: number) => void;
  setScale: (scale: number) => void;
  setOffset: (offsetX: number, offsetY: number) => void;
  
  // Interaction areas
  addInteractionArea: (area: Omit<InteractionArea, 'id'>) => void;
  updateInteractionArea: (id: string, updates: Partial<InteractionArea>) => void;
  removeInteractionArea: (id: string) => void;
  setEditingArea: (id: string | null) => void;
  
  // Control panel
  toggleControlPanel: () => void;
  setControlPanelPosition: (x: number, y: number) => void;
  setControlPanelDragging: (dragging: boolean) => void;
  
  // UDP
  toggleUDP: () => void;
  setUDPConnected: (connected: boolean) => void;
  
  // Calibration
  toggleCalibrationMode: () => void;
  resetCalibration: () => void;
  
  // Persistence
  saveConfig: () => void;
  loadConfig: () => void;
}

const defaultTrackConfig: TrackConfig = {
  scale: 5.72,
  offsetX: 446,
  offsetY: 96,
  position: 0,
  imageUrl: 'editor/bg300x200-comtv.jpg',
  imageWidth: 6159, // Largura da parede virtual (300cm)
  imageHeight: 1920 // Altura da tela
};

const defaultControlPanel: ControlPanelState = {
  isCollapsed: false,
  isDragging: false,
  position: { x: 20, y: 20 }
};

const defaultUDP: UDPConfig = {
  enabled: false,
  connected: false,
  port: 8080,
  host: 'localhost'
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      trackConfig: defaultTrackConfig,
      interactionAreas: [
        {
          id: 'default-area',
          x: 658,
          y: 220,
          width: 50,
          height: 50,
          icon: '🎯',
          text: 'Área de Teste'
        }
      ],
      controlPanel: defaultControlPanel,
      udp: defaultUDP,
      calibrationMode: false,

      // Track actions
      updateTrackConfig: (config) =>
        set((state) => ({
          trackConfig: { ...state.trackConfig, ...config }
        })),

      setPosition: (position) =>
        set((state) => ({
          trackConfig: { ...state.trackConfig, position: Math.max(0, Math.min(100, position)) }
        })),

      setScale: (scale) =>
        set((state) => ({
          trackConfig: { ...state.trackConfig, scale: Math.max(0.1, Math.min(10, scale)) }
        })),

      setOffset: (offsetX, offsetY) =>
        set((state) => ({
          trackConfig: { ...state.trackConfig, offsetX, offsetY }
        })),

      // Interaction areas
      addInteractionArea: (area) =>
        set((state) => ({
          interactionAreas: [
            ...state.interactionAreas,
            { ...area, id: `area-${Date.now()}` }
          ]
        })),

      updateInteractionArea: (id, updates) =>
        set((state) => ({
          interactionAreas: state.interactionAreas.map((area) =>
            area.id === id ? { ...area, ...updates } : area
          )
        })),

      removeInteractionArea: (id) =>
        set((state) => ({
          interactionAreas: state.interactionAreas.filter((area) => area.id !== id)
        })),

      setEditingArea: (id) =>
        set((state) => ({
          interactionAreas: state.interactionAreas.map((area) => ({
            ...area,
            isEditing: area.id === id
          }))
        })),

      // Control panel
      toggleControlPanel: () =>
        set((state) => ({
          controlPanel: {
            ...state.controlPanel,
            isCollapsed: !state.controlPanel.isCollapsed
          }
        })),

      setControlPanelPosition: (x, y) =>
        set((state) => ({
          controlPanel: {
            ...state.controlPanel,
            position: { x, y }
          }
        })),

      setControlPanelDragging: (isDragging) =>
        set((state) => ({
          controlPanel: {
            ...state.controlPanel,
            isDragging
          }
        })),

      // UDP
      toggleUDP: () =>
        set((state) => ({
          udp: { ...state.udp, enabled: !state.udp.enabled }
        })),

      setUDPConnected: (connected) =>
        set((state) => ({
          udp: { ...state.udp, connected }
        })),

      // Calibration
      toggleCalibrationMode: () =>
        set((state) => ({
          calibrationMode: !state.calibrationMode
        })),

      resetCalibration: () =>
        set(() => ({
          trackConfig: defaultTrackConfig,
          interactionAreas: [
            {
              id: 'default-area',
              x: 658,
              y: 220,
              width: 50,
              height: 50,
              icon: '🎯',
              text: 'Área de Teste'
            }
          ]
        })),

      // Persistence
      saveConfig: () => {
        const state = get();
        const config = {
          trackConfig: state.trackConfig,
          interactionAreas: state.interactionAreas,
          controlPanel: state.controlPanel,
          udp: state.udp,
          calibrationMode: state.calibrationMode,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('trilho-config', JSON.stringify(config));
        console.log('💾 Configuração salva:', config);
      },

      loadConfig: () => {
        const saved = localStorage.getItem('trilho-config');
        if (saved) {
          try {
            const config = JSON.parse(saved);
            set({
              trackConfig: config.trackConfig || defaultTrackConfig,
              interactionAreas: config.interactionAreas || [],
              controlPanel: config.controlPanel || defaultControlPanel,
              udp: config.udp || defaultUDP,
              calibrationMode: config.calibrationMode || false
            });
            console.log('📂 Configuração carregada:', config);
          } catch (error) {
            console.error('❌ Erro ao carregar configuração:', error);
          }
        }
      }
    }),
    { name: 'trilho-app-store' }
  )
);
