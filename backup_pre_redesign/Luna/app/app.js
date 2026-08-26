/* ============================================================
   LunaStore - localStorage-backed persistence
   ============================================================ */
(function(){
  var NS = "luna.v1.";
  function safe(fn, fallback){
    try { return fn(); } catch(e){ return fallback; }
  }
  function get(key, def){
    return safe(function(){
      var v = localStorage.getItem(NS + key);
      return v === null ? def : JSON.parse(v);
    }, def);
  }
  function set(key, value){
    return safe(function(){
      localStorage.setItem(NS + key, JSON.stringify(value));
      return true;
    }, false);
  }
  function append(key, item){
    var arr = get(key, []);
    if (!Array.isArray(arr)) arr = [];
    arr.push(item);
    return set(key, arr);
  }
  function remove(key){
    return safe(function(){ localStorage.removeItem(NS + key); return true; }, false);
  }
  function clear(){
    return safe(function(){
      var keys = [];
      for (var i = 0; i < localStorage.length; i++){
        var k = localStorage.key(i);
        if (k && k.indexOf(NS) === 0) keys.push(k);
      }
      keys.forEach(function(k){ localStorage.removeItem(k); });
      return true;
    }, false);
  }
  // helpers used across modules
  function todayKey(){
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  }
  function daysBetween(a, b){
    var ms = Math.abs(new Date(b) - new Date(a));
    return Math.floor(ms / 86400000);
  }
  window.LunaStore = { get: get, set: set, append: append, remove: remove, clear: clear,
                        todayKey: todayKey, daysBetween: daysBetween };
})();

/* ============================================================
   Luna - splash screen (shows on every load / reload)
   ============================================================ */
(function () {
  "use strict";
  var splash = document.getElementById("splash");
  if (!splash) return;
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hold = reduce ? 350 : 1800;          // visible time before fade
  setTimeout(function () {
    splash.classList.add("gone");
    setTimeout(function () {
      splash.remove();
      // returning user? skip onboarding entirely
      var saved = window.LunaStore && window.LunaStore.get("userState");
      if (saved && window.LunaApp){
        ["topbar","stage"].forEach(function(id){
          var el = document.getElementById(id);
          if (el) el.style.display = "none";
        });
        document.querySelector(".bg") && (document.querySelector(".bg").style.opacity = "0.3");
        window.LunaApp.enter(saved);
      }
    }, 550);
  }, hold);
})();

/* ============================================================
   Luna - config-driven onboarding engine
   ============================================================ */
