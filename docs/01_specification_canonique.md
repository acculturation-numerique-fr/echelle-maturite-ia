# Diagnostic de Maturité IA — Spécification canonique

Version : 1.0  
Projet : Acculturation Numérique  
Objet : définir la source de vérité métier du diagnostic interactif de maturité en intelligence artificielle.

---

## 1. Principe général

Le diagnostic mesure le niveau de maturité d'un utilisateur face aux usages actuels de l'intelligence artificielle générative.

Le format retenu pour la V1 est volontairement simple :

- 20 critères déclaratifs ;
- 1 point par critère coché ;
- un score global sur 20 ;
- un niveau de maturité ;
- un profil narratif ;
- une cartographie par dimensions ;
- des axes de progression personnalisés.

Le diagnostic n'est pas un examen. Il doit être présenté comme un outil d'auto-positionnement professionnel.

---

## 2. Règle de calcul

Chaque critère coché vaut **1 point**.

```txt
score_total = nombre_de_criteres_coches
score_total_min = 0
score_total_max = 20
```

Le diagnostic V1 ne prévoit pas de pondération.  
Les pondérations avancées peuvent être introduites en V2, mais ne doivent pas complexifier l'expérience initiale.

---

## 3. Grille canonique des 20 critères

### A. Connaissances — 5 points

| ID | Critère | Score |
|---:|---|---:|
| Q01 | Je sais ce qu'est l'IA et comment elle fonctionne. | 1 |
| Q02 | Je sais à quoi peut servir l'IA dans mon quotidien. | 1 |
| Q03 | Je sais que l'IA peut donner des réponses fausses, donc je vérifie. | 1 |
| Q04 | Je connais les cadres juridiques liés à l'IA, notamment le RGPD et l'AI Act. | 1 |
| Q05 | Je sais comment on crée un modèle génératif, par exemple via le pré-entraînement. | 1 |

### B. Prise en main — 4 points

| ID | Critère | Score |
|---:|---|---:|
| Q06 | J'ai déjà utilisé un chatbot ou assistant IA, par exemple ChatGPT, Gemini ou Copilot. | 1 |
| Q07 | J'ai créé mon propre compte sur un outil d'IA, par exemple ChatGPT, Gemini ou Claude. | 1 |
| Q08 | J'ai testé plusieurs chatbots et je sais les différencier. | 1 |
| Q09 | Je sais évaluer une réponse d'IA et reformuler ma demande. | 1 |

### C. Usages — 5 points

| ID | Critère | Score |
|---:|---|---:|
| Q10 | J'utilise l'IA pour rédiger ou améliorer des textes. | 1 |
| Q11 | J'utilise l'IA pour créer ou modifier des images. | 1 |
| Q12 | J'utilise l'IA pour analyser des documents ou des données, par exemple une grille Excel. | 1 |
| Q13 | Je rédige des prompts avec un cadre, par exemple RTF, RAFT ou CRAFTI. | 1 |
| Q14 | J'organise et réutilise mes meilleurs prompts. | 1 |

### D. Usages avancés — 3 points

| ID | Critère | Score |
|---:|---|---:|
| Q15 | J'ai un abonnement payant à un outil d'IA, par exemple ChatGPT, Gemini ou Copilot. | 1 |
| Q16 | J'ai créé mon propre chatbot, par exemple un Custom GPT ou un Gem. | 1 |
| Q17 | J'ai installé un logiciel d'IA sur mon ordinateur, par exemple Ollama. | 1 |

### E. Usages experts — 3 points

| ID | Critère | Score |
|---:|---|---:|
| Q18 | J'utilise l'IA pour coder ou corriger du code, par exemple avec Codex, Copilot ou Cursor. | 1 |
| Q19 | J'ai créé un agent pour automatiser des tâches simples. | 1 |
| Q20 | J'ai créé un agent connecté à des APIs ou à des services externes. | 1 |

---

## 4. Niveaux de maturité

| Score | Niveau | Profil court | Logique d'interprétation |
|---:|---|---|---|
| 0 à 2 | Novice | Découvreur IA | L'utilisateur découvre le sujet et doit consolider les fondamentaux. |
| 3 à 5 | Débutant | Utilisateur assisté | L'utilisateur a commencé à tester les outils mais n'a pas encore de pratique régulière. |
| 6 à 10 | Intermédiaire | Opérateur augmenté | L'utilisateur intègre déjà l'IA dans certaines tâches du quotidien. |
| 11 à 15 | Avancé | Architecte IA | L'utilisateur structure ses usages et commence à concevoir des solutions adaptées. |
| 16 à 20 | Expert | Stratège IA | L'utilisateur maîtrise des usages avancés, techniques ou organisationnels. |

---

## 5. Textes de restitution par niveau

### Novice — 0 à 2 points

Vous débutez votre découverte de l'IA. C'est le moment idéal pour explorer les fondamentaux, comprendre les principaux usages et apprendre à vérifier les réponses produites par les outils génératifs.

### Débutant — 3 à 5 points

Vous avez franchi les premiers pas et commencez à percevoir le potentiel de l'IA. Pour progresser, l'enjeu est de passer d'une expérimentation ponctuelle à une pratique plus régulière et structurée.

### Intermédiaire — 6 à 10 points

Vous utilisez déjà l'IA dans votre quotidien et maîtrisez les bases essentielles pour en tirer un bénéfice concret. Le prochain palier consiste à mieux structurer vos prompts, comparer les outils et sécuriser vos usages.

