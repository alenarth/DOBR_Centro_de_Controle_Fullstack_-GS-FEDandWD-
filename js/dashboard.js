/* =====================================================================
   DARK ORBIT BR — dashboard.js
   Painel da frota: simulação de chegada de telemetria em tempo real.
   Web Development (WD) · Global Solution 2026 · FIAP

   Conceitos demonstrados:
   - BOM: setInterval (feed de dados) e setTimeout (escalonamento de evento)
   - DOM: atualizar gauges, mudar status de um satélite "seguro" → "perigo",
          inserir uma nova linha na timeline (createElement / prepend)
   - Eventos: filtro por abas (click) e botão de notificações
   - Lógica: if/elif/else para classificar severidade, laços para filtrar
   ===================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================== *
   * PARTE 1 — FEED DE TELEMETRIA SIMULADO (BOM + DOM)
   * A cada poucos segundos os índices de clima espacial variam um
   * pouco, como se novas leituras chegassem da rede EMBRACE/NOAA.
   * ============================================================== */

  // Estado inicial dos índices (espelha o que está no HTML)
  const clima = { kp: 7.0, dst: -135, sama: 95, tec: 1.55 };

  const elKp   = document.getElementById("val-kp");
  const elDst  = document.getElementById("val-dst");
  const elSama = document.getElementById("val-sama");
  const elTec  = document.getElementById("val-tec");
  const barKp   = document.getElementById("bar-kp");
  const barDst  = document.getElementById("bar-dst");
  const barSama = document.getElementById("bar-sama");
  const barTec  = document.getElementById("bar-tec");

  // Sorteia uma pequena variação em torno de um valor
  function variar(valor, amplitude) {
    return valor + (Math.random() * 2 - 1) * amplitude;
  }

  // Limita um número a um intervalo
  function limitar(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function atualizarTelemetria() {
    // Novas "leituras"
    clima.kp   = limitar(variar(clima.kp, 0.3), 0, 9);
    clima.dst  = limitar(variar(clima.dst, 8), -200, 0);
    clima.sama = limitar(variar(clima.sama, 6), 0, 120);
    clima.tec  = limitar(variar(clima.tec, 0.08), 1, 2);

    // DOM: atualiza os textos (com vírgula decimal, padrão brasileiro)
    elKp.textContent   = clima.kp.toFixed(1).replace(".", ",") + " / 9";
    elDst.textContent  = "−" + Math.abs(Math.round(clima.dst)) + " nT";
    elSama.textContent = "+" + Math.round(clima.sama) + " nT";
    elTec.textContent  = clima.tec.toFixed(2).replace(".", ",") + "×";

    // DOM: atualiza a largura das barras proporcionalmente
    barKp.style.width   = (clima.kp / 9 * 100).toFixed(0) + "%";
    barDst.style.width  = (Math.abs(clima.dst) / 200 * 100).toFixed(0) + "%";
    barSama.style.width = (clima.sama / 120 * 100).toFixed(0) + "%";
    barTec.style.width  = ((clima.tec - 1) / 1 * 100).toFixed(0) + "%";

    // Destaque visual de "valor recém-chegado"
    DarkOrbit.flash(elKp);
    DarkOrbit.flash(elDst);
  }

  // BOM: novas leituras a cada 4 segundos
  window.setInterval(atualizarTelemetria, 4000);

  /* ============================================================== *
   * PARTE 2 — ESCALONAMENTO DE UM SATÉLITE (DOM + BOM + timeline)
   * Depois de alguns segundos, o NanoSat-Verde-2 passa de
   * "atenção" para "crítico", como se uma conjunção tivesse surgido.
   * Demonstra a tela mudando de "seguro" para "perigo" sozinha.
   * ============================================================== */

  const linhaNano = document.getElementById("row-nano");
  const dotNano   = document.getElementById("nano-dot");
  const conjNano  = document.getElementById("nano-conj");
  const kpiRisco  = document.getElementById("kpi-risco");

  function escalarNanoSat() {
    // DOM: troca a cor do ponto de status
    dotNano.classList.remove("statusdot--warn");
    dotNano.classList.add("statusdot--crit");
    dotNano.setAttribute("aria-label", "Status crítico");

    // DOM: troca o selo de conjunção de "Baixa" (neutro) para "Crítico"
    conjNano.innerHTML =
      '<span class="pill pill--crit"><span class="pill__dot" aria-hidden="true"></span>Crítico</span>';

    // DOM: o satélite agora conta como crítico para o filtro
    linhaNano.setAttribute("data-status", "crit");

    // DOM: incrementa o KPI "em risco de conjunção" (de 1 para 2)
    const atual = parseInt(kpiRisco.textContent, 10) || 0;
    kpiRisco.textContent = String(atual + 1);
    DarkOrbit.flash(kpiRisco);

    // Insere um novo evento no topo da timeline
    inserirEvento({
      tipo: "crit",
      hora: horaUTCAgora(),
      titulo: "Conjunção crítica · NanoSat-Verde-2",
      desc: "Novo objeto cruzando a trajetória — alerta disparado."
    });

    // Notifica o operador
    DarkOrbit.toast({
      tipo: "crit",
      titulo: "Novo risco crítico detectado",
      msg: "NanoSat-Verde-2 entrou em risco de conjunção.",
      duracao: 7000
    });
  }

  // BOM: dispara o escalonamento uma vez, 8 segundos após carregar
  window.setTimeout(escalarNanoSat, 8000);

  /* ---------- Helpers da timeline (DOM) ---------- */
  const timeline = document.getElementById("timeline-eventos");

  function horaUTCAgora() {
    const d = new Date();
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    return hh + ":" + mm + " UTC · agora";
  }

  function inserirEvento(ev) {
    // DOM: cria o item da timeline elemento a elemento
    const item = document.createElement("div");
    item.className = "tl__item is-new";
    item.innerHTML =
      '<div class="tl__rail">' +
        '<span class="tl__node tl__node--' + ev.tipo + '" aria-hidden="true"></span>' +
        '<span class="tl__line"></span>' +
      "</div>" +
      "<div>" +
        '<p class="tl__time">' + ev.hora + "</p>" +
        '<p class="tl__title">' + ev.titulo + "</p>" +
        '<p class="tl__desc">' + ev.desc + "</p>" +
      "</div>";

    // Insere no topo da lista
    timeline.insertBefore(item, timeline.firstChild);
  }

  /* ============================================================== *
   * PARTE 3 — FILTRO DA FROTA POR ABAS (Eventos + DOM + laço)
   * ============================================================== */

  const abas = document.querySelectorAll(".tab[data-filtro]");
  const linhas = document.querySelectorAll("#lista-frota .fleet__row:not(.fleet__row--head)");

  abas.forEach(function (aba) {
    aba.addEventListener("click", function () {
      // Eventos: marca a aba clicada como selecionada
      abas.forEach(function (a) { a.setAttribute("aria-selected", "false"); });
      aba.setAttribute("aria-selected", "true");

      const filtro = aba.getAttribute("data-filtro");

      // Laço: mostra ou esconde cada linha conforme o status
      linhas.forEach(function (linha) {
        const status = linha.getAttribute("data-status");
        if (filtro === "todos" || status === filtro) {
          linha.style.display = "";
        } else {
          linha.style.display = "none";
        }
      });
    });
  });

  /* ============================================================== *
   * PARTE 4 — BOTÃO DE NOTIFICAÇÕES (Eventos)
   * ============================================================== */

  const btnNotif = document.getElementById("btn-notificacoes");
  if (btnNotif) {
    btnNotif.addEventListener("click", function () {
      DarkOrbit.toast({
        tipo: "warn",
        titulo: "Central de alertas",
        msg: "1 tempestade severa e 1 conjunção crítica ativas agora."
      });
    });
  }

  /* ---------- Mensagem inicial de boas-vindas ---------- */
  // BOM: pequeno atraso para o painel "assentar" antes do aviso
  window.setTimeout(function () {
    DarkOrbit.toast({
      tipo: "warn",
      titulo: "Tempestade em curso",
      msg: "Monitoramento ao vivo ativo. Acompanhe os índices do clima espacial."
    });
  }, 1500);
});