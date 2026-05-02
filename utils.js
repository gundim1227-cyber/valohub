/* ============================================================
   PROFILE.JS — Perfil próprio, perfil alheio, foto e edição
   ============================================================ */

// ── HEADER DO PERFIL PRÓPRIO ──────────────────────────────
function updateProfileHeader() {
  var el;
  el = document.getElementById('profName');   if (el) el.textContent = CU.name;
  el = document.getElementById('profHandle'); if (el) el.textContent = '@' + CU.username;
  el = document.getElementById('profRank');   if (el) el.textContent = CU.rank;
  el = document.getElementById('profBio');    if (el) el.textContent = CU.bio || 'Jogador de Valorant.';

  var src    = CU.avatar || avt(CU.name);
  var bigAvt = document.getElementById('profAvtBig');
  var sidAvt = document.getElementById('profAvt');
  var cmpAvt = document.getElementById('myAvtPost');
  if (bigAvt) bigAvt.src = src;
  if (sidAvt) sidAvt.src = src;
  if (cmpAvt) cmpAvt.src = src;

  var mapBadge = document.getElementById('profMapBadge');
  var mapName  = document.getElementById('profMapName');
  if (mapBadge && mapName) {
    if (CU.favMap) { mapBadge.style.display = 'inline-flex'; mapName.textContent = CU.favMap; }
    else           { mapBadge.style.display = 'none'; }
  }

  updateFollowCounts();
}

// ── CONTADORES ────────────────────────────────────────────
function updateFollowCounts() {
  var followingEl = document.getElementById('profFollowingN');
  var followersEl = document.getElementById('profFollowersN');
  if (followingEl) followingEl.textContent = getFollowingCount(CU.username);
  if (followersEl) followersEl.textContent = getFollowersCount(CU.username);
}

function updateProfilePostCount() {
  if (!CU) return;
  var count = posts.filter(function (p) { return p.user === CU.username; }).length;
  var el = document.getElementById('profPostsN');
  if (el) el.textContent = count;
}

// ── GRID DE POSTS DO PERFIL ───────────────────────────────
function updateProfilePostsGrid() {
  var grid = document.getElementById('profPostsGrid'); if (!grid) return;
  var myPosts = posts.filter(function (p) { return CU && p.user === CU.username; });
  if (!myPosts.length) {
    grid.innerHTML =
      '<div style="padding:20px;text-align:center;color:var(--muted)">Nenhum post ainda.</div>';
    return;
  }
  grid.innerHTML = myPosts.map(function (p) {
    return (
      '<div style="aspect-ratio:1;background:var(--darker);border-radius:6px;overflow:hidden;cursor:pointer" ' +
        'onclick="viewImage(\'' + (p.img || '') + '\')">' +
        (p.img
          ? '<img src="' + p.img + '" style="width:100%;height:100%;object-fit:cover"/>'
          : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;' +
              'font-size:.75rem;color:var(--muted);padding:8px;text-align:center">' +
              p.text.substring(0, 40) +
            '</div>') +
      '</div>'
    );
  }).join('');
}

// ── EDITAR PERFIL ─────────────────────────────────────────
function openEditProfileModal() {
  document.getElementById('editName').value   = CU.name;
  document.getElementById('editBio').value    = CU.bio || '';
  document.getElementById('editRank').value   = CU.rank;
  document.getElementById('editFavMap').value = CU.favMap || '';

  var prev = document.getElementById('editAvatarPreview');
  if (prev) prev.src = CU.avatar || avt(CU.name);

  var inp = document.getElementById('editAvatarInput');
  if (inp) inp.dataset.base64 = '';

  openModal('modalEditProfile');
}

