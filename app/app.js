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
        "Cette première partie mesure votre compréhension générale de l'IA, de ses usages, de ses limites et de son cadre réglementaire."
    },
    {
      key: "prise_en_main",
      shortTitle: "Prise en main",
      title: "Se repérer dans les outils",
      description:
        "Cette section évalue votre familiarité avec les chatbots et votre capacité à comparer, tester et améliorer vos demandes."
    },
    {
      key: "usages",
      shortTitle: "Usages",
      title: "Utiliser l'IA dans son quotidien",
      description:
        "Cette partie porte sur vos usages concrets : rédaction, image, analyse de documents, prompts et capitalisation."
    },
    {
      key: "usages_avances",
      shortTitle: "Usages avancés",
      title: "Personnaliser son environnement IA",
      description:
        "Cette section mesure votre niveau d'autonomie : abonnement, chatbot personnalisé ou outil installé localement."
    },
    {
      key: "usages_experts",
      shortTitle: "Usages experts",
      title: "Automatiser et connecter l'IA",
      description:
        "Cette dernière partie concerne les usages techniques : code assisté, agents simples et agents connectés à des services externes."
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
      tools: ["ChatGPT", "Microsoft Copilot", "Google Gemini"],
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
      tools: ["ChatGPT", "Gemini", "Claude", "Perplexity"],
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
      tools: ["ChatGPT Plus", "Claude Pro", "NotebookLM", "Perplexity"],
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
      tools: ["Custom GPTs", "Gems", "Make", "Zapier", "Ollama"],
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
      tools: ["Agents connectés", "APIs métiers", "Airtable", "Notion", "Google Workspace"],
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
