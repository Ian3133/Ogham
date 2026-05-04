let courseItems = [
  {
    id: "intro",
    type: "intro",
    title: "Introduction",
    language: "Leçon",
    description: "A short walkthrough before the first lesson.",
    slides: [
      {
        title: "",
        body: ""
      },
      {
        title: "",
        body: ""
      },
      {
        title: "",
        body: ""
      }
    ]
  },
  {
    id: "lesson-1",
    type: "lesson",
    title: "Lesson 1: Comment allez-vous ?",
    titleAudio: "audio/L001-French ASSIMIL/S00-TITLE.mp3",
    titleEnglish: "How are you?",
    language: "French",
    description: "A connected story for slow reading, listening, and sentence-by-sentence translation.",
    notes: {
      1: "<strong>bonjour</strong> literally means <strong>good (bon) day (jour)</strong>. It can be used as the equivalent of <strong>good morning</strong> but also as a formal way of saying <strong>hello</strong> throughout the day until around 6 pm.",
      2: "<strong>allez</strong> comes from the irregular verb <strong>aller</strong>, <strong>to go</strong>, the verb used to enquire about someone's health or well-being instead of <strong>to be</strong> in English: <strong>How are you?</strong> <strong>Allez</strong> is the form used with the formal address for you (<strong>vous</strong>) when speaking to people other than close friends or family.",
      3: "<strong>va</strong> is the third-person singular (<strong>he/she/it</strong>) of <strong>aller</strong>.",
      4: "<strong>présenter</strong> means <strong>to present</strong> but, in this context, <strong>to introduce</strong>. <strong>Je vous présente</strong> is the equivalent of <strong>May I introduce</strong>, <strong>I would like to introduce</strong>, etc.",
      5: "<strong>Comment ça va ?</strong> <strong>How are you doing?</strong> is equivalent to <strong>Comment allez-vous ?</strong>, but slightly more familiar. Here, <strong>Jeanne</strong> is talking to her friend's daughter, so she uses a less formal phrase."
    },
    lines: [
      {
        french: "Bonjour Jeanne, comment allez-vous ?",
        parts: [
          "Bonjour",
          { note: 1 },
          " Jeanne, comment allez-vous",
          { note: 2 },
          " ?"
        ],
        english: "Hello Jeanne, how are you (how go-you)?",
        audio: "audio/L001-French ASSIMIL/S01.mp3"
      },
      {
        french: "Bien, et vous ?",
        english: "Weil, and you?",
        audio: "audio/L001-French ASSIMIL/S02.mp3"
      },
      {
        french: "Ça va très bien, merci.",
        parts: [
          "Ça va",
          { note: 3 },
          " très bien, merci."
        ],
        english: "(lt goes) Very well, thanks.",
        audio: "audio/L001-French ASSIMIL/S03.mp3"
      },
      {
        french: "Je vous présente ma fille, Chloé.",
        parts: [
          "Je vous présente",
          { note: 4 },
          " ma fille, Chloé."
        ],
        english: "Let me introduce (I presentyou) my daughter, Chloé.",
        audio: "audio/L001-French ASSIMIL/S04.mp3"
      },
      {
        french: "Bonjour, Chloé. Comment ça va ?",
        parts: [
          "Bonjour, Chloé. Comment ça va",
          { note: 5 },
          " ?"
        ],
        english: "Hello, Chloé. How are you (it goes)?",
        audio: "audio/L001-French ASSIMIL/S05.mp3"
      }
    ],
    tests: [
      {
        id: "lesson-1-test-1",
        title: "Exercice 1 - Traduisez",
        instructions: "Listen, then rebuild the French sentence in order.",
        distractors: ["merci", "Jeanne", "Bonjour", "fille", "et", "vous"],
        items: [
          {
            answer: ["Bonjour", "comment", "allez-vous"],
            punctuation: [",", "", " ?"],
            english: "Hello, how are you?",
            audio: "audio/L001-French ASSIMIL/T01.mp3"
          },
          {
            answer: ["Ça", "va", "très", "bien"],
            punctuation: ["", "", "", "."],
            english: "I'm very well.",
            audio: "audio/L001-French ASSIMIL/T02.mp3"
          },
          {
            answer: ["Comment", "ça", "va", "Jean"],
            punctuation: ["", "", ",", " ?"],
            english: "How are you, Jean?",
            audio: "audio/L001-French ASSIMIL/T03.mp3"
          },
          {
            answer: ["Je", "vous", "présente", "ma", "fille"],
            punctuation: ["", "", "", "", "."],
            english: "Let me introduce my daughter.",
            audio: "audio/L001-French ASSIMIL/T04.mp3"
          },
          {
            answer: ["Chloé", "va", "très", "bien"],
            punctuation: ["", "", "", "."],
            english: "Chloé is very well.",
            audio: "audio/L001-French ASSIMIL/T05.mp3"
          }
        ]
      },
      {
        id: "lesson-1-test-2",
        title: "Exercice 2 - Complétez",
        subtitle: "Exercise 2 - Fill in the missing words",
        instructions: "Each dot represents a character, which can be a letter, an apostrophe, a hyphen, etc.",
        items: [
          {
            english: "How are you?",
            parts: [{ answer: "Comment" }, "allez-vous ?"]
          },
          {
            english: "Very well, thank you.",
            parts: ["Ça", { answer: "va" }, "très bien,", { answer: "merci" }, "."]
          },
          {
            english: "Let me introduce Jeanne and Chloé.",
            parts: ["Je vous", { answer: "présente" }, "Jeanne", { answer: "et" }, "Chloé."]
          },
          {
            english: "Well, and you?",
            parts: [{ answer: "Bien" }, "et vous ?"]
          },
          {
            english: "My first lesson.",
            parts: ["Ma", { answer: "première" }, "leçon."]
          }
        ]
      }
    ]
  },
  {
    id: "lesson-2",
    type: "lesson",
    title: "Lesson 2",
    titleAudio: "",
    titleEnglish: "",
    language: "French",
    description: "Lesson 2 content will go here when you add the sentences, audio, notes, and tests.",
    notes: {},
    lines: [],
    tests: []
  }
];
let lessons = courseItems.filter((item) => item.type === "lesson");
const progressKey = "ogham-progress";
const lessonAudioProgressKey = "ogham-lesson-audio-progress";
const contentBaseUrl = "https://ogham-content-ian-423575705842-us-east-1-an.s3.us-east-1.amazonaws.com/";
const remoteLessonFiles = [
  "lessons/lesson-1-comment-allez-vous.json",
  "lessons/lesson-2-le-cafe.json"
];

