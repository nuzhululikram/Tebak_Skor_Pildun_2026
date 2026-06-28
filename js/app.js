/* =========================================================
   APP.JS
   Entry point: navigasi tab, inisialisasi semua modul,
   sinkronisasi nama pengguna global.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initGlobalUserName();
  initAllModules();
});

function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const panels = document.querySelectorAll(".tab-panel");
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.dataset.tab;

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      panels.forEach(p => p.classList.remove("active"));
      document.getElementById("tab-" + target).classList.add("active");

      // Tutup menu mobile setelah klik
      mainNav.classList.remove("open");

      // Re-render data yang relevan tiap kali tab dibuka (memastikan data terbaru)
      if (target === "dashboard") Dashboard.render();
      if (target === "bracket") Bracket.reloadForCurrentUser();
      if (target === "tebakskor") ScoreGuess.renderList();
      if (target === "tebakjuara") ChampionGuess.renderAll();
      if (target === "leaderboard") Leaderboard.render();
    });
  });

  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

function initGlobalUserName() {
  const input = document.getElementById("globalUsername");
  const saved = Storage.getCurrentUser();
  if (saved) input.value = saved;

  input.addEventListener("input", () => {
    Storage.setCurrentUser(input.value.trim());
    Leaderboard.updateGlobalUserPoints(Leaderboard.computeAllUserPoints());
  });

  input.addEventListener("change", () => {
    Bracket.reloadForCurrentUser();
  });
}

function initAllModules() {
  Dashboard.render();
  Bracket.init();
  ScoreGuess.init();
  ChampionGuess.init();
  Leaderboard.init();

  // Tombol-tombol aksi bracket
  document.getElementById("saveBracketBtn").addEventListener("click", () => {
    Bracket.persist();
    const indicator = document.getElementById("bracketSaveIndicator");
    indicator.textContent = "✅ Bracket tersimpan!";
    setTimeout(() => (indicator.textContent = ""), 2500);
    Leaderboard.render();
  });

  document.getElementById("resetBracketBtn").addEventListener("click", () => {
    if (confirm("Yakin ingin mereset bracket prediksi kamu?")) {
      Bracket.reset();
      showToast("Bracket berhasil direset.");
    }
  });
}