(function () {
  "use strict";

  const state = {
    mood: "", name: "", age: "", usingFor: "",
    heightFt: 5, heightIn: 4, weightLb: 140, weightDec: 0,
    goals: [], cycleStatus: "", cycleRegular: "", lastPeriod: null,
    cycleLength: 28, periodLength: 5,
    onBirthControl: "", birthControl: "", conditions: [],
    periodFeeling: "", knowledge: "",
    cycleImpact: [], symptoms: [],
    sleepHours: "", sleepImprove: [], lifestyleFocus: [], activity: "",
    intimacyGoal: "", sexDrive: "",
    wellnessGoals: [], reminders: []
  };

  const FLOW = [
    { id: "welcome", type: "hero",
      eyebrow: "Welcome to Luna",
      title: "Your body, |understood.|",
      sub: "A calmer way to track your cycle, decode your symptoms, and feel your best - every single day.",
      cta: "Get started", alt: "I already have an account" },

    { id: "mood", type: "mood",
      title: "How are you |feeling| today?",
      sub: "There's no wrong answer. We just want to meet you where you are.",
      key: "mood",
      options: [
        { e: "😞", l: "Low" }, { e: "😕", l: "Meh" },
        { e: "🙂", l: "Okay" }, { e: "😊", l: "Good" }, { e: "🤩", l: "Great" }
      ] },

    { id: "name", type: "text",
      title: "First, what should we |call you?|",
      sub: "We'll use it to make Luna feel a little more like home.",
      key: "name", placeholder: "Your first name" },

    { id: "age", type: "single",
      title: "How old are |you?|",
      sub: "Your age helps us tailor insights to your stage of life.",
      key: "age",
      options: ["Under 18", "18 – 24", "25 – 34", "35 – 44", "45 and over"] },

    { id: "height", type: "wheel",
      title: "How |tall| are you?",
      sub: "Adding your height helps us sharpen your cycle predictions.",
      suffix: "ft / in",
      columns: [
        { key: "heightFt", from: 3, to: 7, label: "ft" },
        { key: "heightIn", from: 0, to: 11, label: "in" }
      ] },

    { id: "weight", type: "wheel",
      title: "What's your |weight?|",
      sub: "This helps us personalize predictions - it stays private to you.",
      suffix: "lb",
      columns: [
        { key: "weightLb", from: 80, to: 300, label: "" },
        { key: "weightDec", from: 0, to: 9, label: ".", dot: true }
      ] },

    { id: "usingFor", type: "single",
      title: "Who are you using |Luna| for?",
      sub: "Luna adapts to whoever's cycle you're following.",
      key: "usingFor",
      options: ["Myself", "Someone I care about", "I have a partner code"] },

    { id: "goals", type: "cards",
      title: "What brings you |here| today?",
      sub: "Choose as many as you'd like - you can change these later.",
      key: "goals",
      options: [
        { e: "🌙", l: "Track my cycle" },
        { e: "🔍", l: "Understand symptoms" },
        { e: "🌿", l: "Improve wellness" },
        { e: "🌸", l: "Try to conceive" },
        { e: "🤰", l: "Track pregnancy" },
        { e: "📖", l: "Learn about my body" }
      ] },

    { id: "cycleStatus", type: "single",
      title: "Do you get |periods?|",
      sub: "This shapes everything we predict for you. Be as honest as feels right.",
      key: "cycleStatus",
      options: ["Yes, regularly", "They're irregular", "Not right now", "I'm pregnant", "I'm in menopause"] },

    { id: "cycleRegular", type: "single",
      title: "Is your menstrual |cycle regular?|",
      sub: "The variation in length between cycles is less than 7 days.",
      key: "cycleRegular",
      options: ["Yes", "No", "I'm not sure"],
      skipIf: s => ["Not right now", "I'm pregnant", "I'm in menopause"].includes(s.cycleStatus) },

    { id: "lastPeriod", type: "date",
      title: "When did your last |period| start?",
      sub: "An estimate is perfectly fine - you can refine it anytime.",
      key: "lastPeriod",
      skipIf: s => ["Not right now", "I'm pregnant", "I'm in menopause"].includes(s.cycleStatus) },

    { id: "cycleLength", type: "stepper",
      title: "How long is your |cycle| usually?",
      sub: "Counting from the first day of one period to the next.",
      key: "cycleLength", min: 20, max: 45, unit: "days", unsure: 28,
      skipIf: s => ["Not right now", "I'm pregnant", "I'm in menopause"].includes(s.cycleStatus) },

    { id: "periodLength", type: "stepper",
      title: "How long does your |period| last?",
      sub: "On average, from first spotting to the last day.",
      key: "periodLength", min: 1, max: 12, unit: "days", unsure: 5,
      skipIf: s => ["Not right now", "I'm pregnant", "I'm in menopause"].includes(s.cycleStatus) },

    { id: "onBirthControl", type: "single",
      title: "Are you on |birth control?|",
      sub: "Hormonal methods change how we read your cycle.",
      key: "onBirthControl",
      options: ["Yes", "No"] },

    { id: "birthControl", type: "single-list",
      title: "What birth control do you use, |if any?|",
      sub: "This helps us interpret your cycle accurately. No judgment here.",
      key: "birthControl",
      skipIf: s => s.onBirthControl === "No",
      options: [
        "Nothing right now", "Pill, patch, or ring", "Progestin-only pill",
        "Implant or injection", "Hormonal IUD", "Copper IUD (non-hormonal)",
        "Condoms", "Fertility awareness", "Prefer not to say"
      ] },

    { id: "conditions", type: "single-list", multi: true,
      title: "Do you experience any of these |conditions?|",
      sub: "Choose all that apply - this is private and helps tailor your insights.",
      key: "conditions",
      options: [
        "PCOS", "Endometriosis", "Fibroids", "Thyroid condition",
        "Frequent UTIs", "Recurrent yeast infections", "None of these", "I'm not sure"
      ] },

    { id: "periodFeeling", type: "single",
      title: "How do you feel about your |period?|",
      sub: "Understanding your relationship with it helps us support you better.",
      key: "periodFeeling",
      options: [
        { e: "😍", l: "We've become friends" },
        { e: "🤔", l: "I want to understand it better" },
        { e: "😣", l: "It's a love–hate thing" },
        { e: "😤", l: "Honestly, I dread it" },
        { e: "🙈", l: "It still feels awkward" }
      ] },

    { id: "knowledge", type: "single",
      title: "How well do you know your |body's rhythms?|",
      sub: "We'll match the depth of our guidance to you.",
      key: "knowledge",
      options: [
        { e: "🎓", l: "I know it inside out" },
        { e: "📈", l: "Decent - still learning" },
        { e: "🌱", l: "Not much, keen to learn" },
        { e: "❓", l: "Honestly? Where do I start" }
      ] },

    { id: "cycleImpact", type: "chips",
      title: "Does your cycle affect any of |these?|",
      sub: "Pick whatever resonates - this tunes your daily insights.",
      key: "cycleImpact",
      options: [
        { e: "🎭", l: "Mood" }, { e: "✨", l: "Skin" }, { e: "🍽️", l: "Appetite" },
        { e: "⚡", l: "Energy" }, { e: "😴", l: "Sleep" }, { e: "🧠", l: "Focus" },
        { e: "💗", l: "Libido" }, { e: "🤕", l: "Pain" }
      ] },

    { id: "sleepHours", type: "single",
      title: "How much |sleep| do you usually get?",
      sub: "Sleep and your cycle are closely linked.",
      key: "sleepHours",
      options: ["Less than 6 hours", "6 – 7 hours", "7 – 9 hours", "More than 9 hours"] },

    { id: "sleepImprove", type: "single-list", multi: true,
      title: "What part of your |sleep| would you improve?",
      sub: "Choose all that apply.",
      key: "sleepImprove",
      options: [
        "Falling asleep faster", "Staying asleep through the night",
        "Waking up more rested", "Overall sleep quality",
        "A better wind-down routine", "Nothing - I sleep great"
      ] },

    { id: "lifestyleFocus", type: "single-list", multi: true,
      title: "Which |lifestyle areas| matter most to you?",
      sub: "We'll surface tips and reminders for the ones you pick.",
      key: "lifestyleFocus",
      options: [
        "Drinking more water", "More balanced meals",
        "Cutting back on caffeine", "Less sugar & processed food",
        "More iron-rich foods", "Moving more day-to-day",
        "Managing stress", "Just exploring for now"
      ] },

    { id: "activity", type: "single",
      title: "How active are you on a |typical day?|",
      sub: "This shapes the movement tips we surface for you.",
      key: "activity",
      options: [
        "Not very active", "I fit in some active breaks",
        "On my feet most of the day", "I don't really track it"
      ] },

    { id: "intimacyGoal", type: "single",
      title: "Anything you'd like to nurture in your |intimate life?|",
      sub: "Optional, and always private. Skip anything you'd rather not answer.",
      key: "intimacyGoal",
      options: [
        "Feel more connected", "More confidence", "More pleasure",
        "Less discomfort", "Just curious to learn", "Prefer not to answer"
      ] },

    { id: "sexDrive", type: "single",
      title: "Does your desire shift across the |month?|",
      sub: "Hormones can move this around - tracking it reveals patterns.",
      key: "sexDrive",
      options: ["Yes, it changes", "No, it stays steady", "I haven't noticed", "Prefer not to answer"] },

    { id: "affirm", type: "affirm",
      bubble: "Thanks for being so open and honest with me.",
      cta: "Next" },

    { id: "wellnessGoals", type: "cards",
      title: "What are your |wellness goals?|",
      sub: "Choose what matters most to you right now.",
      key: "wellnessGoals",
      options: [
        { e: "😴", l: "Better sleep" },
        { e: "⚖️", l: "Hormone balance" },
        { e: "🧘‍♀️", l: "Stress management" },
        { e: "💪", l: "Fitness" },
        { e: "🌸", l: "Fertility awareness" },
        { e: "🛁", l: "More self-care" }
      ] },

    { id: "reminders", type: "single-list", multi: true,
      title: "Would gentle |reminders| help?",
      sub: "We'll only nudge you when it's genuinely useful. No spam - promise.",
      key: "reminders",
      options: [
        "Period reminders", "Ovulation reminders",
        "Medication reminders", "Wellness tips"
      ],
      after: "notify" },

    { id: "loading", type: "loading",
      steps: [
        "Analyzing your cycle patterns…",
        "Mapping your symptoms…",
        "Factoring in sleep & activity…",
        "Building your wellness plan…",
        "Personalizing your experience…"
      ] },

    { id: "proof", type: "proof",
      big: "7M+", sub: "5-star ratings", cap: "on the App Store & Google Play",
      quotes: [
        { t: "I finally understand my body. A genuine turning point for me.", a: " -  Mira, member since 2023", side: "" },
        { t: "The predictions are uncannily accurate. It just gets me.", a: " -  Priya", side: "right" },
        { t: "Calmest health app I've used. No anxiety, just clarity.", a: " -  Sloane", side: "" }
      ] },

    { id: "premium", type: "premium",
      title: "Unlock |Luna+|",
      sub: "Everything you need for a deeper understanding of you.",
      cta: "Start 7-day free trial", alt: "Continue with the free plan" },

    { id: "done", type: "done",
      title: "You're all set|NAME||!|",
      sub: "Your space is ready. Let's start building a clearer picture of your health, one day at a time.",
      cta: "Start tracking" }
  ];

  /* ---------- DOM refs ---------- */
  const stage = document.getElementById("stage");
  const progressFill = document.getElementById("progressFill");
  const backBtn = document.getElementById("backBtn");
  const skipBtn = document.getElementById("skipBtn");
  const topbar = document.getElementById("topbar");
  const toast = document.getElementById("toast");
  const permScrim = document.getElementById("permScrim");

  let index = 0;
  let history = [];

  /* ---------- helpers ---------- */
  const em = s => s.replace(/\|([^|]+)\|/g, "<em>$1</em>");
  function buzz(){ if (navigator.vibrate) navigator.vibrate(8); }
  function showToast(m){
    toast.textContent = m; toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  function ripple(e, el){
    const r = document.createElement("span"); r.className = "ripple";
    const rect = el.getBoundingClientRect();
    const x = (e.clientX || rect.left + rect.width/2) - rect.left;
    const y = (e.clientY || rect.top + rect.height/2) - rect.top;
    r.style.width = r.style.height = Math.max(rect.width, rect.height) + "px";
    r.style.left = x + "px"; r.style.top = y + "px";
    el.appendChild(r); setTimeout(() => r.remove(), 650);
  }
  function el(tag, cls, html){
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function visibleSteps(){ return FLOW.filter(s => !(s.skipIf && s.skipIf(state))); }
  function toggle(key, val){
    const i = state[key].indexOf(val);
    if (i === -1) state[key].push(val); else state[key].splice(i, 1);
  }

  function footer(primaryLabel, opts){
    opts = opts || {};
    const f = el("div", "footer");
    const b = el("button", "btn btn-primary", primaryLabel);
    if (opts.disabled) b.disabled = true;
    b.addEventListener("click", e => {
      if (b.disabled) return;
      ripple(e, b); buzz();
      opts.onPrimary ? opts.onPrimary() : go(1);
    });
    f.appendChild(b);
    if (opts.alt){
      const a = el("button", "btn-text", opts.alt);
      a.addEventListener("click", () => { buzz(); opts.onAlt ? opts.onAlt() : go(1); });
      f.appendChild(a);
    }
    return { node: f, primary: b };
  }

  /* ============================================================
     SCREEN BUILDERS
     ============================================================ */
  const build = {

    hero(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner center");
      inner.innerHTML = `
        <div class="hero-art">
          <div class="mascot mascot-lg">
            <div class="mascot-body"><span class="cap"></span>
              <span class="face"><span class="eye"></span><span class="eye r"></span>
              <span class="smile"></span><span class="blush"></span><span class="blush r"></span></span>
            </div>
            <span class="leaf"></span>
            <span class="spark s1"></span><span class="spark s2"></span><span class="spark s3"></span>
          </div>
        </div>
        <p class="eyebrow">${cfg.eyebrow}</p>
        <h1 class="display">${em(cfg.title)}</h1>
        <p class="sub">${cfg.sub}</p>
        <div class="dots-row"><span class="trust">★★★★★</span>
          <span class="trust-text">Loved by over 7 million people</span></div>`;
      s.appendChild(inner);
      s.appendChild(footer(cfg.cta, {
        alt: cfg.alt,
        onAlt: () => { if (window.LunaLogin) window.LunaLogin.open(); }
      }).node);
      return s;
    },

    mood(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner");
      inner.appendChild(el("h1", "title", em(cfg.title)));
      inner.appendChild(el("p", "sub", cfg.sub));
      const row = el("div", "mood-row");
      const f = footer("Continue", { disabled: !state[cfg.key] });
      cfg.options.forEach(o => {
        const m = el("button", "mood", `<span class="face-emo">${o.e}</span><small>${o.l}</small>`);
        if (state[cfg.key] === o.l) m.classList.add("sel");
        m.addEventListener("click", () => {
          row.querySelectorAll(".mood").forEach(x => x.classList.remove("sel"));
          m.classList.add("sel"); state[cfg.key] = o.l;
          f.primary.disabled = false; buzz();
        });
        row.appendChild(m);
      });
      inner.appendChild(row);
      s.appendChild(inner); s.appendChild(f.node);
      return s;
    },

    text(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner");
      inner.innerHTML = `
        <div class="mascot mascot-sm"><div class="mascot-body"><span class="cap"></span>
          <span class="face"><span class="eye"></span><span class="eye r"></span>
          <span class="smile"></span><span class="blush"></span><span class="blush r"></span></span></div></div>
        <h1 class="title">${em(cfg.title)}</h1>
        <p class="sub">${cfg.sub}</p>
        <div class="field">
          <input type="text" id="f_${cfg.key}" class="field-input" placeholder=" " maxlength="24" autocomplete="given-name">
          <label for="f_${cfg.key}" class="field-label">${cfg.placeholder}</label>
          <span class="field-line"></span>
        </div>`;
      const f = footer("Continue", { disabled: !state[cfg.key] });
      s.appendChild(inner); s.appendChild(f.node);
      const input = inner.querySelector("input");
      input.value = state[cfg.key] || "";
      input.addEventListener("input", () => {
        state[cfg.key] = input.value.trim();
        f.primary.disabled = state[cfg.key].length < 1;
      });
      input.addEventListener("keydown", e => {
        if (e.key === "Enter" && !f.primary.disabled){ input.blur(); go(1); }
      });
      s._focus = () => input.focus();
      return s;
    },

    single(cfg){
      const s = el("section", "screen dark-q");
      const inner = el("div", "screen-inner dark-q-inner");
      inner.appendChild(el("h1", "title dark-title", em(cfg.title)));
      if (cfg.sub) inner.appendChild(el("p", "sub dark-sub", cfg.sub));

      // option analysis: are they all short? is there an uncertainty option last?
      const optsRaw = cfg.options.map(o => (typeof o === "object" ? o.l : o));
      const allShort = optsRaw.every(l => l.length <= 8);
      const uncertainRe = /^(i'm not sure|not sure|prefer not|i don't know)/i;
      const lastUncertain = uncertainRe.test(optsRaw[optsRaw.length - 1] || "");
      const visibleOpts = lastUncertain ? optsRaw.slice(0, -1) : optsRaw;
      const useCircles = visibleOpts.length === 2 && visibleOpts.every(l => l.length <= 8);

      const f = footer("Continue", { disabled: !state[cfg.key] });

      const select = (label, target) => {
        state[cfg.key] = label;
        inner.querySelectorAll(".opt, .circle-opt, .opt-link").forEach(x => x.classList.remove("sel"));
        if (target) target.classList.add("sel");
        f.primary.disabled = false; buzz();
      };

      if (useCircles){
        const wrap = el("div", "circle-options");
        cfg.options.forEach(o => {
          const isObj = typeof o === "object";
          const label = isObj ? o.l : o;
          if (lastUncertain && uncertainRe.test(label)) return; // skip; render as link below
          const btn = el("button", "circle-opt");
          btn.dataset.val = label;
          btn.innerHTML = `<span>${label}</span>`;
          if (state[cfg.key] === label) btn.classList.add("sel");
          btn.addEventListener("click", () => select(label, btn));
          wrap.appendChild(btn);
        });
        inner.appendChild(wrap);
        if (lastUncertain){
          const u = optsRaw[optsRaw.length - 1];
          const link = el("button", "opt-link");
          link.dataset.val = u;
          link.textContent = u;
          if (state[cfg.key] === u) link.classList.add("sel");
          link.addEventListener("click", () => select(u, link));
          inner.appendChild(link);
        }
      } else {
        const list = el("div", "card-list dark-list");
        cfg.options.forEach(o => {
          const isObj = typeof o === "object";
          const label = isObj ? o.l : o;
          const opt = el("button", "opt");
          opt.dataset.val = label;
          opt.innerHTML = `<span class="lbl">${isObj ? `<span class="emo">${o.e}</span>` : ""}${label}</span>`;
          if (state[cfg.key] === label) opt.classList.add("sel");
          opt.addEventListener("click", () => select(label, opt));
          list.appendChild(opt);
        });
        inner.appendChild(list);
      }
      s.appendChild(inner); s.appendChild(f.node);
      return s;
    },

    "single-list"(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner");
      inner.appendChild(el("h1", "title", em(cfg.title)));
      inner.appendChild(el("p", "sub", cfg.sub));
      const multi = !!cfg.multi;
      const list = el("div", "card-list tight");
      const proceed = () => cfg.after === "notify" ? openPermission() : go(1);
      const disabled = multi ? state[cfg.key].length === 0 : !state[cfg.key];
      const f = footer("Continue", { disabled, onPrimary: proceed });
      cfg.options.forEach(o => {
        const opt = el("button", "opt" + (multi ? " checkbox" : ""));
        opt.innerHTML = `<span class="lbl">${o}</span>`;
        const isSel = multi ? state[cfg.key].includes(o) : state[cfg.key] === o;
        if (isSel) opt.classList.add("sel");
        opt.addEventListener("click", () => {
          if (multi){
            opt.classList.toggle("sel"); toggle(cfg.key, o);
            f.primary.disabled = state[cfg.key].length === 0;
          } else {
            list.querySelectorAll(".opt").forEach(x => x.classList.remove("sel"));
            opt.classList.add("sel"); state[cfg.key] = o;
            f.primary.disabled = false;
          }
          buzz();
        });
        list.appendChild(opt);
      });
      inner.appendChild(list);
      s.appendChild(inner); s.appendChild(f.node);
      return s;
    },

    cards(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner");
      inner.appendChild(el("h1", "title", em(cfg.title)));
      inner.appendChild(el("p", "sub", cfg.sub));
      const grid = el("div", "goal-grid");
      const f = footer("Continue", { disabled: state[cfg.key].length === 0 });
      cfg.options.forEach(o => {
        const g = el("button", "goal",
          `<span class="goal-ic">${o.e}</span><span class="goal-label">${o.l}</span><span class="check"></span>`);
        if (state[cfg.key].includes(o.l)) g.classList.add("sel");
        g.addEventListener("click", () => {
          g.classList.toggle("sel"); toggle(cfg.key, o.l);
          f.primary.disabled = state[cfg.key].length === 0; buzz();
        });
        grid.appendChild(g);
      });
      inner.appendChild(grid);
      s.appendChild(inner); s.appendChild(f.node);
      return s;
    },

    chips(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner");
      inner.appendChild(el("h1", "title", em(cfg.title)));
      inner.appendChild(el("p", "sub", cfg.sub));
      const wrap = el("div", "chips");
      const f = footer("Continue", { disabled: state[cfg.key].length === 0 });
      cfg.options.forEach(o => {
        const c = el("button", "chip", `<span class="emo">${o.e}</span>${o.l}`);
        if (state[cfg.key].includes(o.l)) c.classList.add("sel");
        c.addEventListener("click", () => {
          c.classList.toggle("sel"); toggle(cfg.key, o.l);
          f.primary.disabled = state[cfg.key].length === 0; buzz();
        });
        wrap.appendChild(c);
      });
      inner.appendChild(wrap);
      s.appendChild(inner); s.appendChild(f.node);
      return s;
    },

    date(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner");
      inner.appendChild(el("h1", "title", em(cfg.title)));
      inner.appendChild(el("p", "sub", cfg.sub));
      const cal = el("div", "cal");
      inner.appendChild(cal);
      const f = footer("Continue", { disabled: !state[cfg.key] });
      s.appendChild(inner); s.appendChild(f.node);
      const today = new Date(); today.setHours(0,0,0,0);
      let view = new Date(today.getFullYear(), today.getMonth(), 1);
      const MON = ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
      function diffDays(d){ return Math.round((today - d) / 86400000); }
      function draw(){
        cal.innerHTML = "";
        const head = el("div", "cal-head");
        const prev = el("button", "cal-nav", "‹");
        const tit = el("div", "cal-title", `${MON[view.getMonth()]} ${view.getFullYear()}`);
        const nextB = el("button", "cal-nav", "›");
        const atCurrent = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
        nextB.disabled = atCurrent;
        prev.addEventListener("click", () => { view.setMonth(view.getMonth()-1); draw(); buzz(); });
        nextB.addEventListener("click", () => { if (!nextB.disabled){ view.setMonth(view.getMonth()+1); draw(); buzz(); } });
        head.append(prev, tit, nextB);
        cal.appendChild(head);
        const grid = el("div", "cal-grid");
        ["M","T","W","T","F","S","S"].forEach(d => grid.appendChild(el("div", "cal-dow", d)));
        const first = new Date(view.getFullYear(), view.getMonth(), 1);
        let lead = (first.getDay() + 6) % 7;
        const dim = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
        for (let i=0;i<lead;i++) grid.appendChild(el("div","cal-day muted",""));
        for (let d=1; d<=dim; d++){
          const cell = new Date(view.getFullYear(), view.getMonth(), d);
          const b = el("button","cal-day", d);
          if (cell.getTime() === today.getTime()) b.classList.add("today");
          if (cell > today){ b.classList.add("future"); b.disabled = true; }
          if (state[cfg.key] && new Date(state[cfg.key]).getTime() === cell.getTime()) b.classList.add("sel");
          b.addEventListener("click", () => {
            if (cell > today) return;
            grid.querySelectorAll(".cal-day").forEach(x => x.classList.remove("sel"));
            b.classList.add("sel"); state[cfg.key] = cell.toISOString();
            f.primary.disabled = false; buzz(); foot();
          });
          grid.appendChild(b);
        }
        cal.appendChild(grid);
        cal.appendChild(el("div", "cal-foot"));
        foot();
      }
      function foot(){
        const ft = cal.querySelector(".cal-foot");
        if (!ft) return;
        if (state[cfg.key]){
          const dd = diffDays(new Date(state[cfg.key]));
          ft.innerHTML = dd === 0 ? "Started <b>today</b>"
            : `Started <b>${dd} day${dd>1?"s":""} ago</b>`;
        } else ft.innerHTML = "Tap a day above";
      }
      draw();
      return s;
    },

    stepper(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner center");
      inner.appendChild(el("h1", "title", em(cfg.title)));
      inner.appendChild(el("p", "sub", cfg.sub));
      inner.insertAdjacentHTML("beforeend", `
        <div class="stepper">
          <button class="step-btn" data-m="-1" aria-label="Decrease">
            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 12h12" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
          <div class="step-value"><span>${state[cfg.key]}</span><small>${cfg.unit}</small></div>
          <button class="step-btn" data-m="1" aria-label="Increase">
            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
        </div>
        <div class="ruler"></div>
        <button class="btn-text inline" data-unsure>I'm not sure - use the average</button>`);
      const f = footer("Continue");
      s.appendChild(inner); s.appendChild(f.node);
      const sv = inner.querySelector(".step-value");
      const span = sv.querySelector("span");
      const minus = inner.querySelector('[data-m="-1"]');
      const plus = inner.querySelector('[data-m="1"]');
      const ruler = inner.querySelector(".ruler");
      for (let i=0;i<=26;i++){
        const t = el("i"); t.style.left = (i/26*100)+"%";
        t.style.height = (i%5===0?20:10)+"px"; ruler.appendChild(t);
      }
      function set(v){
        state[cfg.key] = Math.min(cfg.max, Math.max(cfg.min, v));
        span.textContent = state[cfg.key];
        minus.disabled = state[cfg.key] <= cfg.min;
        plus.disabled = state[cfg.key] >= cfg.max;
        sv.classList.add("pulse"); setTimeout(() => sv.classList.remove("pulse"), 220);
        buzz();
      }
      minus.addEventListener("click", () => set(state[cfg.key]-1));
      plus.addEventListener("click", () => set(state[cfg.key]+1));
      inner.querySelector("[data-unsure]").addEventListener("click", () => {
        set(cfg.unsure); showToast(`Set to the typical ${cfg.unsure} ${cfg.unit}`);
      });
      set(state[cfg.key]);
      return s;
    },

    /* iOS-style multi-column scroll wheel */
    wheel(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner");
      inner.appendChild(el("h1", "title", em(cfg.title)));
      inner.appendChild(el("p", "sub", cfg.sub));
      const display = el("div", "wheel-display");
      inner.appendChild(display);
      const spacer = el("div"); spacer.style.flex = "1"; inner.appendChild(spacer);
      const picker = el("div", "wheel-picker");
      picker.innerHTML = `<span class="wheel-band"></span>
        <span class="wheel-mask top"></span><span class="wheel-mask bot"></span>`;
      const cols = el("div", "wheel-cols");
      picker.appendChild(cols);
      inner.appendChild(picker);

      /* type-in form (hidden by default) */
      const typeForm = el("div", "wheel-type");
      typeForm.innerHTML = cfg.columns.map(c =>
        `<label class="wt-field">
           <input type="number" inputmode="numeric" min="${c.from}" max="${c.to}"
                  data-key="${c.key}" value="${state[c.key]}">
           <small>${c.label || (c.dot ? "." : "")}</small>
         </label>`).join("") +
        (cfg.suffix ? `<span class="wt-suf">${cfg.suffix}</span>` : "");
      typeForm.style.display = "none";
      inner.appendChild(typeForm);

      const toggle = el("button", "wheel-toggle", "Type in instead");
      inner.appendChild(toggle);

      s.appendChild(inner);
      s.appendChild(footer("Next").node);

      const ITEM = 44;
      function renderDisplay(){
        display.innerHTML = cfg.columns.map(c => {
          const v = state[c.key];
          if (c.dot) return `<small class="dot">.</small><b>${v}</b>`;
          const lab = c.label ? `<small>${c.label}</small>` : "";
          return `<b>${v}</b>${lab}`;
        }).join("") + (cfg.suffix ? `<small class="suf">${cfg.suffix}</small>` : "");
      }
      function markActive(colWrap, activeIdx){
        colWrap.querySelectorAll(".wheel-item").forEach((it, i) => {
          const d = Math.abs(i - activeIdx);
          it.classList.toggle("on", d === 0);
          it.style.opacity = d === 0 ? 1 : Math.max(0.16, 0.6 - d * 0.16);
        });
      }
      const colWraps = [];
      cfg.columns.forEach(c => {
        const colWrap = el("div", "wheel-col");
        const list = el("div", "wheel-list");
        list.appendChild(el("div", "wheel-pad"));
        for (let v = c.from; v <= c.to; v++){
          const it = el("div", "wheel-item", String(v));
          it.addEventListener("click", () =>
            colWrap.scrollTo({ top: (v - c.from) * ITEM, behavior: "smooth" }));
          list.appendChild(it);
        }
        list.appendChild(el("div", "wheel-pad"));
        colWrap.appendChild(list);
        cols.appendChild(colWrap);
        colWraps.push({ wrap: colWrap, col: c });

        colWrap.scrollTop = (state[c.key] - c.from) * ITEM;
        markActive(colWrap, state[c.key] - c.from);

        let raf, st;
        colWrap.addEventListener("scroll", () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const idx = Math.round(colWrap.scrollTop / ITEM);
            const val = Math.min(c.to, Math.max(c.from, c.from + idx));
            if (state[c.key] !== val){ state[c.key] = val; buzz(); renderDisplay(); }
            markActive(colWrap, val - c.from);
          });
          clearTimeout(st);
          st = setTimeout(() => {
            const idx = Math.round(colWrap.scrollTop / ITEM);
            colWrap.scrollTo({ top: idx * ITEM, behavior: "smooth" });
          }, 130);
        }, { passive: true });
      });

      /* type-in handlers */
      let typing = false;
      toggle.addEventListener("click", () => {
        buzz();
        typing = !typing;
        picker.style.display = typing ? "none" : "";
        typeForm.style.display = typing ? "flex" : "none";
        toggle.textContent = typing ? "Use wheel instead" : "Type in instead";
        if (typing){
          typeForm.querySelectorAll("input").forEach(inp => inp.value = state[inp.dataset.key]);
          setTimeout(() => typeForm.querySelector("input").focus(), 80);
        }
      });
      typeForm.querySelectorAll("input").forEach((inp, i) => {
        inp.addEventListener("input", () => {
          const c = cfg.columns[i];
          let v = parseInt(inp.value, 10);
          if (isNaN(v)) return;
          v = Math.min(c.to, Math.max(c.from, v));
          state[c.key] = v;
          renderDisplay();
          const w = colWraps[i].wrap;
          if (w) w.scrollTop = (v - c.from) * ITEM;
        });
        inp.addEventListener("blur", () => {
          const c = cfg.columns[i];
          let v = parseInt(inp.value, 10);
          if (isNaN(v) || v < c.from) v = c.from;
          if (v > c.to) v = c.to;
          inp.value = v; state[c.key] = v; renderDisplay();
        });
      });

      renderDisplay();
      return s;
    },

    /* affirmation interstitial */
    affirm(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner center");
      inner.innerHTML = `
        <div class="affirm-wrap">
          <div class="bubble">${cfg.bubble}<span class="bubble-tail"></span></div>
          <div class="mascot mascot-lg affirm-mascot">
            <div class="mascot-body"><span class="cap"></span>
              <span class="face"><span class="eye"></span><span class="eye r"></span>
              <span class="smile"></span><span class="blush"></span><span class="blush r"></span></span></div>
            <span class="heart h1"></span><span class="heart h2"></span><span class="heart h3"></span>
          </div>
        </div>`;
      s.appendChild(inner);
      s.appendChild(footer(cfg.cta).node);
      return s;
    },

    loading(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner");
      inner.innerHTML = `
        <div class="loader-wrap">
          <div class="orb"><span class="o1"></span><span class="o2"></span><span class="o3"></span><span class="core"></span></div>
          <div class="loader-step"></div>
          <div class="loader-bar"><i></i></div>
          <div class="loader-pct">0%</div>
        </div>`;
      s.appendChild(inner);
      s._run = () => {
        const stepEl = inner.querySelector(".loader-step");
        const bar = inner.querySelector(".loader-bar i");
        const pct = inner.querySelector(".loader-pct");
        let i = 0;
        stepEl.textContent = cfg.steps[0];
        const total = cfg.steps.length;
        const iv = setInterval(() => {
          i++;
          if (i >= total){
            clearInterval(iv);
            bar.style.width = "100%"; pct.textContent = "100%";
            setTimeout(() => go(1), 650);
            return;
          }
          stepEl.style.opacity = 0;
          setTimeout(() => { stepEl.textContent = cfg.steps[i]; stepEl.style.opacity = 1; }, 280);
          const p = Math.round((i / total) * 100);
          bar.style.width = p + "%"; pct.textContent = p + "%";
        }, 1150);
      };
      return s;
    },

    proof(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner");
      const w = el("div", "proof-wrap");
      w.innerHTML = `
        <div class="proof-big">${cfg.big}</div>
        <div class="proof-sub">${cfg.sub}</div>
        <div class="proof-stars">♥ ♥ ♥ ♥ ♥</div>
        <div class="proof-cap">${cfg.cap}</div>
        <div class="proof-quotes">
          ${cfg.quotes.map(q => `<figure class="q ${q.side}"><p>"${q.t}"</p><span>${q.a}</span></figure>`).join("")}
        </div>`;
      inner.appendChild(w);
      s.appendChild(inner);
      s.appendChild(footer("Continue").node);
      return s;
    },

    premium(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner");
      inner.innerHTML = `
        <h1 class="title">${em(cfg.title)}</h1>
        <p class="sub">${cfg.sub}</p>
        <div class="premium-card">
          <span class="glow"></span>
          <span class="badge">7-day free trial</span>
          <h2>Luna<span class="plus">+</span></h2>
          <ul class="feat">
            <li>Advanced cycle &amp; symptom analytics</li>
            <li>Personalized health predictions</li>
            <li>Expert-reviewed content library</li>
            <li class="lock">Symptom trend heatmaps</li>
            <li class="lock">Private mode &amp; secure passcode</li>
          </ul>
          <div class="price-row">
            <div class="price">$0<small> / first week</small></div>
            <div class="price-note">then $8.99/mo · cancel anytime · 90% finish onboarding here</div>
          </div>
        </div>
        <div class="mini-quotes">
          <figure class="review"><blockquote>"I finally understand my body. A genuine turning point."</blockquote>
            <figcaption><span class="av">M</span> Mira · member since 2023</figcaption></figure>
          <figure class="review"><blockquote>"Most accurate predictions I've ever used - it just gets me."</blockquote>
            <figcaption><span class="av">P</span> Priya</figcaption></figure>
        </div>`;
      s.appendChild(inner);
      s.appendChild(footer(cfg.cta, { alt: cfg.alt }).node);
      return s;
    },

    done(cfg){
      const s = el("section", "screen");
      const inner = el("div", "screen-inner center");
      const nm = state.name ? `, ${state.name}` : "";
      const title = cfg.title.replace("|NAME|", nm);
      const score = computeScore();
      inner.innerHTML = `
        <div class="celebrate">
          <div class="mascot mascot-lg"><div class="mascot-body"><span class="cap"></span>
            <span class="face"><span class="eye joy"></span><span class="eye joy r"></span>
            <span class="smile big"></span><span class="blush"></span><span class="blush r"></span></span></div>
            <span class="arm l"></span><span class="arm r"></span></div>
          <span class="confetti c1"></span><span class="confetti c2"></span><span class="confetti c3"></span>
          <span class="confetti c4"></span><span class="confetti c5"></span><span class="confetti c6"></span>
          <span class="ring"></span>
        </div>
        <h1 class="display">${em(title)}</h1>
        <p class="sub">${cfg.sub}</p>
        <div class="score-card">
          <div class="score-ring" style="--p:${score}%"><b>${score}</b></div>
          <div class="score-meta"><strong>Your wellness score</strong>
            <span>A starting baseline - it grows as you track.</span></div>
        </div>`;
      s.appendChild(inner);
      s.appendChild(footer(cfg.cta, {
        onPrimary: () => {
          if (window.LunaStore) window.LunaStore.set("userState", state);
          if (window.LunaApp) window.LunaApp.enter(state);
        }
      }).node);
      requestAnimationFrame(() => {
        const r = inner.querySelector(".score-ring");
        r.style.setProperty("--p", "0%");
        setTimeout(() => r.style.setProperty("--p", score + "%"), 120);
      });
      return s;
    }
  };

  function computeScore(){
    let s = 40;
    s += Math.min(16, state.goals.length * 4);
    s += Math.min(12, state.symptoms.length * 2);
    s += Math.min(9, state.wellnessGoals.length * 3);
    if (state.lastPeriod) s += 7;
    if (state.sleepHours) s += 4;
    if (state.activity) s += 4;
    if (state.reminders.length) s += 4;
    return Math.min(97, s);
  }

  /* ============================================================
     NAVIGATION
     ============================================================ */
  function go(dir){
    const steps = visibleSteps();
    if (dir === 1){
      if (index < steps.length - 1){ history.push(steps[index].id); index++; render("fwd"); }
    } else {
      if (history.length){
        const prevId = history.pop();
        index = steps.findIndex(x => x.id === prevId);
        render("back");
      }
    }
  }

  function render(motion){
    const steps = visibleSteps();
    index = Math.max(0, Math.min(index, steps.length - 1));
    const cfg = steps[index];
    const next = build[cfg.type](cfg);
    next.classList.add("screen");
    if (motion === "back") next.classList.add("back");

    const old = Array.from(stage.children);
    stage.appendChild(next);
    void next.offsetWidth;
    next.classList.add("is-active");
    old.forEach(o => {
      o.classList.remove("is-active");
      o.classList.add("is-prev");
      setTimeout(() => o.remove(), 600);
    });

    const pct = (index / (steps.length - 1)) * 100;
    progressFill.style.width = Math.max(4, pct) + "%";

    const bare = cfg.type === "hero" || cfg.type === "done" ||
                 cfg.type === "loading" || cfg.type === "affirm";
    topbar.classList.toggle("hide", bare);
    backBtn.classList.toggle("invisible", index === 0);
    const noSkip = ["hero","text","loading","proof","premium","done","affirm"].includes(cfg.type);
    skipBtn.classList.toggle("invisible", noSkip);
    // dark theme for question (single) screens
    document.body.classList.toggle("dark-question", cfg.type === "single");

    if (next._focus) setTimeout(next._focus, 460);
    if (next._run) next._run();
  }

  backBtn.addEventListener("click", () => { buzz(); go(-1); });
  skipBtn.addEventListener("click", () => { buzz(); go(1); });

  function openPermission(){ buzz(); permScrim.classList.add("show"); }
  document.getElementById("permAllow").addEventListener("click", () => {
    permScrim.classList.remove("show");
    showToast("Notifications enabled ✦");
    setTimeout(() => go(1), 480);
  });
  document.getElementById("permDeny").addEventListener("click", () => {
    permScrim.classList.remove("show");
    setTimeout(() => go(1), 280);
  });

  let tx = null, ty = null;
  stage.addEventListener("touchstart", e => {
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive:true });
  stage.addEventListener("touchend", e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    const dy = Math.abs(e.changedTouches[0].clientY - ty);
    if (dx > 90 && dy < 60 && index > 0 && !backBtn.classList.contains("invisible")) go(-1);
    tx = ty = null;
  }, { passive:true });

  render("fwd");
})();

