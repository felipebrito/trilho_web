# Trilho Digital

Sistema de calibração e controle de posicionamento de imagens via UDP para aplicações de trilho digital.

## 🚀 Início Rápido

### Instalação
```bash
npm install
```

### Executar
```bash
npm run trilho
```

Este comando inicia automaticamente:
- **Servidor UDP** (porta 8888) - recebe dados do encoder
- **Servidor Web** (porta 3000) - interface de calibração
- **Bridge UDP→WebSocket** (porta 8889) - comunicação em tempo real

## 📁 Estrutura do Projeto

```
trilho_web/
├── trilho-final.html          # Interface principal (HTML/JS)
├── src/                       # Versão React/TypeScript
├── examples/                  # Exemplos e demos
├── docs/                      # Documentação
├── legacy/                    # Arquivos legados
├── server.js                  # Servidor web
├── udp-bridge.js             # Bridge UDP→WebSocket
├── udp-client.js             # Cliente UDP para web
├── start-trilho.js           # Script de inicialização
└── package.json              # Dependências e scripts
```

## 🎮 Funcionalidades

### Modo Calibração
- **Ajuste de escala** (zoom) da imagem
- **Posicionamento** (offset X/Y) da imagem
- **Posição horizontal** (0-100%) via slider
- **Controles de sensibilidade** para mouse/touch
- **Atalhos de teclado** para ajustes precisos
- **Salvamento** automático no localStorage

### Modo Uso
- **Recebimento UDP** em tempo real
- **Interpolação GSAP** para movimento suave 60fps
- **Controle manual** via mouse/touch (quando UDP desabilitado)
- **Zoom** via scroll/pinch
- **Ativação/desativação** do UDP

## ⌨️ Atalhos de Teclado

### Modo Calibração
- **Setas**: Mover imagem
- **Shift + Setas**: Movimento rápido
- **+/-**: Zoom in/out
- **R**: Reset para valores padrão
- **C**: Alternar modo (calibração ↔ uso)
- **S**: Salvar alterações
- **ESC**: Sair sem salvar

### Modo Uso
- **P**: Toggle UDP ON/OFF
- **C**: Voltar para modo calibração

## 🔧 Configuração

### Valores Padrão
```javascript
{
  scale: 5.72,      // Zoom da imagem
  offsetX: 446,     // Posição horizontal
  offsetY: 96,      // Posição vertical
  position: 0       // Posição do slider (0-100%)
}
```

### Sensibilidades
- **Arrastar**: 0.05 (padrão)
- **Zoom**: 0.02 (padrão)
- **Interpolação**: 0.3s (duração)
- **Easing**: power2.out (suavização)

## 📡 Protocolo UDP

### Formato dos Dados
- **Porta**: 8888
- **Formato**: JSON
- **Campo**: `position` (0.0 a 1.0)

### Exemplo
```javascript
{
  "position": 0.5  // 50% da posição
}
```

## 🛠️ Desenvolvimento

### Scripts Disponíveis
```bash
npm run trilho    # Iniciar sistema completo
npm run udp       # Apenas servidor UDP
npm run serve     # Apenas servidor web
npm run run       # Script personalizado
```

### Dependências Principais
- **Express**: Servidor web
- **Socket.io**: WebSocket para comunicação
- **GSAP**: Animação e interpolação
- **Concurrently**: Execução paralela

## 📚 Documentação

- [Guia de Instalação](docs/INSTALACAO.md)
- [Como Usar](docs/COMO_USAR.md)
- [Calibração](docs/CALIBRACAO.md)
- [Comportamento das Áreas](docs/COMPORTAMENTO_AREAS.md)
- [Guia de Áreas](docs/GUIA_AREAS.md)

## 🎯 Exemplos

- [Demo Básico](examples/demo.html)
- [Marshal](examples/marshal.html)
- [Teste Simples](examples/simple.html)
- [Trilho Simples](examples/trilho-simples.html)

## 🔄 Versões

### HTML/JS (trilho-final.html)
- ✅ Interface principal
- ✅ Controles completos
- ✅ UDP em tempo real
- ✅ Interpolação GSAP
- ✅ Mouse/touch drag
- ✅ Atalhos de teclado

### React/TypeScript (src/)
- 🔄 Em desenvolvimento
- 🔄 Componentes modulares
- 🔄 Estado global
- 🔄 Hooks personalizados

## 🐛 Solução de Problemas

### Tela Preta
- Verifique se o UDP está recebendo dados
- Teste com `sendEncoderData(0.5)` no console
- Verifique se a posição UDP é válida (0-1)

### Imagem Não Aparece
- Verifique os valores de `offsetX` e `offsetY`
- Teste com valores padrão (446, 96)
- Verifique se `scale` não está muito baixo

### UDP Não Funciona
- Verifique se o servidor UDP está rodando
- Teste a conexão WebSocket
- Verifique se está no modo "uso"

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma [issue](https://github.com/felipebrito/trilho_web/issues) no GitHub.
