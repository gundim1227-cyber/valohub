/* ============================================================
   AGENTS.JS — Grid de agentes, detalhes e favoritos
   ============================================================ */

function buildAgents() {
  var grids = {
    All:'agGridAll', Duelista:'agGridDuel', Controlador:'agGridCtrl',
    Iniciador:'agGridInit', Sentinela:'agGridSent'
  };
  Object.keys(grids).forEach(function (k) {
    var el   = document.getElementById(grids[k]); if (!el) return;
    var list = k === 'All' ? AGENTS : AGENTS.filter(function (a) { return a.role === k; });
    el.innerHTML = list.map(function (a) {
      return '<div class="acard" onclick="openAgentDetail(\'' + a.name + '\')">' +
        '<div class="acard-emoji">' + a.emoji + '</div>' +
        '<div class="acard-name">'  + a.name  + '</div>' +
        '<div class="acard-role">'  + a.role  + '</div>' +
      '</div>';
    }).join('');
  });
}

function openAgentDetail(name) {
  var a = AGENTS.find(function (x) { return x.name === name; }); if (!a) return;
  document.getElementById('agentDetailTitle').textContent = a.emoji + ' ' + a.name;
  document.getElementById('agentDetailBody').innerHTML =
    '<div class="agent-detail-top">' +
      '<div class="agent-big-emoji">' + a.emoji + '</div>' +
      '<div><div class="agent-detail-name">' + a.name + '</div><span class="role-badge">' + a.role + '</span></div>' +
    '</div>' +
    '<div class="agent-lore">' + a.lore + '</div>' +
    '<div class="abilities-title">Habilidades</div>' +
    a.abilities.map(function (ab) {
      return '<div class="ability-item">' +
        '<div class="ability-key">' + ab.key + '</div>' +
        '<div><div class="ability-name">' + ab.name + '</div><div class="ability-desc">' + ab.desc + '</div></div>' +
      '</div>';
    }).join('');
  openModal('modalAgentDetail');
}

// ── AGENTES FAVORITOS ─────────────────────────────────────
function openAgentSel() {
  tempFavAgents = favAgents.slice();
  var grid = document.getElementById('agentSelGrid');
  grid.innerHTML = AGENTS.map(function (a) {
    var on = tempFavAgents.indexOf(a.name) !== -1;
    return '<div class="asitm' + (on ? ' on' : '') + '" id="asel-' + a.name + '" onclick="toggleFavAgent(\'' + a.name + '\')">' +
      '<span class="asitm-emoji">' + a.emoji + '</span>' +
      '<span style="font-size:.83rem">' + a.name + '</span>' +
    '</div>';
  }).join('');
  openModal('modalAgents');
}

function toggleFavAgent(name) {
  var idx = tempFavAgents.indexOf(name);
  if (idx === -1) {
    if (tempFavAgents.length >= 5) { showToast('⚠️ Máximo 5 agentes!'); return; }
    tempFavAgents.push(name);
    document.getElementById('asel-' + name).classList.add('on');
  } else {
    tempFavAgents.splice(idx, 1);
    document.getElementById('asel-' + name).classList.remove('on');
  }
}

function saveFavAgents() {
  favAgents = tempFavAgents.slice();
  localStorage.setItem('vh_favagents', JSON.stringify(favAgents));
  closeModal('modalAgents');
  buildFavAgentsGrid();
  showToast('✅ Agentes favoritos salvos!');
}

function buildFavAgentsGrid() {
  var grid = document.getElementById('favAgentsGrid'); if (!grid) return;
  if (!favAgents.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--muted)">Nenhum agente favorito. Clique em Editar!</div>';
    return;
  }
  grid.innerHTML = favAgents.map(function (name) {
    var a = AGENTS.find(function (x) { return x.name === name; }); if (!a) return '';
    return '<div class="acard" onclick="openAgentDetail(\'' + a.name + '\')">' +
      '<div class="acard-emoji">' + a.emoji + '</div>' +
      '<div class="acard-name">'  + a.name  + '</div>' +
      '<div class="acard-role">'  + a.role  + '</div>' +
    '</div>';
  }).join('');
}
