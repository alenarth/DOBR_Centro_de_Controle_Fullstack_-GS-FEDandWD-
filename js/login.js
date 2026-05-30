/* =====================================================================
   DARK ORBIT BR — login.js
   Validação do formulário de acesso da tripulação.
   Web Development (WD) · Global Solution 2026 · FIAP

   Conceitos demonstrados:
   - Eventos: addEventListener para submit, blur e click
   - DOM: leitura de inputs e exibição de mensagens de erro
   - Lógica: condicionais (if/else) e validação com expressão regular
   - BOM: setTimeout (simula autenticação), sessionStorage e
          window.location (redireciona para o painel)
   ===================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-login");
  if (!form) return;

  const campoEmail = document.getElementById("email");
  const campoSenha = document.getElementById("senha");
  const erroEmail = document.getElementById("erro-email");
  const erroSenha = document.getElementById("erro-senha");
  const botao = document.getElementById("btn-entrar");
  const botaoTexto = document.getElementById("btn-entrar-texto");
  const switchConectado = document.getElementById("switch-conectado");

  /* ---------- Funções de validação (retornam true/false) ---------- */

  function emailValido(valor) {
    // Expressão regular simples: algo@algo.dominio
    const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return padrao.test(valor);
  }

  function mostrarErro(campo, caixaErro, mensagem) {
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    campo.setAttribute("aria-invalid", "true");
    caixaErro.textContent = mensagem;
    caixaErro.hidden = false;
  }

  function limparErro(campo, caixaErro) {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
    campo.setAttribute("aria-invalid", "false");
    caixaErro.textContent = "";
    caixaErro.hidden = true;
  }

  function validarEmail() {
    const valor = campoEmail.value.trim();
    if (valor === "") {
      mostrarErro(campoEmail, erroEmail, "Informe o seu e-mail.");
      return false;
    } else if (!emailValido(valor)) {
      mostrarErro(campoEmail, erroEmail, "E-mail inválido. Exemplo: nome@dominio.br");
      return false;
    }
    limparErro(campoEmail, erroEmail);
    return true;
  }

  function validarSenha() {
    const valor = campoSenha.value;
    if (valor === "") {
      mostrarErro(campoSenha, erroSenha, "Informe a sua senha.");
      return false;
    } else if (valor.length < 6) {
      mostrarErro(campoSenha, erroSenha, "A senha precisa ter ao menos 6 caracteres.");
      return false;
    }
    limparErro(campoSenha, erroSenha);
    return true;
  }

  /* ---------- Eventos: valida ao sair do campo (blur) ---------- */
  campoEmail.addEventListener("blur", validarEmail);
  campoSenha.addEventListener("blur", validarSenha);

  // Remove o estado de erro assim que o usuário volta a digitar
  campoEmail.addEventListener("input", function () {
    if (campoEmail.classList.contains("is-invalid")) validarEmail();
  });
  campoSenha.addEventListener("input", function () {
    if (campoSenha.classList.contains("is-invalid")) validarSenha();
  });

  /* ---------- Evento: toggle "manter conectado" ---------- */
  switchConectado.addEventListener("click", function () {
    const ativo = switchConectado.getAttribute("aria-checked") === "true";
    switchConectado.setAttribute("aria-checked", String(!ativo));
    switchConectado.classList.toggle("switch--on", !ativo);
  });

  /* ---------- Evento principal: submit ---------- */
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();   // impede o envio padrão; quem decide é o JS

    const okEmail = validarEmail();
    const okSenha = validarSenha();

    if (!okEmail || !okSenha) {
      // Foca o primeiro campo com erro (acessibilidade)
      if (!okEmail) campoEmail.focus();
      else campoSenha.focus();
      DarkOrbit.toast({
        tipo: "crit",
        titulo: "Não foi possível entrar",
        msg: "Verifique os campos destacados e tente novamente."
      });
      return;
    }

    /* Tudo válido: simula autenticação com atraso (BOM: setTimeout) */
    botao.classList.add("is-loading");
    botao.disabled = true;

    window.setTimeout(function () {
      // BOM: guarda a sessão conforme a preferência do usuário
      const manter = switchConectado.getAttribute("aria-checked") === "true";
      try {
        const armazenamento = manter ? window.localStorage : window.sessionStorage;
        armazenamento.setItem("darkorbit_operador", campoEmail.value.trim());
      } catch (e) {
        /* armazenamento pode estar bloqueado; o fluxo continua mesmo assim */
      }

      DarkOrbit.toast({
        tipo: "calm",
        titulo: "Acesso autorizado",
        msg: "Redirecionando para o Centro de Controle…"
      });

      // BOM: redireciona para o painel após um instante
      window.setTimeout(function () {
        window.location.href = "index.html";
      }, 900);
    }, 1200);
  });
});