const app = document.querySelector("#app");
let currentAudio = null;
let currentAudioButton = null;
let currentDingContext = null;
let playbackToken = 0;
let activeTest = {
  lesson: null,
  test: null,
  itemIndex: 0,
  selected: [],
  attempts: {},
  submittedCounts: {}
};
let activeFillTest = {
  lesson: null,
  test: null,
  answers: [],
  results: {},
  attempts: {}
};
const scorePenalty = 0.25;
const passingRatio = 0.7;

function setRoute(route) {
  stopCurrentAudio();
  window.location.hash = route;
}

function renderLoading() {
  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
      </div>
      <section class="complete-panel">
        <p class="correct-kicker">Loading</p>
        <h1>Preparing lessons...</h1>
      </section>
    </section>
  `;
}

async function loadRemoteLessons() {
  try {
    const remoteLessons = await Promise.all(remoteLessonFiles.map(async (file) => {
      const response = await fetch(getContentUrl(file));

      if (!response.ok) {
        throw new Error(`Could not load ${file}: ${response.status}`);
      }

      return hydrateLessonAssets(await response.json());
    }));

    courseItems = courseItems.map((item) => {
      const remoteLesson = remoteLessons.find((lesson) => lesson.id === item.id);

      return remoteLesson || item;
    });
    lessons = courseItems.filter((item) => item.type === "lesson");
  } catch (error) {
    console.warn("Using embedded lessons because remote lessons could not load.", error);
  }
}

function hydrateLessonAssets(lesson) {
  return {
    ...lesson,
    titleAudio: getLessonAssetUrl(lesson, lesson.titleAudio),
    lines: lesson.lines.map((line) => ({
      ...line,
      audio: getLessonAssetUrl(lesson, line.audio)
    })),
    tests: lesson.tests.map((test) => ({
      ...test,
      items: test.items.map((item) => ({
        ...item,
        audio: getLessonAssetUrl(lesson, item.audio)
      }))
    }))
  };
}

function getLessonAssetUrl(lesson, path) {
  return getContentUrl(normalizeLessonAssetPath(lesson, path));
}

function normalizeLessonAssetPath(lesson, path) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) {
    return path;
  }

  const folderByLesson = {
    "lesson-1": "L001-French ASSIMIL",
    "lesson-2": "L002-French ASSIMIL"
  };
  const folder = folderByLesson[lesson.id];

  if (!folder) {
    return path;
  }

  if (path === `audio/${lesson.id}/title.mp3`) {
    return `audio/${folder}/S00-TITLE.mp3`;
  }

  const storyMatch = path.match(new RegExp(`^audio/${lesson.id}/story-(\\d+)\\.mp3$`));
  if (storyMatch) {
    return `audio/${folder}/S${storyMatch[1]}.mp3`;
  }

  const testMatch = path.match(new RegExp(`^audio/${lesson.id}/test-(\\d+)\\.mp3$`));
  if (testMatch) {
    return `audio/${folder}/T${testMatch[1]}.mp3`;
  }

  return path;
}

function getContentUrl(path) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) {
    return path;
  }

  return new URL(path, contentBaseUrl).href;
}

function getProgress() {
  const saved = window.localStorage.getItem(progressKey);

  if (!saved) {
    return {
      completed: []
    };
  }

  return JSON.parse(saved);
}

function saveProgress(progress) {
  window.localStorage.setItem(progressKey, JSON.stringify(progress));
}

function getLessonAudioProgress() {
  const saved = window.localStorage.getItem(lessonAudioProgressKey);

  if (!saved) {
    return {
      completed: []
    };
  }

  return JSON.parse(saved);
}

function isLessonAudioComplete(lessonId) {
  return getLessonAudioProgress().completed.includes(lessonId);
}

function completeLessonAudio(lessonId) {
  const progress = getLessonAudioProgress();

  if (!progress.completed.includes(lessonId)) {
    progress.completed.push(lessonId);
    window.localStorage.setItem(lessonAudioProgressKey, JSON.stringify(progress));
  }
}

function isLessonTestUnlocked(lesson) {
  return !lesson.lines.some((line) => line.audio) || isLessonAudioComplete(lesson.id);
}

function isItemCompleted(itemId) {
  return getProgress().completed.includes(itemId);
}

function completeItem(itemId) {
  const progress = getProgress();

  if (!progress.completed.includes(itemId)) {
    progress.completed.push(itemId);
    saveProgress(progress);
  }
}

function isItemUnlocked(itemId) {
  const itemIndex = courseItems.findIndex((item) => item.id === itemId);

  if (itemIndex <= 0) {
    return true;
  }

  return isItemCompleted(courseItems[itemIndex - 1].id);
}

function getNextAvailableItem() {
  return courseItems.find((item) => isItemUnlocked(item.id) && !isItemCompleted(item.id)) || courseItems[courseItems.length - 1];
}

function getItem(itemId) {
  return courseItems.find((item) => item.id === itemId);
}

function render() {
  const route = window.location.hash.replace("#", "");
  const routeItem = getItem(route);

  if (route === "history") {
    renderHistory();
    return;
  }

  if (route === "intro") {
    renderIntro(courseItems[0]);
    return;
  }

  if (routeItem?.type === "lesson") {
    renderLockedAwareLesson(routeItem);
    return;
  }

  const testRoute = getTestRoute(route);

  if (testRoute) {
    if (!isItemUnlocked(testRoute.lesson.id)) {
      renderLockedItem(testRoute.lesson);
      return;
    }

    if (!isLessonTestUnlocked(testRoute.lesson)) {
      renderLesson(testRoute.lesson);
      return;
    }

    if (testRoute.testIndex === 0) {
      renderPartOneIntro(testRoute.lesson, testRoute.test);
    } else {
      renderFillIntro(testRoute.lesson, testRoute.test);
    }
    return;
  }

  renderHome();
}

function getTestRoute(route) {
  for (const lesson of lessons) {
    const testIndex = lesson.tests.findIndex((test) => test.id === route);

    if (testIndex !== -1) {
      return {
        lesson,
        test: lesson.tests[testIndex],
        testIndex
      };
    }
  }

  return null;
}

function renderHome() {
  const currentItem = getNextAvailableItem();
  const isLocked = !isItemUnlocked(currentItem.id);

  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button" data-history>Chronicle</button>
      </div>
      <div class="home-grid">
        <section class="intro" aria-labelledby="home-title">
          <h1 id="home-title">Read one small story at a time.</h1>
          <p>Move through the introduction, then unlock each lesson in order. Older lessons stay available in the Chronicle.</p>
        </section>
        <button class="booklet ${isLocked ? "locked" : ""}" type="button" aria-label="Open ${currentItem.title}" ${isLocked ? "disabled" : ""}>
          <span class="booklet-kicker">${currentItem.language}</span>
          <span class="booklet-title">${currentItem.title}</span>
          <span class="booklet-footer">${getItemStatusLabel(currentItem)}</span>
        </button>
      </div>
    </section>
  `;

  app.querySelector("[data-history]").addEventListener("click", () => setRoute("history"));
  app.querySelector(".booklet").addEventListener("click", () => setRoute(currentItem.id));
}

