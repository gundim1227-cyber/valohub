/* ============================================================
   LEADERBOARD.JS — Ranking global de jogadores
   ============================================================ */

function buildLeaderboard() {
  var el = document.getElementById('lbList'); if (!el) return;

  var allPlayers = LB.slice();
  Object.values(ACCOUNTS).forEach(function (acc) {
    if (!allPlayers.find(function (p) { return p.name === acc.username; })) {
      allPlayers.push({
        name: acc.username, rankLabel: acc.rank,
        agent: acc.agent || '🎮', emoji: '',
        kd: (1.0 + Math.random()).toFixed(1),
        score: Math.floor(2000 + Math.random() * 3000)
      });
    }
  });
  allPlayers.sort(function (a, b) { return b.score - a.score; });

  el.innerHTML = allPlayers.map(function (p, i) {
    var medal       = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i + 1);
    var acc         = ACCOUNTS[p.name];
    var displayName = acc ? acc.name : p.name;
    return '<div class="lbitem" onclick="openOtherProfile(\'' + p.name + '\')">' +
      '<div class="lbrank">' + medal + '</div>' +
      '<div class="lbavt"><img src="' + avt(displayName) + '"/></div>' +
      '<div class="lbinfo">' +
        '<div class="lbname">' + displayName + '</div>' +
        '<div class="lbag">'  + p.rankLabel + ' • ' + p.agent + (p.emoji ? ' ' + p.emoji : '') + '</div>' +
      '</div>' +
      '<div class="lbsc">' + p.score.toLocaleString() + ' pts</div>' +
    '</div>';
  }).join('');
}