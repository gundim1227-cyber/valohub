/* ============================================================
   APP.JS — Inicialização, navegação e busca global
   ============================================================ */

// Usuário atual e variáveis globais
var CU          = null;
var pickingSlot = null;
var allStories  = {};
var myStories   = [];
var chatData    = {};
var favAgents   = [];
var favWeapons  = [null, null, null, null];
var tempFavAgents = [];
var postImgData = '';
var posts = (function () {
  var s = localStorage.getItem('vh_posts');
  if (s) { try { return JSON.parse(s); } catch (e) {} }
  return [
    {id:1, user:'admin',    text:'Bem-vindo ao ValoHub! 🎯',                img:'',  likes:12, liked:false, comments:[], time:'10:00', tag:'',          agent:''},
    {id:2, user:'JettMain', text:'Que jogada insana de Operator! 🔥',       img:'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500', likes:45, liked:false, comments:[], time:'12:30', tag:'#Highlight', agent:'Jett 🌪️'}
  ];
})();

// ── NAVEGAÇÃO ─────────────────────────────────────────────
function goPage(p) {
  document.querySelectorAll('.page').forEach(function (el) { el.classList.remove('on'); });
  document.getElementById('page-' + p).classList.add('on');

  document.querySelectorAll('.sitem').forEach(function (el) { el.classList.remove('on'); });
  var si = document.getElementById('si-' + p);
  if (si) si.classList.add('on');

  document.querySelectorAll('.bnav button').forEach(function (el) { el.classList.remove('on'); });
  var bn = document.getElementById('bn-' + p);
  if (bn) bn.classList.add('on');

  var titles = {
    feed:'🏠 Feed', explore:'🔍 Explorar', messages:'💬 Mensagens',
    notifications:'🔔 Notificações', agents:'🎭 Agentes', weapons:'🔫 Armas',
    leaderboard:'🏆 Ranking', clips:'🎬 Clips', profile:'👤 Perfil'
  };
  document.getElementById('topbarTitle').textContent = titles[p] || 'ValoHub';

  if (p === 'messages') { buildMsgList(); closeChat(); }
  if (p === 'explore')  { buildExplore(); }
}

// ── INICIALIZAÇÃO DO APP ───────────────────────────────────
function initApp() {
  allStories = JSON.parse(localStorage.getItem('vh_allstories') || '{}');
  myStories  = allStories[CU.username] || [];
  chatData   = JSON.parse(localStorage.getItem('vh_chats')      || '{}');
  favAgents  = JSON.parse(localStorage.getItem('vh_favagents')  || '[]');
  favWeapons = JSON.parse(localStorage.getItem('vh_favweapons') || '[null,null,null,null]');

  // Injeta HTML das páginas
  injectPages();

  // Constrói cada seção
  buildStories();
  buildPosts();
  buildAgents();
  buildWeapons();
  buildLeaderboard();
  buildNotifications();
  buildTrending();
  buildSuggestions();
  buildFavWeaponsSlots();
  buildFavAgentsGrid();
  buildClips();
  buildStats();
  updateProfileHeader();
  updateProfilePostCount();
}

