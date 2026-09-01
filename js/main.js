/* =========================================================
   SUPERORGANISME — comportements de la page
   Aperçus, comparateur avant/après, carte du monde.
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
      img: 'images/photos/acacia-epines.jpg',
      alt: 'Épines creuses d\'un acacia, où loge la colonie',
      href: 'acacia.html',
      lede: 'Une fourmi d\'un centimètre protège un arbre contre un animal de six tonnes ' +
            'et, sans intention ni conscience, tient la savane entière en équilibre.',
      points: [
        '<strong>Le pacte.</strong> <em>Crematogaster mimosae</em> loge dans les galles épineuses de l\'acacia. En échange du gîte, elle mord l\'intérieur de la trompe des éléphants et projette de l\'acide formique.',
        '<strong>Le sifflet.</strong> Les trous percés dans les galles font chanter l\'arbre au vent. L\'éléphant apprend à associer ce sifflement aux morsures, et évite les arbres habités.',
        '<strong>L\'intruse.</strong> La fourmi à grosse tête, invasive, tue les <em>Crematogaster</em> et dévore leur couvain, mais ne défend pas l\'arbre.',
        '<strong>L\'effet domino.</strong> Sans garde, les acacias sont broutés, la savane s\'ouvre, et les lions perdent le couvert dont ils ont besoin pour chasser le zèbre.'
      ]
    },
    superorganisme: {
      eyebrow: 'Concept · Hölldobler & Wilson',
      title: 'Le superorganisme',
      img: 'images/photos/fourmis-pont.jpg',
      alt: 'Trois fourmis accrochées à une tige, formant une chaîne',
      href: 'superorganisme.html',
      lede: 'La colonie fonctionne comme un corps unique, ' +
            'dont les fourmis sont les cellules : remplaçables, spécialisées, mortelles.',
      points: [
        '<strong>Des organes, pas des métiers.</strong> Les ouvrières font circuler la nourriture de bouche à bouche comme un système circulatoire ; les soldats jouent le rôle d\'un système immunitaire.',
        '<strong>Une durée de vie par fonction.</strong> Trente ans pour la reine, trois ans pour l\'ouvrière, quelques semaines pour le mâle : la longévité suit l\'utilité.',
        '<strong>Une immunité collective.</strong> Les colonies pratiquent une forme de vaccination sociale : le contact avec des congénères exposées protège les naïves.',
        '<strong>Un corps qui s\'assemble.</strong> Les légionnaires bâtissent ponts et radeaux avec leurs propres corps, structures qui s\'ajustent seules à la taille du vide à franchir.'
      ]
    },
    intelligence: {
      eyebrow: 'Mécanique · Stigmergie',
      title: 'L\'intelligence sans cerveau',
      img: 'images/photos/colonne.jpg',
      alt: 'Fourmis coupe-feuille en file, chacune portant un fragment de feuille',
      href: 'intelligence.html',
      lede: 'Aucune fourmi ne connaît le plan d\'ensemble. L\'intelligence est dans le ' +
            'système lui-même, pas dans la tête d\'un individu.',
      points: [
        '<strong>La stigmergie.</strong> Les fourmis ne se donnent pas d\'ordres : elles réagissent aux traces laissées par les précédentes. Une trace en appelle une autre, et l\'architecture émerge.',
        '<strong>Le quorum.</strong> Pour choisir un nid, les éclaireuses ne basculent en transport de masse qu\'une fois un seuil d\'individus atteint sur place. Le groupe décide mieux que ses membres.',
        '<strong>Les seuils de réponse.</strong> Personne n\'assigne les tâches. Chaque fourmi a son propre seuil de déclenchement, et l\'équilibre s\'ajuste tout seul.',
        '<strong>La faille.</strong> Ce système peut se piéger lui-même : coupées de la piste principale, des fourmis tournent en cercle jusqu\'à l\'épuisement. C\'est la spirale de la mort.'
      ]
    },
    guerre: {
      eyebrow: 'Conflit · 100 millions d\'années',
      title: 'La guerre mondiale',
      img: 'images/photos/fourmis-nourriture.jpg',
      alt: 'Fourmis massées en nombre sur une proie',
      href: 'guerre.html',
      lede: 'Sous nos pieds se joue un conflit permanent pour les niches écologiques : ' +
            'des colonnes de chasse de cent mètres aux super-colonies qui couvrent des continents.',
      points: [
        '<strong>Les légionnaires.</strong> Environ 200 espèces nomades, sans nid fixe, qui progressent en colonnes et peuvent tuer 500 000 animaux par jour.',
        '<strong>La trêve entre égaux.</strong> Deux colonies de légionnaires qui se croisent s\'évitent : l\'affrontement serait mutuellement destructeur.',
        '<strong>Les défenses.</strong> Évacuation d\'urgence avec le couvain, ou « bunkers vivants » : des ouvrières à tête carrée qui bouchent physiquement l\'entrée du nid.',
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

    window.clearTimeout(closeTimer);
    delete sheet.dataset.closing;
    sheet.dataset.open = 'true';
    document.body.style.overflow = 'hidden';
    sheet.querySelector('.sheet__close').focus();
  }

  var closeTimer = null;

  function closeSheet() {
    if (!sheet || sheet.dataset.open !== 'true') return;

    /*
       Le panneau doit repartir par où il est venu. On marque la fermeture,
       la CSS joue la transition inverse, et on ne retire réellement le
       panneau qu'une fois celle-ci terminée. Le focus revient tout de suite :
       il ne doit pas attendre une animation.
    */
    sheet.dataset.closing = 'true';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();

    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(function () {
      sheet.dataset.open = 'false';
      delete sheet.dataset.closing;
    }, 170);
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
     1 bis. Navigation repliable

     Sous 980 px, les quatre liens d'article disparaissaient purement et
     simplement, sans rien pour les remplacer : depuis un article, le seul
     chemin vers un autre article passait par un retour à l'accueil et une
     nouvelle sélection. Sur un site qui se consulte largement au téléphone,
     c'était le défaut le plus coûteux du projet.

     Le panneau est construit à partir des liens déjà présents dans l'en-tête,
     pour qu'il n'existe qu'une seule liste à tenir à jour. Les originaux sont
     en `display: none` à cette largeur, donc retirés de l'arbre
     d'accessibilité : aucun doublon pour un lecteur d'écran.
     --------------------------------------------------------- */

  var header = document.querySelector('.header');
  var navSource = header && header.querySelector('.nav');

  if (navSource) {
    var barre = header.querySelector('.header__inner');
    var actionPrincipale = barre.querySelector('.btn');

    var bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'nav-toggle';
    bouton.id = 'navToggle';
    bouton.setAttribute('aria-expanded', 'false');
    bouton.setAttribute('aria-controls', 'navPanel');
    bouton.innerHTML =
      '<span class="nav-toggle__texte">Menu</span>' +
      '<svg class="nav-toggle__icone" width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>';

    var panneau = document.createElement('div');
    panneau.className = 'nav-panel';
    panneau.id = 'navPanel';
    panneau.dataset.open = 'false';

    var liste = document.createElement('nav');
    liste.setAttribute('aria-label', 'Articles');
    Array.prototype.forEach.call(navSource.querySelectorAll('.nav__link'), function (a) {
      var lien = a.cloneNode(true);
      lien.className = 'nav-panel__link';
      /* Repère de position : sur mobile, on ne voit plus la barre du haut. */
      if (lien.getAttribute('href') === location.pathname.split('/').pop()) {
        lien.setAttribute('aria-current', 'page');
      }
      liste.appendChild(lien);
    });
    panneau.appendChild(liste);

    /* L'action principale rejoint le panneau : trois éléments dans une barre
       de 375 px se chevauchaient. */
    if (actionPrincipale) {
      var copie = actionPrincipale.cloneNode(true);
      copie.className = 'btn btn--lime nav-panel__cta';
      panneau.appendChild(copie);
    }

    barre.insertBefore(bouton, actionPrincipale || null);
    header.appendChild(panneau);

    var ouvrir = function (etat) {
      panneau.dataset.open = etat ? 'true' : 'false';
      bouton.setAttribute('aria-expanded', etat ? 'true' : 'false');
      if (!etat) return;
      var premier = panneau.querySelector('a');
      if (premier) premier.focus();
    };

    bouton.addEventListener('click', function () {
      ouvrir(panneau.dataset.open !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panneau.dataset.open === 'true') {
        ouvrir(false);
        bouton.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (panneau.dataset.open !== 'true') return;
      if (!panneau.contains(e.target) && e.target !== bouton && !bouton.contains(e.target)) {
        ouvrir(false);
      }
    });

    /* Repassé au-dessus du seuil, le panneau n'a plus lieu d'être ouvert. */
    var large = window.matchMedia('(min-width: 981px)');
    var surSeuil = function () { if (large.matches) ouvrir(false); };
    if (large.addEventListener) large.addEventListener('change', surSeuil);
    else if (large.addListener) large.addListener(surSeuil);
  }

  /* ---------------------------------------------------------
     1 ter. Textures des encadrés

     Trois sections portent une texture animée derrière leur encadré. Aucune
     ne tourne tant qu'elle n'est pas à l'écran : une boucle infinie qui
     s'exécute pendant toute la visite pour n'être vue que quelques secondes
     fait travailler le compositeur pour rien.
     --------------------------------------------------------- */

  var textures = document.querySelectorAll('.callout--texture');

  if (textures.length && 'IntersectionObserver' in window) {
    var oeil = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        e.target.dataset.visible = e.isIntersecting ? 'true' : 'false';
      });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(textures, function (t) { oeil.observe(t); });
  } else {
    /* Sans observateur, on laisse tourner : mieux vaut l'effet que rien. */
    Array.prototype.forEach.call(textures, function (t) { t.dataset.visible = 'true'; });
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
      /* La capture garde le suivi actif même si le pointeur sort du cadre. */
      if (compare.setPointerCapture) {
        try { compare.setPointerCapture(e.pointerId); } catch (err) {}
      }
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
      /*
         Uniquement au clic. Le `mouseenter` d'origine faisait défiler les six
         fiches d'espèce dès qu'on traversait la carte à la souris : le texte,
         le lieu et les trois chiffres se remplaçaient à chaque pastille.
      */
      b.addEventListener('click', function () { select(i); });
      canvas.appendChild(b);
      pins.push(b);
    });

    select(0);
  }

  /* ---------------------------------------------------------
     5. Apparition liée au défilement

     La progression de chaque bloc est recalculée à chaque image à
     partir de sa position à l'écran, plutôt que déclenchée une fois
     puis laissée à une transition CSS. Conséquence : un bloc ne se
     dévoile complètement qu'une fois réellement amené au centre de
     l'écran, et l'apparition suit exactement le geste de défilement.

     Les cibles sont désignées ici plutôt que dans le HTML : la mise
     en page reste lisible, et une nouvelle section hérite de l'effet
     sans qu'on ait à y penser.
     --------------------------------------------------------- */

  /* Le haut du bloc, en fraction de la hauteur d'écran. */
  var FROM = 1.00;   /* à hauteur du bord bas : rien n'est visible */
  var TO   = 0.42;   /* arrivé aux deux cinquièmes hauts : entièrement visible */
  var SHIFT = 30;    /* décalage vertical de départ, en pixels */
  var STAGGER = 0.07; /* décalage de fenêtre entre voisins d'une même grille */

  /* Blocs autonomes. */
  var SOLO = ['.sec-head', '.figure-compare', '.map', '.donut-card', '.split > div'];

  /* Grilles dont les enfants se dévoilent en cascade. */
  var GRIDS = ['.cards', '.castes', '.facts', '.next-cards'];

  /*
     Une unité = un ou plusieurs éléments qui apparaissent ensemble,
     pilotés par la position du premier d'entre eux.
  */
  var units = [];
  var seen = [];

  var addUnit = function (els, stagger) {
    els = els.filter(function (el) { return seen.indexOf(el) === -1; });
    if (!els.length) return;
    els.forEach(function (el) { seen.push(el); el.classList.add('reveal'); });
    units.push({ els: els, stagger: stagger || 0, done: false });
  };

  SOLO.forEach(function (sel) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
      addUnit([el], 0);
    });
  });

  GRIDS.forEach(function (sel) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        /* Au-delà de quatre, le décalage devient une attente plutôt qu'un effet. */
        addUnit([child], Math.min(i, 4));
      });
    });
  });

  /*
     Dans un article, découper par titre de niveau 2 : chaque partie —
     titre, paragraphes, figures, encadrés — forme un seul bloc. Animer
     les titres et les images sans le texte donnait un résultat bancal.
  */
  Array.prototype.forEach.call(document.querySelectorAll('.prose'), function (prose) {
    var block = [];
    var flush = function () {
      if (block.length) { addUnit(block, 0); block = []; }
    };
    Array.prototype.forEach.call(prose.children, function (el) {
      if (el.tagName === 'H2' && block.length) flush();
      block.push(el);
    });
    flush();
  });

  if (units.length) {
    var ticking = false;

    var paint = function () {
      ticking = false;
      var vh = window.innerHeight;

      /*
         En bas de page, un bloc peut ne jamais atteindre `TO` : sans ce
         garde-fou il resterait figé à moitié transparent.
      */
      var atBottom =
        window.pageYOffset + vh >= document.documentElement.scrollHeight - 2;

      units.forEach(function (unit) {
        if (unit.done) return;

        var offset = unit.stagger * STAGGER;
        var top = unit.els[0].getBoundingClientRect().top / vh;
        /* On retranche : plus le rang est élevé, plus le bloc se dévoile tard. */
        var p = (FROM - offset - top) / (FROM - TO);

        if (atBottom) p = 1;
        p = p < 0 ? 0 : (p > 1 ? 1 : p);

        /*
           Deux courbes distinctes, chacune pour ce qu'elle fait de mieux :
           - l'opacité suit une courbe en S, qui démarre lentement. Le bloc
             reste discret tant qu'on n'a pas vraiment défilé, au lieu d'être
             à moitié visible dès qu'il pointe en bas de l'écran ;
           - le décalage vertical décélère, pour venir se poser en douceur.
        */
        var fade = p * p * (3 - 2 * p);
        var eased = 1 - Math.pow(1 - p, 3);

        if (p >= 1) {
          unit.done = true;
          unit.els.forEach(function (el) {
            el.style.opacity = '';
            el.style.transform = '';
            el.classList.add('is-revealed');
          });
          return;
        }

        var shift = ((1 - eased) * SHIFT).toFixed(2);
        unit.els.forEach(function (el) {
          el.style.opacity = fade.toFixed(3);
          el.style.transform = 'translateY(' + shift + 'px)';
        });
      });
    };

    var schedule = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(paint);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) schedule();
    });
    schedule();
  }

  /* ---------------------------------------------------------
     6. Repères de lecture : progression et sommaire

     Les articles font de 1 300 à 2 000 mots, découpés en cinq à sept parties,
     et n'offraient aucun repère : ni « où j'en suis », ni « où je peux aller ».
     Les deux se déduisent du même calcul, donc du même écouteur de défilement.
     --------------------------------------------------------- */

  var prose = document.querySelector('.prose');

  if (prose) {
    var heads = Array.prototype.filter.call(
      prose.querySelectorAll('h2[id]'),
      function (h) { return h.id; }
    );

    /* ---- Barre de progression ---- */

    var bar = document.createElement('div');
    bar.className = 'progress';
    bar.innerHTML = '<div class="progress__fill"></div>';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Progression dans l\'article');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    document.body.appendChild(bar);
    var fill = bar.firstChild;

    /* ---- Sommaire latéral ---- */

    var toc = null, links = [];

    if (heads.length > 2) {
      toc = document.createElement('nav');
      toc.className = 'toc';
      toc.setAttribute('aria-label', 'Sommaire de l\'article');

      var list = document.createElement('ol');
      list.className = 'toc__list';

      heads.forEach(function (h) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'toc__link';
        a.href = '#' + h.id;
        /* Le titre complet en info-bulle : la colonne est étroite. */
        a.title = h.textContent.trim();
        a.textContent = h.textContent.trim();
        li.appendChild(a);
        list.appendChild(li);
        links.push(a);
      });

      toc.appendChild(list);
      document.body.appendChild(toc);
    }

    var proseTop = 0, proseLen = 1, tocTicking = false;

    var measure = function () {
      var r = prose.getBoundingClientRect();
      proseTop = r.top + window.pageYOffset;
      /* On considère l'article lu quand son bas atteint le bas de l'écran. */
      proseLen = Math.max(1, r.height - window.innerHeight * 0.4);
    };

    var update = function () {
      tocTicking = false;

      var p = (window.pageYOffset - proseTop + window.innerHeight * 0.4) / proseLen;
      p = p < 0 ? 0 : (p > 1 ? 1 : p);
      fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      bar.setAttribute('aria-valuenow', String(Math.round(p * 100)));

      /*
         Le sommaire ne s'affiche qu'une fois le lecteur entré dans le texte.
         Posé en position fixe et centré, il flottait sinon par-dessus l'image
         du hero, où il était à la fois illisible et sans objet.
      */
      if (toc) {
        var inBody = prose.getBoundingClientRect().top < window.innerHeight * 0.35;
        var pastEnd = prose.getBoundingClientRect().bottom < window.innerHeight * 0.5;
        toc.dataset.visible = (inBody && !pastEnd) ? 'true' : 'false';
      }

      if (!links.length) return;

      /*
         Partie courante : le dernier titre passé au-dessus du tiers haut de
         l'écran. Prendre « le plus proche du centre » faisait sauter la
         surbrillance d'avant en arrière au milieu des longues sections.
      */
      var current = 0;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top <= window.innerHeight * 0.33) current = i;
      }
      for (var j = 0; j < links.length; j++) {
        links[j].setAttribute('aria-current', j === current ? 'true' : 'false');
      }
    };

    var scheduleToc = function () {
      if (tocTicking) return;
      tocTicking = true;
      window.requestAnimationFrame(update);
    };

    measure();
    update();
    window.addEventListener('scroll', scheduleToc, { passive: true });
    window.addEventListener('resize', function () { measure(); scheduleToc(); });
    window.addEventListener('load', function () { measure(); scheduleToc(); });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) { measure(); scheduleToc(); }
    });
  }

  /* ---------------------------------------------------------
     7. Composition des chiffres du hero

     Vu une fois par session, jamais deux : on est dans le budget « rare, on
     peut se faire plaisir ». Seul le premier nombre de chaque libellé est
     animé — « 20 millions de milliards » est une formule, pas un compteur.
     --------------------------------------------------------- */

  var stats = document.querySelectorAll('.stat__value');

  if (stats.length &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !sessionStorage.getItem('statsVues')) {

    try { sessionStorage.setItem('statsVues', '1'); } catch (e) {}

    Array.prototype.forEach.call(stats, function (el, i) {
      var raw = el.textContent;
      /*
         Premier nombre du libellé. Le motif doit se terminer sur un chiffre :
         une classe qui accepte l'espace en fin de capture avalait l'espace qui
         suit le nombre, et « 20 millions » se recomposait en « 20millions ».
         Les groupes de milliers ne sont repris que s'ils font bien trois
         chiffres, ce qui distingue « 16 000 » de « 20 millions ».
      */
      var m = raw.match(/\d{1,3}(?:[ \u00a0\u202f]\d{3})+|\d+/);
      if (!m) return;

      var target = parseInt(m[0].replace(/[^\d]/g, ''), 10);
      if (!target || target > 1000000) return;

      var before = raw.slice(0, m.index);
      var after = raw.slice(m.index + m[0].length);
      var group = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };

      var start = null, DUR = 780, delay = 260 + i * 90;

      var tick = function (now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / DUR);
        /* Décélération franche : le nombre se pose, il ne freine pas longtemps. */
        var eased = 1 - Math.pow(1 - t, 4);
        el.textContent = before + group(Math.round(target * eased)) + after;
        if (t < 1) window.requestAnimationFrame(tick);
      };

      el.textContent = before + '0' + after;
      window.setTimeout(function () { window.requestAnimationFrame(tick); }, delay);
    });
  }

})();
