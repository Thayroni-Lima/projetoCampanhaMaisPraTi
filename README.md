# 🌟 Mais Pra Ti – Plataforma de Campanhas Solidárias

Sistema de centralização de Campanhas Solidárias desenvolvido para o programa Mais Pra Ti, com backend robusto em Spring Boot e frontend moderno em React. Aqui você encontra tudo o que precisa para executar, testar e entender o projeto.

---

## ✨ Principais Recursos

- Autenticação JWT e fluxo completo de recuperação de senha
- Gestão total de campanhas (CRUD) com interface responsiva
- Swagger UI para explorar a API
- Deploy facilitado com Docker Compose

---

## 🧱 Stack Tecnológica

| Camada   | Tecnologias                                                   |
| -------- | ------------------------------------------------------------- |
| Frontend | React 19, Vite, TailwindCSS, React Router, Axios              |
| Backend  | Spring Boot 3.5, Java 21, Spring Security, JWT, JPA/Hibernate |
| Banco    | MySQL 8.4                                                     |
| Infra    | Docker & Docker Compose                                       |

---

## 🚀 Subindo com Docker (Recomendado)

```bash
git clone <https://github.com/Thayroni-Lima/projetoCampanhaMaisPraTi.git>
cd projetoCampanhaMaisPraTi
docker compose up --build
```

**Serviços**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html

Comandos úteis:

```bash
docker compose logs -f
docker compose down
docker compose up -d --build
```

> 📘 Consulte também o guia completo em **[DOCKER_SETUP.md](./DOCKER_SETUP.md)**.

---

## 🔧 Execução Local (sem Docker)

### Backend

```bash
cd backend-campanha
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend-campanha
npm install
npm run dev
```

> 💡 Garanta um MySQL local configurado (ou execute apenas o container do banco).

---

## 🗂️ Estrutura do Repositório

```
projetoCampanhaMaisPraTi/
├── backend-campanha/   # API Spring Boot
├── frontend-campanha/  # UX/UI React
├── docker-compose.yml  # Orquestração dos serviços
├── DOCKER_SETUP.md     # Guia detalhado de ambiente
└── README.md           # Este documento
```

---

## 🔐 Variáveis de Ambiente

### Frontend (`frontend-campanha/.env`)

```
VITE_API_URL=http://localhost:8080
```

### Backend (via `.env` ou environment variables)

```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/campanha
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
APP_JWT_SECRET=change-this-secret
SPRING_MAIL_PASSWORD=<app-password-gmail>
```

---

## 📚 Leituras Complementares

- `backend-campanha/README.md` – detalhes da API
- `frontend-campanha/README.md` – instruções específicas Front
- `DOCKER_SETUP.md` – tutorial passo a passo sobre Docker

---

## 🤝 Créditos

Projeto desenvolvido por Thayroni Lima e Caio Gonzaga no contexto do programa **Mais Pra Ti** como estudo prático de uma stack moderna fullstack. Feito com ❤️ para impulsionar iniciativas solidárias.
