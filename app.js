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
  },
  {
    id: "lesson-3",
    type: "lesson",
    title: "Lesson 3",
    titleAudio: "",
    titleEnglish: "",
    language: "French",
    description: "Lesson 3 content will go here when you add the sentences, audio, notes, and tests.",
    notes: {},
    lines: [],
    tests: []
  },
  {
    id: "lesson-4",
    type: "lesson",
    title: "Lesson 4",
    titleAudio: "",
    titleEnglish: "",
    language: "French",
    description: "Lesson 4 content will go here when you add the sentences, audio, notes, and tests.",
    notes: {},
    lines: [],
    tests: []
  },
  {
    id: "lesson-5",
    type: "lesson",
    title: "Lesson 5",
    titleAudio: "",
    titleEnglish: "",
    language: "French",
    description: "Lesson 5 content will go here when you add the sentences, audio, notes, and tests.",
    notes: {},
    lines: [],
    tests: []
  },
  {
    id: "lesson-6",
    type: "lesson",
    title: "Lesson 6",
    titleAudio: "",
    titleEnglish: "",
    language: "French",
    description: "Lesson 6 content will go here when you add the sentences, audio, notes, and tests.",
    notes: {},
    lines: [],
    tests: []
  },
  {
    id: "lesson-7",
    type: "lesson",
    title: "Lesson 7",
    titleAudio: "",
    titleEnglish: "",
    language: "French",
    description: "Lesson 7 content will go here when you add the sentences, audio, notes, and tests.",
    notes: {},
    lines: [],
    tests: []
  }
];
let lessons = courseItems.filter((item) => item.type === "lesson");
const progressKey = "ogham-progress";
const lessonAudioProgressKey = "ogham-lesson-audio-progress";
const bestScoresKey = "ogham-best-scores";
const authStateKey = "ogham-auth-state";
const authVerifierKey = "ogham-auth-verifier";
const authSessionKey = "ogham-auth-session";
const cognitoDomain = "https://us-east-1lecx3id7z.auth.us-east-1.amazoncognito.com";
const cognitoClientId = "7ifahuq15bidifgdm57t3389e5";
const cognitoRedirectUri = "http://localhost:8000/";
const userStateApiUrl = "https://4ei4w1egn9.execute-api.us-east-1.amazonaws.com";
const contentBaseUrl = "https://ogham-content-ian-423575705842-us-east-1-an.s3.us-east-1.amazonaws.com/";
const remoteLessonFiles = [
  "lessons/lesson-1-comment-allez-vous.json",
  "lessons/lesson-2-le-cafe.json",
  "lessons/lesson-3-presentations.json",
  "lessons/lesson-4-lheure.json",
  "lessons/lesson-5-je-cherche-le-metro.json",
  "lessons/lesson-6-a-lhotel.json",
  "lessons/lesson-7-review.json"
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
let cloudSaveTimer = null;
let isApplyingCloudState = false;
let cloudSaveStatus = "";

function getAuthSession() {
  const saved = window.localStorage.getItem(authSessionKey);

  if (!saved) {
    return null;
  }

  try {
    const session = JSON.parse(saved);

    if (!session.idToken || !session.expiresAt || Date.now() >= session.expiresAt) {
      clearAuthSession();
      return null;
    }

    return session;
  } catch (error) {
    clearAuthSession();
    return null;
  }
}

function getCurrentUser() {
  const session = getAuthSession();

  if (!session?.idToken) {
    return null;
  }

  const claims = decodeJwt(session.idToken);

  if (!claims?.sub) {
    return null;
  }

  return {
    sub: claims.sub,
    email: claims.email || "Signed in"
  };
}

function getScopedStorageKey(key) {
  const user = getCurrentUser();

  if (!user) {
    return key;
  }

  return `${key}:${user.sub}`;
}

function readStoredJson(key, fallback) {
  const saved = window.localStorage.getItem(getScopedStorageKey(key));

  if (!saved) {
    return fallback;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return fallback;
  }
}

function writeStoredJson(key, value) {
  window.localStorage.setItem(getScopedStorageKey(key), JSON.stringify(value));
}

function clearAuthSession() {
  window.localStorage.removeItem(authSessionKey);
  window.sessionStorage.removeItem(authStateKey);
  window.sessionStorage.removeItem(authVerifierKey);
}

async function startLogin() {
  const verifier = createCodeVerifier();
  const challenge = await createCodeChallenge(verifier);
  const state = crypto.randomUUID();
  const route = window.location.hash.replace("#", "");
  const params = new URLSearchParams({
    client_id: cognitoClientId,
    code_challenge: challenge,
    code_challenge_method: "S256",
    redirect_uri: cognitoRedirectUri,
    response_type: "code",
    scope: "openid email",
    state
  });

  window.sessionStorage.setItem(authVerifierKey, verifier);
  window.sessionStorage.setItem(authStateKey, JSON.stringify({ state, route }));
  window.location.href = `${cognitoDomain}/oauth2/authorize?${params.toString()}`;
}

function logout() {
  clearAuthSession();
  const params = new URLSearchParams({
    client_id: cognitoClientId,
    logout_uri: cognitoRedirectUri
  });

  window.location.href = `${cognitoDomain}/logout?${params.toString()}`;
}

async function handleAuthRedirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    return;
  }

  const savedState = JSON.parse(window.sessionStorage.getItem(authStateKey) || "{}");

  if (params.get("state") !== savedState.state) {
    throw new Error("The sign-in response did not match this browser session.");
  }

  const verifier = window.sessionStorage.getItem(authVerifierKey);

  if (!verifier) {
    throw new Error("The sign-in verifier was missing. Please try logging in again.");
  }

  const tokenResponse = await fetch(`${cognitoDomain}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: cognitoClientId,
      code,
      code_verifier: verifier,
      grant_type: "authorization_code",
      redirect_uri: cognitoRedirectUri
    })
  });

  if (!tokenResponse.ok) {
    throw new Error(`Cognito token exchange failed: ${tokenResponse.status}`);
  }

  const tokens = await tokenResponse.json();
  const session = {
    accessToken: tokens.access_token,
    idToken: tokens.id_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + (tokens.expires_in || 3600) * 1000
  };

  window.localStorage.setItem(authSessionKey, JSON.stringify(session));
  clearAuthCallbackState();
  window.history.replaceState({}, document.title, `${window.location.pathname}${savedState.route ? `#${savedState.route}` : ""}`);
}

function clearAuthCallbackState() {
  window.sessionStorage.removeItem(authStateKey);
  window.sessionStorage.removeItem(authVerifierKey);
}

function getStateSnapshot(route = window.location.hash.replace("#", "")) {
  return {
    currentRoute: route,
    progress: getProgress(),
    lessonAudioProgress: getLessonAudioProgress(),
    bestScores: getBestScores()
  };
}

async function loadCloudState() {
  const session = getAuthSession();

  if (!session?.idToken) {
    return;
  }

  try {
    const response = await fetch(`${userStateApiUrl}/state`, {
      headers: {
        Authorization: `Bearer ${session.idToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Could not load cloud state: ${response.status}`);
    }

    const payload = await response.json();
    const state = payload.state;

    if (!state) {
      applyCloudState(getEmptyUserState());
      await saveCloudStateNow();
      return;
    }

    applyCloudState(state);
  } catch (error) {
    console.warn("Cloud progress could not be loaded. Using local progress for now.", error);
  }
}

function getEmptyUserState() {
  return {
    currentRoute: "",
    progress: { completed: [] },
    lessonAudioProgress: { completed: [] },
    bestScores: {}
  };
}

function applyCloudState(state) {
  isApplyingCloudState = true;

  if (state.progress) {
    writeStoredJson(progressKey, state.progress);
  }

  if (state.lessonAudioProgress) {
    writeStoredJson(lessonAudioProgressKey, state.lessonAudioProgress);
  }

  if (state.bestScores) {
    writeStoredJson(bestScoresKey, state.bestScores);
  }

  if (!window.location.hash && state.currentRoute) {
    window.location.hash = state.currentRoute;
  }

  isApplyingCloudState = false;
}

async function resetCurrentAccountState() {
  if (!window.confirm("Reset progress for this signed-in account?")) {
    return;
  }

  applyCloudState(getEmptyUserState());
  window.sessionStorage.clear();
  window.history.replaceState({}, document.title, window.location.pathname);
  await saveCloudStateNow("");
  render();
}

function queueCloudStateSave(route) {
  if (isApplyingCloudState || !getCurrentUser()) {
    return;
  }

  cloudSaveStatus = "Saving...";
  updateAccountSyncStatus();
  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(() => {
    saveCloudStateNow(route).catch((error) => {
      console.warn("Cloud progress could not be saved.", error);
      cloudSaveStatus = "Save failed";
      updateAccountSyncStatus();
    });
  }, 350);
}

function flushCloudStateSave(route) {
  window.clearTimeout(cloudSaveTimer);
  cloudSaveStatus = "Saving...";
  updateAccountSyncStatus();
  saveCloudStateNow(route).catch((error) => {
    console.warn("Cloud progress could not be saved.", error);
    cloudSaveStatus = "Save failed";
    updateAccountSyncStatus();
  });
}

async function saveCloudStateNow(route, options = {}) {
  const session = getAuthSession();

  if (!session?.idToken) {
    return;
  }

  const response = await fetch(`${userStateApiUrl}/state`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.idToken}`,
      "Content-Type": "application/json"
    },
    keepalive: Boolean(options.keepalive),
    body: JSON.stringify(getStateSnapshot(route))
  });

  if (!response.ok) {
    throw new Error(`Could not save cloud state: ${response.status}`);
  }

  cloudSaveStatus = "Saved";
  updateAccountSyncStatus();
}

