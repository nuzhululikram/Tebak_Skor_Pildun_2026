/* =========================================================
   STORAGE.JS
   --------------------------------------------------------
   Lapisan penyimpanan terpusat menggunakan LocalStorage agar
   data TIDAK hilang saat halaman di-refresh.
   Semua modul lain (bracket.js, scoreGuess.js, dst) memanggil
   fungsi-fungsi di sini, bukan mengakses localStorage langsung.
   ========================================================= */

const STORAGE_KEYS = {
  SCORE_GUESSES: "wc2026_score_guesses",
  CHAMPION_GUESSES: "wc2026_champion_guesses",
  BRACKETS: "wc2026_brackets",          // bracket per-user
  OFFICIAL_RESULTS: "wc2026_official_results", // hasil resmi per matchId
  OFFICIAL_CHAMPION: "wc2026_official_champion",
  CURRENT_USER: "wc2026_current_user",
};

const Storage = {
  /* ---------- Helper generik ---------- */
  _get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn("Storage read error for", key, e);
      return fallback;
    }
  },
  _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("Storage write error for", key, e);
      return false;
    }
  },

  /* ---------- User aktif (nama global) ---------- */
  getCurrentUser() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || "";
  },
  setCurrentUser(name) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, name);
  },

  /* ---------- Tebak Skor ---------- */
  getScoreGuesses() {
    return this._get(STORAGE_KEYS.SCORE_GUESSES, []);
  },
  addScoreGuess(guess) {
    const list = this.getScoreGuesses();
    // Jika user yang sama sudah menebak pertandingan yang sama, update (replace)
    const idx = list.findIndex(
      g => g.matchId === guess.matchId && g.userName.toLowerCase() === guess.userName.toLowerCase()
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...guess, updatedAt: Date.now() };
    } else {
      list.push({ ...guess, id: "sg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7), createdAt: Date.now() });
    }
    this._set(STORAGE_KEYS.SCORE_GUESSES, list);
    return list;
  },

  /* ---------- Tebak Juara Dunia ---------- */
  getChampionGuesses() {
    return this._get(STORAGE_KEYS.CHAMPION_GUESSES, []);
  },
  addChampionGuess(guess) {
    const list = this.getChampionGuesses();
    const idx = list.findIndex(g => g.userName.toLowerCase() === guess.userName.toLowerCase());
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...guess, updatedAt: Date.now() };
    } else {
      list.push({ ...guess, id: "cg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7), createdAt: Date.now() });
    }
    this._set(STORAGE_KEYS.CHAMPION_GUESSES, list);
    return list;
  },

  /* ---------- Bracket (per nama user) ---------- */
  getAllBrackets() {
    return this._get(STORAGE_KEYS.BRACKETS, {});
  },
  getBracketForUser(userName) {
    const all = this.getAllBrackets();
    const key = (userName || "guest").toLowerCase();
    return all[key] ? all[key].data : null;
  },
  saveBracketForUser(userName, bracketData) {
    const all = this.getAllBrackets();
    const key = (userName || "guest").toLowerCase();
    all[key] = { displayName: userName || "Guest", data: bracketData, updatedAt: Date.now() };
    this._set(STORAGE_KEYS.BRACKETS, all);
  },

  /* ---------- Hasil Resmi Pertandingan (Admin input) ---------- */
  getOfficialResults() {
    return this._get(STORAGE_KEYS.OFFICIAL_RESULTS, {});
  },
  setOfficialResult(matchId, scoreA, scoreB) {
    const results = this.getOfficialResults();
    results[matchId] = { scoreA: Number(scoreA), scoreB: Number(scoreB) };
    this._set(STORAGE_KEYS.OFFICIAL_RESULTS, results);
    return results;
  },

  /* ---------- Juara Dunia Resmi (Admin input) ---------- */
  getOfficialChampion() {
    return localStorage.getItem(STORAGE_KEYS.OFFICIAL_CHAMPION) || "";
  },
  setOfficialChampion(country) {
    localStorage.setItem(STORAGE_KEYS.OFFICIAL_CHAMPION, country);
  },
};
