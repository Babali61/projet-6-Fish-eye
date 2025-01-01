# FishEye

Projet 6 de la formation OpenClassrooms - Créez un site accessible pour une plateforme de photographes.

## Installation

Rien à installer pour utiliser le site, il suffit d'ouvrir le fichier `index.html`.

## Configuration du Développement

### Prérequis

- Node.js (version 18.18.0 ou supérieure)
- npm (inclus avec Node.js)

### Installation des dépendances de développement

```bash
npm install
```

### Gestion des fichiers

Le projet inclut un fichier `.gitignore` qui exclut du versionnement :
- Le dossier `node_modules`
- Les fichiers de configuration des IDE
- Les fichiers système (.DS_Store, Thumbs.db)
- Les fichiers de logs
- Les fichiers de cache
- Les variables d'environnement

### Linting avec ESLint

Le projet utilise ESLint pour maintenir un code JavaScript propre et cohérent.

Pour lancer la vérification du code :
```bash
npm run lint
```

Pour corriger automatiquement les problèmes qui peuvent l'être :
```bash
npm run lint:fix
```

### Règles ESLint configurées

- Indentation : 2 espaces
- Guillemets simples pour les chaînes de caractères
- Points-virgules obligatoires
- Avertissements pour les variables non utilisées
- Avertissements pour les `console.log`

## Fonctionnalités

- Page d'accueil présentant tous les photographes
- Page individuelle pour chaque photographe
- Galerie de médias avec tri (popularité, date, titre)
- Formulaire de contact
- Lightbox pour visualiser les médias
- Compteur de likes
- Loader pendant le chargement des pages

## Accessibilité

Le site est entièrement accessible avec :
- Navigation au clavier
- Support des lecteurs d'écran
- Textes alternatifs pour les images
- ARIA labels
- Structure sémantique

## Améliorations Récentes

- Ajout d'un loader avec transition fluide
- Configuration d'ESLint pour la qualité du code
- Correction des problèmes de linting
- Amélioration de la gestion des formulaires
- Optimisation de la navigation au clavier
- Ajout d'un fichier `.gitignore`

