# 🎨 Mais Pra Ti – Frontend (React + Vite)

Diretório responsável por toda a experiência do usuário na plataforma de campanhas solidárias. Construída em React 19 com Vite, TailwindCSS e React Router.

---

## 🚀 Principais Funcionalidades

- Autenticação com JWT (integração com backend)
- Recuperação de senha com validação de token
- Dashboard com filtros e estatísticas
- CRUD completo de campanhas
- Interface responsiva e acessível

---

## 🛠️ Stack

- React 19 + Vite
- TailwindCSS
- React Router v7
- Axios
- Lucide Icons

---

## ▶️ Como rodar

```bash
cd frontend-campanha
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173` (ou porta indicada pelo Vite).

### Variáveis de ambiente

Crie um `.env` na raiz deste pacote:

```
VITE_API_URL=http://localhost:8080
```

---

## 🧱 Estrutura resumida

```
src/
├── components/        # UI e widgets
├── pages/             # rotas públicas e privadas
├── services/          # chamadas HTTP
├── contexts/          # AuthContext
└── main.jsx           # entrypoint
```

---

## 📦 Build e Preview

```bash
npm run build    # gera dist/
npm run preview  # serve build localmente
```

---

## 🐳 Via Docker

```bash
docker build -t maisprati-web .
docker run -p 3000:80 maisprati-web
```

> Esse container é consumido automaticamente pelo `docker-compose` da raiz do projeto.

---

## 🤝 Contribuição

1. Garanta que o backend esteja rodando
2. Rode `npm run dev`
3. Siga o padrão do Tailwind e do design system atual

---

Feito com ❤️ para impulsionar campanhas solidárias. Mais informações no README da raiz.
