# HelloApi with Postgres

Este projeto demonstra uma API .NET simples que consulta um banco de dados Postgres. As instruções abaixo podem ser executadas em um GitHub Codespace ou em qualquer ambiente com Docker e o SDK .NET 8 instalado.

## Como executar

1. **Inicie o Postgres**

   ```bash
   docker compose up -d
   ```

   Isso iniciará um contêiner Postgres com um banco `appdb` e criará as tabelas `people` e `mugs` automaticamente a partir do arquivo `init.sql`.

2. **Execute a API**

   ```bash
   cd HelloApi
   dotnet run
   ```

3. **Teste o endpoint**

   Acesse `https://localhost:5001/people` (ou a porta gerada pelo Codespaces) para obter a lista de nomes armazenados no banco.

4. **Execute o front-end Angular**

   ```bash
   cd ../people-ui
   npm install
   npm start
   ```

   A aplicação será disponibilizada em `http://localhost:4200` e irá listar os nomes retornados pela API.

## Estrutura

- `docker-compose.yml` – define o serviço Postgres.
- `init.sql` – script usado para criar e popular as tabelas `people` e `mugs`.
- `HelloApi/` – código da API minimalista escrita em .NET 8.
