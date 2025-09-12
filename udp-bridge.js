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
        
        // Converte formato "value 0.582" para JSON
        const match = data.match(/value\s+([\d.]+)/);
        if (match) {
            const value = parseFloat(match[1]);
            const jsonData = {
                type: 'position',
                value: value,
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
