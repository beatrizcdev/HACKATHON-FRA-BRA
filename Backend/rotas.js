import { Router } from "express";
import express from 'express'
import { salvarComentario } from './controllers/forum.js'
import { salvarProposta, getPropostasGerais } from './controllers/proposta.js'

const rotas = express.Router()

rotas.post('/comentarios', salvarComentario)
rotas.post('/propostas', salvarProposta)
rotas.get('/propostas/gerais', getPropostasGerais)

export default rotas