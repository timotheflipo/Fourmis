/* =========================================================
   SUPERORGANISME — simulation de stigmergie

   Aucune fourmi de cette simulation ne connaît la position de la nourriture,
   ne communique avec une autre, ni ne calcule quoi que ce soit. Chacune suit
   trois règles :

     1. avancer, avec un peu de hasard dans la direction ;
     2. déposer de la phéromone derrière soi, d'autant plus fort qu'on vient
        de quitter le nid (ou la source de nourriture) ;
     3. tourner vers l'endroit où la phéromone recherchée est la plus forte.

   Le plus court chemin apparaît parce qu'un aller-retour court se répète plus
   souvent qu'un long : la piste s'y renforce plus vite qu'elle ne s'évapore.
   Personne ne l'a choisi. C'est ce que Grassé a nommé stigmergie en 1959.
   ========================================================= */

(function () {
  'use strict';

  var host = document.getElementById('stigSim');
  if (!host || !host.getContext) return;

  var ctx = host.getContext('2d', { alpha: false });

  /* ---------- Réglages ---------- */

  var CELL = 4;          /* côté d'une cellule de phéromone, en pixels CSS */
  var ANTS = 320;
  var TURN = 0.45;       /* virage maximal par image, en radians */
  var JITTER = 0.26;     /* part de hasard dans la direction */
  var EVAPORATION = 0.9975;   /* demi-vie d'environ 4,6 s à 60 images/s */

  /*
     Vitesse et rayon d'odeur sont proportionnels à la largeur du cadre : sur
     un écran étroit, la même vitesse absolue rendrait la traversée instantanée
     et on ne verrait plus la piste se construire.
  */
  var SPEED = 2.6;       /* pixels par image, recalculé au redimensionnement */
  var SENSE_DIST = 11;
  var SENSE_ANGLE = 0.62;
  var DEPOSIT = 0.55;
  var DEPOSIT_DECAY = 0.997;  /* la trace faiblit à mesure qu'on s'éloigne */

  /*
     Rayon d'odeur du nid et de la nourriture. Sans lui, la première découverte
     dépend d'une marche aléatoire pure sur sept cents pixels : la boucle met
     une minute à s'amorcer et on ne voit rien. Quatre-vingt-dix pixels suffisent
     à rendre la découverte fiable, et laissent tout l'espace entre les deux à
     la stigmergie seule — c'est là que le chemin s'invente.
  */
  var SCENT_R = 120;

  var COLD = 'rgba(255,255,255,';   /* piste « retour au nid » */
  var WARM = [215, 235, 128];       /* piste « vers la nourriture », le lime */

  /* ---------- État ---------- */

  var w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
  var toFood, toHome, walls, scentFood, scentNest;
  var ants = [];
  var nest = { x: 0, y: 0 }, food = { x: 0, y: 0 };
  var running = false, raf = null, painted = null;
  var brush = false;   /* mode « poser un obstacle » */

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mise en place ---------- */

  function idx(cx, cy) { return cy * cols + cx; }

  function resize() {
    var box = host.getBoundingClientRect();
    if (!box.width) return false;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.round(box.width);
    h = Math.round(box.height);
    host.width = Math.round(w * dpr);
    host.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(w / CELL);
    rows = Math.ceil(h / CELL);
    toFood = new Float32Array(cols * rows);
    toHome = new Float32Array(cols * rows);
    walls = new Uint8Array(cols * rows);
    scentFood = new Float32Array(cols * rows);
    scentNest = new Float32Array(cols * rows);
    painted = ctx.createImageData(cols, rows);

    nest = { x: Math.round(w * 0.11), y: Math.round(h * 0.52) };
    food = { x: Math.round(w * 0.89), y: Math.round(h * 0.30) };
    SPEED = w / 385;
    SCENT_R = w * 0.12;

    bakeScent();
    spawn();
    return true;
  }

  /* Gradients d'odeur, calculés une fois : ils ne changent jamais. */
  function bakeScent() {
    for (var cy = 0; cy < rows; cy++) {
      for (var cx = 0; cx < cols; cx++) {
        var px = cx * CELL + CELL / 2, py = cy * CELL + CELL / 2;
        var i = idx(cx, cy);
        var df = Math.hypot(px - food.x, py - food.y);
        var dn = Math.hypot(px - nest.x, py - nest.y);
        scentFood[i] = df < SCENT_R ? Math.pow(1 - df / SCENT_R, 2) * 0.9 : 0;
        scentNest[i] = dn < SCENT_R ? Math.pow(1 - dn / SCENT_R, 2) * 0.9 : 0;
      }
    }
  }

  /*
     Les fourmis ne partent pas toutes du nid. Réparties d'emblée le long de
     l'axe, elles couvrent le terrain dès la première seconde : la découverte
     tombe à 1,3 s au lieu de 5, et le lecteur voit la piste se construire
     plutôt que d'attendre que quelque chose se passe. Une colonie réelle a de
     toute façon en permanence des fourrageuses déjà dehors.
  */
  function spawn() {
    ants.length = 0;
    for (var i = 0; i < ANTS; i++) {
      var t = i / ANTS;
      ants.push({
        x: nest.x + (food.x - nest.x) * t * 0.75,
        y: nest.y + (Math.random() - 0.5) * h * 0.5 * t,
        a: Math.random() * Math.PI * 2,
        carrying: false,
        strength: 1
      });
    }
  }

  function reset() {
    toFood.fill(0);
    toHome.fill(0);
    walls.fill(0);
    spawn();
    draw();
  }

  /* ---------- Perception ---------- */

  /*
     Ce que perçoit une fourmi en un point : la phéromone qu'elle recherche,
     plus l'odeur directe de sa cible si elle est assez près. Les murs sont
     une répulsion forte, pas un obstacle à contourner par calcul.
  */
  function sample(field, scent, x, y) {
    var cx = (x / CELL) | 0, cy = (y / CELL) | 0;
    if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return -9;
    var i = idx(cx, cy);
    return walls[i] ? -9 : field[i] + scent[i];
  }

  function step() {
    var i, n;

    /* Évaporation. Sans elle, une piste une fois tracée ne serait jamais
       abandonnée, et la colonie resterait bloquée sur son premier trajet. */
    for (i = 0; i < toFood.length; i++) {
      toFood[i] *= EVAPORATION;
      toHome[i] *= EVAPORATION;
    }

    for (n = 0; n < ants.length; n++) {
      var ant = ants[n];
      var target = ant.carrying ? toHome : toFood;
      var scent = ant.carrying ? scentNest : scentFood;

      /* Trois capteurs : devant, devant-gauche, devant-droite. */
      var fwd = sample(target, scent, ant.x + Math.cos(ant.a) * SENSE_DIST,
                                      ant.y + Math.sin(ant.a) * SENSE_DIST);
      var lft = sample(target, scent, ant.x + Math.cos(ant.a - SENSE_ANGLE) * SENSE_DIST,
                                      ant.y + Math.sin(ant.a - SENSE_ANGLE) * SENSE_DIST);
      var rgt = sample(target, scent, ant.x + Math.cos(ant.a + SENSE_ANGLE) * SENSE_DIST,
                                      ant.y + Math.sin(ant.a + SENSE_ANGLE) * SENSE_DIST);

      if (fwd >= lft && fwd >= rgt) {
        ant.a += (Math.random() - 0.5) * JITTER;
      } else if (lft > rgt) {
        ant.a -= TURN * Math.random();
      } else {
        ant.a += TURN * Math.random();
      }

      var nx = ant.x + Math.cos(ant.a) * SPEED;
      var ny = ant.y + Math.sin(ant.a) * SPEED;

      /* Bords et obstacles : demi-tour partiel plutôt qu'arrêt net. */
      var bx = (nx / CELL) | 0, by = (ny / CELL) | 0;
      var blocked = nx < 1 || ny < 1 || nx > w - 1 || ny > h - 1 ||
                    (bx >= 0 && by >= 0 && bx < cols && by < rows && walls[idx(bx, by)]);

      if (blocked) {
        ant.a += Math.PI * (0.5 + Math.random() * 0.5);
      } else {
        ant.x = nx; ant.y = ny;
      }

      /* Dépôt. La force baisse au fil du trajet : une piste courte arrive
         donc plus concentrée qu'une longue, et se renforce plus vite. */
      var cx = (ant.x / CELL) | 0, cy = (ant.y / CELL) | 0;
      if (cx >= 0 && cy >= 0 && cx < cols && cy < rows) {
        var k = idx(cx, cy);
        if (ant.carrying) { toFood[k] = Math.min(1, toFood[k] + ant.strength * DEPOSIT); }
        else              { toHome[k] = Math.min(1, toHome[k] + ant.strength * DEPOSIT); }
      }
      ant.strength *= DEPOSIT_DECAY;

      /* Arrivées. */
      var dxF = ant.x - food.x, dyF = ant.y - food.y;
      var dxN = ant.x - nest.x, dyN = ant.y - nest.y;

      if (!ant.carrying && dxF * dxF + dyF * dyF < 196) {
        ant.carrying = true; ant.strength = 1; ant.a += Math.PI;
      } else if (ant.carrying && dxN * dxN + dyN * dyN < 196) {
        ant.carrying = false; ant.strength = 1; ant.a += Math.PI;
      }
    }
  }

  /* ---------- Rendu ---------- */

  function draw() {
    ctx.fillStyle = '#14160f';
    ctx.fillRect(0, 0, w, h);

    /* Le champ de phéromone est peint pixel par pixel dans une image à la
       résolution de la grille, puis étiré : bien plus rapide que des milliers
       de petits rectangles. */
    var d = painted.data;
    for (var i = 0, p = 0; i < toFood.length; i++, p += 4) {
      var f = toFood[i], hm = toHome[i], wall = walls[i];
      if (wall) {
        d[p] = 58; d[p + 1] = 61; d[p + 2] = 52; d[p + 3] = 255;
        continue;
      }
      /* Racine carrée : sans elle, tout le bas de l'échelle reste noir et on
         ne voit la piste qu'une fois qu'elle est déjà saturée. */
      var g = Math.sqrt(Math.min(1, hm)) * 0.34;   /* retour au nid : gris */
      var l = Math.sqrt(Math.min(1, f));           /* vers la nourriture : lime */
      d[p]     = Math.min(255, 20 + WARM[0] * l + 145 * g);
      d[p + 1] = Math.min(255, 22 + WARM[1] * l + 145 * g);
      d[p + 2] = Math.min(255, 15 + WARM[2] * l + 145 * g);
      d[p + 3] = 255;
    }

    /* Passage par un canvas hors écran pour pouvoir étirer sans lisser. */
    if (!draw._buf) { draw._buf = document.createElement('canvas'); }
    var buf = draw._buf;
    if (buf.width !== cols || buf.height !== rows) { buf.width = cols; buf.height = rows; }
    buf.getContext('2d').putImageData(painted, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(buf, 0, 0, w, h);

    /* Nid et source. */
    marker(nest.x, nest.y, '#ffffff', 'Nid');
    marker(food.x, food.y, '#d7eb80', 'Nourriture');

    /* Fourmis. */
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (var n = 0; n < ants.length; n++) {
      ctx.fillRect(ants[n].x - 0.9, ants[n].y - 0.9, 1.8, 1.8);
    }
  }

  function marker(x, y, color, label) {
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.font = '600 11px Inter, system-ui, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y + 26);
  }

  /* ---------- Boucle ---------- */

  function frame() {
    step();
    draw();
    raf = window.requestAnimationFrame(frame);
  }

  function play() {
    if (running) return;
    running = true;
    host.dataset.running = 'true';
    if (toggle) toggle.textContent = 'Pause';
    raf = window.requestAnimationFrame(frame);
  }

  function pause() {
    if (!running) return;
    running = false;
    host.dataset.running = 'false';
    if (toggle) toggle.textContent = 'Reprendre';
    window.cancelAnimationFrame(raf);
  }

  /* ---------- Commandes ---------- */

  var toggle = document.getElementById('stigToggle');
  var wallBtn = document.getElementById('stigWall');
  var resetBtn = document.getElementById('stigReset');

  if (toggle) toggle.addEventListener('click', function () { running ? pause() : play(); });

  if (resetBtn) resetBtn.addEventListener('click', function () {
    reset();
    if (!running) draw();
  });

  if (wallBtn) wallBtn.addEventListener('click', function () {
    brush = !brush;
    wallBtn.setAttribute('aria-pressed', String(brush));
    host.style.cursor = brush ? 'crosshair' : '';
  });

  /* Tracé d'obstacle au pointeur. */
  function paintWall(e) {
    if (!brush) return;
    var r = host.getBoundingClientRect();
    var cx = ((e.clientX - r.left) / CELL) | 0;
    var cy = ((e.clientY - r.top) / CELL) | 0;
    var rad = 3;
    for (var y = cy - rad; y <= cy + rad; y++) {
      for (var x = cx - rad; x <= cx + rad; x++) {
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        if ((x - cx) * (x - cx) + (y - cy) * (y - cy) > rad * rad) continue;
        walls[idx(x, y)] = 1;
      }
    }
    if (!running) draw();
  }

  var painting = false;
  host.addEventListener('pointerdown', function (e) {
    if (!brush) return;
    painting = true;
    if (host.setPointerCapture) { try { host.setPointerCapture(e.pointerId); } catch (err) {} }
    paintWall(e);
  });
  host.addEventListener('pointermove', function (e) { if (painting) paintWall(e); });
  host.addEventListener('pointerup', function () { painting = false; });
  host.addEventListener('pointercancel', function () { painting = false; });

  /* ---------- Cycle de vie ---------- */

  if (!resize()) return;
  draw();

  /*
     La simulation ne tourne que lorsqu'elle est à l'écran. Une boucle
     d'animation qui continue dans un onglet qu'on ne regarde plus, c'est de
     la batterie dépensée pour rien.
  */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { if (!reduced.matches) play(); }
        else pause();
      });
    }, { threshold: 0.25 }).observe(host);
  } else if (!reduced.matches) {
    play();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pause();
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      var was = running;
      pause();
      if (resize()) draw();
      if (was && !reduced.matches) play();
    }, 180);
  });

  /* Mouvement réduit : rien ne démarre tout seul, le bouton reste disponible. */
  if (reduced.matches && toggle) toggle.textContent = 'Lancer la simulation';
})();