function getItemStatusLabel(item) {
  if (!isItemUnlocked(item.id)) {
    return "Locked";
  }

  if (isItemCompleted(item.id)) {
    return "Completed";
  }

  if (item.type === "intro") {
    return `${item.slides.length} slides`;
  }

  return item.lines.length ? `${item.lines.length} story lines` : "Empty for now";
}

function renderHistory() {
  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button">Back home</button>
      </div>
      <header class="lesson-header">
        <h1>Chronicle</h1>
        <p class="lesson-lede">Revisit completed lessons, continue the current one, and preview what is still locked.</p>
      </header>
      <section class="history-list" aria-label="Course history">
        ${courseItems.map(createHistoryItem).join("")}
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(""));
  app.querySelectorAll("[data-open-item]").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.openItem));
  });
}

function createHistoryItem(item) {
  const unlocked = isItemUnlocked(item.id);
  const completed = isItemCompleted(item.id);
  const status = completed ? "Completed" : unlocked ? "Available" : "Locked";

  return `
    <article class="history-item ${unlocked ? "" : "locked"}">
      <div>
        <p class="history-kicker">${item.language}</p>
        <h2>${item.title}</h2>
        <p>${getItemStatusLabel(item)}</p>
      </div>
      <button class="text-button" type="button" data-open-item="${item.id}" ${unlocked ? "" : "disabled"}>${status}</button>
    </article>
  `;
}

function renderIntro(introItem, slideIndex = 0) {
  const slide = introItem.slides[slideIndex];
  const isLastSlide = slideIndex === introItem.slides.length - 1;

  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button">Back home</button>
      </div>
      <section class="slide-panel" aria-label="Introduction slide">
        <p class="test-progress">Slide ${slideIndex + 1} of ${introItem.slides.length}</p>
        <h1>${slide.title || " "}</h1>
        <p class="lesson-lede">${slide.body || " "}</p>
        <div class="slide-dots" aria-hidden="true">
          ${introItem.slides.map((_, index) => `<span class="${index === slideIndex ? "active" : ""}"></span>`).join("")}
        </div>
        <button class="primary-button" type="button" data-next-slide>${isLastSlide ? "Complete Introduction" : "Next"}</button>
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(""));
  app.querySelector("[data-next-slide]").addEventListener("click", () => {
    if (isLastSlide) {
      completeItem(introItem.id);
      setRoute("lesson-1");
      return;
    }

    renderIntro(introItem, slideIndex + 1);
  });
}

function renderLockedAwareLesson(lesson) {
  if (!isItemUnlocked(lesson.id)) {
    renderLockedItem(lesson);
    return;
  }

  renderLesson(lesson);
}

function renderLockedItem(item) {
  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button">Back home</button>
      </div>
      <section class="complete-panel">
        <p class="correct-kicker">Locked</p>
        <h1>${item.title}</h1>
        <p class="lesson-lede">Complete the previous section to unlock this lesson.</p>
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(""));
}

function renderLesson(lesson) {
  const lineMarkup = lesson.lines.length
    ? lesson.lines.map((line, index) => createLine(line, index, lesson.notes)).join("")
    : `<article class="story-line empty-lesson"><p>Lesson content coming later.</p></article>`;
  const testUnlocked = isLessonTestUnlocked(lesson);
  const testMarkup = lesson.tests.length
    ? `<p data-test-lock-status>${testUnlocked ? "Practice with listening, sentence building, and fill-in review." : "Listen through the final story audio to unlock the test."}</p><button class="primary-button" type="button" data-test="${lesson.tests[0].id}" ${testUnlocked ? "" : "disabled"}>${testUnlocked ? "Start Test" : "Locked"}</button>`
    : `<p>Exercise content coming later.</p>`;

  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button">Back home</button>
      </div>
      <header class="lesson-header">
        <div class="lesson-title-row">
          <h1>${lesson.title}</h1>
          <button class="icon-button" type="button" data-title-audio="${lesson.titleAudio}" title="Play title audio" aria-label="Play title audio">▶</button>
        </div>
        ${lesson.titleEnglish ? `<p class="title-translation">${lesson.titleEnglish}</p>` : ""}
        <p class="lesson-lede">${lesson.description}</p>
      </header>
      <section class="story-list" aria-label="${lesson.title} story lines">
        ${lineMarkup}
      </section>
      <aside class="note-tray" aria-live="polite" aria-label="Lesson note"></aside>
      <section class="next-steps" aria-label="Lesson practice placeholders">
        <article class="test-placeholder">
          <h2>Test</h2>
          ${testMarkup}
        </article>
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(""));
  app.querySelectorAll("[data-test]").forEach((button) => {
    button.addEventListener("click", (event) => {
      setRoute(event.currentTarget.dataset.test);
    });
  });
  app.querySelectorAll("[data-reveal]").forEach((button) => {
    button.addEventListener("click", () => {
      app.querySelectorAll(".translation.visible").forEach((openTranslation) => {
        if (openTranslation.id !== button.dataset.reveal) {
          openTranslation.classList.remove("visible");
        }
      });

      app.querySelectorAll("[data-reveal]").forEach((revealButton) => {
        if (revealButton !== button) {
          revealButton.textContent = "Reveal English";
        }
      });

      const translation = app.querySelector(`#${button.dataset.reveal}`);
      const isVisible = translation.classList.toggle("visible");
      button.textContent = isVisible ? "Hide English" : "Reveal English";
    });
  });

  app.querySelectorAll("[data-audio]").forEach((button) => {
    button.addEventListener("click", () => playLineAudio(button, lesson));
  });
  app.querySelectorAll("[data-note]").forEach((button) => {
    button.addEventListener("click", () => toggleNote(button, lesson.notes));
  });
  const titleAudioButton = app.querySelector("[data-title-audio]");
  if (titleAudioButton) {
    titleAudioButton.addEventListener("click", (event) => {
      if (event.currentTarget.dataset.titleAudio) {
        playAudio(event.currentTarget.dataset.titleAudio);
      }
    });
  }
}

