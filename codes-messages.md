### **Documentação de Códigos de Sucesso e Erro**

Esta documentação tem como objetivo fornecer uma abordagem estruturada e consistente para a criação de códigos de sucesso e erro em sistemas, facilitando o diagnóstico e a resolução de problemas.

---

### **1. Use Nomes Descritivos e Autoexplicativos**

- O código de sucesso ou erro deve refletir de forma clara e precisa o motivo do sucesso ou falha.
- **Evite abreviações** ou **termos vagos**. Sempre que possível, use verbos e substantivos que descrevam a **ação** que foi realizada ou falhou e o **recurso** afetado.

**Exemplo:**
- **Certo**: `USER_INVALID_EMAIL_FORMAT`
- **Errado**: `EMAIL_FORMAT_ERROR`

---

### **2. Organização por Categorias**

Classifique os sucessos e erros por tipo de operação ou recurso utilizando prefixos que ajudem a identificar rapidamente o contexto.

**Prefixos recomendados:**
- **USER_**: Relacionados a operações com o usuário (ex.: `USER_NOT_FOUND`, `USER_CREATED_SUCCESSFULLY`).
- **AUTH_**: Relacionados à autenticação (ex.: `AUTH_INVALID_CREDENTIALS`, `AUTH_SUCCESS`).
- **VALIDATION_**: Relacionados à validação de dados (ex.: `VALIDATION_FIELD_REQUIRED`, `VALIDATION_EMAIL_FORMAT`).
- **PERMISSION_**: Relacionados a permissões e acessos (ex.: `PERMISSION_DENIED`, `PERMISSION_GRANTED`).
- **SYSTEM_**: Relacionados a falhas internas ou problemas no servidor (ex.: `SYSTEM_INTERNAL_ERROR`, `SYSTEM_OPERATION_SUCCEEDED`).

---

### **3. Estrutura de Ação + Condição**

A nomenclatura deve refletir a **ação** que o sistema tentou realizar ou realizou e a **condição** que causou o erro ou sucesso.

**Estrutura recomendada**: `ACTION_CONDITION`

**Exemplos:**
- **Erro**: `USER_CREATE_FAILED`, `USER_CREATE_INVALID_DATA`
- **Sucesso**: `USER_CREATED_SUCCESSFULLY`, `PASSWORD_RESET_SUCCESS`

---

### **4. Seja Específico e Contextual**

Códigos mais específicos e detalhados facilitam o diagnóstico e a resolução do problema. Evite erros ou sucessos genéricos como `ERROR_001` ou `UNKNOWN_ERROR`.

**Evite termos de nível baixo**, como `DB_CONNECTION_FAILED`, a menos que esteja lidando diretamente com a infraestrutura do banco de dados.

---

### **5. Consistência na Nomenclatura**

Sempre use **letras maiúsculas** e **underscores** para separar palavras (ex.: `INVALID_USER_INPUT`, `AUTHORIZATION_FAILED`).

Garanta que todos os códigos de sucesso e erro sigam o mesmo padrão de nomenclatura.

---

### **6. Mensagens Claras de Sucesso e Erro**

O código de erro ou sucesso deve ser claro o suficiente para que o desenvolvedor ou usuário entenda rapidamente a causa da falha ou o resultado da operação.

**Exemplos:**
- **Erro**: `INVALID_EMAIL_FORMAT` → "Formato de e-mail inválido."
- **Erro**: `PASSWORD_TOO_SHORT` → "A senha deve ter pelo menos 8 caracteres."
- **Sucesso**: `USER_CREATED_SUCCESSFULLY` → "Usuário criado com sucesso."
- **Sucesso**: `PASSWORD_RESET_SUCCESS` → "A senha foi redefinida com sucesso."

---

### **7. Evite Códigos de Erro Dependentes de Implementação**

Tente evitar códigos de erro que dependem de detalhes de implementação que podem mudar com o tempo.

**Exemplo de erro genérico:**
- Ao invés de usar `PASSWORD_HASHING_FAILED`, utilize algo mais genérico, como `PASSWORD_ENCRYPTION_FAILED`, que pode ser aplicável a diversas abordagens de criptografia.

---

### **8. Erros Relacionados a Campos (Validação de Campos)**

