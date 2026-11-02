# Service d'importation de recettes Mealora

Ce petit service est séparé de GitHub Pages : il permet au navigateur Mealora de demander la page d'un site côté serveur, puis de lire les données de recette Schema.org / JSON-LD. Il ne garantit pas les sites qui exigent une connexion, un abonnement, un CAPTCHA ou qui n'exposent pas de fiche structurée.

## Déploiement gratuit avec Cloudflare Workers

1. Crée un compte Cloudflare (offre gratuite suffisante pour commencer).
2. Ouvre **Workers & Pages** puis **Create application** puis **Create Worker**.
3. Donne-lui le nom `mealora-recipe-import`.
4. Ouvre **Edit code**, remplace le code proposé par le contenu de `worker.js`.
5. Clique **Deploy**.
6. Copie l'adresse du Worker, par exemple `https://mealora-recipe-import.<ton-compte>.workers.dev`.
7. Dans Mealora > Recettes > Ajouter une recette, colle cette adresse dans **Service d’importation**, puis colle le lien de la recette et appuie sur **Importer**.

L'adresse du Worker est conservée sur cet appareil dans le stockage local de Mealora. Il faut la configurer une seule fois par appareil/navigateur.

## Limites et confidentialité

- Le Worker récupère uniquement la page demandée et renvoie les champs de recette structurés. Il n'essaie pas de contourner les connexions, paywalls ou CAPTCHA.
- Le service ne stocke pas les recettes ni les liens dans une base de données.
- Les sites peuvent modifier leur structure ou bloquer les requêtes automatisées.
- Le code autorise les appels depuis l'application via CORS. Pour un usage privé, restreins `Access-Control-Allow-Origin` à l'adresse GitHub Pages de ton application.
