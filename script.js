document.addEventListener('DOMContentLoaded', () => {
  const todayKey = new Date().toISOString().split('T')[0];
  
  // --- Dark Mode Setup ---
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('grace_theme');
  
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }

  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.setItem('grace_theme', 'light');
      } else {
        htmlElement.classList.add('dark');
        localStorage.setItem('grace_theme', 'dark');
      }
    });
  }

  // --- Rhythm, Streaks & Goals State ---
  let state = JSON.parse(localStorage.getItem('grace_growth_rhythm_state')) || {
    streak: 0,
    lastActiveDate: null,
    checkedInToday: false,
    goals: [
      { text: "Take one 5-minute pause", completed: false },
      { text: "Speak gently to yourself", completed: false }
    ]
  };

  const streakEl = document.getElementById('streak-count');
  const goalsContainer = document.getElementById('goals-container');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const addGoalForm = document.getElementById('add-goal-form');
  const newGoalInput = document.getElementById('new-goal-input');
  const checkInBtn = document.getElementById('check-in-btn');

  function evaluateStreak() {
    if (state.lastActiveDate) {
      const lastDate = new Date(state.lastActiveDate);
      const currentDate = new Date(todayKey);
      const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1 && !state.checkedInToday) {
        state.streak = 0;
        state.checkedInToday = false;
      }
    }
    streakEl.textContent = state.streak;
    updateCheckInButtonStyle();
  }

  function updateCheckInButtonStyle() {
    if (state.checkedInToday) {
      checkInBtn.textContent = "Checked in for today! ✦";
      checkInBtn.className = "px-5 py-2.5 bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-sm font-medium rounded-xl cursor-default transition-colors";
    } else {
      checkInBtn.textContent = "Yes, I did ✦";
      checkInBtn.className = "px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition shadow-sm";
    }
  }

  function render() {
    goalsContainer.innerHTML = '';
    
    if (state.goals.length === 0) {
      goalsContainer.innerHTML = `<p class="text-xs text-stone-400 dark:text-stone-500 italic">No goals set for today yet.</p>`;
    }

    let completedCount = 0;
    const totalGoals = state.goals.length;

    state.goals.forEach((goal, index) => {
      if (goal.completed) completedCount++;

      const goalItem = document.createElement('div');
      goalItem.className = `flex items-center justify-between p-3 rounded-xl border transition-colors ${
        goal.completed 
          ? 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 line-through' 
          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200'
      }`;
      
      goalItem.innerHTML = `
        <label class="flex items-center gap-3 cursor-pointer flex-1 text-sm">
          <input type="checkbox" data-index="${index}" ${goal.completed ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-700 dark:text-emerald-500 focus:ring-emerald-600 border-stone-300 dark:border-stone-600 dark:bg-stone-700">
          <span>${goal.text}</span>
        </label>
        <button data-delete="${index}" class="text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400 px-2 text-xs">✕</button>
      `;
      goalsContainer.appendChild(goalItem);
    });

    let score = completedCount;
    let maxScore = totalGoals > 0 ? totalGoals : 1;
    let percentage = Math.round((score / maxScore) * 100);
    
    if (state.checkedInToday) percentage = 100;

    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;

    localStorage.setItem('grace_growth_rhythm_state', JSON.stringify(state));
  }

  checkInBtn.addEventListener('click', () => {
    if (!state.checkedInToday) {
      if (state.lastActiveDate) {
        const lastDate = new Date(state.lastActiveDate);
        const currentDate = new Date(todayKey);
        const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) state.streak += 1;
        else if (diffDays > 1) state.streak = 1;
      } else {
        state.streak = 1;
      }

      state.checkedInToday = true;
      state.lastActiveDate = todayKey;
      state.goals.forEach(g => g.completed = true);

      streakEl.textContent = state.streak;
      updateCheckInButtonStyle();
      render();
    }
  });

  addGoalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = newGoalInput.value.trim();
    if (!text) return;

    state.goals.push({ text, completed: false });
    newGoalInput.value = '';
    render();
  });

  goalsContainer.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      state.goals[e.target.getAttribute('data-index')].completed = e.target.checked;
      render();
    }
  });

  goalsContainer.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-delete')) {
      state.goals.splice(e.target.getAttribute('data-delete'), 1);
      render();
    }
  });

  if (state.lastActiveDate !== todayKey) {
    state.checkedInToday = false;
  }

  evaluateStreak();
  render();
});