/* ============================================================
   Luna - post-onboarding app shell (Home + Settings)
   ============================================================ */
(function () {
  "use strict";
  const shell = document.getElementById("appShell");
  const device = document.querySelector(".device");
  let userState = {};

  const WEEK = ["S","M","T","W","T","F","S"];
  const MON = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];

  function h(tag, cls, html){
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function buzz(){ if (navigator.vibrate) navigator.vibrate(8); }
  function toast(msg){
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- reusable bottom-sheet ---------- */
  let sheetEl = null;
  function closeSheet(immediate){
    if (!sheetEl) return;
    const el = sheetEl; sheetEl = null;
    el.classList.add("is-closing");          // pointer-events:none + excluded from taps
    if (immediate){ el.remove(); return; }
    el.classList.remove("show");
    setTimeout(() => el.remove(), 380);
  }
  function openSheet(title, bodyNode, opts){
    opts = opts || {};
    closeSheet(true);                        // replace instantly, no lingering stale sheet
    const scrim = h("div", "sheet-scrim");
    const panel = h("div", "sheet" + (opts.tall ? " tall" : ""));
    const head = h("div", "sheet-head");
    head.innerHTML = `<span class="sheet-grab"></span>
      <div class="sheet-titlebar"><strong>${title}</strong>
        <button class="sheet-x" aria-label="Close">✕</button></div>`;
    const body = h("div", "sheet-body");
    body.appendChild(bodyNode);
    panel.append(head, body);
    scrim.appendChild(panel);
    shell.appendChild(scrim);
    sheetEl = scrim;
    scrim.addEventListener("click", e => { if (e.target === scrim) { buzz(); closeSheet(); } });
    head.querySelector(".sheet-x").addEventListener("click", () => { buzz(); closeSheet(); });
    // drag-to-dismiss
    let sy = null;
    head.addEventListener("touchstart", e => { sy = e.touches[0].clientY; }, { passive:true });
    head.addEventListener("touchmove", e => {
      if (sy === null) return;
      const dy = e.touches[0].clientY - sy;
      if (dy > 0) panel.style.transform = `translateY(${dy}px)`;
    }, { passive:true });
    head.addEventListener("touchend", e => {
      const dy = e.changedTouches[0].clientY - (sy || 0);
      panel.style.transform = "";
      if (dy > 110){ buzz(); closeSheet(); }
      sy = null;
    }, { passive:true });
    requestAnimationFrame(() => scrim.classList.add("show"));
    return { close: closeSheet, panel };
  }
  /* article-style sheet body from a simple spec */
  function articleBody(paras, cta){
    const w = h("div", "art-body");
    w.innerHTML = paras.map(p => `<p>${p}</p>`).join("");
    if (cta){
      const b = h("button", "pill-btn full", cta);
      b.addEventListener("click", () => { buzz(); toast("Saved to your insights ♡"); closeSheet(); });
      w.appendChild(b);
    }
    return w;
  }
  /* toggle-list sheet body */
  function toggleBody(items){
    const w = h("div", "toggle-body");
    items.forEach(it => {
      const row = h("label", "tg-row");
      row.innerHTML = `<span>${it}</span>
        <span class="switch"><input type="checkbox"><span class="track"></span></span>`;
      row.querySelector("input").addEventListener("change", e => {
        buzz(); toast(it + (e.target.checked ? " · on" : " · off"));
      });
      w.appendChild(row);
    });
    return w;
  }
  /* selectable option list that stores into state-ish + toast */
  function pickBody(options, onPick){
    const w = h("div", "pick-body");
    options.forEach(o => {
      const b = h("button", "opt");
      b.innerHTML = `<span class="lbl">${o}</span>`;
      b.addEventListener("click", () => { buzz(); onPick(o); });
      w.appendChild(b);
    });
    return w;
  }


  /* ---------- date strip ---------- */
  function dateStrip(){
    // Phase definitions, mirrored from PHASES in buildHome (kept inline so
    // this helper works without taking a dependency on buildHome's scope)
    const PHS = [
      { id:"menstrual",  label:"Menstrual",  from:1,  to:5,  color:"var(--rose)",     bg:"var(--rose-soft)" },
      { id:"follicular", label:"Follicular", from:6,  to:13, color:"var(--sage)",     bg:"var(--sage-soft)" },
      { id:"ovulation",  label:"Ovulation",  from:14, to:16, color:"var(--ovul)",     bg:"var(--ovul-soft)" },
      { id:"luteal",     label:"Luteal",     from:17, to:99, color:"var(--lilac)",    bg:"var(--lavender)"  }
    ];
    function phaseForDay(d){ return PHS.find(p => d >= p.from && d <= p.to) || PHS[3]; }

    const today = new Date(); today.setHours(0,0,0,0);
    const us = (window.LunaStore && window.LunaStore.get("userState")) || {};
    const logs = (window.LunaStore && window.LunaStore.get("periodLogs", [])) || [];
    const len = Number(us.cycleLength) || 28;
    const perLen = Number(us.periodLength) || 5;

    let hasData = false, curDay = 0, daysToNextPeriod = 0;
    if (logs.length){
      hasData = true;
      const last = new Date(logs[logs.length-1].start + "T00:00:00");
      const daysSince = Math.max(0, Math.floor((today - last) / 86400000));
      curDay = (daysSince % len) + 1;
      daysToNextPeriod = len - curDay + 1;
    }

    const curPhase = hasData ? phaseForDay(curDay) : null;
    const wrap = h("section", "cycle-forecast" + (hasData ? "" : " is-empty"));

    /* HEAD ROW */
    const head = `
      <div class="cf-head">
        <div class="cf-loc">
          <strong>Today</strong>
          <span class="cf-date-eyebrow">${MON[today.getMonth()]} ${today.getDate()}</span>
        </div>
        ${hasData ? `
        <div class="cf-phase-tag" style="--ph:${curPhase.color};--phbg:${curPhase.bg}">
          <i class="cf-dot"></i>${curPhase.label}
        </div>` : `
        <button class="cf-cta-mini" id="cfLogStart">＋ Log period</button>`}
      </div>`;

    /* PRIMARY STAT ROW */
    const primary = `
      <div class="cf-main">
        <div class="cf-day-block">
          <span class="cf-day-eyebrow">CYCLE DAY</span>
          <div class="cf-day-line">
            <span class="cf-num">${hasData ? curDay : " - "}</span>
            <span class="cf-of">of ${len}</span>
          </div>
        </div>
        <div class="cf-summary">
          ${hasData ? `
            <span class="cf-phase-icon" style="background:${curPhase.bg};color:${curPhase.color}">
              ${curPhase.id === "menstrual" ? "♥" : curPhase.id === "follicular" ? "✿" : curPhase.id === "ovulation" ? "✦" : "☾"}
            </span>
            <div class="cf-sumtxt">
              <strong>Next period</strong>
              <span>in ${daysToNextPeriod} day${daysToNextPeriod === 1 ? "" : "s"}</span>
            </div>
          ` : `
            <span class="cf-phase-icon empty">·</span>
            <div class="cf-sumtxt">
              <strong>No data yet</strong>
              <span>Log a period to predict</span>
            </div>
          `}
        </div>
      </div>`;

    /* FORECAST ROW - 7 day cells */
    const cells = Array.from({length: 7}).map((_, i) => {
      const d = new Date(today); d.setDate(today.getDate() + i);
      const isToday = i === 0;
      const dow = WEEK[d.getDay()].slice(0,3).toUpperCase();
      const dayOfMonth = d.getDate();
      // compute cycle day for this date (only meaningful if hasData)
      let cycleDay = 0, phase = null, isPredictedPeriod = false, isOvulationPeak = false;
      if (hasData){
        cycleDay = ((curDay - 1 + i) % len) + 1;
        phase = phaseForDay(cycleDay);
        isPredictedPeriod = (cycleDay >= 1 && cycleDay <= perLen) && i > 0;
        isOvulationPeak = cycleDay === 14;
      }
      const phaseColor = phase ? phase.color : "var(--line)";
      const phaseBg = phase ? phase.bg : "transparent";
      const icon = phase
        ? (phase.id === "menstrual" ? (isPredictedPeriod ? "◇" : "♥")
          : phase.id === "follicular" ? "✿"
          : phase.id === "ovulation" ? (isOvulationPeak ? "✦" : "○")
          : "☾")
        : "·";
      return `
        <button class="cf-cell${isToday ? " is-today" : ""}" data-offset="${i}"
          style="--ph:${phaseColor};--phbg:${phaseBg}">
          <span class="cf-cell-dow">${isToday ? "TODAY" : dow}</span>
          <span class="cf-cell-num">${dayOfMonth}</span>
          <span class="cf-cell-icon" style="${isPredictedPeriod ? 'border:1.5px dashed var(--rose);background:transparent;color:var(--rose);' : ''}">${icon}</span>
          <span class="cf-cell-day">${hasData ? "D" + cycleDay : " - "}</span>
        </button>`;
    }).join("");

    wrap.innerHTML = `${head}${primary}<div class="cf-strip">${cells}</div>`;
    return wrap;
  }

  /* ---------- HOME (Today) ---------- */
  function buildHome(){
    const today = new Date();
    const view = h("div", "app-view is-active");
    view.dataset.tab = "today";

    /* sticky top */
    const top = h("header", "app-top");
    top.innerHTML = `
      <button class="hdr-btn" id="openSettings" aria-label="Settings">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19.4 13.5a1 1 0 010-3l1.1-.6-1.4-2.4-1.2.3a1 1 0 01-1.5-.9V5.5L13.7 4.3l-.7 1a1 1 0 01-1.7 0l-.7-1L7.9 5.5v1.4a1 1 0 01-1.5.9l-1.2-.3-1.4 2.4 1.1.6a1 1 0 010 3l-1.1.6 1.4 2.4 1.2-.3a1 1 0 011.5.9V19l2.7 1.2.7-1a1 1 0 011.7 0l.7 1 2.7-1.2v-1.4a1 1 0 011.5-.9l1.2.3 1.4-2.4-1.1-.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        <span class="hdr-dot" id="settingsDot"></span>
      </button>
      <div class="app-date center">
        <strong>${MON[today.getMonth()]} ${today.getDate()}</strong>
      </div>
      <button class="hdr-btn" id="openCalendar" aria-label="Calendar &amp; reminders">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 3a5 5 0 00-5 5v4l-1.6 2.2a1 1 0 00.8 1.6h11.6a1 1 0 00.8-1.6L17 12V8a5 5 0 00-5-5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10.2 18.5a2 2 0 003.6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>`;
    view.appendChild(top);

    const scroll = h("div", "app-scroll");

    scroll.appendChild(dateStrip());
    // wire the empty-state "Log period" mini-CTA + cell taps
    const cfLog = scroll.querySelector("#cfLogStart");
    if (cfLog) cfLog.addEventListener("click", () => { buzz(); openPeriodLogger(); });
    scroll.querySelectorAll(".cf-cell").forEach(cell => {
      cell.addEventListener("click", () => { buzz(); openCalendar(); });
    });

    /* notifications banner */
    const notifWrap = h("div", "notif-wrap");
    function renderNotifs(){
      notifWrap.innerHTML = "";
      const us = (window.LunaStore && window.LunaStore.get("userState")) || {};
      const reminders = us.reminders || [];
      const logs = (window.LunaStore && window.LunaStore.get("periodLogs", [])) || [];
      const cycLen = Number(us.cycleLength) || 28;
      const todayKey = window.LunaStore ? window.LunaStore.todayKey() : "";
      const dismissed = (window.LunaStore && window.LunaStore.get("notifDismissed:" + todayKey, [])) || [];
      const banners = [];
      // 1. period coming soon
      if (logs.length && reminders.some(r => /period/i.test(r))){
        const last = new Date(logs[logs.length-1].start + "T00:00:00");
        const today = new Date(); today.setHours(0,0,0,0);
        const daysSince = Math.floor((today - last) / 86400000);
        const daysUntil = cycLen - daysSince;
        if (daysUntil >= 0 && daysUntil <= 3 && !dismissed.includes("period")){
          banners.push({ id:"period", ic:"●",
            text: daysUntil === 0 ? "Your period is expected today" :
                  daysUntil === 1 ? "Your period is expected tomorrow" :
                  `Your period is expected in ${daysUntil} days`,
            tone: "rose" });
        }
      }
      // 2. check-in nudge (only after midday)
      const hour = new Date().getHours();
      const ciKey = "checkin:" + todayKey;
      const hasCheckedIn = window.LunaStore && window.LunaStore.get(ciKey);
      if (hour >= 12 && !hasCheckedIn && !dismissed.includes("checkin")){
        banners.push({ id:"checkin", ic:"✦", text:"Quick check-in for today?", tone:"sage" });
      }
      banners.forEach(b => {
        const el = h("div", "notif " + b.tone);
        el.innerHTML = `<span class="notif-ic">${b.ic}</span>
          <span class="notif-txt">${b.text}</span>
          <button class="notif-x" aria-label="Dismiss">✕</button>`;
        el.querySelector(".notif-x").addEventListener("click", e => {
          e.stopPropagation(); buzz();
          const d = window.LunaStore.get("notifDismissed:" + todayKey, []) || [];
          d.push(b.id);
          window.LunaStore.set("notifDismissed:" + todayKey, d);
          el.style.transition = "opacity .25s, transform .3s";
          el.style.opacity = "0"; el.style.transform = "translateY(-8px)";
          setTimeout(() => el.remove(), 300);
        });
        el.addEventListener("click", () => {
          buzz();
          if (b.id === "period") openPeriodLogger();
          else if (b.id === "checkin"){
            ci.scrollIntoView({ behavior:"smooth", block:"center" });
          }
        });
        notifWrap.appendChild(el);
      });
    }
    scroll.appendChild(notifWrap);

    /* period log hero - empty / orbit / period states cross-fade */
    const hero = h("section", "log-hero");
    hero.innerHTML = `
      <div class="hero-state default">
        <!-- shared meadow backdrop, sits at the bottom of the hero -->
        <div class="meadow-art" aria-hidden="true">
          <svg viewBox="0 0 360 220" preserveAspectRatio="xMidYMax slice">
            <defs>
              <radialGradient id="meadowGlow" cx="50%" cy="100%" r="80%">
                <stop offset="0%" stop-color="#D4E89A" stop-opacity="0.85"/>
                <stop offset="50%" stop-color="#E5E89E" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#FAFAE0" stop-opacity="0"/>
              </radialGradient>
              <filter id="softBlur"><feGaussianBlur stdDeviation="7"/></filter>
            </defs>
            <!-- meadow glow base -->
            <ellipse cx="180" cy="225" rx="320" ry="100" fill="url(#meadowGlow)"/>
            <!-- watercolor wash blobs (greens) -->
            <ellipse cx="40" cy="205" rx="100" ry="48" fill="#A8C97A" opacity="0.45" filter="url(#softBlur)"/>
            <ellipse cx="170" cy="200" rx="120" ry="44" fill="#C5D88A" opacity="0.5" filter="url(#softBlur)"/>
            <ellipse cx="300" cy="205" rx="110" ry="50" fill="#A8C97A" opacity="0.45" filter="url(#softBlur)"/>
            <ellipse cx="220" cy="215" rx="100" ry="36" fill="#7FA68E" opacity="0.32" filter="url(#softBlur)"/>
            <ellipse cx="90" cy="218" rx="80" ry="30" fill="#5F8E72" opacity="0.28" filter="url(#softBlur)"/>

            <!-- far back grass (light, soft) -->
            <g stroke="#A8C97A" fill="none" stroke-width="1.1" stroke-linecap="round" opacity="0.5">
              ${Array.from({length:24}, (_,i) => {
                const x = 8 + i * 15 + (i%2 ? 3 : 0);
                const h = 30 + (i*37 % 22);
                const d = ((i*0.43) % 6).toFixed(2);
                return `<g class="sway sway-soft" style="transform-origin:${x}px 220px;animation-delay:-${d}s">
                  <path d="M ${x} 220 Q ${x+3} ${220-h+5} ${x+1} ${220-h}"/>
                </g>`;
              }).join("")}
            </g>
            <!-- mid grass (medium green) -->
            <g stroke="#7FA68E" fill="none" stroke-width="1.5" stroke-linecap="round" opacity="0.65">
              ${Array.from({length:18}, (_,i) => {
                const x = 18 + i * 20 + (i%3 ? 5 : 0);
                const h = 45 + (i*51 % 30);
                const d = ((i*0.61) % 7).toFixed(2);
                return `<g class="sway sway-mid" style="transform-origin:${x}px 220px;animation-delay:-${d}s">
                  <path d="M ${x} 220 Q ${x+4} ${220-h+5} ${x+2} ${220-h}"/>
                </g>`;
              }).join("")}
            </g>
            <!-- front grass (deep, sharp) -->
            <g stroke="#3F6B53" fill="none" stroke-width="1.8" stroke-linecap="round" opacity="0.7">
              ${[
                [25,55],[55,70],[88,60],[122,80],[155,75],[188,90],[218,72],[248,85],[278,68],[310,82],[340,65]
              ].map(([x,h], i) => {
                const d = ((i*0.85) % 8).toFixed(2);
                return `<g class="sway sway-strong" style="transform-origin:${x}px 220px;animation-delay:-${d}s">
                  <path d="M ${x} 220 Q ${x+5} ${220-h+8} ${x+3} ${220-h}"/>
                </g>`;
              }).join("")}
            </g>

            <!-- background daisies (small, faded) -->
            ${[
              [15,180,0.55],[55,175,0.6],[95,182,0.55],[130,178,0.6],[165,180,0.55],
              [205,175,0.6],[235,180,0.55],[270,175,0.6],[305,178,0.6],[340,182,0.55]
            ].map(([x,y,s], i) => {
              const d = ((i*0.93) % 7).toFixed(2);
              return `
              <g class="sway sway-flower" style="transform-origin:${x}px ${y+4}px;animation-delay:-${d}s">
                <g transform="translate(${x} ${y}) scale(${s})" opacity="0.75">
                  ${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-7" rx="2.4" ry="5.4" fill="#FAFAF5" transform="rotate(${a})"/>`).join("")}
                  <circle r="2.2" fill="#E8B23A"/>
                </g>
              </g>`;
            }).join("")}

            <!-- pink wildflowers (cosmos) -->
            ${[
              [30,195,0.85],[75,200,0.95],[110,205,0.85],[145,200,0.9],
              [185,205,0.85],[225,200,0.9],[260,205,0.8],[295,200,0.9],[330,205,0.8]
            ].map(([x,y,s], i) => {
              const d = ((i*1.13) % 8).toFixed(2);
              return `
              <g class="sway sway-flower" style="transform-origin:${x}px ${y+4}px;animation-delay:-${d}s">
                <g transform="translate(${x} ${y}) scale(${s})">
                  ${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-6" rx="2.6" ry="5.5" fill="#F2A8C0" transform="rotate(${a})"/>`).join("")}
                  <circle r="2.2" fill="#C26A88"/>
                </g>
              </g>`;
            }).join("")}

            <!-- yellow buttercups -->
            ${[
              [22,210,0.7],[65,212,0.65],[100,215,0.7],[138,213,0.6],
              [172,212,0.7],[210,215,0.65],[245,210,0.7],[282,215,0.6],[318,210,0.7]
            ].map(([x,y,s], i) => {
              const d = ((i*0.77) % 6).toFixed(2);
              return `
              <g class="sway sway-flower" style="transform-origin:${x}px ${y+4}px;animation-delay:-${d}s">
                <g transform="translate(${x} ${y}) scale(${s})">
                  ${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-5" rx="2.3" ry="5" fill="#F4C95D" transform="rotate(${a})"/>`).join("")}
                  <circle r="1.8" fill="#D89B2A"/>
                </g>
              </g>`;
            }).join("")}

            <!-- white daisies (foreground, larger) -->
            ${[
              [40,200,1.1],[88,196,1.0],[125,198,1.05],[160,195,1.1],
              [195,198,1.0],[235,195,1.05],[270,200,1.0],[305,196,1.05],[345,200,1.0]
            ].map(([x,y,s], i) => {
              const d = ((i*1.31) % 9).toFixed(2);
              return `
              <g class="sway sway-flower" style="transform-origin:${x}px ${y+4}px;animation-delay:-${d}s">
                <g transform="translate(${x} ${y}) scale(${s})">
                  ${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-7" rx="2.8" ry="6" fill="#FFFFFF" transform="rotate(${a})"/>`).join("")}
                  <circle r="2.6" fill="#F0C147"/>
                </g>
              </g>`;
            }).join("")}

            <!-- powder-blue forget-me-nots -->
            ${[
              [50,215,0.5],[120,218,0.55],[180,217,0.5],[252,217,0.55],[330,218,0.5]
            ].map(([x,y,s], i) => {
              const d = ((i*0.57) % 5).toFixed(2);
              return `
              <g class="sway sway-flower" style="transform-origin:${x}px ${y+3}px;animation-delay:-${d}s">
                <g transform="translate(${x} ${y}) scale(${s})">
                  ${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-5" rx="2.2" ry="4.6" fill="#9DB4D8" transform="rotate(${a})"/>`).join("")}
                  <circle r="1.4" fill="#F4C95D"/>
                </g>
              </g>`;
            }).join("")}

            <!-- foreground tiny daisies -->
            ${[
              [12,215,0.45],[78,219,0.5],[148,219,0.45],[218,219,0.5],[288,219,0.45],[352,215,0.5]
            ].map(([x,y,s], i) => {
              const d = ((i*1.17) % 7).toFixed(2);
              return `
              <g class="sway sway-flower" style="transform-origin:${x}px ${y+3}px;animation-delay:-${d}s">
                <g transform="translate(${x} ${y}) scale(${s})">
                  ${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-7" rx="2.6" ry="5.6" fill="#FFFFFF" transform="rotate(${a})"/>`).join("")}
                  <circle r="2.3" fill="#F0C147"/>
                </g>
              </g>`;
            }).join("")}
          </svg>
        </div>

        <!-- floating gift bubble (top-right) -->
        <button class="hero-tip-bubble" id="tipBubble" aria-label="Today's tip">
          <svg class="bubble-glyph" viewBox="0 0 24 24" width="20" height="20">
            <rect x="4.5" y="11" width="15" height="9" rx="1.2" fill="#F4A8C2"/>
            <rect x="4" y="9" width="16" height="3" rx="1" fill="#F2A0BE"/>
            <rect x="11" y="9" width="2" height="11" fill="#FCE6CC"/>
            <rect x="4" y="10.5" width="16" height="1.6" fill="#FCE6CC"/>
            <ellipse cx="10" cy="8.4" rx="2.2" ry="1.6" fill="#FCE6CC" transform="rotate(-25 10 8.4)"/>
            <ellipse cx="14" cy="8.4" rx="2.2" ry="1.6" fill="#FCE6CC" transform="rotate(25 14 8.4)"/>
            <circle cx="12" cy="8.5" r="0.8" fill="#F4A8C2"/>
          </svg>
          <span class="bubble-dot"></span>
        </button>

        <!-- EMPTY state: headline + single CTA -->
        <div class="hero-empty" id="heroEmpty">
          <h1 class="hero-headline">Please enter your period<br>for <em>next prediction</em></h1>
          <button class="hero-cta" id="logPeriodEmpty">Period Starts</button>
        </div>

        <!-- ORBIT state: signature cycle viz -->
        <div class="hero-orbit" id="heroOrbit" style="display:none">
          <div class="orbit-wrap">
            <svg class="orbit" viewBox="0 0 280 280" width="240" height="240" aria-hidden="true">
              <defs>
                <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <circle id="orbitBase" cx="140" cy="140" r="112" fill="none"
                stroke="var(--line)" stroke-width="2" stroke-dasharray="1 6" stroke-linecap="round" opacity="0.55"/>
              <g id="orbitArcs" transform="rotate(-90 140 140)"></g>
              <g id="orbitTicks" transform="rotate(-90 140 140)"></g>
              <circle id="orbitDot" cx="140" cy="28" r="9" fill="var(--rose)"
                stroke="#fff" stroke-width="3" filter="url(#dotGlow)" style="display:none"/>
            </svg>
            <div class="orbit-center">
              <span class="orbit-eyebrow" id="orbitEyebrow">Cycle</span>
              <span class="orbit-num" id="orbitNum"> - </span>
              <span class="orbit-phase" id="orbitPhase">Log to begin</span>
            </div>
          </div>
          <p class="orbit-sub" id="orbitSub">Log when your period starts and Luna draws the rest.</p>
          <button class="hero-cta small" id="logPeriod">Edit period dates</button>
        </div>
      </div>
      <div class="hero-state period">
        <div class="period-glow"></div>
        <h2>Period day <span id="periodDayNum">1</span></h2>
        <button class="period-tip" id="periodTip">
          <span>Discover what's happening in your body today</span>
          <i>›</i>
        </button>
        <button class="pill-btn ghost-fill" id="editPeriod">Edit period dates</button>
      </div>`;
    scroll.appendChild(hero);

    /* daily check-in */
    const ci = h("section", "checkin");
    ci.innerHTML = `
      <div class="ci-head">
        <span class="ci-eyebrow">DAILY CHECK-IN</span>
        <span class="ci-state" id="ciState"></span>
      </div>
      <div class="ci-row" id="ciRow">
        ${[
          ["awful","😞"], ["low","😕"], ["okay","🙂"],
          ["good","😊"], ["great","🤩"]
        ].map(([id,e]) => `<button class="ci-mood" data-mood="${id}" aria-label="${id}">
          <span>${e}</span></button>`).join("")}
      </div>`;
    function refreshCheckin(){
      const k = "checkin:" + (window.LunaStore ? window.LunaStore.todayKey() : "");
      const saved = window.LunaStore && window.LunaStore.get(k);
      const state = ci.querySelector("#ciState");
      ci.querySelectorAll(".ci-mood").forEach(b => b.classList.remove("on"));
      if (saved && saved.mood){
        ci.querySelector(`.ci-mood[data-mood="${saved.mood}"]`).classList.add("on");
        state.textContent = "Logged · tap to change";
        state.className = "ci-state done";
      } else {
        state.textContent = "How are you feeling?";
        state.className = "ci-state";
      }
    }
    ci.querySelectorAll(".ci-mood").forEach(b => {
      b.addEventListener("click", () => {
        buzz();
        const mood = b.dataset.mood;
        const k = "checkin:" + window.LunaStore.todayKey();
        window.LunaStore.set(k, { mood: mood, ts: Date.now() });
        refreshCheckin();
        toast("Checked in for today ♡");
      });
    });
    scroll.appendChild(ci);
    refreshCheckin();

    /* daily insights */
    scroll.appendChild(sectionTitle("My daily insights", "Today"));
    const rail = h("div", "rail");
    [
      { t: "Log your<br>symptoms", k: "add", c: "rose", id: "logsym" },
      { t: "Coping with<br>cycle anxiety", k: "🧘‍♀️", c: "lav", id: "anx" },
      { t: "PMS or<br>something else?", k: "🍫", c: "peach", id: "pms" },
      { t: "3 reasons<br>to log daily", k: "📊", c: "mint", id: "why" }
    ].forEach(card => {
      const el = h("button", "rail-card " + card.c);
      el.innerHTML = card.k === "add"
        ? `<span class="rc-txt">${card.t}</span><span class="rc-add">＋</span>`
        : `<span class="rc-emo">${card.k}</span><span class="rc-txt">${card.t}</span>`;
      el.addEventListener("click", () => {
        buzz();
        if (card.id === "logsym") return openSymptomLogger();
        const content = {
          anx: { title: "Coping with cycle anxiety", p: [
            "Worry tends to spike in the days before your period - that's hormones talking, not a flaw in you.",
            "Try this: name the feeling, take five slow breaths, and note it in Luna. Patterns become far less scary once you can see them.",
            "Over a few cycles, Luna will show you exactly when this tends to hit, so you can plan softness into those days."]},
          pms: { title: "PMS or something else?", p: [
            "PMS usually arrives in a predictable window and eases once your period starts.",
            "If symptoms are intense, last most of the month, or disrupt daily life, it's worth a conversation with a clinician.",
            "Logging consistently is the fastest way to tell the difference - and to bring real data to that conversation."]},
          why: { title: "3 reasons to log daily", p: [
            "1 · Accuracy. Each entry sharpens your predictions for periods and fertile windows.",
            "2 · Patterns. Mood, skin, sleep and energy reveal a rhythm once there's enough data.",
            "3 · Confidence. Walking into an appointment with a clear record changes the whole conversation."]}
        }[card.id];
        openSheet(content.title, articleBody(content.p, "Got it"));
      });
      rail.appendChild(el);
    });
    scroll.appendChild(rail);

    /* During your period - hidden by default, revealed in period mode */
    const dpy = h("section", "panel during-period");
    dpy.innerHTML = `
      <div class="panel-head"><h3>During your period</h3></div>
      <article class="dpy-card" id="dpyCramps">
        <div class="dpy-art">
          <span class="dpy-blob a"></span>
          <span class="dpy-blob b"></span>
          <span class="dpy-blob c"></span>
        </div>
        <div class="dpy-body">
          <h3>Coping with <em>cramps</em></h3>
          <div class="dpy-meta"><span class="dpy-bulb">💡</span><small>Quick pain relief tips</small></div>
        </div>
      </article>`;
    dpy.querySelector("#dpyCramps").addEventListener("click", () => {
      buzz();
      openSheet("Coping with cramps", articleBody([
        "Cramps happen when the uterus contracts to shed its lining. Warmth, gentle movement and a couple of trusted habits can take the edge off.",
        "Try this stack: a warm pack on the lower belly for 15 minutes, slow nasal breathing, and a small magnesium-rich snack (think pumpkin seeds, dark chocolate, banana).",
        "If pain is sharp, sudden, or keeps you off your feet, it's worth a chat with a clinician - bring your Luna log."
      ], "Log how I'm feeling"));
    });
    scroll.appendChild(dpy);

    /* suggested */
    scroll.appendChild(sectionTitle("Suggested for you"));
    const sug = h("article", "feature-card");
    sug.innerHTML = `
      <div class="fc-body">
        <span class="fc-eyebrow">Decode your body</span>
        <h3>Not sure what your symptoms mean?</h3>
        <ul class="fc-list">
          <li>Read the early signs</li>
          <li>Other reasons you might feel off</li>
        </ul>
        <button class="ghost-pill" id="stopGuessing">Stop guessing</button>
      </div>
      <div class="fc-art"><span class="fc-blob"></span><span class="fc-blob b2"></span></div>`;
    sug.querySelector("#stopGuessing").addEventListener("click", () => {
      buzz();
      openSheet("Decode your body", articleBody([
        "Feeling \"off\" is real information. The trick is turning it into a pattern instead of a guess.",
        "Pick the symptoms below that match how you feel today and Luna will start connecting them to your cycle phase.",
        "Most people see a clear pattern emerge within two cycles of consistent logging."
      ], "Log how I feel"));
    });
    scroll.appendChild(sug);

    /* explore */
    scroll.appendChild(sectionTitle("Explore insights"));
    const exp = h("div", "explore-grid");
    [
      { t: "PMS or early pregnancy? How to tell", m: "6 min read", c: "rose", p: [
        "Both can bring tender breasts, fatigue and mood shifts - which is exactly why guessing is so hard.",
        "The clearest tell is timing: PMS eases when your period arrives. If your period is late and symptoms continue, that's the moment a test gives real clarity.",
        "Logging symptoms daily means you'll spot the divergence early instead of spiralling."] },
      { t: "7 gentle ways to ease cramps", m: "9 min read", c: "lav", p: [
        "Heat first: a warm pack on the lower belly relaxes the muscle that's doing all the cramping.",
        "Gentle movement, magnesium-rich food, hydration and slow breathing all measurably help for many people.",
        "Track which of these actually works for you - your body's answer matters more than any list."] },
      { t: "What a healthy cycle looks like", m: "7 min read", c: "peach", p: [
        "\"Normal\" is a range, not a single number - cycles anywhere from 21 to 35 days can be perfectly healthy.",
        "What matters more is your personal baseline and whether it changes suddenly.",
        "That's the whole point of tracking: Luna learns your normal so it can flag what isn't."] }
    ].forEach(e => {
      const c = h("button", "explore-card");
      c.innerHTML = `<span class="ec-thumb ${e.c}"></span>
        <span class="ec-title">${e.t}</span><span class="ec-meta">${e.m}</span>`;
      c.addEventListener("click", () => { buzz(); openSheet(e.t, articleBody(e.p, "Save for later"), { tall:true }); });
      exp.appendChild(c);
    });
    scroll.appendChild(exp);

    /* symptom checker */
    const sc = h("section", "panel");
    sc.innerHTML = `
      <div class="panel-head"><h3>Symptom checker</h3><button class="see-all">See all ›</button></div>
      <p class="panel-p">Patterns in your cycle can hint at things worth a closer look. A 5-minute check beats months of wondering.</p>
      <div class="sc-card">
        <div class="sc-row"><span class="sc-ic">🩺</span>
          <div><strong>Quick self-assessment</strong><small>About 5 minutes</small></div></div>
        <button class="pill-btn full" id="checkSymptoms">Check your symptoms</button>
        <p class="sc-note">Luna isn't a diagnostic tool - it helps you ask better questions.</p>
      </div>`;
    sc.querySelector("#checkSymptoms").addEventListener("click", () => { buzz(); openSelfCheck(); });
    sc.querySelector(".see-all").addEventListener("click", () => { buzz(); openSelfCheck(); });
    scroll.appendChild(sc);

    /* my cycles */
    const cyc = h("section", "panel");
    cyc.innerHTML = `
      <div class="panel-head"><h3>My cycles</h3></div>
      <div class="cyc-card">
        <p class="panel-p" id="cycMsg">The more you share, the smarter Luna gets. Log 2+ periods for a full analysis of your recent cycles.</p>
        <div class="cyc-stats">
          <div class="cyc-row"><span>Previous cycle length</span><span class="badge-stat warn" id="st1"> - </span></div>
          <div class="cyc-row"><span>Previous period length</span><span class="badge-stat ok" id="st2"> - </span></div>
          <div class="cyc-row"><span>Cycle variation</span><span class="badge-stat warn" id="st3"> - </span></div>
        </div>
        <button class="pill-btn full ghost-fill" id="logRecent">Log recent periods</button>
      </div>`;
    cyc.querySelector("#logRecent").addEventListener("click", () => { buzz(); openPeriodLogger(); });
    scroll.appendChild(cyc);

    /* symptom patterns */
    const pat = h("section", "panel");
    pat.innerHTML = `
      <div class="panel-head"><h3>My symptom patterns</h3></div>
      <p class="panel-p">Log how you feel and Luna surfaces patterns across cycles - reviewed with medical experts.</p>
      <div class="pattern-card">
        <div class="pat-grid">${Array.from({length:42}).map((_,i)=>`<span class="pat-dot ${i%7===0?'on':''}${i%9===0?' hi':''}"></span>`).join("")}</div>
        <button class="link-btn" id="logSymp">＋ Log symptoms</button>
      </div>`;
    pat.querySelector("#logSymp").addEventListener("click", () => { buzz(); openSymptomLogger(); });
    scroll.appendChild(pat);

    /* plan */
    const plan = h("section", "panel");
    plan.innerHTML = `
      <div class="panel-head"><h3>Choose your plan</h3></div>
      <label class="trial-row">
        <span id="trialLabel">Not sure yet? Enable a free trial.</span>
        <span class="switch"><input type="checkbox" id="trialToggle"><span class="track"></span></span>
      </label>
      <button class="plan-card sel" data-plan="year">
        <span class="plan-flag">Save 66%</span>
        <span class="plan-name">Yearly<small>12 mo · $79</small></span>
        <span class="plan-price">$6.58<small>/mo</small></span>
      </button>
      <button class="plan-card" data-plan="month">
        <span class="plan-name">Monthly</span>
        <span class="plan-price">$18<small>/mo</small></span>
      </button>
      <button class="pill-btn full" id="planContinue">Continue</button>`;
    let chosenPlan = "year";
    plan.querySelectorAll(".plan-card").forEach(p => {
      p.addEventListener("click", () => {
        plan.querySelectorAll(".plan-card").forEach(x => x.classList.remove("sel"));
        p.classList.add("sel"); chosenPlan = p.dataset.plan; buzz();
      });
    });
    plan.querySelector("#trialToggle").addEventListener("change", e => {
      buzz();
      plan.querySelector("#trialLabel").textContent =
        e.target.checked ? "Free trial enabled - 7 days on us." : "Not sure yet? Enable a free trial.";
    });
    plan.querySelector("#planContinue").addEventListener("click", () => {
      buzz();
      const trial = plan.querySelector("#trialToggle").checked;
      const body = h("div", "art-body");
      body.innerHTML = `<p><strong>${chosenPlan === "year" ? "Yearly · $79/yr" : "Monthly · $18/mo"}</strong></p>
        <p>${trial ? "Your 7-day free trial starts today. We'll remind you 2 days before it ends - cancel anytime, no charge." :
        "You can cancel anytime from Settings before your next billing date."}</p>
        <p style="color:var(--ink-soft);font-size:13px">This is a prototype - no payment is taken.</p>`;
      const cta = h("button", "pill-btn full", "Confirm");
      cta.addEventListener("click", () => { buzz(); toast("You're on Luna+ ✦"); closeSheet(); });
      body.appendChild(cta);
      openSheet("Confirm your plan", body);
    });
    scroll.appendChild(plan);

    scroll.appendChild(h("div", "scroll-end", "Track your cycle like a pro ✦"));
    view.appendChild(scroll);

    /* ---- functional helpers bound to this home view ---- */
    let logCount = 0;
    let periodActive = false;
    function enterPeriodMode(dayOffset){
      // the day the user picked IS day 1 of the period.
      periodActive = true;
      view.querySelector("#periodDayNum").textContent = 1;
      // mark today as period day, and the next 1-2 cells as predicted
      const strip = view.querySelector(".date-strip");
      strip.querySelectorAll(".ds-cell").forEach(c => {
        c.classList.remove("is-period","is-predicted");
        const off = parseInt(c.dataset.offset, 10);
        if (off === 0) c.classList.add("is-period");
        else if (off > 0 && off <= 2) c.classList.add("is-predicted");
      });
      // smooth class flip on the view triggers all the CSS transitions
      requestAnimationFrame(() => view.classList.add("is-period"));
      // re-render orbit (in case user logs from period mode again)
      if (typeof refreshOrbit === "function") refreshOrbit();
    }
    function exitPeriodMode(){
      periodActive = false;
      view.classList.remove("is-period");
      view.querySelectorAll(".date-strip .ds-cell").forEach(c =>
        c.classList.remove("is-period","is-predicted"));
    }
    function refreshCycle(){
      const msg = view.querySelector("#cycMsg");
      if (logCount === 0) return;
      if (logCount === 1){
        msg.textContent = "Nice start ♡ Log one more period and Luna can analyze your cycle.";
        view.querySelector("#st1").textContent = "Pending";
        view.querySelector("#st2").textContent = "28 days";
        view.querySelector("#st2").className = "badge-stat ok";
        view.querySelector("#st3").textContent = "Pending";
      } else {
        msg.textContent = "Enough data - here's your recent cycle analysis.";
        const c1 = view.querySelector("#st1"), c3 = view.querySelector("#st3");
        c1.textContent = "29 days"; c1.className = "badge-stat ok";
        view.querySelector("#st2").textContent = "5 days";
        c3.textContent = "Low"; c3.className = "badge-stat ok";
      }
    }
    function openPeriodLogger(){
      const body = h("div", "logger-body");
      body.innerHTML = `<p class="lg-p">Pick the day your period started.</p>`;
      const grid = h("div", "lg-grid");
      const today = new Date();
      let pickedOffset = null;
      for (let i = 27; i >= 0; i--){
        const d = new Date(today); d.setDate(today.getDate() - i);
        const b = h("button", "lg-day");
        b.dataset.daysAgo = i;
        b.innerHTML = `<small>${WEEK[d.getDay()]}</small><b>${d.getDate()}</b>`;
        b.addEventListener("click", () => {
          grid.querySelectorAll(".lg-day").forEach(x => x.classList.remove("on"));
          b.classList.add("on"); pickedOffset = i; buzz();
        });
        grid.appendChild(b);
      }
      body.appendChild(grid);
      const save = h("button", "pill-btn full", "Save period");
      save.addEventListener("click", () => {
        if (pickedOffset === null) return toast("Pick a day first");
        logCount = Math.min(2, logCount + 1);
        // persist period log: ISO date of start
        const startDate = new Date(); startDate.setDate(startDate.getDate() - pickedOffset);
        const iso = startDate.toISOString().slice(0,10);
        if (window.LunaStore){
          const logs = window.LunaStore.get("periodLogs", []);
          // replace any same-month entry to avoid dupes
          const filtered = logs.filter(l => l.start !== iso);
          filtered.push({ start: iso, length: 5 });
          window.LunaStore.set("periodLogs", filtered);
        }
        refreshCycle(); buzz();
        toast(logCount >= 2 ? "Cycle analysis updated ✦" : "Period saved ♡");
        closeSheet();
        setTimeout(() => enterPeriodMode(pickedOffset), 380);
        setTimeout(() => openMenstrualSymptomsPopup(), 1100);
      });
      body.appendChild(save);
      openSheet("Log a period", body, { tall:true });
    }

    function openMenstrualSymptomsPopup(){
      const body = h("div", "ms-body");
      body.innerHTML = `<h3 class="ms-question">Hi! Have you noticed any menstrual symptoms today?</h3>`;
      const chips = h("div", "ms-chips");
      const picked = new Set();
      const SYMPTOMS = [
        { id:"none",     emo:"⊘",  label:"None of these", col:"gray"  },
        { id:"cramps",   emo:"🩸", label:"Cramps",        col:"rose"  },
        { id:"diarrhea", emo:"🧻", label:"Diarrhea",      col:"lav"   },
        { id:"cravings", emo:"🍔", label:"Cravings",      col:"peach" },
        { id:"anxious",  emo:"😰", label:"Anxious",       col:"amber" },
        { id:"headache", emo:"🤕", label:"Headache",      col:"rose"  },
        { id:"bloated",  emo:"🎈", label:"Bloating",      col:"mint"  },
        { id:"tired",    emo:"😴", label:"Fatigue",       col:"lav"   }
      ];
      SYMPTOMS.forEach(s => {
        const chip = h("button", "ms-chip");
        chip.dataset.id = s.id;
        chip.innerHTML = `<span class="ms-circle ${s.col}">${s.emo}</span><label>${s.label}</label>`;
        chip.addEventListener("click", () => {
          buzz();
          if (s.id === "none"){
            // mutually exclusive
            chips.querySelectorAll(".ms-chip").forEach(c => c.classList.remove("sel"));
            picked.clear();
            chip.classList.add("sel"); picked.add("none");
          } else {
            const noneChip = chips.querySelector(".ms-chip[data-id='none']");
            if (noneChip){ noneChip.classList.remove("sel"); picked.delete("none"); }
            chip.classList.toggle("sel");
            picked.has(s.id) ? picked.delete(s.id) : picked.add(s.id);
          }
        });
        chips.appendChild(chip);
      });
      body.appendChild(chips);
      const apply = h("button", "pill-btn full ms-apply", "Apply");
      apply.addEventListener("click", () => {
        buzz();
        if (picked.size === 0) return toast("Tap at least one");
        const ids = [...picked];
        if (window.LunaStore){
          window.LunaStore.append("symptomLogs", {
            date: window.LunaStore.todayKey(),
            symptoms: ids,
            source: "menstrual"
          });
        }
        if (picked.has("none")) toast("No symptoms today ♡");
        else {
          toast(`Logged ${picked.size} symptom${picked.size > 1 ? "s" : ""} ♡`);
          picked.forEach(() => {
            const dot = view.querySelector(".pat-dot:not(.on):not(.hi)");
            if (dot) dot.classList.add("hi");
          });
        }
        closeSheet();
      });
      body.appendChild(apply);
      openSheet("", body);
    }
    function openSymptomLogger(){
      const body = h("div", "logger-body");
      body.innerHTML = `<p class="lg-p">How are you today? Tap everything that fits.</p>`;
      const wrap = h("div", "chips");
      const picked = new Set();
      [["🎭","Mood"],["🤕","Cramps"],["⚡","Energy"],["😴","Sleep"],["✨","Skin"],
       ["🍫","Cravings"],["🤧","Headache"],["💧","Flow"],["🧠","Focus"],["💗","Libido"]]
      .forEach(([e,l]) => {
        const c = h("button", "chip", `<span class="emo">${e}</span>${l}`);
        c.addEventListener("click", () => {
          c.classList.toggle("sel");
          picked.has(l) ? picked.delete(l) : picked.add(l); buzz();
        });
        wrap.appendChild(c);
      });
      body.appendChild(wrap);
      const save = h("button", "pill-btn full", "Save today's log");
      save.addEventListener("click", () => {
        if (!picked.size) return toast("Tap at least one");
        buzz(); toast(`Logged ${picked.size} symptom${picked.size>1?"s":""} for today ♡`);
        const dot = view.querySelector(".pat-dot:not(.on):not(.hi)");
        if (dot) dot.classList.add("hi");
        closeSheet();
      });
      body.appendChild(save);
      openSheet("Log symptoms", body, { tall:true });
    }
    function openSelfCheck(){
      const body = h("div", "logger-body");
      const qs = [
        "My cycles are unpredictable month to month",
        "I often have very heavy or painful periods",
        "I notice skin or hair changes around my cycle",
        "My mood shifts feel hard to manage",
        "I'd like to bring this up with a clinician"
      ];
      body.innerHTML = `<p class="lg-p">Tick anything that sounds like you.</p>`;
      const set = new Set();
      qs.forEach(q => {
        const r = h("button", "opt checkbox");
        r.innerHTML = `<span class="lbl">${q}</span>`;
        r.addEventListener("click", () => {
          r.classList.toggle("sel");
          set.has(q) ? set.delete(q) : set.add(q); buzz();
        });
        body.appendChild(r);
      });
      const done = h("button", "pill-btn full", "See my summary");
      done.addEventListener("click", () => {
        buzz();
        const n = set.size;
        const msg = n === 0
          ? "Nothing flagged today - keep logging so Luna can spot subtle shifts."
          : n >= 3
            ? "A few things stood out. None of this is a diagnosis, but it's worth a chat with a clinician - and your Luna log is a great thing to bring."
            : "A couple of things to keep an eye on. Tracking them for a cycle or two will make any conversation much clearer.";
        openSheet("Your summary", articleBody([msg,
          "Reminder: Luna helps you notice and ask - it doesn't diagnose."], "Done"));
      });
      body.appendChild(done);
      openSheet("Quick self-assessment", body, { tall:true });
    }

    /* ---------- cycle orbit ---------- */
    const PHASES = [
      { id:"menstrual",  label:"Menstrual",   from:1,  to:5,  color:"var(--rose)" },
      { id:"follicular", label:"Follicular",  from:6,  to:13, color:"var(--sage)" },
      { id:"ovulation",  label:"Ovulation",   from:14, to:16, color:"var(--ovul)" },
      { id:"luteal",     label:"Luteal",      from:17, to:28, color:"var(--lilac)" }
    ];
    function cycleData(){
      const us = (window.LunaStore && window.LunaStore.get("userState")) || {};
      const len = Number(us.cycleLength) || 28;
      const logs = (window.LunaStore && window.LunaStore.get("periodLogs", [])) || [];
      if (!logs.length) return { hasData:false, len:len };
      const last = logs[logs.length-1];
      const start = new Date(last.start + "T00:00:00");
      const today = new Date(); today.setHours(0,0,0,0);
      const daysSince = Math.max(0, Math.floor((today - start) / 86400000));
      const day = (daysSince % len) + 1;
      const phase = PHASES.find(p => day >= p.from && day <= p.to) || PHASES[3];
      return { hasData:true, day:day, len:len, phase:phase, daysSince:daysSince, lastStart:last.start };
    }
    function refreshOrbit(){
      const c = cycleData();
      const heroEmpty = hero.querySelector("#heroEmpty");
      const heroOrbit = hero.querySelector("#heroOrbit");
      // toggle which sub-state is shown
      if (heroEmpty && heroOrbit){
        heroEmpty.style.display = c.hasData ? "none" : "";
        heroOrbit.style.display = c.hasData ? "" : "none";
      }
      const arcs = hero.querySelector("#orbitArcs");
      const ticks = hero.querySelector("#orbitTicks");
      const dot = hero.querySelector("#orbitDot");
      const num = hero.querySelector("#orbitNum");
      const phaseEl = hero.querySelector("#orbitPhase");
      const eyebrow = hero.querySelector("#orbitEyebrow");
      const sub = hero.querySelector("#orbitSub");
      const cta = hero.querySelector("#logPeriod");
      // arcs (always drawn; if no data, faded)
      arcs.innerHTML = "";
      const total = c.len;
      let acc = 0;
      PHASES.forEach(p => {
        const pLen = (Math.min(p.to, total) - p.from + 1);
        if (pLen <= 0) return;
        const pct = (pLen / total) * 100;
        const offset = (acc / total) * 100;
        arcs.innerHTML += `<circle cx="140" cy="140" r="112" fill="none"
          stroke="${p.color}" stroke-width="14" stroke-linecap="round"
          pathLength="100"
          stroke-dasharray="${(pct - 1).toFixed(2)} 100"
          stroke-dashoffset="${(-offset).toFixed(2)}"
          opacity="${c.hasData ? 0.9 : 0.15}"/>`;
        acc += pLen;
      });
      // tick marks every 7 days
      ticks.innerHTML = "";
      for (let d = 7; d < total; d += 7){
        const ang = (d / total) * 2 * Math.PI;
        const rOuter = 132, rInner = 124;
        const x1 = 140 + rOuter * Math.cos(ang - Math.PI/2);
        const y1 = 140 + rOuter * Math.sin(ang - Math.PI/2);
        const x2 = 140 + rInner * Math.cos(ang - Math.PI/2);
        const y2 = 140 + rInner * Math.sin(ang - Math.PI/2);
        ticks.innerHTML += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}"
          x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--ink-faint)" stroke-width="1.5"/>`;
      }
      if (c.hasData){
        const ang = ((c.day - 0.5) / total) * 2 * Math.PI;
        const cx = 140 + 112 * Math.sin(ang);
        const cy = 140 - 112 * Math.cos(ang);
        dot.setAttribute("cx", cx.toFixed(1));
        dot.setAttribute("cy", cy.toFixed(1));
        dot.setAttribute("fill", c.phase.color);
        dot.style.display = "";
        num.textContent = c.day;
        phaseEl.textContent = c.phase.label.toUpperCase();
        phaseEl.style.color = c.phase.color;
        eyebrow.textContent = "Day · of " + total;
        sub.textContent = c.phase.id === "menstrual"
          ? "Be gentle. Warmth, iron-rich food, and softer days help."
          : c.phase.id === "follicular"
          ? "Energy rises. Great window for new routines and stronger workouts."
          : c.phase.id === "ovulation"
          ? "Peak energy and sociability. Hydrate well and protect your sleep."
          : "Things wind down. Cravings and shorter fuses are normal - rest helps.";
        cta.textContent = "Edit period dates";
      } else {
        dot.style.display = "none";
        num.textContent = " - ";
        phaseEl.textContent = "Log to begin";
        phaseEl.style.color = "var(--ink-soft)";
        eyebrow.textContent = "Cycle";
        sub.textContent = "Log when your period starts and Luna draws the rest.";
        cta.textContent = "＋ Log a period";
      }
    }

    /* ---------- calendar view (month picker) ---------- */
    let calMonth = new Date(); calMonth.setDate(1); calMonth.setHours(0,0,0,0);
    function openCalendar(){
      const wrap = h("div", "cal-wrap");
      wrap.innerHTML = `
        <div class="cal-nav-bar">
          <button class="cal-arrow" id="calPrev" aria-label="Previous month">‹</button>
          <strong id="calLabel"></strong>
          <button class="cal-arrow" id="calNext" aria-label="Next month">›</button>
        </div>
        <div class="cal-dows">${"SMTWTFS".split("").map(d => `<span>${d}</span>`).join("")}</div>
        <div class="cal-grid" id="calGrid"></div>
        <div class="cal-key">
          <span class="ck"><i class="dot rose"></i>Period</span>
          <span class="ck"><i class="dot dash"></i>Prediction</span>
          <span class="ck"><i class="dot ovul"></i>Ovulation</span>
        </div>`;
      function render(){
        const y = calMonth.getFullYear(), m = calMonth.getMonth();
        wrap.querySelector("#calLabel").textContent =
          calMonth.toLocaleString("en-US", { month:"long", year:"numeric" });
        const first = new Date(y, m, 1);
        const startDow = first.getDay();
        const daysInMonth = new Date(y, m+1, 0).getDate();
        const grid = wrap.querySelector("#calGrid");
        grid.innerHTML = "";
        // compute period + predicted + fertile day sets
        const logs = (window.LunaStore && window.LunaStore.get("periodLogs", [])) || [];
        const us = (window.LunaStore && window.LunaStore.get("userState")) || {};
        const cycLen = Number(us.cycleLength) || 28;
        const perLen = Number(us.periodLength) || 5;
        const periodDays = new Set(), predDays = new Set(), fertileDays = new Set();
        function iso(d){
          return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
        }
        logs.forEach(l => {
          const s = new Date(l.start + "T00:00:00");
          for (let i = 0; i < (l.length || perLen); i++){
            const d = new Date(s); d.setDate(s.getDate() + i);
            periodDays.add(iso(d));
          }
        });
        // forward-predict 3 cycles from last log
        if (logs.length){
          const last = new Date(logs[logs.length-1].start + "T00:00:00");
          for (let c = 1; c <= 3; c++){
            const ps = new Date(last); ps.setDate(last.getDate() + cycLen * c);
            for (let i = 0; i < perLen; i++){
              const d = new Date(ps); d.setDate(ps.getDate() + i);
              predDays.add(iso(d));
            }
            // fertile window: 5 days before to 1 day after ovulation (cycle midpoint ~ -14 from next period)
            const ov = new Date(ps); ov.setDate(ps.getDate() - 14);
            for (let i = -4; i <= 1; i++){
              const d = new Date(ov); d.setDate(ov.getDate() + i);
              fertileDays.add(iso(d));
            }
          }
          // also fertile window between current cycle's logs and next predicted
          const ov = new Date(last); ov.setDate(last.getDate() + cycLen - 14);
          for (let i = -4; i <= 1; i++){
            const d = new Date(ov); d.setDate(ov.getDate() + i);
            fertileDays.add(iso(d));
          }
        }
        const todayIso = window.LunaStore ? window.LunaStore.todayKey() : iso(new Date());
        for (let i = 0; i < startDow; i++) grid.appendChild(h("div", "cal-cell empty"));
        for (let d = 1; d <= daysInMonth; d++){
          const date = new Date(y, m, d);
          const isoStr = iso(date);
          const cls = ["cal-cell"];
          if (isoStr === todayIso) cls.push("today");
          if (periodDays.has(isoStr)) cls.push("period");
          else if (predDays.has(isoStr)) cls.push("predicted");
          if (fertileDays.has(isoStr) && !periodDays.has(isoStr)) cls.push("fertile");
          const cell = h("button", cls.join(" "));
          cell.innerHTML = `<span>${d}</span>`;
          cell.dataset.iso = isoStr;
          cell.addEventListener("click", () => { buzz(); openDayDetail(isoStr); });
          grid.appendChild(cell);
        }
      }
      function openDayDetail(isoStr){
        const date = new Date(isoStr + "T00:00:00");
        const label = date.toLocaleString("en-US", { weekday:"long", month:"long", day:"numeric" });
        const logs = (window.LunaStore && window.LunaStore.get("symptomLogs", [])) || [];
        const dayLogs = logs.filter(l => l.date === isoStr);
        const symps = [...new Set(dayLogs.flatMap(l => l.symptoms))].filter(s => s !== "none");
        const periodLogs = (window.LunaStore && window.LunaStore.get("periodLogs", [])) || [];
        const isPeriod = periodLogs.some(l => {
          const s = new Date(l.start + "T00:00:00");
          const target = new Date(isoStr + "T00:00:00");
          const diff = Math.floor((target - s) / 86400000);
          return diff >= 0 && diff < (l.length || 5);
        });
        const body = h("div", "day-detail");
        body.innerHTML = `<p class="dd-date">${label}</p>
          ${isPeriod ? '<div class="dd-tag rose">● Period day</div>' : ''}
          ${symps.length ? `<div class="dd-symps">${symps.map(s => `<span class="dd-chip">${s}</span>`).join("")}</div>` : ''}
          ${(!isPeriod && !symps.length) ? '<p class="dd-empty">No logs for this day yet.</p>' : ''}
          <div class="dd-actions"></div>`;
        const acts = body.querySelector(".dd-actions");
        const logSymp = h("button", "pill-btn full", "Log how I felt");
        logSymp.addEventListener("click", () => { closeSheet(); setTimeout(openSymptomLogger, 420); });
        acts.appendChild(logSymp);
        openSheet(label.split(",")[0], body);
      }
      wrap.querySelector("#calPrev").addEventListener("click", () => {
        buzz(); calMonth.setMonth(calMonth.getMonth() - 1); render();
      });
      wrap.querySelector("#calNext").addEventListener("click", () => {
        buzz(); calMonth.setMonth(calMonth.getMonth() + 1); render();
      });
      openSheet("Calendar", wrap, { tall:true });
      render();
    }

    top.querySelector("#openSettings").addEventListener("click", () => { buzz(); openSettings(); });
    top.querySelector("#openCalendar").addEventListener("click", () => { buzz(); openCalendar(); });
    hero.querySelector("#logPeriod").addEventListener("click", () => { buzz(); openPeriodLogger(); });
    hero.querySelector("#logPeriodEmpty").addEventListener("click", () => { buzz(); openPeriodLogger(); });
    hero.querySelector("#editPeriod").addEventListener("click", () => { buzz(); openPeriodLogger(); });
    hero.querySelector("#tipBubble").addEventListener("click", () => {
      buzz();
      const dot = hero.querySelector("#tipBubble .bubble-dot");
      if (dot) dot.style.display = "none";
      openSheet("Tip of the day", articleBody([
        "A regular bedtime - even on weekends - is one of the strongest signals your body responds to. Sleep variability shows up in mood, skin, and cycle length within a week or two.",
        "Try the same wind-down ritual for three nights running and notice the shift. Small consistency beats big effort here."
      ], "Got it"));
    });
    hero.querySelector("#periodTip").addEventListener("click", () => {
      buzz();
      openSheet("What's happening today", articleBody([
        "Day one is the start of a new cycle. Hormones are at their lowest, which can mean lower energy and more sensitivity to pain.",
        "Iron-rich food, slow movement (a walk beats a HIIT), and a warm pack on the lower belly tend to help most people.",
        "If your flow is unusually heavy or pain is sharp enough to interrupt your day, that's a signal worth raising with a clinician."
      ], "Got it"));
    });
    refreshOrbit();
    renderNotifs();
    return view;
  }

  function sectionTitle(t, badge){
    const s = h("div", "sec-title");
    s.innerHTML = `<h3>${t}</h3>${badge ? `<span class="sec-badge">· ${badge}</span>` : ""}`;
    return s;
  }

  /* ---------- simple placeholder tabs ---------- */
  function buildPlaceholder(name, emoji, copy){
    const v = h("div", "app-view");
    v.dataset.tab = name.toLowerCase().replace(/\s/g,"");
    v.innerHTML = `<div class="ph-wrap">
      <div class="ph-emoji">${emoji}</div>
      <h2 class="ph-title">${name}</h2>
      <p class="ph-copy">${copy}</p>
      <button class="pill-btn ph-cta">Coming soon</button>
    </div>`;
    v.querySelector(".ph-cta").addEventListener("click", () => { buzz(); toast(name + " - coming soon"); });
    return v;
  }

  /* ---------- MESSAGES ---------- */
  const CHAT_TOPICS = [
    { id:"sex",   ic:"💗", c:"chip-rose", t:"Wellness check-in",
      p:"Talk through conception chances and feeling good about intimacy.", time:"Typically 3–6 min",
      first:"Let's talk about your cycle, intimacy, and what feels good for you." },
    { id:"cramps",ic:"🤕", c:"chip-lil", t:"Cramps",
      p:"Let's look at what might be behind the cramps you've had.", time:"Typically 3–6 min",
      first:"I'm here to talk about cramps. Let's figure out what's going on together." },
    { id:"head",  ic:"⚡", c:"chip-lil", t:"Headaches",
      p:"Pick up where we left off whenever you're ready.", time:"Typically 3–6 min",
      first:"I'm here to talk to you about headaches." },
    { id:"acne",  ic:"✨", c:"chip-peach", t:"Skin & acne",
      p:"Causes of breakouts and gentle routines that may help.", time:"Typically 3–6 min",
      first:"Let's look at what might be behind breakouts, and what tends to help." },
    { id:"mind",  ic:"🧠", c:"chip-rose", t:"Mental health",
      p:"You're not alone - let's work through how you're feeling.", time:"Typically 3–6 min",
      first:"You're not alone. Let's gently work out why you might be feeling this way." }
  ];
  const THREADS = [
    { topic:"head", preview:"Is now a good time to pick up where we left off?", time:"5:58 PM", unread:false },
    { topic:"sex",  preview:"Let's talk through conception chances and pleasure.", time:"5:55 PM", unread:true }
  ];

  function buildMessages(){
    const v = h("div", "app-view");
    v.dataset.tab = "messages";
    const top = h("header", "app-top msg-top");
    top.innerHTML = `
      <button class="avatar-btn" id="msgAvatar" aria-label="Profile">
        <span class="av-face"><span class="av-eye"></span><span class="av-eye r"></span><span class="av-smile"></span></span>
        <span class="av-ring"></span></button>
      <div class="app-date"><strong>Messages</strong></div>
      <button class="icon-btn ghost" id="composeBtn" aria-label="New chat">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 20l4-1L19 8a2 2 0 0 0-3-3L5 16l-1 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
      </button>`;
    v.appendChild(top);

    const list = h("div", "msg-list");
    function renderList(){
      list.innerHTML = "";
      THREADS.forEach(th => {
        const topic = CHAT_TOPICS.find(x => x.id === th.topic);
        const row = h("button", "msg-row");
        row.innerHTML = `
          <span class="msg-ic ${topic.c}">${topic.ic}</span>
          <span class="msg-main">
            <span class="msg-line1"><strong>${topic.t}</strong><small>${th.time}</small></span>
            <span class="msg-prev">${th.preview}</span>
          </span>
          ${th.unread ? '<span class="msg-unread"></span>' : ''}`;
        row.addEventListener("click", () => { buzz(); th.unread = false; renderList(); openChat(topic); });
        list.appendChild(row);
      });
      // unread count -> tab dot
      const anyUnread = THREADS.some(t => t.unread);
      const dot = shell.querySelector('.tab[data-tab="messages"] .tab-dot');
      if (dot) dot.style.display = anyUnread ? "block" : "none";
    }
    renderList();
    v.appendChild(list);

    top.querySelector("#msgAvatar").addEventListener("click", () => { buzz(); openSettings(); });
    top.querySelector("#composeBtn").addEventListener("click", () => { buzz(); openComposer(); });

    function openComposer(){
      const body = h("div", "composer-body");
      CHAT_TOPICS.forEach(tp => {
        const r = h("button", "compose-row");
        r.innerHTML = `<span class="msg-ic ${tp.c}">${tp.ic}</span>
          <span class="msg-main"><strong>${tp.t}</strong>
            <span class="msg-prev">${tp.p}</span>
            <span class="compose-time">🕑 ${tp.time}</span></span>
          <span class="mr-chev">›</span>`;
        r.addEventListener("click", () => {
          buzz();
          if (!THREADS.find(t => t.topic === tp.id))
            THREADS.unshift({ topic:tp.id, preview:tp.p, time:"Now", unread:false });
          renderList();
          closeSheet();
          setTimeout(() => openChat(tp), 360);
        });
        body.appendChild(r);
      });
      openSheet("Start a new chat", body, { tall:true });
    }

    function openChat(topic){
      const wrap = h("div", "chat-wrap");
      const log = h("div", "chat-log");
      wrap.appendChild(log);
      const choices = h("div", "chat-choices");
      wrap.appendChild(choices);

      function bot(text){
        const b = h("div", "bubble-row bot");
        b.innerHTML = `<span class="chat-av">${topic.ic}</span><div class="bubble in">${text}</div>`;
        log.appendChild(b); log.scrollTop = log.scrollHeight;
      }
      function me(text){
        const b = h("div", "bubble-row me");
        b.innerHTML = `<div class="bubble out">${text}</div>`;
        log.appendChild(b); log.scrollTop = log.scrollHeight;
      }
      function typing(cb){
        const t = h("div", "bubble-row bot");
        t.innerHTML = `<span class="chat-av">${topic.ic}</span><div class="bubble in typing"><i></i><i></i><i></i></div>`;
        log.appendChild(t); log.scrollTop = log.scrollHeight;
        setTimeout(() => { t.remove(); cb(); }, 750);
      }
      function ask(question, options, onPick){
        choices.innerHTML = "";
        options.forEach(o => {
          const b = h("button", "chat-choice");
          b.textContent = o;
          b.addEventListener("click", () => {
            buzz(); me(o); choices.innerHTML = "";
            typing(() => onPick(o));
          });
          choices.appendChild(b);
        });
      }

      // scripted, supportive, non-diagnostic conversation
      log.appendChild(h("div", "chat-day", "Today"));
      bot("👋 Hi! This is your Luna companion.");
      setTimeout(() => bot("My replies are guided prompts - not medical advice, but a calm way to think things through."), 500);
      setTimeout(() => {
        bot(topic.first);
        ask("Want to start?", ["Yes, let's go", "Tell me more", "Not now"], step2);
      }, 1100);

      function step2(ans){
        if (ans === "Not now"){ bot("No worries - I'm here whenever you're ready 🌿"); choices.innerHTML=""; return; }
        if (ans === "Tell me more"){
          bot("We'll go one short question at a time. Nothing is stored anywhere outside this prototype, and you can close this anytime.");
        }
        bot("First - are you feeling this right now, or was it earlier today?");
        ask("Choose one", ["Right now", "Earlier today", "I'm not sure"], step3);
      }
      function step3(){
        bot("Thanks for sharing. On a scale that's easy for you - how intense does it feel?");
        ask("Roughly…", ["Mild", "Moderate", "Strong"], step4);
      }
      function step4(level){
        if (level === "Strong"){
          bot("That sounds tough. If it's severe, sudden, or unusual for you, please consider checking in with a clinician.");
        }
        bot("Logging this in Luna helps spot patterns over time. Want me to add it to today's log?");
        ask("Add to today's log?", ["Yes, log it", "No thanks"], step5);
      }
      function step5(ans){
        if (ans === "Yes, log it"){ toast("Added to today's log ♡"); }
        bot("Done. Small, kind steps add up. I hope you found this useful - let's talk again soon 👋");
        const closeBtn = h("button", "chat-choice end", "Close chat");
        choices.innerHTML = "";
        closeBtn.addEventListener("click", () => { buzz(); closeSheet(); });
        choices.appendChild(closeBtn);
      }

      const sheet = openSheet(topic.t, wrap, { tall:true });
      sheet.panel.classList.add("chat-sheet");
    }

    return v;
  }

  /* ---------- PARTNER ---------- */
  function buildPartner(){
    const v = h("div", "app-view");
    v.dataset.tab = "partner";
    const name = userState.name ? userState.name : "you";

    const top = h("header", "app-top");
    top.innerHTML = `<span class="app-top-spacer"></span>
      <div class="app-date"><strong>Partner</strong></div><span class="app-top-spacer"></span>`;
    v.appendChild(top);

    const scroll = h("div", "app-scroll partner-scroll");
    scroll.innerHTML = `
      <section class="ptr-hero">
        <span class="ptr-blob b1"></span><span class="ptr-blob b2"></span>
        <h1 class="ptr-title">Luna <em>for two</em></h1>
        <p class="ptr-sub">Ready to feel even closer?</p>
        <ul class="ptr-list">
          <li>They stay in tune with your cycle</li>
          <li>Connect with gentle games &amp; quizzes</li>
          <li>Build an intimate life you both love</li>
        </ul>
      </section>
      <h3 class="ptr-h">What your partner sees</h3>
      <div class="ptr-preview">
        <span class="pv-tag you">Your view 😍</span>
        <span class="pv-tag his">Their view ♥</span>
        <div class="pv-card a">
          <div class="pv-mini-top"><span class="pv-dot"></span><small>March 23</small></div>
          <div class="pv-strip">${[22,23,24,25,26,27,28].map(d=>`<span class="pv-d${d===23?' on':''}">${d}</span>`).join("")}</div>
          <div class="pv-state"><small>Period</small><strong>Day 1</strong></div>
        </div>
        <div class="pv-card b">
          <div class="pv-mini-top"><small>March</small></div>
          <div class="pv-cal">${Array.from({length:21}).map((_,i)=>`<span class="${i===22-1?'on':''}">${i+3}</span>`).join("")}</div>
        </div>
      </div>
      <div class="ptr-foot">
        <button class="pill-btn full" id="linkPartner">Link your partner</button>
      </div>`;
    v.appendChild(scroll);

    scroll.querySelector("#linkPartner").addEventListener("click", () => { buzz(); openPairing(); });

    function genCode(){
      const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let s = ""; for (let i=0;i<6;i++) s += A[Math.floor(Math.random()*A.length)];
      return s;
    }
    function openPairing(){
      const code = genCode();
      const body = h("div", "pair-body");
      body.innerHTML = `
        <h2 class="pair-title">Luna <em>for two</em></h2>
        <h3 class="pair-h">Share your pairing code</h3>
        <p class="pair-p">Your partner gets a link to download Luna, then uses this code to connect your profiles.</p>
        <div class="pair-code" id="pairCode">${code}</div>
        <button class="pill-btn full" id="sendCode">Send pairing code</button>
        <p class="pair-note">Your data is personal. Only share with someone you trust.</p>
        <button class="btn-text" id="cancelInvite">Cancel invite</button>`;
      body.querySelector("#pairCode").addEventListener("click", () => {
        buzz();
        if (navigator.clipboard) navigator.clipboard.writeText(code).catch(()=>{});
        toast("Code copied · " + code);
      });
      body.querySelector("#sendCode").addEventListener("click", () => {
        buzz();
        const done = h("div", "art-body");
        done.innerHTML = `<p><strong>Invite ready ✦</strong></p>
          <p>Share code <strong>${code}</strong> with your partner along with the download link. Once they enter it, you'll see a "Linked" badge here.</p>
          <p style="color:var(--ink-soft);font-size:13px">Prototype: no message is actually sent.</p>`;
        const okay = h("button", "pill-btn full", "Got it");
        okay.addEventListener("click", () => {
          buzz(); closeSheet();
          scroll.querySelector("#linkPartner").textContent = "Partner invite sent ✓";
          scroll.querySelector("#linkPartner").classList.add("ghost-fill");
          toast("Pairing code sent ♡");
        });
        done.appendChild(okay);
        openSheet("Invite your partner", done);
      });
      body.querySelector("#cancelInvite").addEventListener("click", () => { buzz(); closeSheet(); });
      openSheet("Partner", body, { tall:true });
    }
    return v;
  }

  /* ---------- INSIGHTS ---------- */
  // seeded sample weekly data for the prototype (clearly simulated)
  function seededWeek(seed, lo, hi){
    const out = []; let s = seed;
    for (let i = 0; i < 7; i++){
      s = (s * 9301 + 49297) % 233280;
      out.push(lo + (s / 233280) * (hi - lo));
    }
    return out;
  }
  const CYCLE = { day: 18, len: 28, period: 5 }; // prototype: mid-luteal
  function cyclePhase(day, len, period){
    if (day <= period) return { id:"menstrual", label:"Menstrual",  color:"#ff7fa3" };
    if (day <= len/2 - 2) return { id:"follicular", label:"Follicular", color:"#7ec8a8" };
    if (day <= len/2 + 2) return { id:"ovulation", label:"Ovulation",  color:"#e7b34a" };
    return { id:"luteal", label:"Luteal", color:"#b48ad6" };
  }

  /* ---------- SECRET CHATS / JOURNAL ---------- */
  let journalUnlocked = false;
  function buildJournal(){
    const v = h("div", "app-view");
    v.dataset.tab = "secret";

    const top = h("header", "app-top");
    top.innerHTML = `
      <button class="avatar-btn" id="jrAvatar" aria-label="Profile">
        <span class="av-face"><span class="av-eye"></span><span class="av-eye r"></span><span class="av-smile"></span></span>
        <span class="av-ring"></span></button>
      <div class="app-date"><strong>Private</strong><small>your space</small></div>
      <button class="icon-btn ghost" id="jrLock" aria-label="Lock"
        ><svg viewBox="0 0 24 24" width="20" height="20"><rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>`;
    v.appendChild(top);

    const stage = h("div", "jr-stage");
    v.appendChild(stage);

    top.querySelector("#jrAvatar").addEventListener("click", () => { buzz(); openSettings(); });
    top.querySelector("#jrLock").addEventListener("click", () => {
      buzz(); journalUnlocked = false; renderGate();
    });

    function renderGate(){
      stage.innerHTML = "";
      const pinSet = window.LunaStore && window.LunaStore.get("journalPin");
      const inner = h("div", "jr-gate");
      const setupMode = !pinSet;
      inner.innerHTML = `
        <div class="jr-lock-ic">
          <svg viewBox="0 0 24 24" width="38" height="38"><rect x="4" y="10" width="16" height="11" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        </div>
        <h2 class="jr-title">${setupMode ? "Set your <em>PIN</em>" : "Welcome <em>back</em>"}</h2>
        <p class="jr-sub">${setupMode
          ? "Four digits. Luna never sees it - it stays on this device."
          : "Enter your 4-digit PIN to unlock your private space."}</p>
        <div class="jr-pin">
          ${[0,1,2,3].map(i => `<input type="password" inputmode="numeric" maxlength="1" data-i="${i}">`).join("")}
        </div>
        ${setupMode ? '' : '<p class="jr-forgot"><a href="#" id="jrReset">Reset PIN</a></p>'}`;
      stage.appendChild(inner);
      const inputs = [...inner.querySelectorAll(".jr-pin input")];
      let bufferConfirm = null;
      function readPin(){ return inputs.map(i => i.value).join(""); }
      function clearPin(){ inputs.forEach(i => i.value = ""); inputs[0].focus(); }
      inputs.forEach((inp, i) => {
        inp.addEventListener("input", () => {
          inp.value = inp.value.replace(/\D/g, "").slice(0,1);
          if (inp.value && i < 3) inputs[i+1].focus();
          if (readPin().length === 4){
            const pin = readPin();
            if (setupMode){
              if (!bufferConfirm){
                bufferConfirm = pin;
                inner.querySelector(".jr-title").innerHTML = "Confirm your <em>PIN</em>";
                inner.querySelector(".jr-sub").textContent = "Type it once more.";
                setTimeout(clearPin, 200);
              } else if (bufferConfirm === pin){
                window.LunaStore.set("journalPin", pin);
                buzz(); journalUnlocked = true;
                toast("PIN set ♡"); renderList();
              } else {
                bufferConfirm = null;
                inner.querySelector(".jr-sub").textContent = "Didn't match - try again.";
                clearPin();
              }
            } else {
              if (pin === pinSet){
                buzz(); journalUnlocked = true; renderList();
              } else {
                inner.querySelector(".jr-sub").textContent = "Wrong PIN - try again.";
                inner.querySelector(".jr-pin").classList.add("shake");
                setTimeout(() => inner.querySelector(".jr-pin").classList.remove("shake"), 500);
                clearPin();
              }
            }
          }
        });
        inp.addEventListener("keydown", e => {
          if (e.key === "Backspace" && !inp.value && i > 0) inputs[i-1].focus();
        });
      });
      setTimeout(() => inputs[0].focus(), 150);
      const resetLink = inner.querySelector("#jrReset");
      if (resetLink) resetLink.addEventListener("click", e => {
        e.preventDefault(); buzz();
        const body = h("div", "art-body");
        body.innerHTML = `<p><strong>Reset your PIN?</strong></p>
          <p>This won't erase your entries. You'll just set a new 4-digit code.</p>`;
        const yes = h("button", "pill-btn full", "Reset PIN");
        yes.addEventListener("click", () => {
          buzz(); window.LunaStore.remove("journalPin");
          closeSheet(); renderGate();
        });
        body.appendChild(yes);
        openSheet("Reset PIN", body);
      });
    }

    function renderList(){
      stage.innerHTML = "";
      const entries = (window.LunaStore && window.LunaStore.get("journalEntries", [])) || [];
      const inner = h("div", "jr-list-wrap");
      if (!entries.length){
        inner.innerHTML = `
          <div class="jr-empty">
            <div class="jr-empty-art">
              <span class="je-blob a"></span><span class="je-blob b"></span>
            </div>
            <h3>Nothing here yet</h3>
            <p>This is your private space. Write whatever you want - symptoms, thoughts, things you'd never share. Locked behind your PIN.</p>
            <button class="pill-btn" id="jrFirst">Write your first entry</button>
          </div>`;
        stage.appendChild(inner);
        inner.querySelector("#jrFirst").addEventListener("click", () => { buzz(); openEditor(); });
        return;
      }
      // group by date
      const byDate = {};
      entries.sort((a,b) => b.ts - a.ts).forEach(e => {
        (byDate[e.date] = byDate[e.date] || []).push(e);
      });
      const list = h("div", "jr-list");
      Object.keys(byDate).forEach(date => {
        const d = new Date(date + "T00:00:00");
        const label = d.toLocaleString("en-US", { weekday:"short", month:"short", day:"numeric" });
        const isToday = date === window.LunaStore.todayKey();
        list.innerHTML += `<div class="jr-date">${isToday ? "Today" : label}</div>`;
        byDate[date].forEach(e => {
          const card = h("button", "jr-card");
          card.dataset.id = e.id;
          const preview = e.body.slice(0, 90).replace(/\n/g, " ");
          card.innerHTML = `<strong>${e.title || "Untitled"}</strong>
            <span>${preview}${e.body.length > 90 ? "…" : ""}</span>
            <small>${new Date(e.ts).toLocaleString("en-US",{hour:"numeric",minute:"2-digit"})}</small>`;
          card.addEventListener("click", () => { buzz(); openEditor(e); });
          list.appendChild(card);
        });
      });
      inner.appendChild(list);
      const fab = h("button", "jr-fab", "＋");
      fab.addEventListener("click", () => { buzz(); openEditor(); });
      inner.appendChild(fab);
      stage.appendChild(inner);
    }

    function openEditor(existing){
      const body = h("div", "jr-editor");
      body.innerHTML = `
        <input class="jr-title-input" placeholder="Title (optional)" value="${existing ? (existing.title || "") : ""}">
        <textarea class="jr-body-input" placeholder="Write freely - only you can read this." rows="10">${existing ? existing.body : ""}</textarea>
        <div class="jr-editor-actions">
          ${existing ? '<button class="jr-del" id="jrDel">Delete</button>' : ''}
          <button class="pill-btn" id="jrSave">${existing ? "Save changes" : "Save entry"}</button>
        </div>`;
      const titleInput = body.querySelector(".jr-title-input");
      const bodyInput = body.querySelector(".jr-body-input");
      body.querySelector("#jrSave").addEventListener("click", () => {
        const text = bodyInput.value.trim();
        if (!text) return toast("Write something first");
        buzz();
        const entries = window.LunaStore.get("journalEntries", []) || [];
        if (existing){
          const idx = entries.findIndex(e => e.id === existing.id);
          if (idx >= 0){
            entries[idx].title = titleInput.value.trim();
            entries[idx].body = text;
            entries[idx].ts = Date.now();
          }
        } else {
          entries.push({
            id: "j" + Date.now(),
            title: titleInput.value.trim(),
            body: text,
            ts: Date.now(),
            date: window.LunaStore.todayKey()
          });
        }
        window.LunaStore.set("journalEntries", entries);
        toast(existing ? "Saved ♡" : "Entry saved ♡");
        closeSheet(); renderList();
      });
      const del = body.querySelector("#jrDel");
      if (del) del.addEventListener("click", () => {
        buzz();
        const confirm = h("div", "art-body");
        confirm.innerHTML = `<p><strong>Delete this entry?</strong></p>
          <p>This can't be undone.</p>`;
        const yes = h("button", "pill-btn full", "Yes, delete");
        yes.addEventListener("click", () => {
          buzz();
          const entries = window.LunaStore.get("journalEntries", []) || [];
          window.LunaStore.set("journalEntries", entries.filter(e => e.id !== existing.id));
          closeSheet(); renderList();
          toast("Entry deleted");
        });
        confirm.appendChild(yes);
        openSheet("Delete entry", confirm);
      });
      openSheet(existing ? "Edit entry" : "New entry", body, { tall:true });
      setTimeout(() => bodyInput.focus(), 200);
    }

    // initial state
    if (journalUnlocked) renderList();
    else renderGate();

    return v;
  }


  function buildInsights(){
    const v = h("div", "app-view");
    v.dataset.tab = "insights";

    const top = h("header", "app-top");
    top.innerHTML = `
      <button class="avatar-btn" id="insAvatar" aria-label="Profile">
        <span class="av-face"><span class="av-eye"></span><span class="av-eye r"></span><span class="av-smile"></span></span>
        <span class="av-ring"></span></button>
      <div class="app-date"><strong>Insights</strong></div>
      <button class="icon-btn ghost" id="insWeek" aria-label="Week">
        <svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="5" width="18" height="16" rx="3"
          fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M8 3v4M16 3v4"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>`;
    v.appendChild(top);

    const scroll = h("div", "app-scroll ins-scroll");

    // ---- pull real data from store ----
    function moodToScore(m){
      return ({awful:1, low:2, okay:3, good:4, great:5}[m]) || 3;
    }
    function pastDays(n){
      const out = [];
      const t = new Date(); t.setHours(0,0,0,0);
      for (let i = n - 1; i >= 0; i--){
        const d = new Date(t); d.setDate(t.getDate() - i);
        out.push(d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0"));
      }
      return out;
    }
    const us = (window.LunaStore && window.LunaStore.get("userState")) || {};
    const periodLogs = (window.LunaStore && window.LunaStore.get("periodLogs", [])) || [];
    const symptomLogs = (window.LunaStore && window.LunaStore.get("symptomLogs", [])) || [];
    const cycLen = Number(us.cycleLength) || 28;
    const perLen = Number(us.periodLength) || 5;

    // current cycle day + phase from real logs
    let curDay = 0, curPhase = { id:"follicular", label:"Follicular", color:"var(--sage)" };
    if (periodLogs.length){
      const last = new Date(periodLogs[periodLogs.length-1].start + "T00:00:00");
      const today = new Date(); today.setHours(0,0,0,0);
      const ds = Math.max(0, Math.floor((today - last) / 86400000));
      curDay = (ds % cycLen) + 1;
      if (curDay <= perLen) curPhase = { id:"menstrual", label:"Menstrual", color:"var(--rose)" };
      else if (curDay <= cycLen/2 - 2) curPhase = { id:"follicular", label:"Follicular", color:"var(--sage)" };
      else if (curDay <= cycLen/2 + 2) curPhase = { id:"ovulation", label:"Ovulation", color:"var(--ovul)" };
      else curPhase = { id:"luteal", label:"Luteal", color:"var(--lilac)" };
    }

    // weekly mood series (real check-ins)
    const days7 = pastDays(7);
    const moodSeries = days7.map(k => {
      const ci = window.LunaStore && window.LunaStore.get("checkin:" + k);
      return ci && ci.mood ? moodToScore(ci.mood) : null;
    });
    const moodLogged = moodSeries.filter(v => v !== null);
    const avgMood = moodLogged.length ? moodLogged.reduce((a,b)=>a+b,0) / moodLogged.length : null;

    // wellness score computed from check-in consistency + period logged + symptom diversity
    const checkinDays = days7.filter(k => {
      const c = window.LunaStore && window.LunaStore.get("checkin:" + k);
      return c && c.mood;
    }).length;
    const symptomDays = days7.filter(k =>
      symptomLogs.some(l => l.date === k)
    ).length;
    const breakdown = {
      mood: avgMood ? Math.round((avgMood / 5) * 100) : 50,
      consistency: Math.round((checkinDays / 7) * 100),
      tracking: Math.round((symptomDays / 7) * 100),
      cycle: periodLogs.length ? 88 : 30
    };
    const score = Math.round(
      breakdown.mood * 0.30 + breakdown.consistency * 0.30 +
      breakdown.tracking * 0.20 + breakdown.cycle * 0.20
    );
    const prevScore = Math.max(40, score - (checkinDays >= 4 ? 4 : -2));
    const trendUp = score >= prevScore;

    /* ---- wellness score hero ---- */
    const ring = h("section", "ins-hero");
    ring.innerHTML = `
      <div class="ws-ring">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <defs><linearGradient id="wsG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ff8fb0"/><stop offset="1" stop-color="#ffb38a"/>
          </linearGradient></defs>
          <circle cx="60" cy="60" r="50" fill="none" stroke="#f6e8ee" stroke-width="10"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="url(#wsG)" stroke-width="10"
            stroke-linecap="round" stroke-dasharray="${(score/100)*314} 314"
            transform="rotate(-90 60 60)"/>
        </svg>
        <span class="ws-num"><b>${score}</b><small>/100</small></span>
      </div>
      <div class="ws-meta">
        <span class="ws-eyebrow">Weekly wellness</span>
        <h2 class="ws-title">You're trending <em>${trendUp ? "up" : "steady"}</em></h2>
        <p class="ws-sub">${trendUp ? "+" : ""}${score - prevScore} vs last week. ${
          checkinDays === 0
            ? "Check in daily to unlock real insights."
            : checkinDays < 3
            ? "A few more daily check-ins and Luna can spot real patterns."
            : "Your daily check-ins are doing the work."
        }</p>
      </div>
      <div class="ws-breakdown">
        ${[
          ["Mood",breakdown.mood,"rose"],
          ["Consistency",breakdown.consistency,"lav"],
          ["Tracking",breakdown.tracking,"mint"],
          ["Cycle",breakdown.cycle,"peach"]
        ].map(([l,v,c])=>`
          <div class="ws-bar ${c}">
            <div class="ws-bar-track"><span style="width:${v}%"></span></div>
            <small>${l}<b>${v}</b></small>
          </div>`).join("")}
      </div>`;
    scroll.appendChild(ring);

    /* ---- cycle phase ribbon ---- */
    const ribbon = h("section", "phase-ribbon");
    const phaseCopy = {
      menstrual: "Be gentle. Rest, warmth and iron-rich food are your friends right now.",
      follicular:"Energy is rising. A great window for new routines and harder workouts.",
      ovulation: "Peak energy and social ease. Hydrate well and protect your sleep.",
      luteal:    "Things wind down. Expect cravings and shorter fuses - early nights help."
    }[curPhase.id];
    ribbon.innerHTML = curDay ? `
      <span class="ph-dot" style="background:${curPhase.color}"></span>
      <div class="ph-text"><strong>${curPhase.label} phase</strong><small>Day ${curDay} of ${cycLen}</small></div>
      <p class="ph-copy">${phaseCopy}</p>` : `
      <span class="ph-dot" style="background:var(--ink-faint)"></span>
      <div class="ph-text"><strong>Cycle not started</strong><small>Log a period to begin</small></div>
      <p class="ph-copy">Once you log your first period, this ribbon shows your current phase and what to expect.</p>`;
    scroll.appendChild(ribbon);

    /* ---- correlations card ---- */
    const corr = h("section", "panel ins-corr");
    corr.innerHTML = `
      <div class="panel-head"><h3>Patterns we're noticing</h3></div>
      <p class="panel-p">How three things move across your week. ${moodLogged.length < 3 ? "Mood is from your check-ins - log a few more to fill the chart." : "Tap each to switch."}</p>
      <div class="corr-tabs">
        <button class="corr-tab on" data-k="mood">Mood</button>
        <button class="corr-tab"    data-k="sleep">Sleep</button>
        <button class="corr-tab"    data-k="hydration">Hydration</button>
      </div>
      <div class="corr-chart" id="corrChart"></div>
      <p class="corr-insight" id="corrInsight"></p>`;
    scroll.appendChild(corr);

    // datasets - mood from real check-ins, others still seeded (would be wired to real food/sleep logs in production)
    const sleepData = [7.5, 7.8, 6.9, 6.2, 5.8, 6.4, 7.1];
    const hydraData = [1.6, 2.0, 1.4, 1.2, 1.0, 1.5, 1.8];
    // pad mood series: missing days get null which the chart treats as gaps
    const moodReal = moodSeries.map(v => v === null ? 0 : v);
    const moodFilledIdx = moodSeries.map(v => v !== null);
    const datasets = {
      sleep:     { values: sleepData, unit: "h",  lo: 0, hi: 10, real:false,
        insight: "Sleep dipped 22% during your luteal days - common, and a sign to protect bedtime this week." },
      hydration: { values: hydraData, unit: "L",  lo: 0, hi: 3, real:false,
        insight: "Hydration drops on days you log cramps. Aim for one more glass on those days." },
      mood:      { values: moodReal,  unit: "/5", lo: 0, hi: 5, real:true, filled: moodFilledIdx,
        insight: moodLogged.length === 0
          ? "Tap a mood on the Today screen each day - these dots will start to tell a story."
          : moodLogged.length < 3
          ? `Logged ${moodLogged.length} day${moodLogged.length>1?"s":""} so far. A few more and a real pattern appears.`
          : avgMood >= 4 ? "Your mood has been steady-high this week. Whatever you're doing - keep going."
          : avgMood >= 3 ? "Mood is hovering in the middle. Late afternoons may be a good time to check in with yourself."
          : "Mood has been on the lower side. Be soft with yourself - and consider what helps when this happens." }
    };
    const DAYS = ["M","T","W","T","F","S","S"];

    function renderChart(key){
      const ds = datasets[key];
      const W = 320, H = 130, pad = 18;
      const max = ds.hi, vals = ds.values;
      const stepX = (W - pad*2) / (vals.length - 1);
      const yFor = v => H - pad - ((v - ds.lo) / (max - ds.lo)) * (H - pad*2);
      const pts = vals.map((v, i) => [pad + i*stepX, yFor(v)]);
      const path = pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
      const area = path + ` L ${pts[pts.length-1][0].toFixed(1)} ${H-pad} L ${pts[0][0].toFixed(1)} ${H-pad} Z`;
      // phase backdrop bands (light) - derived from real cycle position
      const bands = curDay ? Array.from({length:7}).map((_,i) => {
        const x = pad + (i - 0.5)*stepX;
        const dayN = ((curDay - 6 + i + cycLen * 5) % cycLen) + 1;
        const c = (dayN <= perLen) ? "var(--rose)"
          : (dayN <= cycLen/2 - 2) ? "var(--sage)"
          : (dayN <= cycLen/2 + 2) ? "var(--ovul)"
          : "var(--lilac)";
        return `<rect x="${Math.max(pad,x)}" y="${pad-4}" width="${stepX}" height="${H-pad*2+8}"
          fill="${c}" opacity="0.07"/>`;
      }).join("") : "";
      const dots = pts.map((p,i) => {
        const isReal = ds.real && (!ds.filled || ds.filled[i]);
        const hollow = ds.real && !isReal;
        return `<circle cx="${p[0]}" cy="${p[1]}" r="${hollow ? 3 : 3.5}" fill="${hollow ? "none" : "#fff"}" stroke="var(--rose)" stroke-width="${hollow ? 1.5 : 2}" stroke-dasharray="${hollow ? "2 2" : "none"}"/>`;
      }).join("");
      const labels = DAYS.map((d,i)=>`<text x="${pad + i*stepX}" y="${H-3}" text-anchor="middle"
        font-size="10" font-weight="700" fill="var(--ink-soft)">${d}</text>`).join("");
      const lastV = vals[vals.length-1];
      const showVal = !ds.real || (ds.filled && ds.filled[vals.length-1]);
      const valLabel = showVal ? `<text x="${W-pad}" y="${pad-2}" text-anchor="end"
        font-size="10" font-weight="700" fill="var(--ink-soft)">${lastV.toFixed(1)}${ds.unit}</text>` : "";
      const svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" width="100%" height="${H}">
        <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="var(--rose)" stop-opacity="0.28"/>
          <stop offset="1" stop-color="var(--rose)" stop-opacity="0"/>
        </linearGradient></defs>
        ${bands}
        <path d="${area}" fill="url(#cg)"/>
        <path d="${path}" fill="none" stroke="var(--rose)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ${ds.real && moodLogged.length < 7 ? 'stroke-dasharray="4 3"' : ''}/>
        ${dots}${labels}${valLabel}
      </svg>`;
      corr.querySelector("#corrChart").innerHTML = svg;
      corr.querySelector("#corrInsight").textContent = ds.insight;
    }
    renderChart("mood");
    corr.querySelectorAll(".corr-tab").forEach(b => {
      b.addEventListener("click", () => {
        corr.querySelectorAll(".corr-tab").forEach(x => x.classList.remove("on"));
        b.classList.add("on"); buzz(); renderChart(b.dataset.k);
      });
    });

    /* ---- premium food correlation ---- */
    const food = h("section", "panel ins-food locked");
    food.innerHTML = `
      <div class="panel-head"><h3>Food &amp; symptoms</h3><span class="lock-tag">Luna+</span></div>
      <p class="panel-p">See how caffeine, dairy, sugar and iron-rich meals connect to cramps, acne, bloating and mood.</p>
      <div class="food-grid">
        ${[
          ["Caffeine","☕","Cramps"], ["Dairy","🥛","Acne"],
          ["Sugar","🍫","Mood dips"], ["Iron-rich","🥬","Energy"]
        ].map(([n,e,s])=>`
          <div class="food-cell">
            <span class="fc-e">${e}</span>
            <strong>${n}</strong>
            <small>${s}</small>
          </div>`).join("")}
      </div>
      <button class="pill-btn full" id="unlockFood">Unlock with Luna+</button>
      <div class="lock-blur"></div>`;
    food.querySelector("#unlockFood").addEventListener("click", () => {
      buzz();
      const b = h("div", "art-body");
      b.innerHTML = `<p><strong>Food correlations · Luna+</strong></p>
        <p>Track caffeine, dairy, sugar, spicy food and iron-rich meals with a quick log. Each week, Luna surfaces the foods most tied to your cramps, acne, bloating, headaches and mood swings.</p>
        <p style="color:var(--ink-soft);font-size:13px">Available on Luna+. This is a prototype - no payment is taken.</p>`;
      const cta = h("button", "pill-btn full", "Start 7-day free trial");
      cta.addEventListener("click", () => { buzz(); toast("You're on Luna+ ✦"); closeSheet();
        food.classList.remove("locked"); food.querySelector("#unlockFood").remove(); });
      b.appendChild(cta);
      openSheet("Luna+", b);
    });
    scroll.appendChild(food);

    /* ---- observations list ---- */
    const obs = h("section", "panel ins-obs");
    obs.innerHTML = `
      <div class="panel-head"><h3>Worth a look</h3></div>
      <ul class="obs-list">
        <li><span class="ob-ic rose">💗</span><div><strong>Mood softens around day 22–26</strong>
          <small>3 cycles in a row. Plan softer days that week.</small></div></li>
        <li><span class="ob-ic lav">😴</span><div><strong>Sleep dips before your period</strong>
          <small>About −45 minutes on average. Earlier bedtime helps.</small></div></li>
        <li><span class="ob-ic mint">💧</span><div><strong>Cramps cluster on low-hydration days</strong>
          <small>Worth trying an extra glass on heavier days.</small></div></li>
      </ul>
      <p class="obs-foot">These are gentle patterns - not a diagnosis. Bring them to a clinician if anything feels off.</p>`;
    scroll.appendChild(obs);

    scroll.appendChild(h("div", "scroll-end", "Insights update as you log ✦"));
    v.appendChild(scroll);

    top.querySelector("#insAvatar").addEventListener("click", () => { buzz(); openSettings(); });
    top.querySelector("#insWeek").addEventListener("click", () => {
      buzz();
      openSheet("Choose week", pickBody(["This week", "Last week", "Two weeks ago", "Last 4 weeks"],
        (label) => { closeSheet(); toast(label + " · view updated"); }));
    });

    return v;
  }


  /* ---------- bottom tab bar ---------- */
  const TABS = [
    { id: "today",   label: "Today",    ic: "M4 12l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" },
    { id: "insights",label: "Insights", ic: "M5 19V10M10 19V5M15 19v-7M20 19v-11" },
    { id: "secret",  label: "Secret",   ic: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5z" },
    { id: "messages",label: "Messages", ic: "M4 5h16v11H8l-4 4z" },
    { id: "partner", label: "Partner",  ic: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" }
  ];
  function buildTabBar(switchTo){
    const bar = h("nav", "tabbar");
    TABS.forEach((t, i) => {
      const b = h("button", "tab" + (i === 0 ? " on" : ""));
      b.dataset.tab = t.id;
      b.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24">
        <path d="${t.ic}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>${t.label}</span>${t.id === "messages" ? '<i class="tab-dot"></i>' : ''}`;
      b.addEventListener("click", () => {
        bar.querySelectorAll(".tab").forEach(x => x.classList.remove("on"));
        b.classList.add("on"); buzz(); switchTo(t.id);
      });
      bar.appendChild(b);
    });
    return bar;
  }

  /* ---------- SETTINGS ---------- */
  function buildSettings(){
    const v = h("div", "settings-view");
    const goal = userState.goals && userState.goals[0] ? userState.goals[0] : "Track my cycle";
    const name = userState.name ? userState.name : "there";
    v.innerHTML = `
      <header class="set-head">
        <button class="icon-btn ghost" id="closeSettings" aria-label="Close">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </button>
        <strong>Settings</strong><span class="set-spacer"></span>
      </header>
      <div class="set-scroll">
        <div class="register-banner">
          <span class="rb-ic">!</span>
          <p>Create a free account to save your data - or log in to pick up where you left off.</p>
          <button class="rb-btn" id="rbContinue">Continue</button>
        </div>

        <div class="profile-block">
          <div class="profile-av">
            <span class="pa-face"><span class="pa-eye"></span><span class="pa-eye r"></span><span class="pa-smile"></span></span>
            <button class="pa-edit" aria-label="Edit">✎</button>
            <span class="pa-badge">Free</span>
          </div>
          <h2>Hi ${name} - create a free account</h2>
          <button class="ghost-pill" id="viewProfile">View profile</button>
        </div>

        <div class="premium-mini">
          <span class="pm-glow"></span>
          <div class="pm-body">
            <h3>Supercharge your health with <em>Luna+</em></h3>
            <p>Build a clearer picture of what's happening inside your body.</p>
            <button class="pill-btn sm" id="pmStart">Get started</button>
          </div>
          <span class="pm-leaf"></span>
        </div>

        <div class="goal-row">
          <h3 class="goal-h">My goal</h3>
          <div class="goal-pills">
            ${["Track my cycle","Get pregnant","Track pregnancy","General wellness"]
              .map(g => `<button class="g-pill${g===goal?' on':''}">${g}</button>`).join("")}
          </div>
        </div>

        <div class="menu-card">
          ${menuRow("📄","Report for a doctor")}
          ${menuRow("🎁","Claim your referral")}
        </div>
        <div class="menu-card">
          ${menuRow("👤","Secret Chats profile")}
          ${menuRow("🙈","Hide content")}
          ${menuRow("🔒","App lock")}
          ${menuRow("📈","Graphs & reports")}
          ${menuRow("🔄","Cycle & ovulation")}
          ${menuRow("⚙️","App settings")}
          ${menuRow("🛡️","Privacy settings")}
          ${menuRow("🔔","Reminders")}
          ${menuRow("❓","Help")}
          ${menuRow("ℹ️","About Luna")}
          ${menuRow("🧹","Reset app data")}
        </div>

        <div class="protect-card">
          <span class="protect-ic">🛡️</span>
          <div><strong>Your data is protected</strong>
          <p>Your privacy comes first. We never sell your data, and you can delete it anytime.</p></div>
        </div>
        <button class="learn-btn">Learn more</button>

        <div class="set-foot">
          <div class="foot-links"><a>Privacy Policy</a><span>·</span><a>Terms of Use</a></div>
          <a class="foot-acc">Accessibility Statement</a>
          <div class="foot-brand">Luna <span>HEALTH</span></div>
        </div>
      </div>`;
    v.querySelector("#closeSettings").addEventListener("click", () => { buzz(); closeSettings(); });
    v.querySelectorAll(".g-pill").forEach(p => p.addEventListener("click", () => {
      v.querySelectorAll(".g-pill").forEach(x => x.classList.remove("on"));
      p.classList.add("on"); buzz(); toast("Goal updated: " + p.textContent);
    }));

    const SETTINGS_CONTENT = {
      "Report for a doctor": { type:"article", p:[
        "Generate a clean, one-page summary of your recent cycles, symptoms and patterns to bring to an appointment.",
        "It includes cycle length, period length, variation and flagged symptoms - nothing identifying unless you add it.",
        "Log a couple of cycles first so the report has something meaningful to say."], cta:"Generate report" },
      "Claim your referral": { type:"article", p:[
        "Invite a friend to Luna and you'll both get a free month of Luna+.",
        "Your code: LUMEN-" + ((userState.name||"YOU").toUpperCase().slice(0,4)) + "-26",
        "Share it however you like - it works once per new account."], cta:"Copy my code" },
      "Secret Chats profile": { type:"toggles", items:[
        "Use a separate display name in Secret Chats","Blur previews in the app switcher","Require unlock to open chats"] },
      "Hide content": { type:"toggles", items:[
        "Hide cycle info on the home widget","Use neutral app icon","Generic notifications (no details)"] },
      "App lock": { type:"toggles", items:[
        "Require Face ID / passcode to open","Lock after 1 minute in background","Hide content while locked"] },
      "Graphs & reports": { type:"article", p:[
        "Visualize cycle length, symptom frequency and mood trends across months.",
        "Charts unlock more detail the more consistently you log.",
        "Premium adds symptom heatmaps and exportable PDF reports."], cta:"Open graphs" },
      "Cycle & ovulation": { type:"toggles", items:[
        "Show predicted fertile window","Ovulation-day reminder","Late-period alert","Adjust predictions from my logs"] },
      "App settings": { type:"toggles", items:[
        "Haptic feedback","Sound effects","Start week on Monday","Dark mode (coming soon)"] },
      "Privacy settings": { type:"toggles", items:[
        "Anonymous usage analytics","Personalized content","Allow data export","Delete my data on request"] },
      "Reminders": { type:"toggles", items:[
        "Period coming up","Fertile window","Daily log nudge","Medication reminder","Wellness tips"] },
      "Help": { type:"article", p:[
        "Most answers live in the in-app guide - search any topic and get a plain-language explanation.",
        "Still stuck? The support team replies within a day, and nothing you share is ever sold.",
        "This is a prototype, so support is simulated here."], cta:"Open help center" },
      "About Luna": { type:"article", p:[
        "Luna is a calm, original women's-wellness concept - built to help you understand your body without anxiety.",
        "Version 1.0 · prototype build. Data persists locally on this device only - no servers, no payment.",
        "Made with care, soft gradients and a friendly battery-free mascot."], cta:"" },
      "Reset app data": { type:"article", p:[
        "Clears everything Luna has stored on this device - your profile, period logs, symptoms, journal entries and check-ins.",
        "This can't be undone. You'll be returned to onboarding the next time the app opens."], cta:"Reset everything", danger:true }
    };

    function openSettingDetail(label){
      const spec = SETTINGS_CONTENT[label];
      if (!spec) return toast(label);
      if (spec.type === "toggles") openSheet(label, toggleBody(spec.items), { tall: spec.items.length > 4 });
      else {
        const b = articleBody(spec.p, spec.cta || null);
        if (spec.cta) b.querySelector(".pill-btn").addEventListener("click", () => {
          buzz();
          if (spec.danger){
            if (window.LunaStore) window.LunaStore.clear();
            toast("All data cleared · reloading…");
            setTimeout(() => location.reload(), 800);
          } else {
            toast(spec.cta + " ✦"); closeSheet();
          }
        });
        openSheet(label, b);
      }
    }

    v.querySelectorAll(".menu-row").forEach(r => r.addEventListener("click", () => {
      buzz(); openSettingDetail(r.dataset.label);
    }));

    v.querySelector("#rbContinue").addEventListener("click", () => {
      buzz();
      const b = h("div", "art-body");
      b.innerHTML = `<p>Create a free account to keep your data safe across devices - or log in if you already have one.</p>`;
      const a = h("button", "pill-btn full", "Create free account");
      const c = h("button", "ghost-pill wide", "I'll do this later");
      a.addEventListener("click", () => { buzz(); toast("Account created ♡"); closeSheet();
        v.querySelector(".register-banner").style.display = "none"; });
      c.addEventListener("click", () => { buzz(); closeSheet(); });
      b.append(a, c);
      openSheet("Save your data", b);
    });
    v.querySelector("#viewProfile").addEventListener("click", () => {
      buzz();
      openSheet("Your profile", articleBody([
        `Name · ${userState.name || "Not set"}`,
        `Goal · ${(userState.goals && userState.goals[0]) || "Track my cycle"}`,
        `Age · ${userState.age || " - "} · Cycle · ${userState.cycleLength || 28} days`,
        "Edit any of this from the relevant section - this prototype keeps it in memory only."
      ], "Edit profile"));
    });
    v.querySelector("#pmStart").addEventListener("click", () => { buzz(); switchToToday(); });
    v.querySelector(".learn-btn").addEventListener("click", () => {
      buzz();
      openSheet("Your data is protected", articleBody([
        "Privacy is the default here, not a setting you have to find.",
        "We never sell your data. You can export or permanently delete everything at any time.",
        "This is a prototype, so no data actually leaves your browser."], "Got it"));
    });
    return v;
  }
  function menuRow(ic, label){
    return `<button class="menu-row" data-label="${label}">
      <span class="mr-ic">${ic}</span><span class="mr-label">${label}</span>
      <span class="mr-chev">›</span></button>`;
  }

  /* ---------- shell wiring ---------- */
  let views = {}, settingsEl = null;

  function switchTab(id){
    Object.entries(views).forEach(([k, el]) => el.classList.toggle("is-active", k === id));
    const sc = views[id].querySelector(".app-scroll") || views[id];
    sc.scrollTop = 0;
  }
  function openSettings(){
    settingsEl.classList.add("show");
  }
  function closeSettings(){
    settingsEl.classList.remove("show");
  }
  function switchToToday(){
    closeSettings();
    closeSheet();
    switchTab("today");
    const bar = shell.querySelector(".tabbar");
    if (bar){
      bar.querySelectorAll(".tab").forEach(t =>
        t.classList.toggle("on", t.dataset.tab === "today"));
    }
  }

  function enter(state){
    userState = state || {};
    shell.innerHTML = "";
    shell.setAttribute("aria-hidden", "false");

    views = {
      today: buildHome(),
      insights: buildInsights(),
      secret: buildJournal(),
      messages: buildMessages(),
      partner: buildPartner()
    };
    const viewport = h("div", "app-viewport");
    Object.values(views).forEach(vw => viewport.appendChild(vw));
    shell.appendChild(viewport);
    shell.appendChild(buildTabBar(switchTab));

    settingsEl = buildSettings();
    shell.appendChild(settingsEl);

    // reveal with a soft fade/zoom
    requestAnimationFrame(() => {
      device.classList.add("in-app");
      shell.classList.add("ready");
    });
    toast("Welcome to Luna - let's begin ♡");
  }

  window.LunaApp = { enter };
})();

/* ============================================================
   LunaLogin - sign-in overlay (Google / Apple / Email + OTP)
   ============================================================ */
(function(){
  let loginEl = null;
  let userInput = { email: "" };

  function h(tag, cls, html){
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function buzz(){ if (navigator.vibrate) navigator.vibrate(8); }

  /* --- SVG icons (original, hand-coded) --- */
  const ICON = {
    back:`<svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 4l-9 8 9 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    google:`<svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.51z"/>
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.23-2.5c-.9.6-2.05.95-3.38.95-2.6 0-4.8-1.76-5.58-4.12H3.08v2.58A10 10 0 0 0 12 22z"/>
      <path fill="#FBBC05" d="M6.42 13.9a6 6 0 0 1 0-3.8V7.52H3.08a10 10 0 0 0 0 8.96l3.34-2.58z"/>
      <path fill="#EA4335" d="M12 5.88c1.47 0 2.78.5 3.82 1.5l2.86-2.87A10 10 0 0 0 3.08 7.52L6.42 10.1C7.2 7.74 9.4 5.88 12 5.88z"/>
    </svg>`,
    apple:`<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M16.37 12.62c-.02-2.36 1.93-3.5 2.02-3.55-1.1-1.62-2.82-1.84-3.43-1.87-1.46-.15-2.85.86-3.59.86-.74 0-1.89-.84-3.11-.82-1.6.02-3.07.93-3.9 2.36-1.66 2.88-.42 7.14 1.2 9.48.79 1.14 1.74 2.43 2.97 2.38 1.19-.05 1.64-.77 3.08-.77 1.43 0 1.85.77 3.1.75 1.28-.02 2.1-1.17 2.89-2.32.92-1.32 1.29-2.62 1.31-2.69-.03-.01-2.52-.97-2.54-3.81zm-2.34-6.99c.66-.8 1.1-1.91.98-3.02-.95.04-2.1.64-2.78 1.44-.61.7-1.14 1.83-1 2.92 1.06.08 2.14-.54 2.8-1.34z"/>
    </svg>`,
    email:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>
    </svg>`
  };

  function open(){
    if (loginEl) return;
    loginEl = h("div", "login-shell");
    document.body.appendChild(loginEl);
    requestAnimationFrame(() => loginEl.classList.add("show"));
    renderMethod();
  }
  function close(){
    if (!loginEl) return;
    loginEl.classList.remove("show");
    const el = loginEl; loginEl = null;
    setTimeout(() => el.remove(), 380);
  }

  function header(onBack, transparent){
    const top = h("div", "li-top" + (transparent ? " transparent" : ""));
    top.innerHTML = `<button class="li-back" aria-label="Back">${ICON.back}</button>`;
    top.querySelector(".li-back").addEventListener("click", () => { buzz(); onBack(); });
    return top;
  }

  /* --- screen 1: choose method --- */
  function renderMethod(){
    loginEl.innerHTML = "";
    loginEl.appendChild(header(close, true));
    const inner = h("div", "li-inner");
    inner.innerHTML = `
      <div class="li-mark">
        <span class="li-petal a"></span><span class="li-petal b"></span><span class="li-petal c"></span>
        <span class="li-core"></span>
      </div>
      <h1 class="li-title">Welcome <em>back</em></h1>
      <p class="li-sub">Sign in to pick up where you left off.</p>
      <div class="li-methods">
        <button class="li-btn google" data-m="Google">
          <span class="li-ic">${ICON.google}</span><span>Continue with Google</span>
        </button>
        <button class="li-btn apple" data-m="Apple">
          <span class="li-ic">${ICON.apple}</span><span>Continue with Apple</span>
        </button>
        <button class="li-btn email" data-m="Email">
          <span class="li-ic">${ICON.email}</span><span>Continue with email</span>
        </button>
      </div>
      <p class="li-legal">By continuing, you agree to our <u>Terms</u> and <u>Privacy</u>.</p>
      <p class="li-foot">New to Luna? <a href="#" id="liCreate">Create an account</a></p>`;
    inner.querySelector("[data-m='Google']").addEventListener("click", () => { buzz(); ssoSignIn("Google"); });
    inner.querySelector("[data-m='Apple']").addEventListener("click", () => { buzz(); ssoSignIn("Apple"); });
    inner.querySelector("[data-m='Email']").addEventListener("click", () => { buzz(); renderEmail(); });
    inner.querySelector("#liCreate").addEventListener("click", e => { e.preventDefault(); buzz(); close(); });
    loginEl.appendChild(inner);
  }

  /* --- screen 2a: SSO simulated handoff --- */
  function ssoSignIn(provider){
    renderConfirming("Signing in with " + provider + "…");
    setTimeout(() => done({ name: "Maya", loginProvider: provider }), 1300);
  }

  /* --- screen 2b: email entry --- */
  function renderEmail(){
    loginEl.innerHTML = "";
    loginEl.appendChild(header(renderMethod));
    const inner = h("div", "li-inner");
    inner.innerHTML = `
      <h1 class="li-title">What's your <em>email?</em></h1>
      <p class="li-sub">We'll send a 6-digit code to confirm it's you. No passwords needed.</p>
      <div class="li-field">
        <input type="email" id="liEmail" inputmode="email" autocomplete="email"
          placeholder="you@example.com" value="${userInput.email}">
      </div>
      <button class="pill-btn full" id="liEmailNext" disabled>Send code</button>`;
    const input = inner.querySelector("#liEmail");
    const btn = inner.querySelector("#liEmailNext");
    const validate = () => {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      btn.disabled = !ok;
      return ok;
    };
    input.addEventListener("input", validate);
    validate();
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      buzz(); userInput.email = input.value.trim(); renderOTP();
    });
    loginEl.appendChild(inner);
    setTimeout(() => input.focus(), 150);
  }

  /* --- screen 3: 6-digit OTP --- */
  function renderOTP(){
    loginEl.innerHTML = "";
    loginEl.appendChild(header(renderEmail));
    const inner = h("div", "li-inner");
    inner.innerHTML = `
      <h1 class="li-title">Check your <em>inbox</em></h1>
      <p class="li-sub">We sent a 6-digit code to <strong>${userInput.email}</strong>.</p>
      <div class="li-otp">
        ${[0,1,2,3,4,5].map(i => `<input type="text" inputmode="numeric" maxlength="1" data-i="${i}" aria-label="Digit ${i+1}">`).join("")}
      </div>
      <p class="li-resend">Didn't get it? <a href="#" id="liResend">Resend code</a></p>
      <button class="pill-btn full" id="liVerify" disabled>Verify</button>`;
    const inputs = [...inner.querySelectorAll(".li-otp input")];
    const verify = inner.querySelector("#liVerify");
    function check(){
      const all = inputs.every(i => i.value);
      verify.disabled = !all;
      if (all) setTimeout(submitOTP, 150);
    }
    function submitOTP(){
      renderConfirming("Verifying…");
      setTimeout(() => done({ name: "Maya", email: userInput.email, loginProvider: "Email" }), 1300);
    }
    inputs.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        inp.value = inp.value.replace(/\D/g, "").slice(0, 1);
        if (inp.value && i < 5) inputs[i+1].focus();
        check();
      });
      inp.addEventListener("keydown", e => {
        if (e.key === "Backspace" && !inp.value && i > 0) inputs[i-1].focus();
      });
      inp.addEventListener("paste", e => {
        const txt = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
        if (txt.length === 6){
          e.preventDefault();
          inputs.forEach((x, idx) => x.value = txt[idx] || "");
          check();
        }
      });
    });
    setTimeout(() => inputs[0].focus(), 150);
    inner.querySelector("#liResend").addEventListener("click", e => {
      e.preventDefault(); buzz(); toast("New code sent ♡");
    });
    verify.addEventListener("click", () => { if (!verify.disabled) { buzz(); submitOTP(); } });
    loginEl.appendChild(inner);
  }

  /* --- transient: confirming / verifying state --- */
  function renderConfirming(msg){
    loginEl.innerHTML = "";
    const inner = h("div", "li-inner center");
    inner.innerHTML = `
      <div class="li-loader"><span class="orb"></span></div>
      <p class="li-loading">${msg}</p>`;
    loginEl.appendChild(inner);
  }

  /* --- complete: enter the app with a seeded "existing account" state --- */
  function done(state){
    const seeded = Object.assign({
      mood: "Great", age: "25-34", goals: ["Track my cycle"],
      cycleStatus: "I have menstrual cycles", cycleLength: 28, periodLength: 5,
      activity: "I fit in some active breaks", sleepHours: "7–8 hours",
      sleepImprove: [], lifestyleFocus: [], wellnessGoals: ["Better sleep"]
    }, state);
    if (window.LunaStore) window.LunaStore.set("userState", seeded);
    close();
    setTimeout(() => { if (window.LunaApp) window.LunaApp.enter(seeded); }, 250);
  }

  function toast(msg){
    if (!loginEl) return;
    const t = h("div", "li-toast", msg);
    loginEl.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 1900);
  }

  window.LunaLogin = { open };
})();