function createLine(line, index, notes) {
  const translationId = `translation-${index + 1}`;
  const hasAudio = Boolean(line.audio);

  return `
    <article class="story-line">
      <div class="line-main">
        <span class="line-number">${String(index + 1).padStart(2, "0")}</span>
        <p class="french">${createSentenceParts(line, notes)}</p>
        <button class="icon-button" type="button" data-audio="${line.audio}" data-line-index="${index}" ${hasAudio ? "" : "disabled"} title="${hasAudio ? "Play audio" : "Audio coming later"}" aria-label="${hasAudio ? "Play audio for line " + (index + 1) : "Audio coming later for line " + (index + 1)}">▶</button>
        <button class="text-button line-actions" type="button" data-reveal="${translationId}" disabled>Reveal English</button>
      </div>
      <p class="translation" id="${translationId}">${line.english}</p>
    </article>
  `;
}

function createSentenceParts(line, notes) {
  if (!line.parts) {
    return line.french;
  }

  return line.parts.map((part) => {
    if (typeof part === "string") {
      return part;
    }

    return `<button class="note-marker" type="button" data-note="${part.note}" aria-label="Open note ${part.note}">${part.note}</button>`;
  }).join("");
}

function toggleNote(button, notes) {
  const tray = app.querySelector(".note-tray");
  const isOpen = tray.dataset.note === button.dataset.note;

  app.querySelectorAll(".note-marker.active").forEach((marker) => {
    marker.classList.remove("active");
  });

  if (isOpen) {
    closeNoteTray();
    return;
  }

  tray.classList.add("open");
  tray.dataset.note = button.dataset.note;
  tray.innerHTML = `
    <div class="note-tray-inner">
      <div>
        <p class="note-tray-kicker">Note ${button.dataset.note}</p>
        <p>${notes[button.dataset.note]}</p>
      </div>
      <button class="note-close" type="button" aria-label="Close note">×</button>
    </div>
  `;
  tray.querySelector(".note-close").addEventListener("click", closeNoteTray);
  button.classList.add("active");
}

function closeNoteTray() {
  const tray = app.querySelector(".note-tray");

  if (!tray) {
    return;
  }

  tray.classList.remove("open");
  tray.textContent = "";
  delete tray.dataset.note;
  app.querySelectorAll(".note-marker.active").forEach((marker) => {
    marker.classList.remove("active");
  });
}

function unlockLessonTestButton() {
  const testButton = app.querySelector("[data-test]");
  const status = app.querySelector("[data-test-lock-status]");

  if (!testButton || !status) {
    return;
  }

  testButton.disabled = false;
  testButton.textContent = "Start Test";
  status.textContent = "Practice with listening, sentence building, and fill-in review.";
}

function renderPartOneIntro(lesson, test) {
  renderTest(lesson, test, 0, [], "", false, {});

  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `
    <section class="correct-modal intro-modal" role="dialog" aria-modal="true" aria-labelledby="part-one-title">
      <button class="note-close modal-close" type="button" aria-label="Close introduction">&times;</button>
      <p class="correct-kicker">Part 1</p>
      <h2 id="part-one-title">Listen and rebuild the sentence.</h2>
      <p class="correct-english">Choose the words in order after the audio plays. Correct words stay in place when you try again.</p>
    </section>
  `;

  app.appendChild(modal);
  modal.querySelector(".modal-close").addEventListener("click", () => {
    modal.remove();
    playAudio(test.items[0].audio);
  });
}

function renderTest(lesson, test, itemIndex = 0, selected = [], feedback = "", autoPlay = true, attempts = {}, submittedCounts = {}) {
  activeTest = { lesson, test, itemIndex, selected, attempts, submittedCounts };

  const item = test.items[itemIndex];
  const statusText = `Sentence ${itemIndex + 1} of ${test.items.length}`;
  const tryCount = attempts[itemIndex] || 0;
  const attemptText = `Attempt ${tryCount + 1}`;

  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button">Back to lesson</button>
      </div>
      <header class="lesson-header">
        <h1>${test.title}</h1>
        <p class="lesson-lede">${test.instructions}</p>
      </header>
      <section class="test-panel" aria-label="${test.title}">
        <div class="question-topline">
          <div class="test-progress">${statusText}</div>
          <div class="try-pill">${attemptText}</div>
        </div>
        <div class="test-controls">
          <button class="icon-button" type="button" data-play-test title="Play audio" aria-label="Play test sentence">▶</button>
          <p class="test-feedback" aria-live="polite">${feedback}</p>
        </div>
        <div class="answer-row" aria-label="Answer blanks">
          ${item.answer.map((answer, index) => createAnswerSlot(answer, item.punctuation[index], selected[index], index)).join("")}
        </div>
        <div class="word-bank" aria-label="Word bank">
          ${createWordBank(test, item, selected)}
        </div>
        <button class="primary-button check-button" type="button" data-check ${canCheckTestAnswer(item, selected, submittedCounts[itemIndex] || 0) ? "" : "disabled"}>Try</button>
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(lesson.id));
  app.querySelector("[data-play-test]").addEventListener("click", () => playAudio(item.audio));
  app.querySelector("[data-check]").addEventListener("click", checkTestAnswer);

  app.querySelectorAll("[data-bank-word]").forEach((button) => {
    button.addEventListener("click", () => selectBankWord(button.dataset.bankWord));
  });

  app.querySelectorAll("[data-slot]").forEach((button) => {
    button.addEventListener("click", () => removeSelectedWord(Number(button.dataset.slot)));
  });

  if (autoPlay) {
    window.setTimeout(() => playAudio(item.audio), 0);
  }
}

