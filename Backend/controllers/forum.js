import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// ajustado para apontar para a pasta db
const dbPath = path.join(__dirname, '..', 'db', 'bancoDados.json')

export async function salvarComentario(req, res) {
  try {
    const { comentario, like = 0, usuarioId = null } = req.body

    if (!comentario || typeof comentario !== 'string') {
      return res.status(400).json({ error: 'comentario é obrigatório e deve ser string' })
    }

    // ler banco de dados (cria estrutura mínima se não existir)
    let db = { comentarios: [] }
    try {
      const raw = await fs.readFile(dbPath, 'utf8')
      db = raw ? JSON.parse(raw) : db
      if (!Array.isArray(db.comentarios)) db.comentarios = []
    } catch (e) {
      // se não existir arquivo, continuamos com db padrão
    }

    const novoComentario = {
      id: Date.now(), // id simples; trocar por uuid se preferir
      usuarioId,
      comentario,
      like: Number(like),
      criadoEm: new Date().toISOString()
    }

    db.comentarios.push(novoComentario)

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8')

    return res.status(201).json(novoComentario)
  } catch (err) {
    console.error('Erro ao salvar comentário:', err)
    return res.status(500).json({ error: 'Erro interno ao salvar comentário' })
  }
}