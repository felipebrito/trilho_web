const dgram = require('dgram');
const WebSocket = require('ws');

// Servidor UDP na porta 8888
const udpServer = dgram.createSocket('udp4');
const wsServer = new WebSocket.Server({ port: 8889 });

console.log('🚀 Bridge UDP → WebSocket iniciado');
console.log('📡 UDP escutando na porta 8888 - AGUARDANDO SEUS DADOS');
console.log('🌐 WebSocket na porta 8889');
console.log('⏸️  Sistema pausado - aguardando encoder...');

// Recebe dados UDP do encoder
udpServer.on('message', (msg, rinfo) => {
    try {
        const data = msg.toString();
        console.log(`📡 UDP Recebido: ${data}`);
        
        // Converte formato "value 0.582" ou apenas "0.582" para JSON
        let value = null;
        
        // Tentar formato "value X.XXX"
        const match = data.match(/value\s+([\d.]+)/);
        if (match) {
            value = parseFloat(match[1]);
        } else {
            // Tentar apenas número (incluindo números com muitas casas decimais)
            const numberMatch = data.match(/^([\d.]+)$/);
            if (numberMatch) {
                value = parseFloat(numberMatch[1]);
            }
        }
        
        if (value !== null && !isNaN(value)) {
            // Limitar a 3 casas decimais
            let normalizedValue = parseFloat(value.toFixed(3));
            
            // Normalizar valor para 0-1 se for maior que 1 (assumindo que valores > 1 são em centímetros)
            if (normalizedValue > 1) {
                // Se o valor for maior que 1, assumir que é em centímetros (0-300cm)
                normalizedValue = Math.max(0, Math.min(1, normalizedValue / 300));
                console.log(`📏 Convertendo ${value}cm para ${normalizedValue.toFixed(3)} (normalizado)`);
            }
            
            const jsonData = {
                type: 'position',
                value: normalizedValue,
                timestamp: Date.now()
            };
            
            console.log(`📤 Enviando: ${JSON.stringify(jsonData)}`);
            
            // Envia para todos os clientes WebSocket conectados
            wsServer.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(jsonData));
                }
            });
        } else {
            console.log('⚠️ Formato não reconhecido:', data);
        }
    } catch (error) {
        console.error('Erro ao processar UDP:', error);
    }
});

udpServer.on('error', (err) => {
    console.error('Erro UDP:', err);
});

udpServer.bind(8888, () => {
    console.log('✅ UDP Server escutando na porta 8888');
});

// WebSocket clients
wsServer.on('connection', (ws) => {
    console.log('🔌 Cliente WebSocket conectado');
    
    ws.on('close', () => {
        console.log('🔌 Cliente WebSocket desconectado');
    });
});
