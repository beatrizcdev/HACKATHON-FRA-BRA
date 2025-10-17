document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".homepage_lista_produtos");
  if (!container) return;

  const API_BASE = "http://localhost:3000";

  async function loadPropostasGerais() {
    try {
      const res = await fetch(`${API_BASE}/propostas/gerais`);
      if (!res.ok) throw new Error("Falha ao carregar propostas");
      const propostas = await res.json();
      renderPropostas(propostas);
    } catch (err) {
      console.error(err);
      container.innerHTML = "<p>Erro ao carregar propostas.</p>";
    }
  }

  function renderPropostas(propostas) {
    container.innerHTML = ""; // limpa
    if (!propostas.length) {
      container.innerHTML = "<p>Nenhuma proposta pública encontrada.</p>";
      return;
    }

    propostas.forEach((p) => {
      const el = document.createElement("div");
      el.className = "homepage_proposta";
      el.innerHTML = `
        <h3>${escapeHtml(p.usos || "")}</h3>
        <p>${escapeHtml((p.contrapartida || "").slice(0, 120))}${
        (p.contrapartida || "").length > 120 ? "..." : ""
      }</p>
      `;
      el.addEventListener("click", () => openModal(p));
      container.appendChild(el);
    });
  }

  function openModal(proposta) {
    const overlay = document.createElement("div");
    overlay.className = "integracao_modal_overlay";
    overlay.style =
      "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";

    const box = document.createElement("div");
    box.className = "integracao_modal_box";
    box.style =
      "background:#fff;padding:20px;max-width:600px;width:90%;border-radius:8px;box-shadow:0 6px 30px rgba(0,0,0,0.2);max-height:80vh;overflow:auto;";

    const usos = escapeHtml(proposta.usos || "");
    const contr = escapeHtml(proposta.contrapartida || "");
    const fachada = proposta.fachada_ativa ? "Sim" : "Não";
    const tomb = proposta.tombamento ? "Sim" : "Não";
    const criadoEm = escapeHtml(proposta.criadoEm || "");
    const usuarioId = proposta.usuarioId ?? "";

    const heartImg = "/Frontend/pictures/coracao.png";
    const heartImgLiked = "/Frontend/pictures/coracao_curtido.png";

    box.innerHTML = `
      <button class="integracao_modal_close" style="float:right;background:none;border:none;font-size:18px;cursor:pointer;">✕</button>
      <h2>${usos}</h2>
      <p><strong>Contrapartida:</strong> ${contr}</p>
      <p><strong>Fachada ativa:</strong> ${fachada}</p>
      <p><strong>Tombamento:</strong> ${tomb}</p>
      <p><strong>Criado em:</strong> ${criadoEm}</p>
      <div style="display:flex;align-items:center;gap:10px;margin-top:12px;">
        <button id="btnHeart" style="background:none;border:none;cursor:pointer;padding:6px;">
          <img id="imgHeart" src="${heartImg}" alt="Curtir" width="28" />
        </button>
        <span id="likeCount">Carregando...</span>
      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // O modal só fecha pelo botão X (não fecha ao clicar fora)
    const closeBtn = box.querySelector(".integracao_modal_close");
    function close() {
      overlay.remove();
    }
    closeBtn.addEventListener("click", close);

    const btnHeart = box.querySelector("#btnHeart");
    const imgHeart = box.querySelector("#imgHeart");
    const likeCountEl = box.querySelector("#likeCount");

    // ler contador atual via GET (NÃO incrementa)
    (async function loadLike() {
      try {
        const resp = await fetch(
          `${API_BASE}/feedback/${proposta.id_proposta}`
        );
        if (resp.ok) {
          const data = await resp.json();
          likeCountEl.textContent = `${data.like} curtidas`;
        } else {
          likeCountEl.textContent = "";
        }
      } catch (e) {
        likeCountEl.textContent = "";
      }
    })();

    // só incrementa quando o usuário clicar no botão de coração
    btnHeart.addEventListener("click", async (ev) => {
      ev.preventDefault();
      ev.stopPropagation(); // garante que o clique não propague para elementos externos
      btnHeart.disabled = true;
      try {
        const resp = await fetch(`${API_BASE}/feedback/curtir`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propostaId: proposta.id_proposta }),
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => null);
          alert(
            "Erro ao curtir: " +
              (err && err.error ? err.error : resp.statusText)
          );
          btnHeart.disabled = false;
          return;
        }
        const data = await resp.json();
        imgHeart.src = heartImgLiked;
        likeCountEl.textContent = `${data.like} curtidas`;
      } catch (err) {
        console.error(err);
        alert("Erro de conexão");
        btnHeart.disabled = false;
      } finally {
        // manter o modal aberto; permitir novo clique caso queira
        btnHeart.disabled = false;
      }
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  loadPropostasGerais();
});