// ── INJEÇÃO DAS PÁGINAS ────────────────────────────────────
function injectPages() {

  // ── FEED ────────────────────────────────────────────────
  document.getElementById('page-feed').innerHTML =
    '<div class="stories"><div id="storiesRow"></div></div>' +
    '<div class="composer">' +
      '<div class="comp-row">' +
        '<img class="comp-avt" id="myAvtPost" src="' + (CU.avatar || avt(CU.name)) + '" alt=""/>' +
        '<div class="comp-box">' +
          '<textarea class="comp-txt" id="postTxt" placeholder="O que está acontecendo no seu jogo? 🎯"></textarea>' +
          '<div id="iprev" class="iprev">' +
            '<img id="iprevImg" src="" alt=""/>' +
            '<button class="iprev-rm" onclick="remImg()">✕</button>' +
          '</div>' +
          '<div class="comp-actions">' +
            '<label style="cursor:pointer;color:var(--muted);font-size:.85rem">' +
              '<i class="fas fa-image"></i>' +
              '<input class="iupload" type="file" accept="image/*" onchange="prevImg(this)"/>' +
            '</label>' +
            '<select class="comp-sel" id="postTag">' +
              '<option value="">🏷️ Tag</option>' +
              '<option>#Clip</option><option>#Rank</option><option>#Dica</option>' +
              '<option>#Highlight</option><option>#Meme</option><option>#VCT</option>' +
            '</select>' +
            '<select class="comp-sel" id="postAgent">' +
              '<option value="">🎭 Agente</option>' +
              '<option>Jett 🌪️</option><option>Reyna 👁️</option><option>Phoenix 🔥</option>' +
              '<option>Neon ⚡</option><option>Sage 🌿</option><option>Omen 👁️‍🗨️</option>' +
              '<option>Viper ☠️</option><option>Sova 🏹</option><option>Killjoy 🤖</option>' +
            '</select>' +
            '<button class="comp-btn" onclick="createPost()">Postar 🎯</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="feedPosts"></div>';

  // ── EXPLORE ──────────────────────────────────────────────
  document.getElementById('page-explore').innerHTML =
    '<div class="pcont">' +
      '<div class="wgt">' +
        '<div class="wgt-title">🔍 Buscar Jogadores</div>' +
        '<input class="minp" placeholder="Digite um nome..." oninput="filterExplore(this.value)" style="margin-bottom:0"/>' +
      '</div>' +
      '<div class="tabs">' +
        '<button class="tbtn on" onclick="switchTab(this,\'exPosts\')">📸 Posts</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'exPlayers\')">👥 Jogadores</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'exMaps\')">🗺️ Mapas</button>' +
      '</div>' +
      '<div class="tcont on" id="exPosts"><div class="explore-grid" id="exPostsGrid"></div></div>' +
      '<div class="tcont"    id="exPlayers"><div id="exPlayersList"></div></div>' +
      '<div class="tcont"    id="exMaps"><div class="agrid" id="exMapsGrid"></div></div>' +
    '</div>';

  // ── MESSAGES ─────────────────────────────────────────────
  document.getElementById('page-messages').innerHTML =
    '<div id="msgListWrap">' +
      '<div class="pcont">' +
        '<div class="wgt-title" style="padding:4px 0 12px">💬 Mensagens</div>' +
        '<div id="msgList"></div>' +
      '</div>' +
    '</div>' +
    '<div id="chatWrap">' +
      '<div class="chatheader">' +
        '<button class="chatback" onclick="closeChat()"><i class="fas fa-arrow-left"></i></button>' +
        '<div class="chatavt" id="chatUavt"></div>' +
        '<div class="chatuinfo">' +
          '<div class="chatuname"   id="chatUname"></div>' +
          '<div class="chatustatus" id="chatUstatus"></div>' +
        '</div>' +
        '<button style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:.85rem;padding:6px 10px" onclick="openOtherProfile(currentChat)">' +
          '<i class="fas fa-user"></i>' +
        '</button>' +
      '</div>' +
      '<div id="chatMsgs"></div>' +
      '<div class="chatinp">' +
        '<input id="chatInp" placeholder="Mensagem..." onkeydown="if(event.key===\'Enter\')sendMsg()"/>' +
        '<button onclick="sendMsg()"><i class="fas fa-paper-plane"></i></button>' +
      '</div>' +
    '</div>';

  // ── NOTIFICATIONS ─────────────────────────────────────────
  document.getElementById('page-notifications').innerHTML =
    '<div class="pcont">' +
      '<div class="wgt-title" style="padding:4px 0 12px">🔔 Notificações</div>' +
      '<div id="notifList"></div>' +
    '</div>';

  // ── AGENTS ───────────────────────────────────────────────
  document.getElementById('page-agents').innerHTML =
    '<div class="pcont">' +
      '<div class="tabs">' +
        '<button class="tbtn on" onclick="switchTab(this,\'agAll\')">Todos</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'agDuel\')">Duelistas</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'agCtrl\')">Controladores</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'agInit\')">Iniciadores</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'agSent\')">Sentinelas</button>' +
      '</div>' +
      '<div class="tcont on" id="agAll"><div class="agrid" id="agGridAll"></div></div>' +
      '<div class="tcont"    id="agDuel"><div class="agrid" id="agGridDuel"></div></div>' +
      '<div class="tcont"    id="agCtrl"><div class="agrid" id="agGridCtrl"></div></div>' +
      '<div class="tcont"    id="agInit"><div class="agrid" id="agGridInit"></div></div>' +
      '<div class="tcont"    id="agSent"><div class="agrid" id="agGridSent"></div></div>' +
    '</div>';

  // ── WEAPONS ──────────────────────────────────────────────
  document.getElementById('page-weapons').innerHTML =
    '<div class="pcont">' +
      '<div class="tabs">' +
        '<button class="tbtn on" onclick="switchTab(this,\'wAll\')">Todas</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'wRifle\')">Rifles</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'wSmg\')">SMGs</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'wShotgun\')">Shotguns</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'wSniper\')">Snipers</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'wPistol\')">Pistolas</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'wHeavy\')">Pesadas</button>' +
      '</div>' +
      '<div class="tcont on" id="wAll"><div class="agrid"     id="wgAll"></div></div>' +
      '<div class="tcont"    id="wRifle"><div class="agrid"   id="wgRifle"></div></div>' +
      '<div class="tcont"    id="wSmg"><div class="agrid"     id="wgSmg"></div></div>' +
      '<div class="tcont"    id="wShotgun"><div class="agrid" id="wgShotgun"></div></div>' +
      '<div class="tcont"    id="wSniper"><div class="agrid"  id="wgSniper"></div></div>' +
      '<div class="tcont"    id="wPistol"><div class="agrid"  id="wgPistol"></div></div>' +
      '<div class="tcont"    id="wHeavy"><div class="agrid"   id="wgHeavy"></div></div>' +
    '</div>';

  // ── LEADERBOARD ───────────────────────────────────────────
  document.getElementById('page-leaderboard').innerHTML =
    '<div class="pcont">' +
      '<div class="wgt-title" style="padding:4px 0 12px">🏆 Ranking Global</div>' +
      '<div id="lbList"></div>' +
    '</div>';

  // ── CLIPS ─────────────────────────────────────────────────
  document.getElementById('page-clips').innerHTML =
    '<div class="pcont">' +
      '<div class="wgt-title" style="padding:4px 0 12px">🎬 Clips em Destaque</div>' +
      '<div class="clips-grid" id="clipsGrid"></div>' +
    '</div>';

  // ── PROFILE ───────────────────────────────────────────────
  document.getElementById('page-profile').innerHTML =
    '<div class="pcont">' +
      '<div style="position:relative;margin-bottom:50px;">' +
        '<div class="profbanner"></div>' +
        '<div class="profavtw">' +
          '<img id="profAvtBig" src="' + (CU.avatar || avt(CU.name)) + '" alt=""/>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;justify-content:flex-end;gap:8px;padding:8px 0 0">' +
        '<button class="pmbtn" onclick="openEditProfileModal()"><i class="fas fa-edit"></i> Editar</button>' +
        '<button class="pmbtn" onclick="clearCache()"><i class="fas fa-trash"></i> Cache</button>' +
      '</div>' +
      '<div class="profinfo">' +
        '<div class="profname"   id="profName"></div>' +
        '<div class="profhandle" id="profHandle"></div>' +
        '<div class="profbadge"><i class="fas fa-crown"></i> <span id="profRank"></span></div>' +
        '<div class="profmapbadge profbadge" id="profMapBadge" style="display:none">' +
          '<i class="fas fa-map"></i> <span id="profMapName"></span>' +
        '</div>' +
        '<div class="profbio" id="profBio"></div>' +
      '</div>' +

      // ── CONTADORES DE SEGUIDORES ─────────────────────────
      '<div class="profstats">' +
        '<div class="profstat">' +
          '<div class="profstat-n" id="profPostsN">0</div>' +
          '<div class="profstat-l">Posts</div>' +
        '</div>' +
        '<div class="profstat">' +
          '<div class="profstat-n" id="profFollowersN">0</div>' +
          '<div class="profstat-l">Seguidores</div>' +
        '</div>' +
        '<div class="profstat">' +
          '<div class="profstat-n" id="profFollowingN">0</div>' +
          '<div class="profstat-l">Seguindo</div>' +
        '</div>' +
      '</div>' +

      '<div class="tabs" style="margin-top:14px">' +
        '<button class="tbtn on" onclick="switchTab(this,\'profPosts\')">Posts</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'profClips\')">Clips</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'profAgents\')">Agentes</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'profWeapons\')">Armas</button>' +
        '<button class="tbtn"    onclick="switchTab(this,\'profStats\')">Stats</button>' +
      '</div>' +
      '<div class="tcont on" id="profPosts"><div class="explore-grid" id="profPostsGrid"></div></div>' +
      '<div class="tcont"    id="profClips"><div class="clips-grid"   id="profClipsGrid"></div></div>' +
      '<div class="tcont"    id="profAgents">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<span style="font-size:.82rem;color:var(--muted)">Até 5 agentes favoritos</span>' +
          '<button class="sfbtn" onclick="openAgentSel()"><i class="fas fa-edit"></i> Editar</button>' +
        '</div>' +
        '<div class="agrid" id="favAgentsGrid"></div>' +
      '</div>' +
      '<div class="tcont" id="profWeapons">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<span style="font-size:.82rem;color:var(--muted)">Até 4 armas favoritas</span>' +
        '</div>' +
        '<div class="fav-slots" id="favWeaponsSlots"></div>' +
      '</div>' +
      '<div class="tcont" id="profStats"><div id="statsContent"></div></div>' +
    '</div>';

  // ── MODAIS ────────────────────────────────────────────────
  document.getElementById('modals-container').innerHTML =

    // Detalhe Agente
    '<div class="modal" id="modalAgentDetail" onclick="bgClose(event,\'modalAgentDetail\')">' +
      '<div class="mbox">' +
        '<div class="mhead"><h3 id="agentDetailTitle"></h3><button class="mclose" onclick="closeModal(\'modalAgentDetail\')">✕</button></div>' +
        '<div class="mbody" id="agentDetailBody"></div>' +
      '</div>' +
    '</div>' +

    // Detalhe Arma
    '<div class="modal" id="modalWeaponDetail" onclick="bgClose(event,\'modalWeaponDetail\')">' +
      '<div class="mbox">' +
        '<div class="mhead"><h3 id="weaponDetailTitle"></h3><button class="mclose" onclick="closeModal(\'modalWeaponDetail\')">✕</button></div>' +
        '<div class="mbody" id="weaponDetailBody"></div>' +
      '</div>' +
    '</div>' +

    // Agentes Favoritos
    '<div class="modal" id="modalAgents" onclick="bgClose(event,\'modalAgents\')">' +
      '<div class="mbox">' +
        '<div class="mhead"><h3>🎭 Agentes Favoritos</h3><button class="mclose" onclick="closeModal(\'modalAgents\')">✕</button></div>' +
        '<div class="mbody">' +
          '<p style="font-size:.82rem;color:var(--muted);margin-bottom:12px">Selecione até 5 agentes favoritos</p>' +
          '<div id="agentSelGrid"></div>' +
          '<button class="mbtn" style="margin-top:14px" onclick="saveFavAgents()">Salvar</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // Escolher Arma Favorita
    '<div class="modal" id="modalPickWeapon" onclick="bgClose(event,\'modalPickWeapon\')">' +
      '<div class="mbox">' +
        '<div class="mhead"><h3>🔫 Escolher Arma Favorita</h3><button class="mclose" onclick="closeModal(\'modalPickWeapon\')">✕</button></div>' +
        '<div class="mbody"><div class="agrid" id="weaponPickGrid"></div></div>' +
      '</div>' +
    '</div>' +

    // Editar Perfil — com upload de foto
    '<div class="modal" id="modalEditProfile" onclick="bgClose(event,\'modalEditProfile\')">' +
      '<div class="mbox">' +
        '<div class="mhead"><h3>✏️ Editar Perfil</h3><button class="mclose" onclick="closeModal(\'modalEditProfile\')">✕</button></div>' +
        '<div class="mbody">' +

          '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:16px">' +
            '<div style="position:relative;width:80px;height:80px">' +
              '<img id="editAvatarPreview" src="" style="width:80px;height:80px;border-radius:50%;border:3px solid var(--red);object-fit:cover"/>' +
              '<label style="position:absolute;bottom:0;right:0;width:26px;height:26px;background:var(--red);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.75rem;color:#fff">' +
                '📷' +
                '<input type="file" id="editAvatarInput" accept="image/*" style="display:none" onchange="previewAvatarEdit(this)"/>' +
              '</label>' +
            '</div>' +
            '<span style="font-size:.75rem;color:var(--muted)">Clique no 📷 para trocar a foto</span>' +
          '</div>' +

          '<label style="font-size:.8rem;color:var(--muted)">Nome</label>' +
          '<input class="minp" id="editName" placeholder="Seu nome"/>' +
          '<label style="font-size:.8rem;color:var(--muted)">Bio</label>' +
          '<textarea class="minp" id="editBio" rows="3" style="resize:none"></textarea>' +
          '<label style="font-size:.8rem;color:var(--muted)">Elo</label>' +
          '<select class="minp" id="editRank">' +
            '<option>Ferro</option><option>Bronze</option><option>Prata</option><option>Ouro</option>' +
            '<option>Platina</option><option>Diamante</option><option>Ascendente</option><option>Imortal</option><option>Radiante</option>' +
          '</select>' +
          '<label style="font-size:.8rem;color:var(--muted)">Mapa Favorito</label>' +
          '<select class="minp" id="editFavMap">' +
            '<option value="">Nenhum</option>' +
            '<option>Ascent</option><option>Bind</option><option>Haven</option><option>Split</option>' +
            '<option>Icebox</option><option>Breeze</option><option>Fracture</option><option>Pearl</option>' +
            '<option>Lotus</option><option>Sunset</option><option>Abyss</option>' +
          '</select>' +
          '<button class="mbtn" onclick="saveProfile()">Salvar</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // Editar Post
    '<div class="modal" id="modalEditPost" onclick="bgClose(event,\'modalEditPost\')">' +
      '<div class="mbox">' +
        '<div class="mhead"><h3>✏️ Editar Post</h3><button class="mclose" onclick="closeModal(\'modalEditPost\')">✕</button></div>' +
        '<div class="mbody">' +
          '<textarea class="minp" id="editPostTxt" rows="4" style="resize:none"></textarea>' +
          '<input type="hidden" id="editPostId"/>' +
          '<button class="mbtn" onclick="saveEditPost()">Salvar</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // Perfil Alheio
    '<div class="modal" id="modalOtherProfile" onclick="bgClose(event,\'modalOtherProfile\')">' +
      '<div class="mbox" style="max-width:480px">' +
        '<div class="mhead"><h3 id="otherProfTitle">Perfil</h3><button class="mclose" onclick="closeModal(\'modalOtherProfile\')">✕</button></div>' +
        '<div class="mbody" id="otherProfBody"></div>' +
      '</div>' +
    '</div>' +

    // Visualizar Imagem
    '<div class="modal" id="modalImageView" onclick="bgClose(event,\'modalImageView\')">' +
      '<div style="max-width:90vw;max-height:90vh;display:flex;align-items:center;justify-content:center">' +
        '<img id="imageViewImg" src="" style="max-width:90vw;max-height:85vh;border-radius:12px;object-fit:contain"/>' +
      '</div>' +
    '</div>';
}