function createAnswerSlot(answer, punctuation, selectedWord, index) {
  const filledClass = selectedWord ? "filled" : "";
  const displayWord = selectedWord ? getSelectedWordDisplay(selectedWord, index) : "";

  return `
    <span class="answer-piece">
      <button class="answer-slot ${filledClass}" type="button" data-slot="${index}" aria-label="${selectedWord ? "Remove " + displayWord : "Empty slot for " + answer}">${displayWord}</button><span class="punctuation">${punctuation || ""}</span>
    </span>
  `;
}

function getSelectedWordDisplay(word, index) {
  if (index !== 0 || !word) {
    return word;
  }

  return `${word.charAt(0).toLocaleUpperCase("fr")}${word.slice(1)}`;
}

function createWordBank(test, item, selected) {
  const words = shuffleWords([...new Set([...item.answer, ...test.distractors])]);
  const usedWords = selected.filter(Boolean);

  return words.map((word) => {
    const displayWord = getTestWordDisplay(word);
    const isUsed = usedWords.includes(displayWord);
    return `<button class="word-chip" type="button" data-bank-word="${displayWord}" ${isUsed ? "disabled" : ""}>${displayWord}</button>`;
  }).join("");
}

function selectBankWord(word) {
  const item = activeTest.test.items[activeTest.itemIndex];
  const selected = [...activeTest.selected];
  const openIndex = item.answer.findIndex((_, index) => !selected[index]);

  if (openIndex === -1) {
    return;
  }

  selected[openIndex] = word;
  renderTest(activeTest.lesson, activeTest.test, activeTest.itemIndex, selected, "", false, activeTest.attempts, activeTest.submittedCounts);
}

function removeSelectedWord(index) {
  const selected = [...activeTest.selected];

  if (!selected[index]) {
    return;
  }

  selected[index] = "";
  renderTest(activeTest.lesson, activeTest.test, activeTest.itemIndex, selected, "", false, activeTest.attempts, activeTest.submittedCounts);
}

function checkTestAnswer() {
  const item = activeTest.test.items[activeTest.itemIndex];
  const attempts = { ...activeTest.attempts };
  const submittedCounts = { ...activeTest.submittedCounts };
  const keptWords = item.answer.map((answer, index) => isSameTestWord(activeTest.selected[index], answer) ? activeTest.selected[index] : "");
  const isCorrect = item.answer.every((answer, index) => isSameTestWord(activeTest.selected[index], answer));

  if (isCorrect) {
    activeTest.attempts = attempts;
    activeTest.submittedCounts = submittedCounts;
    showCorrectPopup(item);
    return;
  }

  attempts[activeTest.itemIndex] = (attempts[activeTest.itemIndex] || 0) + 1;
  submittedCounts[activeTest.itemIndex] = getSelectedWordCount(keptWords);
  renderTest(activeTest.lesson, activeTest.test, activeTest.itemIndex, keptWords, "Try again. Correct words stayed in place.", false, attempts, submittedCounts);
}

function canCheckTestAnswer(item, selected, submittedCount) {
  const selectedCount = getSelectedWordCount(selected);

  return selectedCount > 0 && selectedCount > submittedCount;
}

function getSelectedWordCount(selected) {
  return selected.filter(Boolean).length;
}

function showCorrectPopup(item) {
  const wrongAttempts = activeTest.attempts[activeTest.itemIndex] || 0;
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `
    <section class="correct-modal" role="dialog" aria-modal="true" aria-labelledby="correct-title">
      <p class="correct-kicker">${getCorrectAttemptKicker(wrongAttempts)}</p>
      <h2 id="correct-title">${buildSentence(item)}</h2>
      <p class="correct-english">${item.english}</p>
      <button class="audio-replay-button" type="button" data-replay-correct title="Play audio again" aria-label="Play audio again">&#128266;</button>
      <button class="next-arrow" type="button" aria-label="Go to next sentence">→</button>
    </section>
  `;

  app.appendChild(modal);
  playCorrectDing(() => {});
  modal.querySelector("[data-replay-correct]").addEventListener("click", () => playAudio(item.audio));
  modal.querySelector(".next-arrow").addEventListener("click", goToNextTestItem);
}

function getCorrectAttemptKicker(wrongAttempts) {
  if (wrongAttempts === 0) {
    return "Correct! - 1st attempt";
  }

  if (wrongAttempts === 1) {
    return "Correct! - 2nd attempt";
  }

  if (wrongAttempts === 2) {
    return "Correct! - 3rd attempt";
  }

  return "Correct!";
}

function goToNextTestItem() {
  stopCurrentAudio();

  const nextIndex = activeTest.itemIndex + 1;

  if (nextIndex >= activeTest.test.items.length) {
    renderPartOneComplete(activeTest.lesson, activeTest.test, activeTest.attempts);
    return;
  }

  renderTest(activeTest.lesson, activeTest.test, nextIndex, [], "", true, activeTest.attempts, activeTest.submittedCounts);
}

function renderPartOneComplete(lesson, test, attempts) {
  const summary = getScoreSummary(test.items.length, attempts);
  window.sessionStorage.setItem(`${lesson.id}-part-1-score`, JSON.stringify(summary));

  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button">Back to lesson</button>
      </div>
      <section class="complete-panel">
        <p class="correct-kicker">Part 1 Complete</p>
        <h1>${formatScore(summary.score)} / ${summary.total}</h1>
        <p class="lesson-lede">You rebuilt every sentence from the audio.</p>
        ${createScoreBreakdown("Part 1", summary)}
        <button class="primary-button" type="button" data-start-part-2>Continue to Part 2</button>
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(lesson.id));
  app.querySelector("[data-start-part-2]").addEventListener("click", () => renderFillIntro(lesson, lesson.tests[1], summary));
}

