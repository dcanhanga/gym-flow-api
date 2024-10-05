# App
GyPass style app.
## RFs (Requisitos funcionais)
- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o numero de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário obter seu hatóricos de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas;
- [ ] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in do usuário;
- [x] Deve ser possível cadastrar uma academia;
## RNs (Regras de negócios)
- [x] O usuário nao deve se cadastrar com um e-mail duplicado;
- [x] O usuário nao pode fazer 2 check-ins no mesmo dia;
- [x] O usuário nao pode fazer check-in se nao estiver perto de (100m) da academia;
- [ ] O check-in só podes ser validado até 20 minutos após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;
## RNFs (Requisitos nao-funcionais)
- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisar estar persistidos em um banco de PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas por 20 items por pagina;
- [ ] O usuário deve ser identificado por um JWT (JSON WEB TOKEN)
