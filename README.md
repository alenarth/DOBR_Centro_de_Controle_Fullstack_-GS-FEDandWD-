# Dark Orbit BR — Centro de Controle (Front-End Design)

Protótipo de interface (HTML + CSS, **sem JavaScript**) do **Dark Orbit BR**, um sistema que prevê arrasto atmosférico e risco de colisão de satélites em órbita baixa (LEO) usando os dados da rede brasileira **EMBRACE/INPE**, que cobrem a Anomalia Magnética do Atlântico Sul (SAMA).

Entrega da disciplina **Front-End Design** · Global Solution 2026 · FIAP — Engenharia de Software.

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
├── assets/
│   ├── logo.svg        # Logotipo do Dark Orbit BR
│   ├── moodboard.png   # Moodboard com análise crítica de referências
│   └── moodboard.html  # Fonte editável do moodboard
├── integrantes.txt
└── README.md
```

---

## 8. Próximo passo (Web Development)

Esta entrega termina na **estrutura e no estilo**. A interatividade virá na disciplina de Web Development, e as telas já foram preparadas para recebê-la: validação do formulário de login, atualização dos dados em tela (de "seguro" para "perigo"), ações dos botões de manobra e contadores/alertas em tempo real.
