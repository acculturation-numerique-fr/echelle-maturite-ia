// Bulletproof Polyfill for Alpine.js x-for template rendering in SVG elements (Firefox/Safari/Chrome namespace fix)
if (typeof document !== 'undefined') {
  const setupSvgTemplates = () => {
    document.querySelectorAll('svg template').forEach(template => {
      if (!('content' in template) || !template.content) {
        const fragment = document.createDocumentFragment();
        while (template.firstChild) {
          fragment.appendChild(template.firstChild);
        }
        Object.defineProperty(template, 'content', {
          get() { return fragment; },
          configurable: true
        });
      }
    });
  };
  // Run immediately (since app.js is at the bottom of the body, elements are already parsed)
  setupSvgTemplates();
  // Also run on DOMContentLoaded just in case
  document.addEventListener('DOMContentLoaded', setupSvgTemplates);
}

(function () {
  const DIMENSIONS = [
    { name: "Connaissances", max: 5 },
    { name: "Prise en main", max: 4 },
    { name: "Usages", max: 5 },
    { name: "Usages avancés", max: 3 },
    { name: "Usages experts", max: 3 }
  ];

  const QUESTIONS = [
    {
      id: "Q01",
      category: "connaissances",
      dimension: "Connaissances",
      label: "Je sais ce qu'est l'IA et comment elle fonctionne.",
      points: 1
    },
    {
      id: "Q02",
      category: "connaissances",
      dimension: "Connaissances",
      label: "Je sais à quoi peut servir l'IA dans mon quotidien.",
      points: 1
    },
    {
      id: "Q03",
      category: "connaissances",
      dimension: "Connaissances",
      label: "Je sais que l'IA peut donner des réponses fausses, donc je vérifie.",
      points: 1
    },
    {
      id: "Q04",
      category: "connaissances",
      dimension: "Connaissances",
      label: "Je connais les cadres juridiques liés à l'IA, notamment le RGPD et l'AI Act.",
      points: 1
    },
    {
      id: "Q05",
      category: "connaissances",
      dimension: "Connaissances",
      label: "Je sais comment on crée un modèle génératif, par exemple via le pré-entraînement.",
      points: 1
    },
    {
      id: "Q06",
      category: "prise_en_main",
      dimension: "Prise en main",
      label: "J'ai déjà utilisé un chatbot ou assistant IA, par exemple ChatGPT, Gemini ou Copilot.",
      points: 1
    },
    {
      id: "Q07",
      category: "prise_en_main",
      dimension: "Prise en main",
      label: "J'ai créé mon propre compte sur un outil d'IA, par exemple ChatGPT, Gemini ou Claude.",
      points: 1
    },
    {
      id: "Q08",
      category: "prise_en_main",
      dimension: "Prise en main",
      label: "J'ai testé plusieurs chatbots et je sais les différencier.",
      points: 1
    },
    {
      id: "Q09",
      category: "prise_en_main",
      dimension: "Prise en main",
      label: "Je sais évaluer une réponse d'IA et reformuler ma demande.",
      points: 1
    },
    {
      id: "Q10",
      category: "usages",
      dimension: "Usages",
      label: "J'utilise l'IA pour rédiger ou améliorer des textes.",
      points: 1
    },
    {
      id: "Q11",
      category: "usages",
      dimension: "Usages",
      label: "J'utilise l'IA pour créer ou modifier des images.",
      points: 1
    },
    {
      id: "Q12",
      category: "usages",
      dimension: "Usages",
      label: "J'utilise l'IA pour analyser des documents ou des données, par exemple une grille Excel.",
      points: 1
    },
    {
      id: "Q13",
      category: "usages",
      dimension: "Usages",
      label: "Je rédige des prompts avec un cadre, par exemple RTF, RAFT ou CRAFTI.",
      points: 1
    },
    {
      id: "Q14",
      category: "usages",
      dimension: "Usages",
      label: "J'organise et réutilise mes meilleurs prompts.",
      points: 1
    },
    {
      id: "Q15",
      category: "usages_avances",
      dimension: "Usages avancés",
      label: "J'ai un abonnement payant à un outil d'IA, par exemple ChatGPT, Gemini ou Copilot.",
      points: 1
    },
    {
      id: "Q16",
      category: "usages_avances",
      dimension: "Usages avancés",
      label: "J'ai créé mon propre chatbot, par exemple un Custom GPT ou un Gem.",
      points: 1
    },
    {
      id: "Q17",
      category: "usages_avances",
      dimension: "Usages avancés",
      label: "J'ai installé un logiciel d'IA sur mon ordinateur, par exemple Ollama.",
      points: 1
    },
    {
      id: "Q18",
      category: "usages_experts",
      dimension: "Usages experts",
      label: "J'utilise l'IA pour coder ou corriger du code, par exemple avec Codex, Copilot ou Cursor.",
      points: 1
    },
    {
      id: "Q19",
      category: "usages_experts",
      dimension: "Usages experts",
      label: "J'ai créé un agent pour automatiser des tâches simples.",
      points: 1
    },
    {
      id: "Q20",
      category: "usages_experts",
      dimension: "Usages experts",
      label: "J'ai créé un agent connecté à des APIs ou à des services externes.",
      points: 1
    }
  ];

  const CATEGORIES = [
    {
      key: "connaissances",
      shortTitle: "Connaissances",
      title: "Comprendre les bases de l'IA",
      description:
        "Compréhension générale de l'IA, de ses applications pratiques, de ses limites et de son cadre réglementaire."
    },
    {
      key: "prise_en_main",
      shortTitle: "Prise en main",
      title: "Se repérer dans les outils",
      description:
        "Familiarité avec les chatbots et capacité à tester, comparer et affiner vos prompts."
    },
    {
      key: "usages",
      shortTitle: "Usages",
      title: "Utiliser l'IA dans son quotidien",
      description:
        "Usages concrets au quotidien : rédaction de contenus, génération d'images, analyse documentaire et structuration de prompts."
    },
    {
      key: "usages_avances",
      shortTitle: "Usages avancés",
      title: "Personnaliser son environnement IA",
      description:
        "Niveau d'autonomie : utilisation d'abonnements Pro, de chatbots personnalisés ou d'outils installés en local."
    },
    {
      key: "usages_experts",
      shortTitle: "Usages experts",
      title: "Automatiser et connecter l'IA",
      description:
        "Usages avancés et techniques : développement assisté, agents autonomes et connexions d'APIs à des services tiers."
    }
  ];

  const LEVELS = [
    {
      min: 0,
      max: 2,
      level: "Novice",
      profile: "Découvreur IA",
      summary:
        "Vous débutez votre découverte de l'IA, c'est le moment idéal pour explorer un domaine qui va transformer votre façon de travailler.",
      priorities: [
        "Testez trois usages simples : reformuler un message, résumer un document, générer des idées.",
        "Vérifiez chaque réponse avec une source fiable.",
        "Gardez dans une note les prompts efficaces."
      ],
      vigilance: "Ne confondez pas rapidité de réponse et fiabilité de l'information.",
      tools: ["Microsoft Copilot", "Google Workspace", "Notion", "ChatGPT", "Gemini", "Claude", "Perplexity", "NotebookLM"],
      nextStep:
        "Créez votre compte sur un outil d'IA et réalisez un premier mini-exercice complet en 15 minutes."
    },
    {
      min: 3,
      max: 5,
      level: "Débutant",
      profile: "Utilisateur assisté",
      summary:
        "Vous avez franchi les premiers pas et commencez à percevoir le potentiel de l'IA, il ne vous reste plus qu'à passer à la pratique régulière.",
      priorities: [
        "Comparez deux outils d'IA sur la même consigne.",
        "Précisez le contexte, l'objectif et le format attendu.",
        "Utilisez l'IA sur une tâche hebdomadaire et mesurez le gain de temps."
      ],
      vigilance: "Évitez de rester dans une expérimentation ponctuelle sans méthode.",
      tools: ["ChatGPT Plus", "Claude Pro", "Custom GPTs", "Gems", "Canva", "Gamma", "Zapier", "Make"],
      nextStep:
        "Choisissez une tâche récurrente de vos études et utilisez l'IA pour la traiter chaque semaine pendant un mois."
    },
    {
      min: 6,
      max: 10,
      level: "Intermédiaire",
      profile: "Opérateur augmenté",
      summary:
        "Vous utilisez déjà l'IA au quotidien et maîtrisez les bases essentielles pour en tirer un vrai bénéfice dans vos activités professionnelles.",
      priorities: [
        "Rédigez des prompts structurés : contexte, rôle, livrable attendu.",
        "Constituez une bibliothèque de prompts pour vos travaux.",
        "Appliquez une règle simple pour protéger les données sensibles."
      ],
      vigilance: "Sans capitalisation, vos gains restent limités et difficiles à reproduire.",
      tools: ["Airtable", "n8n", "Apify", "Replit", "v0", "Lovable", "Grok", "Mistral", "Hugging Face"],
      nextStep:
        "Construisez une bibliothèque de 10 prompts fiables pour vos principaux cas d'usage académiques."
    },
    {
      min: 11,
      max: 15,
      level: "Avancé",
      profile: "Architecte IA",
      summary:
        "Vous avez une maîtrise solide des outils et des usages de l'IA générative, et vous êtes en mesure d'accompagner et d'inspirer vos collègues.",
      priorities: [
        "Automatisez une tâche répétitive de votre semaine.",
        "Vérifiez sur 2 à 3 cas réels le gain de temps.",
        "Partagez votre méthode avec un camarade, puis améliorez-la."
      ],
      vigilance: "Gardez une supervision humaine claire sur chaque automatisation mise en place.",
      tools: ["Ollama", "LM Studio", "DeepSeek", "Qwen", "Langflow", "Flowise", "Dify", "Windmill", "OpenClaw"],
      nextStep:
        "Créez un mini-agent relié à un outil simple (Notion, Google Sheets ou Gmail) pour un usage concret."
    },
    {
      min: 16,
      max: 20,
      level: "Expert",
      profile: "Stratège IA",
      summary:
        "Vous faites partie des utilisateurs les plus aguerris, capables de concevoir des solutions IA sur mesure et d'anticiper les évolutions à venir.",
      priorities: [
        "Concevez un flux complet, de la collecte au livrable final.",
        "Définissez trois critères pour évaluer les résultats de l'agent.",
        "Documentez votre méthode pour qu'elle soit réutilisable."
      ],
      vigilance: "Pilotez les risques de conformité, de dépendance outil et de qualité des sorties.",
      tools: [
        "Cursor",
        "GitHub Copilot",
        "Claude Code",
        "Antigravity",
        "Manus",
        "LangChain",
        "LangGraph",
        "MLflow",
        "MCP"
      ],
      nextStep:
        "Prototypez un agent connecté à un service externe et testez-le sur un scénario réel, du brief au résultat final."
    }
  ];

  const TOOL_ICON_RULES = [
    // --- Niveau Débutant & Intermédiaire (Outils grand public et productivité) ---
    { pattern: /(chatgpt|openai|custom gpt|gpt)/i, slug: "chatgpt" },
    { pattern: /(gemini|gems?)/i, slug: "gemini" },
    { pattern: /google workspace/i, slug: "googleworkspace" },
    { pattern: /perplexity/i, slug: "perplexity" },
    { pattern: /notebooklm/i, slug: "notebooklm" },
    { pattern: /notion/i, slug: "notion" },
    { pattern: /canva/i, slug: "canva" },
    { pattern: /\bgamma\b/i, slug: "gamma" },
    { pattern: /hugging\s*face/i, slug: "huggingface" },

    // --- Niveau Avancé (Automatisation, No-code et Modèles alternatifs) ---
    { pattern: /make/i, slug: "make" },
    { pattern: /zapier/i, slug: "zapier" },
    { pattern: /ollama/i, slug: "ollama" },
    { pattern: /qwen/i, slug: "qwen" },
    { pattern: /mistral/i, slug: "mistral" },
    { pattern: /deepseek/i, slug: "deepseek" },
    { pattern: /grok/i, slug: "grok" },
    { pattern: /apify/i, slug: "apify" },
    { pattern: /airtable/i, slug: "airtable" },
    { pattern: /windmill/i, slug: "windmill" },
    { pattern: /langflow/i, slug: "langflow" },
    { pattern: /flowise/i, slug: "flowise" },
    { pattern: /dify/i, slug: "dify" },
    { pattern: /lm\s*studio/i, slug: "lmstudio" },

    // --- Niveau Expert (Développement, Frameworks et Agents autonomes) ---
    { pattern: /v0/i, slug: "v0" },
    { pattern: /replit/i, slug: "replit" },
    { pattern: /github\s*copilot/i, slug: "githubcopilot" }, // IMPORTANT : avant "copilot"
    { pattern: /copilot/i, slug: "copilot" },
    { pattern: /cursor/i, slug: "cursor" },
    { pattern: /claude\s*code/i, slug: "claudecode" }, // IMPORTANT : avant "claude"
    { pattern: /claude/i, slug: "claude" },
    { pattern: /lovable/i, slug: "lovable" },
    { pattern: /manus/i, slug: "manus" },
    { pattern: /openclaw/i, slug: "openclaw" },
    { pattern: /antigravity/i, slug: "antigravity" },
    { pattern: /langchain/i, slug: "langchain" },
    { pattern: /langgraph/i, slug: "langgraph" },
    { pattern: /mlflow/i, slug: "mlflow" },
    { pattern: /mcp\s*server/i, slug: "mcp" },
    { pattern: /\bmcp\b/i, slug: "mcp" },
    { pattern: /\bn8n\b/i, slug: "n8n" },
    { pattern: /agents? connect/i, slug: "agentvoice" }
  ];

  const TOOL_URL_RULES = [
    { pattern: /(chatgpt\s*plus)/i, url: "https://chatgpt.com" },
    { pattern: /custom gpt/i, url: "https://chatgpt.com/gpts" },
    { pattern: /(chatgpt|openai|gpt)/i, url: "https://chatgpt.com" },
    { pattern: /google gemini/i, url: "https://gemini.google.com" },
    { pattern: /(gemini|gems?)/i, url: "https://gemini.google.com" },
    { pattern: /google workspace/i, url: "https://workspace.google.com" },
    { pattern: /perplexity/i, url: "https://www.perplexity.ai" },
    { pattern: /notebooklm/i, url: "https://notebooklm.google" },
    { pattern: /notion/i, url: "https://www.notion.so" },
    { pattern: /canva/i, url: "https://www.canva.com" },
    { pattern: /\bgamma\b/i, url: "https://gamma.app" },
    { pattern: /hugging\s*face/i, url: "https://huggingface.co" },
    { pattern: /make/i, url: "https://www.make.com" },
    { pattern: /zapier/i, url: "https://zapier.com" },
    { pattern: /ollama/i, url: "https://ollama.com" },
    { pattern: /qwen/i, url: "https://chat.qwenlm.ai" },
    { pattern: /mistral/i, url: "https://mistral.ai" },
    { pattern: /deepseek/i, url: "https://chat.deepseek.com" },
    { pattern: /grok/i, url: "https://x.ai" },
    { pattern: /apify/i, url: "https://apify.com" },
    { pattern: /airtable/i, url: "https://www.airtable.com" },
    { pattern: /windmill/i, url: "https://www.windmill.dev" },
    { pattern: /langflow/i, url: "https://www.langflow.org" },
    { pattern: /flowise/i, url: "https://flowiseai.com" },
    { pattern: /dify/i, url: "https://dify.ai" },
    { pattern: /lm\s*studio/i, url: "https://lmstudio.ai" },
    { pattern: /v0/i, url: "https://v0.dev" },
    { pattern: /replit/i, url: "https://replit.com" },
    { pattern: /github\s*copilot/i, url: "https://github.com/features/copilot" },
    { pattern: /microsoft copilot/i, url: "https://copilot.microsoft.com" },
    { pattern: /copilot/i, url: "https://copilot.microsoft.com" },
    { pattern: /cursor/i, url: "https://www.cursor.com" },
    { pattern: /claude\s*code/i, url: "https://claude.com/product/claude-code" },
    { pattern: /claude pro/i, url: "https://claude.com/pricing" },
    { pattern: /claude plugins/i, url: "https://claude.ai/customize/connectors" },
    { pattern: /claude skills/i, url: "https://claude.ai/customize/skills" },
    { pattern: /claude/i, url: "https://claude.ai" },
    { pattern: /lovable/i, url: "https://lovable.dev" },
    { pattern: /manus/i, url: "https://manus.im" },
    { pattern: /openclaw/i, url: "https://openclaw.ai/" },
    { pattern: /antigravity/i, url: "https://antigravity.google/" },
    { pattern: /langchain/i, url: "https://www.langchain.com" },
    { pattern: /langgraph/i, url: "https://www.langchain.com/langgraph" },
    { pattern: /mlflow/i, url: "https://mlflow.org" },
    { pattern: /mcp\s*server/i, url: "https://modelcontextprotocol.io" },
    { pattern: /\bmcp\b/i, url: "https://modelcontextprotocol.io" },
    { pattern: /\bn8n\b/i, url: "https://n8n.io" },
    { pattern: /agents? connect/i, url: "https://make.com" }
  ];


  function shortDimensionLabel(name) {
    const labels = {
      "Connaissances": "Connaissances",
      "Prise en main": "Prise en main",
      "Usages": "Usages",
      "Usages avancés": "Usages avancés",
      "Usages experts": "Usages experts"
    };

    return labels[name] || name;
  }

  function clampPercent(percent) {
    return Math.max(0, Math.min(100, percent));
  }

  function scoreToPercent(score, max) {
    if (!max) {
      return 0;
    }

    return Math.round((score / max) * 100);
  }

  function resolveToolIconUrl(toolName) {
    const match = TOOL_ICON_RULES.find((rule) => rule.pattern.test(toolName));
    return match ? `assets/icons/${match.slug}.webp` : "";
  }

  function resolveToolUrl(toolName) {
    const match = TOOL_URL_RULES.find((rule) => rule.pattern.test(toolName));
    return match ? match.url : "https://google.com/search?q=" + encodeURIComponent(toolName);
  }


  function buildToolFallback(toolName) {
    const words = toolName
      .replace(/[^A-Za-z0-9À-ÿ\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    if (!words.length) {
      return "AI";
    }

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  function normalizeBooleanMap(ids) {
    const map = {};
    ids.forEach((id) => {
      map[id] = false;
    });
    return map;
  }

  function getStrengthsAndFocuses(rows) {
    const sortedByRatioDesc = [...rows].sort((a, b) => b.ratio - a.ratio);
    const sortedByRatioAsc = [...rows].sort((a, b) => a.ratio - b.ratio);

    return {
      strengths: sortedByRatioDesc.slice(0, 2),
      focuses: sortedByRatioAsc.slice(0, 2)
    };
  }

  function getPdfLibrary() {
    if (typeof window === "undefined") {
      return null;
    }

    const html2canvas = window.html2canvas;
    const jsPdfFactory = window.jspdf && window.jspdf.jsPDF;
    if (typeof html2canvas !== "function" || typeof jsPdfFactory !== "function") {
      return null;
    }

    return { html2canvas, jsPdfFactory };
  }

  function initFloatingHero() {
    const hero = document.querySelector(".an-hero-fx");
    if (!hero) {
      return;
    }

    const icons = Array.from(hero.querySelectorAll("[data-float-icon]"));
    if (!icons.length) {
      return;
    }

    let pointerActive = false;
    let pointerX = 0;
    let pointerY = 0;
    let frame = null;

    const getRadius = () => Math.max(140, Math.min(210, hero.clientWidth * 0.17));
    const getMaxForce = () => Math.max(34, Math.min(56, hero.clientWidth * 0.045));

    const applyRepulsion = () => {
      frame = null;
      const radius = getRadius();
      const maxForce = getMaxForce();

      icons.forEach((icon) => {
        if (!pointerActive) {
          icon.style.setProperty("--an-repel-x", "0px");
          icon.style.setProperty("--an-repel-y", "0px");
          return;
        }

        const rect = icon.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = pointerX - centerX;
        const deltaY = pointerY - centerY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance >= radius) {
          icon.style.setProperty("--an-repel-x", "0px");
          icon.style.setProperty("--an-repel-y", "0px");
          return;
        }

        const angle = Math.atan2(deltaY, deltaX);
        const force = (1 - distance / radius) * maxForce;
        const repelX = -Math.cos(angle) * force;
        const repelY = -Math.sin(angle) * force;

        icon.style.setProperty("--an-repel-x", `${repelX.toFixed(2)}px`);
        icon.style.setProperty("--an-repel-y", `${repelY.toFixed(2)}px`);
      });
    };

    const queueFrame = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(applyRepulsion);
      }
    };

    hero.addEventListener("pointermove", (event) => {
      pointerActive = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      queueFrame();
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      pointerActive = false;
      queueFrame();
    });

    window.addEventListener("resize", queueFrame);
    queueFrame();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFloatingHero, { once: true });
  } else {
    initFloatingHero();
  }

  window.diagnosticIA = function diagnosticIA() {
    return {
      step: "intro",
      categories: CATEGORIES,
      questions: QUESTIONS,
      dimensions: DIMENSIONS,
      levels: LEVELS,
      answers: {},
      currentCategoryIndex: 0,

      init() {
        this.answers = normalizeBooleanMap(this.questions.map((q) => q.id));
      },

      get currentCategory() {
        return this.categories[this.currentCategoryIndex];
      },

      get currentQuestions() {
        if (!this.currentCategory) {
          return [];
        }

        return this.questions.filter((q) => q.category === this.currentCategory.key);
      },

      get isLastCategory() {
        return this.currentCategoryIndex === this.categories.length - 1;
      },

      get progressLabel() {
        return `Étape ${this.currentCategoryIndex + 1}/${this.categories.length}`;
      },

      get scoreTotal() {
        return Object.values(this.answers).filter(Boolean).length;
      },

      get currentLevel() {
        return this.levels.find(
          (lvl) => this.scoreTotal >= lvl.min && this.scoreTotal <= lvl.max
        );
      },

      get dimensionScores() {
        return this.dimensions.map((dimension) => {
          const score = this.questions
            .filter((q) => q.dimension === dimension.name)
            .reduce((sum, q) => sum + (this.answers[q.id] ? q.points : 0), 0);

          const ratio = dimension.max === 0 ? 0 : score / dimension.max;
          return {
            name: dimension.name,
            score,
            max: dimension.max,
            ratio,
            percent: Math.round(ratio * 100)
          };
        });
      },

      get scorePercent() {
        return scoreToPercent(this.scoreTotal, this.questions.length);
      },

      get scoreRingStyle() {
        return `--an-progress:${clampPercent(this.scorePercent)}`;
      },

      get scoreAriaLabel() {
        return `Score global ${this.scoreTotal} sur ${this.questions.length}`;
      },

      get categoryScores() {
        return this.categories.map((category) => {
          const categoryQuestions = this.questions.filter((q) => q.category === category.key);
          const score = categoryQuestions.reduce(
            (sum, q) => sum + (this.answers[q.id] ? q.points : 0),
            0
          );
          const max = categoryQuestions.reduce((sum, q) => sum + q.points, 0);
          const percent = scoreToPercent(score, max);

          return {
            key: category.key,
            shortLabel: category.shortTitle,
            score,
            max,
            percent
          };
        });
      },

      get trajectoryChart() {
        const width = 500;
        const height = 180;
        const paddingX = 65;
        const baseY = 136;
        const amplitude = 88;
        const categories = this.categoryScores;
        const stepX = categories.length > 1 ? (width - paddingX * 2) / (categories.length - 1) : 0;

        const points = categories.map((category, index) => {
          const x = paddingX + index * stepX;
          const y = baseY - (amplitude * category.percent) / 100;
          return {
            key: category.key,
            shortLabel: category.shortLabel,
            x: Number(x.toFixed(2)),
            y: Number(y.toFixed(2))
          };
        });

        const line = points
          .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
          .join(" ");

        const lastX = points.length ? points[points.length - 1].x : paddingX;
        const area = `${line} L${lastX} ${baseY} L${paddingX} ${baseY} Z`;

        return {
          points,
          line,
          area
        };
      },

      get radarChart() {
        const center = 130;
        const radius = 86;
        const ringSteps = [0.25, 0.5, 0.75, 1];
        const rows = this.dimensionScores;
        const count = rows.length || 1;
        const angleShift = -Math.PI / 2;

        const pointAt = (index, distance) => {
          const angle = (Math.PI * 2 * index) / count + angleShift;
          return {
            x: center + Math.cos(angle) * distance,
            y: center + Math.sin(angle) * distance
          };
        };

        const rings = ringSteps.map((scale) => {
          const points = rows
            .map((_, index) => {
              const p = pointAt(index, radius * scale);
              return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
            })
            .join(" ");

          return {
            scale,
            points
          };
        });

        const axes = rows.map((row, index) => {
          const edge = pointAt(index, radius);
          const label = pointAt(index, radius + 24);
          const scorePoint = pointAt(index, radius * (row.percent / 100));
          return {
            key: row.name,
            shortLabel: shortDimensionLabel(row.name),
            x: Number(edge.x.toFixed(2)),
            y: Number(edge.y.toFixed(2)),
            labelX: Number(label.x.toFixed(2)),
            labelY: Number(label.y.toFixed(2)),
            scoreX: Number(scorePoint.x.toFixed(2)),
            scoreY: Number(scorePoint.y.toFixed(2))
          };
        });

        const shape = axes.map((axis) => `${axis.scoreX},${axis.scoreY}`).join(" ");

        return {
          center,
          rings,
          axes,
          shape
        };
      },

      get toolVisuals() {
        const tools = this.currentLevel ? this.currentLevel.tools : [];
        return tools.map((toolName) => ({
          name: toolName,
          iconUrl: resolveToolIconUrl(toolName),
          fallback: buildToolFallback(toolName),
          url: resolveToolUrl(toolName)
        }));
      },


      get strengths() {
        return getStrengthsAndFocuses(this.dimensionScores).strengths;
      },

      get focusAreas() {
        return getStrengthsAndFocuses(this.dimensionScores).focuses;
      },

      get pdfSummary() {
        const level = this.currentLevel ? `${this.currentLevel.level} · ${this.currentLevel.profile}` : "";

        return [
          `Score ${this.scoreTotal}/20`,
          level ? `Niveau ${level}` : ""
        ]
          .filter(Boolean)
          .join(" - ");
      },

      get pdfMeta() {
        const snapshotDate = new Date().toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
        return `Diagnostic généré le ${snapshotDate}.`;
      },

      start() {
        this.step = "questions";
      },

      previousCategory() {
        if (this.currentCategoryIndex > 0) {
          this.currentCategoryIndex -= 1;
        } else {
          this.step = "intro";
        }
      },

      nextCategory() {
        if (!this.isLastCategory) {
          this.currentCategoryIndex += 1;
        }
      },

      showResults() {
        this.step = "results";
      },

      reset() {
        this.step = "intro";
        this.currentCategoryIndex = 0;
        this.answers = normalizeBooleanMap(this.questions.map((q) => q.id));
      },

      async waitForImages(element) {
        const images = Array.from(element.querySelectorAll("img"));
        if (!images.length) {
          return;
        }

        await Promise.all(
          images.map((img) => {
            img.loading = "eager";
            img.decoding = "sync";

            if (img.complete) {
              return Promise.resolve();
            }

            return new Promise((resolve) => {
              let settled = false;
              const done = () => {
                if (settled) {
                  return;
                }
                settled = true;
                resolve();
              };

              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
              window.setTimeout(done, 5000);
            });
          })
        );
      },

      preparePdfCaptureFallbacks(captureNode) {
        const cleanups = [];
        const dpr = Math.max(3, Math.min(4, (window.devicePixelRatio || 1) + 1));
        const pdfLabelFontFamily = "Roboto, 'Segoe UI', Arial, sans-serif";

        const createHiDpiCanvas = (width, height) => {
          const safeWidth = Math.max(1, Math.round(width));
          const safeHeight = Math.max(1, Math.round(height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(safeWidth * dpr);
          canvas.height = Math.round(safeHeight * dpr);
          canvas.style.width = `${safeWidth}px`;
          canvas.style.height = `${safeHeight}px`;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.scale(dpr, dpr);
          }
          return { canvas, ctx, width: safeWidth, height: safeHeight };
        };

        const svgTemplates = Array.from(
          captureNode.querySelectorAll(".an-radar-svg template, .an-line-svg template")
        );
        svgTemplates.forEach((templateNode) => {
          const placeholder = document.createComment("pdf-template-placeholder");
          templateNode.parentNode.insertBefore(placeholder, templateNode);
          templateNode.remove();
          cleanups.push(() => {
            if (!placeholder.parentNode) {
              return;
            }
            placeholder.parentNode.insertBefore(templateNode, placeholder);
            placeholder.remove();
          });
        });

        const scoreRing = captureNode.querySelector(".an-score-ring");
        if (scoreRing) {
          const rect = scoreRing.getBoundingClientRect();
          const { canvas, ctx, width, height } = createHiDpiCanvas(rect.width || 176, rect.height || 176);
          let didRenderScore = false;

          if (ctx) {
            const cx = width / 2;
            const cy = height / 2;
            const trackRadius = Math.min(width, height) / 2 - 10;
            const lineWidth = Math.max(10, Math.round(Math.min(width, height) * 0.11));
            const progress = clampPercent(this.scorePercent) / 100;

            ctx.clearRect(0, 0, width, height);
            ctx.lineCap = "round";
            ctx.lineWidth = lineWidth;

            ctx.strokeStyle = "rgba(29, 86, 216, 0.14)";
            ctx.beginPath();
            ctx.arc(cx, cy, trackRadius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = "#1d56d8";
            ctx.beginPath();
            ctx.arc(cx, cy, trackRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
            ctx.stroke();

            ctx.fillStyle = "#1d56d8";
            ctx.font = `800 ${Math.round(width * 0.255)}px Roboto`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(this.scoreTotal), cx, cy - height * 0.045);

            ctx.fillStyle = "#6f809f";
            ctx.font = `700 ${Math.round(width * 0.09)}px Roboto`;
            ctx.fillText(`/20`, cx, cy + height * 0.18);
            didRenderScore = true;
          }

          if (didRenderScore) {
            const replacement = document.createElement("div");
            replacement.className = "an-pdf-canvas-fallback an-pdf-canvas-score";
            replacement.style.width = `${canvas.style.width}`;
            replacement.style.height = `${canvas.style.height}`;
            replacement.appendChild(canvas);

            const previousDisplay = scoreRing.style.display;
            scoreRing.style.display = "none";
            scoreRing.insertAdjacentElement("afterend", replacement);

            cleanups.push(() => {
              scoreRing.style.display = previousDisplay;
              replacement.remove();
            });
          }
        }

        const radarSvg = captureNode.querySelector(".an-radar-svg");
        if (radarSvg) {
          const rect = radarSvg.getBoundingClientRect();
          const { canvas, ctx, width, height } = createHiDpiCanvas(rect.width || 320, rect.height || 320);
          const radar = this.radarChart || { center: 130, rings: [], axes: [], shape: "" };
          const axes = Array.isArray(radar.axes) ? radar.axes : [];
          let didRenderRadar = false;

          if (ctx) {
            const scaleX = width / 260;
            const scaleY = height / 260;
            const scale = Math.min(scaleX, scaleY);
            const offsetX = (width - 260 * scale) / 2;
            const offsetY = (height - 260 * scale) / 2;
            const center = 130;

            const toCanvasPoint = (x, y) => ({
              x: offsetX + x * scale,
              y: offsetY + y * scale
            });

            const drawPolygon = (points, options) => {
              if (!Array.isArray(points) || !points.length) {
                return;
              }
              ctx.beginPath();
              points.forEach((point, index) => {
                const p = toCanvasPoint(point.x, point.y);
                if (index === 0) {
                  ctx.moveTo(p.x, p.y);
                } else {
                  ctx.lineTo(p.x, p.y);
                }
              });
              ctx.closePath();

              if (options.fill) {
                ctx.fillStyle = options.fill;
                ctx.fill();
              }
              if (options.stroke) {
                ctx.strokeStyle = options.stroke;
                ctx.lineWidth = options.lineWidth || 1;
                ctx.stroke();
              }
            };

            const ringScales = [0.25, 0.5, 0.75, 1];
            ringScales.forEach((ringScale) => {
              const ringPoints = axes.map((_, index) => {
                const angle = (Math.PI * 2 * index) / Math.max(axes.length, 1) - Math.PI / 2;
                return {
                  x: center + Math.cos(angle) * 86 * ringScale,
                  y: center + Math.sin(angle) * 86 * ringScale
                };
              });
              drawPolygon(ringPoints, {
                stroke: "rgba(29, 86, 216, 0.12)",
                lineWidth: 1
              });
            });

            axes.forEach((axis) => {
              const c = toCanvasPoint(center, center);
              const p = toCanvasPoint(axis.x, axis.y);
              ctx.strokeStyle = "rgba(29, 86, 216, 0.12)";
              ctx.lineWidth = 1;
              ctx.setLineDash([3, 3]);
              ctx.beginPath();
              ctx.moveTo(c.x, c.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            });
            ctx.setLineDash([]);

            const shapePoints = axes.map((axis) => ({ x: axis.scoreX, y: axis.scoreY }));
            drawPolygon(shapePoints, {
              fill: "rgba(29, 86, 216, 0.24)",
              stroke: "#1d56d8",
              lineWidth: 1.6
            });

            axes.forEach((axis) => {
              const dot = toCanvasPoint(axis.scoreX, axis.scoreY);
              ctx.fillStyle = "#1d56d8";
              ctx.beginPath();
              ctx.arc(dot.x, dot.y, Math.max(2.5, 3 * scale), 0, Math.PI * 2);
              ctx.fill();

              const label = toCanvasPoint(axis.labelX, axis.labelY);
              ctx.fillStyle = "#3e5278";
              ctx.font = `700 ${Math.max(9, Math.round(10 * scale))}px ${pdfLabelFontFamily}`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(shortDimensionLabel(axis.shortLabel), label.x, label.y);
            });

            didRenderRadar = axes.length > 0;
          }

          if (didRenderRadar) {
            const replacement = document.createElement("div");
            replacement.className = "an-pdf-canvas-fallback an-pdf-canvas-radar";
            replacement.style.width = `${canvas.style.width}`;
            replacement.style.height = `${canvas.style.height}`;
            replacement.appendChild(canvas);

            const previousDisplay = radarSvg.style.display;
            radarSvg.style.display = "none";
            radarSvg.insertAdjacentElement("afterend", replacement);

            cleanups.push(() => {
              radarSvg.style.display = previousDisplay;
              replacement.remove();
            });
          }
        }

        const lineSvg = captureNode.querySelector(".an-line-svg");
        if (lineSvg) {
          const rect = lineSvg.getBoundingClientRect();
          const { canvas, ctx, width, height } = createHiDpiCanvas(rect.width || 500, rect.height || 180);
          const chart = this.trajectoryChart || { points: [] };
          const points = Array.isArray(chart.points) ? chart.points : [];
          let didRenderLine = false;

          if (ctx && points.length) {
            const minX = 65;
            const maxX = 435;
            const minY = 48;
            const maxY = 136;
            const sx = width / 500;
            const sy = height / 180;
            const toCanvas = (x, y) => ({ x: x * sx, y: y * sy });

            const first = toCanvas(minX, maxY);
            const last = toCanvas(maxX, maxY);

            ctx.beginPath();
            points.forEach((point, index) => {
              const p = toCanvas(point.x, point.y);
              if (index === 0) {
                ctx.moveTo(p.x, p.y);
              } else {
                ctx.lineTo(p.x, p.y);
              }
            });
            ctx.lineTo(last.x, last.y);
            ctx.lineTo(first.x, first.y);
            ctx.closePath();
            ctx.fillStyle = "rgba(29, 86, 216, 0.18)";
            ctx.fill();

            ctx.beginPath();
            points.forEach((point, index) => {
              const p = toCanvas(point.x, point.y);
              if (index === 0) {
                ctx.moveTo(p.x, p.y);
              } else {
                ctx.lineTo(p.x, p.y);
              }
            });
            ctx.strokeStyle = "#1d56d8";
            ctx.lineWidth = 2;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.stroke();

            points.forEach((point) => {
              const p = toCanvas(point.x, point.y);
              ctx.fillStyle = "#1d56d8";
              ctx.beginPath();
              ctx.arc(p.x, p.y, Math.max(2.5, 4 * Math.min(sx, sy)), 0, Math.PI * 2);
              ctx.fill();

              const label = toCanvas(point.x, 166);
              ctx.fillStyle = "#42567d";
              ctx.font = `700 ${Math.max(9, Math.round(10 * Math.min(sx, sy)))}px ${pdfLabelFontFamily}`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(point.shortLabel, label.x, label.y);
            });

            didRenderLine = true;
          }

          if (didRenderLine) {
            const replacement = document.createElement("div");
            replacement.className = "an-pdf-canvas-fallback an-pdf-canvas-line";
            replacement.style.width = `${canvas.style.width}`;
            replacement.style.height = `${canvas.style.height}`;
            replacement.appendChild(canvas);

            const previousDisplay = lineSvg.style.display;
            lineSvg.style.display = "none";
            lineSvg.insertAdjacentElement("afterend", replacement);

            cleanups.push(() => {
              lineSvg.style.display = previousDisplay;
              replacement.remove();
            });
          }
        }

        captureNode.classList.add("an-pdf-capture-mode");
        cleanups.push(() => {
          captureNode.classList.remove("an-pdf-capture-mode");
        });

        return () => {
          while (cleanups.length) {
            const cleanup = cleanups.pop();
            try {
              cleanup();
            } catch (error) {
              void error;
            }
          }
        };
      },

      sanitizeCaptureNode(captureNode) {
        const allNodes = [captureNode, ...Array.from(captureNode.querySelectorAll("*"))];
        allNodes.forEach((node) => {
          const attrs = Array.from(node.attributes || []);
          attrs.forEach((attr) => {
            const name = attr.name;
            if (name === "x-ignore") {
              return;
            }
            if (name.startsWith("x-") || name.startsWith(":") || name.startsWith("@")) {
              node.removeAttribute(name);
            }
          });
        });

        // Templates are runtime instructions only; rendered siblings are already in the DOM.
        captureNode.querySelectorAll("template").forEach((templateNode) => {
          templateNode.remove();
        });

        // Keep the cloned tree fully static so Alpine does not re-evaluate x-for scopes.
        captureNode.setAttribute("x-ignore", "");
      },

      async downloadDiagnosticPdf() {
        if (typeof window === "undefined") {
          return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        const pdfLib = getPdfLibrary();
        if (!pdfLib) {
          window.alert("Le module PDF n'est pas chargé. Rechargez la page et réessayez.");
          return;
        }

        if (!this.$root) {
          window.alert("Impossible de générer le PDF.");
          return;
        }

        const sourceNode = this.$root.querySelector(".an-results-shell");
        if (!sourceNode) {
          window.alert("Impossible de générer le PDF sans l'écran de résultats.");
          return;
        }

        const sourceRect = sourceNode.getBoundingClientRect();
        const captureNode = sourceNode.cloneNode(true);
        captureNode.classList.add("an-pdf-capture-shell");
        captureNode.style.position = "fixed";
        captureNode.style.left = "-100000px";
        captureNode.style.top = "0";
        captureNode.style.zIndex = "-1";
        captureNode.style.pointerEvents = "none";
        captureNode.style.opacity = "1";
        captureNode.style.transform = "none";
        captureNode.style.margin = "0";
        captureNode.style.width = `${Math.max(
          960,
          Math.round(sourceRect.width || sourceNode.scrollWidth || 960)
        )}px`;
        captureNode.querySelectorAll("[x-cloak]").forEach((node) => {
          node.removeAttribute("x-cloak");
        });
        captureNode.querySelectorAll(".an-results-actions").forEach((node) => {
          node.remove();
        });
        this.sanitizeCaptureNode(captureNode);
        document.body.appendChild(captureNode);

        const cleanupFallbacks = this.preparePdfCaptureFallbacks(captureNode);

        try {
          if (
            document.fonts &&
            document.fonts.ready &&
            typeof document.fonts.ready.then === "function"
          ) {
            await document.fonts.ready;
          }

          await this.waitForImages(captureNode);
          await new Promise((resolve) => window.requestAnimationFrame(resolve));
          await new Promise((resolve) => window.requestAnimationFrame(resolve));

          const captureWidth = Math.max(
            1,
            Math.ceil(captureNode.scrollWidth || captureNode.getBoundingClientRect().width || 960)
          );
          const captureHeight = Math.max(
            1,
            Math.ceil(captureNode.scrollHeight || captureNode.getBoundingClientRect().height || 1)
          );

          const scale = Math.max(3, Math.min(4, (window.devicePixelRatio || 1) + 1));
          const canvas = await pdfLib.html2canvas(captureNode, {
            scale,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: captureWidth,
            windowHeight: captureHeight,
            ignoreElements: (element) =>
              Boolean(
                element &&
                typeof element.hasAttribute === "function" &&
                element.hasAttribute("data-html2canvas-ignore")
              )
          });

          if (!canvas || !canvas.width || !canvas.height) {
            throw new Error("Canvas PDF invalide (dimensions nulles).");
          }

          const pdf = new pdfLib.jsPdfFactory({
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: false
          });

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 6;
          const printableWidth = pageWidth - margin * 2;
          const printableHeight = pageHeight - margin * 2;
          const widthRatio = printableWidth / canvas.width;
          const heightRatio = printableHeight / canvas.height;
          const renderRatio = Math.min(widthRatio, heightRatio);

          if (!Number.isFinite(renderRatio) || renderRatio <= 0) {
            throw new Error("Ratio de rendu PDF invalide.");
          }

          const renderWidth = canvas.width * renderRatio;
          const renderHeight = canvas.height * renderRatio;
          const offsetX = (pageWidth - renderWidth) / 2;
          const offsetY = margin;

          if (
            !Number.isFinite(renderWidth) ||
            !Number.isFinite(renderHeight) ||
            renderWidth <= 0 ||
            renderHeight <= 0 ||
            !Number.isFinite(offsetX) ||
            !Number.isFinite(offsetY)
          ) {
            throw new Error("Coordonnées PDF invalides.");
          }

          pdf.addImage(canvas, "PNG", offsetX, offsetY, renderWidth, renderHeight);

          pdf.save("Diagnostic-maturite-IA.pdf");
        } catch (error) {
          console.error("PDF export failed:", error);
          window.alert("Export PDF impossible pour le moment. Rechargez la page et réessayez.");
        } finally {
          cleanupFallbacks();
          if (captureNode && captureNode.parentNode) {
            captureNode.parentNode.removeChild(captureNode);
          }
        }
      }
    };
  };
})();