function createCodeVerifier() {
  const values = new Uint8Array(32);
  crypto.getRandomValues(values);
  return base64UrlEncode(values);
}

async function createCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, "=");

    return JSON.parse(atob(padded));
  } catch (error) {
    return null;
  }
}

function setRoute(route) {
  stopCurrentAudio();
  queueCloudStateSave(route);
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
  const remoteLessons = await Promise.all(remoteLessonFiles.map(async (file) => {
    try {
      return await loadLessonFile(getContentUrl(file));
    } catch (error) {
      console.warn(`Remote lesson ${file} could not load. Trying local copy.`, error);
    }

    try {
      return await loadLessonFile(file);
    } catch (error) {
      console.warn(`Using embedded lesson because ${file} could not load.`, error);
    }

    return null;
  }));

  courseItems = courseItems.map((item) => {
    const remoteLesson = remoteLessons.find((lesson) => lesson?.id === item.id);

    return remoteLesson || item;
  });
  lessons = courseItems.filter((item) => item.type === "lesson");
}

async function loadLessonFile(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Could not load ${path}: ${response.status}`);
  }

  return hydrateLessonAssets(await response.json());
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
    "lesson-2": "L002-French ASSIMIL",
    "lesson-3": "L003-French ASSIMIL",
    "lesson-4": "L004-French ASSIMIL",
    "lesson-5": "L005-French ASSIMIL",
    "lesson-6": "L006-French ASSIMIL",
    "lesson-7": "L007-French ASSIMIL"
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
  return readStoredJson(progressKey, { completed: [] });
}

function saveProgress(progress) {
  writeStoredJson(progressKey, progress);
  queueCloudStateSave();
}

function getBestScores() {
  return readStoredJson(bestScoresKey, {});
}

function getBestScore(itemId) {
  return getBestScores()[itemId];
}

function saveBestScore(itemId, summary) {
  if (!summary?.total) {
    return;
  }

  const scores = getBestScores();
  const previous = scores[itemId];

  if (previous && getScoreRatio(previous) >= getScoreRatio(summary)) {
    return;
  }

  scores[itemId] = {
    score: summary.score,
    total: summary.total
  };
  writeStoredJson(bestScoresKey, scores);
  flushCloudStateSave();
}

function getLessonAudioProgress() {
  return readStoredJson(lessonAudioProgressKey, { completed: [] });
}

function isLessonAudioComplete(lessonId) {
  return getLessonAudioProgress().completed.includes(lessonId);
}

function completeLessonAudio(lessonId) {
  const progress = getLessonAudioProgress();

  if (!progress.completed.includes(lessonId)) {
    progress.completed.push(lessonId);
    writeStoredJson(lessonAudioProgressKey, progress);
    flushCloudStateSave();
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
    flushCloudStateSave();
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
  if (!getCurrentUser()) {
    renderAuthGate();
    return;
  }

  const route = window.location.hash.replace("#", "");
  const routeItem = getItem(route);

  if (route === "history") {
    renderHistory();
    renderAccountControls();
    return;
  }

  if (route === "intro") {
    renderIntro(courseItems[0]);
    renderAccountControls();
    return;
  }

  if (routeItem?.type === "lesson") {
    renderLockedAwareLesson(routeItem);
    renderAccountControls();
    return;
  }

  const testRoute = getTestRoute(route);

  if (testRoute) {
    if (!isItemUnlocked(testRoute.lesson.id)) {
      renderLockedItem(testRoute.lesson);
      renderAccountControls();
      return;
    }

    if (!isLessonTestUnlocked(testRoute.lesson)) {
      renderLesson(testRoute.lesson);
      renderAccountControls();
      return;
    }

    if (testRoute.testIndex === 0) {
      renderPartOneIntro(testRoute.lesson, testRoute.test);
    } else {
      renderFillIntro(testRoute.lesson, testRoute.test);
    }
    renderAccountControls();
    return;
  }

  renderHome();
  renderAccountControls();
}

function renderAuthGate(message = "") {
  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
      </div>
      <section class="auth-panel" aria-labelledby="auth-title">
        <p class="correct-kicker">Ogham account</p>
        <h1 id="auth-title">Sign in to continue.</h1>
        <p class="lesson-lede">Use your email to save lesson progress under your account.</p>
        ${message ? `<p class="auth-error">${message}</p>` : ""}
        <button class="primary-button" type="button" data-login>Sign in or create account</button>
      </section>
    </section>
  `;

  app.querySelector("[data-login]").addEventListener("click", startLogin);
}

