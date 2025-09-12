# 🚀 Guia de Instalação - Trilho Digital

## Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)
- Imagem da arte impressa (JPG, PNG, etc.)

## Instalação Rápida

### Opção 1: Servidor Local (Recomendado)

1. **Clone ou baixe** os arquivos do projeto
2. **Instale um servidor local**:
   ```bash
   # Com Python 3
   python -m http.server 8000
   
   # Com Node.js (http-server)
   npm install -g http-server
   http-server -p 8000
   
   # Com PHP
   php -S localhost:8000
   ```
3. **Acesse** `http://localhost:8000` no navegador

### Opção 2: Abertura Direta

1. **Abra** o arquivo `index.html` diretamente no navegador
2. **Nota**: Algumas funcionalidades podem não funcionar devido a restrições de segurança

## Configuração Inicial

### 1. Modo Editor

1. **Abra** a aplicação no navegador
2. **Clique** em "Arte Impressa" e selecione sua imagem
3. **Ajuste** a escala e posição usando os controles
4. **Arraste** a viewport azul para posicionamento fino
5. **Salve** a configuração clicando em "Salvar Configuração"

### 2. Modo Execução

1. **Clique** em "Modo Execução"
2. **Observe** o movimento automático da viewport
3. **Use** as setas ← → para controle manual
4. **Clique** nos hotspots azuis para interagir

## Configuração do Hardware

### Para Uso com Encoder Real

1. **Modifique** `udp-client.js`:
   ```javascript
   this.mockMode = false; // Desativa modo mock
   ```

2. **Implemente** a comunicação UDP real:
   ```javascript
   startUDPListener() {
       // Implementar comunicação UDP real
       // Exemplo com WebSocket + proxy UDP
   }
   ```

### Especificações do Hardware

- **TV**: 42", FullHD (1920x1080), posição vertical
- **Trilho**: 300cm de comprimento
- **Encoder**: Valores normalizados 0-1 via UDP (porta 8888)
- **Área Física**: 300cm x 200cm
- **Viewport**: 93.5cm x 52.5cm

## Personalização

### Adicionando Conteúdo Digital

Edite `viewport.js` no método `createDigitalContent()`:

```javascript
// Adicionar hotspot
this.addHotspot(x, y, 'id', 'tooltip');

// Adicionar texto flutuante
this.addFloatingText(x, y, 'texto');

// Adicionar vídeo
this.addVideo(x, y, 'video.mp4', 'descrição');
```

### Modificando Cores e Estilo

Edite `styles.css`:
```css
:root {
    --primary-color: #007acc;
    --background-color: #1a1a1a;
    --control-color: #2a2a2a;
}
```

## Solução de Problemas

### Problemas Comuns

1. **Imagem não carrega**:
   - Verifique se o arquivo é JPG, PNG ou outro formato suportado
   - Confirme que o arquivo não está corrompido

2. **Animações não funcionam**:
   - Verifique se o GSAP está carregado
   - Confirme se o JavaScript está habilitado

3. **Controles não respondem**:
   - Verifique se está no modo correto (Editor/Execução)
   - Confirme se a configuração foi salva

4. **Viewport não se move**:
   - Verifique se o UDP client está ativo
   - Confirme se a posição está sendo atualizada

### Debug

1. **Abra** o console do navegador (F12)
2. **Verifique** se há erros JavaScript
3. **Use** o painel de debug (ativo em localhost)
4. **Teste** o modo mock antes do hardware real

## Estrutura de Arquivos

```
trilho_web/
├── index.html              # Interface principal
├── demo.html               # Página de demonstração
├── styles.css              # Estilos e layout
├── app.js                  # Aplicação principal
├── editor.js               # Editor de calibração
├── viewport.js             # Sistema de viewport
├── udp-client.js           # Cliente UDP (mock)
├── config-example.json     # Configuração de exemplo
├── README.md               # Documentação principal
└── INSTALACAO.md           # Este arquivo
```

## Suporte

Para problemas ou dúvidas:

1. **Verifique** este guia de instalação
2. **Consulte** o README.md para detalhes técnicos
3. **Teste** com o modo mock primeiro
4. **Verifique** o console do navegador para erros

## Licença

Projeto desenvolvido para uso interno. Todos os direitos reservados.

