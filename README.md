# Around Us - Web Project API Full

## Descrição do Projeto

O **Around Us** é uma aplicação web full stack que permite aos usuários criar uma conta, fazer login, editar seu perfil, adicionar cartões com imagens, curtir e deletar cartões. O projeto foi desenvolvido como parte do curso Tripleten, com foco em autenticação, autorização, integração front-end/back-end e boas práticas de desenvolvimento web.

## Funcionalidades

- Cadastro de novos usuários com validação de email e senha
- Login seguro com autenticação JWT
- Edição de perfil e avatar do usuário
- Adição de novos cartões com título e imagem
- Exclusão de cartões (apenas pelo proprietário)
- Curtidas em cartões (like/unlike)
- Visualização da quantidade de likes em cada cartão
- Feedback visual para ações e erros (InfoTooltip)
- Proteção de rotas para usuários autenticados
- Registro de logs de requisições e erros no backend

## Tecnologias e Técnicas Utilizadas

- **Front-end:**  
  - React 19  
  - React Router DOM  
  - Vite  
  - CSS modularizado  
  - Context API para gerenciamento do usuário

- **Back-end:**  
  - Node.js  
  - Express  
  - MongoDB com Mongoose  
  - JWT (JSON Web Token) para autenticação  
  - BcryptJS para hash de senhas  
  - Middleware customizado para autenticação e logging  
  - Validação de dados com express-validator e regex

- **Outros:**  
  - Estrutura modularizada de pastas  
  - Controle de estado com React Hooks  
  - Registro de logs de requisições e erros em arquivos `.log`  
  - Variáveis de ambiente com dotenv  
  - CORS configurado para integração front-end/back-end  
  - ESLint para padronização de