# Surveillance Environnementale - Digital Campus

## Description

Application web de surveillance en temps réel des conditions environnementales des salles de Digital Campus. L'application permet de suivre la qualité de l'air (CO2), la température et l'humidité dans chaque salle.

## Fonctionnalités Principales

### Dashboard Principal

- Vue d'ensemble de toutes les salles par étage
- Statut en temps réel des capteurs
- Indicateurs visuels pour les valeurs hors normes
- Filtrage par étage avec émojis

### Vue Détaillée par Salle

- Graphiques interactifs sur 24h
- Trois types de visualisation : aire, ligne, barres
- Moyennes des mesures
- Export des données (CSV, PDF, XML)

### Système d'Alertes

- Notifications en temps réel
- Seuils configurés :
  - CO2 : > 1000 ppm
  - Température : 19-25°C
  - Humidité : 30-70%

## Installation

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Construction pour production
npm run build
npm start
```

## Technologies Utilisées

- Next.js 14
- React Query
- Recharts
- TailwindCSS
- Firebase
- PWA Ready

## Configuration Requise

- Node.js 18+
- npm ou yarn
- Connexion Internet pour les données en temps réel

## PWA

L'application est installable sur mobile et desktop avec des fonctionnalités hors ligne.

## Maintenance

- Seuils d'alerte configurables dans `/lib/constants.ts`
- Rafraîchissement des données toutes les 60 secondes
- Logs des alertes en temps réel

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit (`git commit -m 'Ajout fonctionnalité'`)
4. Push (`git push origin feature/amelioration`)
5. Pull Request
