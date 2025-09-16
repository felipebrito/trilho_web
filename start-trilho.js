#!/usr/bin/env node

/**
 * Script para iniciar o Trilho Digital
 * Inicia simultaneamente o servidor UDP e o servidor web
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando Trilho Digital...');
console.log('📡 Servidor UDP: porta 8888');
console.log('🌐 Servidor Web: porta 3000');
console.log('🎯 Interface: http://localhost:3000/trilho-final.html');
console.log('');

// Cores para os logs
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Função para colorir logs
function colorLog(color, prefix, message) {
    console.log(`${colors[color]}[${prefix}]${colors.reset} ${message}`);
}

// Iniciar servidor UDP
const udpProcess = spawn('node', ['udp-bridge.js'], {
    cwd: __dirname,
    stdio: 'pipe'
});

// Iniciar servidor web
const webProcess = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'pipe'
});

// Configurar logs do UDP
udpProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
        if (line.includes('UDP Server escutando')) {
            colorLog('green', 'UDP', line);
        } else if (line.includes('UDP Recebido')) {
            colorLog('cyan', 'UDP', line);
        } else if (line.includes('Enviando')) {
            colorLog('blue', 'UDP', line);
        } else {
            colorLog('yellow', 'UDP', line);
        }
    });
});

udpProcess.stderr.on('data', (data) => {
    colorLog('red', 'UDP', data.toString());
});

// Configurar logs do Web
webProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
        if (line.includes('Servidor rodando')) {
            colorLog('green', 'WEB', line);
        } else {
            colorLog('magenta', 'WEB', line);
        }
    });
});

webProcess.stderr.on('data', (data) => {
    colorLog('red', 'WEB', data.toString());
});

// Tratar encerramento dos processos
process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando Trilho Digital...');
    
    udpProcess.kill('SIGINT');
    webProcess.kill('SIGINT');
    
    setTimeout(() => {
        console.log('✅ Trilho Digital encerrado');
        process.exit(0);
    }, 1000);
});

// Tratar erros
udpProcess.on('error', (error) => {
    colorLog('red', 'UDP', `Erro: ${error.message}`);
});

webProcess.on('error', (error) => {
    colorLog('red', 'WEB', `Erro: ${error.message}`);
});

// Mostrar instruções após alguns segundos
setTimeout(() => {
    console.log('');
    colorLog('bright', 'INFO', 'Sistema iniciado com sucesso!');
    console.log('');
    colorLog('cyan', 'INSTRUÇÕES', '1. Abra: http://localhost:3000/trilho-final.html');
    colorLog('cyan', 'INSTRUÇÕES', '2. Clique "📡 UDP ON" para ativar recepção');
    colorLog('cyan', 'INSTRUÇÕES', '3. Envie dados UDP: echo "value 0.5" | nc -u localhost 8888');
    colorLog('cyan', 'INSTRUÇÕES', '4. Pressione Ctrl+C para parar');
    console.log('');
}, 2000);
