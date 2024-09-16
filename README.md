# App
GyPass style app.
## RFs (Requisitos funcionais)
- [] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível obter o numero de check-ins realizados pelo usuário logado;
- [ ] Deve ser possível o usuário obter seu hatóricos de check-ins;
- [ ] Deve ser possível o usuário buscar academias próximas;
- [ ] Deve ser possível o usuário buscar academias pelo nome;
- [ ] Deve ser possível o usuário realizar check-in em uma academia;
- [ ] Deve ser possível validar o check-in do usuário;
- [ ] Deve ser possível cadastrar uma academia;
## RNs (Regras de negócios)
- [ ] O usuário nao deve se cadastrar com um e-mail duplicado;
- [ ] O usuário nao pode fazer 2 check-ins no mesmo dia;
- [ ] O usuário nao pode fazer check-in se nao estiver perto de (100m) da academia;
- [ ] O check-in só podes er validado até 2o minutos após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;
## RNFs (Requisitos nao-funcionais)
- [ ] A senha do usuário precisa estar criptografada;
- [ ] Os dados da aplicação precisar estar persistidos em um banco de PostgreSQL;
- [ ] Todas listas de dados precisam estar paginadas por 20 items por pagina;
- [ ] O usuário deve ser identificado por um JWT (JSON WEB TOKEN)
