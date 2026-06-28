/* =========================================================
   LEADERBOARD.JS
   Menghitung & menampilkan papan peringkat otomatis
   berdasarkan: poin tebak skor + poin bracket + poin juara.
   Termasuk panel admin sederhana untuk input hasil resmi
   (disimpan di LocalStorage — cocok untuk demo/skala kecil).
   ========================================================= */

const Leaderboard = {
  init() {
    this.populateAdminMatchSelect();
    this.bindAdminEvents();
    this.render();
  },

  populateAdminMatchSelect() {
    const select = document.getElementById("adminMatchSelect");
    select.innerHTML = "";
    MATCHES_R16.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = `${m.id}: ${m.teamA} vs ${m.teamB}`;
      select.appendChild(opt);
    });
    this.fillAdminScoreFromExisting();
    select.addEventListener("change", () => this.fillAdminScoreFromExisting());
  },

  fillAdminScoreFromExisting() {
    const matchId = document.getElementById("adminMatchSelect").value;
    const results = Storage.getOfficialResults();
    const r = results[matchId];
    document.getElementById("adminScoreA").value = r ? r.scoreA : "";
    document.getElementById("adminScoreB").value = r ? r.scoreB : "";
  },

  bindAdminEvents() {
    document.getElementById("adminSaveResultBtn").addEventListener("click", () => {
      const matchId = document.getElementById("adminMatchSelect").value;
      const scoreA = document.getElementById("adminScoreA").value;
      const scoreB = document.getElementById("adminScoreB").value;
      if (scoreA === "" || scoreB === "") {
        showToast("Isi skor A dan B terlebih dahulu.");
        return;
      }
      Storage.setOfficialResult(matchId, scoreA, scoreB);
      showToast(`Hasil resmi ${matchId} disimpan: ${scoreA}-${scoreB}`);
      this.render();
      Dashboard.renderMatchGrid();
      ScoreGuess.renderList();
    });

    document.getElementById("adminSaveChampionBtn").addEventListener("click", () => {
      const country = document.getElementById("adminChampionInput").value.trim();
      if (!country) {
        showToast("Isi nama negara juara dunia.");
        return;
      }
      Storage.setOfficialChampion(country);
      showToast(`Juara dunia resmi disimpan: ${country}`);
      this.render();
      ChampionGuess.renderList();
    });
  },

  /* ---------- Hitung total poin per pengguna ---------- */
  computeAllUserPoints() {
    const users = {}; // key: lowercase name -> { name, scorePoints, bracketPoints, championPoints }

    const ensureUser = (name) => {
      const key = name.toLowerCase();
      if (!users[key]) {
        users[key] = { name, scorePoints: 0, bracketPoints: 0, championPoints: 0 };
      }
      return users[key];
    };

    /* --- 1. Poin Tebak Skor --- */
    const officialResults = Storage.getOfficialResults();
    Storage.getScoreGuesses().forEach(g => {
      const result = officialResults[g.matchId];
      if (!result) return;
      const u = ensureUser(g.userName);
      const exact = g.scoreA === result.scoreA && g.scoreB === result.scoreB;
      if (exact) {
        u.scorePoints += POINTS.EXACT_SCORE;
      } else if (outcomeOf(g.scoreA, g.scoreB) === outcomeOf(result.scoreA, result.scoreB)) {
        u.scorePoints += POINTS.CORRECT_OUTCOME;
      }
    });

    /* --- 2. Poin Bracket --- */
    // Bangun "ground truth" pemenang setiap babak dari hasil resmi yang sudah diinput admin.
    const officialWinners = this.computeOfficialWinnersFromResults(officialResults);

    const allBrackets = Storage.getAllBrackets();
    Object.values(allBrackets).forEach(entry => {
      const name = entry.displayName || "Guest";
      const u = ensureUser(name);
      const bracket = entry.data;
      if (!bracket) return;

      bracket.round16.forEach(m => {
        if (m.winner && officialWinners[m.matchId] && m.winner === officialWinners[m.matchId]) {
          u.bracketPoints += POINTS.BRACKET_R16;
        }
      });
      bracket.quarterfinal.forEach(m => {
        if (m.winner && officialWinners[m.matchId] && m.winner === officialWinners[m.matchId]) {
          u.bracketPoints += POINTS.BRACKET_QF;
        }
      });
      bracket.semifinal.forEach(m => {
        if (m.winner && officialWinners[m.matchId] && m.winner === officialWinners[m.matchId]) {
          u.bracketPoints += POINTS.BRACKET_SF;
        }
      });
      bracket.final4.forEach(m => {
        if (m.winner && officialWinners[m.matchId] && m.winner === officialWinners[m.matchId]) {
          u.bracketPoints += POINTS.BRACKET_SF;
        }
      });
      if (bracket.final.winner && officialWinners["FINAL"] && bracket.final.winner === officialWinners["FINAL"]) {
        u.bracketPoints += POINTS.BRACKET_FINAL;
      }
    });

    /* --- 3. Poin Juara Dunia --- */
    const officialChampion = Storage.getOfficialChampion();
    if (officialChampion) {
      Storage.getChampionGuesses().forEach(g => {
        if (g.country.toLowerCase() === officialChampion.toLowerCase()) {
          const u = ensureUser(g.userName);
          u.championPoints += POINTS.CHAMPION_CORRECT;
        }
      });
    }

    return Object.values(users).map(u => ({
      ...u,
      total: u.scorePoints + u.bracketPoints + u.championPoints,
    })).sort((a, b) => b.total - a.total);
  },

  /* Catatan: karena tidak ada hasil resmi untuk QF/SF/Final (hanya R16 yang
     punya pertandingan nyata di data dummy ini), fungsi ini hanya bisa
     menentukan pemenang R16 dari skor resmi. Untuk babak selanjutnya,
     admin dapat memperluas MATCHES list / menambah input hasil manual
     dengan pola matchId yang sama (QF-1, SF-1, FINAL, dst) di
     Storage.setOfficialResult() melalui console atau form admin tambahan. */
  computeOfficialWinnersFromResults(officialResults) {
    const winners = {};
    Object.entries(officialResults).forEach(([matchId, result]) => {
      if (result.scoreA === result.scoreB) return; // tidak ada pemenang jika seri (abaikan utk demo)
      const match = MATCHES_R16.find(m => m.id === matchId);
      if (match) {
        winners[matchId] = result.scoreA > result.scoreB ? match.teamA : match.teamB;
      } else {
        // Untuk matchId non-R16 (QF/SF/F4/FINAL) yang diinput manual via admin,
        // kita tidak tahu nama tim dari sini secara langsung, jadi dilewati.
        // (Lihat catatan di atas.)
      }
    });
    return winners;
  },

  render() {
    const points = this.computeAllUserPoints();
    const body = document.getElementById("leaderboardBody");
    const empty = document.getElementById("leaderboardEmpty");

    if (points.length === 0) {
      body.innerHTML = "";
      empty.style.display = "block";
      this.updateGlobalUserPoints(points);
      return;
    }

    empty.style.display = "none";
    const medals = ["🥇", "🥈", "🥉"];

    body.innerHTML = points.map((u, idx) => `
      <tr>
        <td>${medals[idx] ? `<span class="rank-medal">${medals[idx]}</span>` : idx + 1}</td>
        <td>${escapeHtml(u.name)}</td>
        <td>${u.scorePoints}</td>
        <td>${u.bracketPoints}</td>
        <td>${u.championPoints}</td>
        <td><strong>${u.total}</strong></td>
      </tr>
    `).join("");

    this.updateGlobalUserPoints(points);
  },

  updateGlobalUserPoints(points) {
    const nameInput = document.getElementById("globalUsername");
    const pointsEl = document.getElementById("globalUserPoints");
    const currentName = nameInput.value.trim().toLowerCase();
    if (!currentName) {
      pointsEl.classList.remove("show");
      return;
    }
    const found = points.find(u => u.name.toLowerCase() === currentName);
    if (found) {
      pointsEl.textContent = `⭐ ${found.total} poin`;
      pointsEl.classList.add("show");
    } else {
      pointsEl.textContent = `⭐ 0 poin`;
      pointsEl.classList.add("show");
    }
  },
};

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}
