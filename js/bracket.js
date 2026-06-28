/* =========================================================
   BRACKET.JS
   Fitur bracket fase gugur: 16 Besar -> 8 Besar -> Semifinal
   -> Final. Disimpan per nama pengguna di LocalStorage.
   ========================================================= */

const Bracket = {
  data: null,

  init() {
    const userName = this.getActiveUserName();
    const saved = Storage.getBracketForUser(userName);
    this.data = saved || buildEmptyBracketStructure();
    this.render();
  },

  getActiveUserName() {
    const input = document.getElementById("globalUsername");
    return (input && input.value.trim()) || "Guest";
  },

  // Dipanggil ulang setiap kali nama user di header berubah
  reloadForCurrentUser() {
    const userName = this.getActiveUserName();
    const saved = Storage.getBracketForUser(userName);
    this.data = saved || buildEmptyBracketStructure();
    this.render();
  },

  /* ---------- Pilih pemenang pada satu slot pertandingan ---------- */
  pickWinner(roundKey, matchId, winnerName) {
    const roundArr = roundKey === "final" ? [this.data.final] : this.data[roundKey];
    const match = roundArr.find(m => m.matchId === matchId);
    if (!match) return;
    match.winner = winnerName;
    this.propagateWinner(matchId, winnerName);
    this.persist();
    this.render();
  },

  /* ---------- Salurkan pemenang ke babak berikutnya ---------- */
  propagateWinner(fromMatchId, winnerName) {
    const allNextRounds = [
      this.data.quarterfinal,
      this.data.semifinal,
      this.data.final4,
      [this.data.final],
    ];

    allNextRounds.forEach(roundArr => {
      roundArr.forEach(m => {
        if (!m.source) return;
        const slotIndex = m.source.indexOf(fromMatchId);
        if (slotIndex === 0) {
          if (m.teamA !== winnerName) {
            m.teamA = winnerName;
            m.winner = null; // reset pemenang lanjutan karena slot berubah
            this.clearDownstream(m.matchId);
          }
        } else if (slotIndex === 1) {
          if (m.teamB !== winnerName) {
            m.teamB = winnerName;
            m.winner = null;
            this.clearDownstream(m.matchId);
          }
        }
      });
    });
  },

  /* ---------- Kosongkan babak setelahnya jika sebuah slot berubah ---------- */
  clearDownstream(matchId) {
    const allRounds = [this.data.quarterfinal, this.data.semifinal, this.data.final4, [this.data.final]];
    allRounds.forEach(roundArr => {
      roundArr.forEach(m => {
        if (m.source && m.source.includes(matchId)) {
          if (m.teamA !== null || m.teamB !== null || m.winner !== null) {
            // reset rekursif
            const idxA = m.source[0] === matchId;
            if (idxA) m.teamA = null; else m.teamB = null;
            m.winner = null;
            this.clearDownstream(m.matchId);
          }
        }
      });
    });
  },

  persist() {
    const userName = this.getActiveUserName();
    Storage.saveBracketForUser(userName, this.data);
  },

  reset() {
    this.data = buildEmptyBracketStructure();
    this.persist();
    this.render();
  },

  /* ---------- RENDER ---------- */
  render() {
    const wrapper = document.getElementById("bracketWrapper");
    wrapper.innerHTML = "";

    wrapper.appendChild(this.renderRound("16 Besar", "round16", this.data.round16));
    wrapper.appendChild(this.renderRound("8 Besar", "quarterfinal", this.data.quarterfinal));
    wrapper.appendChild(this.renderRound("Semifinal", "semifinal", this.data.semifinal));
    wrapper.appendChild(this.renderRound("Final 4", "final4", this.data.final4));
    wrapper.appendChild(this.renderFinalRound());
  },

  renderRound(title, roundKey, matches) {
    const col = document.createElement("div");
    col.className = "bracket-round";
    const titleEl = document.createElement("div");
    titleEl.className = "bracket-round-title";
    titleEl.textContent = title;
    col.appendChild(titleEl);

    matches.forEach(m => {
      col.appendChild(this.renderMatchBox(roundKey, m));
    });
    return col;
  },

  renderFinalRound() {
    const col = document.createElement("div");
    col.className = "bracket-round";
    const titleEl = document.createElement("div");
    titleEl.className = "bracket-round-title";
    titleEl.textContent = "Final";
    col.appendChild(titleEl);
    col.appendChild(this.renderMatchBox("final", this.data.final));

    if (this.data.final.winner) {
      const championCard = document.createElement("div");
      championCard.className = "bracket-champion-card";
      championCard.innerHTML = `
        <span class="trophy">🏆</span>
        ${getFlag(this.data.final.winner)} ${this.data.final.winner}
      `;
      col.appendChild(championCard);
    }
    return col;
  },

  renderMatchBox(roundKey, match) {
    const box = document.createElement("div");
    box.className = "bracket-match";

    const slotA = this.renderSlot(roundKey, match, "teamA", match.teamA);
    const slotB = this.renderSlot(roundKey, match, "teamB", match.teamB);

    box.appendChild(slotA);
    box.appendChild(slotB);
    return box;
  },

  renderSlot(roundKey, match, slotField, teamName) {
    const slot = document.createElement("div");
    const isSelected = match.winner && match.winner === teamName;

    if (!teamName) {
      slot.className = "bracket-slot placeholder";
      slot.textContent = "Menunggu...";
      return slot;
    }

    slot.className = "bracket-slot" + (isSelected ? " selected" : "");
    slot.innerHTML = `<span class="flag">${getFlag(teamName)}</span><span>${teamName}</span>`;
    slot.addEventListener("click", () => {
      this.pickWinner(roundKey, match.matchId, teamName);
    });
    return slot;
  },
};
