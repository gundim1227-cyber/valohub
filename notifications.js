/* ============================================================
   EXPLORE.JS — Página explorar: posts, jogadores e mapas
   ============================================================ */

function buildExplore() {
  var grid = document.getElementById('exPostsGrid');
  if (grid) {
    grid.innerHTML = posts.map(function (p) {
      return '<div style="aspect-ratio:1;background:var(--darker);border-radius:6px;overflow:hidden;cursor:pointer" onclick="' + (p.img ? "viewImage('" + p.img + "')" : '') + '">' +
        (p.img
          ? '<img src="' + p.img + '" style="width:100%;height:100%;object-fit:cover"/>'
          : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:.72rem;color:var(--muted);padding:6px;text-align:center">' + p.text.substring(0, 50) + '</div>') +
      '</div>';
    }).join('');
  }

  buildExplorePlayers('');

  var mapsGrid = document.getElementById('exMapsGrid');
  if (mapsGrid) {
    mapsGrid.innerHTML = MAPS.map(function (m) {
      return '<div class="acard" onclick="showToast(\'🗺️ ' + m.name + ': ' + m.desc + '\')">' +
        '<div class="acard-emoji">' + m.emoji + '</div>' +
        '<div class="acard-name">'  + m.name  + '</div>' +
        '<div class="acard-role">'  + m.desc  + '</div>' +
      '</div>';
    }).join('');
  }
}

function buildExplorePlayers(filter) {
  var el = document.getElementById('exPlayersList'); if (!el) return;

  var allPlayers = [];
  LB.forEach(function (p) {
    allPlayers.push({username: p.name, name: p.name, rank: p.rankLabel, agent: p.agent + ' ' + p.emoji});
  });
  Object.values(ACCOUNTS).forEach(function (acc) {
    if (CU && acc.username === CU.username) return;
    if (!allPlayers.find(function (p) { return p.username === acc.username; }))
      allPlayers.push({username: acc.username, name: acc.name, rank: acc.rank, agent: acc.agent || '🎮'});
  });

  var filtered = filter
    ? allPlayers.filter(function (p) { return p.name.toLowerCase().includes(filter.toLowerCase()); })
    : allPlayers;

  if (!filtered.length) {
    el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--muted)">Nenhum jogador encontrado.</div>';
    return;
  }

  el.innerHTML = filtered.map(function (p) {
    return '<div class="sugitm">' +
      '<div class="sugavt" onclick="openOtherProfile(\'' + p.username + '\')"><img src="' + avt(p.name) + '"/></div>' +
      '<div class="suginfo">' +
        '<div class="sugname" onclick="openOtherProfile(\'' + p.username + '\')">' + p.name + '</div>' +
        '<div class="sugsub">' + p.rank + ' • ' + p.agent + '</div>' +
      '</div>' +
      '<button class="sfbtn" onclick="toggleFollowBtn(this,\'' + p.username + '\')"><i class="fas fa-user-plus"></i> Seguir</button>' +
    '</div>';
  }).join('');
}

function filterExplore(val) {
  buildExplorePlayers(val);
}

function toggleFollowBtn(btn, username) {
  if (btn.classList.contains('on')) {
    btn.classList.remove('on');
    btn.innerHTML = '<i class="fas fa-user-plus"></i> Seguir';
    showToast('❌ Deixou de seguir ' + username);
  } else {
    btn.classList.add('on');
    btn.innerHTML = '<i class="fas fa-user-check"></i> Seguindo';
    showToast('✅ Seguindo ' + username + '!');
  }
}
