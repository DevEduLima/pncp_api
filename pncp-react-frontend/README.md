# PNCP React Frontend

Este projeto é uma aplicação React que consulta e exibe licitações do PNCP (Portal Nacional de Contratações Públicas). A aplicação permite que os usuários insiram parâmetros de busca e visualizem os resultados em uma interface amigável.

## Estrutura do Projeto

```
pncp-react-frontend
├── public
│   ├── index.html          # Ponto de entrada do aplicativo React
├── src
│   ├── components          # Componentes React
│   │   ├── RequestForm.jsx # Formulário para entrada de parâmetros
│   │   └── LicitacoesList.jsx # Lista de licitações retornadas
│   ├── services            # Serviços para requisições à API
│   │   └── api.js         # Funções para interagir com a API
│   ├── App.jsx             # Componente principal da aplicação
│   ├── index.js            # Ponto de entrada do React
│   └── styles              # Estilos CSS
│       └── App.css        # Estilos globais e específicos
├── package.json            # Configuração do npm
├── .gitignore              # Arquivos a serem ignorados pelo Git
└── README.md               # Documentação do projeto
```

## Instalação

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITORIO>
   ```
2. Navegue até o diretório do projeto:
   ```
   cd pncp-react-frontend
   ```
3. Instale as dependências:
   ```
   npm install
   ```

## Uso

Para iniciar a aplicação, execute o seguinte comando:
```
npm start
```
Isso iniciará o servidor de desenvolvimento e abrirá a aplicação no seu navegador padrão.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Para isso, faça um fork do repositório e envie um pull request com suas alterações.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.


## Server start

cd pncp-proxy-server

npx nodemon server.js