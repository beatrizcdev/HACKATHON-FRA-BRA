import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '..', 'db', 'bancoDados.json')

export async function getFeedback(req, res) {
  try {
    const propostaId = req.params.propostaId
    if (!propostaId) return res.status(400).json({ error: 'propostaId é obrigatório' })

    let db = { feedbacks: [] }
    try {
      const raw = await fs.readFile(dbPath, 'utf8')
      db = raw ? JSON.parse(raw) : db
      if (!Array.isArray(db.feedbacks)) db.feedbacks = []
    } catch (e) {
      db.feedbacks = []
    }

    const fb = db.feedbacks.find(f => String(f.propostaId) === String(propostaId))
    return res.status(200).json({ propostaId, like: fb ? Number(fb.like || 0) : 0 })
  } catch (err) {
    console.error('Erro ao ler feedback:', err)
    return res.status(500).json({ error: 'Erro interno ao ler feedback' })
  }
}

export async function curtirProposta(req, res) {
  try {
    const { propostaId } = req.body
    if (!propostaId) return res.status(400).json({ error: 'propostaId é obrigatório' })

    let db = { feedbacks: [] }
    try {
      const raw = await fs.readFile(dbPath, 'utf8')
      db = raw ? JSON.parse(raw) : db
      if (!Array.isArray(db.feedbacks)) db.feedbacks = []
    } catch (e) {
      db.feedbacks = []
    }

    let fb = db.feedbacks.find(f => String(f.propostaId) === String(propostaId))
    if (fb) {
      fb.like = Number(fb.like || 0) + 1
    } else {
      fb = {
        id_feedback: Date.now(),
        propostaId,
        like: 1
      }
      db.feedbacks.push(fb)
    }

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8')
    return res.status(200).json({ propostaId, like: fb.like })
  } catch (err) {
    console.error('Erro ao curtir proposta:', err)
    return res.status(500).json({ error: 'Erro interno ao curtir proposta' })
  }
}