// ── TABS ──────────────────────────────────────────────────
function switchTab(btn, cont) {
  var parent = btn.parentElement;
  parent.querySelectorAll('.tbtn').forEach(function (b) { b.classList.remove('on'); });
  btn.classList.add('on');
  var section = btn.closest('.pcont') || btn.closest('.page');
  if (section) {
    section.querySelectorAll('.tcont').forEach(function (c) { c.classList.remove('on'); });
    var el = document.getElementById(cont);
    if (el) el.classList.add('on');
  }
}

// ── CACHE ─────────────────────────────────────────────────
function clearCache() {
  if (confirm('Limpar cache? Posts, chats e stories serão apagados.')) {
    ['vh_posts','vh_chats','vh_allstories','vh_favagents','vh_favweapons','vh_social'].forEach(function (k) {
      localStorage.removeItem(k);
    });
    location.reload();
  }
}

// ── BUSCA GLOBAL ──────────────────────────────────────────
function doGlobalSearch(val) {
  var drop = document.getElementById('searchDrop');
  if (!val || val.length < 2) { drop.classList.remove('show'); return; }

  var results = [], v = val.toLowerCase();

  Object.values(ACCOUNTS).forEach(function (acc) {
    if (acc.name.toLowerCase().includes(v) || acc.username.toLowerCase().includes(v))
      results.push({type:'user', label:acc.name, sub:'@'+acc.username, action:"openOtherProfile('"+acc.username+"')"});
  });
  LB.forEach(function (p) {
    if (p.name.toLowerCase().includes(v) && !results.find(function (r) { return r.label === p.name; }))
      results.push({type:'user', label:p.name, sub:p.rankLabel, action:"openOtherProfile('"+p.name+"')"});
  });
  AGENTS.forEach(function (a) {
    if (a.name.toLowerCase().includes(v))
      results.push({type:'agent', label:a.name, sub:a.role, action:"openAgentDetail('"+a.name+"')"});
  });
  WEAPONS.forEach(function (w) {
    if (w.name.toLowerCase().includes(v))
      results.push({type:'weapon', label:w.name, sub:w.type, action:"openWeaponDetail('"+w.name+"')"});
  });
  MAPS.forEach(function (m) {
    if (m.name.toLowerCase().includes(v))
      results.push({type:'map', label:m.name, sub:m.desc, action:"showToast('🗺️ "+m.name+"')"});
  });

  if (!results.length) {
    drop.innerHTML = '<div class="sdrop-empty">Nenhum resultado para "' + val + '"</div>';
    drop.classList.add('show');
    return;
  }

  var icons = {user:'👤', agent:'🎭', weapon:'🔫', map:'🗺️'};
  drop.innerHTML = results.slice(0, 8).map(function (r) {
    return '<div class="sdrop-item" onclick="' + r.action + ';document.getElementById(\'searchDrop\').classList.remove(\'show\');document.getElementById(\'globalSearch\').value=\'\'">' +
      '<div class="sdrop-ico">' + (icons[r.type] || '🔍') + '</div>' +
      '<div>' +
        '<div class="sdrop-name">' + r.label + '</div>' +
        '<div class="sdrop-sub">'  + r.sub   + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  drop.classList.add('show');
}

// ── TRENDING E SUGESTÕES ──────────────────────────────────
function buildTrending() {
  var el = document.getElementById('trendingTags'); if (!el) return;
  el.innerHTML = TRENDING.map(function (t) {
    return '<div class="ttag">' +
      '<span class="ttagn">' + t.tag   + '</span>' +
      '<span class="ttagc">' + t.count + ' posts</span>' +
    '</div>';
  }).join('');
}

function buildSuggestions() {
  // Agentes em alta
  var hotEl = document.getElementById('hotAgents');
  if (hotEl) {
    hotEl.innerHTML = AGENTS.slice(0, 4).map(function (a) {
      return '<div class="sugitm">' +
        '<div class="sugavt" onclick="openAgentDetail(\'' + a.name + '\')">' +
          '<span style="font-size:1.2rem;line-height:36px;display:block;text-align:center">' + a.emoji + '</span>' +
        '</div>' +
        '<div class="suginfo">' +
          '<div class="sugname" onclick="openAgentDetail(\'' + a.name + '\')">' + a.name + '</div>' +
          '<div class="sugsub">' + a.role + '</div>' +
        '</div>' +
        '<button class="sfbtn" onclick="openAgentDetail(\'' + a.name + '\')">Ver</button>' +
      '</div>';
    }).join('');
  }

  // Sugestões de jogadores
  var suggEl = document.getElementById('suggList');
  if (suggEl) {
    var suggestions = LB.slice(0, 5).filter(function (p) { return p.name !== CU.username; });
    suggEl.innerHTML = suggestions.map(function (p) {
      var acc         = ACCOUNTS[p.name];
      var displayName = acc ? acc.name : p.name;
      var avatarSrc   = (acc && acc.avatar) ? acc.avatar : avt(displayName);
      var following   = CU ? isFollowing(CU.username, p.name) : false;
      return '<div class="sugitm">' +
        '<div class="sugavt" onclick="openOtherProfile(\'' + p.name + '\')">' +
          '<img src="' + avatarSrc + '"/>' +
        '</div>' +
        '<div class="suginfo">' +
          '<div class="sugname" onclick="openOtherProfile(\'' + p.name + '\')">' + displayName + '</div>' +
          '<div class="sugsub">' + p.rankLabel + ' • ' + p.agent + '</div>' +
        '</div>' +
        '<button class="sfbtn' + (following ? ' on' : '') + '" onclick="toggleFollowBtn(this,\'' + p.name + '\')">' +
          '<i class="fas fa-user-' + (following ? 'check' : 'plus') + '"></i> ' + (following ? 'Seguindo' : 'Seguir') +
        '</button>' +
      '</div>';
    }).join('');
  }
}
