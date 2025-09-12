# Sistema de Calibração - Trilho Digital

## Visão Geral

O sistema agora possui dois modos distintos:
- **Modo Calibração**: Para ajustar e salvar configurações
- **Modo Uso**: Para operação normal com dados UDP

## Modo de Calibração

### 1. Ativar Modo de Calibração
- Clique em "🎯 Modo Calibração"
- A imagem `bg300x200-comtv.jpg` será carregada automaticamente
- Os valores conhecidos serão aplicados automaticamente

### 2. Ajustes Refinados
- **Escala**: Controles de ±0.001 e ±0.01 para ajustes muito finos
- **Posição X**: Controles de ±0.1 e ±1 para ajustes precisos
- **Posição Y**: Controles de ±0.1 e ±1 para ajustes precisos
- **Campos numéricos**: Para entrada direta de valores exatos

### 3. Salvar Calibração
- Clique em "💾 Salvar Calibração"
- A calibração será salva no localStorage e baixada como JSON
- Inclui: escala, offset X/Y, área útil, timestamp

### 4. Carregar Calibração
- Clique em "📂 Carregar Calibração"
- Primeiro tenta carregar do localStorage
- Se não encontrar, abre seletor de arquivo

## Modo de Uso

### 1. Ativar Modo de Uso
- Clique em "📱 Modo Uso"
- Os controles de calibração ficam ocultos
- Aplicação pronta para receber dados UDP

### 2. Mapeamento UDP
- **Trilho físico**: 0.0 a 1.0 (dados do encoder)
- **Área útil da imagem**: 0% a 62.3%
- **Mapeamento automático**: `posição = 0 + (trilho * 62.3)`

### 3. Teste UDP
```javascript
// No console do navegador:
sendEncoderData(0.0)    // Início da área útil (0%)
sendEncoderData(0.5)    // Meio da área útil (31.15%)
sendEncoderData(1.0)    // Fim da área útil (62.3%)
```

## Valores de Calibração Conhecidos

Para a imagem `bg300x200-comtv.jpg` (300cm x 200cm, 1920x1080px):
- **Escala**: 0.542
- **Offset X**: -2593
- **Offset Y**: -2272
- **Área útil**: 0% a 62.3%

## Estrutura do Arquivo de Calibração

```json
{
  "scale": 0.542,
  "offsetX": -2593,
  "offsetY": -2272,
  "imageUrl": "bg300x200-comtv.jpg",
  "timestamp": "2025-01-11T18:30:00.000Z",
  "usefulArea": {
    "min": 0,
    "max": 62.3
  }
}
```

## Fluxo de Trabalho Recomendado

1. **Primeira vez**:
   - Ative "Modo Calibração"
   - Ajuste finamente com os controles refinados
   - Salve a calibração

2. **Uso diário**:
   - Ative "Modo Uso"
   - Carregue a calibração salva
   - Conecte o sistema UDP

3. **Nova calibração**:
   - Ative "Modo Calibração"
   - Ajuste os valores
   - Salve a nova calibração

## Relação Matemática

A relação entre os números foi descoberta empiricamente:
- **Imagem física**: 300cm x 200cm
- **Imagem digital**: 1920px x 1080px
- **DPI efetivo**: ~15 DPI
- **Área vermelha 9:16**: 0% a 62.3% da imagem
- **Escala para viewport 9:16**: 0.542
- **Offsets para centralizar**: X=-2593, Y=-2272

Esta relação permite que qualquer trilho com dimensões diferentes seja calibrado usando a mesma metodologia.
