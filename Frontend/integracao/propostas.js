document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.homepage_lista_produtos')
  if (!container) return

  // Altere aqui se seu backend rodar em outra porta/host
  const API_BASE = 'http://localhost:3000'

  async function loadPropostasGerais() {
    try {
      const res = await fetch(`${API_BASE}/propostas/gerais`)
      if (!res.ok) throw new Error('Falha ao buscar propostas')
      const propostas = await res.json()
      renderPropostas(propostas)
    } catch (err) {
      console.error(err)
      container.innerHTML = '<p>Erro ao carregar propostas.</p>'
    }
  }

  function renderPropostas(propostas) {
    container.innerHTML = '' // limpa
    if (!propostas.length) {
      container.innerHTML = '<p>Nenhuma proposta pública encontrada.</p>'
      return
    }

    propostas.forEach(p => {
      const el = document.createElement('div')
      el.className = 'homepage_proposta'
      // Exibe título/uso e pequena linha de contrapartida
      el.innerHTML = `
        <h3 class="hp_proposta_titulo">${escapeHtml(p.usos || '')}</h3>
        <p class="hp_proposta_contrap">${escapeHtml((p.contrapartida || p.contrapartida || '').slice(0,120))}${(p.contrapartida || p.contrapartida || '').length > 120 ? '...' : ''}</p>
      `
      el.addEventListener('click', () => openModal(p))
      container.appendChild(el)
    })
  }

  function openModal(proposta) {
    // cria modal
    const overlay = document.createElement('div')
    overlay.className = 'integracao_modal_overlay'
    overlay.style = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;'

    const box = document.createElement('div')
    box.className = 'integracao_modal_box'
    box.style = 'background:#fff;padding:20px;max-width:600px;width:90%;border-radius:8px;box-shadow:0 6px 30px rgba(0,0,0,0.2);max-height:80vh;overflow:auto;'

    // não mostrar id_proposta nem publico
    const usos = escapeHtml(proposta.usos || '')
    const contr = escapeHtml(proposta.contrapartida || proposta.contrapartida || '')
    const fachada = proposta.fachada_ativa ? 'Sim' : 'Não'
    const tomb = proposta.tombamento ? 'Sim' : 'Não'
    const criadoEm = escapeHtml(proposta.criadoEm || '')
    const usuarioId = proposta.usuarioId ?? ''

    box.innerHTML = `
      <button class="integracao_modal_close" style="float:right;background:none;border:none;font-size:18px;cursor:pointer;">✕</button>
      <h2>${usos}</h2>
      <p><strong>Contrapartida:</strong> ${contr}</p>
      <p><strong>Fachada ativa:</strong> ${fachada}</p>
      <p><strong>Tombamento:</strong> ${tomb}</p>
      <p><strong>Criado em:</strong> ${criadoEm}</p>
      <p><strong>Usuário (id):</strong> ${escapeHtml(String(usuarioId))}</p>
    `
    overlay.appendChild(box)
    document.body.appendChild(overlay)

    function close() { overlay.remove() }
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close() })
    box.querySelector('.integracao_modal_close').addEventListener('click', close)
  }

  // simples escape para evitar XSS se dados não confiáveis
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  loadPropostasGerais()
})