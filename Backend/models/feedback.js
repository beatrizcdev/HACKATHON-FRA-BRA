export default class feedback {
    id_feedback = 1
    comentario
    like

    constructor(id_feedback, comentario, like) {
        this.id_feedback = id_feedback ++
        this.comentario = comentario
        this.like = like
    }
}