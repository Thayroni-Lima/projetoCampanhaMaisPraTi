# Back-end - Mais Pra Ti (Spring Boot)

API RESTful para cadastro de usuários, autenticação com JWT e gestão de campanhas.

Principais tecnologias: Java 21, Spring Boot 3, Spring Security (JWT), JPA/Hibernate, MySQL, Swagger/OpenAPI, Docker, JUnit.


## Como executar

Você pode rodar de duas maneiras: com Docker (recomendado) ou localmente com Maven.

### 1) Executar com Docker (recomendado)
Pré‑requisitos: Docker e Docker Compose instalados.

Passo a passo:
- No diretório do projeto, execute:
  - Windows/PowerShell: `docker compose up -d --build`
  - Linux/Mac: `docker compose up -d --build`
- O Compose vai subir dois contêineres:
  - campanha-api (porta 8080)
  - campanha-db (MySQL, porta 3306)
- Aguarde até a API iniciar. Para ver os logs:
  - `docker compose logs -f campanha-api`
- Acesse:
  - API base: http://localhost:8080
  - Swagger UI: http://localhost:8080/swagger-ui.html

Credenciais/variáveis usadas no Compose:
- Banco: jdbc:mysql://campanha-db:3306/campanha
- Usuário: root
- Senha: senhasegura
- JWT Secret: dev-secret-change
- Expiração JWT (ms): 3600000

Para parar:
- `docker compose down` (use `-v` para limpar volumes do MySQL, se necessário)


### 2) Executar localmente (sem Docker)
Pré‑requisitos:
- Java 21 (JDK)
- Maven 3.9+
- MySQL rodando localmente (ou em outro host) com um schema criado, ex.: `campanha`

Configuração de ambiente (padrões):
- O arquivo `src/main/resources/application.properties` já possui defaults para rodar localmente:
  - URL: `jdbc:mysql://localhost:3306/campanha?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
  - Usuário: `root`
  - Senha: `root`
  - Altere via variáveis de ambiente se necessário:
    - `SPRING_DATASOURCE_URL`
    - `SPRING_DATASOURCE_USERNAME`
    - `SPRING_DATASOURCE_PASSWORD`
    - `APP_JWT_SECRET`
    - `APP_JWT_EXPIRATION`

Subir a aplicação:
- `mvn spring-boot:run`
- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html


## Fluxo básico da API (exemplos)

1) Registrar usuário
- Endpoint: `POST /auth/register`
- Body JSON:
```
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "password": "senhaSegura123",
  "avatarUrl": null,
  "city": "Porto Alegre",
  "state": "RS",
  "userTypeLabel": "NORMAL"  // opcional; se omitido, será NORMAL
}
```

2) Login (gera JWT)
- Endpoint: `POST /auth/login`
- Body JSON:
```
{
  "email": "maria@example.com",
  "password": "senhaSegura123"
}
```
- Resposta:
```
{
  "token": "<JWT>"
}
```

3) Criar campanha (precisa enviar o Bearer token)
- Endpoint: `POST /campaigns`
- Header: `Authorization: Bearer <JWT>`
- Body JSON (exemplo):
```
{
  "goal": 10000.00,
  "deadline": "2025-12-31T23:59:59Z",
  "title": "Campanha de Apoio",
  "description": "Vamos apoiar nossa comunidade com esta campanha.",
  "preview": "Apoie nossa causa",
  "category": "COMUNIDADE",
  "city": "Porto Alegre",
  "state": "RS",
  "imageUrl": "https://exemplo.com/imagem.jpg"
}
```

4) Listar campanhas
- Endpoint: `GET /campaigns`

5) Buscar campanha por ID
- Endpoint: `GET /campaigns/{id}`

Observação: Os tipos de usuário básicos (ADMIN e NORMAL) são criados automaticamente no start (veja `DataInitializer`). Não há usuário padrão; crie um via `POST /auth/register` e faça login.


## Testes

- Para rodar os testes:
  - `mvn test`
- Os testes usam H2 por padrão no profile de teste (veja `src/test/resources/application-test.properties`).


## Troubleshooting

- Porta 3306 já em uso:
  - Pare o MySQL local ou altere a porta no `docker-compose.yml`.
- Limpar dados do MySQL do Docker:
  - `docker compose down -v` (irá remover o volume `mysql-data`).
- Erros de conexão com o banco:
  - Verifique `SPRING_DATASOURCE_URL/USERNAME/PASSWORD` e se o container `campanha-db` está saudável.
- JWT inválido/expirado:
  - Faça login novamente para obter um novo token.


## Endpoints e Documentação

- Swagger UI: `/swagger-ui.html`
  - Use o botão "Authorize" (esquema bearerAuth) para informar o token JWT e o Swagger enviará o header `Authorization: Bearer <JWT>` automaticamente.
- OpenAPI JSON: `/v3/api-docs`

Endpoints úteis adicionais:
- Listar usuários (público) ou buscar por email: `GET /users` (opcional `?email=joao@example.com`)
- Usuário atual (requer JWT): `GET /users/me`
