class StorageManager {
  static getHighScore() {
    const stored = localStorage.getItem(GameSettings.localStorageKey);
    return stored ? Number(stored) : 0;
  }

  static setHighScore(score) {
    const existing = StorageManager.getHighScore();
    if (score > existing) {
      localStorage.setItem(GameSettings.localStorageKey, String(score));
    }
  }
}

class Question {
  constructor(text, answer, x, speed) {
    this.text = text;
    this.answer = answer;
    this.x = x;
    this.y = -24;
    this.speed = speed;
    this.width = 0;
    this.height = 96;
  }

  update(dt) {
    this.y += this.speed * dt;
  }
}

class QuestionGenerator {
  constructor() {
    this.templates = {
      2: [
        () => QuestionGenerator.addition(0, 20),
        () => QuestionGenerator.subtraction(0, 20),
        () => QuestionGenerator.missingNumber(1, 20),
        () => QuestionGenerator.multiplication(1, 5),
      ],
      3: [
        () => QuestionGenerator.addition(0, 50),
        () => QuestionGenerator.subtraction(0, 50),
        () => QuestionGenerator.multiplication(2, 10),
        () => QuestionGenerator.division(2, 10),
      ],
      4: [
        () => QuestionGenerator.multiplication(2, 12),
        () => QuestionGenerator.division(2, 12),
        () => QuestionGenerator.missingNumber(2, 12),
      ],
      5: [
        () => QuestionGenerator.multiplication(6, 12),
        () => QuestionGenerator.division(2, 12),
        () => QuestionGenerator.addition(100, 999),
        () => QuestionGenerator.subtraction(100, 999),
      ],
      6: [
        () => QuestionGenerator.percentageOf(10, 80),
        () => QuestionGenerator.ratioSimplify(),
        () => QuestionGenerator.fractionAddition(),
        () => QuestionGenerator.orderOfOperations(),
      ],
    };
  }

  generate(year) {
    const choices = this.templates[year] || this.templates[2];
    const template = choices[Math.floor(Math.random() * choices.length)];
    return template();
  }

  static addition(min, max) {
    const a = QuestionGenerator.randomInt(min, max);
    const b = QuestionGenerator.randomInt(min, max);
    return { text: `${a} + ${b}`, answer: String(a + b) };
  }

  static subtraction(min, max) {
    const a = QuestionGenerator.randomInt(min, max);
    const b = QuestionGenerator.randomInt(min, Math.min(a, max));
    return { text: `${a} - ${b}`, answer: String(a - b) };
  }

  static missingNumber(min, max) {
    const a = QuestionGenerator.randomInt(min, max);
    const b = QuestionGenerator.randomInt(min, max);
    const sum = a + b;
    return { text: `${sum} - ${b} = ?`, answer: String(a) };
  }

  static multiplication(min, max) {
    const a = QuestionGenerator.randomInt(min, max);
    const b = QuestionGenerator.randomInt(min, max);
    return { text: `${a} × ${b}`, answer: String(a * b) };
  }

  static division(min, max) {
    const b = QuestionGenerator.randomInt(min, max);
    const a = QuestionGenerator.randomInt(min, max) * b;
    return { text: `${a} ÷ ${b}`, answer: QuestionGenerator.formatAnswer(a / b, 2) };
  }

  static decimalAddition(min, max) {
    const a = QuestionGenerator.roundDecimalValue(QuestionGenerator.randFloat(min, max));
    const b = QuestionGenerator.roundDecimalValue(QuestionGenerator.randFloat(min, max));
    return { text: `${a} + ${b}`, answer: QuestionGenerator.roundDecimalValue(a + b) };
  }

  static decimalSubtraction(min, max) {
    const a = QuestionGenerator.roundDecimalValue(QuestionGenerator.randFloat(min, max));
    const b = QuestionGenerator.roundDecimalValue(QuestionGenerator.randFloat(min, max));
    const result = Math.max(a - b, 0.1);
    return { text: `${a} - ${b}`, answer: QuestionGenerator.roundDecimalValue(result) };
  }

  static fractionOf(min, max) {
    const base = QuestionGenerator.randomInt(2, 12);
    const fraction = QuestionGenerator.randomInt(1, 4);
    const result = (fraction / 4) * base;
    return { text: `${fraction}/4 of ${base}`, answer: QuestionGenerator.normalizeDecimal(result) };
  }

