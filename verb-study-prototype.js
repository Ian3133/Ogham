/* Workbook study and listening tests at #verbs. Local layout preview remains available.
 * French recordings are generated ahead of time; this page has no API credentials.
 * Run from this directory: node dev-server.mjs
 */
(() => {
  const local = ["localhost", "127.0.0.1"].includes(location.hostname);
  const isLocalPreview = () => local && location.hash === "#verb-study-prototype";
  const isRoute = () => location.hash === "#verbs" || isLocalPreview();
  const assetBase = local ? new URL("./", location.href) : new URL("https://ogham-content-ian-423575705842-us-east-1-an.s3.us-east-1.amazonaws.com/");
  const layouts = { A: "Spreadsheet", B: "Table + explanation", C: "Roomy rows" };
  const pronouns = { je: "I", tu: "you", il: "he", elle: "she", on: "one / informal we", nous: "we", vous: "you, plural or polite singular", ils: "they, masculine or mixed", elles: "they, feminine" };
  const state = {
    hidden: new Set(["English"]), revealed: new Set(), expanded: new Set(), selected: 0,
    choices: {}, verb: "Manger", section: "Conjugations", topic: "Présent",
    rate: "1", hover: true, playing: "", quiz: null
  };
  let corpus;
  let manifest;
  let loading;
  let root;
  let events;
  let playbackToken = 0;
  let activeAudio;
  let storageKey = "ogham-verb-mega:preview";
  const escape = (text) => String(text).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const normalize = (text) => String(text).normalize("NFC").replace(/[’']/g, "’").replace(/\s+/g, " ").trim();
  const speaker = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 3c2 2 2 6 0 8m3-11c4 4 4 10 0 14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const variant = () => Object.hasOwn(layouts, new URLSearchParams(location.search).get("variant")) ? new URLSearchParams(location.search).get("variant") : "A";
  const records = () => corpus.records.filter((record) => record.verb === state.verb && record.section === state.section && record.topic === state.topic);
  const topics = () => [...new Set(corpus.records.filter((record) => record.verb === state.verb && record.section === state.section).map((record) => record.topic))];
  const subjectLabel = (subject) => subject === "—" ? "—" : subject.charAt(0).toUpperCase() + subject.slice(1);

  function row(index) {
    const record = records()[index];
    const choice = record.variants.find((item) => item.subject === state.choices[record.id]) || record.variants[0];
    return { ...choice, index, form: record.form, record };
  }

  function audio(text, label, extra = "") {
    const ready = Boolean(manifest?.recordings[normalize(text)]);
    return `<button type="button" class="vs-audio ${extra}" data-say="${escape(text)}" aria-label="${escape(label)}" title="${escape(ready ? label : "Recording is being prepared")}" ${ready ? "" : "disabled"}>${speaker}</button>`;
  }

  function covered(index, field, content) {
    const key = `${index}:${field}`;
    const hidden = state.hidden.has(field) && !state.revealed.has(key);
    return `<div class="vs-cell ${hidden ? "is-covered" : ""}" data-cell="${key}" data-field="${field}">
      <div class="vs-cell-content" ${hidden ? 'inert aria-hidden="true"' : ""}>${content}</div>
      ${hidden ? `<button type="button" class="vs-mask" data-reveal="${key}" aria-label="Reveal ${field} for row ${index + 1}">Hover or tap to reveal</button>` : ""}
      ${state.hidden.has(field) && !hidden ? `<button type="button" class="vs-cover-again" data-cover="${key}" aria-label="Cover ${field} for row ${index + 1}">Hide</button>` : ""}
    </div>`;
  }

  function subjectCell(index) {
    const item = row(index);
    return item.record.variants.length > 1
      ? `<select class="vs-subject-select" data-subject="${index}" aria-label="Subject for row ${index + 1}">${item.record.variants.map((choice) => `<option value="${choice.subject}" ${choice.subject === item.subject ? "selected" : ""}>${subjectLabel(choice.subject)}</option>`).join("")}</select>`
      : `<span lang="fr">${escape(subjectLabel(item.subject))}</span>`;
  }

  function sentenceCell(item) {
    let cursor = 0;
    let words = "";
    for (const part of item.parts) {
      const position = item.sentence.indexOf(part.text, cursor);
      if (position < 0) continue;
      words += escape(item.sentence.slice(cursor, position));
      words += `<button type="button" class="vs-word" data-say="${escape(part.text)}" title="Hear this part: ${escape(part.text)}">${escape(part.text)}</button>`;
      cursor = position + part.text.length;
    }
    words += escape(item.sentence.slice(cursor));
    return `<div class="vs-sentence" lang="fr">${audio(item.sentence, `Hear sentence: ${item.sentence}`)}<span class="vs-phrase-parts">${words}</span></div>`;
  }

  function breakdown(item) {
    const spelling = item.record.verb === "Manger" && item.record.topic === "Présent" && item.subject === "nous";
    const form = spelling ? '<span class="vs-stem">mang</span><span class="vs-inserted">e</span><span class="vs-ending">ons</span>' : escape(item.form);
    return `<section class="vs-breakdown" aria-label="Breakdown for row ${item.index + 1}">
      <div class="vs-breakdown-heading"><span class="vs-eyebrow">Understand the pieces</span><strong lang="fr">${escape(item.sentence)}</strong></div>
      <div class="vs-pieces">
        ${pronouns[item.subject] ? `<div><span class="vs-piece-label">Subject</span><strong lang="fr">${escape(subjectLabel(item.subject))}</strong><span>${escape(pronouns[item.subject])}</span></div>` : ""}
        ${item.form ? `<div><span class="vs-piece-label">Verb form</span><strong lang="fr">${form}</strong><span>${escape(item.record.topic)}</span>${audio(item.form, `Hear form in breakdown: ${item.form}`)}</div>` : ""}
        ${item.parts.map((part) => `<div><span class="vs-piece-label">${escape(part.role)}</span><strong lang="fr">${escape(part.text)}</strong><span>${escape(part.meaning)}</span>${audio(part.text, `Hear part: ${part.text}`)}</div>`).join("")}
      </div>
      <p>${escape(item.record.rule)}</p>
      ${item.record.topic === "Présent" ? '<p class="vs-small">The present can describe a habit or something happening now. Context tells you whether this means “eat” or “am/is/are eating”, for example.</p>' : ""}
      ${item.record.corrections.length ? `<p class="vs-small">${escape(item.record.corrections.join(" "))}</p>` : ""}
      <p class="vs-small">Workbook reference: ${escape(item.record.source.sheet)}, row ${item.record.source.row}.</p>
    </section>`;
  }

  function table(withPanel) {
    return `<div class="${withPanel ? "vs-split" : ""}"><div class="vs-table-scroll" tabindex="0" aria-label="Verb study table; scroll sideways on a small screen">
      <table class="vs-table"><caption class="vs-sr-only">${escape(state.verb)}: ${escape(state.topic)}</caption>
        <thead><tr><th scope="col" class="vs-number">#</th><th scope="col">Person</th><th scope="col">Verb form</th><th scope="col">French sentence</th><th scope="col">English</th><th scope="col">Explain</th></tr></thead>
        <tbody>${records().map((_, index) => {
          const item = row(index);
          return `<tr class="${withPanel && state.selected === index ? "vs-selected-row" : ""}"><td class="vs-number">${index + 1}</td><th scope="row">${subjectCell(index)}</th>
            <td>${item.form ? covered(index, "verb", `<div class="vs-form" lang="fr"><strong>${escape(item.form)}</strong>${audio(item.form, `Hear verb: ${item.form}`)}</div>`) : "—"}</td>
            <td>${covered(index, "French", sentenceCell(item))}</td><td>${covered(index, "English", escape(item.english))}</td>
            <td><button type="button" class="vs-explain" data-explain="${index}" aria-expanded="${withPanel ? state.selected === index : state.expanded.has(index)}">${withPanel ? "Inspect" : state.expanded.has(index) ? "Close" : "Breakdown"}</button></td></tr>
            ${!withPanel && state.expanded.has(index) ? `<tr class="vs-detail-row"><td colspan="6">${breakdown(item)}</td></tr>` : ""}`;
        }).join("")}</tbody>
      </table></div>${withPanel ? `<aside class="vs-side-explanation">${breakdown(row(state.selected))}</aside>` : ""}</div>`;
  }

  function roomyRows() {
    return `<div class="vs-roomy-list">${records().map((_, index) => {
      const item = row(index);
      return `<section class="vs-roomy-row" aria-label="Row ${index + 1}">
        <div class="vs-roomy-main"><span class="vs-number">${index + 1}</span><div class="vs-roomy-person"><span class="vs-eyebrow">Person</span>${subjectCell(index)}</div>
          <div><span class="vs-eyebrow">Verb form</span>${item.form ? covered(index, "verb", `<div class="vs-form" lang="fr"><strong>${escape(item.form)}</strong>${audio(item.form, `Hear verb: ${item.form}`)}</div>`) : "—"}</div>
          <div class="vs-roomy-sentence"><span class="vs-eyebrow">French sentence</span>${covered(index, "French", sentenceCell(item))}</div>
          <button type="button" class="vs-explain" data-explain="${index}" aria-expanded="${state.expanded.has(index)}">${state.expanded.has(index) ? "Close" : "Breakdown"}</button>
        </div><div class="vs-roomy-english"><span class="vs-eyebrow">English</span>${covered(index, "English", escape(item.english))}</div>
        ${state.expanded.has(index) ? breakdown(item) : ""}</section>`;
    }).join("")}</div>`;
  }

  function setStatus(message) {
    const status = root?.querySelector("[data-speech-status]");
    if (status) status.textContent = message;
  }

  function stopSpeech() {
    playbackToken += 1;
    state.playing = "";
    if (activeAudio) { activeAudio.pause(); activeAudio.removeAttribute("src"); activeAudio.load(); activeAudio = null; }
    root?.querySelectorAll(".vs-speaking").forEach((button) => button.classList.remove("vs-speaking"));
  }

  function speak(text, button, options = {}) {
    stopSpeech();
    const path = manifest.recordings[normalize(text)];
    if (!path) { setStatus("This recording is still being prepared. Reload the preview when recording is complete."); return; }
    const token = playbackToken;
    const player = new Audio(new URL(path, assetBase).href);
    activeAudio = player;
    player.playbackRate = Number(state.rate);
    player.preservesPitch = true;
    state.playing = text;
    button?.classList.add("vs-speaking");
    setStatus(options.conceal ? "Playing the sentence…" : `Playing AI recording: ${text}`);
    const finish = (message, completed = false) => {
      if (token !== playbackToken) return;
      state.playing = "";
      button?.classList.remove("vs-speaking");
      setStatus(message);
      activeAudio = null;
      if (completed) options.onEnded?.();
    };
    player.onended = () => finish(options.conceal ? "Choose the form you heard." : `Finished: ${text}`, true);
    player.onerror = () => finish("The recording could not load. Reload this preview and try again.");
    player.play().catch(() => finish("Playback did not start. Tap a speaker to try again."));
  }

  function switchVariant(direction) {
    const keys = Object.keys(layouts);
    const next = keys[(keys.indexOf(variant()) + direction + keys.length) % keys.length];
    const url = new URL(location.href);
    url.searchParams.set("variant", next);
    history.replaceState(null, "", url);
    render(root);
  }

  function previewCell(cell, open) {
    if (!cell?.classList.contains("is-covered")) return;
    cell.classList.toggle("vs-preview", open);
    const content = cell.querySelector(".vs-cell-content");
    content.inert = !open;
    content.setAttribute("aria-hidden", String(!open));
  }

  function studySummary() {
    return `Layout ${variant()}: ${layouts[variant()]}. ${records().length} rows. ${state.hidden.size ? `Covered: ${[...state.hidden].join(", ")}. ${state.revealed.size} cells kept open.` : "All columns visible."} Hover preview ${state.hover ? "on" : "off"}.`;
  }

  function resetRows() {
    state.revealed.clear(); state.expanded.clear(); state.selected = 0;
  }

  function savedMega() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return saved?.version === 1 && saved.questions.length === corpus.records.length && saved.index >= 0 && saved.index < saved.questions.length && saved.answers.length <= saved.questions.length ? saved : null;
    } catch { return null; }
  }

  function saveMega() {
    const quiz = state.quiz;
    if (quiz?.scope !== "mega" || quiz.practice) return;
    try {
      if (quiz.complete) { localStorage.removeItem(storageKey); return; }
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, index: quiz.index, answers: quiz.answers,
        questions: quiz.questions.map((question) => ({ id: question.id, subject: question.example.subject, options: question.options })) }));
    } catch { /* Studying still works if this browser does not allow local storage. */ }
  }

  function resumeMega() {
    const saved = savedMega();
    if (!saved) return;
    const preferences = Object.fromEntries(saved.questions.map((question) => [question.id, question.subject]));
    const bank = window.OghamVerbQuiz.buildMegaQuestions(corpus.records, manifest.recordings, preferences);
    const byId = new Map(bank.map((question) => [question.id, question]));
    const questions = saved.questions.map((item) => {
      const question = byId.get(item.id);
      return question && item.options.includes(question.correct) ? { ...question, options: item.options } : null;
    });
    if (questions.some((question) => !question) || new Set(questions.map((question) => question.id)).size !== corpus.records.length || saved.answers.length < saved.index || saved.answers.length > saved.index + 1) return;
    state.quiz = { questions, scope: "mega", index: saved.index, heard: Boolean(saved.answers[saved.index]), answers: saved.answers, complete: false };
    render(root);
    if (!state.quiz.heard) playQuiz();
  }

  function startQuiz(questions, scope = "section", practice = false) {
    const bank = questions || (scope === "mega"
      ? window.OghamVerbQuiz.buildMegaQuestions(corpus.records, manifest.recordings, state.choices)
      : window.OghamVerbQuiz.buildQuestions(records(), corpus.records, manifest.recordings, state.choices));
    if (!bank.length) return;
    state.quiz = { questions: window.OghamVerbQuiz.shuffle(bank), scope, practice, index: 0, heard: false, answers: [], complete: false };
    saveMega();
    render(root);
    playQuiz();
  }

  function playQuiz() {
    const quiz = state.quiz;
    if (!quiz || quiz.complete) return;
    const question = quiz.questions[quiz.index];
    speak(question.example.sentence, root.querySelector("[data-quiz-play]"), {
      conceal: !quiz.answers[quiz.index],
      onEnded: () => {
        if (state.quiz !== quiz || quiz.questions[quiz.index] !== question) return;
        quiz.heard = true;
        render(root);
      }
    });
  }

  function renderQuiz() {
    const quiz = state.quiz;
    const correctCount = quiz.answers.filter((answer) => answer.correct).length;
    const current = quiz.questions[quiz.index];
    const heading = `<header class="topbar"><a class="brand" href="#"><span class="brand-vase" aria-hidden="true"></span>Ogham</a><button type="button" class="vs-explain" data-quiz-exit>Back to study</button></header><p class="vs-eyebrow">${quiz.scope === "mega" ? "Mega test · all six verbs" : `${escape(state.verb)} · ${escape(state.topic)}`}${quiz.practice ? " · missed forms" : ""}</p>`;
    if (quiz.complete) {
      const missed = quiz.questions.filter((_, index) => !quiz.answers[index].correct);
      root.innerHTML = `<section class="shell vs-shell vs-quiz-shell">${heading}<section class="vs-quiz-panel"><p class="vs-eyebrow">${quiz.scope === "mega" ? "Mega test" : "Section"} complete</p><h1>${correctCount} of ${quiz.questions.length} correct</h1><p>You listened to every example in this round.</p><div class="vs-quiz-actions">${missed.length ? `<button type="button" class="vs-quiz-primary" data-quiz-missed>Practise ${missed.length} missed ${missed.length === 1 ? "form" : "forms"}</button>` : ""}<button type="button" class="vs-explain" data-quiz-restart>${quiz.scope === "mega" ? "Try the mega test again" : "Try this section again"}</button><button type="button" class="vs-explain" data-quiz-exit>Back to study</button></div>${missed.length ? `<div class="vs-quiz-missed"><h2>Revisit these</h2>${missed.map((question) => `<p><small>${escape(question.record.verb)} · ${escape(question.record.topic)}</small><br><strong lang="fr">${escape(question.correct)}</strong> · <span lang="fr">${escape(question.example.sentence)}</span></p>`).join("")}</div>` : '<p class="vs-quiz-success">You recognised every form in this round.</p>'}</section></section>`;
    } else {
      const question = quiz.questions[quiz.index];
      const answer = quiz.answers[quiz.index];
      root.innerHTML = `<section class="shell vs-shell vs-quiz-shell">${heading}
        <div class="vs-quiz-progress"><span>Question ${quiz.index + 1} of ${quiz.questions.length}</span><span>${correctCount} correct</span></div><progress max="${quiz.questions.length}" value="${quiz.answers.length}" aria-label="Quiz progress"></progress>
        <section class="vs-quiz-panel" aria-label="Listening question">${quiz.scope === "mega" ? `<p class="vs-eyebrow">${escape(current.record.verb)} · ${escape(current.record.topic)}<br>${escape(window.OghamVerbGuide.typeFor(current.record.verb).label)}</p>` : ""}<h1>Listen, then choose the form.</h1><p>The full sentence appears after your answer.</p>
          <div class="vs-quiz-listen"><button type="button" class="vs-quiz-play" data-quiz-play aria-label="${quiz.heard ? "Replay sentence" : "Listen to sentence"}">${speaker}<span>${quiz.heard ? "Listen again" : "Listen"}</span></button><label>Speed<select data-quiz-rate aria-label="Quiz speech speed">${[["0.75", "Slow"], ["1", "Recorded speed"], ["1.15", "Faster"]].map(([value, label]) => `<option value="${value}" ${state.rate === value ? "selected" : ""}>${label}</option>`).join("")}</select></label><button type="button" class="vs-text-button" data-quiz-stop>Stop audio</button></div>
          <p class="vs-quiz-audio-status" data-speech-status role="status" aria-live="polite">${answer ? "Answer revealed." : quiz.heard ? "Choose the complete form you heard." : "Listen to the recording to see the choices."}</p>
          ${quiz.heard ? `<div class="vs-quiz-options" aria-label="Verb form choices">${question.options.map((form, index) => {
            const exact = form === question.correct;
            const valid = question.accepted.includes(form);
            const selected = answer?.selected === form;
            return `<button type="button" class="vs-quiz-option ${answer && valid ? "is-correct" : ""} ${answer && selected && !valid ? "is-wrong" : ""}" data-quiz-choice="${index}" ${answer ? "disabled" : ""}><span lang="fr">${escape(form)}</span>${answer ? `<small>${exact ? "Form in this example" : valid ? "Also valid by ear" : selected ? "Your answer" : ""}</small>` : ""}</button>`;
          }).join("")}</div>` : '<div class="vs-quiz-waiting">Listen first. The answer choices will appear here.</div>'}
          ${answer ? `<section class="vs-quiz-feedback ${answer.correct ? "is-correct" : "is-wrong"}" aria-label="Answer explanation"><h2>${answer.correct ? answer.exact ? "Correct." : "That spelling also fits the sound." : "Not quite."}</h2><p class="vs-quiz-french" lang="fr">${escape(question.example.sentence)}</p><p>${escape(question.example.english)}</p><p><strong>The form in this example: <span lang="fr">${escape(question.correct)}</span></strong></p>${question.accepted.length > 1 ? `<p>${question.accepted.map((form) => `<strong lang="fr">${escape(form)}</strong>`).join(" and ")} sound the same with these singular/plural subjects. Either spelling counts by ear; the transcript shows which subject this example uses.</p>` : ""}<p>${escape(question.record.rule)}</p></section><button type="button" class="vs-quiz-primary vs-quiz-next" data-quiz-next>${quiz.index + 1 === quiz.questions.length ? "See results" : "Next question"}</button>` : ""}
        </section><p class="vs-quiz-footnote">AI-generated French recordings. Listen for the subject and helping words too.${quiz.scope === "mega" && !quiz.practice ? " Your progress is saved on this browser. Return to study or Home, then choose Resume mega test." : ""}</p>
      </section>`;
    }
    if (quiz.complete) window.scrollTo({ top: 0, behavior: "instant" });
    else if (quiz.answers[quiz.index]) root.querySelector(".vs-quiz-feedback")?.scrollIntoView({ block: "nearest" });
    else if (quiz.heard) root.querySelector(".vs-quiz-options")?.scrollIntoView({ block: "nearest" });
    else window.scrollTo({ top: 0, behavior: "instant" });
    root.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.hasAttribute("data-quiz-exit")) { state.quiz = null; render(root); }
      else if (button.hasAttribute("data-quiz-play")) playQuiz();
      else if (button.hasAttribute("data-quiz-stop")) { stopSpeech(); setStatus("Audio stopped. Press Listen to try again."); }
      else if (button.hasAttribute("data-quiz-choice")) {
        if (!quiz.heard || quiz.answers[quiz.index]) return;
        const question = quiz.questions[quiz.index];
        quiz.answers[quiz.index] = window.OghamVerbQuiz.grade(question, question.options[Number(button.dataset.quizChoice)]);
        saveMega();
        render(root);
      } else if (button.hasAttribute("data-quiz-next")) {
        if (!quiz.answers[quiz.index]) return;
        if (quiz.index + 1 === quiz.questions.length) { quiz.complete = true; saveMega(); render(root); }
        else { quiz.index += 1; quiz.heard = false; saveMega(); render(root); playQuiz(); }
      } else if (button.hasAttribute("data-quiz-restart")) startQuiz(undefined, quiz.scope);
      else if (button.hasAttribute("data-quiz-missed")) startQuiz(quiz.questions.filter((_, index) => !quiz.answers[index].correct), quiz.scope, true);
    }, { signal: events.signal });
    root.addEventListener("change", (event) => {
      if (event.target.hasAttribute("data-quiz-rate")) { stopSpeech(); state.rate = event.target.value; setStatus("Speed changed. Press Listen to replay."); }
    }, { signal: events.signal });
  }

  async function render(host, options = {}) {
    if (options.userId && storageKey !== `ogham-verb-mega:${options.userId}`) {
      storageKey = `ogham-verb-mega:${options.userId}`;
      state.quiz = null;
    }
    events?.abort();
    stopSpeech();
    root = host;
    if (!document.querySelector("[data-verb-study-style]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet"; link.href = "verb-study-prototype.css"; link.dataset.verbStudyStyle = "";
      document.head.append(link);
    }
    if (!corpus) {
      root.innerHTML = '<section class="shell vs-shell"><h1>French verb study</h1><p role="status">Loading the workbook and its recordings…</p></section>';
      loading ||= Promise.all(["verb-study-data.json", new URL("audio/verb-study/manifest.json", assetBase).href].map(async (path) => {
        const response = await fetch(path, { cache: "no-store" });
        if (!response.ok) throw new Error(`Could not load ${path}.`);
        return response.json();
      })).then(([data, recordings]) => { corpus = data; manifest = recordings; });
      try { await loading; }
      catch { loading = null; root.innerHTML = '<section class="shell vs-shell"><a href="#">Home</a><h1>French verb study</h1><p>The workbook or recordings could not load. Reload this page to try again.</p></section>'; return; }
      if (!isRoute()) return;
    }
    events = new AbortController();
    if (state.quiz) { renderQuiz(); return; }
    const current = variant();
    const verb = corpus.verbs.find((item) => item.name === state.verb);
    const guide = window.OghamVerbGuide;
    const type = guide.typeFor(state.verb);
    const topic = guide.topics[state.topic];
    const saved = savedMega();
    root.innerHTML = `<section class="shell vs-shell">
      <header class="topbar"><a class="brand" href="#" aria-label="Ogham Home"><span class="brand-vase" aria-hidden="true"></span>Ogham</a><a class="vs-home-link" href="#">Home</a></header>
      <div class="vs-title-row"><div><p class="vs-eyebrow">French verb study</p><h1>${escape(state.verb)} <span>${escape(verb.meaning)}</span></h1><p class="vs-intro">See the pattern. Hear the French. Hover to uncover the meaning.</p></div><div class="vs-tense-label"><strong>${escape(state.topic)}</strong><span>${escape(type.label)}</span></div></div>
      <div class="vs-filters" aria-label="Workbook navigation"><label>Verb<select data-filter="verb" aria-label="Verb">${corpus.verbs.map((item) => `<option ${item.name === state.verb ? "selected" : ""}>${escape(item.name)}</option>`).join("")}</select></label><label>Section<select data-filter="section" aria-label="Section">${["Conjugations", "Additional forms", "Grammar & usage"].map((section) => `<option ${section === state.section ? "selected" : ""}>${escape(section)}</option>`).join("")}</select></label><label class="vs-topic-filter">${state.section === "Conjugations" ? "Tense / mood" : "Topic"}<select data-filter="topic" aria-label="Tense or topic">${topics().map((topic) => `<option ${topic === state.topic ? "selected" : ""}>${escape(topic)}</option>`).join("")}</select></label><span>${corpus.records.length} workbook entries</span></div>
      <section class="vs-guide" aria-label="English study guide"><details><summary>${escape(type.label)} · what does that mean?</summary><p>${escape(type.definition)}</p><div class="vs-type-list">${Object.values(guide.types).map((item) => `<p><strong>${escape(item.label)}</strong><br>${escape(item.definition)}</p>`).join("")}</div></details><div><p class="vs-eyebrow">${escape(state.section)}</p><p>${escape(guide.sections[state.section])}</p><h2>${escape(topic[0])}</h2><p>${escape(topic[1])}</p></div></section>
      <div class="vs-toolbar" aria-label="Study controls"><div class="vs-hide-controls"><span class="vs-control-label">Cover columns</span>${["verb", "French", "English"].map((field) => `<label class="vs-toggle"><input type="checkbox" data-hide="${field}" ${state.hidden.has(field) ? "checked" : ""}>${field === "verb" ? "Verb form" : field}</label>`).join("")}<button type="button" class="vs-text-button" data-show-all>Show everything</button><button type="button" class="vs-text-button" data-cover-all ${state.hidden.size ? "" : "disabled"}>Cover again</button></div><label class="vs-hover-toggle"><input type="checkbox" data-hover ${state.hover ? "checked" : ""}>Preview on hover</label></div>
      <div class="vs-audio-toolbar"><span class="vs-recorded-voice"><strong>Marin</strong><span>AI-generated French recordings</span></span><label>Speed<select data-rate aria-label="Speech speed">${[["0.75", "Slow"], ["1", "Recorded speed"], ["1.15", "Faster"]].map(([value, label]) => `<option value="${value}" ${state.rate === value ? "selected" : ""}>${label}</option>`).join("")}</select></label><button type="button" class="vs-text-button" data-stop>Stop audio</button><p data-speech-status role="status" aria-live="polite">Ready. Tap a speaker or a French phrase to listen.</p></div>
      <div class="vs-pattern"><strong>${escape(state.section)}</strong><span>${records().length} ${records().length === 1 ? "entry" : "entries"} in this view</span>${state.verb === "Manger" && state.topic === "Présent" ? '<span class="vs-pattern-note">With <strong lang="fr">nous</strong>, keep an extra <strong>e</strong>: <strong lang="fr">mangeons</strong>.</span>' : ""}</div>
      <div class="vs-content" data-layout="${current}">${current === "C" ? roomyRows() : table(current === "B")}</div>
      <section class="vs-section-test"><div><strong>Ready to try this section?</strong><p>Hear a sentence, choose its verb form, then reveal the full example.</p></div><button type="button" class="vs-quiz-primary" data-start-quiz>Test this section</button></section>
      <section class="vs-section-test vs-mega-test"><div><strong>Mega test · all six verbs</strong><p>${corpus.records.length} questions, shuffled across every tense, form and grammar section. You can pause and resume on this browser.</p></div><div class="vs-mega-actions">${saved ? `<button type="button" class="vs-quiz-primary" data-resume-mega>Resume mega test · ${saved.answers.length}/${corpus.records.length}</button>` : ""}<button type="button" class="${saved ? "vs-explain" : "vs-quiz-primary"}" data-start-mega>${saved ? "Start a new mega test" : `Start mega test · ${corpus.records.length} questions`}</button></div></section>
      <footer class="vs-footer"><p>Hover previews a covered cell. Tap keeps it open. Recordings play when you press a speaker or phrase.</p><p data-study-state aria-live="polite">${studySummary()}</p></footer>
      ${isLocalPreview() ? `<nav class="vs-switcher" aria-label="Preview layouts"><button type="button" data-variant="-1" aria-label="Previous layout">←</button><div><span>Compare layouts</span><strong>${current} · ${layouts[current]}</strong></div><button type="button" data-variant="1" aria-label="Next layout">→</button></nav>` : ""}
    </section>`;
    root.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      const cell = event.target.closest(".vs-cell.is-covered");
      if (cell && (button?.hasAttribute("data-reveal") || cell.classList.contains("vs-preview"))) {
        state.revealed.add(cell.dataset.cell);
        cell.classList.remove("is-covered", "vs-preview");
        cell.querySelector(".vs-mask")?.remove();
        const content = cell.querySelector(".vs-cell-content");
        content.inert = false; content.removeAttribute("aria-hidden");
        const hide = document.createElement("button");
        hide.type = "button"; hide.className = "vs-cover-again"; hide.dataset.cover = cell.dataset.cell; hide.textContent = "Hide";
        hide.setAttribute("aria-label", `Cover ${cell.dataset.field} for row ${Number(cell.dataset.cell.split(":")[0]) + 1}`);
        cell.append(hide);
        root.querySelector("[data-study-state]").textContent = studySummary();
      }
      if (!button) return;
      if (button.hasAttribute("data-start-quiz")) startQuiz();
      else if (button.hasAttribute("data-start-mega")) startQuiz(undefined, "mega");
      else if (button.hasAttribute("data-resume-mega")) resumeMega();
      else if (button.hasAttribute("data-say")) speak(button.dataset.say, button);
      else if (button.hasAttribute("data-cover")) { state.revealed.delete(button.dataset.cover); render(root); }
      else if (button.hasAttribute("data-explain")) {
        const index = Number(button.dataset.explain); state.selected = index;
        state.expanded.has(index) ? state.expanded.delete(index) : state.expanded.add(index);
        render(root);
      } else if (button.hasAttribute("data-show-all")) { state.hidden.clear(); state.revealed.clear(); render(root); }
      else if (button.hasAttribute("data-cover-all")) { state.revealed.clear(); render(root); }
      else if (button.hasAttribute("data-stop")) { stopSpeech(); setStatus("Audio stopped."); }
      else if (button.hasAttribute("data-variant")) switchVariant(Number(button.dataset.variant));
    }, { signal: events.signal });
    root.addEventListener("change", (event) => {
      const input = event.target;
      if (input.hasAttribute("data-filter")) {
        state[input.dataset.filter] = input.value;
        if (!topics().includes(state.topic)) state.topic = topics()[0];
        resetRows(); render(root);
      } else if (input.hasAttribute("data-hide")) {
        input.checked ? state.hidden.add(input.dataset.hide) : state.hidden.delete(input.dataset.hide);
        state.revealed = new Set([...state.revealed].filter((key) => key.split(":")[1] !== input.dataset.hide));
        render(root);
      } else if (input.hasAttribute("data-hover")) { state.hover = input.checked; render(root); }
      else if (input.hasAttribute("data-subject")) { state.choices[records()[Number(input.dataset.subject)].id] = input.value; render(root); }
      else if (input.hasAttribute("data-rate")) { stopSpeech(); state.rate = input.value; setStatus("Speed changed. Tap a speaker to listen."); }
    }, { signal: events.signal });
    root.addEventListener("pointerover", (event) => {
      if (state.hover && event.pointerType === "mouse") previewCell(event.target.closest(".vs-cell"), true);
    }, { signal: events.signal });
    root.addEventListener("pointerout", (event) => {
      const cell = event.target.closest(".vs-cell");
      if (cell && !cell.contains(event.relatedTarget)) previewCell(cell, false);
    }, { signal: events.signal });
  }

  window.addEventListener("keydown", (event) => {
    if (!isRoute() || !corpus || event.target.closest("input, textarea, select, [contenteditable]")) return;
    if (state.quiz) {
      if (event.key === "Escape") { state.quiz = null; render(root); }
      return;
    }
    if (isLocalPreview() && (event.key === "ArrowLeft" || event.key === "ArrowRight")) { event.preventDefault(); switchVariant(event.key === "ArrowLeft" ? -1 : 1); }
  });
  window.addEventListener("hashchange", () => { if (!isRoute()) { events?.abort(); stopSpeech(); } });
  window.addEventListener("pagehide", stopSpeech);
  window.OghamVerbStudyPrototype = { isRoute, isLocalPreview, render };
})();
