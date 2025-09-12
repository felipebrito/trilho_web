const dgram = require('dgram');
const WebSocket = require('ws');

// Servidor UDP na porta 8888
const udpServer = dgram.createSocket('udp4');
const wsServer = new WebSocket.Server({ port: 8889 });

console.log('🚀 DEBUG WINDOWS - Bridge UDP → WebSocket iniciado');
console.log('📡 UDP escutando na porta 8888 - AGUARDANDO SEUS DADOS');
console.log('🌐 WebSocket na porta 8889');
console.log('⏸️  Sistema pausado - aguardando encoder...');

// Recebe dados UDP do encoder
udpServer.on('message', (msg, rinfo) => {
    try {
        const data = msg.toString();
        console.log(`\n🔍 DEBUG WINDOWS - UDP Recebido: "${data}"`);
        console.log(`🔍 DEBUG WINDOWS - Tipo: ${typeof data}`);
        console.log(`🔍 DEBUG WINDOWS - Length: ${data.length}`);
        console.log(`🔍 DEBUG WINDOWS - Bytes: [${Array.from(data).map(b => b.charCodeAt(0)).join(', ')}]`);
        
        // Converte formato "value 0.582" ou apenas "0.582" para JSON
        let value = null;
        
        console.log('🔍 DEBUG WINDOWS - Testando regex "value X.XXX"...');
        // Tentar formato "value X.XXX"
        const match = data.match(/value\s+([\d.]+)/);
        console.log('🔍 DEBUG WINDOWS - Match "value":', match);
        if (match) {
            value = parseFloat(match[1]);
            console.log('🔍 DEBUG WINDOWS - Value from match:', value);
        } else {
            console.log('🔍 DEBUG WINDOWS - Testando regex número direto...');
            // Tentar apenas número (incluindo números com muitas casas decimais)
            const numberMatch = data.match(/^([\d.]+)$/);
            console.log('🔍 DEBUG WINDOWS - Match number:', numberMatch);
            if (numberMatch) {
                value = parseFloat(numberMatch[1]);
                console.log('🔍 DEBUG WINDOWS - Value from number:', value);
                console.log('🔍 DEBUG WINDOWS - Is NaN:', isNaN(value));
                console.log('🔍 DEBUG WINDOWS - Fixed 3:', value.toFixed(3));
            } else {
                console.log('❌ DEBUG WINDOWS - Nenhum regex funcionou!');
                console.log('❌ DEBUG WINDOWS - Dados brutos:', JSON.stringify(data));
            }
        }
        
        if (value !== null && !isNaN(value)) {
            console.log('✅ DEBUG WINDOWS - Valor válido encontrado:', value);
            
            // ARREDONDAR PRIMEIRO para 3 casas decimais, DEPOIS processar
            let normalizedValue = parseFloat(value.toFixed(3));
            console.log('✅ DEBUG WINDOWS - Valor arredondado:', normalizedValue);
            
            // Normalizar valor para 0-1 se for maior que 1 (assumindo que valores > 1 são em centímetros)
            if (normalizedValue > 1) {
                // Se o valor for maior que 1, assumir que é em centímetros (0-300cm)
                const originalValue = normalizedValue;
                normalizedValue = Math.max(0, Math.min(1, normalizedValue / 300));
                console.log(`📏 DEBUG WINDOWS - Convertendo ${originalValue}cm para ${normalizedValue.toFixed(3)} (normalizado)`);
            }
            
            const jsonData = {
                type: 'position',
                value: normalizedValue,
                timestamp: Date.now()
            };
            
            console.log(`📤 DEBUG WINDOWS - Enviando: ${JSON.stringify(jsonData)}`);
            
            // Envia para todos os clientes WebSocket conectados
            wsServer.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(jsonData));
                    console.log('📤 DEBUG WINDOWS - Dados enviados via WebSocket');
                }
            });
        } else {
            console.log('⚠️ DEBUG WINDOWS - Formato não reconhecido:', data);
            console.log('⚠️ DEBUG WINDOWS - Value é null ou NaN');
        }
    } catch (error) {
        console.error('❌ DEBUG WINDOWS - Erro ao processar UDP:', error);
        console.error('❌ DEBUG WINDOWS - Stack trace:', error.stack);
    }
});

udpServer.on('error', (err) => {
    console.error('❌ DEBUG WINDOWS - Erro UDP:', err);
});

udpServer.bind(8888, () => {
    console.log('✅ DEBUG WINDOWS - UDP Server escutando na porta 8888');
});

// WebSocket clients
wsServer.on('connection', (ws) => {
    console.log('🔌 DEBUG WINDOWS - Cliente WebSocket conectado');
    
    ws.on('close', () => {
        console.log('🔌 DEBUG WINDOWS - Cliente WebSocket desconectado');
    });
    
    ws.on('error', (err) => {
        console.error('❌ DEBUG WINDOWS - Erro WebSocket:', err);
    });
});

// Log de status a cada 10 segundos
setInterval(() => {
    console.log('📊 DEBUG WINDOWS - Status: UDP ativo, WebSocket clients:', wsServer.clients.size);
}, 10000);