### Avancé — 11 à 15 points

Vous avez une maîtrise solide des outils et des usages de l'IA générative. Vous êtes en mesure d'accompagner vos collègues, de concevoir des assistants personnalisés et de contribuer à la diffusion de bonnes pratiques.

### Expert — 16 à 20 points

Vous faites partie des utilisateurs les plus aguerris. Vous êtes capable de concevoir des solutions IA sur mesure, d'automatiser des processus et d'anticiper les impacts techniques, humains et organisationnels de l'IA.

---

## 6. Dimensions de restitution

Pour dépasser le score global, les 20 critères sont regroupés en 6 dimensions. Ces dimensions alimentent la visualisation de type radar ou barres horizontales.

| Dimension | Questions | Score max | Ce que mesure la dimension |
|---|---|---:|---|
| Culture & cadre IA | Q01, Q02, Q03, Q04, Q05 | 5 | Compréhension générale, limites, cadre réglementaire et logique de création des modèles. |
| Prise en main des outils | Q06, Q07, Q08, Q09 | 4 | Capacité à utiliser, comparer et améliorer l'interaction avec des assistants IA. |
| Usages opérationnels | Q10, Q11, Q12 | 3 | Utilisation concrète pour produire, transformer ou analyser du contenu. |
| Prompting & capitalisation | Q13, Q14 | 2 | Structuration des demandes et réutilisation des bonnes pratiques. |
| Personnalisation & autonomie | Q15, Q16, Q17 | 3 | Investissement, création de chatbots et usage d'outils locaux. |
| Technique & automatisation | Q18, Q19, Q20 | 3 | Code assisté, agents simples et agents connectés à des systèmes externes. |

---

## 7. Recommandations par niveau

### Novice

Objectif principal : comprendre et tester.

À travailler :

- découvrir les grands usages de l'IA générative ;
- apprendre à vérifier les réponses ;
- créer un premier compte et tester des demandes simples.

Outils recommandés :

- ChatGPT gratuit ;
- Microsoft Copilot ;
- Google Gemini.

Prochaine étape :

> Créer un compte et tester trois usages simples : reformuler un e-mail, résumer un texte, générer une liste d'idées.

---

### Débutant

Objectif principal : pratiquer régulièrement.

À travailler :

- comparer plusieurs chatbots ;
- apprendre à formuler des demandes précises ;
- identifier les cas d'usage utiles dans son métier.

Outils recommandés :

- ChatGPT ;
- Gemini ;
- Claude ;
- Perplexity pour la recherche assistée.

Prochaine étape :

> Choisir une tâche hebdomadaire répétitive et utiliser l'IA pour l'améliorer pendant un mois.

---

### Intermédiaire

Objectif principal : structurer les usages.

À travailler :

- utiliser des cadres de prompting ;
- constituer une bibliothèque de prompts ;
- manipuler des documents et tableaux ;
- comprendre les risques liés aux données sensibles.

Outils recommandés :

- ChatGPT Plus ou Claude Pro ;
- NotebookLM ;
- Perplexity ;
- Canva ou Adobe Express pour les usages visuels.

Prochaine étape :

> Construire une bibliothèque de 10 prompts réutilisables pour son métier.

---

### Avancé

Objectif principal : personnaliser et transmettre.

À travailler :

- créer des assistants spécialisés ;
- formaliser des règles de gouvernance ;
- préparer un premier workflow automatisé ;
- accompagner d'autres collaborateurs.

Outils recommandés :

- Custom GPTs ou Gems ;
- Make ou Zapier ;
- Ollama pour les usages locaux ;
- Notion, Airtable ou Google Workspace pour structurer les connaissances.

Prochaine étape :

> Créer un assistant IA interne dédié à une tâche récurrente : support, documentation, reporting ou veille.

---

### Expert

Objectif principal : industrialiser et piloter.

À travailler :

- connecter des agents à des APIs ;
- automatiser des processus métiers ;
- suivre les coûts, la sécurité et la qualité ;
- diffuser une culture IA responsable.

Outils recommandés :

- OpenAI API, Anthropic API ou équivalent ;
- n8n, Make ou LangGraph selon le niveau technique ;
- GitHub Copilot, Cursor ou Codex ;
- outils de monitoring et de documentation interne.

Prochaine étape :

> Concevoir un prototype d'agent connecté à un service métier et définir ses règles de sécurité, d'évaluation et de supervision.

---

## 8. Structure JSON canonique

Cette structure peut servir à l'implémentation Alpine.js.

```json
{
  "questions": [
    {
      "id": "Q01",
      "category": "Connaissances",
      "dimension": "Culture & cadre IA",
      "label": "Je sais ce qu'est l'IA et comment elle fonctionne.",
      "points": 1
    }
  ],
  "levels": [
    {
      "min": 0,
      "max": 2,
      "level": "Novice",
      "profile": "Découvreur IA"
    }
  ]
}
```

---

## 9. Décisions produit gelées pour la V1

La V1 doit rester volontairement légère.

Inclus :

- 20 critères ;
- score global ;
- niveaux ;
- dimensions ;
- restitution ;
- recommandations ;
- CTA final ;
- collecte optionnelle via formulaire.

Exclus de la V1 :

- pondération avancée ;
- notation par fréquence ;
- login utilisateur ;
- tableau de bord administrateur ;
- benchmark dynamique ;
- génération PDF serveur ;
- personnalisation sectorielle complexe.
