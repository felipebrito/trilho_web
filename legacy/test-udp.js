const dgram = require('dgram');

const udpServer = dgram.createSocket('udp4');

console.log('🚀 Teste UDP iniciado na porta 8888');

udpServer.on('message', (msg, rinfo) => {
    try {
        const data = msg.toString();
        console.log(`📡 UDP Recebido: ${data}`);
        
        // Testar regex
        const numberMatch = data.match(/^([\d.]+)$/);
        console.log('🔍 Number match:', numberMatch);
        
        if (numberMatch) {
            const value = parseFloat(numberMatch[1]);
            console.log('🔍 Value:', value);
            console.log('🔍 Is NaN:', isNaN(value));
            console.log('🔍 Fixed 3:', value.toFixed(3));
        } else {
            console.log('❌ No match found');
        }
        
    } catch (error) {
        console.error('Erro:', error);
    }
});

udpServer.bind(8888, () => {
    console.log('✅ UDP Server escutando na porta 8888');
});
