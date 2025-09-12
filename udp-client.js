/**
 * Cliente UDP para receber dados do encoder do trilho
 * Simula recepção de dados via UDP na porta 8888
 */

class UDPClient {
    constructor() {
        this.isConnected = false;
        this.position = 0; // Posição normalizada (0-1)
        this.callbacks = [];
        this.mockMode = false; // Modo real - ouvindo seus dados
        this.mockPosition = 0;
        this.mockDirection = 1;
        this.mockSpeed = 0.001;
        
        this.init();
    }
    
    init() {
        // Sempre inicia em modo mock para evitar erros de conexão
        this.mockMode = true;
        this.startMockData();
    }
    
    /**
     * Inicia o modo mock para desenvolvimento
     * Simula movimento automático do trilho
     */
    startMockData() {
        console.log('UDP Client: Modo mock ativado - AGUARDANDO SEUS DADOS');
        console.log('UDP Client: Use sendEncoderData(position) no console para testar');
        console.log('UDP Client: Exemplo: sendEncoderData(0.5) para posição 50%');
        this.isConnected = true;
        
        // NÃO inicia animação automática - aguarda dados externos
        // Para testar, use: sendEncoderData(0.5) no console
    }
    
    /**
     * Inicia o listener UDP real (para produção)
     */
    startUDPListener() {
        console.log('UDP Client: Conectando ao WebSocket...');
        
        try {
            // Conecta via WebSocket (bridge UDP → WebSocket)
            this.ws = new WebSocket('ws://localhost:8889');
            
            this.ws.onopen = () => {
                console.log('UDP Client: Conectado via WebSocket');
                this.isConnected = true;
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'position' && typeof data.value === 'number') {
                        this.updatePosition(data.value);
                    }
                } catch (error) {
                    console.error('Erro ao processar dados UDP:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('UDP Client: Conexão fechada');
                this.isConnected = false;
                // Tenta reconectar após 3 segundos
                setTimeout(() => this.startUDPListener(), 3000);
            };
            
            this.ws.onerror = (error) => {
                console.error('Erro na conexão UDP:', error);
                this.isConnected = false;
            };
            
        } catch (error) {
            console.error('Erro ao iniciar UDP Client:', error);
            // Fallback para modo mock se WebSocket falhar
            this.mockMode = true;
            this.startMockData();
        }
    }
    
    /**
     * Atualiza a posição e notifica os callbacks
     * @param {number} position - Posição normalizada (0-1)
     */
    updatePosition(position) {
        const oldPosition = this.position;
        this.position = Math.max(0, Math.min(1, position));
        
        // Log detalhado dos dados recebidos
        console.log(`📡 UDP: ${position.toFixed(3)} → ${this.position.toFixed(3)} (${this.normalizedToCentimeters(this.position).toFixed(1)}cm)`);
        
        // Notifica todos os callbacks registrados
        this.callbacks.forEach(callback => {
            try {
                callback(this.position);
            } catch (error) {
                console.error('Erro no callback UDP:', error);
            }
        });
    }
    
    /**
     * Registra um callback para receber atualizações de posição
     * @param {Function} callback - Função que recebe a posição (0-1)
     */
    onPositionUpdate(callback) {
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        }
    }
    
    /**
     * Remove um callback
     * @param {Function} callback - Callback a ser removido
     */
    removeCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }
    
    /**
     * Converte posição normalizada para centímetros
     * @param {number} normalizedPosition - Posição normalizada (0-1)
     * @returns {number} Posição em centímetros (0-300)
     */
    normalizedToCentimeters(normalizedPosition) {
        return normalizedPosition * 300; // Trilho de 300cm
    }
    
    /**
     * Converte posição em centímetros para normalizada
     * @param {number} centimeters - Posição em centímetros (0-300)
     * @returns {number} Posição normalizada (0-1)
     */
    centimetersToNormalized(centimeters) {
        return Math.max(0, Math.min(1, centimeters / 300));
    }
    
    /**
     * Obtém a posição atual em centímetros
     * @returns {number} Posição atual em centímetros
     */
    getCurrentPositionInCentimeters() {
        return this.normalizedToCentimeters(this.position);
    }
    
    /**
     * Obtém a posição atual normalizada
     * @returns {number} Posição atual normalizada (0-1)
     */
    getCurrentPosition() {
        return this.position;
    }
    
    /**
     * Verifica se está conectado
     * @returns {boolean} Status da conexão
     */
    isConnectedToEncoder() {
        return this.isConnected;
    }
    
    /**
     * Ativa/desativa o modo mock
     * @param {boolean} enabled - Se deve ativar o modo mock
     */
    setMockMode(enabled) {
        this.mockMode = enabled;
        if (enabled) {
            this.startMockData();
        }
    }
    
    /**
     * Define a velocidade do mock
     * @param {number} speed - Velocidade do movimento (0.001 = lento, 0.01 = rápido)
     */
    setMockSpeed(speed) {
        this.mockSpeed = Math.max(0.0001, Math.min(0.1, speed));
    }
    
    /**
     * Define a posição manual do mock (para testes)
     * @param {number} position - Posição normalizada (0-1)
     */
    setMockPosition(position) {
        this.mockPosition = Math.max(0, Math.min(1, position));
        this.updatePosition(this.mockPosition);
    }
    
    /**
     * Recebe dados externos do encoder
     * @param {number} position - Posição normalizada (0-1)
     */
    receiveData(position) {
        console.log(`📡 Dados recebidos do encoder: ${position}`);
        this.isConnected = true;
        this.updatePosition(position);
    }
}

// Instância global do cliente UDP
window.udpClient = new UDPClient();

// Função global para enviar dados do encoder
window.sendEncoderData = (position) => {
    window.udpClient.receiveData(position);
};