function renderAccountControls() {
  const user = getCurrentUser();
  const topbar = app.querySelector(".topbar");

  if (!user || !topbar || topbar.querySelector(".account-controls")) {
    return;
  }

  const controls = document.createElement("div");
  controls.className = "account-controls";
  controls.innerHTML = `
    <span class="sync-status" data-sync-status>${cloudSaveStatus}</span>
    <span class="account-email">${user.email}</span>
    <button class="back-link" type="button" data-reset-account>Reset progress</button>
    <button class="back-link" type="button" data-logout>Log out</button>
  `;

  topbar.appendChild(controls);
  controls.querySelector("[data-reset-account]").addEventListener("click", () => {
    resetCurrentAccountState().catch((error) => {
      console.warn("Account progress could not be reset.", error);
      cloudSaveStatus = "Reset failed";
      updateAccountSyncStatus();
    });
  });
  controls.querySelector("[data-logout]").addEventListener("click", logout);
}

function updateAccountSyncStatus() {
  const status = app.querySelector("[data-sync-status]");

  if (status) {
    status.textContent = cloudSaveStatus;
  }
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
  const bestScore = getBestScore(item.id);
  const scoreLabel = getHistoryScoreLabel(item, bestScore);
  const status = !unlocked ? "Locked" : bestScore ? "Review" : "Available";

  return `
    <article class="history-item ${getHistoryItemClass(item, unlocked, bestScore)}">
      <div>
        <p class="history-kicker">${item.language}</p>
        <h2>${item.title}</h2>
        <p>${scoreLabel}</p>
      </div>
      <button class="text-button" type="button" data-open-item="${item.id}" ${unlocked ? "" : "disabled"}>${status}</button>
    </article>
  `;
}

