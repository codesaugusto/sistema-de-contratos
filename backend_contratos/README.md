# Backend Contratos

Backend Spring Boot para o domínio de contratos alinhado ao modelo TypeScript do frontend.

## Mapeamento principal

- `Contract` -> `Contrato`
- `ContractStatus` -> `StatusContrato`
- `ContractHistory` -> `ContratoHistorico`
- `Notification` -> `NotificacaoContrato`
- `DashboardStats` -> `DashboardStats`

## Decisões de modelagem

- IDs usam `UUID`, que serializa naturalmente como string no JSON.
- `dataInicio` e `dataVencimento` usam `LocalDate`.
- `criadoEm`, `atualizadoEm`, `dataAlteracao` e `dataNotificacao` usam `Instant`.
- `anexos` é persistido com `@ElementCollection` em `contrato_anexos`.
- `alteracoes` do histórico é salvo como `Map<String, String>` via coleção nativa do JPA.
- `Contrato` não implementa `UserDetails`; autenticação deve ficar em uma entidade própria de usuário.

## Validar localmente

```sh
./gradlew test
```

## Variaveis de ambiente obrigatorias

O backend valida essas variaveis no startup e falha se faltar alguma:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET` (Base64, com pelo menos 32 bytes apos decode)

Essas variaveis são carregadas automaticamente do arquivo `.env` via `DotenvEnvironmentPostProcessor`.

## Subir manualmente (sem Docker)

### 1. Criar arquivo `.env`

```sh
cp .env.example .env
```

### 2. Rodar

```sh
./gradlew bootRun
```

**Pronto!** É só isso. EnvLoader carrega `.env` automaticamente, e `application.properties` tem defaults locais.

Se quiser customizar sem editar `.env`, use variáveis de sistema:

```sh
export DB_URL='jdbc:postgresql://localhost:5432/backend_contratos'
export DB_USERNAME='postgres'
export DB_PASSWORD='postgres'
./gradlew bootRun
```

## Subir com Docker

### 1. Criar arquivo `.env`

```sh
cp .env.example .env
```

Para Docker (container postgres), **altere a URL do banco:**

```env
DB_URL=jdbc:postgresql://postgres:5432/backend_contratos
```

### 2. Subir app + banco

```sh
docker compose up --build
```

**Como funciona:**
- `docker-compose.yml` carrega `.env` via `env_file`
- Variáveis são passadas como `System.getenv()` para containers
- `EnvLoader` as injeta como System properties
- `application.properties` resolve tudo via `${VAR_NAME}`

### 3. Derrubar containers

```sh
docker compose down
```

Para limpar dados do postgres também:

```sh
docker compose down -v
```

## Próximos passos sugeridos

- Criar controllers REST e DTOs de request/response.
- Separar autenticação em `Usuario` ou similar.
- Adicionar migrations com Flyway ou Liquibase.

