// v6-handscroll.js —— 手卷
// 一日之事装裱为横向手卷:引首(天气行情) → 卷首语 → 四版条目 → 卷尾题跋。
// 手势:横向展卷(拖拽/滚轮/←→),条目钤印;题跋由真实阅读行为(用时/钤印/版面)生成。
(function () {
  'use strict';
  var A = window.APP, H = A.helpers, esc = H.esc;

  var root, scroller, track, sealCountEl, progressEl;
  var curData = null, t0 = 0, timer = null;
  var suppressClick = false;

  function stamps() {
    A.state.stamps = A.state.stamps || {};
    if (!A.state.stamps[A.state.dataset]) A.state.stamps[A.state.dataset] = {};
    return A.state.stamps[A.state.dataset];
  }
  function trunc(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s; }

  /* ---------- 装裱 ---------- */
  function colTitle(d) {
    var weather = d.WEATHER.rows.map(function (r) {
      return r.city + ' ' + r.temp + ' ' + r.desc;
    }).join('；');
    var mkt = d.MARKET_STRIP.map(function (x) {
      return '<span class="num">' + (x.value == null ? '—' : esc(x.value)) + '</span> ' +
        esc(x.name.replace(/\s*(GC|AU9999|SI)$/g, '')) +
        (x.chg == null ? '' : ' <span class="num">' + esc(x.chg) + '</span>');
    }).join('；');
    return '<div class="v6-col col-title">' +
      '<div class="v6-title-sub-vert">' + esc(d.META.dateCN + ' · ' + d.META.weekday + ' · ' + d.META.cities) + '</div>' +
      '<div class="v6-title-vert">' + esc(d.META.title) + '</div>' +
      '<div class="v6-lead-seal" aria-hidden="true">柒</div>' +
      '<div class="v6-title-note">' +
      '<span class="tn-label">今日天象</span>' + esc(weather) +
      '<span class="tn-label">金银行情</span>' + mkt +
      '</div></div>';
  }

  function colBrief(d) {
    return '<div class="v6-col col-brief"><div class="v6-col-kicker">卷首语 · 今日五要</div>' +
      d.BRIEFING.map(function (b) {
        return '<p class="vb-item"><b>' + esc(b.lead) + '</b>' + esc(b.text) + '</p>';
      }).join('') + '</div>';
  }

  function colSec(s) {
    return '<div class="v6-col col-sec">' +
      '<div class="v6-sec-count">' + s.items.length + ' 事</div>' +
      '<div class="v6-sec-vert">' + esc(s.name) + '</div>' +
      (s.remark ? '<div class="v6-sec-remark">' + esc(trunc(s.remark, 64)) + '</div>' : '') +
      '</div>';
  }

  function colItem(s, it) {
    var dims = it.dims ? '四维 <span class="num">' + [it.dims.t, it.dims.i, it.dims.s, it.dims.c].join(' / ') + '</span>' : '';
    return '<div class="v6-col col-item">' +
      '<div class="ci-top"><span>' + esc(s.name) + '</span><span class="num">No.' + H.pad2(it.no) + '</span></div>' +
      '<div class="ci-score"><span class="num">' + esc(it.score) + '</span>' + dims + '</div>' +
      '<h3>' + esc(it.title) + '</h3>' +
      '<p class="ci-sum">' + esc(it.summary) + '</p>' +
      '<p class="ci-imp"><b>影响</b>' + esc(it.impact) + '</p>' +
      '<div class="ci-src">' + (it.sources || []).map(function (src) {
        return '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.media) +
          '<span class="dt num">' + esc(src.date) + '</span></a>';
      }).join('') + '</div>' +
      '<button class="seal-slot" data-k="' + s.key + ':' + it.no + '" aria-label="钤印">钤</button>' +
      '</div>';
  }

  function colColophon() {
    return '<div class="v6-col col-colophon">' +
      '<div class="v6-col-kicker">卷尾 · 题跋</div>' +
      '<div id="v6-colo-text" class="v6-colo-text"></div>' +
      '<div id="v6-yinpu" class="v6-yinpu"></div>' +
      '<div class="v6-colo-actions"><button class="pap-btn" id="v6-copy">复制题跋</button></div>' +
      '</div>';
  }

  function buildTrack(d) {
    var html = colTitle(d) + colBrief(d);
    d.SECTIONS.forEach(function (s) {
      html += colSec(s);
      s.items.forEach(function (it) { html += colItem(s, it); });
    });
    html += colColophon();
    track.innerHTML = html;
    // 钤印
    track.querySelectorAll('.seal-slot').forEach(function (el) {
      var k = el.dataset.k;
      if (stamps()[k]) { el.classList.add('stamped'); el.textContent = '记'; }
      el.addEventListener('click', function () { toggleSeal(el, k); });
    });
    document.getElementById('v6-copy').addEventListener('click', copyColo);
    updateSealCount();
    updateColophon(false);
  }

  function toggleSeal(el, k) {
    var m = stamps();
    if (m[k]) { delete m[k]; }
    else {
      m[k] = true;
      el.classList.remove('restamp'); void el.offsetWidth; el.classList.add('restamp');
    }
    el.classList.toggle('stamped', !!m[k]);
    el.textContent = m[k] ? '记' : '钤';
    updateSealCount();
    updateColophon(false);
  }

  function stampList() {
    var d = curData, m = stamps(), out = [];
    d.SECTIONS.forEach(function (s) {
      s.items.forEach(function (it) {
        if (m[s.key + ':' + it.no]) out.push({ sec: s, item: it });
      });
    });
    return out;
  }

  function totalItems() {
    return curData.SECTIONS.reduce(function (n, s) { return n + s.items.length; }, 0);
  }

  function coloText(secElapsed) {
    var d = curData, list = stampList();
    var p1 = d.META.dateCN + '，展卷读报。卷中凡' + H.numCN(totalItems()) + '事，费时' + H.durCN(secElapsed) + '。';
    var p2;
    if (!list.length) {
      p2 = '一事未钤——或无事可记，或行色匆匆。';
    } else {
      var names = list.slice(0, 6).map(function (x) { return trunc(x.item.title, 12); });
      if (list.length > 6) names.push('等凡' + H.numCN(list.length) + '事');
      p2 = '钤印' + H.numCN(list.length) + '处：' + names.join('、') + '。';
      if (list.length >= 3) {
        var bySec = {};
        list.forEach(function (x) { bySec[x.sec.name] = (bySec[x.sec.name] || 0) + 1; });
        var top = Object.keys(bySec).sort(function (a, b) { return bySec[b] - bySec[a]; })[0];
        p2 += '所记多在〈' + top + '〉。';
      }
      p2 += '他日重展，以印为记。';
    }
    return { p1: p1, p2: p2 };
  }

  function updateColophon(withSec) {
    var secElapsed = withSec ? Math.round((Date.now() - t0) / 1000) : Math.round((lastSec || 0));
    var t = coloText(secElapsed);
    var el = document.getElementById('v6-colo-text');
    if (!el) return;
    var list = stampList();
    el.innerHTML = '<p>' + esc(t.p1) + '</p><p' + (list.length ? '' : ' class="colo-empty"') + '>' + esc(t.p2) + '</p>';
    var yp = document.getElementById('v6-yinpu');
    yp.innerHTML = list.map(function (x, i) {
      return '<span class="yp-item"><i class="yp-seal">' + H.numCN(i + 1) + '</i><span>' +
        esc(trunc(x.item.title, 15)) + '</span></span>';
    }).join('');
    lastSec = secElapsed;
  }
  var lastSec = 0;

  function updateSealCount() {
    var n = stampList().length;
    sealCountEl.textContent = n ? '已钤 ' + H.numCN(n) : '';
  }

  function coloPlainText() {
    var t = coloText(Math.round((Date.now() - t0) / 1000));
    var list = stampList();
    var lines = [t.p1, t.p2];
    if (list.length) {
      lines.push('', '印谱:');
      list.forEach(function (x, i) {
        lines.push(H.pad2(i + 1) + ' ' + x.item.title + '〈' + x.sec.name + '〉');
      });
    }
    lines.push('', '—— 钤于手卷 · ' + curData.META.dateISO);
    return lines.join('\n');
  }

  function copyColo() {
    var txt = coloPlainText();
    var done = function () {
      var b = document.getElementById('v6-copy');
      if (b) { b.textContent = '已录 ✓'; setTimeout(function () { b.textContent = '复制题跋'; }, 1600); }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, function () { fb(txt); done(); });
    } else { fb(txt); done(); }
  }
  function fb(txt) {
    var ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* 忽略 */ }
    document.body.removeChild(ta);
  }

  /* ---------- 展卷手势 ---------- */
  function bindScroll() {
    scroller.addEventListener('wheel', function (e) {
      e.preventDefault();
      scroller.scrollLeft += (e.deltaY + e.deltaX);
    }, { passive: false });

    var down = null, moved = 0;
    scroller.addEventListener('pointerdown', function (e) {
      down = e.clientX; moved = 0;
      scroller.classList.add('dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (down === null) return;
      var dx = e.clientX - down;
      if (Math.abs(dx) > 6) { moved = 1; suppressClick = true; }
      scroller.scrollLeft -= dx;
      down = e.clientX;
    });
    window.addEventListener('pointerup', function () {
      down = null;
      scroller.classList.remove('dragging');
    });
    scroller.addEventListener('click', function (e) {
      if (suppressClick) { e.stopPropagation(); e.preventDefault(); suppressClick = false; }
    }, true);
    scroller.addEventListener('scroll', function () {
      var max = scroller.scrollWidth - scroller.clientWidth;
      var p = max > 0 ? scroller.scrollLeft / max : 0;
      progressEl.style.left = 'calc(' + (p * 100).toFixed(1) + '% - ' + (p * 54).toFixed(0) + 'px)';
    });
  }

  /* ---------- 模板接口 ---------- */
  A.templates.v6 = {
    mounted: false,
    mount: function (el) {
      root = el;
      scroller = document.getElementById('v6-scroller');
      track = document.getElementById('v6-track');
      sealCountEl = document.getElementById('v6-seal-count');
      progressEl = document.getElementById('v6-progress-bar');
      bindScroll();
    },
    prebind: function () { /* 预留 */ },
    enter: function (data) {
      curData = data;
      t0 = Date.now(); lastSec = 0;
      buildTrack(data);
      scroller.scrollLeft = 0;
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        if (A.state.mode === 'v6') updateColophon(true);
      }, 1000);
    },
    leave: function () {
      if (timer) { clearInterval(timer); timer = null; }
      updateColophon(false);
    },
    onKey: function (e) {
      if (e.key === 'ArrowRight') { scroller.scrollBy({ left: 460, behavior: 'smooth' }); return true; }
      if (e.key === 'ArrowLeft') { scroller.scrollBy({ left: -460, behavior: 'smooth' }); return true; }
      return false;
    },
  };
})();
