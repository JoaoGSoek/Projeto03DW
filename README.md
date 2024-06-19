# Calendário de Eventos - Projeto 03 Dev Web

## Descrição

O projeto consiste em uma aplicação web desenvolvida com React para a interface do usuário e uma API em Spring Boot que se conecta a um banco de dados PostgreSQL. A aplicação permite gerenciar eventos em um calendário.

Na interface do calendário, o usuário pode navegar entre os meses e selecionar um dia específico. Para adicionar um novo evento, basta selecionar uma data no calendário, clicar no botão "criar evento" e preencher o formulário exibido. Após a criação bem-sucedida, um alerta de sucesso será exibido no navegador, e o evento será listado.

Eventos criados podem ser editados ou deletados posteriormente.

## Conteúdos

- **API Spring Boot** (versão 3.2.3)
  - Localização: `eventos/api`
  - Requisitos: Java, Maven
  - Descrição: Backend que gerencia os eventos, comunica-se com o banco de dados PostgreSQL.

- **Web App React** (versão 18.3.1)
  - Localização: `eventos_gui`
  - Requisitos: Node.js (versão 8.19.2 ou superior), npm/yarn
  - Descrição: Frontend que exibe o calendário e interage com a API para criar, editar e excluir eventos.

## Configuração do Ambiente

Para testar o projeto em seu sistema local, siga os passos abaixo:

1. **Configuração do Banco de Dados:**
   - Instale o PostgreSQL em seu sistema, se ainda não tiver.
   - Crie um banco de dados chamado `eventos`.

2. **Configuração da API:**
   - Navegue até o diretório `eventos/api`.
   - Configure as credenciais de acesso ao banco de dados PostgreSQL no arquivo `application.properties`.
   - Execute a aplicação Spring Boot. A API estará acessível em `http://localhost:8080`.

3. **Configuração do Web App:**
   - Navegue até o diretório `eventos_gui`.
   - Instale as dependências do projeto utilizando npm ou yarn (`npm install` ou `yarn install`).
   - Inicie a aplicação React com o comando `npm start` ou `yarn start`. O frontend estará disponível em `http://localhost:3000`.

4. **Utilização:**
   - Abra seu navegador e acesse `http://localhost:3000` para visualizar e interagir com o calendário de eventos.

## Observações

- Certifique-se de ter as versões adequadas do Node.js e do Java (para Spring Boot) instaladas em seu sistema.
- Os detalhes de implementação podem variar dependendo das configurações específicas do ambiente.

---

Este arquivo `README.md` fornece uma visão geral do projeto, os requisitos de configuração e instruções básicas para iniciar e utilizar a aplicação. Sinta-se à vontade para modificar e adaptar conforme necessário para o seu ambiente de desenvolvimento.
