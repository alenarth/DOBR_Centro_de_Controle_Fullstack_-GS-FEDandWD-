/* =====================================================================
   DARK ORBIT BR — app.js
   Utilitários compartilhados por todas as telas.
   Web Development (WD) · Global Solution 2026 · FIAP

   Conceitos demonstrados aqui:
   - BOM: window.setInterval + objeto Date (relógio UTC ao vivo)
   - DOM: criação dinâmica de elementos (document.createElement) para os toasts
   ===================================================================== */

/* ------------------------------------------------------------------ *
 * 1. RELÓGIO UTC AO VIVO  (BOM: setInterval + Date)
 *    Atualiza qualquer elemento com [data-relogio] a cada segundo.
 * ------------------------------------------------------------------ */
function iniciarRelogio() {
  const alvos = document.querySelectorAll("[data-relogio]");
  if (alvos.length === 0) return;

  function doisDigitos(n) {
    return String(n).padStart(2, "0");
  }

  const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
                 "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

  function tick() {
    const agora = new Date();
    const dia = doisDigitos(agora.getUTCDate());
    const mes = meses[agora.getUTCMonth()];
    const hh = doisDigitos(agora.getUTCHours());
    const mm = doisDigitos(agora.getUTCMinutes());
    const ss = doisDigitos(agora.getUTCSeconds());
    const texto = `${dia} ${mes} · ${hh}:${mm}:${ss} UTC`;

    alvos.forEach(function (el) {
      el.textContent = texto;
      el.setAttribute("datetime", agora.toISOString());
    });
  }

  tick();                                   // primeira atualização imediata
  window.setInterval(tick, 1000);           // BOM: repete a cada 1 segundo
}

/* ------------------------------------------------------------------ *
 * 2. SISTEMA DE TOAST  (DOM: createElement / appendChild / removeChild)
 *    Uso: DarkOrbit.toast({ tipo: "crit", titulo: "...", msg: "..." })
 *    tipo ∈ "calm" | "warn" | "crit"
 * ------------------------------------------------------------------ */
function garantirDeck() {
  let deck = document.querySelector(".toast-deck");
  if (!deck) {
    deck = document.createElement("div");
    deck.className = "toast-deck";
    deck.setAttribute("aria-live", "polite");
    deck.setAttribute("aria-atomic", "false");
    document.body.appendChild(deck);
  }
  return deck;
}

const ICONES_TOAST = {
  calm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>',
  crit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>'
};

function mostrarToast(opcoes) {
  const tipo = opcoes.tipo || "calm";
  const titulo = opcoes.titulo || "";
  const msg = opcoes.msg || "";
  const duracao = opcoes.duracao || 5000;

  const deck = garantirDeck();

  // DOM: monta o toast elemento por elemento
  const toast = document.createElement("div");
  toast.className = "toast toast--" + tipo;
  toast.setAttribute("role", "status");
  toast.innerHTML =
    '<span class="toast__icon" aria-hidden="true">' + (ICONES_TOAST[tipo] || "") + "</span>" +
    '<div><div class="toast__title">' + titulo + "</div>" +
    '<div class="toast__msg">' + msg + "</div></div>";

  deck.appendChild(toast);

  // BOM: agenda a saída do toast com setTimeout
  window.setTimeout(function () {
    toast.classList.add("is-leaving");
    window.setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duracao);

  return toast;
}

/* ------------------------------------------------------------------ *
 * 3. Atalho de "flash" — destaca um valor recém-atualizado
 *    Reinicia a animação CSS removendo e re-adicionando a classe.
 * ------------------------------------------------------------------ */
function flash(el) {
  if (!el) return;
  el.classList.remove("flash");
  void el.offsetWidth;          // força o reflow para reiniciar a animação
  el.classList.add("flash");
}

/* Expõe os utilitários num namespace global simples */
window.DarkOrbit = {
  toast: mostrarToast,
  flash: flash
};

/* Liga o relógio assim que o DOM estiver pronto */
document.addEventListener("DOMContentLoaded", iniciarRelogio);