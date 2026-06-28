/* =========================================================
   CHAMPIONGUESS.JS
   Fitur Tebak Juara Dunia: input nama + negara pilihan.
   Semua tebakan muncul dalam list & tally di halaman yang sama.
   ========================================================= */

const ChampionGuess = {
  init() {
    this.populateCountryDatalist();
    this.bindEvents();
    this.renderAll();
  },

  populateCountryDatalist() {
    const datalist = document.getElementById("countryList");
    datalist.innerHTML = "";
    ALL_COUNTRIES.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      datalist.appendChild(opt);
    });
  },

  bindEvents() {
    document.getElementById("championGuessForm").addEventListener("submit", (e) => this.handleSubmit(e));
  },

  handleSubmit(e) {
    e.preventDefault();
    const userName = document.getElementById("championUserName").value.trim();
    const country = document.getElementById("championCountry").value.trim();
    const msgEl = document.getElementById("championFormMsg");

    if (!userName || !country) {
      this.showMsg(msgEl, "Nama dan negara wajib diisi.", "error");
      return;
    }

    Storage.addChampionGuess({ userName, country });
    syncGlobalUserName(userName);

    this.showMsg(msgEl, `👑 Tersimpan: ${userName} memilih ${country} sebagai juara dunia!`, "success");
    document.getElementById("championGuessForm").reset();
    document.getElementById("championUserName").value = userName;

    this.renderAll();
    Dashboard.renderStats();
    Leaderboard.render();
  },

  showMsg(el, text, type) {
    el.textContent = text;
    el.className = "form-msg " + type;
    setTimeout(() => { el.textContent = ""; el.className = "form-msg"; }, 3500);
  },

  renderAll() {
    this.renderTally();
    this.renderList();
  },

  renderTally() {
    const tallyEl = document.getElementById("championTally");
    const guesses = Storage.getChampionGuesses();

    if (guesses.length === 0) {
      tallyEl.innerHTML = "";
      return;
    }

    const counts = {};
    guesses.forEach(g => {
      const key = g.country.trim();
      counts[key] = (counts[key] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    tallyEl.innerHTML = sorted.map(([country, count]) => `
      <span class="tally-chip">${getFlag(country)} ${escapeHtml(country)} <span class="count">${count}</span></span>
    `).join("");
  },

  renderList() {
    const listEl = document.getElementById("championGuessList");
    const guesses = Storage.getChampionGuesses().slice().sort((a, b) => b.createdAt - a.createdAt);
    const officialChampion = Storage.getOfficialChampion();

    if (guesses.length === 0) {
      listEl.innerHTML = `<p class="empty-state">Belum ada tebakan juara dunia. Jadilah yang pertama!</p>`;
      return;
    }

    listEl.innerHTML = guesses.map(g => {
      const isCorrect = officialChampion && g.country.toLowerCase() === officialChampion.toLowerCase();
      return `
        <div class="champion-card">
          <span class="name">👤 ${escapeHtml(g.userName)}</span>
          <span class="pick">${getFlag(g.country)} ${escapeHtml(g.country)} ${isCorrect ? " 🏆+" + POINTS.CHAMPION_CORRECT : ""}</span>
        </div>
      `;
    }).join("");
  },
};
