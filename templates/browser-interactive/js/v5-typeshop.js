// v5-typeshop.js —— 排字车间
// 版模八槽(1 头条 / 3 要闻 / 4 简讯) + 五格字盘;点选或拖拽入版,拉杆压印出真实排版的成品页。
(function () {
  'use strict';
  var A = window.APP, H = A.helpers, esc = H.esc;

  var SLOTS = [
    { kind: '头条', cls: 'slot-headline' },
    { kind: '要闻', cls: 'slot-lead' },
    { kind: '要闻', cls: 'slot-lead' },
    { kind: '要闻', cls: 'slot-lead' },
    { kind: '简讯', cls: 'slot-brief' },
    { kind: '简讯', cls: 'slot-brief' },
    { kind: '简讯', cls: 'slot-brief' },
    { kind: '简讯', cls: 'slot-brief' },
  ];

  var root, frameEl, traysEl, counterEl, leverEl, hintEl, layerEl, ghostEl, aiBtn;
  var curData = null, secMap = {};
  var placed = new Array(8).fill(null); // {secKey,no} | null
  var aiPlan = null;                    // AI 参考版(同结构),null=未生成
  var drag = null; // {type:'chip'|'slot', secKey,no, fromIdx, sx,sy, started}

  function itemOf(secKey, no) {
    var s = secMap[secKey];
    return s ? s.items.find(function (i) { return i.no === no; }) : null;
  }
  function placedIdx(secKey, no) {
    for (var i = 0; i < 8; i++) {
      var p = placed[i];
      if (p && p.secKey === secKey && p.no === no) return i;
    }
    return -1;
  }
  function nextEmpty() { for (var i = 0; i < 8; i++) if (!placed[i]) return i; return -1; }
  function count() { return placed.filter(Boolean).length; }
  function trunc(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s; }

  /* ---------- 渲染 ---------- */
  function renderFrame() {
    var html = '';
    SLOTS.forEach(function (slot, i) {
      var p = placed[i];
      if (!p) {
        html += '<div class="slot empty ' + slot.cls + '" data-idx="' + i + '">' +
          '<span class="slot-kind">' + slot.kind + '</span>' +
          '<span class="slot-hint">' + slot.kind + '<small>空槽 · 可放入</small></span></div>';
      } else {
        var it = itemOf(p.secKey, p.no);
        html += '<div class="slot filled ' + slot.cls + '" data-idx="' + i + '">' +
          '<span class="slot-no num">No.' + H.pad2(it.no) + '</span>' +
          '<span class="slot-kind">' + slot.kind + '</span>' +
          '<div class="slot-item" data-idx="' + i + '" data-sec="' + p.secKey + '" data-no="' + it.no + '">' +
          '<div class="it-title">' + esc(it.title) + '</div>' +
          (slot.kind === '头条' ? '<div class="it-sum">' + esc(it.summary) + '</div>' : '') +
          '<span class="it-sc num">' + esc(it.score) + '</span></div>' +
          '<button class="slot-x" data-idx="' + i + '" aria-label="取出">✕</button></div>';
      }
    });
    frameEl.innerHTML = html;

    frameEl.querySelectorAll('.slot.empty').forEach(function (el) {
      el.addEventListener('click', function () {
        if (drag && drag.started) return;
      });
    });
    frameEl.querySelectorAll('.slot-x').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        placed[+b.dataset.idx] = null;
        renderFrame(); renderTrays(); updateCounter();
      });
    });
    frameEl.querySelectorAll('.slot-item').forEach(function (el) {
      el.addEventListener('pointerdown', function (e) {
        startDrag(e, { type: 'slot', fromIdx: +el.dataset.idx });
      });
    });
  }

  function renderTrays() {
    var html = '';
    curData.SECTIONS.forEach(function (s, si) {
      html += '<div class="tray" data-tray="' + s.key + '">' +
        '<div class="tray-name">' + esc(s.name) + '</div>' +
        '<div class="tray-chips">' + s.items.map(function (it) {
          var used = placedIdx(s.key, it.no) >= 0;
          return '<div class="chip' + (used ? ' used' : '') + '" data-sec="' + s.key + '" data-no="' + it.no + '"' +
            (used ? ' aria-disabled="true"' : '') + '>' +
            '<span class="c-no num">' + H.pad2(it.no) + '</span>' +
            '<span class="c-title">' + esc(it.title) + '</span>' +
            '<span class="c-sc num">' + esc(it.score) + '</span></div>';
        }).join('') +
        (si === 0 ? '<div class="tray-tip">点选入版,或拖入指定槽位 · 铅字入版后即成阴刻</div>' : '') +
        '</div></div>';
    });
    traysEl.innerHTML = html;
    traysEl.querySelectorAll('.chip:not(.used)').forEach(function (chip) {
      chip.addEventListener('pointerdown', function (e) {
        startDrag(e, {
          type: 'chip',
          secKey: chip.dataset.sec, no: +chip.dataset.no,
        });
      });
      chip.addEventListener('click', function () {
        if (drag && drag.started) return;
        var idx = nextEmpty();
        if (idx < 0) { deny(); return; }
        place(idx, chip.dataset.sec, +chip.dataset.no);
      });
      chip.title = (itemOf(chip.dataset.sec, +chip.dataset.no) || {}).summary || '';
    });
  }

  function place(idx, secKey, no) {
    // 若该条已在其他槽位,先从原槽取出
    var at = placedIdx(secKey, no);
    if (at >= 0) placed[at] = null;
    placed[idx] = { secKey: secKey, no: no };
    renderFrame(); renderTrays(); updateCounter();
  }

  function updateCounter() {
    var n = count();
    counterEl.innerHTML = '已入版 <b class="num">' + n + '</b> / <span class="num">8</span>';
    var ready = n === 8;
    leverEl.classList.toggle('ready', ready);
    leverEl.disabled = !ready;
    hintEl.textContent = ready ? '版已齐 · 拉杆压印(Enter)' : '还差 ' + H.numCN(8 - n) + ' 枚即可压印';
  }

  function deny() {
    hintEl.classList.remove('deny'); void hintEl.offsetWidth;
    hintEl.classList.add('deny');
  }

  /* ---------- AI 参考版与对照 ---------- */
  function allItemsByScore() {
    var all = [];
    curData.SECTIONS.forEach(function (s) {
      s.items.forEach(function (it) { all.push({ secKey: s.key, no: it.no, score: parseFloat(it.score) || 0 }); });
    });
    all.sort(function (a, b) { return b.score - a.score; });
    return all;
  }
  function aiPlanFill() {
    var top = allItemsByScore().slice(0, 8);
    placed = new Array(8).fill(null);
    top.forEach(function (x, i) { placed[i] = { secKey: x.secKey, no: x.no }; });
    aiPlan = placed.slice();
    aiBtn.classList.add('done');
    aiBtn.textContent = 'AI 已排出参考版';
    hintEl.classList.remove('deny'); void hintEl.offsetWidth;
    hintEl.textContent = 'AI 按星等排好了参考版 · 动它,或照单压印';
    renderFrame(); renderTrays(); updateCounter();
  }
  function compare() {
    if (!aiPlan) return null;
    var key = function (p) { return p.secKey + ':' + p.no; };
    var userSet = {}, aiSet = {};
    var us = 0, as = 0, overlap = 0;
    placed.forEach(function (p) {
      if (!p) return;
      userSet[key(p)] = true;
      us += itemOf(p.secKey, p.no) ? parseFloat(itemOf(p.secKey, p.no).score) || 0 : 0;
    });
    aiPlan.forEach(function (p) {
      aiSet[key(p)] = true;
      as += itemOf(p.secKey, p.no) ? parseFloat(itemOf(p.secKey, p.no).score) || 0 : 0;
    });
    Object.keys(userSet).forEach(function (k) { if (aiSet[k]) overlap++; });
    var avg = function (n, d) { return d ? (n / d).toFixed(2) : '—'; };
    var verdict = overlap === 8 ? '照单全收' : overlap >= 6 ? '大同小异' : overlap >= 3 ? '别有主张' : '另起炉灶';
    return { avgUser: avg(us, count()), avgAI: avg(as, 8), overlap: overlap, verdict: verdict };
  }
  function compareLine() {
    var c = compare();
    if (!c) return '';
    return '<div class="sh-compare"><span>与 AI 参考版对照 — AI 均值 <b class="num">' + c.avgAI +
      '</b> · 你的均值 <b class="num">' + c.avgUser + '</b> · 重合 <b class="num">' + c.overlap + ' / 8</b></span>' +
      '<span class="verdict">' + c.verdict + '</span></div>';
  }

  /* ---------- 拖拽(指针式,兼容触屏) ---------- */
  function startDrag(e, info) {
    if (e.button !== undefined && e.button !== 0) return;
    if (info.type === 'slot') {
      var p = placed[info.fromIdx];
      if (!p) return;
      info.secKey = p.secKey; info.no = p.no;
    }
    drag = Object.assign({ sx: e.clientX, sy: e.clientY, started: false }, info);
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragUp, { once: true });
  }
  function onDragMove(e) {
    if (!drag) return;
    if (!drag.started) {
      if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) < 7) return;
      drag.started = true;
      var it = itemOf(drag.secKey, drag.no);
      ghostEl.innerHTML = '<span class="c-no num">' + H.pad2(it.no) + '</span><span class="c-title">' +
        esc(it.title) + '</span><span class="c-sc num">' + esc(it.score) + '</span>';
      ghostEl.hidden = false;
      document.body.style.cursor = 'grabbing';
    }
    ghostEl.style.left = (e.clientX - 40) + 'px';
    ghostEl.style.top = (e.clientY - 18) + 'px';
    highlightSlot(e.clientX, e.clientY);
  }
  function slotAt(x, y) {
    var el = document.elementFromPoint(x, y);
    return el ? el.closest('.slot') : null;
  }
  function highlightSlot(x, y) {
    frameEl.querySelectorAll('.slot.over').forEach(function (s) { s.classList.remove('over'); });
    var s = slotAt(x, y);
    if (s) s.classList.add('over');
  }
  function onDragUp(e) {
    window.removeEventListener('pointermove', onDragMove);
    document.body.style.cursor = '';
    ghostEl.hidden = true;
    if (!drag) return;
    var d = drag; drag = null;
    frameEl.querySelectorAll('.slot.over').forEach(function (s) { s.classList.remove('over'); });
    if (!d.started) return; // 未成拖拽,交还 click
    var slot = slotAt(e.clientX, e.clientY);
    if (slot) {
      var idx = +slot.dataset.idx;
      var occupant = placed[idx];
      if (d.type === 'slot' && d.fromIdx === idx) return;
      if (occupant) {
        // 交换:原住槽的字退回,若拖拽源也是槽位则对调
        if (d.type === 'slot') { placed[d.fromIdx] = occupant; placed[idx] = { secKey: d.secKey, no: d.no }; }
        else { placed[idx] = { secKey: d.secKey, no: d.no }; }
      } else {
        placed[idx] = { secKey: d.secKey, no: d.no };
        if (d.type === 'slot') placed[d.fromIdx] = null;
      }
      renderFrame(); renderTrays(); updateCounter();
      return;
    }
    // 拖出版模 → 取出
    if (d.type === 'slot') {
      var overTray = document.elementFromPoint(e.clientX, e.clientY);
      if (overTray && overTray.closest('.v5-trays')) {
        placed[d.fromIdx] = null;
        renderFrame(); renderTrays(); updateCounter();
      }
    }
  }

  /* ---------- 压印与成品页 ---------- */
  function pullLever() {
    if (leverEl.disabled) { deny(); return; }
    leverEl.classList.add('pulling');
    setTimeout(function () {
      leverEl.classList.remove('pulling');
      openSheet();
    }, 430);
  }

  function sheetArticles() {
    var head = placed[0] ? itemOf(placed[0].secKey, placed[0].no) : null;
    var leads = [1, 2, 3].map(function (i) {
      return placed[i] ? itemOf(placed[i].secKey, placed[i].no) : null;
    });
    var briefs = [4, 5, 6, 7].map(function (i) {
      return placed[i] ? itemOf(placed[i].secKey, placed[i].no) : null;
    });
    return { head: head, leads: leads, briefs: briefs };
  }
  function srcLine(it) {
    return (it.sources || []).map(function (s) { return s.media + ' ' + s.date; }).join(' · ');
  }

  function openSheet() {
    var d = curData, a = sheetArticles();
    var mast =
      '<div class="sh-mast"><div class="sh-mast-title">我的每日简报</div>' +
      '<div class="sh-mast-sub"><span class="num">' + esc(d.META.dateCN + ' · ' + d.META.weekday) +
      '</span> · 选编自「' + esc(d.META.title) + '」· 排字车间压印</div></div>';
    var h = a.head ? '<article class="sh-a sh-headline"><div class="sh-kind">头条</div>' +
      '<h2>' + esc(a.head.title) + '</h2>' +
      '<p class="sh-sum">' + esc(a.head.summary) + '</p>' +
      '<p class="sh-imp"><b>影响</b>' + esc(a.head.impact) + '</p>' +
      '<p class="sh-src">' + esc(srcLine(a.head)) + '</p></article>' : '';
    var l = a.leads.map(function (it) {
      return it ? '<article class="sh-a sh-lead"><div class="sh-kind">要闻</div>' +
        '<h3>' + esc(it.title) + '</h3><p class="sh-sum">' + esc(it.summary) + '</p>' +
        '<p class="sh-src">' + esc(srcLine(it)) + '</p></article>' : '';
    }).join('');
    var b = a.briefs.map(function (it) {
      return it ? '<div class="sh-briefrow"><span class="sh-kind">简讯</span>' +
        '<h4>' + esc(it.title) + '</h4><span class="sh-src">' + esc((it.sources || [])[0] ?
          (it.sources[0].media + ' ' + it.sources[0].date) : '') + '</span></div>' : '';
    }).join('');
    var foot =
      '<div class="sh-foot"><span>' + esc(d.FOOTER_NOTE || '本简报由 AI 自动抓取、人工审核生成,内容仅供参考') +
      '</span><span>读者选排 · 八槽定稿 · 一版一印</span></div>';
    layerEl.innerHTML =
      '<div class="v5-sheet-actions">' +
      '<button class="pap-btn primary" id="v5-copy">复制全文</button>' +
      '<button class="pap-btn" id="v5-print">打印此页</button>' +
      '<button class="pap-btn" id="v5-back">回炉重排</button>' +
      '<span class="sh-note">这是真实排版的纸面 · 打印与复制均可用</span></div>' +
      '<div class="v5-sheet">' + mast + h + l + b + compareLine() + foot + '</div>';
    layerEl.hidden = false;
    layerEl.querySelector('#v5-copy').addEventListener('click', copySheet);
    layerEl.querySelector('#v5-print').addEventListener('click', function () { window.print(); });
    layerEl.querySelector('#v5-back').addEventListener('click', hideLayer);
  }

  function sheetText() {
    var d = curData, a = sheetArticles();
    var lines = ['我的每日简报', d.META.dateCN + ' ' + d.META.weekday + ' · 选编自「' + d.META.title + '」· 排字车间压印', ''];
    if (a.head) lines.push('【头条】' + a.head.title, a.head.summary, '影响:' + a.head.impact, '来源:' + srcLine(a.head), '');
    a.leads.forEach(function (it, i) {
      if (it) lines.push('【要闻 ' + (i + 1) + '】' + it.title, it.summary, '来源:' + srcLine(it), '');
    });
    a.briefs.forEach(function (it, i) {
      if (it) lines.push('【简讯 ' + (i + 1) + '】' + it.title + '(' + ((it.sources || [])[0] || {}).media + ')');
    });
    lines.push('', d.FOOTER_NOTE || '本简报由 AI 自动抓取、人工审核生成,内容仅供参考');
    var c = compare();
    if (c) lines.push('与 AI 参考版对照:AI 均值 ' + c.avgAI + ' · 你的均值 ' + c.avgUser + ' · 重合 ' + c.overlap + '/8 · ' + c.verdict);
    lines.push('—— 本页由读者选排压印');
    return lines.join('\n');
  }

  function copySheet() {
    var txt = sheetText();
    var done = function () {
      var btn = layerEl.querySelector('#v5-copy');
      if (btn) { btn.textContent = '已复制 ✓'; setTimeout(function () { btn.textContent = '复制全文'; }, 1600); }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt); done(); });
    } else { fallbackCopy(txt); done(); }
  }
  function fallbackCopy(txt) {
    var ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* 忽略 */ }
    document.body.removeChild(ta);
  }

  function hideLayer() { layerEl.hidden = true; layerEl.innerHTML = ''; }

  /* ---------- 模板接口 ---------- */
  A.templates.v5 = {
    mounted: false,
    mount: function (el) {
      root = el;
      frameEl = document.getElementById('v5-frame');
      traysEl = document.getElementById('v5-trays');
      counterEl = document.getElementById('v5-counter');
      leverEl = document.getElementById('v5-lever');
      hintEl = document.getElementById('v5-lever-hint');
      layerEl = document.getElementById('v5-sheet-layer');
      ghostEl = document.getElementById('v5-ghost');
      aiBtn = document.getElementById('v5-ai-plan');
      leverEl.addEventListener('click', pullLever);
      aiBtn.addEventListener('click', aiPlanFill);
    },
    enter: function (data) {
      curData = data;
      secMap = {};
      data.SECTIONS.forEach(function (s) { secMap[s.key] = s; });
      placed = new Array(8).fill(null);
      aiPlan = null;
      aiBtn.classList.remove('done');
      aiBtn.textContent = '让 AI 先排一版';
      hideLayer();
      renderFrame(); renderTrays(); updateCounter();
    },
    leave: function () {
      drag = null; ghostEl.hidden = true;
      document.body.style.cursor = '';
      hideLayer();
    },
    onKey: function (e) {
      if (!layerEl.hidden) {
        if (e.key === 'Escape') { hideLayer(); return true; }
        return true; // 成品页打开时接管其余按键
      }
      if (e.key === 'Enter') { pullLever(); return true; }
      return false;
    },
  };
})();