  static roundDecimal(min, max) {
    const value = QuestionGenerator.roundDecimalValue(QuestionGenerator.randFloat(min, max));
    return { text: `Round ${value} to 1 decimal place`, answer: QuestionGenerator.formatAnswer(value, 1) };
  }

  static percentageOf(minPct, maxPct) {
    const pct = QuestionGenerator.randomInt(minPct, maxPct);
    const value = QuestionGenerator.randomInt(10, 150);
    const result = (pct / 100) * value;
    return { text: `${pct}% of ${value}`, answer: QuestionGenerator.formatAnswer(result, 2) };
  }

  static ratioSimplify() {
    const a = QuestionGenerator.randomInt(2, 12);
    const b = QuestionGenerator.randomInt(2, 12);
    const gcd = QuestionGenerator.gcd(a, b);
    return { text: `Simplify ${a}:${b}`, answer: `${a / gcd}:${b / gcd}` };
  }

  static fractionAddition() {
    const a = QuestionGenerator.randomInt(1, 4);
    const b = QuestionGenerator.randomInt(1, 4);
    const result = (a + b) / 4;
    return { text: `${a}/4 + ${b}/4`, answer: QuestionGenerator.formatAnswer(result, 2) };
  }

  static orderOfOperations() {
    const a = QuestionGenerator.randomInt(2, 7);
    const b = QuestionGenerator.randomInt(2, 7);
    const c = QuestionGenerator.randomInt(1, 9);
    const value = a * (b + c);
    return { text: `4 × (${a} + ${b})`, answer: String(4 * (a + b)) };
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  static roundDecimalValue(value) {
    return Number(value.toFixed(1));
  }

  static normalizeDecimal(value) {
    return QuestionGenerator.formatAnswer(value, 2);
  }

  static formatAnswer(value, digits = 2) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return String(value);
    }
    const rounded = Number(numeric.toFixed(digits));
    const formatted = rounded.toFixed(digits);
    return formatted.replace(/\.?(?:0+)$/, '');
  }

  static gcd(a, b) {
    return b === 0 ? a : QuestionGenerator.gcd(b, a % b);
  }
}

class Game {
  constructor(ui) {
    this.ui = ui;
    this.generator = new QuestionGenerator();
    this.reset();
    this.lastTimestamp = null;
    this.spawnTimer = 0;
  }

  reset() {
    this.questions = [];
    this.explosions = [];
    this.score = 0;
    this.combo = 0;
    this.longestCombo = 0;
    this.correct = 0;
    this.incorrect = 0;
    this.attempts = 0;
    this.activeYear = 3;
    this.isRunning = false;
    this.lastAnswerTime = null;
    this.spawnInterval = GameSettings.baseSpawnInterval;
  }

  start(year) {
    this.reset();
    this.activeYear = year;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.spawnTimer = 0;
    this.spawnInitialQuestions();
    this.ui.updateHud(this);
    this.ui.showScreen('game-screen');
    requestAnimationFrame(this.loop.bind(this));
  }

  spawnInitialQuestions() {
    const count = Math.min(GameSettings.minQuestionCount, GameSettings.maxQuestionCount);
    for (let i = 0; i < count; i += 1) {
      this.spawnQuestion();
    }
  }

  spawnQuestion() {
    if (this.questions.length >= GameSettings.maxQuestionCount) {
      return;
    }
    const questionData = this.generator.generate(this.activeYear);
    const laneFractions = [0.12, 0.38, 0.64, 0.90];
    const canvasWidth = this.ui.canvasWidth || this.ui.canvas.clientWidth;
    const lanePositions = laneFractions.map((fraction) => Math.round(canvasWidth * fraction));
    const requiredGap = Math.round(110 * (this.ui.canvasScale || 1));

    const laneCandidates = lanePositions.map((position, laneIndex) => {
      const laneQuestions = this.questions.filter((q) => q.lane === laneIndex);
      const topQuestion = laneQuestions.length
        ? laneQuestions.reduce((top, q) => (q.y < top.y ? q : top), laneQuestions[0])
        : null;
      const blocked = topQuestion ? topQuestion.y < requiredGap : false;
      return { laneIndex, position, blocked };
    });

    const openLanes = laneCandidates.filter((lane) => !lane.blocked);
    if (!openLanes.length) {
      return;
    }

    const selectedLane = openLanes[Math.floor(Math.random() * openLanes.length)];
    const fontSize = Math.max(18, Math.round(32 * (this.ui.canvasScale || 1)));
    this.ui.ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    const padding = Math.round(GameSettings.highlightPadding * (this.ui.canvasScale || 1));
    const width = Math.round(this.ui.ctx.measureText(questionData.text).width + padding * 2 + 14);
    const x = Math.max(Math.round(10 * (this.ui.canvasScale || 1)), Math.min(selectedLane.position, canvasWidth - width - Math.round(10 * (this.ui.canvasScale || 1))));
    const speed = (GameSettings.questionSpeedBase + this.score * 0.3) * GameSettings.fallSpeedMultiplier;
    const q = new Question(questionData.text, String(questionData.answer), x, speed / 1000);
    q.width = width;
    q.height = Math.max(72, Math.round(96 * (this.ui.canvasScale || 1)));
    q.lane = selectedLane.laneIndex;
    q.y = Math.round(20 * (this.ui.canvasScale || 1));
    if (!this.canPlaceQuestion(q)) {
      return;
    }
    this.questions.push(q);
  }

