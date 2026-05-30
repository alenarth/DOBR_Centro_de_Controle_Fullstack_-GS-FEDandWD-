# Dark Orbit BR — Centro de Controle (Front-End + Web Development)

Protótipo de interface do **Dark Orbit BR**, um sistema que prevê arrasto atmosférico e risco de colisão de satélites em órbita baixa (LEO) usando os dados da rede brasileira **EMBRACE/INPE**, que cobrem a Anomalia Magnética do Atlântico Sul (SAMA).

Este repositório atende a **duas disciplinas** da Global Solution 2026 (FIAP — Engenharia de Software):

- **Front-End Design (FED):** a estrutura (HTML semântico) e o estilo (CSS) — o "cockpit" do sistema.
- **Web Development (WD):** a interatividade em **JavaScript puro** (DOM, eventos e BOM), que simula o sistema espacial funcionando em tempo real, sobre as mesmas telas.

> Como o projeto é **conceitual**, o JavaScript **simula** a chegada de telemetria e o comportamento do sistema (não há back-end nem API real) — exatamente o protótipo funcional que a disciplina de WD pede.

---

## 1. Usuário e tarefa crítica

**Usuária principal: Larissa**, operadora de um cubesat universitário (UFRJ-Sat). Ela não é especialista em clima espacial e monitora a missão sem uma equipe 24 h. A pergunta que a tira do sério é simples: *"o meu satélite está em perigo agora, e o que eu faço a respeito?"*

A **tarefa crítica** que a interface precisa resolver bem é o momento de decisão sob pressão: durante uma tempestade geomagnética, com uma conjunção (risco de colisão) se aproximando, Larissa precisa **entender o risco e decidir se manobra ou espera** — sem desperdiçar combustível e sem depender de telas que só um físico entenderia.

Toda a interface foi desenhada em torno desse momento. Por isso o caminho `Painel → Satélite → Simular manobra` é curto e sempre visível.

---

## 2. Direção visual: "Centro de Controle, modo noturno"

A metáfora escolhida é a de uma **sala de controle de missão às 3 da manhã**: ambiente escuro para longas jornadas de monitoramento, em que **o que está calmo recua e só o risco salta aos olhos**.

- **Tema escuro** (superfícies de "espaço profundo": `#060912` → `#182542`), confortável para monitoramento prolongado e coerente com o domínio espacial.
- **Acento "sinal" ciano** (`#3FE0D2`) usado com parcimônia — só em ações e dados ativos.
- **Status semântico** com significado fixo em todo o produto: **calmo/verde** (`#34D399`), **atenção/âmbar** (`#F5B73D`), **crítico/coral** (`#FB6A5E`).
- **Anomalia SAMA** representada por um gradiente quente **âmbar→magenta** (`#F5A623 → #D6457F`) brilhando sobre o globo centrado no Atlântico Sul. É o detalhe memorável da interface e amarra visualmente a **vantagem brasileira** do projeto.
- **Tipografia** deliberadamente fora do padrão genérico: **Saira** (títulos, ar técnico/aeroespacial), **IBM Plex Sans** (texto) e **IBM Plex Mono** (telemetria e números). Fontes carregadas via Google Fonts.
- **Detalhes de instrumento**: cantos de mira (corner brackets) nos painéis-chave, traços finos, leituras em monoespaçada, micro-animações sutis em CSS (pulso do "sinal ao vivo", brilho dos alertas críticos).

A análise crítica completa das referências (consoles NASA/ESA, terminais Bloomberg, dashboards Grafana, HUDs de aviação, visualização científica INPE/NOAA) — o que foi **adotado** e o que foi **descartado** de cada uma — está no moodboard em `assets/moodboard.png` (fonte editável em `assets/moodboard.html`).

---

## 3. As telas

| Arquivo | Tela | O que demonstra |
|---|---|---|
| `login.html` | **Acesso da tripulação** | Porta de entrada. Layout dividido (visual + formulário). Formulário pronto para receber validação no Web Development. |
| `index.html` | **Painel da frota** (tela-herói) | Visão de toda a frota em segundos: banner de tempestade, KPIs, lista dos satélites com status, clima espacial (Kp/Dst/SAMA/TEC), globo com a SAMA e histórico de eventos. |
| `satelite.html` | **Detalhe do satélite** | Aprofundamento no CubeSat-Rio-1: gráfico de **densidade prevista × observada com faixa de incerteza**, ficha técnica, trajetória orbital e a conjunção ativa com o detrito. |
| `manobra.html` | **Simular manobra** | O momento de decisão: parâmetros da manobra, risco atual e **duas alternativas lado a lado** (*Manobrar agora* × *Esperar 6 h*), com trajetórias comparadas. |

