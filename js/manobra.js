/* =====================================================================
   DARK ORBIT BR — manobra.js
   Simulação de manobra: recalcular projeção e confirmar a decisão.
   Web Development (WD) · Global Solution 2026 · FIAP

   Conceitos demonstrados:
   - Eventos: click em "recalcular", "manobrar" e "esperar"
   - DOM: ler o delta-v digitado e reescrever os resultados projetados
   - BOM: setTimeout (simula o cálculo da projeção) e window.confirm
          (diálogo nativo de autorização — nada é executado sem o "sim")
   - Lógica: if/else de validação + cálculo plausível dos resultados
   ===================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Elementos da tela ---------- */
  const campoDeltaV   = document.getElementById("deltav");
  const campoTipo     = document.getElementById("tipo");
  const campoInstante = document.getElementById("instante");

  const btnRecalcular = document.getElementById("btn-recalcular");
  const btnManobrar   = document.getElementById("btn-manobrar");
  const btnEsperar    = document.getElementById("btn-esperar");

  const saidaProb = document.getElementById("opt-prob");
  const saidaDist = document.getElementById("opt-dist");
  const saidaFuel = document.getElementById("opt-fuel");
  const saidaVida = document.getElementById("opt-vida");

  /* ---------- Helpers de formatação ---------- */

  // Converte um número para notação científica com sobrescrito Unicode
  function sobrescrito(n) {
    const mapa = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³",
                   "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
    return String(n).split("").map(function (c) { return mapa[c] || c; }).join("");
  }

  function formatarProb(p) {
    if (p <= 0) return "≈ 0";
    let exp = Math.floor(Math.log10(p));
    let mant = Math.round(p / Math.pow(10, exp));
    if (mant >= 10) { mant = 1; exp += 1; }   // corrige arredondamento (ex.: 9,6 → 10)
    return mant + " × 10" + sobrescrito(exp);
  }

  // Lê o delta-v aceitando vírgula ou ponto como separador decimal
  function lerDeltaV() {
    const bruto = (campoDeltaV.value || "").replace(",", ".").trim();
    const v = parseFloat(bruto);
    return isNaN(v) ? null : v;
  }

  /* ============================================================== *
   * PARTE 1 — RECALCULAR PROJEÇÃO (Eventos + BOM + DOM)
   * Modelo didático: quanto maior o delta-v, maior o afastamento
   * do detrito (e menor a probabilidade), porém mais combustível.
   * ============================================================== */

  function recalcular() {
    const dv = lerDeltaV();

    // Lógica: valida a entrada antes de calcular
    if (dv === null || dv <= 0) {
      DarkOrbit.toast({
        tipo: "crit",
        titulo: "Delta-v inválido",
        msg: "Informe um valor numérico maior que zero (ex.: 0,85)."
      });
      campoDeltaV.classList.add("is-invalid");
      campoDeltaV.focus();
      return;
    }
    campoDeltaV.classList.remove("is-invalid");

    // BOM: simula o tempo de processamento da projeção
    btnRecalcular.classList.add("is-loading");

    window.setTimeout(function () {
      // Cálculo plausível a partir do delta-v
      const distancia = dv * 16.7;                 // km de afastamento
      const combustivel = dv * 2.1;                // % de combustível
      const vida = Math.max(1, Math.round(dv * 2.4)); // dias de vida útil perdidos
      // Probabilidade cai exponencialmente com o afastamento
      let prob = 1.5e-4 * Math.exp(-distancia / 2);
      if (prob < 1e-9) prob = 1e-9;

      // DOM: reescreve os resultados na opção recomendada
      saidaDist.textContent = distancia.toFixed(1).replace(".", ",") + " km";
      saidaFuel.textContent = "≈ " + combustivel.toFixed(1).replace(".", ",") + "%";
      saidaVida.textContent = "−" + vida + (vida === 1 ? " dia" : " dias");
      saidaProb.textContent = formatarProb(prob);

      // Destaque visual nos valores recalculados
      DarkOrbit.flash(saidaDist);
      DarkOrbit.flash(saidaProb);

      btnRecalcular.classList.remove("is-loading");

      DarkOrbit.toast({
        tipo: "calm",
        titulo: "Projeção atualizada",
        msg: "Resultados recalculados para delta-v de " +
             dv.toFixed(2).replace(".", ",") + " m/s."
      });
    }, 1100);
  }

  if (btnRecalcular) {
    btnRecalcular.addEventListener("click", recalcular);
  }

  /* ============================================================== *
   * PARTE 2 — CONFIRMAR MANOBRA (Eventos + BOM: window.confirm)
   * Regra de negócio: nenhuma manobra é executada automaticamente.
   * A autorização do operador é obrigatória (diálogo de confirmação).
   * ============================================================== */

  if (btnManobrar) {
    btnManobrar.addEventListener("click", function () {
      const dv = lerDeltaV() || 0.85;
      const tipo = campoTipo ? campoTipo.value : "manobra";
      const instante = campoInstante ? campoInstante.value : "";

      // BOM: diálogo nativo de confirmação
      const mensagem =
        "CONFIRMAÇÃO DE MANOBRA — CubeSat-Rio-1\n\n" +
        "Tipo: " + tipo + "\n" +
        "Delta-v: " + dv.toFixed(2).replace(".", ",") + " m/s\n" +
        "Quando: " + instante + "\n\n" +
        "Esta ação não é automática. Você autoriza o comando de manobra?";

      const autorizado = window.confirm(mensagem);

      // Lógica: trata as duas respostas possíveis
      if (!autorizado) {
        DarkOrbit.toast({
          tipo: "warn",
          titulo: "Manobra cancelada",
          msg: "Nenhum comando foi enviado. O satélite segue na trajetória atual."
        });
        return;
      }

      // Autorizado: simula o envio do comando (BOM: setTimeout)
      btnManobrar.classList.add("is-loading");
      window.setTimeout(function () {
        btnManobrar.classList.remove("is-loading");
        DarkOrbit.toast({
          tipo: "calm",
          titulo: "Manobra autorizada",
          msg: "Comando agendado para o próximo perigeu. Trajetória será atualizada após a queima.",
          duracao: 7000
        });
      }, 1400);
    });
  }

  /* ============================================================== *
   * PARTE 3 — ESPERAR / AGENDAR REAVALIAÇÃO (Eventos + BOM)
   * ============================================================== */

  if (btnEsperar) {
    btnEsperar.addEventListener("click", function () {
      btnEsperar.classList.add("is-loading");
      window.setTimeout(function () {
        btnEsperar.classList.remove("is-loading");
        DarkOrbit.toast({
          tipo: "warn",
          titulo: "Reavaliação agendada",
          msg: "O sistema vai recalcular o risco em 6 h, quando a tempestade deve enfraquecer."
        });
      }, 900);
    });
  }
});