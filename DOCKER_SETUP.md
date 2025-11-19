# 🐳 Guia de Configuração Docker - Projeto Campanha MaisPraTi

Este guia explica como executar o projeto completo usando Docker em qualquer sistema operacional (Windows, Linux ou macOS).

## 📋 Pré-requisitos

1. **Docker** instalado e em execução

   - Windows: [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Linux: [Docker Engine](https://docs.docker.com/engine/install/)
   - macOS: [Docker Desktop](https://www.docker.com/products/docker-desktop)

2. **Docker Compose** (geralmente incluído com Docker Desktop)
   - Verifique a instalação: `docker compose version`

## 🚀 Passos para Executar o Projeto

### 1. Clone ou baixe o projeto

```bash
git clone <url-do-repositorio>
cd projetoCampanhaMaisPraTi
```

### 2. (Opcional) Configure variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto se quiser personalizar as configurações:

```env
# URL da API Backend (usado pelo frontend)
VITE_API_URL=http://localhost:8080
```

**Nota:** Se não criar o arquivo `.env`, o projeto usará os valores padrão configurados no `docker-compose.yml`.

### 3. Execute o projeto com Docker Compose

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Este comando irá:

- Construir as imagens do frontend e backend
- Baixar a imagem do MySQL
- Criar e iniciar todos os containers
- Configurar a rede entre os serviços

### 4. Acesse a aplicação

Após os containers iniciarem (pode levar alguns minutos na primeira execução):

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Swagger/API Docs:** http://localhost:8080/swagger-ui/index.html
- **Banco de Dados MySQL:** localhost:3306

## 🛠️ Comandos Úteis

### Parar os containers

```bash
docker compose down
```

### Parar e remover volumes (apaga dados do banco)

```bash
docker compose down -v
```

### Ver logs dos containers

```bash
# Todos os serviços
docker compose logs -f

# Apenas um serviço específico
docker compose logs -f campanha-api
docker compose logs -f campanha-frontend
docker compose logs -f campanha-db
```

### Reconstruir apenas um serviço

```bash
docker compose up --build campanha-api
```

### Executar em background (detached mode)

```bash
docker compose up -d --build
```

### Ver status dos containers

```bash
docker compose ps
```

## 📁 Estrutura dos Serviços

O projeto é composto por 3 serviços principais:

1. **campanha-db** (MySQL 8.4)

   - Porta: 3306
   - Database: `campanha`
   - Usuário: `root`
   - Senha: `senhasegura` (padrão)

2. **campanha-api** (Spring Boot)

   - Porta: 8080
   - Framework: Java Spring Boot
   - Conecta-se ao MySQL automaticamente

3. **campanha-frontend** (React + Vite + Nginx)
   - Porta: 3000 (mapeada para 80 no container)
   - Framework: React 19
   - Servido via Nginx

## 🔧 Configurações Avançadas

### Alterar porta do frontend

Edite o `docker-compose.yml`:

```yaml
campanha-frontend:
  ports:
    - "8081:80" # Altere 8081 para a porta desejada
```

### Alterar porta do backend

Edite o `docker-compose.yml`:

```yaml
campanha-api:
  ports:
    - "8081:8080" # Altere 8081 para a porta desejada
```

E atualize o `VITE_API_URL` no `.env`:

```env
VITE_API_URL=http://localhost:8081
```

### Alterar credenciais do banco de dados

Edite o `docker-compose.yml` na seção `campanha-db`:

```yaml
environment:
  MYSQL_DATABASE: seu_banco
  MYSQL_ROOT_PASSWORD: sua_senha_segura
```

E atualize as variáveis no serviço `campanha-api`:

```yaml
environment:
  - SPRING_DATASOURCE_PASSWORD=sua_senha_segura
```

### Configurar email (Gmail)

Edite o arquivo `backend-campanha/src/main/resources/application.properties` ou use variáveis de ambiente no `docker-compose.yml`:

```yaml
campanha-api:
  environment:
    - SPRING_MAIL_HOST=smtp.gmail.com
    - SPRING_MAIL_PORT=587
    - SPRING_MAIL_USERNAME=seu-email@gmail.com
    - SPRING_MAIL_PASSWORD=sua-senha-de-app
```

## 🐛 Solução de Problemas

### Porta já em uso

Se receber erro de porta em uso:

```bash
# No Linux/macOS, encontre o processo usando a porta
lsof -i :8080
# ou
netstat -tulpn | grep 8080

# No Windows
netstat -ano | findstr :8080
```

Pare o processo ou altere a porta no `docker-compose.yml`.

### Container não inicia

Verifique os logs:

```bash
docker compose logs campanha-api
```

### Banco de dados não conecta

1. Verifique se o container do banco está rodando:

   ```bash
   docker compose ps
   ```

2. Verifique os logs:

   ```bash
   docker compose logs campanha-db
   ```

3. Aguarde alguns segundos após iniciar o banco (o MySQL precisa de tempo para inicializar)

### Frontend não acessa o backend

1. Verifique se o `VITE_API_URL` está correto no `.env` ou `docker-compose.yml`
2. Certifique-se de que o backend está rodando: http://localhost:8080
3. Verifique os logs do frontend:
   ```bash
   docker compose logs campanha-frontend
   ```

### Limpar tudo e começar do zero

```bash
# Para todos os containers
docker compose down -v

# Remove imagens antigas
docker system prune -a

# Reconstruir tudo
docker compose up --build
```

## 📝 Notas Importantes

1. **Primeira execução:** Pode levar alguns minutos para baixar as imagens e construir os containers
2. **Dados persistentes:** Os dados do MySQL são salvos em um volume Docker e persistem entre reinicializações
3. **Desenvolvimento:** Para desenvolvimento ativo, considere rodar o frontend e backend localmente e apenas o banco no Docker
4. **Produção:** Para produção, ajuste as senhas, secrets JWT e configurações de segurança

## 🔐 Segurança

⚠️ **IMPORTANTE:** As configurações padrão são para desenvolvimento. Para produção:

1. Altere todas as senhas padrão
2. Use secrets seguros para JWT
3. Configure HTTPS
4. Use variáveis de ambiente seguras
5. Não commite arquivos `.env` com credenciais reais

## 📚 Recursos Adicionais

- [Documentação Docker](https://docs.docker.com/)
- [Documentação Docker Compose](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [React Docker Guide](https://mherman.org/blog/dockerizing-a-react-app/)