function getTestWordDisplay(word) {
  const properNouns = ["Jean", "Jeanne", "Chloé"];

  if (properNouns.includes(word)) {
    return word;
  }

  return word.toLocaleLowerCase("fr");
}

function isSameTestWord(selectedWord, expectedWord) {
  return normalizeAnswer(selectedWord) === normalizeAnswer(expectedWord);
}

function buildSentence(item) {
  return item.answer
    .map((word, index) => `${word}${item.punctuation[index] || ""}`)
    .join(" ")
    .replace(/\s+([,.?])/g, "$1");
}

function getItemScore(wrongAttempts) {
  return Math.max(0, 1 - wrongAttempts * scorePenalty);
}

function getScoreSummary(totalItems, attempts = {}) {
  const score = Array.from({ length: totalItems }, (_, index) => getItemScore(attempts[index] || 0))
    .reduce((sum, itemScore) => sum + itemScore, 0);

  return {
    score,
    total: totalItems
  };
}

function combineScores(...summaries) {
  return summaries.reduce((combined, summary) => ({
    score: combined.score + (summary?.score || 0),
    total: combined.total + (summary?.total || 0)
  }), { score: 0, total: 0 });
}

function formatScore(score) {
  return Number(score || 0).toFixed(2);
}

function createScoreBreakdown(label, summary) {
  return `
    <div class="score-row">
      <span>${label}</span>
      <strong>${formatScore(summary?.score || 0)} / ${summary?.total || 0}</strong>
    </div>
  `;
}

function getStoredScoreSummary(lessonId, partId) {
  const saved = window.sessionStorage.getItem(`${lessonId}-${partId}-score`);

  if (!saved) {
    return {
      score: 0,
      total: 0
    };
  }

  return JSON.parse(saved);
}

function renderTestComplete(lesson) {
  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button">Back to lesson</button>
      </div>
      <section class="complete-panel">
        <h1>Exercise Complete</h1>
        <p class="lesson-lede">You rebuilt every sentence from the audio.</p>
        <button class="primary-button" type="button" data-restart>Restart Test</button>
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(lesson.id));
  app.querySelector("[data-restart]").addEventListener("click", () => renderTest(lesson, lesson.tests[0]));
}

function renderFillIntro(lesson, test, partOneSummary = getStoredScoreSummary(lesson.id, "part-1")) {
  stopCurrentAudio();
  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button">Back to lesson</button>
      </div>
      <section class="complete-panel">
        <p class="correct-kicker">${test.title}</p>
        <h1>${test.subtitle}</h1>
        <p class="lesson-lede">${test.instructions}</p>
        <button class="primary-button" type="button" data-start-fill>Start Exercise 2</button>
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(lesson.id));
  app.querySelector("[data-start-fill]").addEventListener("click", () => renderFillTest(lesson, test, [], "", {}, {}, partOneSummary));
}

function renderFillTest(lesson, test, answers = [], feedback = "", results = {}, attempts = {}, partOneSummary = getStoredScoreSummary(lesson.id, "part-1")) {
  activeFillTest = { lesson, test, answers, results, attempts, partOneSummary };
  const isComplete = test.items.every((_, index) => results[index]?.status === "correct");

  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button">Back to lesson</button>
      </div>
      <header class="lesson-header">
        <h1>${test.title}</h1>
        <p class="lesson-lede">${test.subtitle}</p>
      </header>
      <section class="test-panel" aria-label="${test.title}">
        ${test.items.map((item, itemIndex) => createFillItem(item, itemIndex, answers, results, attempts)).join("")}
        <div class="special-characters" aria-label="Special characters">
          ${["é", "è", "ê", "ë", "à", "â", "ç", "ù", "û", "î", "ï", "ô", "œ", "'", "-"].map((character) => `<button class="word-chip special-chip" type="button" data-character="${character}">${character}</button>`).join("")}
        </div>
        <p class="test-feedback" aria-live="polite">${feedback}</p>
        ${isComplete ? `<button class="primary-button check-button" type="button" data-finish-fill>Finish</button>` : ""}
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(lesson.id));
  app.querySelectorAll("[data-check-fill]").forEach((button) => {
    button.addEventListener("click", () => checkFillItem(Number(button.dataset.checkFill)));
  });
  app.querySelectorAll("[data-show-answer]").forEach((button) => {
    button.addEventListener("click", () => showFillAnswer(Number(button.dataset.showAnswer)));
  });
  const finishButton = app.querySelector("[data-finish-fill]");
  if (finishButton) {
    finishButton.addEventListener("click", () => renderFillComplete(lesson, test, attempts, partOneSummary));
  }
  app.querySelectorAll("[data-fill]").forEach((input) => {
    input.addEventListener("input", updateFillAnswer);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        checkFillItem(Number(input.dataset.fill.split("-")[0]));
      }
    });
    input.addEventListener("focus", () => {
      app.dataset.activeFill = input.dataset.fill;
    });
  });
  app.querySelectorAll("[data-character]").forEach((button) => {
    button.addEventListener("click", () => insertSpecialCharacter(button.dataset.character));
  });
}

