import { useHotkeys } from 'react-hotkeys-hook';
import { useAppStore } from '../store/useAppStore';

export const useKeyboardShortcuts = () => {
  const {
    toggleControlPanel,
    setPosition,
    setScale,
    setOffset,
    trackConfig,
    toggleCalibrationMode,
    toggleUDP,
    calibrationMode
  } = useAppStore();

  // Toggle control panel (Tab)
  useHotkeys('tab', (e) => {
    e.preventDefault();
    toggleControlPanel();
  });

  // Position controls (Arrow keys)
  useHotkeys('left', (e) => {
    e.preventDefault();
    const step = e.shiftKey ? 5 : 1;
    setPosition(Math.max(0, trackConfig.position - step));
  });

  useHotkeys('right', (e) => {
    e.preventDefault();
    const step = e.shiftKey ? 5 : 1;
    setPosition(Math.min(100, trackConfig.position + step));
  });

  // Scale controls (Ctrl + +/-)
  useHotkeys('ctrl+equal', (e) => {
    e.preventDefault();
    const step = e.shiftKey ? 0.5 : 0.1;
    setScale(Math.min(10, trackConfig.scale + step));
  });

  useHotkeys('ctrl+minus', (e) => {
    e.preventDefault();
    const step = e.shiftKey ? 0.5 : 0.1;
    setScale(Math.max(0.1, trackConfig.scale - step));
  });

  // Offset controls (Ctrl + Arrow keys)
  useHotkeys('ctrl+left', (e) => {
    e.preventDefault();
    const step = e.shiftKey ? 50 : 10;
    setOffset(trackConfig.offsetX - step, trackConfig.offsetY);
  });

  useHotkeys('ctrl+right', (e) => {
    e.preventDefault();
    const step = e.shiftKey ? 50 : 10;
    setOffset(trackConfig.offsetX + step, trackConfig.offsetY);
  });

  useHotkeys('ctrl+up', (e) => {
    e.preventDefault();
    const step = e.shiftKey ? 50 : 10;
    setOffset(trackConfig.offsetX, trackConfig.offsetY - step);
  });

  useHotkeys('ctrl+down', (e) => {
    e.preventDefault();
    const step = e.shiftKey ? 50 : 10;
    setOffset(trackConfig.offsetX, trackConfig.offsetY + step);
  });

  // Toggle calibration mode (C)
  useHotkeys('c', (e) => {
    e.preventDefault();
    toggleCalibrationMode();
  });

  // Toggle UDP (U)
  useHotkeys('u', (e) => {
    e.preventDefault();
    toggleUDP();
  });

  // Reset calibration (R)
  useHotkeys('r', (e) => {
    e.preventDefault();
    if (calibrationMode) {
      useAppStore.getState().resetCalibration();
    }
  });

  // Save config (Ctrl + S)
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    useAppStore.getState().saveConfig();
  });

  // Load config (Ctrl + O)
  useHotkeys('ctrl+o', (e) => {
    e.preventDefault();
    useAppStore.getState().loadConfig();
  });

  // Escape to exit editing mode
  useHotkeys('escape', (e) => {
    e.preventDefault();
    useAppStore.getState().setEditingArea(null);
  });
};