  loop(timestamp) {
    if (!this.isRunning) {
      return;
    }

    const dt = Math.min((timestamp - this.lastTimestamp) / 16.67, 3);
    this.lastTimestamp = timestamp;
    this.update(dt);
    this.ui.render(this);
    if (this.checkGameOver()) {
      this.endGame();
      return;
    }
    requestAnimationFrame(this.loop.bind(this));
  }

  update(dt) {
    this.spawnTimer += dt * 16.67;
    const threshold = Math.max(GameSettings.minSpawnInterval, GameSettings.baseSpawnInterval - this.score * 10);
    const topY = this.questions.length ? Math.min(...this.questions.map((q) => q.y)) : Infinity;
    const needsMore = this.questions.length < GameSettings.minQuestionCount;
    const canSpawnFast = this.questions.length < GameSettings.maxQuestionCount && topY > 90;

    if (needsMore || canSpawnFast || this.spawnTimer >= threshold) {
      this.spawnTimer = 0;
      this.spawnQuestion();
    }

    this.questions.forEach((question) => {
      question.speed = (GameSettings.questionSpeedBase + this.score * 0.3) * GameSettings.fallSpeedMultiplier / 1000;
      question.update(dt);
    });

    this.questions.sort((a, b) => b.y - a.y);
    this.explosions = this.explosions.filter((explosion) => {
      explosion.elapsed += dt * 16.67;
      return explosion.elapsed < explosion.duration;
    });
    this.ui.updateHud(this);
  }

  submitAnswer(value, isCorrect) {
    if (!this.isRunning || this.questions.length === 0) {
      return;
    }
    const activeQuestion = this.questions[0];
    this.attempts += 1;
    if (isCorrect) {
      this.correct += 1;
      this.combo += 1;
      this.longestCombo = Math.max(this.longestCombo, this.combo);
      const timeBonus = this.lastAnswerTime ? Math.max(0, 10 - (performance.now() - this.lastAnswerTime) / 1000) : 0;
      this.score += GameSettings.pointsPerCorrect + Math.round(timeBonus) + this.combo * GameSettings.comboBonus;
      const actualWidth = activeQuestion.width || (this.ui.ctx.measureText(activeQuestion.text).width + GameSettings.highlightPadding * 2);
      const centerX = activeQuestion.x + actualWidth / 2;
      const centerY = activeQuestion.y + activeQuestion.height / 2;
      this.explosions.push({
        x: centerX,
        y: centerY,
        elapsed: 0,
        duration: 300,
        maxRadius: 42,
      });
      this.questions.shift();
      this.lastAnswerTime = performance.now();
      const activeNext = this.questions[0];
      if (!activeNext) {
        this.spawnQuestion();
      }
    } else {
      this.incorrect += 1;
      this.combo = 0;
    }
    this.ui.updateHud(this);
  }

