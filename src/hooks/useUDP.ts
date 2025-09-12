import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

declare global {
  interface Window {
    udpClient: any;
    sendEncoderData: (position: number) => void;
  }
}

export const useUDP = () => {
  const { udp, setUDPConnected, setPosition } = useAppStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!udp.enabled) {
      // Desconectar se UDP foi desabilitado
      console.log('🔌 Desabilitando UDP - fechando conexões');
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      setUDPConnected(false);
      return;
    }

    // Conectar ao WebSocket bridge
    const connectWebSocket = () => {
      try {
        console.log('🔌 Conectando ao WebSocket UDP...');
        wsRef.current = new WebSocket('ws://localhost:8889');
        
        wsRef.current.onopen = () => {
          // Verificar se UDP ainda está habilitado após conectar
          if (!udp.enabled) {
            console.log('⚠️ UDP foi desabilitado durante conexão, fechando');
            if (wsRef.current) {
              wsRef.current.close();
              wsRef.current = null;
            }
            return;
          }
          console.log('✅ UDP WebSocket conectado');
          setUDPConnected(true);
        };
        
        wsRef.current.onmessage = (event) => {
          // Verificar se UDP ainda está habilitado antes de processar
          if (!udp.enabled) {
            console.log('⚠️ UDP desabilitado, ignorando dados recebidos');
            return;
          }
          
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'position' && typeof data.value === 'number') {
              // Converter posição de 0-1 para 0-100%
              const positionPercent = data.value * 100;
              setPosition(positionPercent);
              console.log(`📡 UDP: Posição recebida ${data.value.toFixed(3)} → ${positionPercent.toFixed(1)}%`);
            }
          } catch (error) {
            console.error('❌ Erro ao processar dados UDP:', error);
          }
        };
        
        wsRef.current.onclose = () => {
          console.log('🔌 UDP WebSocket desconectado');
          setUDPConnected(false);
          
          // Tentar reconectar após 3 segundos
          if (udp.enabled) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('🔄 Tentando reconectar UDP...');
              connectWebSocket();
            }, 3000);
          }
        };
        
        wsRef.current.onerror = (error) => {
          // Só logar erro se UDP ainda estiver habilitado
          if (udp.enabled) {
            console.error('❌ Erro na conexão UDP:', error);
          }
          setUDPConnected(false);
        };
        
      } catch (error) {
        console.error('❌ Erro ao conectar UDP:', error);
        setUDPConnected(false);
      }
    };

    connectWebSocket();

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [udp.enabled, setUDPConnected, setPosition]);

  // Função para testar UDP (modo mock)
  const testUDP = (position: number) => {
    if (window.sendEncoderData) {
      window.sendEncoderData(position);
    } else {
      console.warn('⚠️ Função sendEncoderData não disponível. Certifique-se de que udp-client.js está carregado.');
    }
  };

  return {
    isConnected: udp.connected,
    testUDP
  };
};
