# Superorganisme

Base de connaissance personnelle sur les fourmis, compilée à partir de notes de
documentaires et d'articles scientifiques.

Site statique — HTML, CSS et JavaScript, sans dépendance ni étape de build.

## Structure

```
index.html            Accueil : hero, recherche, comparateur avant/après,
                      carte du monde interactive, anneau de biomasse
acacia.html           L'acacia siffleur (Crematogaster mimosae)
superorganisme.html   Le superorganisme (castes, immunité sociale, ponts vivants)
intelligence.html     L'intelligence sans cerveau (stigmergie, quorum, phéromones)
guerre.html           La guerre mondiale (légionnaires, super-colonies, spirale)

css/style.css         Feuille de style unique, tokens en variables CSS
js/main.js            Aperçus, comparateur, carte, recherche
images/photos/        Photographies
images/avatars/       Illustrations des castes
images/world.svg      Fond de carte
serve.py              Serveur statique local pour la prévisualisation
```

## Prévisualiser en local

```bash
python3 serve.py
```

Puis ouvrir http://localhost:4310.

## Déploiement

Déployé via GitHub Pages depuis la branche `main`, à la racine du dépôt.
Un `push` sur `main` met le site en ligne en une trentaine de secondes.

Après modification de `css/style.css` ou `js/main.js`, penser à incrémenter le
paramètre `?v=` dans les balises correspondantes des fichiers HTML, pour éviter
que les navigateurs servent une version en cache.

## Système de design

Repris de celui d'Ecosia : canvas blanc, un unique accent vert lime,
photographie plein cadre comme seule source de couleur.

| Rôle | Valeur |
|---|---|
| Accent | `#d7eb80` |
| Texte | `#333333` |
| Surfaces | `#ffffff` → `#f8f8f6` → `#f0f0eb` |
| Titres | Space Grotesk |
| Texte courant | Inter |
| Rayon des cartes | 20 px |
| Boutons et champs | pilule (9999 px) |
| Écart entre sections | 80 px |

## Crédits

- Photographies : [Unsplash](https://unsplash.com) (licence Unsplash)
- Photographies avant/après de la savane : notes personnelles
- Illustrations des castes : générées via Higgsfield
- Fond de carte : [Natural Earth](https://www.naturalearthdata.com) (domaine public),
  via `world-atlas`, converti en SVG en projection équirectangulaire
