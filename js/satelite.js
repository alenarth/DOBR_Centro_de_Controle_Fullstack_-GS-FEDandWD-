/* =====================================================================
   DARK ORBIT BR — satelite.js
   Detalhe do satélite: contador regressivo, troca de horizonte do
   gráfico e interruptor de alertas.
   Web Development (WD) · Global Solution 2026 · FIAP

   Conceitos demonstrados:
   - BOM: setInterval (contador regressivo até a janela de conjunção)
   - DOM: atualizar o texto do contador, do gráfico e da legenda
   - Eventos: abas do gráfico (click) e switch de alertas
   - Lógica: condicional para marcar urgência quando o tempo fica curto
   ===================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================== *
   * PARTE 1 — CONTADOR REGRESSIVO (BOM: setInterval + DOM)
   * Conta o tempo até a janela de aproximação do detrito.
   * ============================================================== */

  const contador = document.getElementById("contador-conj");
  if (contador) {
    // Lê o tempo inicial (em segundos) do atributo data-segundos
    let restante = parseInt(contador.getAttribute("data-segundos"), 10);

    function formatar(seg) {
      const h = Math.floor(seg / 3600);
      const m = Math.floor((seg % 3600) / 60);
      const s = seg % 60;
      if (h > 0) {
        return "em " + h + " h " + String(m).padStart(2, "0") + " min";
      }
      // menos de 1 hora: mostra minutos e segundos
      return "em " + m + " min " + String(s).padStart(2, "0") + " s";
    }

    function tique() {
      if (restante <= 0) {
        contador.textContent = "janela ativa agora";
        contador.classList.add("is-urgent");
        return; // para de decrementar
      }
      contador.textContent = formatar(restante);

      // Lógica: abaixo de 1 hora, marca como urgente (pisca em vermelho)
      if (restante < 3600) {
        contador.classList.add("is-urgent");
      }
      restante = restante - 1;
    }

    tique();                          // mostra imediatamente
    window.setInterval(tique, 1000);  // BOM: decrementa a cada segundo
  }

  /* ============================================================== *
   * PARTE 2 — TROCA DE HORIZONTE DO GRÁFICO (Eventos + DOM)
   * Ao clicar em 24h / 48h / 72h, atualiza os rótulos do gráfico.
   * ============================================================== */

  const abas = document.querySelectorAll("#abas-horizonte .tab");
  const legenda = document.getElementById("legenda-horizonte");
  const rotuloAgora = document.getElementById("chart-agora");

  // Valores ilustrativos de pico previsto por horizonte
  const PICO = {
    "24": { densidade: "2,1×", txt: "pico já atingido" },
    "48": { densidade: "2,5×", txt: "incerteza cresce durante a tempestade" },
    "72": { densidade: "2,5×", txt: "previsão estende-se além do pico" }
  };

  abas.forEach(function (aba) {
    aba.addEventListener("click", function () {
      // Eventos: troca a aba ativa
      abas.forEach(function (a) { a.setAttribute("aria-selected", "false"); });
      aba.setAttribute("aria-selected", "true");

      const h = aba.getAttribute("data-horizonte");
      const dados = PICO[h];

      // DOM: atualiza legenda e rótulo "agora" do gráfico
      legenda.innerHTML =
        'Horizonte de previsão: <strong class="readout" style="color:var(--signal)">' +
        h + " h</strong> · " + dados.txt + ".";
      if (rotuloAgora) {
        rotuloAgora.textContent = "agora · " + dados.densidade;
        DarkOrbit.flash(legenda);
      }
    });
  });

  /* ============================================================== *
   * PARTE 3 — INTERRUPTOR DE ALERTAS (Eventos + DOM)
   * ============================================================== */

  const sw = document.getElementById("switch-alertas");
  const swLabel = document.getElementById("switch-alertas-label");
  if (sw) {
    sw.addEventListener("click", function () {
      const ativo = sw.getAttribute("aria-checked") === "true";
      const novo = !ativo;
      sw.setAttribute("aria-checked", String(novo));
      sw.classList.toggle("switch--on", novo);

      // DOM: atualiza o rótulo
      swLabel.textContent = novo
        ? "Alertas automáticos ativos"
        : "Alertas automáticos pausados";

      // Feedback ao operador
      DarkOrbit.toast({
        tipo: novo ? "calm" : "warn",
        titulo: novo ? "Alertas reativados" : "Alertas pausados",
        msg: novo
          ? "Você voltará a ser notificado sobre este satélite."
          : "Você não receberá novos alertas deste satélite até reativar."
      });
    });
  }
});