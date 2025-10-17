export default class usuario {
    id = 1
    nome
    cpf
    email
    telefone
    ocupacao
    cep

    constructor(id, nome, cpf, email, telefone, ocupacao, cep) {
        this.id = id++
        this.nome = email
        this.cpf = cpf
        this.email = email
        this.telefone = telefone
        this.ocupacao = ocupacao
        this.cep = cep
    }
}