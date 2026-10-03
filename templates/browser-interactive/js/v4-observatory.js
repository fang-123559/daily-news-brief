// v4-observatory.js —— 观象台
// 星图盘(rotor)可转动:评分=星等(径向+大小),版面=星区,源数=星环;固定目镜环+准线选择星区。
// 手势:转动星盘(拖拽/滚轮/←→),点击恒星读观测记录。
(function () {
  'use strict';
  var A = window.APP, H = A.helpers, esc = H.esc;

  var TAU = Math.PI / 180, CX = 500, CY = 500;
  var INDEX_A = 270;                 // 准线朝上
  var R_OUT = 445, R_IN = 128;       // 星区环带内外缘
  var R_LABEL = 412;                 // 星区名弧线半径
  var R_STAR_MIN = 150, R_STAR_SPAN = 148;
  var R_TICK_A = 458, R_TICK_B = 474, R_TICK_MAJ = 480;

  var root, svg, rotor, notesEl, logEl, tipEl, stripEl;
  var sectors = [], stars = [], curData = null;
  var rot = 0, activeIdx = -1, selectedId = null, todayOnly = false;
  var dragging = false, dragMoved = false, lastAng = 0, downXY = null;
  var tweenId = null, snapTimer = null;

  function P(r, aDeg) { return [CX + r * Math.cos(aDeg * TAU), CY + r * Math.sin(aDeg * TAU)]; }
  function norm180(d) { d = ((d % 360) + 540) % 360; return d - 180; }
  function score(v) { var f = parseFloat(v); return isNaN(f) ? 7 : f; }
  function starR(sc) { return R_STAR_MIN + (9.4 - sc) / 2.6 * R_STAR_SPAN; }
  function starSize(sc) { return 3.2 + (sc - 7) * 3.4; }
  function trunc(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s; }
  function svgEl(tag, attrs) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function arcPath(r, a0, a1, sweep) {
    var p0 = P(r, a0), p1 = P(r, a1);
    var large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    return 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) +
      ' A' + r + ' ' + r + ' 0 ' + large + ' ' + (sweep === 0 ? 0 : 1) + ' ' +
      p1[0].toFixed(1) + ' ' + p1[1].toFixed(1);
  }
  function segPath(rOut, rIn, a0, a1) {
    var p0 = P(rOut, a0), p1 = P(rOut, a1), p2 = P(rIn, a1), p3 = P(rIn, a0);
    var large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    return 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) +
      ' A' + rOut + ' ' + rOut + ' 0 ' + large + ' 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) +
      ' L' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) +
      ' A' + rIn + ' ' + rIn + ' 0 ' + large + ' 0 ' + p3[0].toFixed(1) + ' ' + p3[1].toFixed(1) + ' Z';
  }
  function shortMkt(n) {
    return n.replace(/\s*(GC|AU9999|SI)$/g, '')
      .replace('纽约期金', '期金').replace('纽约期银', '期银').replace('USD/CNY', '美元');
  }

  /* ---------- 构建 ---------- */
  function buildStatic() {
    svg.innerHTML = '';
    // 目镜刻度环(固定)
    var bez = svgEl('g', {});
    bez.appendChild(svgEl('circle', { cx: CX, cy: CY, r: 488, class: 'v4-bezel-circle' }));
    bez.appendChild(svgEl('circle', { cx: CX, cy: CY, r: R_TICK_A - 4, class: 'v4-bezel-circle', 'stroke-dasharray': '1 5', opacity: .5 }));
    for (var i = 0; i < 72; i++) {
      var a = i * 5, major = i % 6 === 0;
      var p0 = P(R_TICK_A, a), p1 = P(major ? R_TICK_MAJ : R_TICK_B, a);
      bez.appendChild(svgEl('line', {
        x1: p0[0].toFixed(1), y1: p0[1].toFixed(1), x2: p1[0].toFixed(1), y2: p1[1].toFixed(1),
        class: 'v4-tick' + (major ? ' major' : '')
      }));
    }
    svg.appendChild(bez);
    // 准线(固定)
    svg.appendChild(svgEl('polygon', { points: '500,8 493,22 507,22', class: 'v4-index' }));
    svg.appendChild(svgEl('line', { x1: 500, y1: 22, x2: 500, y2: 52, class: 'v4-index-line' }));
    // 星图盘(rotor)
    rotor = svgEl('g', { id: 'v4-rotor' });
    svg.appendChild(rotor);
    // 罗盘心(固定;内容随数据重建)
    var hub = svgEl('g', { id: 'v4-hub' });
    svg.appendChild(hub);
  }

  function buildDisk(data) {
    rotor.innerHTML = '';
    sectors = []; stars = [];
    var list = data.SECTIONS.map(function (s) {
      return {
        key: s.key, name: s.name, remark: s.remark || '',
        items: s.items.slice().sort(function (a, b) { return score(b.score) - score(a.score); })
      };
    });
    var total = list.reduce(function (n, s) { return n + s.items.length; }, 0);
    var angStart = 274;
    list.forEach(function (s) {
      s.span = s.items.length / total * 360;
      s.start = angStart; s.end = angStart + s.span; s.mid = (s.start + s.end) / 2;
      angStart = s.end;
      sectors.push(s);
    });

    sectors.forEach(function (s, k) {
      var g = svgEl('g', { class: 'v4-g-sec' });
      s.g = g;
      // 环带底色
      g.appendChild(svgEl('path', { d: segPath(R_OUT, R_IN, s.start, s.end), class: 'v4-wedge-fill' }));
      // 分界线
      var b0 = P(R_IN, s.start), b1 = P(R_OUT, s.start);
      g.appendChild(svgEl('line', {
        x1: b0[0].toFixed(1), y1: b0[1].toFixed(1), x2: b1[0].toFixed(1), y2: b1[1].toFixed(1), class: 'v4-wedge-line'
      }));
      // 星区名:常平文字——随盘转动但始终保持直立(雷达方位盘的做法)
      var lp = P(R_LABEL, s.mid);
      var txt = svgEl('text', {
        class: 'v4-sec-label', x: lp[0].toFixed(1), y: lp[1].toFixed(1),
        'text-anchor': 'middle', 'dominant-baseline': 'middle'
      });
      txt.textContent = s.name;
      txt.style.cursor = 'pointer';
      txt.addEventListener('click', function () { activate(k, true); });
      s.labelEl = txt;
      g.appendChild(txt);
      // 星座线 + 恒星
      var pts = [];
      s.items.forEach(function (it, i) {
        var sc = score(it.score);
        var a = s.start + (i + .5) / s.items.length * s.span;
        var r = starR(sc);
        var xy = P(r, a);
        pts.push(xy);
        var st = { item: it, sec: s, x: xy[0], y: xy[1], id: s.key + ':' + it.no };
        var starG = svgEl('g', { class: 'v4-star-g' });
        var c = svgEl('circle', { cx: xy[0].toFixed(1), cy: xy[1].toFixed(1), r: starSize(sc).toFixed(1), class: 'v4-star' });
        c.dataset.sid = st.id;
        st.cEl = c;
        // 星环:环数=源数;单源为虚环
        var rings = [6, 11, 16], n = Math.min(it.srcCount || 1, 3);
        for (var ri = 0; ri < n; ri++) {
          var ring = svgEl('circle', {
            cx: xy[0].toFixed(1), cy: xy[1].toFixed(1), r: (starSize(sc) + rings[ri]).toFixed(1), class: 'v4-ring'
          });
          if ((it.srcCount || 1) === 1 && ri === 0) ring.classList.add('single');
          starG.appendChild(ring);
        }
        var hit = svgEl('circle', { cx: xy[0].toFixed(1), cy: xy[1].toFixed(1), r: (starSize(sc) + 13).toFixed(1), class: 'v4-hit' });
        hit.dataset.sid = st.id;
        hit.addEventListener('click', function () { select(st.id); });
        hit.addEventListener('mousemove', function (ev) {
          if (dragging) return;
          tipEl.hidden = false;
          tipEl.innerHTML = '<span class="tp-sc num">' + esc(it.score) + '</span>' + esc(trunc(it.title, 26));
          tipEl.style.left = Math.min(ev.clientX + 16, window.innerWidth - 300) + 'px';
          tipEl.style.top = (ev.clientY + 14) + 'px';
        });
        hit.addEventListener('mouseleave', function () { tipEl.hidden = true; });
        st.hitEl = hit;
        starG.appendChild(c); starG.appendChild(hit);
        st.gEl = starG;
        g.appendChild(starG);
        stars.push(st);
      });
      if (pts.length > 1) {
        g.appendChild(svgEl('polyline', {
          points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '),
          class: 'v4-const-line'
        }));
      }
      rotor.appendChild(g);
    });
    buildHub(data);
  }

  function buildHub(data) {
    var hub = svg.querySelector('#v4-hub');
    hub.innerHTML = '';
    hub.appendChild(svgEl('circle', { cx: CX, cy: CY, r: 112, class: 'v4-hub-circle' }));
    if (todayOnly) hub.classList.add('today');
    var t1 = svgEl('text', { x: CX, y: CY - 26, 'text-anchor': 'middle', class: 'v4-hub-text v4-hub-date' });
    t1.textContent = data.META.dateCN;
    var t2 = svgEl('text', { x: CX, y: CY - 4, 'text-anchor': 'middle', class: 'v4-hub-push' });
    t2.textContent = data.META.push + ' · ' + data.META.cities;
    hub.appendChild(t1); hub.appendChild(t2);

    // 来源日期构成环带:今晨/昨日/更早(数据事实,非装饰;纯 UTC 运算避免时区漂移)
    var today = data.META.dateISO;
    var pd = today.split('-');
    var yd = new Date(Date.UTC(+pd[0], +pd[1] - 1, +pd[2]));
    yd.setUTCDate(yd.getUTCDate() - 1);
    var yISO = yd.toISOString().slice(0, 10);
    var c = { today: 0, yest: 0, old: 0 };
    data.SECTIONS.forEach(function (s) {
      s.items.forEach(function (it) {
        (it.sources || []).forEach(function (src) {
          if (src.date === today) c.today++;
          else if (src.date === yISO) c.yest++;
          else c.old++;
        });
      });
    });
    var tot = c.today + c.yest + c.old || 1;
    var multi = data.SECTIONS.reduce(function (n, s) {
      return n + s.items.filter(function (it) { return (it.srcCount || 1) >= 2; }).length;
    }, 0);
    var a = 0, cols = [
      [c.today, 'rgba(46,76,119,.95)'], [c.yest, 'rgba(46,76,119,.45)'], [c.old, 'rgba(46,76,119,.18)']
    ];
    cols.forEach(function (seg) {
      if (!seg[0]) return;
      var a1 = a + seg[0] / tot * 360;
      hub.appendChild(svgEl('path', {
        d: arcPath(104, a, a1 - (tot === seg[0] ? 0.6 : 1.2), 1), class: 'v4-hub-arc', stroke: seg[1]
      }));
      a = a1;
    });
    var t3 = svgEl('text', { x: CX, y: CY + 34, 'text-anchor': 'middle', class: 'v4-hub-legend' });
    t3.textContent = '来源环带 · 今晨 ' + c.today + ' · 昨日 ' + c.yest + (c.old ? ' · 更早 ' + c.old : '');
    hub.appendChild(t3);
    var t4 = svgEl('text', { x: CX, y: CY + 54, 'text-anchor': 'middle', class: 'v4-hub-legend' });
    t4.textContent = '多源核验 ' + multi + ' 事 · 单源 ' + (total(data) - multi) + ' 事';
    hub.appendChild(t4);
    hub.dataset.legend = '盘心环带为来源日期构成:今晨 ' + c.today + ' / 昨日 ' + c.yest + (c.old ? ' / 更早 ' + c.old : '');

    // 点盘心 = 只看今晨来源(24h 时效核验的手势化)
    hub.style.cursor = 'pointer';
    hub.addEventListener('click', function () {
      todayOnly = !todayOnly;
      hub.classList.toggle('today', todayOnly);
      t3.textContent = todayOnly
        ? '只看今晨 · 再点还原'
        : '来源环带 · 今晨 ' + c.today + ' · 昨日 ' + c.yest + (c.old ? ' · 更早 ' + c.old : '');
      applyTodayFilter();
      renderNotes();
    });
  }

  function applyTodayFilter() {
    if (!curData) return;
    stars.forEach(function (st) {
      var mainDate = st.item.sources && st.item.sources[0] ? st.item.sources[0].date : '';
      st.gEl.classList.toggle('v4-ghost', todayOnly && mainDate !== curData.META.dateISO);
    });
  }
  function total(data) {
    return data.SECTIONS.reduce(function (n, s) { return n + s.items.length; }, 0);
  }

  /* ---------- 转动 ---------- */
  function apply() {
    rotor.setAttribute('transform', 'rotate(' + rot.toFixed(2) + ' 500 500)');
    // 常平:星区名反向自转,始终保持直立
    sectors.forEach(function (s) {
      if (s.labelEl) {
        var lp = P(R_LABEL, s.mid);
        s.labelEl.setAttribute('transform',
          'rotate(' + (-rot).toFixed(2) + ' ' + lp[0].toFixed(1) + ' ' + lp[1].toFixed(1) + ')');
      }
    });
  }

  function sectorAt(i) { return sectors[(i % sectors.length + sectors.length) % sectors.length]; }

  function nearestSector() {
    var best = 0, bestD = 999;
    sectors.forEach(function (s, k) {
      var d = Math.abs(norm180(s.mid + rot - INDEX_A));
      if (d < bestD) { bestD = d; best = k; }
    });
    return best;
  }

  function setActive(k, force) {
    if (k === activeIdx && !force) return;
    activeIdx = k;
    sectors.forEach(function (s, i) { s.g.classList.toggle('dim', i !== k); });
    renderNotes();
  }

  function activate(k, animate) {
    var s = sectorAt(k);
    var target = rot + norm180(INDEX_A - (s.mid + rot));
    if (animate) tweenTo(target); else { rot = target; apply(); }
    setActive(k, true);
  }

  function tweenTo(target) {
    if (tweenId) cancelAnimationFrame(tweenId);
    var from = rot, t0 = performance.now(), dur = 300;
    function step(t) {
      var p = Math.min(1, (t - t0) / dur); p = 1 - Math.pow(1 - p, 3);
      rot = from + (target - from) * p; apply();
      setActive(nearestSector());
      if (p < 1) tweenId = requestAnimationFrame(step);
    }
    tweenId = requestAnimationFrame(step);
  }

  function snap() { activate(nearestSector(), true); }

  /* ---------- 注记 / 记录簿 ---------- */
  function renderNotes() {
    var s = sectorAt(activeIdx);
    if (!s) return;
    var html = '<div class="nt-kicker">目镜 · THE OBSERVATORY</div>';
    html += '<div class="nt-name">' + esc(s.name) + '</div>';
    html += '<div class="nt-count">' + s.items.length + ' 事 · 按星等排布</div>';
    if (s.remark) html += '<div class="nt-legend" style="margin-top:8px">' + esc(trunc(s.remark, 40)) + '</div>';
    html += '<ol>';
    s.items.forEach(function (it) {
      var cur = selectedId === s.key + ':' + it.no ? ' class="cur"' : '';
      html += '<li' + cur + ' data-sid="' + s.key + ':' + it.no + '"><span class="sc num">' + esc(it.score) +
        '</span><span class="tt">' + esc(trunc(it.title, 14)) + '</span></li>';
    });
    html += '</ol>';
    html += '<div class="nt-legend">星大者事重 · 环多者源多 · 虚环者单源<br>拖转星盘换星区 · 点盘心环带只看今晨</div>';
    if (svg.querySelector('#v4-hub').dataset.legend) {
      html += '<div class="nt-legend">' + esc(svg.querySelector('#v4-hub').dataset.legend) + '</div>';
    }
    notesEl.innerHTML = html;
    notesEl.querySelectorAll('li').forEach(function (li) {
      li.addEventListener('click', function () { select(li.dataset.sid); });
    });
  }

  function findStar(id) { return stars.filter(function (s) { return s.id === id; })[0]; }

  function select(id) {
    var st = findStar(id);
    if (!st) return;
    selectedId = id;
    stars.forEach(function (x) { x.cEl.classList.remove('v4-star-sel'); });
    st.cEl.classList.add('v4-star-sel');
    var it = st.item;
    logEl.innerHTML =
      '<button class="lg-close" aria-label="关闭">✕</button>' +
      '<span class="lg-tag">观测记录 · ' + esc(st.sec.name) + ' · No.' + H.pad2(it.no) + '</span>' +
      '<h3 class="lg-title">' + esc(it.title) + '</h3>' +
      '<p class="lg-sum">' + esc(it.summary) + '</p>' +
      '<p class="lg-impact"><b>影响</b>' + esc(it.impact) + '</p>' +
      '<div class="lg-dims">' + dimsRow('时效', it.dims && it.dims.t) + dimsRow('重要', it.dims && it.dims.i) +
      dimsRow('来源', it.dims && it.dims.s) + dimsRow('完整', it.dims && it.dims.c) + '</div>' +
      '<div class="lg-meta">星等 <span class="num">' + esc(it.score) + '</span> · 主源 ' + esc(it.main || '—') +
      ' · 源数 ' + (it.srcCount || 1) + '</div>' +
      '<div class="lg-sources">' + (it.sources || []).map(function (src) {
        return '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.media) +
          '<span class="dt num">' + esc(src.date) + '</span></a>';
      }).join('') + '</div>' +
      '<div class="lg-foot">星等即四维综合评分 · 观象台谨录,不构成建议</div>';
    logEl.querySelector('.lg-close').addEventListener('click', closeLog);
    root.classList.add('log-show');
    svg.classList.add('log-open');
    renderNotes();
  }

  function dimsRow(name, v) {
    v = v == null ? 0 : Math.max(0, Math.min(10, +v));
    var ticks = '';
    for (var i = 1; i <= 10; i++) ticks += '<i class="' + (i <= v ? 'f' : '') + '"></i>';
    return '<div class="dim-row"><span class="dim-name">' + name + '</span><span class="ticks">' +
      ticks + '<span class="val num">' + v + '</span></span></div>';
  }

  function closeLog() {
    root.classList.remove('log-show');
    svg.classList.remove('log-open');
    stars.forEach(function (x) { x.cEl.classList.remove('v4-star-sel'); });
    selectedId = null;
    renderNotes();
  }

  function renderStrip(data) {
    var w = data.WEATHER.rows.map(function (r) {
      return r.city + ' <span class="num">' + esc(r.temp) + '</span> ' + esc(r.desc);
    }).join('<span class="st-sep"> ｜ </span>');
    var m = data.MARKET_STRIP.map(function (x) {
      return '<span class="st-item">' + esc(shortMkt(x.name)) + ' <span class="num">' +
        (x.value == null ? '—' : esc(x.value)) + '</span> <span class="chg num">' +
        (x.chg == null ? '—' : esc(x.chg)) + '</span></span>';
    }).join('<span class="st-sep"> · </span>');
    stripEl.innerHTML =
      '<span class="st-label">天象</span><span>' + w + '</span>' +
      '<span class="st-label">行情</span><span>' + m + '</span>';
  }

  /* ---------- 交互 ---------- */
  function bindStage() {
    svg.addEventListener('pointerdown', function (e) {
      if (tweenId) { cancelAnimationFrame(tweenId); tweenId = null; }
      dragging = true; dragMoved = false;
      lastAng = Math.atan2(e.clientY - stageCY(), e.clientX - stageCX()) / TAU;
      downXY = [e.clientX, e.clientY];
      svg.classList.add('dragging');
      tipEl.hidden = true;
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var a = Math.atan2(e.clientY - stageCY(), e.clientX - stageCX()) / TAU;
      var d = norm180(a - lastAng);
      if (Math.abs(d) > 0.05) { rot += d; lastAng = a; apply(); setActive(nearestSector()); }
      if (Math.abs(e.clientX - downXY[0]) + Math.abs(e.clientY - downXY[1]) > 6) dragMoved = true;
    });
    window.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false;
      svg.classList.remove('dragging');
      if (dragMoved) snap();
    });
    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      if (tweenId) { cancelAnimationFrame(tweenId); tweenId = null; }
      rot += (e.deltaY + e.deltaX) * 0.07;
      apply(); setActive(nearestSector());
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snap, 260);
    }, { passive: false });
  }

  var cyCache = null;
  function stageCY() {
    if (!cyCache) {
      var r = svg.getBoundingClientRect();
      cyCache = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    }
    return cyCache.cy;
  }
  function stageCX() {
    if (!cyCache) stageCY();
    return cyCache.cx;
  }

  /* ---------- 模板接口 ---------- */
  A.templates.v4 = {
    mounted: false,
    mount: function (el) {
      root = el; svg = document.getElementById('v4-svg');
      notesEl = document.getElementById('v4-notes');
      logEl = document.getElementById('v4-log');
      tipEl = document.getElementById('v4-tip');
      stripEl = document.getElementById('v4-strip');
      buildStatic();
      bindStage();
      window.addEventListener('resize', function () { cyCache = null; });
    },
    enter: function (data) {
      curData = data;
      cyCache = null;
      todayOnly = false;
      buildDisk(data);
      renderStrip(data);
      selectedId = null;
      root.classList.remove('log-show');
      svg.classList.remove('log-open');
      rot = 0; apply();
      activate(0, false);
    },
    leave: function () {
      tipEl.hidden = true;
      root.classList.remove('log-show');
      svg.classList.remove('log-open');
    },
    onKey: function (e) {
      if (e.key === 'Escape' && root.classList.contains('log-show')) { closeLog(); return true; }
      if (e.key === 'ArrowRight') { activate(activeIdx + 1, true); return true; }
      if (e.key === 'ArrowLeft') { activate(activeIdx - 1, true); return true; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var s = sectorAt(activeIdx);
        var idx = s.items.findIndex(function (it) { return s.key + ':' + it.no === selectedId; });
        idx = e.key === 'ArrowDown' ? Math.min(s.items.length - 1, idx + 1) : Math.max(0, idx <= 0 ? 0 : idx - 1);
        select(s.key + ':' + s.items[idx].no);
        return true;
      }
      return false;
    },
  };
})();
