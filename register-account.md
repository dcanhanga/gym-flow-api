# 📘 Registro de Conta de Usuário

## Visão Geral

O **serviço de Registro de Conta** é responsável por criar novas contas de usuário no sistema. Este documento descreve os **requisitos** e o **comportamento esperado** do serviço de registro, garantindo que o processo seja eficiente e seguro.

---

## 📑 Funcionalidade

### Registro de Nova Conta

O sistema deve permitir o registro de novas contas de usuário. Para isso, o processo de registro deve ser composto por:

#### **Entrada de Dados:**
- **Email**: Obrigatório e único.
- **Senha**: Obrigatória, e deve atender aos critérios de segurança.
- **Nome**: Obrigatório.
- **Papel (Role)**: Deve ser um dos seguintes valores predefinidos no sistema: `user`, `admin`, `super`.

---

## 🔄 Processo de Registro

1. **Validar todos os dados de entrada**:
   - O sistema deve garantir que todos os campos obrigatórios estejam preenchidos e válidos.

2. **Verificar se o email já está em uso**:
   - Antes de registrar uma nova conta, o sistema deve verificar se o email já está cadastrado.

3. **Confirmar a existência do papel (role) especificado**:
   - O sistema deve garantir que o papel atribuído ao usuário exista no sistema e seja válido.

4. **Criptografar a senha**:
   - A senha fornecida pelo usuário deve ser criptografada antes de ser armazenada.

5. **Criar a nova conta no sistema**:
   - Após todas as verificações, o sistema deve registrar a conta no banco de dados.

---

## 📤 Saída Esperada

Após o sucesso no registro de uma nova conta, o sistema deve retornar:

- **Detalhes da conta criada**, incluindo:
  - Email
  - Nome
  - Papel (role)

---

## 📋 Requisitos Específicos

### 1. **Validação de Dados**
   - Todos os campos de entrada (email, senha, nome e papel) devem ser validados.
   - Caso algum dado seja inválido, o sistema deve retornar um erro de "Parâmetros Inválidos".

### 2. **Unicidade de Email**
   - O sistema deve garantir que o email fornecido seja único.
   - Caso o email já esteja em uso, o sistema deve retornar um erro de "Recurso Já Existe".

### 3. **Verificação de Papel (Role)**
   - O papel atribuído ao usuário deve existir no sistema.
   - Caso o papel não seja encontrado, o sistema deve retornar um erro de "Recurso Não Encontrado".

### 4. **Segurança da Senha**
   - As senhas fornecidas pelos usuários devem ser criptografadas antes de serem armazenadas.
   - A criptografia deve garantir a segurança dos dados, utilizando um algoritmo robusto (por exemplo, Bcrypt).

---

## 🚦 Tratamento de Erros

O serviço deve ser capaz de lidar com os seguintes erros durante o processo de registro:

- **InvalidParams**: Lançado quando os dados de entrada são inválidos ou estão ausentes.
- **ResourceAlreadyExists**: Lançado quando o email fornecido já está registrado no sistema.
- **ResourceNotFound**: Lançado quando o papel (role) especificado não é encontrado no sistema.

---

## 🔗 Dependências

O serviço de registro de conta depende de outros componentes para funcionar corretamente:

1. **Repositório de Registro de Conta**:
   - Responsável por armazenar os dados da nova conta no banco de dados e realizar verificações de unicidade de email.

2. **Repositório de Papéis (Roles)**:
   - Responsável por verificar a existência do papel atribuído ao usuário.

3. **Serviço de Criptografia (Bcrypt)**:
   - Utilizado para criptografar as senhas antes de serem armazenadas de forma segura.

4. **Validador de Serviço de Registro de Conta**:
   - Responsável por garantir que os dados de entrada estejam corretos e em conformidade com as regras de validação.

---

## 🔄 Fluxo de Execução

O processo de execução para o registro de conta deve seguir as seguintes etapas:

1. **Receber dados de registro**:
   - O sistema recebe os dados do usuário (email, senha, nome e papel) pela API ou interface de usuário.

2. **Validar dados de entrada**:
   - O sistema verifica se todos os campos estão presentes e são válidos (exemplo: formato correto do email, senha forte, etc.).

3. **Verificar existência do email**:
   - O sistema consulta o banco de dados para garantir que o email ainda não está registrado.

4. **Verificar existência do papel (role)**:
   - O sistema consulta o repositório de papéis para garantir que o papel especificado é válido.

5. **Criptografar senha**:
   - O sistema criptografa a senha fornecida pelo usuário utilizando o serviço de criptografia.

6. **Registrar nova conta**:
   - O sistema registra a nova conta no banco de dados, associando o usuário com os dados fornecidos e o papel atribuído.

7. **Retornar detalhes da conta criada**:
   - O sistema retorna os detalhes da nova conta registrada, exceto a senha.

---

Essa documentação deve fornecer uma visão clara e direta dos **requisitos funcionais** para o **serviço de Registro de Conta**, ajudando a equipe de desenvolvimento a implementar e validar o sistema de forma adequada.