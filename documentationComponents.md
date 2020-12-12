Components
----------

**src\App.js**

### 1. App




-----
**src\components\Header\Header.js**

### 1. Header

Componente para header da pagina.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
title|string|no||Titulo do header
-----
**src\components\Menu\Menu.js**

### 1. Menu

Componente para o menu lateral.   




-----
**src\components\Overlay\Overlay.js**

### 1. Overlay

Componente que exibe um overlay em toda a página, e exibe container para colocar informações a serem mostradas.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
openOverlay|bool|yes||Overlay aberto ou fechado
setOpenOverlay|func|yes||Função para atribuir valor para openOverlay, recebe como argumento o valor do openOverlay
-----
**src\components\SaveBtn\SaveBtn.js**

### 1. SaveBtn

Componente para botão com animação de loading quando esta executando uma requisição.

Exemplo:
````javascript
import SaveBtn from '../../components/SaveBtn/SaveBtn';

function Test() {
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    await request();
    setSaving(false);
  }

  return (
    <div>
      <SaveBtn saving={saving} save={save} />
    </div>
  )
}
````   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
saving|bool|yes||Se esta executando a requisição
classBtn|string|no||className da div do botão
style|object|no||Modificar o estilo do texto do botão
save|func|yes||Função executada quando botão é pressionado, não há prametro
-----
**src\pages\BasePage\BasePage.js**

### 1. BasePage

Componente com design da tela base, com header e menu.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
title|string|no||Título do Header
-----
**src\pages\BasePageLogin\BasePageLogin.js**

### 1. BasePageLogin

Componente para página base das telas de login, registrar e recuperar senha.   




-----
**src\pages\DimensionForm\Criteria.js**

### 1. Criteria

Componente para critério no formulário de criar/editar dimensão, com informações salvas automaticamente.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
criterion|object|yes||Informações do critério
addIndicator|func|yes||Função para adicionar indicador dentro do critério, não passa parametro
removeCriterion|func|yes||Função para remover critério, não passa parametro
editCriterion|func|yes||Função para editar critério, passa como parametros indice do critério no vetor de critérios, campo, valor, e id do criterio
indexArray|number|yes||Indice do critério dentro do vetor de critérios
removeIndicator|func|yes||Função para remover o indicador, passa o paramtro indice do indicador dentro do vetor de indicadores
saveInfoCriterion|func|yes||Função para salvar informações do critério, não passa parâmetro
saveInfoIndicator|func|yes||Função para salvar informações dos indicadores, passa os parametros indice do indicador e objeto do indicador
-----
**src\pages\DimensionForm\DimensionForm.js**

### 1. DimensionForm

Componente para página Formulário da dimensão, de criação e edição da dimensão, indicadores e critérios dela, salva automaticamente no input onBlur, ou quando é criado indicador ou critério.   




-----
**src\pages\DimensionForm\Indicator.js**

### 1. Indicator

Componente para criar e editar indicador. Salva automaticamente no input onBlur.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
indicator|object|yes||Objeto com os indicadores
removeIndicator|func|yes||Função para remover o indicador, não passa parametro
saveInfoIndicator|func|yes||Função para salvar o indicador no banco de dados, e salva dentro do state criteriaList, passa o objeto com informações do indicador
-----
**src\pages\Dimensions\Dimensions.js**

### 1. Card

Componente para o card envolvendo a dimensão.   




### 2. Dimensions

Componente para a página da Lista de dimensões.   




-----
**src\pages\Evaluation\Evaluation.js**

### 1. Evaluation

Componente para página de Avaliação.   




-----
**src\pages\EvaluationsUser\EvaluationsUser.js**

### 1. EvaluationsUser

Componente para a tela de lista de avaliações do usuário   




-----
**src\pages\FormEvaluation\FormEvaluation.js**

### 1. Indicator

Componente para card do indicador.   




### 2. FormEvaluation

Componente para a página da avaliação de 1 dimensão.   




-----
**src\pages\Login\Login.js**

### 1. Login

Componente para a página de login.   




-----
**src\pages\OrganizationProfile\OrganizationProfile.js**

### 1. OrganizationProfile

Componente para a página de Perfil da instituição.   




-----
**src\pages\Organizations\Organizations.js**

### 1. Organizations

Componente para página de lista de organizações.   




-----
**src\pages\ProfileUser\ProfileUser.js**

### 1. ProfileUser

Componente para página perfil do usuário.   




-----
**src\pages\RecoverPassword\RecoverPassword.js**

### 1. RecoverPassword

Componente para página de recuperação de senha.   




-----
**src\pages\Register\Register.js**

### 1. Register

Componente para página de registrar novo usuário.   




-----
**src\pages\Report\Report.js**

### 1. Report

Componente para página de relatório.   




-----
**src\pages\Users\Users.js**

### 1. Users

Componente para página de lista de usuários.   




-----
**src\router.js**

### 1. Router




-----

<sub>This document was generated by the <a href="https://github.com/marborkowski/react-doc-generator" target="_blank">**React DOC Generator v1.2.5**</a>.</sub>