function getHistoryItemClass(item, unlocked, bestScore) {
  if (!unlocked) {
    return "locked";
  }

  if (bestScore && getScoreRatio(bestScore) >= 1) {
    return "perfect";
  }

  if (bestScore && getScoreRatio(bestScore) >= passingRatio) {
    return "passing";
  }

  return "current";
}

function getHistoryScoreLabel(item, bestScore) {
  if (!isItemUnlocked(item.id)) {
    return "Locked";
  }

  if (!bestScore) {
    return getItemStatusLabel(item);
  }

  return `Best score: ${formatScore(bestScore.score)} / ${bestScore.total} (${formatPercent(getScoreRatio(bestScore))})`;
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

function showLookBack(lesson) {
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `
    <section class="correct-modal review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
      <button class="note-close modal-close" type="button" aria-label="Return to test">&times;</button>
      <p class="correct-kicker">Look Back</p>
      <h2 id="review-title">${lesson.title}</h2>
      <div class="review-list">
        ${lesson.lines.map((line, index) => createReviewLine(line, index)).join("")}
      </div>
    </section>
  `;

  app.appendChild(modal);
  const closeReview = () => {
    stopCurrentAudio();
    modal.remove();
  };

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeReview();
    }
  });
  modal.querySelector(".modal-close").addEventListener("click", closeReview);
  modal.querySelectorAll("[data-review-reveal]").forEach((button) => {
    button.addEventListener("click", () => {
      const translation = modal.querySelector(`#${button.dataset.reviewReveal}`);
      const isVisible = translation.classList.toggle("visible");
      button.classList.toggle("active", isVisible);
      button.title = isVisible ? "Hide English" : "Reveal English";
      button.setAttribute("aria-label", isVisible ? "Hide English" : "Reveal English");
    });
  });
  modal.querySelectorAll("[data-review-audio]").forEach((button) => {
    button.addEventListener("click", () => playAudio(button.dataset.reviewAudio));
  });
}

