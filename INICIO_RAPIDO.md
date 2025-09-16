# 🚀 Início Rápido - Trilho Digital

## ⚡ Comando Único

```bash
npm run trilho
```

**OU**

```bash
npm start
```

**OU**

```bash
node start-trilho.js
```

---

## 🎯 O que acontece:

1. **Servidor UDP** inicia na porta 8888
2. **Servidor Web** inicia na porta 3000
3. **Interface** fica disponível em: `http://localhost:3000/trilho-final.html`

---

## 📡 Como usar:

1. **Abra** a interface no navegador
2. **Pressione C** para entrar no modo calibração
3. **Ajuste** a imagem conforme necessário
4. **Pressione C** novamente para ir ao modo uso
5. **UDP ativa automaticamente** no modo uso
6. **Envie dados UDP** para testar:
   ```bash
   echo "value 0.5" | nc -u localhost 8888
   ```
7. **Pressione** `Ctrl+C` para parar tudo

---

## 🎮 Controles Rápidos

### Modo Calibração
- **C** - Alternar modo
- **Setas** - Mover imagem
- **+/-** - Zoom
- **S** - Salvar
- **ESC** - Sair sem salvar

### Modo Uso
- **P** - Toggle UDP
- **C** - Voltar para calibração

---

## 🔧 Comandos Individuais:

```bash
# Apenas servidor UDP
npm run udp

# Apenas servidor web
npm run serve

# Ambos (com concurrently)
npm start
```

---

## ✅ Pronto!

Agora você tem **um comando único** que inicia todo o sistema! 🎉