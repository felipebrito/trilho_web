# 🚀 Início Rápido - Trilho Digital

## ⚡ Comando Único

```bash
npm run
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
2. **Clique** `📡 UDP ON` para ativar recepção
3. **Envie dados UDP** para testar:
   ```bash
   echo "value 0.5" | nc -u localhost 8888
   ```
4. **Pressione** `Ctrl+C` para parar tudo

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