function createFillItem(item, itemIndex, answers, results, attempts) {
  let blankIndex = 0;
  const result = results[itemIndex];
  const tryCount = attempts[itemIndex] || 0;
  const canShowAnswer = tryCount >= 3 && result?.status === "retry";
  const feedback = result?.status === "correct"
    ? `<p class="line-feedback success">Correct.</p>`
    : result?.status === "retry"
      ? `<p class="line-feedback">Try this line again.</p>`
      : "";

  return `
    <article class="fill-item">
      <div class="fill-item-top">
        <p class="fill-english">${itemIndex + 1}. ${item.english}</p>
        <span class="try-counter">Attempt ${tryCount + 1}</span>
      </div>
      <p class="fill-sentence">
        ${item.parts.map((part) => {
          if (typeof part === "string") {
            return `<span>${part}</span>`;
          }

          const fillId = `${itemIndex}-${blankIndex}`;
          const answerValue = answers[itemIndex]?.[blankIndex] || "";
          const stateClass = result?.almost?.includes(fillId)
            ? "almost-correct"
            : result?.incorrect?.includes(fillId)
              ? "needs-work"
              : "";
          const correction = result?.correctionMap?.[fillId];
          blankIndex += 1;
          return `
            <span class="fill-blank">
              <input class="fill-input ${stateClass}" type="text" value="${answerValue}" data-fill="${fillId}" aria-label="Missing word, ${part.answer.length} characters" placeholder="..." style="--chars: ${Math.max(part.answer.length, 2)}">
              ${correction ? `<span class="spelling-hint">${correction}</span>` : ""}
            </span>
          `;
        }).join(" ")}
      </p>
      <div class="line-check-row">
        <button class="text-button" type="button" data-check-fill="${itemIndex}">Check Line</button>
        ${canShowAnswer ? `<button class="text-button" type="button" data-show-answer="${itemIndex}">Show Answer</button>` : ""}
        ${feedback}
      </div>
    </article>
  `;
}

function updateFillAnswer(event) {
  const [itemIndex, blankIndex] = event.target.dataset.fill.split("-").map(Number);
  const answers = cloneFillAnswers(activeFillTest.answers);

  if (!answers[itemIndex]) {
    answers[itemIndex] = [];
  }

  answers[itemIndex][blankIndex] = event.target.value;
  activeFillTest.answers = answers;
}

function insertSpecialCharacter(character) {
  const activeFill = app.dataset.activeFill;
  const input = activeFill ? app.querySelector(`[data-fill="${activeFill}"]`) : app.querySelector("[data-fill]");

  if (!input) {
    return;
  }

  const start = input.selectionStart;
  const end = input.selectionEnd;
  input.value = `${input.value.slice(0, start)}${character}${input.value.slice(end)}`;
  input.focus();
  input.setSelectionRange(start + character.length, start + character.length);
  input.dispatchEvent(new Event("input"));
}

function checkFillItem(itemIndex) {
  const answers = cloneFillAnswers(activeFillTest.answers);
  const item = activeFillTest.test.items[itemIndex];
  const result = checkFillItemResult(item, answers[itemIndex] || []);
  const results = { ...activeFillTest.results };
  const attempts = { ...activeFillTest.attempts };

  answers[itemIndex] = result.answers;
  results[itemIndex] = result.isCorrect
    ? { status: "correct", corrections: result.corrections, correctionMap: result.correctionMap }
    : {
        status: "retry",
        corrections: result.corrections,
        correctionMap: result.correctionMap,
        almost: result.almost,
        incorrect: result.incorrect
      };
  attempts[itemIndex] = result.incorrect.length ? (attempts[itemIndex] || 0) + 1 : (attempts[itemIndex] || 0);

  if (result.isCorrect) {
    playCorrectDing(() => {});
    renderFillTest(activeFillTest.lesson, activeFillTest.test, answers, "", results, attempts, activeFillTest.partOneSummary);
    return;
  }

  renderFillTest(activeFillTest.lesson, activeFillTest.test, answers, "", results, attempts, activeFillTest.partOneSummary);
  result.almost.forEach((fillId) => {
    const input = app.querySelector(`[data-fill="${fillId}"]`);
    if (input) {
      input.classList.add("almost-correct");
    }
  });
  result.incorrect.forEach((fillId) => {
    const input = app.querySelector(`[data-fill="${fillId}"]`);
    if (input) {
      input.classList.add("needs-work");
    }
  });
}

function showFillAnswer(itemIndex) {
  const item = activeFillTest.test.items[itemIndex];
  const results = { ...activeFillTest.results };
  const answers = cloneFillAnswers(activeFillTest.answers);
  const expectedAnswers = getFillAnswers(item);

  results[itemIndex] = {
    status: "retry",
    corrections: expectedAnswers,
    correctionMap: Object.fromEntries(expectedAnswers.map((answer, blankIndex) => [`${itemIndex}-${blankIndex}`, answer])),
    almost: getFillAnswers(item).map((_, blankIndex) => `${itemIndex}-${blankIndex}`),
    incorrect: []
  };

  renderFillTest(activeFillTest.lesson, activeFillTest.test, answers, "", results, activeFillTest.attempts, activeFillTest.partOneSummary);
  results[itemIndex].almost.forEach((fillId) => {
    const input = app.querySelector(`[data-fill="${fillId}"]`);
    if (input) {
      input.classList.add("almost-correct");
    }
  });
}

function checkFillItemResult(item, answers) {
  const corrections = [];
  const correctionMap = {};
  const almost = [];
  const incorrect = [];
  const updatedAnswers = [...answers];
  const itemIndex = activeFillTest.test.items.indexOf(item);

  getFillAnswers(item).forEach((expected, blankIndex) => {
    const entered = answers[blankIndex] || "";
    const result = compareAnswer(entered, expected);

    if (!result.isClose) {
      updatedAnswers[blankIndex] = "";
      incorrect.push(`${itemIndex}-${blankIndex}`);
      return;
    }

    if (result.isAutoCorrect) {
      updatedAnswers[blankIndex] = expected;
      return;
    }

    if (!result.isExact) {
      corrections.push(expected);
      updatedAnswers[blankIndex] = "";
      correctionMap[`${itemIndex}-${blankIndex}`] = expected;
      almost.push(`${itemIndex}-${blankIndex}`);
    }
  });

  return {
    almost,
    answers: updatedAnswers,
    corrections,
    correctionMap,
    incorrect,
    isCorrect: incorrect.length === 0 && almost.length === 0
  };
}

