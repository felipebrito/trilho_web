export interface TrackConfig {
  scale: number;
  offsetX: number;
  offsetY: number;
  position: number; // 0-100%
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface InteractionArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  text: string;
  isEditing?: boolean;
  isDragging?: boolean;
}

export interface ControlPanelState {
  isCollapsed: boolean;
  isDragging: boolean;
  position: { x: number; y: number };
}

export interface UDPConfig {
  enabled: boolean;
  connected: boolean;
  port: number;
  host: string;
}

export interface AppState {
  trackConfig: TrackConfig;
  interactionAreas: InteractionArea[];
  controlPanel: ControlPanelState;
  udp: UDPConfig;
  calibrationMode: boolean;
}

