/* =========================================================
   DATA.JS
   --------------------------------------------------------
   PENTING: Data tim & jadwal di bawah ini adalah CONTOH /
   PLACEHOLDER mengikuti format resmi Piala Dunia FIFA 2026
   (48 tim, fase grup -> 32 besar -> 16 besar -> 8 besar ->
   semifinal -> final).

   Setelah hasil fase grup & babak 32 besar resmi diketahui,
   GANTI nama tim, bendera (emoji/kode), tanggal, jam, dan
   stadion di array MATCHES_R16 di bawah ini sesuai jadwal
   resmi FIFA. Struktur/format kode TIDAK perlu diubah.
   ========================================================= */

// Daftar 48 negara peserta (placeholder, untuk autocomplete Tebak Juara)
const ALL_COUNTRIES = [
  "Argentina", "Brazil", "Prancis", "Inggris", "Spanyol", "Portugal",
  "Jerman", "Belanda", "Belgia", "Italia", "Kroasia", "Maroko",
  "Amerika Serikat", "Meksiko", "Kanada", "Jepang", "Korea Selatan",
  "Senegal", "Ghana", "Nigeria", "Uruguay", "Kolombia", "Ekuador",
  "Swiss", "Denmark", "Polandia", "Austria", "Serbia", "Iran",
  "Arab Saudi", "Qatar", "Australia", "Tunisia", "Aljazair", "Mesir",
  "Kamerun", "Pantai Gading", "Paraguay", "Peru", "Chile", "Panama",
  "Kosta Rika", "Selandia Baru", "Yordania", "Uzbekistan", "Iraq",
  "Bolivia", "Curacao"
];

// Kode bendera emoji sederhana (bisa kosong jika tidak ada / pakai 🏳️)
const FLAGS = {
  "Argentina": "🇦🇷", "Brazil": "🇧🇷", "Prancis": "🇫🇷", "Inggris": "🏴",
  "Spanyol": "🇪🇸", "Portugal": "🇵🇹", "Jerman": "🇩🇪", "Belanda": "🇳🇱",
  "Belgia": "🇧🇪", "Italia": "🇮🇹", "Kroasia": "🇭🇷", "Maroko": "🇲🇦",
  "Amerika Serikat": "🇺🇸", "Meksiko": "🇲🇽", "Kanada": "🇨🇦", "Jepang": "🇯🇵",
  "Korea Selatan": "🇰🇷", "Senegal": "🇸🇳", "Ghana": "🇬🇭", "Nigeria": "🇳🇬",
  "Uruguay": "🇺🇾", "Kolombia": "🇨🇴", "Ekuador": "🇪🇨", "Swiss": "🇨🇭",
  "Denmark": "🇩🇰", "Polandia": "🇵🇱", "Austria": "🇦🇹", "Serbia": "🇷🇸",
  "Iran": "🇮🇷", "Arab Saudi": "🇸🇦", "Qatar": "🇶🇦", "Australia": "🇦🇺",
  "Tunisia": "🇹🇳", "Aljazair": "🇩🇿", "Mesir": "🇪🇬", "Kamerun": "🇨🇲",
  "Pantai Gading": "🇨🇮", "Paraguay": "🇵🇾", "Peru": "🇵🇪", "Chile": "🇨🇱",
  "Panama": "🇵🇦", "Kosta Rika": "🇨🇷", "Selandia Baru": "🇳🇿",
  "Yordania": "🇯🇴", "Uzbekistan": "🇺🇿", "Iraq": "🇮🇶", "Bolivia": "🇧🇴",
  "Curacao": "🇨🇼"
};

function getFlag(teamName) {
  return FLAGS[teamName] || "🏳️";
}

/* ---------------------------------------------------------
   JADWAL BABAK 16 BESAR (CONTOH / PLACEHOLDER)
   id        : kode unik pertandingan (jangan diubah formatnya)
   teamA/teamB : nama tim (GANTI sesuai hasil resmi nanti)
   date/time : tanggal & jam (WIB, contoh)
   venue     : nama stadion & kota (contoh)
   --------------------------------------------------------- */
