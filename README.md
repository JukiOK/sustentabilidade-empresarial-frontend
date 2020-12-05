# Front end da Avaliação de sustentabilidade

Front-end do projeto sustentabilidade empresarial, para a disciplina MC855. <br/>
Projeto utiliza o [Create React App](https://github.com/facebook/create-react-app). Para aprender sobre React visite [documentação do React](https://reactjs.org/).

## Scripts

Nesse repositório os comandos permitidos são:

### `npm start`

Roda aplicação em modo de desenvolvimento.<br />
Abra [http://localhost:3000](http://localhost:3000) para ver no browser.

A página atualizará quando houver mudanças.<br />
Você verá também qualquer lint errors no console.

### `npm test`

Executa test runner no interactive watch mode.<br />
Veja seção sobre [running tests](https://facebook.github.io/create-react-app/docs/running-tests) para mais informações.

### `npm run build`

Faz o build da aplicação para a produção na pasta `build`.<br />
Veja seção sobre [deployment](https://facebook.github.io/create-react-app/docs/deployment) para mais informações.

### `npm run eject`

**Cuidado: depois de executada não há volta!**

Se não esta satisfeito com as build tools e configurações escolhidas, pode-se ejetar a qualquer tempo. O comando removerá as single build dependency do projeto, e copiara os arquivos de configuração e dependencias transitivas (webpack, Babel, ESLint, etc) para o projeto, para voce ter o controle total deles. Todos os comandos exceto `eject` ainda funcionarão, mas irão apontar para os scripts copiados para voce poder modifica-los.

Não deveria ser necessário o uso de `eject`, já que as configurações estão adequadas para produtos pequenos e médios, mas se for necerrária a customização pode-se utiliza-la.

### `npm run doc`
Geração da documentação das componentes na raiz do projeto, no arquivo documentationComponent.md, usando a biblioteca [react-doc-generator](https://github.com/marborkowski/react-doc-generator#readme)

## Estrutura do código
Todos os códigos principais estão dentro da pasta `src`.

### index.js
Componente inicial, com a chamada da função para inicializar o firebase.

### router.js
Componente com todas as rotas e a chamada da função para checar o token do firebase.

### /assets
Pasta com os assets do projeto

#### /assets/images
Pasta com as imagens.

### /components
Pasta com componentes reutilizaveis, ou que não são componentes para renderizar uma página. <br/>
Dentro tem pastas que dentro terá um arquivo para a componente e outro para o seu estilo.

### /constants
Pasta para armazenar arquivos com constantes. 

#### /constants/_colors.scss
Arquivo com constantes para as cores, para ser usadas em arquivos .scss <br/>
As cores no arquivo _colors devem estar no formato:
``` javascript
$lightergray: #f6f7f9;
```
E o import em algum arquivo .scss  deve ser 
```javascript
@import "caminho relativo do arquivo _colors.scss sem o '_'"
```

#### /constants/colorsobject.js
Arquivo com objeto com as cores, para ser usadas em arquivos .js

### /pages
Pasta com as páginas e as páginas bases. <br/>
Dentro tem pastas com as componentes para as páginas, e componentes para renderizar partes das páginas, e seus arquivos de estilo.

### /services
Pasta com arquivos referentes as requisições e suas configurações.

#### /services/requests.js
Arquivo com a configuração da biblioteca [axios](https://www.npmjs.com/package/axios) para fazer as requisições, junto com as funções que executam as requisições.

### /utils
Pasta arquivos de utilidades variadas.

#### /utils/firebaseUtils.js
Arquivo com a configuração do firebase, a função para inicializa-lo e a função para verificar mudança no token do usuário.

#### /utils/functions.js
Arquivo com funções variadas, que são usadas no projeto.

