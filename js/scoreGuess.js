/* =========================================================
   SCOREGUESS.JS
   Fitur Tebak Skor: pilih pertandingan, isi nama, isi skor.
   Data tersimpan permanen via Storage (LocalStorage).
   ========================================================= */

const ScoreGuess = {
  init() {
    this.populateMatchSelect();
    this.populateFilterSelect();
    this.bindEvents();
    this.renderList();
    this.updateTeamBoxes();
  },

  populateMatchSelect() {
    const select = document.getElementById("matchSelect");
    select.innerHTML = "";
    MATCHES_R16.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = `${m.id}: ${m.teamA} vs ${m.teamB} — ${formatDateShort(m.date)} ${m.time} WIB`;
      select.appendChild(opt);
    });
  },

  populateFilterSelect() {
    const filter = document.getElementById("filterMatchPredictions");
    filter.innerHTML = `<option value="all">Semua Pertandingan</option>`;
    MATCHES_R16.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = `${m.id}: ${m.teamA} vs ${m.teamB}`;
      filter.appendChild(opt);
    });
  },

  bindEvents() {
    document.getElementById("matchSelect").addEventListener("change", () => this.updateTeamBoxes());
    document.getElementById("scoreGuessForm").addEventListener("submit", (e) => this.handleSubmit(e));
    document.getElementById("filterMatchPredictions").addEventListener("change", () => this.renderList());
  },

  updateTeamBoxes() {
    const matchId = document.getElementById("matchSelect").value;
    const match = MATCHES_R16.find(m => m.id === matchId);
    if (!match) return;
    document.getElementById("teamAFlag").textContent = getFlag(match.teamA);
    document.getElementById("teamAName").textContent = match.teamA;
    document.getElementById("teamBFlag").textContent = getFlag(match.teamB);
    document.getElementById("teamBName").textContent = match.teamB;
  },

  handleSubmit(e) {
    e.preventDefault();
    const userName = document.getElementById("guessUserName").value.trim();
    const matchId = document.getElementById("matchSelect").value;
    const scoreA = document.getElementById("scoreA").value;
    const scoreB = document.getElementById("scoreB").value;
    const msgEl = document.getElementById("scoreFormMsg");

    if (!userName) {
      this.showMsg(msgEl, "Nama tidak boleh kosong.", "error");
      return;
    }
    if (scoreA === "" || scoreB === "") {
      this.showMsg(msgEl, "Isi kedua skor terlebih dahulu.", "error");
      return;
    }

    Storage.addScoreGuess({
      userName,
      matchId,
      scoreA: Number(scoreA),
      scoreB: Number(scoreB),
    });

    // Sinkronkan nama ke header global juga
    syncGlobalUserName(userName);

    this.showMsg(msgEl, `✅ Tebakan tersimpan: ${userName} → ${scoreA}-${scoreB}`, "success");
    document.getElementById("scoreGuessForm").reset();
    document.getElementById("guessUserName").value = userName;
    this.updateTeamBoxes();
    this.renderList();
    Dashboard.renderStats();
    Leaderboard.render();
  },

  showMsg(el, text, type) {
    el.textContent = text;
    el.className = "form-msg " + type;
    setTimeout(() => { el.textContent = ""; el.className = "form-msg"; }, 3500);
  },

  renderList() {
    const listEl = document.getElementById("scorePredictionsList");
    const filterVal = document.getElementById("filterMatchPredictions").value;
    let guesses = Storage.getScoreGuesses();

    if (filterVal !== "all") {
      guesses = guesses.filter(g => g.matchId === filterVal);
    }

    guesses.sort((a, b) => b.createdAt - a.createdAt);

    if (guesses.length === 0) {
      listEl.innerHTML = `<p class="empty-state">Belum ada tebakan skor untuk filter ini.</p>`;
      return;
    }

    const officialResults = Storage.getOfficialResults();
    listEl.innerHTML = "";

    guesses.forEach(g => {
      const match = MATCHES_R16.find(m => m.id === g.matchId);
      if (!match) return;
      const result = officialResults[g.matchId];
      const { label, cssClass } = computeScorePointLabel(g, result);

      const card = document.createElement("div");
      card.className = "prediction-card";
      card.innerHTML = `
        <div class="prediction-card-top">
          <span class="prediction-user">👤 ${escapeHtml(g.userName)}</span>
          <span class="prediction-points ${cssClass}">${label}</span>
        </div>
        <div class="prediction-match">${getFlag(match.teamA)} ${match.teamA} vs ${match.teamB} ${getFlag(match.teamB)}</div>
        <div class="prediction-score">${g.scoreA} - ${g.scoreB}</div>
      `;
      listEl.appendChild(card);
    });
  },
};

/* ---------- Helper umum (dipakai juga modul lain) ---------- */
function formatDateShort(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function computeScorePointLabel(guess, officialResult) {
  if (!officialResult) {
    return { label: "Menunggu Hasil", cssClass: "pending" };
  }
  const exact = guess.scoreA === officialResult.scoreA && guess.scoreB === officialResult.scoreB;
  if (exact) {
    return { label: `Tepat! +${POINTS.EXACT_SCORE} poin`, cssClass: "correct" };
  }
  const guessOutcome = outcomeOf(guess.scoreA, guess.scoreB);
  const realOutcome = outcomeOf(officialResult.scoreA, officialResult.scoreB);
  if (guessOutcome === realOutcome) {
    return { label: `Hasil Benar +${POINTS.CORRECT_OUTCOME} poin`, cssClass: "partial" };
  }
  return { label: "Tidak Tepat", cssClass: "wrong" };
}

function outcomeOf(a, b) {
  if (a > b) return "A";
  if (a < b) return "B";
  return "DRAW";
}

function syncGlobalUserName(name) {
  const input = document.getElementById("globalUsername");
  if (input && !input.value.trim()) {
    input.value = name;
    Storage.setCurrentUser(name);
  }
}