const MATCHES_R16 = [
  {
    id: "R16-1",
    teamA: "Argentina",
    teamB: "Senegal",
    date: "2026-07-04",
    time: "02:00",
    venue: "MetLife Stadium, New York/New Jersey",
  },
  {
    id: "R16-2",
    teamA: "Brazil",
    teamB: "Jepang",
    date: "2026-07-04",
    time: "06:00",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "R16-3",
    teamA: "Prancis",
    teamB: "Maroko",
    date: "2026-07-04",
    time: "22:00",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "R16-4",
    teamA: "Inggris",
    teamB: "Ekuador",
    date: "2026-07-05",
    time: "02:00",
    venue: "Estadio Azteca, Mexico City",
  },
  {
    id: "R16-5",
    teamA: "Spanyol",
    teamB: "Kroasia",
    date: "2026-07-05",
    time: "06:00",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "R16-6",
    teamA: "Portugal",
    teamB: "Ghana",
    date: "2026-07-05",
    time: "22:00",
    venue: "BC Place, Vancouver",
  },
  {
    id: "R16-7",
    teamA: "Jerman",
    teamB: "Kolombia",
    date: "2026-07-06",
    time: "02:00",
    venue: "Lincoln Financial Field, Philadelphia",
  },
  {
    id: "R16-8",
    teamA: "Belanda",
    teamB: "Tunisia",
    date: "2026-07-06",
    time: "06:00",
    venue: "Arrowhead Stadium, Kansas City",
  },
  {
    id: "R16-9",
    teamA: "Belgia",
    teamB: "Uruguay",
    date: "2026-07-06",
    time: "22:00",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "R16-10",
    teamA: "Italia",
    teamB: "Nigeria",
    date: "2026-07-07",
    time: "02:00",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "R16-11",
    teamA: "Amerika Serikat",
    teamB: "Swiss",
    date: "2026-07-07",
    time: "06:00",
    venue: "Levi's Stadium, San Francisco Bay Area",
  },
  {
    id: "R16-12",
    teamA: "Meksiko",
    teamB: "Denmark",
    date: "2026-07-07",
    time: "22:00",
    venue: "Estadio BBVA, Monterrey",
  },
  {
    id: "R16-13",
    teamA: "Kanada",
    teamB: "Polandia",
    date: "2026-07-08",
    time: "02:00",
    venue: "BMO Field, Toronto",
  },
  {
    id: "R16-14",
    teamA: "Korea Selatan",
    teamB: "Serbia",
    date: "2026-07-08",
    time: "06:00",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "R16-15",
    teamA: "Kamerun",
    teamB: "Iran",
    date: "2026-07-08",
    time: "22:00",
    venue: "Lumen Field, Seattle",
  },
  {
    id: "R16-16",
    teamA: "Australia",
    teamB: "Paraguay",
    date: "2026-07-09",
    time: "02:00",
    venue: "Estadio Guadalajara, Guadalajara",
  },
];

/* ---------------------------------------------------------
   STRUKTUR BRACKET (16 Besar -> 8 Besar -> Semifinal -> Final)
   Dibangun otomatis dari MATCHES_R16 di atas.
   Pasangan QF mengikuti urutan standar single-elim:
   QF1: R16-1 vs R16-2 | QF2: R16-3 vs R16-4
   QF3: R16-5 vs R16-6 | QF4: R16-7 vs R16-8
   QF5: R16-9 vs R16-10 | QF6: R16-11 vs R16-12
   QF7: R16-13 vs R16-14 | QF8: R16-15 vs R16-16
   --------------------------------------------------------- */
function buildEmptyBracketStructure() {
  return {
    round16: MATCHES_R16.map(m => ({
      matchId: m.id,
      teamA: m.teamA,
      teamB: m.teamB,
      winner: null,
    })),
    quarterfinal: [
      { matchId: "QF-1", source: ["R16-1", "R16-2"], teamA: null, teamB: null, winner: null },
      { matchId: "QF-2", source: ["R16-3", "R16-4"], teamA: null, teamB: null, winner: null },
      { matchId: "QF-3", source: ["R16-5", "R16-6"], teamA: null, teamB: null, winner: null },
      { matchId: "QF-4", source: ["R16-7", "R16-8"], teamA: null, teamB: null, winner: null },
      { matchId: "QF-5", source: ["R16-9", "R16-10"], teamA: null, teamB: null, winner: null },
      { matchId: "QF-6", source: ["R16-11", "R16-12"], teamA: null, teamB: null, winner: null },
      { matchId: "QF-7", source: ["R16-13", "R16-14"], teamA: null, teamB: null, winner: null },
      { matchId: "QF-8", source: ["R16-15", "R16-16"], teamA: null, teamB: null, winner: null },
    ],
    semifinal: [
      { matchId: "SF-1", source: ["QF-1", "QF-2"], teamA: null, teamB: null, winner: null },
      { matchId: "SF-2", source: ["QF-3", "QF-4"], teamA: null, teamB: null, winner: null },
      { matchId: "SF-3", source: ["QF-5", "QF-6"], teamA: null, teamB: null, winner: null },
      { matchId: "SF-4", source: ["QF-7", "QF-8"], teamA: null, teamB: null, winner: null },
    ],
    final4: [
      { matchId: "F4-1", source: ["SF-1", "SF-2"], teamA: null, teamB: null, winner: null },
      { matchId: "F4-2", source: ["SF-3", "SF-4"], teamA: null, teamB: null, winner: null },
    ],
    final: { matchId: "FINAL", source: ["F4-1", "F4-2"], teamA: null, teamB: null, winner: null },
  };
}

// Sistem poin
const POINTS = {
  EXACT_SCORE: 3,      // skor tepat persis
  CORRECT_OUTCOME: 1,  // hasil benar (menang/seri/kalah) tapi skor beda
  BRACKET_R16: 1,      // prediksi benar tim lolos dari 16 besar
  BRACKET_QF: 2,
  BRACKET_SF: 3,
  BRACKET_FINAL: 4,
  CHAMPION_CORRECT: 10,
};