A frota (CubeSat-Rio-1, Estação-Baixa-4, NanoSat-Verde-2, Amazonia-Obs-3, SACI-Edu-5) e as regras de negócio são as mesmas do motor em Python da disciplina de lógica, para manter continuidade entre as entregas do projeto. Algumas regras aparecem traduzidas em interface:

- **Probabilidade de colisão acima de 1×10⁻⁴ ⇒ estado crítico** (visível no painel de risco).
- **Incerteza alta durante tempestade ⇒ previsão marcada como "baixa confiança" e alerta automático suspenso** (banner do painel).
- **Sempre ao menos duas opções de manobra**, incluindo a de esperar (tela de manobra). A execução nunca é automática: a confirmação é sempre da operadora.

---

## 4. Responsividade

Layout fluido com três faixas, testadas por renderização:

- **Desktop (> 1024 px):** barra lateral completa + grade de painéis em duas colunas.
- **Tablet (640–1024 px):** a barra lateral colapsa para um **trilho de ícones**; as grades viram uma coluna.
- **Mobile (< 640 px):** a barra lateral dá lugar a uma **navegação inferior fixa** (padrão de aplicativo), os painéis empilham e a tabela da frota vira cartões legíveis com rótulos. Tudo isso **sem JavaScript**, só com CSS (media queries).

---

## 5. Acessibilidade

- HTML **semântico** (`header`, `nav`, `main`, `aside`, `section`, `footer`, `time`) e hierarquia de títulos coerente.
- **Contraste** alto entre texto e fundo, mirando o nível **WCAG AA**.
- **Navegação por teclado**: link "pular para o conteúdo" e **foco visível** consistente (anel ciano) em todos os elementos interativos.
- **Imagens e gráficos**: todas as `<img>` têm `alt`; SVGs informativos (globo, gráficos) usam `role="img"` + `aria-label` descritivo; SVGs decorativos são marcados com `aria-hidden="true"`.
- **Cor não é o único sinal**: status sempre combinam cor + texto ("Crítico", "Atenção") + ícone.
- Respeito a `prefers-reduced-motion`: as animações são desligadas para quem prefere menos movimento.

---

## 6. Como abrir

Não há build nem dependências. Abra o arquivo `login.html` (ou `index.html`) diretamente no navegador — por exemplo, clicando duas vezes nele, ou arrastando-o para uma aba do navegador.

> As fontes vêm do Google Fonts, então o ideal é estar **conectado à internet** na primeira abertura. Sem conexão, a interface continua funcionando com fontes de sistema como alternativa.

---

## 7. Estrutura do projeto

```
projeto-frontend-space/
├── index.html          # Painel da frota (tela-herói)
├── satelite.html       # Detalhe do satélite
├── manobra.html        # Simulação de manobra
├── login.html          # Acesso da tripulação
├── css/
│   └── style.css       # Sistema de design completo (tokens + componentes)
├── js/                 # Interatividade (Web Development)
│   ├── app.js          # Utilitários: relógio ao vivo + notificações (toasts)
│   ├── login.js        # Validação do formulário de acesso
│   ├── dashboard.js    # Telemetria simulada em tempo real + filtro da frota
│   ├── satelite.js     # Contador regressivo + troca de horizonte do gráfico
│   └── manobra.js      # Recálculo de projeção + confirmação de manobra
├── assets/
│   ├── logo.svg        # Logotipo do Dark Orbit BR
│   ├── moodboard.png   # Moodboard com análise crítica de referências
│   └── moodboard.html  # Fonte editável do moodboard
├── integrantes.txt
└── README.md
```

---

## 8. Manual de Interatividade (Web Development)

Esta seção mostra ao avaliador **onde clicar** e **o que acontece** em cada tela. Toda a interatividade é feita com **JavaScript puro** (sem bibliotecas), cobrindo os três pilares pedidos: **DOM**, **Eventos** e **BOM**.

> Recomenda-se começar pelo `login.html`, que leva ao painel ao entrar.

