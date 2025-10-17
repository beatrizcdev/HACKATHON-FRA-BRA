export default class feedback {
    id_feedback = 1
    propostaId
    like

    constructor(id_feedback, propostaId, like = 0) {
        this.id_feedback = id_feedback
        this.propostaId = propostaId
        this.like = Number(like) || 0
    }
}