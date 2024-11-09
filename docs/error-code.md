# Código de Erro

| **Código de Erro**          | **Descrição do Erro**                                                 | **Mensagem de Erro**                                                                 |
| --------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `USER_NOT_FOUND`            | O usuário com o ID fornecido não foi encontrado.                      | "Usuário não encontrado. Verifique o ID fornecido."                                  |
| `USER_INVALID_EMAIL_FORMAT` | O formato do e-mail fornecido é inválido.                             | "Formato de e-mail inválido. Verifique o formato do e-mail e tente novamente."       |
| `PASSWORD_TOO_SHORT`        | A senha fornecida é muito curta.                                      | "A senha deve ter pelo menos 8 caracteres."                                          |
| `PASSWORD_MISSING_NUMBER`   | A senha fornecida não contém nenhum número.                           | "A senha deve conter pelo menos um número."                                          |
| `LATITUDE_OUT_OF_BOUNDS`    | A latitude fornecida está fora dos limites válidos (-90 a 90).        | "Latitude fornecida fora dos limites permitidos. Deve estar entre -90 e 90."         |
| `LONGITUDE_OUT_OF_BOUNDS`   | A longitude fornecida está fora dos limites válidos (-180 a 180).     | "Longitude fornecida fora dos limites permitidos. Deve estar entre -180 e 180."      |
| `FIELD_REQUIRED`            | Um campo obrigatório não foi preenchido.                              | "Campo obrigatório não preenchido. Por favor, preencha todos os campos necessários." |
| `FIELD_TOO_SHORT`           | Um campo possui um valor muito curto (menos de X caracteres).         | "O campo {field} deve ter pelo menos {minLength} caracteres."                        |
| `ROLE_ALREADY_EXISTS`       | O papel (role) que está sendo criado já existe.                       | "O papel {roleName} já existe. Por favor, escolha um nome diferente."                |
| `ROLE_PERMISSION_DENIED`    | O usuário não tem permissão para realizar a operação no papel (role). | "Você não tem permissão para acessar ou modificar o papel {roleName}."               |
| `SYSTEM_INTERNAL_ERROR`     | Erro inesperado no sistema.                                           | "Ocorreu um erro inesperado. Tente novamente mais tarde."                            |
| `USER_ACCESS_FORBIDDEN`     | O usuário não tem permissões suficientes para acessar o recurso.      | "Acesso negado. Você não tem permissão para acessar esse recurso."                   |