function previewAvatarEdit(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    var prev = document.getElementById('editAvatarPreview');
    if (prev) prev.src = e.target.result;
    input.dataset.base64 = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function saveProfile() {
  var name   = document.getElementById('editName').value.trim();
  var bio    = document.getElementById('editBio').value.trim();
  var rank   = document.getElementById('editRank').value;
  var favMap = document.getElementById('editFavMap').value;
  var newAvt = document.getElementById('editAvatarInput').dataset.base64 || '';

  if (!name) { showToast('⚠️ Nome não pode ser vazio!'); return; }

  CU.name   = name;
  CU.bio    = bio;
  CU.rank   = rank;
  CU.favMap = favMap;
  if (newAvt) CU.avatar = newAvt;

  ACCOUNTS[CU.username] = CU;
  localStorage.setItem('vh_accounts', JSON.stringify(ACCOUNTS));
  localStorage.setItem('vh_session',  JSON.stringify(CU));

  closeModal('modalEditProfile');
  initApp();
  showToast('✅ Perfil atualizado!');
}

// ── PERFIL ALHEIO ─────────────────────────────────────────
function openOtherProfile(username) {
  if (!username) return;
  if (CU && username === CU.username) { goPage('profile'); return; }

  var acc         = ACCOUNTS[username];
  var lb          = LB.find(function (p) { return p.name === username; });
  var displayName = acc ? acc.name : username;
  var rank        = acc ? acc.rank : (lb ? lb.rankLabel : 'Jogador');
  var bio         = acc ? (acc.bio || 'Jogador de Valorant.') : 'Jogador profissional de Valorant.';
  var userPosts   = posts.filter(function (p) { return p.user === username; });
  var kd          = lb ? lb.kd : (1.0 + Math.random()).toFixed(1);
  var avatarSrc   = (acc && acc.avatar) ? acc.avatar : avt(displayName);

  var alreadyFollowing = CU ? isFollowing(CU.username, username) : false;
  var followBtnClass   = alreadyFollowing ? 'pfbtn' : 'pmbtn';
  var followBtnLabel   = alreadyFollowing
    ? '<i class="fas fa-user-check"></i> Seguindo'
    : '<i class="fas fa-user-plus"></i> Seguir';

  var otherFollowers = getFollowersCount(username);
  var otherFollowing = getFollowingCount(username);

  document.getElementById('otherProfTitle').textContent = displayName;
  document.getElementById('otherProfBody').innerHTML =
    '<div style="text-align:center;margin-bottom:16px">' +
      '<img src="' + avatarSrc + '" ' +
        'style="width:80px;height:80px;border-radius:50%;border:3px solid var(--red);' +
          'margin-bottom:10px;object-fit:cover"/>' +
      '<div style="font-size:1.1rem;font-weight:800">' + displayName + '</div>' +
      '<div style="font-size:.82rem;color:var(--muted)">@' + username + '</div>' +
      '<div style="display:inline-flex;align-items:center;gap:5px;' +
        'background:rgba(245,197,24,.1);border:1px solid rgba(245,197,24,.25);' +
        'color:var(--gold);padding:3px 10px;border-radius:12px;font-size:.75rem;' +
        'font-weight:700;margin-top:6px">' +
        '<i class="fas fa-crown"></i> ' + rank +
      '</div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">' +
      '<div style="background:var(--darker);border-radius:10px;padding:10px;text-align:center">' +
        '<div style="font-size:1rem;font-weight:800">' + userPosts.length + '</div>' +
        '<div style="font-size:.7rem;color:var(--muted)">Posts</div>' +
      '</div>' +
      '<div style="background:var(--darker);border-radius:10px;padding:10px;text-align:center">' +
        '<div style="font-size:1rem;font-weight:800" id="otherFollowersN">' + otherFollowers + '</div>' +
        '<div style="font-size:.7rem;color:var(--muted)">Seguidores</div>' +
      '</div>' +
      '<div style="background:var(--darker);border-radius:10px;padding:10px;text-align:center">' +
        '<div style="font-size:1rem;font-weight:800">' + otherFollowing + '</div>' +
        '<div style="font-size:.7rem;color:var(--muted)">Seguindo</div>' +
      '</div>' +
      '<div style="background:var(--darker);border-radius:10px;padding:10px;text-align:center">' +
        '<div style="font-size:1rem;font-weight:800">' + kd + '</div>' +
        '<div style="font-size:.7rem;color:var(--muted)">K/D</div>' +
      '</div>' +
    '</div>' +
    '<div style="background:var(--darker);border-radius:10px;padding:12px;' +
      'font-size:.85rem;color:var(--muted);margin-bottom:14px;line-height:1.5">' +
      bio +
    '</div>' +
    '<div style="display:flex;gap:8px">' +
      '<button class="pfbtn" style="flex:1" ' +
        'onclick="closeModal(\'modalOtherProfile\');openChat(\'' + username + '\')">' +
        '<i class="fas fa-paper-plane"></i> Mensagem' +
      '</button>' +
      '<button class="' + followBtnClass + '" style="flex:1" ' +
        'id="followBtn-' + username + '" ' +
        'onclick="toggleFollow(\'' + username + '\')">' +
        followBtnLabel +
      '</button>' +
    '</div>';

  openModal('modalOtherProfile');
}

// ── TOGGLE FOLLOW (modal do perfil alheio) ────────────────
function toggleFollow(username) {
  if (!CU) return;

  if (isFollowing(CU.username, username)) {
    unfollowUser(CU.username, username);

    var btn = document.getElementById('followBtn-' + username);
    if (btn) {
      btn.className  = 'pmbtn';
      btn.style.flex = '1';
      btn.innerHTML  = '<i class="fas fa-user-plus"></i> Seguir';
    }
    var otherEl = document.getElementById('otherFollowersN');
    if (otherEl) otherEl.textContent = getFollowersCount(username);

    showToast('❌ Deixou de seguir ' + username);

  } else {
    followUser(CU.username, username);

    var btn = document.getElementById('followBtn-' + username);
    if (btn) {
      btn.className  = 'pfbtn';
      btn.style.flex = '1';
      btn.innerHTML  = '<i class="fas fa-user-check"></i> Seguindo';
    }
    var otherEl = document.getElementById('otherFollowersN');
    if (otherEl) otherEl.textContent = getFollowersCount(username);

    // 🔔 Notifica com username + nome
    pushNotif(username, 'follow', CU.username, CU.name, '');

    showToast('✅ Seguindo ' + username + '!');
  }

  updateFollowCounts();
  buildSuggestions();
}

// ── TOGGLE FOLLOW (sugestões e explore) ──────────────────
function toggleFollowBtn(btn, username) {
  if (!CU) return;

  if (isFollowing(CU.username, username)) {
    unfollowUser(CU.username, username);
    btn.classList.remove('on');
    btn.innerHTML = '<i class="fas fa-user-plus"></i> Seguir';
    showToast('❌ Deixou de seguir ' + username);
  } else {
    followUser(CU.username, username);
    btn.classList.add('on');
    btn.innerHTML = '<i class="fas fa-user-check"></i> Seguindo';

    // 🔔 Notifica com username + nome
    pushNotif(username, 'follow', CU.username, CU.name, '');

    showToast('✅ Seguindo ' + username + '!');
  }

  updateFollowCounts();
}

// ── STATS ─────────────────────────────────────────────────
function buildStats() {
  var el = document.getElementById('statsContent'); if (!el) return;
  var stats = [
    { label:'K/D Ratio',          value:'1.87'                                   },
    { label:'Win Rate',           value:'58%'                                    },
    { label:'Headshot %',         value:'34%'                                    },
    { label:'Partidas',           value:'342'                                    },
    { label:'Vitórias',           value:'198'                                    },
    { label:'Agente mais jogado', value: CU && CU.agent  ? CU.agent  : 'Jett 🌪️' },
    { label:'Mapa favorito',      value: CU && CU.favMap ? CU.favMap : 'Ascent'  },
    { label:'Rank atual',         value: CU ? CU.rank : 'Ouro'                  },
    { label:'Pico de rank',       value:'Diamante'                               },
    { label:'Clutches',           value:'47'                                     }
  ];
  el.innerHTML = stats.map(function (s) {
    return '<div class="strow">' +
      '<span class="stlbl">' + s.label + '</span>' +
      '<span class="stval">' + s.value + '</span>' +
    '</div>';
  }).join('');
}
