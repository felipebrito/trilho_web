# Trilho Digital - Como Usar

## Funcionalidades

A aplicação foi simplificada e agora tem um propósito claro:

1. **Carregar Imagem de Fundo**: Importe uma imagem que será exibida no viewport
2. **Calibrar Posição e Escala**: Ajuste a imagem para ficar alinhada corretamente
3. **Controle Manual**: Use o slider para rolar horizontalmente pela imagem
4. **Controle UDP**: Receba dados do encoder via UDP para rolagem automática

## Como Usar

### 1. Carregar Imagem
- Clique em "Choose File" na seção "Imagem de Fundo"
- Selecione uma imagem (JPG, PNG, etc.)
- A imagem aparecerá no viewport principal

### 2. Calibrar a Imagem
- **Escala**: Ajuste o tamanho da imagem (0.1x a 3.0x)
- **Posição X**: Move a imagem horizontalmente
- **Posição Y**: Move a imagem verticalmente
- Use os botões "Reset", "Centralizar" e "Ajustar à Tela" para ajustes rápidos

### 3. Controlar a Posição
- **Slider Manual**: Use o slider "Posição" para rolar horizontalmente (0-100%)
- **Botões Rápidos**: Início (0%), Meio (50%), Fim (100%)
- **Dados UDP**: A aplicação recebe automaticamente dados do encoder

### 4. Salvar/Carregar Configuração
- **Salvar**: Salva a configuração atual (imagem + calibração)
- **Carregar**: Carrega uma configuração salva anteriormente

## Testando com UDP

Para testar o controle UDP, abra o console do navegador e use:

```javascript
// Enviar posição 0% (início)
sendEncoderData(0);

// Enviar posição 50% (meio)
sendEncoderData(0.5);

// Enviar posição 100% (fim)
sendEncoderData(1);

// Enviar posição 25%
sendEncoderData(0.25);
```

## Status da Aplicação

- **UDP**: Mostra se está conectado ao encoder
- **Posição**: Posição atual em centímetros (0-300cm)
- **Encoder**: Valor normalizado do encoder (0-1)

## Estrutura da Aplicação

- **Painel de Controle**: Lado esquerdo com todos os controles
- **Viewport Principal**: Lado direito mostrando a imagem com área visível destacada
- **Área Visível**: Borda azul mostra a área que será exibida na TV

## Configuração Salva

A aplicação salva automaticamente:
- URL da imagem carregada
- Configurações de escala e posição
- Última posição de rolagem

Tudo é salvo no localStorage do navegador e pode ser exportado/importado via arquivo JSON.

