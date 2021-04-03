# Mon petit RPG
Bienvenue dans Mon Petit RPG, créé pour theTribe!

## Description
Mon Petit RPG est un idle RPG écrit en NodeJS et ReactJS, reposant sur une base de données PostgresSQL et hébergé sur Heroku.

Vous pouvez accéder à l'application live [ici](https://mon-petit-rpg.herokuapp.com/)
## Mode d'emploi
### Installation
 - Cloner le dépôt
 - Lancer `npm install`

### Lancement en local avec hot reload
Depuis le dossier racine de l'application, lancer les scripts suivants:
 - Build du serveur: `npm run build:watch`
 - Lancement du serveur: `npm run start:dev`
 - Lancement du front: `npm run start:front`

Les informations de connexion à la base de données sont disponibles dans le fichier [Constants](server/src/constants.ts)
(placer la variable d'environnement PGSSLREQUIRE à true pour permettre la connexion)

### Lancement en mode build
Depuis le dossier racine de l'application, lancer les scripts suivants:
 - Build du serveur: `npm run build`
 - Build du front: `npm run build:front`
 - Lancement du serveur: `npm run start`
 

## Technique
L'application est hébergée sur Heroku
  ### Backend
  Le backend est écrit en NodeJS/Typescript
  
  #### Librairies et technos utilisées
  - ExpressJS (serveur web)
  - Apollo/GraphQL (intéractions entre le frontend et la base de données)
  - TypeORM (ORM)
  - Luxon (gestion du temps)
  - Ava (tests unitaires)
  - Bcrypt et jsonwebtoken (sécurité)
  - PostgreSQL (base de donnée)

  ### Frontend
  Le frontend est écrit en ReactJS et Typescript
  
  #### Librairies et technos utilisées
  - create-react-app (création et bundler)
  - react-router (Router)
  - react-jwt (sécurité)
  - Apollo/GraphQL
  - Luxon
  - Material-UI (CSS)

Vous pouvez trouver les différents diagrammes [ici](out/diagrams.md)
