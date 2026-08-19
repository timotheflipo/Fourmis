/* =========================================================
   SUPERORGANISME — comportements de la page
   Aperçus, comparateur avant/après, carte, recherche.
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. Panneau d'aperçu des quatre entrées
     --------------------------------------------------------- */

  var TOPICS = {
    acacia: {
      eyebrow: 'Étude de cas · Laikipia, Kenya',
      title: 'L\'acacia siffleur',
      img: 'images/photos/girafe-acacia.jpg',
      alt: 'Girafe broutant les branches hautes d\'un acacia',
      href: 'acacia.html',
      lede: 'Une fourmi d\'un centimètre protège un arbre contre un animal de six tonnes — ' +
            'et, sans intention ni conscience, tient la savane entière en équilibre.',
      points: [
        '<strong>Le pacte.</strong> <em>Crematogaster mimosae</em> loge dans les galles épineuses de l\'acacia. En échange du gîte, elle mord l\'intérieur de la trompe des éléphants et projette de l\'acide formique.',
        '<strong>Le sifflet.</strong> Les trous percés dans les galles font chanter l\'arbre au vent. L\'éléphant apprend à associer ce sifflement aux morsures, et évite les arbres habités.',
        '<strong>L\'intruse.</strong> La fourmi à grosse tête, invasive, tue les <em>Crematogaster</em> et dévore leur couvain — mais ne défend pas l\'arbre.',
        '<strong>L\'effet domino.</strong> Sans garde, les acacias sont broutés, la savane s\'ouvre, et les lions perdent le couvert dont ils ont besoin pour chasser le zèbre.'
      ]
    },
    superorganisme: {
      eyebrow: 'Concept · Hölldobler & Wilson',
      title: 'Le superorganisme',
      img: 'images/photos/fourmi-macro.jpg',
      alt: 'Portrait macro de la tête d\'une fourmi',
      href: 'superorganisme.html',
      lede: 'La colonie n\'est pas un groupe d\'individus qui coopèrent. C\'est un corps, ' +
            'et les fourmis en sont les cellules — remplaçables, spécialisées, mortelles.',
      points: [
        '<strong>Des organes, pas des métiers.</strong> Les ouvrières font circuler la nourriture de bouche à bouche comme un système circulatoire ; les soldats jouent le rôle d\'un système immunitaire.',
        '<strong>Une durée de vie par fonction.</strong> Trente ans pour la reine, trois ans pour l\'ouvrière, quelques semaines pour le mâle : la longévité suit l\'utilité.',
        '<strong>Une immunité collective.</strong> Les colonies pratiquent une forme de vaccination sociale — le contact avec des congénères exposées protège les naïves.',
        '<strong>Un corps qui s\'assemble.</strong> Les légionnaires bâtissent ponts et radeaux avec leurs propres corps, structures qui s\'ajustent seules à la taille du vide à franchir.'
      ]
    },
    intelligence: {
      eyebrow: 'Mécanique · Stigmergie',
      title: 'L\'intelligence sans cerveau',
      img: 'images/photos/fourmi-tige.jpg',
      alt: 'Fourmis progressant le long d\'une tige verte',
      href: 'intelligence.html',
      lede: 'Aucune fourmi ne connaît le plan d\'ensemble. L\'intelligence n\'est pas dans la tête ' +
            'd\'un individu : elle est dans le système lui-même.',
      points: [
        '<strong>La stigmergie.</strong> Les fourmis ne se donnent pas d\'ordres — elles réagissent aux traces laissées par les précédentes. Une trace en appelle une autre, et l\'architecture émerge.',
        '<strong>Le quorum.</strong> Pour choisir un nid, les éclaireuses ne basculent en transport de masse qu\'une fois un seuil d\'individus atteint sur place. Le groupe décide mieux que ses membres.',
        '<strong>Les seuils de réponse.</strong> Personne n\'assigne les tâches. Chaque fourmi a son propre seuil de déclenchement, et l\'équilibre s\'ajuste tout seul.',
        '<strong>La faille.</strong> Ce système peut se piéger lui-même : coupées de la piste principale, des fourmis tournent en cercle jusqu\'à l\'épuisement. C\'est la spirale de la mort.'
      ]
    },
    guerre: {
      eyebrow: 'Conflit · 100 millions d\'années',
      title: 'La guerre mondiale',
      img: 'images/photos/fourmis-pont.jpg',
      alt: 'Fourmis agrippées les unes aux autres sur une tige',
      href: 'guerre.html',
      lede: 'Sous nos pieds se joue un conflit permanent pour les niches écologiques — ' +
            'des colonnes de chasse de cent mètres aux super-colonies qui couvrent des continents.',
      points: [
        '<strong>Les légionnaires.</strong> Environ 200 espèces nomades, sans nid fixe, qui progressent en colonnes et peuvent tuer 500 000 animaux par jour.',
        '<strong>La trêve entre égaux.</strong> Deux colonies de légionnaires qui se croisent s\'évitent : l\'affrontement serait mutuellement destructeur.',
        '<strong>Les défenses.</strong> Évacuation d\'urgence avec le couvain, ou « bunkers vivants » — des ouvrières à tête carrée qui bouchent physiquement l\'entrée du nid.',
        '<strong>Les super-colonies.</strong> La fourmi d\'Argentine forme en Europe une colonie unique de milliers de kilomètres, dont les membres ne se combattent jamais entre eux.'
      ]
    }
  };

  var sheet = document.getElementById('sheet');
  var lastFocus = null;

  function openSheet(key) {
    var t = TOPICS[key];
    if (!t || !sheet) return;

    lastFocus = document.activeElement;

    var img = document.getElementById('sheetImg');
    img.src = t.img;
    img.alt = t.alt;
    document.getElementById('sheetEyebrow').textContent = t.eyebrow;
    document.getElementById('sheetTitle').textContent = t.title;
    document.getElementById('sheetLede').textContent = t.lede;
    document.getElementById('sheetLink').href = t.href;

    var list = document.getElementById('sheetPoints');
    list.innerHTML = '';
    t.points.forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML = p;
      list.appendChild(li);
    });

    sheet.dataset.open = 'true';
    document.body.style.overflow = 'hidden';
    sheet.querySelector('.sheet__close').focus();
  }

  function closeSheet() {
    if (!sheet) return;
    sheet.dataset.open = 'false';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-topic]');
    if (opener) {
      e.preventDefault();
      openSheet(opener.dataset.topic);
      return;
    }
    if (e.target.closest('[data-close]')) closeSheet();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheet && sheet.dataset.open === 'true') closeSheet();
  });

  /* Garde le focus à l'intérieur du panneau ouvert. */
  if (sheet) {
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || sheet.dataset.open !== 'true') return;
      var f = sheet.querySelectorAll('button, a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------------------------------------------------------
     2. Comparateur avant / après
     --------------------------------------------------------- */

  var compare = document.getElementById('compare');
  var range = document.getElementById('compareRange');

  if (compare && range) {
    var setPos = function (v) {
      compare.style.setProperty('--pos', v + '%');
    };
    setPos(range.value);
    range.addEventListener('input', function () { setPos(this.value); });

    /* Glisser directement sur l'image, sans viser le curseur. */
    var drag = function (e) {
      var r = compare.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      var pct = Math.max(0, Math.min(100, (x / r.width) * 100));
      range.value = pct;
      setPos(pct);
    };

    var stop = function () {
      window.removeEventListener('pointermove', drag);
      window.removeEventListener('pointerup', stop);
    };

    compare.addEventListener('pointerdown', function (e) {
      if (e.target === range) return;
      drag(e);
      window.addEventListener('pointermove', drag);
      window.addEventListener('pointerup', stop);
    });
  }

  /* ---------------------------------------------------------
     3. Carte du monde
     --------------------------------------------------------- */

  var PLACES = [
    {
      x: 60.3, y: 58.9,
      species: 'Crematogaster mimosae',
      place: 'Laikipia, Kenya · savane d\'acacias',
      text: 'Perce les galles épineuses de l\'acacia pour les transformer en sifflets et tenir les grands herbivores à distance. Sans elle, la savane se referme.',
      figures: [['1 cm', 'taille d\'une ouvrière'], ['90 kg', 'ce qu\'un éléphant avale par jour'], ['4 espèces', 'de fourmis se disputent le même arbre']]
    },
    {
      x: 33.3, y: 62.7,
      species: 'Atta spp.',
      place: 'Bassin amazonien, Brésil · forêt tropicale',
      text: 'Les coupe-feuille ne mangent pas les feuilles : elles les compostent pour cultiver un champignon, leur véritable estomac, externalisé depuis 50 millions d\'années.',
      figures: [['600 m²', 'surface d\'une fourmilière exhumée'], ['6 m', 'profondeur du réseau de galeries'], ['~50 Ma', 'ancienneté de la symbiose']]
    },
    {
      x: 27.8, y: 52.8,
      species: 'Eciton burchellii',
      place: 'Isthme de Panama · forêt humide',
      text: 'Ces légionnaires nomades assemblent des ponts avec leurs propres corps. La structure s\'ajuste seule à la taille du vide, sans qu\'aucune fourmi ne le mesure.',
      figures: [['100 m', 'longueur d\'une colonne de chasse'], ['500 000', 'proies tuées par jour'], ['0', 'nid permanent']]
    },
    {
      x: 51.4, y: 29.6,
      species: 'Linepithema humile',
      place: 'Littoral méditerranéen · Espagne à Italie',
      text: 'La fourmi d\'Argentine, invasive, forme ici une super-colonie unique : les individus séparés par des centaines de kilomètres se reconnaissent et ne se combattent pas.',
      figures: [['~6 000 km', 'longueur de la super-colonie'], ['1 odeur', 'signature chimique commune'], ['3 continents', 'où le même clan est présent']]
    },
    {
      x: 56.1, y: 59.2,
      species: 'Dorylus spp.',
      place: 'Bassin du Congo · forêt équatoriale',
      text: 'Les magnans d\'Afrique détiennent le record de ponte du monde animal. La reine ne quitte jamais la colonne et produit sans interruption.',
      figures: [['100 000', 'œufs pondus par jour'], ['20 M', 'individus dans une colonie'], ['20 min à 3 j', 'durée de vie d\'une piste de phéromones']]
    },
    {
      x: 49.4, y: 21.8,
      species: 'Temnothorax albipennis',
      place: 'Sud de l\'Angleterre · falaises côtières',
      text: 'L\'espèce modèle du choix collectif. Les éclaireuses recrutent d\'abord une à une, puis basculent en transport de masse dès qu\'un quorum est atteint sur le site.',
      figures: [['< 200', 'ouvrières par colonie'], ['2 phases', 'tandem run, puis transport'], ['+ rationnel', 'que ses propres membres isolés']]
    }
  ];

  var canvas = document.getElementById('mapCanvas');

  if (canvas) {
    var elSpecies = document.getElementById('mapSpecies');
    var elPlace = document.getElementById('mapPlace');
    var elText = document.getElementById('mapText');
    var elFigures = document.getElementById('mapFigures');
    var pins = [];

    var select = function (i) {
      var p = PLACES[i];
      elSpecies.textContent = p.species;
      elPlace.textContent = p.place;
      elText.textContent = p.text;
      elFigures.innerHTML = p.figures.map(function (f) {
        return '<div class="figure-row"><span class="figure-row__label">' + f[1] +
               '</span><span class="figure-row__value">' + f[0] + '</span></div>';
      }).join('');
      pins.forEach(function (b, j) { b.setAttribute('aria-expanded', String(j === i)); });
    };

    PLACES.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pin';
      b.style.left = p.x + '%';
      b.style.top = p.y + '%';
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-label', p.species + ' — ' + p.place);
      b.addEventListener('click', function () { select(i); });
      b.addEventListener('mouseenter', function () { select(i); });
      canvas.appendChild(b);
      pins.push(b);
    });

    select(0);
  }

  /* ---------------------------------------------------------
     4. Recherche dans la base
     --------------------------------------------------------- */

  var INDEX = [
    { t: 'L\'acacia siffleur', d: 'Crematogaster mimosae perce les galles épineuses pour faire siffler l\'arbre et éloigner les éléphants.', u: 'acacia.html' },
    { t: 'La fourmi à grosse tête', d: 'Espèce invasive qui tue Crematogaster, ne défend pas l\'arbre, et fait s\'ouvrir la savane.', u: 'acacia.html#invasion' },
    { t: 'Les lions et le couvert végétal', d: 'Moins d\'acacias, moins de cachettes : le succès de chasse des lions s\'effondre.', u: 'acacia.html#lions' },
    { t: 'Le superorganisme', d: 'La colonie comme un corps unique dont les fourmis sont les cellules. Hölldobler et Wilson, 2008.', u: 'superorganisme.html' },
    { t: 'Les castes', d: 'Reine, ouvrière, soldat, mâle : l\'espérance de vie découle de la fonction.', u: 'superorganisme.html#castes' },
    { t: 'L\'immunité sociale', d: 'Hygiène collective, soins ciblés et vaccination sociale à l\'échelle de la colonie.', u: 'superorganisme.html#immunite' },
    { t: 'Les ponts vivants', d: 'Les légionnaires Eciton assemblent des ponts avec leurs corps, ajustés à la taille du vide.', u: 'superorganisme.html#ponts' },
    { t: 'L\'agriculture des coupe-feuille', d: 'Atta cultive un champignon depuis 50 millions d\'années, protégé par des bactéries antibiotiques.', u: 'superorganisme.html#agriculture' },
    { t: 'La thermorégulation du nid', d: 'Une architecture ventilée que personne n\'a conçue, issue de règles individuelles simples.', u: 'superorganisme.html#thermo' },
    { t: 'La stigmergie', d: 'Coordination par traces laissées dans l\'environnement, sans communication directe. Grassé, 1959.', u: 'intelligence.html#stigmergie' },
    { t: 'Le quorum sensing', d: 'Choix collectif d\'un nid chez Temnothorax : tandem runs puis transport de masse.', u: 'intelligence.html#quorum' },
    { t: 'Les seuils de réponse', d: 'La répartition du travail sans chef : chaque fourmi a son propre seuil de déclenchement.', u: 'intelligence.html#seuils' },
    { t: 'Les phéromones et l\'odeur de colonie', d: 'Hydrocarbures cutanés, modèle Gestalt, identité chimique distribuée.', u: 'intelligence.html#pheromones' },
    { t: 'Le plus court chemin', d: 'L\'expérience du double pont de Deneubourg et l\'algorithme Ant Colony Optimization.', u: 'intelligence.html#chemin' },
    { t: 'Le cerveau sans cerveau', d: 'Deborah Gordon : une colonie traite l\'information comme un réseau de neurones, sans contrôle central.', u: 'intelligence.html#cerveau' },
    { t: 'Les fourmis légionnaires', d: 'Environ 200 espèces nomades, colonnes de 100 m, jusqu\'à 500 000 proies par jour.', u: 'guerre.html#legionnaires' },
    { t: 'Les super-colonies', d: 'La fourmi d\'Argentine forme en Europe une colonie unique de milliers de kilomètres.', u: 'guerre.html#supercolonies' },
    { t: 'La spirale de la mort', d: 'Coupées de la piste, les fourmis tournent en cercle jusqu\'à mourir d\'épuisement.', u: 'guerre.html#spirale' },
    { t: 'Les bunkers vivants', d: 'Des ouvrières à tête carrée bouchent physiquement l\'entrée du nid face aux légionnaires.', u: 'guerre.html#defenses' },
    { t: 'Nomamyrmex esenbeckii', d: 'La seule espèce capable d\'attaquer avec succès une colonie mature de coupe-feuille.', u: 'guerre.html#bataille' },
    { t: 'La biomasse des fourmis', d: '12,3 mégatonnes de carbone sec, soit environ 20 % de la biomasse humaine. Schultheiss et al., 2022.', u: 'index.html#entrees' }
  ];

  var input = document.getElementById('q');
  var results = document.getElementById('results');

  if (input && results) {
    var norm = function (s) {
      return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    var render = function () {
      var q = norm(input.value.trim());
      if (q.length < 2) { results.dataset.open = 'false'; return; }

      var hits = INDEX.filter(function (e) {
        return norm(e.t).indexOf(q) > -1 || norm(e.d).indexOf(q) > -1;
      }).slice(0, 6);

      if (!hits.length) {
        results.innerHTML = '<p class="search__empty">Aucun résultat pour « ' +
          input.value.trim().replace(/[<>&]/g, '') + ' ».</p>';
      } else {
        results.innerHTML = hits.map(function (e) {
          return '<a class="search__hit" href="' + e.u + '">' +
                 '<span class="search__hit-title">' + e.t + '</span>' +
                 '<span class="search__hit-desc">' + e.d + '</span></a>';
        }).join('');
      }
      results.dataset.open = 'true';
    };

    input.addEventListener('input', render);
    input.addEventListener('focus', render);

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = results.querySelector('.search__hit');
        if (first) { e.preventDefault(); window.location.href = first.href; }
      }
      if (e.key === 'Escape') { results.dataset.open = 'false'; input.blur(); }
      if (e.key === 'ArrowDown') {
        var f = results.querySelector('.search__hit');
        if (f) { e.preventDefault(); f.focus(); }
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search')) results.dataset.open = 'false';
    });
  }

})();
