# 🎯 Trilho Digital - Sistema de Calibração e Movimento

Sistema web para calibração e controle de movimento horizontal de imagens de fundo, integrado com dados UDP em tempo real.

## ✨ Funcionalidades

### 🖼️ Calibração Automática
- **Carregamento automático** da imagem `bg300x200-comtv.jpg` no tamanho correto
- **Valores pré-configurados** otimizados (escala: 5.72, offsetX: 446, offsetY: 96)
- **Área útil destacada** com borda vermelha (proporção 9:16)
- **Controles precisos** para ajuste fino de escala e posição

### 🎮 Controles Intuitivos
- **Sliders responsivos** com altura aumentada para fácil manipulação
- **Campos numéricos** com suporte a scroll do mouse para precisão
- **Botões de ação rápida**:
  - `Reset` - Volta aos valores padrão
  - `Centralizar` - Centraliza a imagem
  - `Encaixar na TV` - Aplica calibração otimizada
  - `+` / `-` - Zoom in/out
  - `💾 Salvar` - Salva configuração atual
  - `🎮 Modo Uso` - Oculta controles para operação
  - `📡 UDP ON/OFF` - Ativa/desativa recepção de dados

### 📡 Integração UDP Real
- **Recepção de dados UDP** na porta 8888
- **Bridge WebSocket** (porta 8889) para comunicação web
- **Mapeamento correto** do slider (0-100%) para movimento real (0-89%)
- **Processamento em tempo real** de dados do encoder

### 💾 Persistência
- **Salvamento automático** de configurações no localStorage
- **Carregamento** de configurações salvas
- **Valores padrão** otimizados para a imagem de calibração

## 🚀 Instalação e Uso

### Pré-requisitos
```bash
node.js (versão 14 ou superior)
npm
```

### Instalação
```bash
# Clone o repositório
git clone https://github.com/felipebrito/trilho_web.git
cd trilho_web

# Instale as dependências
npm install

# Inicie o servidor UDP
node udp-bridge.js

# Em outro terminal, inicie o servidor web
npm start
```

### Acesso
- **Interface principal**: `http://localhost:3000/trilho-final.html`
- **Servidor UDP**: `localhost:8888`
- **WebSocket**: `localhost:8889`

## 🎯 Como Usar

### 1. Calibração Inicial
1. Abra `trilho-final.html` no navegador
2. A imagem já carrega no tamanho correto automaticamente
3. Use os controles para ajustes finos se necessário
4. Clique `💾 Salvar` para salvar a configuração

### 2. Modo de Operação
1. Clique `🎮 Modo Uso` para ocultar controles
2. Clique `📡 UDP ON` para ativar recepção de dados
3. A imagem se move automaticamente conforme dados UDP

### 3. Envio de Dados UDP
```bash
# Formato dos dados UDP
echo "value 0.5" | nc -u localhost 8888

# Ou use o cliente de teste
node udp-client.js
```

## 📁 Estrutura do Projeto

```
trilho_web/
├── trilho-final.html      # Interface principal (VERSÃO FUNCIONAL)
├── udp-bridge.js          # Servidor UDP → WebSocket
├── udp-client.js          # Cliente UDP para testes
├── editor/
│   └── bg300x200-comtv.jpg # Imagem de calibração
├── package.json           # Dependências Node.js
└── README.md             # Este arquivo
```

## 🔧 Configuração Técnica

### Valores de Calibração Otimizados
- **Escala**: 5.72 (tamanho da imagem)
- **Offset X**: 446px (posição horizontal)
- **Offset Y**: 96px (posição vertical)
- **Movimento máximo**: 890px (0-100% do slider)

### Mapeamento de Dados
- **Dados UDP**: 0.0 - 1.0 (posição normalizada)
- **Slider**: 0% - 100% (interface)
- **Movimento real**: 0% - 89% (limite da imagem)

## 🐛 Resolução de Problemas

### Imagem não carrega
- Verifique se `editor/bg300x200-comtv.jpg` existe
- Confirme que o servidor web está rodando

### UDP não funciona
- Verifique se `udp-bridge.js` está rodando
- Confirme que a porta 8888 está livre
- Teste com: `echo "value 0.5" | nc -u localhost 8888`

### Controles não respondem
- Recarregue a página
- Verifique o console do navegador para erros
- Confirme que `udp-client.js` está carregado

## 📝 Changelog

### v1.0.0 - Versão Funcional
- ✅ Calibração automática implementada
- ✅ Integração UDP real funcionando
- ✅ Interface responsiva e intuitiva
- ✅ Persistência de configurações
- ✅ Mapeamento correto do movimento
- ✅ Modo de uso para operação

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Felipe Brito**
- GitHub: [@felipebrito](https://github.com/felipebrito)
- Projeto: [trilho_web](https://github.com/felipebrito/trilho_web)

---

🎯 **Sistema pronto para produção!** A versão `trilho-final.html` é a versão principal e funcional.