Use a nomenclatura `FIELD_<CONDITION>` para erros de validação de campos.

**Exemplos:**
- **Erro**: `FIELD_REQUIRED` → "Campo obrigatório não preenchido."
- **Erro**: `FIELD_TOO_SHORT` → "O campo {campo} deve ter pelo menos {minLength} caracteres."
- **Erro**: `FIELD_FORMAT_INVALID` → "Formato inválido no campo {campo}."
- **Sucesso**: `FIELD_VALID` → "Campo válido."

---

### **9. Evite Duplicação de Códigos de Erro**

Evite criar múltiplos códigos para o mesmo tipo de erro ou sucesso, apenas por causa de variações pequenas no contexto. Utilize um código único para um tipo de erro ou sucesso e forneça mais informações nas mensagens ou dados complementares.

**Exemplo:**
- Se a validação de um campo falhar por diferentes motivos (formato inválido, tamanho curto, etc.), use o código `FIELD_INVALID` e forneça os detalhes específicos na mensagem de erro.

---

**Resumo do Padrão**:
- **Códigos de Erro**: Refletem falhas e problemas específicos na execução.
- **Códigos de Sucesso**: Indicam a conclusão bem-sucedida de uma operação ou ação.
- **Estrutura**: Sempre utilize uma estrutura que combine a **ação** (verbo) e a **condição** (problema ou resultado).
- **Exemplo Prático**: `USER_CREATE_FAILED`, `USER_CREATED_SUCCESSFULLY`, `PASSWORD_TOO_WEAK`, `PERMISSION_GRANTED`.

**Veja os Códigos Registrados**

- [Códigos de Sucesso Registrados](./sucess-code.md)
- [Códigos de Erro Registrados](./erro-code.md)





### **Erros Registrados**

| **Código de Erro**                    | **Descrição do Erro**                                                                                       | **Mensagem de Erro**                                                                                   |
|---------------------------------------|------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| `USER_NOT_FOUND`                      | O usuário com o ID fornecido não foi encontrado.                                                             | "Usuário não encontrado. Verifique o ID fornecido."                                                     |
| `USER_INVALID_EMAIL_FORMAT`           | O formato do e-mail fornecido é inválido.                                                                     | "Formato de e-mail inválido. Verifique o formato do e-mail e tente novamente."                         |
| `PASSWORD_TOO_SHORT`                  | A senha fornecida é muito curta.                                                                              | "A senha deve ter pelo menos 8 caracteres."                                                             |
| `PASSWORD_MISSING_NUMBER`             | A senha fornecida não contém nenhum número.                                                                   | "A senha deve conter pelo menos um número."                                                            |
| `LATITUDE_OUT_OF_BOUNDS`              | A latitude fornecida está fora dos limites válidos (-90 a 90).                                                | "Latitude fornecida fora dos limites permitidos. Deve estar entre -90 e 90."                          |
| `LONGITUDE_OUT_OF_BOUNDS`             | A longitude fornecida está fora dos limites válidos (-180 a 180).                                            | "Longitude fornecida fora dos limites permitidos. Deve estar entre -180 e 180."                      |
| `FIELD_REQUIRED`                      | Um campo obrigatório não foi preenchido.                                                                     | "Campo obrigatório não preenchido. Por favor, preencha todos os campos necessários."                  |
| `FIELD_TOO_SHORT`                     | Um campo possui um valor muito curto (menos de X caracteres).                                                | "O campo {field} deve ter pelo menos {minLength} caracteres."                                           |
| `ROLE_ALREADY_EXISTS`                 | O papel (role) que está sendo criado já existe.                                                              | "O papel {roleName} já existe. Por favor, escolha um nome diferente."                                 |
| `ROLE_PERMISSION_DENIED`              | O usuário não tem permissão para realizar a operação no papel (role).                                         | "Você não tem permissão para acessar ou modificar o papel {roleName}."                                |
| `SYSTEM_INTERNAL_ERROR`               | Erro inesperado no sistema.                                                                                  | "Ocorreu um erro inesperado. Tente novamente mais tarde."                                               |
| `USER_ACCESS_FORBIDDEN`               | O usuário não tem permissões suficientes para acessar o recurso.                                             | "Acesso negado. Você não tem permissão para acessar esse recurso."                                      |

