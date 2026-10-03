// shell.js —— 外壳编排:数据集状态、读法选择、翻纸过渡、键盘调度
(function () {
  'use strict';

  var esc = function (s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  var pad2 = function (n) { return String(n).padStart(2, '0'); };

  // 中文数助手(V6 题跋用)
  var CNUM = '〇一二三四五六七八九';
  function numCN(n) {
    n = Math.round(n);
    if (n < 0) return String(n);
    if (n <= 10) return ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][n];
    if (n < 20) return '十' + CNUM[n % 10];
    if (n < 100) return CNUM[Math.floor(n / 10)] + '十' + (n % 10 ? CNUM[n % 10] : '');
    return String(n);
  }
  function durCN(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    if (m === 0) return numCN(s) + '秒';
    return numCN(m) + '分' + (s ? numCN(s) + '秒' : '');
  }

  var DATASETS = Object.keys(window.NEWS_DATA); // ['2026-08-19','2026-09-03']

  window.APP = {
    state: { mode: 'choose', dataset: DATASETS[0] },
    datasets: window.NEWS_DATA,
    datasetKeys: DATASETS,
    templates: {}, // 各模板模块在此登记 { mount, enter, leave, onKey }
    helpers: { esc: esc, pad2: pad2, numCN: numCN, durCN: durCN },

    data: function () { return this.datasets[this.state.dataset]; },

    go: function (mode) {
      if (mode === this.state.mode) return;
      var self = this;
      wipe(function () {
        var old = self.state.mode;
        if (old !== 'choose' && self.templates[old]) self.templates[old].leave();
        self.state.mode = mode;
        document.body.className = 'mode-' + mode;
        document.getElementById('choose').hidden = (mode !== 'choose');
        ['v4', 'v5', 'v6'].forEach(function (k) {
          document.getElementById(k).hidden = (k !== mode);
        });
        document.getElementById('rail').hidden = (mode === 'choose');
        syncRail();
        if (mode === 'choose') { renderChooser(); window.scrollTo(0, 0); }
        else {
          var t = self.templates[mode];
          if (!t.mounted) { t.mount(document.getElementById(mode)); t.mounted = true; }
          t.enter(self.data());
        }
      });
    },

    setDataset: function (date) {
      if (!this.datasets[date] || date === this.state.dataset) return;
      var self = this;
      wipe(function () {
        self.state.dataset = date;
        syncRail();
        if (self.state.mode === 'choose') renderChooser();
        else self.templates[self.state.mode].enter(self.data());
      });
    },
  };

  /* ---------- 翻纸过渡 ---------- */
  var wipeBusy = false;
  function wipe(mid) {
    if (wipeBusy) { mid(); return; }
    wipeBusy = true;
    var w = document.getElementById('wipe');
    w.classList.remove('exit'); w.classList.add('run');
    // 强制回流后再进场
    void w.offsetWidth;
    w.classList.add('cover');
    setTimeout(function () {
      mid();
      setTimeout(function () {
        w.classList.remove('cover'); w.classList.add('exit');
        setTimeout(function () {
          w.classList.remove('run', 'exit'); w.style.transform = '';
          wipeBusy = false;
        }, 440);
      }, 80);
    }, 440);
  }
  // .run 移除后清除内联残留
  var wipeEl = document.getElementById('wipe');
  wipeEl.addEventListener('transitionend', function () {
    if (wipeEl.classList.contains('exit') && !wipeEl.classList.contains('run')) {
      wipeEl.classList.remove('exit');
    }
  });

  /* ---------- 选择页 ---------- */
  var READINGS = [
    { mode: 'v4', glyph: '扫', latin: 'SCAN', name: '观象台',
      intro: '三十条新闻铺成一张星图——评分是星等，版面是星区。转动星盘，把一个星区对准目镜。' },
    { mode: 'v5', glyph: '选', latin: 'CURATE', name: '排字车间',
      intro: 'AI 已备齐字盘里的三十枚铅字。挑八枚排进版模，拉下压杆，印出你自己的头版。' },
    { mode: 'v6', glyph: '读', latin: 'IMMERSE', name: '手卷',
      intro: '一日之事装裱成卷。徐徐展开，遇事钤印；读到卷尾，你的题跋已经写好。' },
  ];

  function renderChooser() {
    var d = APP.data();
    document.getElementById('choose-date-text').textContent =
      d.META.dateCN + ' · ' + d.META.weekday + ' · ' + d.META.cities;
    document.getElementById('choose-pre').textContent = d.PREHEADER + '。';

    var list = document.getElementById('choose-list');
    if (!list.childNodes.length) {
      READINGS.forEach(function (r) {
        var b = document.createElement('button');
        b.className = 'choose-row m-' + r.mode;
        b.setAttribute('role', 'listitem');
        b.innerHTML =
          '<span class="choose-glyph"><b>' + r.glyph + '</b>' + r.latin + '</span>' +
          '<span class="choose-name">' + r.name + '</span>' +
          '<span class="choose-intro">' + r.intro + '</span>';
        b.addEventListener('click', function () { APP.go(r.mode); });
        list.appendChild(b);
      });
    }

    var ds = document.getElementById('choose-datasets');
    ds.innerHTML = '';
    DATASETS.forEach(function (k) {
      var meta = APP.datasets[k].META;
      var b = document.createElement('button');
      b.className = 'ds-btn' + (k === APP.state.dataset ? ' on' : '');
      b.textContent = meta.dateCN;
      b.addEventListener('click', function () { APP.setDataset(k); });
      ds.appendChild(b);
    });
  }

  /* ---------- 切换轨 ---------- */
  function syncRail() {
    var rail = document.getElementById('rail');
    rail.querySelectorAll('.rail-modes button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.mode === APP.state.mode);
    });
    var ds = document.getElementById('rail-datasets');
    ds.innerHTML = '';
    DATASETS.forEach(function (k) {
      var b = document.createElement('button');
      b.className = 'ds-btn' + (k === APP.state.dataset ? ' on' : '');
      b.textContent = APP.datasets[k].META.dateISO.slice(5).replace('-', ' · ');
      b.addEventListener('click', function () { APP.setDataset(k); });
      ds.appendChild(b);
    });
  }

  /* ---------- 全局键盘调度 ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    var mode = APP.state.mode;
    if (/^[123]$/.test(e.key)) {
      APP.go(['v4', 'v5', 'v6'][+e.key - 1]);
      return;
    }
    if (mode !== 'choose') {
      var t = APP.templates[mode];
      if (t && t.onKey && t.onKey(e)) return; // 模板先消化(如关闭记录簿)
    }
    if (e.key === 'Escape') APP.go('choose');
  });

  /* ---------- 启动 ---------- */
  function boot() {
    renderChooser();
    syncRail();
    if (window.APP.templates.v6) window.APP.templates.v6.prebind();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