function renderFillComplete(lesson, test = lesson.tests[1], attempts = activeFillTest.attempts, partOneSummary = activeFillTest.partOneSummary) {
  completeItem(lesson.id);
  const partTwoSummary = getScoreSummary(test.items.length, attempts);
  const combinedSummary = combineScores(partOneSummary, partTwoSummary);
  const passingScore = combinedSummary.total * passingRatio;
  const passed = combinedSummary.score >= passingScore;

  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <button class="back-link" type="button">Back to lesson</button>
      </div>
      <section class="complete-panel">
        <p class="correct-kicker">Lesson Score</p>
        <h1>${formatScore(combinedSummary.score)} / ${combinedSummary.total}</h1>
        <p class="lesson-lede">${passed ? "Passed" : "Needs review"} · Passing score: ${formatScore(passingScore)} / ${combinedSummary.total}</p>
        ${createScoreBreakdown("Part 1", partOneSummary)}
        ${createScoreBreakdown("Part 2", partTwoSummary)}
        ${createScoreBreakdown("Total", combinedSummary)}
        <button class="primary-button" type="button" data-restart-fill>Restart Exercise 2</button>
        <button class="primary-button" type="button" data-next-lesson>Continue</button>
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(lesson.id));
  app.querySelector("[data-restart-fill]").addEventListener("click", () => renderFillTest(lesson, lesson.tests[1], [], "", {}, {}, partOneSummary));
  app.querySelector("[data-next-lesson]").addEventListener("click", () => setRoute("lesson-2"));
}

function getFillAnswers(item) {
  return item.parts
    .filter((part) => typeof part !== "string")
    .map((part) => part.answer);
}

function cloneFillAnswers(answers) {
  return answers.map((row) => [...row]);
}

function isCloseAnswer(entered, expected) {
  return compareAnswer(entered, expected).isClose;
}

function compareAnswer(entered, expected) {
  const cleanEntered = normalizeAnswer(entered);
  const cleanExpected = normalizeAnswer(expected);

  if (!cleanEntered) {
    return {
      isClose: false,
      isExact: false,
      isAutoCorrect: false
    };
  }

  if (cleanEntered === cleanExpected) {
    const trimmedEntered = entered.trim();
    const isExact = trimmedEntered === expected;

    return {
      isClose: true,
      isExact,
      isAutoCorrect: !isExact
    };
  }

  const distance = levenshteinDistance(cleanEntered, cleanExpected);
  const allowedDistance = cleanExpected.length <= 3 ? 1 : Math.max(1, Math.floor(cleanExpected.length * 0.3));

  return {
    isClose: distance <= allowedDistance,
    isExact: false,
    isAutoCorrect: false
  };
}

function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’`]/g, "'")
    .replace(/\s+/g, "");
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, row) => [row]);

  for (let column = 1; column <= a.length; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row <= b.length; row += 1) {
    for (let column = 1; column <= a.length; column += 1) {
      const cost = a[column - 1] === b[row - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

function shuffleWords(words) {
  return words
    .map((word) => ({ word, sort: Math.sin(word.charCodeAt(0) * 19 + word.length * 7) }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.word);
}

function playLineAudio(button, lesson) {
  const source = button.dataset.audio;

  if (!source) {
    return;
  }

  stopCurrentAudio();
  const audio = new Audio(source);
  currentAudio = audio;
  currentAudioButton = button;
  button.disabled = true;
  audio.addEventListener("ended", () => {
    if (currentAudio === audio) {
      currentAudio = null;
    }
    if (currentAudioButton === button) {
      currentAudioButton = null;
    }
    resetAudioButton(button);
    const revealButton = button.parentElement.querySelector("[data-reveal]");
    revealButton.disabled = false;
    if (lesson && Number(button.dataset.lineIndex) === lesson.lines.length - 1) {
      completeLessonAudio(lesson.id);
      unlockLessonTestButton();
    }
  });
  audio.addEventListener("error", () => {
    if (currentAudioButton === button) {
      currentAudioButton = null;
    }
    resetAudioButton(button);
  });
  audio.play().catch(() => {
    if (currentAudio === audio) {
      currentAudio = null;
    }
    if (currentAudioButton === button) {
      currentAudioButton = null;
    }
    resetAudioButton(button);
  });
}

function resetAudioButton(button = currentAudioButton) {
  if (button) {
    button.disabled = false;
  }
}

function playAudio(source, onEnded) {
  stopCurrentAudio();
  const audio = new Audio(source);
  const token = playbackToken;
  currentAudio = audio;

  if (onEnded) {
    audio.addEventListener("ended", () => {
      if (token === playbackToken) {
        onEnded();
      }
    }, { once: true });
  }

  audio.addEventListener("ended", () => {
    if (currentAudio === audio) {
      currentAudio = null;
    }
  });

  audio.play().catch(() => {});
}

function playCorrectDingThenSentence(source) {
  stopCurrentAudio();
  const token = playbackToken;

  playCorrectDing(() => {
    if (token === playbackToken) {
      playAudio(source);
    }
  });
}

function playCorrectDing(onEnded) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    onEnded();
    return;
  }

  const context = new AudioContext();
  currentDingContext = context;
  const gain = context.createGain();
  const firstTone = context.createOscillator();
  const secondTone = context.createOscillator();
  const now = context.currentTime;

  gain.connect(context.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

  firstTone.type = "sine";
  firstTone.frequency.setValueAtTime(660, now);
  firstTone.connect(gain);
  firstTone.start(now);
  firstTone.stop(now + 0.18);

  secondTone.type = "sine";
  secondTone.frequency.setValueAtTime(880, now + 0.12);
  secondTone.connect(gain);
  secondTone.start(now + 0.12);
  secondTone.stop(now + 0.38);

  secondTone.addEventListener("ended", () => {
    if (currentDingContext === context) {
      currentDingContext = null;
    }
    context.close().catch(() => {});
    onEnded();
  }, { once: true });
}

function stopCurrentAudio() {
  playbackToken += 1;
  resetAudioButton();
  currentAudioButton = null;

  if (!currentAudio) {
    if (currentDingContext) {
      currentDingContext.close().catch(() => {});
      currentDingContext = null;
    }
    return;
  }

  currentAudio.pause();
  currentAudio.currentTime = 0;
  currentAudio = null;

  if (currentDingContext) {
    currentDingContext.close().catch(() => {});
    currentDingContext = null;
  }
}

async function initializeApp() {
  renderLoading();
  await loadRemoteLessons();
  render();
}

window.addEventListener("hashchange", render);
initializeApp();
