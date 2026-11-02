# Mealora 5.13 — Web PWA

## Nouveautés 5.13
- Stocks modifiables : nom, quantité, unité, emplacement et date limite.
- Lorsqu'on appuie sur **Acheté** dans Courses, Mealora demande la quantité réellement achetée, l'unité, l'emplacement et la date limite facultative. Après validation, l'article est ajouté au stock (ou cumulé avec un aliment identique), puis retiré de la liste d'achats.
- Importation de recettes : possibilité de configurer une adresse de service Cloudflare Worker, qui récupère les pages côté serveur et extrait les données Recipe JSON-LD.
- Les champs incomplets ne sont pas enregistrés automatiquement ; la recette doit être complétée et vérifiée. Les quantités non reconnues sont marquées « à préciser » au lieu d’être présentées comme une portion fictive.
- Conservation de la base locale `fresko50` pour préserver les stocks et recettes déjà enregistrés.

## Installation Web
Déployer le contenu du dossier `web` dans le dépôt GitHub Pages habituel.

## Activer l'importation multi-sites
Le service doit être déployé séparément. Suivre `recipe-import-worker/README_FR.md`, puis renseigner l'URL du Worker dans le formulaire d'ajout de recette.

## Vérifications effectuées
- Syntaxe JavaScript contrôlée avec `node --check`.
- Archive ZIP contrôlée.
- Le service Worker et le manifeste ont été incrémentés en 5.13.
- Le déploiement Cloudflare et l'importation réelle sur Marmiton/750g/Cuisine AZ ne sont pas exécutés depuis cet environnement : l'URL du Worker doit être créée par le propriétaire du compte Cloudflare.


## Version 5.14 — validation des produits

Ajout d’une fenêtre « Scanner emballages » dans Stocks. Elle permet de contrôler le nom, la quantité, l’unité, l’emplacement et la date limite de chaque produit. Les quatre produits fournis par l’utilisateur sont préremplis. Aucun produit n’est ajouté avant le clic explicite sur « Confirmer et ajouter au stock ». Le choix de photos est présent comme préparation du futur scan ; cette version ne réalise pas encore de reconnaissance automatique des emballages ni d’analyse IA. Aucune API payante n’est appelée.