### `login.html` — validação do formulário
- **Deixe os campos vazios e clique em "Entrar"** → aparecem mensagens de erro em vermelho abaixo de cada campo, e o campo é destacado. *(Eventos: `submit`; DOM: exibição dos erros.)*
- **Digite um e-mail sem "@" e saia do campo** → erro de e-mail inválido na hora (validação por expressão regular). *(Evento: `blur`.)*
- **Clique no interruptor "Manter conectado"** → ele liga/desliga. *(Evento: `click`.)*
- **Preencha um e-mail válido e uma senha com 6+ caracteres e clique em "Entrar"** → o botão mostra um spinner por um instante e a tela redireciona para o painel. *(BOM: `setTimeout`, `sessionStorage`/`localStorage`, `window.location`.)*

### `index.html` — painel da frota (tela que "ganha vida")
- **Observe o relógio no topo** → ele corre segundo a segundo em UTC. *(BOM: `setInterval` + `Date`.)*
- **Observe o painel "Clima espacial"** → os índices (Kp, Dst, SAMA, TEC) mudam sozinhos a cada poucos segundos, como se novas leituras chegassem; as barras acompanham. *(BOM: `setInterval`; DOM: atualização de texto e largura das barras.)*
- **Aguarde cerca de 8 segundos** → o satélite **NanoSat-Verde-2** muda de "atenção" para **crítico** sozinho: o ponto fica vermelho, o selo vira "Crítico", o indicador "Em risco de conjunção" sobe de 1 para 2, **um novo evento aparece no topo da timeline** e surge uma notificação. *(É a tela passando de "seguro" para "perigo"; DOM: alteração de classes, `createElement`/`insertBefore`.)*
- **Clique nas abas "Todos / Atenção / Crítico"** acima da lista → a frota é filtrada na hora. *(Eventos + laço de repetição.)*
- **Clique no sino (canto superior direito)** → aparece uma notificação com o resumo de alertas. *(Evento: `click`.)*

### `satelite.html` — detalhe do satélite
- **Observe "Janela de aproximação"** no painel "Conjunção ativa" → é um **contador regressivo** que diminui a cada segundo (e fica vermelho/piscando quando entra na última hora). *(BOM: `setInterval`.)*
- **Clique nas abas "24h / 48h / 72h"** do gráfico de densidade → a legenda e o rótulo do gráfico se atualizam conforme o horizonte. *(Eventos + DOM.)*
- **Clique no interruptor "Alertas automáticos"** (rodapé da ficha técnica) → alterna entre ativo/pausado e mostra uma notificação. *(Evento: `click`.)*

### `manobra.html` — simulação de manobra
- **Mude o valor de "Delta-v aplicado" (ex.: de 0,85 para 1,2) e clique em "Recalcular projeção"** → após um instante de processamento, os números da opção "Manobrar agora" (distância, probabilidade, combustível, vida útil) **são recalculados** e destacados. *(Eventos; BOM `setTimeout`; DOM; lógica de cálculo.)*
- **Digite algo inválido no delta-v (ex.: letras) e recalcule** → aparece um aviso de valor inválido e o campo é destacado. *(Lógica de validação: `if/else`.)*
- **Clique em "Selecionar e confirmar"** (opção recomendada) → abre um **diálogo de confirmação do navegador**. Se você confirmar, a manobra é "autorizada" (com aviso de sucesso); se cancelar, nada é enviado. *(BOM: `window.confirm` — atende à regra de que nenhuma manobra é automática.)*
- **Clique em "Agendar reavaliação"** (opção de esperar) → agenda a reavaliação e avisa na tela. *(Evento + BOM.)*

### Recursos de JavaScript usados (resumo)
| Pilar | Onde aparece |
|---|---|
| **DOM** | Atualização de textos e barras do clima espacial; troca de status do satélite; inserção de eventos na timeline; recálculo dos resultados da manobra; mensagens de erro do login. |
| **Eventos** | `submit` e `blur` no login; `click` nas abas de filtro, nos interruptores, no sino e nos botões de manobra. |
| **BOM** | `setInterval` (relógio, telemetria, contador); `setTimeout` (processamentos e redirecionamento); `window.confirm` (autorização da manobra); `window.location` (redirecionamento); `sessionStorage`/`localStorage` (sessão). |
| **Lógica** | Validação com `if/else` e expressão regular; laço de repetição no filtro da frota; cálculo da projeção a partir do delta-v. |