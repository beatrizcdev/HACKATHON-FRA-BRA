import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import Proposta from '../models/proposta.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '..', 'db', 'bancoDados.json')

export async function salvarProposta(req, res) {
  try {
    const {
      usos,
      contrapartida,
      fachada_ativa,
      publico,
      tombamento,
      usuarioId = null
    } = req.body

    // validação mínima
    if (!usos || typeof usos !== 'string') {
      return res.status(400).json({ error: 'Campo "usos" é obrigatório e deve ser string' })
    }

    const publicoNorm = String(publico || '').toLowerCase()
    const allowed = ['governo', 'geral']
    if (!allowed.includes(publicoNorm)) {
      return res.status(400).json({ error: 'Campo "publico" deve ser "governo" ou "geral"' })
    }

    // ler banco (cria estrutura mínima se não existir)
    let db = { propostas: [], propostasGerais: [] }
    try {
      const raw = await fs.readFile(dbPath, 'utf8')
      db = raw ? JSON.parse(raw) : db
      if (!Array.isArray(db.propostas)) db.propostas = []
      if (!Array.isArray(db.propostasGerais)) db.propostasGerais = []
    } catch (e) {
      // garante diretório existente caso não haja arquivo
      await fs.mkdir(path.dirname(dbPath), { recursive: true })
    }

    const id = Date.now()
    const novaProposta = new Proposta(
      id,
      usos,
      contrapartida,
      fachada_ativa,
      publicoNorm,
      tombamento,
      usuarioId
    )

    db.propostas.push(novaProposta)

    // se for público "geral", adiciona também no array de propostas gerais
    if (publicoNorm === 'geral') {
      db.propostasGerais.push(novaProposta)
    }

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8')

    return res.status(201).json(novaProposta)
  } catch (err) {
    console.error('Erro ao salvar proposta:', err)
    return res.status(500).json({ error: 'Erro interno ao salvar proposta' })
  }
}

export async function getPropostasGerais(req, res) {
  try {
    let db = { propostasGerais: [] }
    try {
      const raw = await fs.readFile(dbPath, 'utf8')
      db = raw ? JSON.parse(raw) : db
      if (!Array.isArray(db.propostasGerais)) db.propostasGerais = []
    } catch (e) {
      // se arquivo não existir, retornar array vazio
      db.propostasGerais = []
    }

    return res.status(200).json(db.propostasGerais)
  } catch (err) {
    console.error('Erro ao ler propostas gerais:', err)
    return res.status(500).json({ error: 'Erro interno ao ler propostas gerais' })
  }
}