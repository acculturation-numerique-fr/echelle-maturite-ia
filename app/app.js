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
    { name: "Culture & cadre IA", max: 5 },
    { name: "Prise en main des outils", max: 4 },
    { name: "Usages opérationnels", max: 3 },
    { name: "Prompting & capitalisation", max: 2 },
    { name: "Personnalisation & autonomie", max: 3 },
    { name: "Technique & automatisation", max: 3 }
  ];

  const QUESTIONS = [
    {
      id: "Q01",
      category: "connaissances",
      dimension: "Culture & cadre IA",
      label: "Je sais ce qu'est l'IA et comment elle fonctionne.",
      points: 1
    },
    {
      id: "Q02",
      category: "connaissances",
      dimension: "Culture & cadre IA",
      label: "Je sais à quoi peut servir l'IA dans mon quotidien.",
      points: 1
    },
    {
      id: "Q03",
      category: "connaissances",
      dimension: "Culture & cadre IA",
      label: "Je sais que l'IA peut donner des réponses fausses, donc je vérifie.",
      points: 1
    },
    {
      id: "Q04",
      category: "connaissances",
      dimension: "Culture & cadre IA",
      label: "Je connais les cadres juridiques liés à l'IA, notamment le RGPD et l'AI Act.",
      points: 1
    },
    {
      id: "Q05",
      category: "connaissances",
      dimension: "Culture & cadre IA",
      label: "Je sais comment on crée un modèle génératif, par exemple via le pré-entraînement.",
      points: 1
    },
    {
      id: "Q06",
      category: "prise_en_main",
      dimension: "Prise en main des outils",
      label: "J'ai déjà utilisé un chatbot ou assistant IA, par exemple ChatGPT, Gemini ou Copilot.",
      points: 1
    },
    {
      id: "Q07",
      category: "prise_en_main",
      dimension: "Prise en main des outils",
      label: "J'ai créé mon propre compte sur un outil d'IA, par exemple ChatGPT, Gemini ou Claude.",
      points: 1
    },
    {
      id: "Q08",
      category: "prise_en_main",
      dimension: "Prise en main des outils",
      label: "J'ai testé plusieurs chatbots et je sais les différencier.",
      points: 1
    },
    {
      id: "Q09",
      category: "prise_en_main",
      dimension: "Prise en main des outils",
      label: "Je sais évaluer une réponse d'IA et reformuler ma demande.",
      points: 1
    },
    {
      id: "Q10",
      category: "usages",
      dimension: "Usages opérationnels",
      label: "J'utilise l'IA pour rédiger ou améliorer des textes.",
      points: 1
    },
    {
      id: "Q11",
      category: "usages",
      dimension: "Usages opérationnels",
      label: "J'utilise l'IA pour créer ou modifier des images.",
      points: 1
    },
    {
      id: "Q12",
      category: "usages",
      dimension: "Usages opérationnels",
      label: "J'utilise l'IA pour analyser des documents ou des données, par exemple une grille Excel.",
      points: 1
    },
    {
      id: "Q13",
      category: "usages",
      dimension: "Prompting & capitalisation",
      label: "Je rédige des prompts avec un cadre, par exemple RTF, RAFT ou CRAFTI.",
      points: 1
    },
    {
      id: "Q14",
      category: "usages",
      dimension: "Prompting & capitalisation",
      label: "J'organise et réutilise mes meilleurs prompts.",
      points: 1
    },
    {
      id: "Q15",
      category: "usages_avances",
      dimension: "Personnalisation & autonomie",
      label: "J'ai un abonnement payant à un outil d'IA, par exemple ChatGPT, Gemini ou Copilot.",
      points: 1
    },
    {
      id: "Q16",
      category: "usages_avances",
      dimension: "Personnalisation & autonomie",
      label: "J'ai créé mon propre chatbot, par exemple un Custom GPT ou un Gem.",
      points: 1
    },
    {
      id: "Q17",
      category: "usages_avances",
      dimension: "Personnalisation & autonomie",
      label: "J'ai installé un logiciel d'IA sur mon ordinateur, par exemple Ollama.",
      points: 1
    },
    {
      id: "Q18",
      category: "usages_experts",
      dimension: "Technique & automatisation",
      label: "J'utilise l'IA pour coder ou corriger du code, par exemple avec Codex, Copilot ou Cursor.",
      points: 1
    },
    {
      id: "Q19",
      category: "usages_experts",
      dimension: "Technique & automatisation",
      label: "J'ai créé un agent pour automatiser des tâches simples.",
      points: 1
    },
    {
      id: "Q20",
      category: "usages_experts",
      dimension: "Technique & automatisation",
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
        "Vous débutez votre découverte de l'IA. C'est le moment idéal pour explorer les fondamentaux et apprendre à vérifier les réponses générées.",
      priorities: [
        "Découvrir les grands usages de l'IA générative.",
        "Apprendre à vérifier les réponses produites.",
        "Créer un premier compte et tester des demandes simples."
      ],
      vigilance: "Ne confondez pas rapidité de réponse et fiabilité de l'information.",
      tools: ["ChatGPT", "Claude", "Google Gemini", "Microsoft Copilot", "Perplexity", "NotebookLM"],
      nextStep:
        "Créez un compte et testez trois usages simples : reformuler un e-mail, résumer un texte et générer des idées."
    },
    {
      min: 3,
      max: 5,
      level: "Débutant",
      profile: "Utilisateur assisté",
      summary:
        "Vous avez franchi les premiers pas et commencez à percevoir le potentiel de l'IA. L'enjeu est maintenant de pratiquer plus régulièrement.",
      priorities: [
        "Comparer plusieurs chatbots.",
        "Formuler des demandes plus précises.",
        "Identifier les cas d'usage les plus utiles dans votre métier."
      ],
      vigilance: "Évitez de rester dans une expérimentation ponctuelle sans méthode.",
      tools: ["ChatGPT", "Claude", "Gemini", "Perplexity", "NotebookLM", "Make"],
      nextStep:
        "Choisissez une tâche hebdomadaire répétitive et utilisez l'IA pour l'améliorer pendant un mois."
    },
    {
      min: 6,
      max: 10,
      level: "Intermédiaire",
      profile: "Opérateur augmenté",
      summary:
        "Vous utilisez déjà l'IA dans votre quotidien. Le prochain palier consiste à structurer vos prompts et sécuriser vos usages.",
      priorities: [
        "Utiliser des cadres de prompting.",
        "Constituer une bibliothèque de prompts.",
        "Mieux gérer les risques de données sensibles."
      ],
      vigilance: "Sans capitalisation, vos gains restent limités et difficiles à reproduire.",
      tools: ["ChatGPT Plus", "Claude Pro", "Gemini", "Perplexity", "Make", "Zapier"],
      nextStep:
        "Construisez une bibliothèque de 10 prompts réutilisables pour vos tâches professionnelles."
    },
    {
      min: 11,
      max: 15,
      level: "Avancé",
      profile: "Architecte IA",
      summary:
        "Vous avez une maîtrise solide des usages et pouvez commencer à structurer des solutions adaptées à votre contexte.",
      priorities: [
        "Créer des assistants spécialisés.",
        "Formaliser des règles de gouvernance.",
        "Accompagner d'autres collaborateurs dans la montée en compétences."
      ],
      vigilance: "Gardez une supervision humaine claire sur chaque automatisation mise en place.",
      tools: [
        "Custom GPTs",
        "Gems",
        "Claude Skills",
        "Claude Plugins",
        "MCP Server",
        "n8n",
        "Apify",
        "Windmill",
        "Langflow"
      ],
      nextStep:
        "Créez un assistant IA interne dédié à une tâche récurrente : support, documentation, reporting ou veille."
    },
    {
      min: 16,
      max: 20,
      level: "Expert",
      profile: "Stratège IA",
      summary:
        "Vous faites partie des utilisateurs les plus aguerris et savez transformer l'IA en levier opérationnel et organisationnel.",
      priorities: [
        "Industrialiser les workflows à valeur métier.",
        "Établir des indicateurs de qualité et d'impact.",
        "Diffuser des standards de pratique au niveau de l'équipe."
      ],
      vigilance: "Pilotez les risques de conformité, de dépendance outil et de qualité des sorties.",
      tools: [
        "Cursor",
        "Claude Code",
        "OpenClaw",
        "Manus",
        "LangChain",
        "Hugging Face",
        "GitHub Copilot",
        "Antigravity"
      ],
      nextStep:
        "Concevez un prototype d'agent connecté à un service métier avec règles de supervision et d'évaluation."
    }
  ];

  const COMPANY_SIZES = [
    "Indépendant",
    "1-9 salariés",
    "10-49 salariés",
    "50-249 salariés",
    "250 salariés et plus",
    "Collectivité / organisme public",
    "Association",
    "Autre"
  ];

  const LOBE_ICON_BASE_URL = "https://unpkg.com/@lobehub/icons-static-svg@latest/icons";
  const TOOL_ICON_RULES = [
    // --- Niveau Débutant & Intermédiaire (Outils grand public et productivité) ---
    { pattern: /(chatgpt|openai|custom gpt|gpt)/i, slug: "openai" },
    { pattern: /(gemini|gems?)/i, slug: "gemini" },
    { pattern: /google workspace/i, slug: "google" },
    { pattern: /perplexity/i, slug: "perplexity" },
    { pattern: /notebooklm/i, slug: "notebooklm" },
    { pattern: /notion/i, slug: "notion" },
    { pattern: /hugging\s*face/i, slug: "huggingface" },

    // --- Niveau Avancé (Automatisation, No-code et Modèles alternatifs) ---
    { pattern: /make/i, slug: "make" },
    { pattern: /zapier/i, slug: "zapier" },
    { pattern: /ollama/i, slug: "ollama" },
    { pattern: /qwen/i, slug: "qwen" },
    { pattern: /mistral/i, slug: "mistral" },
    { pattern: /deepseek/i, slug: "deepseek" },
    { pattern: /grok/i, slug: "grok" },
    { pattern: /apify/i, slug: "apify", local: true },
    { pattern: /windmill/i, slug: "windmill", local: true },
    { pattern: /langflow/i, slug: "langflow", local: true },

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
    { pattern: /llamaindex/i, slug: "llamaindex" },
    { pattern: /langchain/i, slug: "langchain" },
    { pattern: /mcp\s*server/i, slug: "mcp" },
    { pattern: /\bmcp\b/i, slug: "mcp" },
    { pattern: /\bn8n\b/i, slug: "n8n" },
    { pattern: /agents? connect/i, slug: "agentvoice" }
  ];

  function shortDimensionLabel(name) {
    const labels = {
      "Culture & cadre IA": "Culture",
      "Prise en main des outils": "Outils",
      "Usages opérationnels": "Usages",
      "Prompting & capitalisation": "Prompt",
      "Personnalisation & autonomie": "Autonomie",
      "Technique & automatisation": "Tech"
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
    if (!match) {
      return "";
    }

    if (match.local) {
      return `assets/${match.slug}.svg`;
    }

    return `${LOBE_ICON_BASE_URL}/${match.slug}.svg`;
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

  function resolveWebhookUrl(rootDataValue) {
    if (rootDataValue && rootDataValue.trim()) {
      return rootDataValue.trim();
    }

    if (typeof window !== "undefined" && typeof window.AN_WEBHOOK_URL === "string") {
      return window.AN_WEBHOOK_URL.trim();
    }

    return "";
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
      companySizes: COMPANY_SIZES,
      answers: {},
      currentCategoryIndex: 0,
      lead: {
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        job_title: "",
        company_size: "",
        consent: false
      },
      submitState: "idle",
      submitMessage: "",
      webhookUrl: "",

      init() {
        this.answers = normalizeBooleanMap(this.questions.map((q) => q.id));
        this.webhookUrl = resolveWebhookUrl(this.$root.dataset.webhookUrl || "");
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
          fallback: buildToolFallback(toolName)
        }));
      },

      get strengths() {
        return getStrengthsAndFocuses(this.dimensionScores).strengths;
      },

      get focusAreas() {
        return getStrengthsAndFocuses(this.dimensionScores).focuses;
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
        this.submitState = "idle";
        this.submitMessage = "";
      },

      openLeadForm() {
        this.step = "lead";
      },

      backToResults() {
        this.step = "results";
      },

      reset() {
        this.step = "intro";
        this.currentCategoryIndex = 0;
        this.answers = normalizeBooleanMap(this.questions.map((q) => q.id));
        this.lead = {
          first_name: "",
          last_name: "",
          email: "",
          company: "",
          job_title: "",
          company_size: "",
          consent: false
        };
        this.submitState = "idle";
        this.submitMessage = "";
      },

      isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },

      buildPayload() {
        const dimensionScores = {};
        this.dimensionScores.forEach((item) => {
          dimensionScores[item.name] = item.score;
        });

        return {
          submitted_at: new Date().toISOString(),
          score_total: this.scoreTotal,
          level: this.currentLevel.level,
          profile: this.currentLevel.profile,
          dimension_scores: dimensionScores,
          answers: this.answers,
          lead: {
            ...this.lead
          },
          source: "diagnostic-ia-wordpress"
        };
      },

      async submitLead() {
        if (this.submitState === "loading") {
          return;
        }

        if (!this.lead.consent) {
          this.submitState = "error";
          this.submitMessage =
            "Merci de cocher la case de consentement pour recevoir votre diagnostic par e-mail.";
          return;
        }

        if (!this.isValidEmail(this.lead.email)) {
          this.submitState = "error";
          this.submitMessage = "Merci de saisir une adresse e-mail valide.";
          return;
        }

        if (!this.webhookUrl) {
          this.submitState = "error";
          this.submitMessage =
            "Webhook non configuré. Ajoutez data-webhook-url ou window.AN_WEBHOOK_URL avant la mise en ligne.";
          return;
        }

        this.submitState = "loading";
        this.submitMessage = "Envoi en cours...";

        try {
          const response = await fetch(this.webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(this.buildPayload())
          });

          if (!response.ok) {
            throw new Error(`Webhook status ${response.status}`);
          }

          this.submitState = "success";
          this.submitMessage =
            "Merci, votre demande a bien été prise en compte. Votre diagnostic reste affiché sur cette page.";
        } catch (error) {
          this.submitState = "error";
          this.submitMessage =
            "L'envoi n'a pas abouti. Votre résultat reste disponible à l'écran. Vous pouvez réessayer dans quelques instants.";
        }
      }
    };
  };
})();