  generateChoices(correctAnswer) {
    const correct = String(correctAnswer).trim();
    const distractors = [];
    const numericAnswer = Number(correct);
    const isNumeric = !Number.isNaN(numericAnswer);

    const addDistractor = (value) => {
      if (distractors.length >= 5) return;
      const text = String(value);
      if (text !== correct && !distractors.includes(text)) {
        distractors.push(text);
      }
    };

    if (isNumeric) {
      const delta = Math.max(1, Math.round(Math.abs(numericAnswer) * 0.2));
      for (let i = 1; i <= 4 && distractors.length < 5; i += 1) {
        addDistractor(numericAnswer + i * delta);
        if (distractors.length < 5) addDistractor(numericAnswer - i * delta);
      }
      addDistractor(numericAnswer + 1);
      addDistractor(numericAnswer - 1);
    } else if (correct.includes(':')) {
      const [left, right] = correct.split(':').map(Number);
      addDistractor(`${left + 1}:${right}`);
      addDistractor(`${left}:${right + 1}`);
      addDistractor(`${Math.max(1, left - 1)}:${right}`);
      addDistractor(`${left}:${Math.max(1, right - 1)}`);
      addDistractor(`${left + 2}:${Math.max(1, right - 1)}`);
    } else if (correct.includes('/')) {
      const [num, den] = correct.split('/').map(Number);
      addDistractor(`${Math.max(1, num - 1)}/${den}`);
      addDistractor(`${num}/${Math.max(1, den - 1)}`);
      addDistractor(`${num + 1}/${den}`);
      addDistractor(`${num}/${den + 1}`);
      addDistractor(`${Math.max(1, num - 1)}/${Math.max(1, den + 1)}`);
    } else {
      addDistractor(correct + ' + 1');
      addDistractor(correct + ' - 1');
      addDistractor(`${correct}?`);
      addDistractor(`${correct}0`);
      addDistractor(`(${correct})`);
    }

    while (distractors.length < 5) {
      const fallback = isNumeric ? numericAnswer + Math.pow(-1, distractors.length) * (distractors.length + 1) : `${correct}-${distractors.length}`;
      addDistractor(fallback);
    }

    const answers = [{ value: correct, isCorrect: true }, ...distractors.map((d) => ({ value: d, isCorrect: false }))];
    Game.shuffleArray(answers);
    return answers;
  }

  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  canPlaceQuestion(candidate) {
    return !this.questions.some((question) => {
      const leftA = candidate.x;
      const rightA = candidate.x + candidate.width;
      const topA = candidate.y;
      const bottomA = candidate.y + candidate.height;
      const leftB = question.x;
      const rightB = question.x + question.width;
      const topB = question.y;
      const bottomB = question.y + question.height;
      const horizontalOverlap = leftA < rightB && rightA > leftB;
      const verticalOverlap = topA < bottomB && bottomA > topB;
      return horizontalOverlap && verticalOverlap;
    });
  }

  checkGameOver() {
    if (this.incorrect >= GameSettings.maxWrongAnswers) {
      return true;
    }
    return this.questions.some((question) => question.y + question.height >= (this.ui.canvasHeight || this.ui.canvas.clientHeight) - Math.round(6 * (this.ui.canvasScale || 1)));
  }

  endGame() {
    this.isRunning = false;
    StorageManager.setHighScore(this.score);
    this.ui.showGameOver(this);
  }
}

class UIManager {
  constructor() {
    this.screens = {
      auth: document.getElementById('auth-screen'),
      menu: document.getElementById('menu-screen'),
      year: document.getElementById('year-screen'),
      stats: document.getElementById('stats-screen'),
      settings: document.getElementById('settings-screen'),
      game: document.getElementById('game-screen'),
      gameover: document.getElementById('gameover-screen'),
    };
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.choicePanel = document.getElementById('choice-panel');
    this.scoreLabel = document.getElementById('hud-score');
    this.comboLabel = document.getElementById('hud-combo');
    this.wrongLabel = document.getElementById('hud-wrong-left');
    this.yearLabel = document.getElementById('hud-year');
    this.accuracyLabel = document.getElementById('hud-accuracy');
    this.menuYearLabel = document.getElementById('menu-year-label');
    this.menuHighScore = document.getElementById('menu-high-score');
    this.statsHighScore = document.getElementById('stats-high-score');
    this.statsAccuracy = document.getElementById('stats-accuracy');
    this.statsCombo = document.getElementById('stats-best-combo');
    this.finalScore = document.getElementById('final-score');
    this.finalAccuracy = document.getElementById('final-accuracy');
    this.finalCombo = document.getElementById('final-combo');
    this.finalAnswered = document.getElementById('final-answered');
    this.finalHighScore = document.getElementById('final-high-score');
    this.authInput = document.getElementById('auth-password');
    this.authButton = document.getElementById('auth-button');
    this.authError = document.getElementById('auth-error');
    this.yearButtons = Array.from(document.querySelectorAll('.year-button'));
    this.selectedYear = 3;
    this.menuYearLabel.textContent = 'Year 3';
    this.authSecret = ['rain','bow','8','star'].join('');
    this.canvasWidth = 760;
    this.canvasHeight = 500;
    this.canvasScale = 1;
    this.initControls();
    this.updateScoreboard();
  }