function createReviewLine(line, index) {
  const hasAudio = Boolean(line.audio);
  const translationId = `review-translation-${index + 1}`;

  return `
    <article class="review-line">
      <div class="review-line-main">
        <span class="line-number">${String(index + 1).padStart(2, "0")}</span>
        <div>
          <p class="review-french">${line.french}</p>
          <p class="review-english" id="${translationId}">${line.english}</p>
        </div>
        <button class="icon-button" type="button" data-review-audio="${line.audio}" ${hasAudio ? "" : "disabled"} title="${hasAudio ? "Play audio" : "Audio coming later"}" aria-label="${hasAudio ? "Play review audio for line " + (index + 1) : "Audio coming later for line " + (index + 1)}">▶</button>
        <button class="icon-button review-flip" type="button" data-review-reveal="${translationId}" title="Reveal English" aria-label="Reveal English">↻</button>
      </div>
    </article>
  `;
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

function renderTest(lesson, test, itemIndex = 0, selected = [], feedback = "", autoPlay = true, attempts = {}, submittedCounts = {}, revealedAnswers = {}) {
  activeTest = { lesson, test, itemIndex, selected, attempts, submittedCounts, revealedAnswers };

  const item = test.items[itemIndex];
  const statusText = `Sentence ${itemIndex + 1} of ${test.items.length}`;
  const tryCount = attempts[itemIndex] || 0;
  const attemptText = `Attempt ${tryCount + 1}`;
  const revealedSentence = revealedAnswers[itemIndex] ? buildSentence(item) : "";

  app.innerHTML = `
    <section class="shell">
      <div class="topbar">
        <div class="brand">Personal Language Reader</div>
        <div class="topbar-actions">
          <button class="back-link" type="button" data-look-back>Look back</button>
          <button class="back-link" type="button" data-back-lesson>Back to lesson</button>
        </div>
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
        ${revealedSentence ? `<p class="test-answer-hint">${revealedSentence}</p>` : ""}
        <div class="answer-row" aria-label="Answer blanks">
          ${item.answer.map((answer, index) => createAnswerSlot(answer, item.punctuation[index], selected[index], index)).join("")}
        </div>
        <div class="word-bank" aria-label="Word bank">
          ${createWordBank(test, item, selected)}
        </div>
        <button class="primary-button check-button" type="button" data-check ${canCheckTestAnswer(item, selected, submittedCounts[itemIndex] || 0) ? "" : "disabled"}>Try</button>
        ${tryCount >= 4 && !revealedSentence ? `<button class="text-button" type="button" data-show-test-answer>Show correct sentence</button>` : ""}
      </section>
    </section>
  `;

  app.querySelector("[data-back-lesson]").addEventListener("click", () => setRoute(lesson.id));
  app.querySelector("[data-look-back]").addEventListener("click", () => showLookBack(lesson));
  app.querySelector("[data-play-test]").addEventListener("click", () => playAudio(item.audio));
  app.querySelector("[data-check]").addEventListener("click", checkTestAnswer);
  app.querySelector("[data-show-test-answer]")?.addEventListener("click", showTestAnswer);

  app.querySelectorAll("[data-bank-word]").forEach((button) => {
    button.addEventListener("click", () => selectBankWord(button.dataset.bankWord));
    button.addEventListener("dragstart", handleBankWordDragStart);
  });

  app.querySelectorAll("[data-slot]").forEach((button) => {
    button.addEventListener("click", () => removeSelectedWord(Number(button.dataset.slot)));
    button.addEventListener("dragstart", handleSlotDragStart);
    button.addEventListener("dragover", allowSlotDrop);
    button.addEventListener("drop", handleSlotDrop);
    button.addEventListener("dragenter", markSlotDropTarget);
    button.addEventListener("dragleave", unmarkSlotDropTarget);
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
      <button class="answer-slot ${filledClass}" type="button" data-slot="${index}" draggable="${selectedWord ? "true" : "false"}" aria-label="${selectedWord ? "Remove " + displayWord : "Empty slot for " + answer}">${displayWord}</button><span class="punctuation">${punctuation || ""}</span>
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
  const answerWords = item.answer.map(getTestWordDisplay);
  const distractorWords = test.distractors
    .map(getTestWordDisplay)
    .filter((word) => !answerWords.some((answerWord) => isSameTestWord(answerWord, word)));
  const words = shuffleWords([...answerWords, ...distractorWords]);
  const usedWordCounts = selected.filter(Boolean).reduce((counts, word) => {
    const key = normalizeAnswer(word);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
  const renderedWordCounts = {};

  return words.map((word) => {
    const key = normalizeAnswer(word);
    renderedWordCounts[key] = (renderedWordCounts[key] || 0) + 1;
    const isUsed = renderedWordCounts[key] <= (usedWordCounts[key] || 0);
    return `<button class="word-chip" type="button" data-bank-word="${word}" draggable="${isUsed ? "false" : "true"}" ${isUsed ? "disabled" : ""}>${word}</button>`;
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
  renderTest(activeTest.lesson, activeTest.test, activeTest.itemIndex, selected, "", false, activeTest.attempts, activeTest.submittedCounts, activeTest.revealedAnswers);
}

function removeSelectedWord(index) {
  const selected = [...activeTest.selected];

  if (!selected[index]) {
    return;
  }

  selected[index] = "";
  renderTest(activeTest.lesson, activeTest.test, activeTest.itemIndex, selected, "", false, activeTest.attempts, activeTest.submittedCounts, activeTest.revealedAnswers);
}

function handleBankWordDragStart(event) {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("application/json", JSON.stringify({
    source: "bank",
    word: event.currentTarget.dataset.bankWord
  }));
}

function handleSlotDragStart(event) {
  const index = Number(event.currentTarget.dataset.slot);
  const word = activeTest.selected[index];

  if (!word) {
    event.preventDefault();
    return;
  }

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("application/json", JSON.stringify({
    source: "slot",
    index,
    word
  }));
}

function allowSlotDrop(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function markSlotDropTarget(event) {
  event.preventDefault();
  event.currentTarget.classList.add("drop-target");
}

function unmarkSlotDropTarget(event) {
  event.currentTarget.classList.remove("drop-target");
}

function handleSlotDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("drop-target");

  const payload = getDragPayload(event);

  if (!payload?.word) {
    return;
  }

  const targetIndex = Number(event.currentTarget.dataset.slot);
  const selected = [...activeTest.selected];

  if (payload.source === "slot") {
    const sourceIndex = Number(payload.index);

    if (sourceIndex === targetIndex) {
      return;
    }

    [selected[sourceIndex], selected[targetIndex]] = [selected[targetIndex] || "", payload.word];
  } else {
    selected[targetIndex] = payload.word;
  }

  renderTest(activeTest.lesson, activeTest.test, activeTest.itemIndex, selected, "", false, activeTest.attempts, activeTest.submittedCounts, activeTest.revealedAnswers);
}

function getDragPayload(event) {
  try {
    return JSON.parse(event.dataTransfer.getData("application/json"));
  } catch (error) {
    return null;
  }
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
  renderTest(activeTest.lesson, activeTest.test, activeTest.itemIndex, keptWords, "Try again. Correct words stayed in place.", false, attempts, submittedCounts, activeTest.revealedAnswers);
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

function showTestAnswer() {
  const revealedAnswers = {
    ...activeTest.revealedAnswers,
    [activeTest.itemIndex]: true
  };

  renderTest(activeTest.lesson, activeTest.test, activeTest.itemIndex, activeTest.selected, "", false, activeTest.attempts, activeTest.submittedCounts, revealedAnswers);
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

  renderTest(activeTest.lesson, activeTest.test, nextIndex, [], "", true, activeTest.attempts, activeTest.submittedCounts, activeTest.revealedAnswers);
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

function formatPercent(ratio) {
  return `${Math.round((ratio || 0) * 100)}%`;
}

function getScoreRatio(summary) {
  if (!summary?.total) {
    return 0;
  }

  return summary.score / summary.total;
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
        <div class="topbar-actions">
          <button class="back-link" type="button" data-look-back>Look back</button>
          <button class="back-link" type="button" data-back-lesson>Back to lesson</button>
        </div>
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

  app.querySelector("[data-back-lesson]").addEventListener("click", () => setRoute(lesson.id));
  app.querySelector("[data-look-back]").addEventListener("click", () => showLookBack(lesson));
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
  const previousResult = activeFillTest.results[itemIndex];
  const result = checkFillItemResult(item, answers[itemIndex] || [], previousResult);
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

function checkFillItemResult(item, answers, previousResult = {}) {
  const corrections = [];
  const correctionMap = {};
  const almost = [];
  const incorrect = [];
  const updatedAnswers = [...answers];
  const itemIndex = activeFillTest.test.items.indexOf(item);
  const previousAlmost = previousResult.almost || [];
  const previousCorrectionMap = previousResult.correctionMap || {};

  getFillAnswers(item).forEach((expected, blankIndex) => {
    const fillId = `${itemIndex}-${blankIndex}`;
    const entered = answers[blankIndex] || "";
    const result = compareAnswer(entered, expected);
    const wasAlmost = previousAlmost.includes(fillId);

    if (!result.isClose) {
      if (wasAlmost) {
        updatedAnswers[blankIndex] = "";
        correctionMap[fillId] = previousCorrectionMap[fillId] || expected;
        almost.push(fillId);
        return;
      }

      updatedAnswers[blankIndex] = "";
      incorrect.push(fillId);
      return;
    }

    if (result.isAutoCorrect) {
      updatedAnswers[blankIndex] = expected;
      return;
    }

    if (!result.isExact) {
      corrections.push(expected);
      updatedAnswers[blankIndex] = "";
      correctionMap[fillId] = expected;
      almost.push(fillId);
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
  const nextItem = getNextItem(lesson.id);
  saveBestScore(lesson.id, combinedSummary);

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
        <button class="primary-button" type="button" data-next-lesson>${nextItem ? "Continue" : "Back Home"}</button>
      </section>
    </section>
  `;

  app.querySelector(".back-link").addEventListener("click", () => setRoute(lesson.id));
  app.querySelector("[data-restart-fill]").addEventListener("click", () => renderFillTest(lesson, lesson.tests[1], [], "", {}, {}, partOneSummary));
  app.querySelector("[data-next-lesson]").addEventListener("click", () => setRoute(nextItem?.id || ""));
}

function getNextItem(itemId) {
  const itemIndex = courseItems.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return null;
  }

  return courseItems[itemIndex + 1] || null;
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

  try {
    await handleAuthRedirect();
  } catch (error) {
    console.error(error);
    renderAuthGate("Sign-in could not be completed. Please try again.");
    return;
  }

  if (!getCurrentUser()) {
    renderAuthGate();
    return;
  }

  await loadRemoteLessons();
  await loadCloudState();
  render();
}

window.addEventListener("hashchange", () => {
  queueCloudStateSave();
  render();
});
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && getCurrentUser()) {
    saveCloudStateNow(undefined, { keepalive: true }).catch(() => {});
  }
});
initializeApp();
