import express from "express";
import { salvarComentario } from "./controllers/forum.js";
import { salvarProposta, getPropostasGerais } from "./controllers/proposta.js";
import { curtirProposta, getFeedback } from "./controllers/feedback.js";

const rotas = express.Router();

rotas.post("/comentarios", salvarComentario);
rotas.post("/propostas", salvarProposta);
rotas.get("/propostas/gerais", getPropostasGerais);

// feedback: get contador (não incrementa) e post para curtir (incrementa)
rotas.get("/feedback/:propostaId", getFeedback);
rotas.post("/feedback/curtir", curtirProposta);

export default rotas;
