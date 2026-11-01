# Fresko — Version 4.0 (PWA)

Application web progressive installable sur Android, iPhone, tablettes et ordinateurs.

## Publication simple avec GitHub Pages
1. Décompresser cette archive.
2. Copier le contenu du dossier `Fresko_PWA_4.0` à la racine d'un dépôt GitHub dédié.
3. Dans GitHub : Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
4. Attendre la publication, puis ouvrir l'URL GitHub Pages en HTTPS.
5. Android/Chrome : menu ⋮ → Installer l'application. iPhone/Safari : Partager → Sur l'écran d'accueil.

## Données et limites de cette version
- Inventaire et liste de courses enregistrés localement dans le navigateur/appareil via localStorage.
- Les données ne sont pas synchronisées entre appareils.
- Une photo peut être jointe à un aliment; elle est conservée localement dans le navigateur.
- Le service worker met en cache l'application pour un usage hors ligne après le premier chargement.
- Les fonctions IA (reconnaissance photo et génération de recettes) ne sont pas encore connectées à un serveur. Ne pas saisir de clé API dans le navigateur.
- Pour iPhone, la prise de photo et l'installation dépendent de Safari et des autorisations iOS.
