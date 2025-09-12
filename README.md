# Trilho Digital - TV Vertical

Uma aplicação web interativa que transforma uma TV vertical de 42" em uma "janela digital" que se move sobre um trilho físico, criando a sensação de realidade aumentada física + digital.

## 🎯 Características

- **TV Vertical**: Otimizado para TV 42" em posição vertical (9:16)
- **Trilho Físico**: Sincronização com encoder de 3 metros
- **Calibração Precisa**: Editor para alinhar conteúdo digital com arte impressa
- **Conteúdo Interativo**: Hotspots, textos, vídeos e animações
- **Animações Fluidas**: Biblioteca GSAP para transições suaves
- **Modo Mock**: Simulação para desenvolvimento sem hardware

## 🚀 Como Usar

### 1. Modo Editor (Calibração)

1. **Importar Arte**: Use o botão "Arte Impressa" para carregar a imagem que está impressa na parede
2. **Calibrar Posição**: 
   - Ajuste a escala com o slider "Escala"
   - Use os controles "Offset X" e "Offset Y" para posicionar
   - Arraste a viewport azul diretamente na imagem para ajuste fino
3. **Salvar Configuração**: Clique em "Salvar Configuração" para baixar o arquivo JSON
4. **Alternar Modo**: Clique em "Modo Execução" para testar

### 2. Modo Execução

1. **Visualização**: A tela mostra a "janela digital" movendo-se sobre a arte
2. **Controles**:
   - **Espaço**: Pausar/retomar animação
   - **Setas ← →**: Controlar posição manualmente
   - **Ctrl/Cmd + E**: Voltar ao editor
3. **Interação**: Clique nos hotspots azuis para ver informações

## 🎮 Controles de Teclado

| Tecla | Ação |
|-------|------|
| `Ctrl/Cmd + E` | Modo Editor |
| `Ctrl/Cmd + R` | Modo Execução |
| `Espaço` | Pausar/Retomar animação |
| `← →` | Controlar posição manualmente |

## 🔧 Configuração Técnica

### Hardware
- **TV**: 42", FullHD, posição vertical
- **Trilho**: 300cm de comprimento
- **Encoder**: Valores normalizados 0-1 via UDP (porta 8888)
- **Área Física**: 300cm x 200cm
- **Viewport**: 93.5cm x 52.5cm

### Software
- **Biblioteca**: GSAP 3.12.2
- **Protocolo**: UDP (simulado em desenvolvimento)
- **Formato**: JSON para configurações
- **Armazenamento**: LocalStorage + arquivos

## 📁 Estrutura do Projeto

```
trilho_web/
├── index.html          # Interface principal
├── styles.css          # Estilos e layout
├── app.js             # Aplicação principal
├── editor.js          # Editor de calibração
├── viewport.js        # Sistema de viewport
├── udp-client.js      # Cliente UDP (mock)
└── README.md          # Este arquivo
```

## 🛠️ Desenvolvimento

### Modo Mock
Por padrão, a aplicação roda em modo mock para desenvolvimento:
- Simula movimento automático do trilho
- Não requer hardware físico
- Permite testar todas as funcionalidades

### Ativação do UDP Real
Para usar com hardware real, modifique `udp-client.js`:
```javascript
this.mockMode = false; // Desativa modo mock
```

### Adicionando Conteúdo Digital
Edite `viewport.js` no método `createDigitalContent()`:
```javascript
// Adicionar hotspot
this.addHotspot(x, y, 'id', 'tooltip');

// Adicionar texto
this.addFloatingText(x, y, 'texto');

// Adicionar vídeo
this.addVideo(x, y, 'video.mp4', 'descrição');
```

## 🎨 Personalização

### Cores e Estilo
Modifique `styles.css`:
- Cores principais: `#007acc` (azul)
- Fundo: `#1a1a1a` (escuro)
- Controles: `#2a2a2a` (cinza escuro)

### Animações
Use GSAP para animações personalizadas em `viewport.js`:
```javascript
gsap.to(element, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: "back.out(1.7)"
});
```

## 📱 Responsividade

A aplicação é otimizada para:
- TV vertical (9:16)
- Resolução FullHD (1920x1080)
- Navegadores modernos
- Touch devices (controles de arrastar)

## 🔍 Debug

O modo debug é ativado automaticamente em localhost:
- Painel de informações em tempo real
- Controles de posição
- Status da conexão UDP
- Métricas de performance

## 📄 Licença

Projeto desenvolvido para uso interno. Todos os direitos reservados.

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador
2. Confirme se a imagem foi carregada corretamente
3. Teste o modo mock antes de usar hardware real
4. Verifique as configurações de calibração

