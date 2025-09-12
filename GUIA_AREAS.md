# 🎯 Guia de Áreas de Interação

## Como Visualizar e Gerenciar Áreas de Teste

### 📋 **Passo a Passo:**

1. **Entrar no Modo Calibração**
   - Pressione `C` ou clique no botão "Modo Calibração" no painel
   - O modo calibração ativa todos os controles de edição

2. **Visualizar Áreas Existentes**
   - As áreas aparecem como retângulos coloridos na tela
   - Cor vermelha: área normal
   - Cor amarela: área em hover
   - Cor verde: área em edição

3. **Gerenciar Áreas**
   - Clique no botão **"🎯 Áreas"** (canto inferior direito)
   - Veja todas as áreas existentes
   - Adicione novas áreas com **"➕ Adicionar Área"**
   - Remova áreas com o botão **"❌"** (exceto a última)

### 🎮 **Controles das Áreas:**

#### **Edição Rápida:**
- **Duplo clique** na área para editar
- **Pressione E** para editar rapidamente
- **Escape** para sair da edição

#### **Movimentação:**
- **Arraste** a área para mover
- A posição é salva automaticamente

#### **Edição Detalhada:**
- Ícone (emoji)
- Texto descritivo
- Largura e altura em pixels
- Botões Salvar/Cancelar

### 🔧 **Funcionalidades:**

#### **Posicionamento Inteligente:**
- As áreas são posicionadas de forma fixa na imagem
- Acompanham perfeitamente o movimento do trilho
- Aparecem quando você se move em direção a elas

#### **Visibilidade:**
- Só são renderizadas quando estão visíveis na tela
- Otimização de performance automática

#### **Debug:**
- Painel de debug mostra posições em tempo real
- Coordenadas da imagem vs tela
- Status de visibilidade

### 📊 **Informações do Debug:**

- **Trilho**: Posição atual (0-100%)
- **Scale**: Escala da imagem
- **Offset**: Deslocamento X e Y
- **Áreas**: Número total de áreas
- **Para cada área**:
  - Posição na imagem original
  - Posição na tela atual
  - Status de visibilidade
  - Tamanho atual

### 🎯 **Dicas de Uso:**

1. **Calibração**: Use o modo calibração para posicionar as áreas
2. **Teste**: Mova o trilho para ver as áreas aparecerem/desaparecerem
3. **Edição**: Duplo clique para personalizar cada área
4. **Múltiplas Áreas**: Adicione quantas áreas precisar
5. **Salvamento**: As configurações são salvas automaticamente

### ⌨️ **Atalhos Úteis:**

- `C`: Toggle modo calibração
- `E`: Editar área selecionada
- `Esc`: Sair da edição
- `Tab`: Toggle painel de controle
- `Ctrl+S`: Salvar configuração
- `Ctrl+O`: Carregar configuração

### 🚀 **Exemplo de Uso:**

1. Pressione `C` para entrar no modo calibração
2. Clique em "🎯 Áreas" para abrir o gerenciador
3. Clique "➕ Adicionar Área" para criar uma nova
4. Duplo clique na área para editar (ícone, texto, tamanho)
5. Arraste para posicionar onde desejar
6. Mova o trilho para testar se aparece corretamente
7. Use o painel de debug para verificar posições

---

**Nota**: As áreas de interação são ideais para marcar pontos importantes na imagem que devem ser acessíveis durante o movimento do trilho!