  initControls() {
    document.getElementById('play-button').addEventListener('click', () => this.onStart());
    document.getElementById('select-year-button').addEventListener('click', () => this.showScreen('year-screen'));
    document.getElementById('stats-button').addEventListener('click', () => this.showStats());
    document.getElementById('settings-button').addEventListener('click', () => this.showSettings());
    document.getElementById('year-back-button').addEventListener('click', () => this.showScreen('menu-screen'));
    document.getElementById('stats-back-button').addEventListener('click', () => this.showScreen('menu-screen'));
    document.getElementById('settings-back-button').addEventListener('click', () => this.showScreen('menu-screen'));
    document.getElementById('settings-save-button').addEventListener('click', () => this.saveSettings());
    document.getElementById('quit-button').addEventListener('click', () => this.showScreen('menu-screen'));
    document.getElementById('restart-button').addEventListener('click', () => this.onStart());
    document.getElementById('gameover-back-button').addEventListener('click', () => this.showScreen('menu-screen'));
    this.authButton.addEventListener('click', () => this.tryUnlock());
    this.authInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.tryUnlock();
      }
    });
    this.yearButtons.forEach((button) => {
      button.addEventListener('click', () => this.setYear(Number(button.dataset.year)));
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && this.isGameScreenVisible()) {
        event.preventDefault();
      }
    });
  }

  setGame(game) {
    this.game = game;
    this.updateScoreboard();
    this.loadSettingsForm();
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const visibleWidth = rect.width || this.canvas.clientWidth || this.canvas.offsetWidth || 760;
    const visibleHeight = rect.height || this.canvas.clientHeight || this.canvas.offsetHeight || Math.round(visibleWidth * (500 / 760));
    this.canvasWidth = visibleWidth;
    this.canvasHeight = visibleHeight;
    this.canvasScale = Math.max(0.8, Math.min(1.6, this.canvasWidth / 760));
    const width = Math.round(visibleWidth * dpr);
    const height = Math.round(visibleHeight * dpr);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  tryUnlock() {
    const value = this.authInput.value.trim();
    if (!value) {
      return;
    }
    if (value === this.authSecret) {
      this.authError.classList.add('hidden');
      this.showScreen('menu-screen');
    } else {
      this.authError.classList.remove('hidden');
    }
  }

  onStart() {
    this.resizeCanvas();
    this.game.start(this.selectedYear || 2);
    this.renderChoices();
  }

  showScreen(id) {
    Object.values(this.screens).forEach((screen) => screen.classList.add('hidden'));
    const screen = this.screens[id.replace('-screen', '')] || this.screens[id];
    if (screen) {
      screen.classList.remove('hidden');
    }
    if (id === 'menu-screen') {
      this.updateScoreboard();
    }
  }

  showStats() {
    this.updateScoreboard();
    this.showScreen('stats-screen');
  }

  showSettings() {
    this.loadSettingsForm();
    this.showScreen('settings-screen');
  }

  setYear(year) {
    this.selectedYear = year;
    this.menuYearLabel.textContent = `Year ${year}`;
    this.yearLabel.textContent = String(year);
    this.showScreen('menu-screen');
  }

  updateHud(game) {
    if (!game) return;
    this.scoreLabel.textContent = String(game.score);
    this.comboLabel.textContent = String(game.combo);
    this.wrongLabel.textContent = String(Math.max(0, GameSettings.maxWrongAnswers - game.incorrect));
    this.yearLabel.textContent = String(game.activeYear);
    this.accuracyLabel.textContent = `${this.getAccuracy(game)}%`;
  }

  updateScoreboard() {
    const highScore = StorageManager.getHighScore();
    this.menuHighScore.textContent = String(highScore);
    this.statsHighScore.textContent = String(highScore);
    this.statsAccuracy.textContent = '0%';
    this.statsCombo.textContent = '0';
  }

  getAccuracy(game) {
    if (!game || game.attempts === 0) {
      return 100;
    }
    return Math.round((game.correct / game.attempts) * 100);
  }

  showGameOver(game) {
    this.finalScore.textContent = String(game.score);
    this.finalAccuracy.textContent = `${this.getAccuracy(game)}%`;
    this.finalCombo.textContent = String(game.longestCombo);
    this.finalAnswered.textContent = String(game.correct + game.incorrect);
    this.finalHighScore.textContent = String(StorageManager.getHighScore());
    this.showScreen('gameover-screen');
  }

  createChoiceButton(value, isCorrect) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-button';
    button.textContent = value;
    button.addEventListener('click', () => this.submitChoice(value, isCorrect));
    return button;
  }

  renderChoices() {
    this.choicePanel.innerHTML = '';
    if (!this.game || !this.game.questions.length) {
      return;
    }
    const question = this.game.questions[0];
    const answers = this.game.generateChoices(question.answer);
    answers.forEach(({ value, isCorrect }) => {
      this.choicePanel.appendChild(this.createChoiceButton(value, isCorrect));
    });
  }

  submitChoice(value, isCorrect) {
    this.game.submitAnswer(value, isCorrect);
    this.renderChoices();
  }

  loadSettingsForm() {
    document.getElementById('settings-max-wrong').value = String(GameSettings.maxWrongAnswers);
    document.getElementById('settings-spawn-interval').value = String(GameSettings.baseSpawnInterval);
    document.getElementById('settings-speed-multiplier').value = String(GameSettings.fallSpeedMultiplier);
  }

  saveSettings() {
    const wrong = Number(document.getElementById('settings-max-wrong').value);
    const spawnInterval = Number(document.getElementById('settings-spawn-interval').value);
    const speedMultiplier = Number(document.getElementById('settings-speed-multiplier').value);
    if (Number.isInteger(wrong) && wrong >= 1) {
      GameSettings.maxWrongAnswers = wrong;
    }
    if (spawnInterval >= 500) {
      GameSettings.baseSpawnInterval = spawnInterval;
    }
    if (speedMultiplier >= 0.3) {
      GameSettings.fallSpeedMultiplier = speedMultiplier;
    }
    this.showScreen('menu-screen');
  }

  render(game) {
    if (!game) return;
    const ctx = this.ctx;
    const canvasWidth = this.canvasWidth;
    const canvasHeight = this.canvasHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#091624';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const active = game.questions[0];
    game.questions.forEach((question, index) => {
      const isActive = question === active;
      const scale = this.canvasScale || 1;
      const padding = Math.round((isActive ? GameSettings.highlightPadding + 10 : 18) * scale);
      const fontSize = Math.max(18, Math.round((isActive ? 32 : 24) * scale));
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      const boxWidth = Math.round(ctx.measureText(question.text).width + padding * 2 + 14);
      question.width = boxWidth;
      const x = Math.max(Math.round(10 * scale), Math.min(question.x, canvasWidth - boxWidth - Math.round(10 * scale)));
      question.x = x;
      const y = question.y;

      if (isActive) {
        ctx.fillStyle = 'rgba(80, 216, 255, 0.16)';
        ctx.strokeStyle = 'rgba(80, 216, 255, 0.95)';
        ctx.lineWidth = Math.max(2, Math.round(4 * scale));
        ctx.shadowColor = 'rgba(80, 216, 255, 0.6)';
        ctx.shadowBlur = Math.round(18 * scale);
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = Math.max(1, Math.round(2 * scale));
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.roundRect(x, y, boxWidth, question.height, Math.round(14 * scale));
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = isActive ? '#e9fbff' : '#dfe7ff';
      ctx.fillText(question.text, x + padding, y + Math.round(54 * scale));
    });

    game.explosions.forEach((explosion) => {
      const progress = Math.min(1, explosion.elapsed / explosion.duration);
      const radius = explosion.maxRadius * progress;
      const alpha = 1 - progress;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(122, 242, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(explosion.x, explosion.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(explosion.x, explosion.y, radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  isGameScreenVisible() {
    return !this.screens['game'].classList.contains('hidden');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const ui = new UIManager();
  const game = new Game(ui);
  ui.setGame(game);
  ui.showScreen('auth-screen');
  ui.resizeCanvas();
  // populate version badge from GameSettings if present
  try {
    const badge = document.getElementById('version-badge');
    if (badge && window.GameSettings && GameSettings.version) {
      badge.textContent = GameSettings.version;
    }
  } catch (e) {
    // ignore
  }
  window.addEventListener('resize', () => ui.resizeCanvas());
});
