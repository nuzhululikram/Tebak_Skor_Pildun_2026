/* =========================================================
   DASHBOARD.JS
   Render jadwal pertandingan 16 besar + statistik ringkas.
   ========================================================= */

const Dashboard = {
  render() {
    this.renderStats();
    this.renderMatchGrid();
  },

  renderStats() {
    const totalMatches = MATCHES_R16.length;
    const scoreGuesses = Storage.getScoreGuesses();
    const championGuesses = Storage.getChampionGuesses();

    const uniqueUsers = new Set([
      ...scoreGuesses.map(g => g.userName.toLowerCase()),
      ...championGuesses.map(g => g.userName.toLowerCase()),
    ]);

    document.getElementById("statTotalMatches").textContent = totalMatches;
    document.getElementById("statTotalPredictions").textContent = scoreGuesses.length;
    document.getElementById("statTotalUsers").textContent = uniqueUsers.size;
    document.getElementById("statChampionGuesses").textContent = championGuesses.length;
  },

  renderMatchGrid() {
    const grid = document.getElementById("dashboardMatchGrid");
    const officialResults = Storage.getOfficialResults();
    grid.innerHTML = "";

    MATCHES_R16.forEach(match => {
      const result = officialResults[match.id];
      const card = document.createElement("div");
      card.className = "match-card";

      const dateObj = new Date(match.date + "T" + match.time + ":00");
      const dateStr = dateObj.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

      card.innerHTML = `
        <div class="match-card-top">
          <span class="match-id-badge">${match.id}</span>
          <span class="match-datetime">${dateStr}<br>${match.time} WIB</span>
        </div>
        <div class="match-teams-row">
          <div class="match-team">
            <span class="flag">${getFlag(match.teamA)}</span>
            <span class="name">${match.teamA}</span>
          </div>
          <span class="match-vs">VS</span>
          <div class="match-team">
            <span class="flag">${getFlag(match.teamB)}</span>
            <span class="name">${match.teamB}</span>
          </div>
        </div>
        <div class="match-venue">🏟️ ${match.venue}</div>
        ${result ? `<div class="match-result-tag">Hasil Resmi: ${result.scoreA} - ${result.scoreB}</div>` : ""}
      `;
      grid.appendChild(card);
    });
  },
};
