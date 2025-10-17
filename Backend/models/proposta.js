export default class Proposta {
    id_proposta = 1
    usos
    contrapartida
    fachada_ativa
    publico
    tombamento
    usuarioId
    criadoEm

    constructor(id_proposta, usos, contrapartida, fachada_ativa, publico, tombamento, usuarioId = null) {
        this.id_proposta = id_proposta
        this.usos = usos
        this.contrapartida = contrapartida
        this.fachada_ativa = fachada_ativa
        this.publico = publico
        this.tombamento = tombamento
        this.usuarioId = usuarioId
        this.criadoEm = new Date().toISOString()
    }
}