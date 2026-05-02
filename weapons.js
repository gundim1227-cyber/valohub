/* ============================================================
   STORIES.JS — Criar, publicar, visualizar e apagar stories
   ============================================================ */

var storyList  = [];
var storyIndex = 0;
var storyTimer = null;

function buildStories() {
  var el = document.getElementById('storiesRow'); if (!el) return;
  var myHasStory = myStories.length > 0;

  el.innerHTML =
    '<div class="sitm" onclick="' + (myHasStory ? 'openMyStory()' : 'openAddStory()') + '">' +
      '<div class="sring" style="border-color:' + (myHasStory ? 'var(--red)' : 'var(--border)') + '">' +
        '<img src="' + avt(CU.name) + '" alt=""/>' +
        '<div style="position:absolute;bottom:-2px;right:-2px;width:20px;height:20px;font-size:.65rem;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;color:#fff">' +
          (myHasStory ? '✅' : '+') +
        '</div>' +
      '</div>' +
      '<div class="sname">Seu story</div>' +
    '</div>';

  LB.slice(0, 8).forEach(function (p) {
    if (p.name === CU.username) return;
    el.innerHTML +=
      '<div class="sitm" onclick="openStory(\'' + p.name + '\')">' +
        '<div class="sring"><img src="' + avt(p.name) + '" alt=""/></div>' +
        '<div class="sname">' + p.name + '</div>' +
      '</div>';
  });

  Object.values(ACCOUNTS).forEach(function (acc) {
    if (acc.username === CU.username) return;
    el.innerHTML +=
      '<div class="sitm" onclick="openStory(\'' + acc.username + '\')">' +
        '<div class="sring"><img src="' + avt(acc.name) + '" alt=""/></div>' +
        '<div class="sname">' + acc.name + '</div>' +
      '</div>';
  });
}

function openAddStory() {
  var old = document.getElementById('addStoryOverlay'); if (old) old.remove();
  var overlay = document.createElement('div');
  overlay.id = 'addStoryOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
  overlay.innerHTML =
    '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;width:100%;max-width:400px;overflow:hidden;animation:mIn .25s ease">' +
      '<div style="background:linear-gradient(135deg,#1a0a0f,#0f1923);padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)">' +
        '<img src="' + avt(CU.name) + '" style="width:38px;height:38px;border-radius:50%;border:2px solid var(--red)"/>' +
        '<div style="flex:1"><div style="font-weight:800">Criar Story</div><div style="font-size:.72rem;color:var(--muted)">Visível por todos</div></div>' +
        '<button onclick="document.getElementById(\'addStoryOverlay\').remove()" style="background:none;border:none;color:var(--muted);font-size:1.2rem;cursor:pointer">✕</button>' +
      '</div>' +
      '<div style="padding:16px;display:flex;flex-direction:column;gap:12px">' +
        '<div id="storyImgPreview" style="width:100%;height:180px;background:var(--darker);border-radius:12px;border:2px dashed var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;overflow:hidden" onclick="document.getElementById(\'storyImgInput\').click()">' +
          '<i class="fas fa-image" style="font-size:2rem;color:var(--muted)"></i>' +
          '<span style="color:var(--muted);font-size:.82rem">Clique para adicionar foto</span>' +
        '</div>' +
        '<input type="file" id="storyImgInput" accept="image/*" style="display:none" onchange="previewStoryImg(this)"/>' +
        '<textarea id="storyTextInput" placeholder="Escreva algo no seu story... 🎯" style="background:var(--darker);border:1px solid var(--border);border-radius:10px;padding:10px;color:var(--text);font-size:.88rem;resize:none;height:80px;font-family:inherit;outline:none"></textarea>' +
        '<select id="storyMood" style="background:var(--darker);border:1px solid var(--border);border-radius:10px;padding:10px;color:var(--text);font-size:.85rem;outline:none">' +
          '<option value="">🎭 Humor (opcional)</option>' +
          '<option value="🔥 Em chamas!">🔥 Em chamas!</option>' +
          '<option value="😤 Focado no rank">😤 Focado no rank</option>' +
          '<option value="🎯 Sniper mode">🎯 Sniper mode</option>' +
          '<option value="💀 Tilted">💀 Tilted</option>' +
          '<option value="🏆 Subindo de elo">🏆 Subindo de elo</option>' +
          '<option value="😴 Casual hoje">😴 Casual hoje</option>' +
        '</select>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="pmbtn" style="flex:1" onclick="document.getElementById(\'addStoryOverlay\').remove()">Cancelar</button>' +
          '<button class="pfbtn" style="flex:1" onclick="publishStory()"><i class="fas fa-paper-plane"></i> Publicar</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function previewStoryImg(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    var prev = document.getElementById('storyImgPreview');
    if (prev) {
      prev.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover"/>';
      prev.style.border = 'none';
      document.getElementById('storyImgInput').dataset.base64 = e.target.result;
    }
  };
  reader.readAsDataURL(input.files[0]);
}

function publishStory() {
  var txt  = document.getElementById('storyTextInput').value.trim();
  var mood = document.getElementById('storyMood').value;
  var img  = document.getElementById('storyImgInput').dataset.base64 || '';
  if (!txt && !img) { showToast('⚠️ Adicione foto ou texto!'); return; }

  allStories = JSON.parse(localStorage.getItem('vh_allstories') || '{}');
  if (!allStories[CU.username]) allStories[CU.username] = [];

  var story = {
    id: Date.now(), user: CU.username, name: CU.name,
    text: txt || (mood || '🎮 Jogando Valorant!'),
    mood: mood, img: img, timeLabel: 'agora'
  };
  allStories[CU.username].unshift(story);
  if (allStories[CU.username].length > 5) allStories[CU.username] = allStories[CU.username].slice(0, 5);
  localStorage.setItem('vh_allstories', JSON.stringify(allStories));
  myStories = allStories[CU.username];

  var overlay = document.getElementById('addStoryOverlay'); if (overlay) overlay.remove();
  buildStories();
  showToast('✅ Story publicado!');
}

function openMyStory() {
  if (!myStories.length) { openAddStory(); return; }
  var old = document.getElementById('myStoryOverlay'); if (old) old.remove();
  var s = myStories[0];
  var storyImg = s.img
    ? '<img src="' + s.img + '" style="width:100%;max-height:220px;object-fit:cover;border-radius:10px;margin-bottom:12px"/>'
    : '<div style="width:100%;height:140px;background:linear-gradient(135deg,#1a0a0f,#0f1923);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;margin-bottom:12px">🎮</div>';

  var overlay = document.createElement('div');
  overlay.id = 'myStoryOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
  overlay.innerHTML =
    '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;width:100%;max-width:400px;overflow:hidden;animation:mIn .25s ease">' +
      '<div style="background:linear-gradient(135deg,#1a0a0f,#0f1923);padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)">' +
        '<img src="' + avt(CU.name) + '" style="width:40px;height:40px;border-radius:50%;border:2px solid var(--red)"/>' +
        '<div style="flex:1"><div style="font-weight:800">Seu Story</div><div style="font-size:.7rem;color:var(--muted)">' + CU.rank + ' • ' + s.timeLabel + '</div></div>' +
        '<button onclick="document.getElementById(\'myStoryOverlay\').remove()" style="background:none;border:none;color:var(--muted);font-size:1.2rem;cursor:pointer">✕</button>' +
      '</div>' +
      '<div style="padding:16px">' + storyImg +
        (s.mood ? '<div style="text-align:center;font-size:.9rem;margin-bottom:8px">' + s.mood + '</div>' : '') +
        '<div style="font-size:.88rem;color:var(--muted);line-height:1.6;font-style:italic;margin-bottom:14px">"' + s.text + '"</div>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="pfbtn" style="flex:1" onclick="document.getElementById(\'myStoryOverlay\').remove();openAddStory()"><i class="fas fa-plus"></i> Novo Story</button>' +
          '<button class="pmbtn" style="flex:1;background:rgba(255,70,85,.1);color:var(--red);border-color:rgba(255,70,85,.3)" onclick="deleteMyStory()"><i class="fas fa-trash"></i> Apagar</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function deleteMyStory() {
  if (!confirm('Apagar seu story?')) return;
  allStories = JSON.parse(localStorage.getItem('vh_allstories') || '{}');
  allStories[CU.username] = [];
  localStorage.setItem('vh_allstories', JSON.stringify(allStories));
  myStories = [];
  var overlay = document.getElementById('myStoryOverlay'); if (overlay) overlay.remove();
  buildStories();
  showToast('🗑️ Story apagado!');
}

function openStory(username) {
  storyList = [];
  LB.slice(0, 8).forEach(function (p) { if (p.name !== CU.username) storyList.push(p.name); });
  Object.values(ACCOUNTS).forEach(function (acc) {
    if (acc.username === CU.username) return;
    if (storyList.indexOf(acc.username) === -1) storyList.push(acc.username);
  });
  storyIndex = storyList.indexOf(username);
  if (storyIndex === -1) storyIndex = 0;
  renderStoryOverlay();
}

function renderStoryOverlay() {
  var old = document.getElementById('storyOverlay'); if (old) old.remove();
  if (storyTimer) clearTimeout(storyTimer);
  if (storyIndex >= storyList.length) { closeStory(); return; }

  var username    = storyList[storyIndex];
  var acc         = ACCOUNTS[username];
  var lb          = LB.find(function (p) { return p.name === username; });
  var displayName = acc ? acc.name : username;
  var rank        = acc ? acc.rank : (lb ? lb.rankLabel : 'Jogador');
  var agent       = acc ? acc.agent : (lb ? lb.agent : '🎮');

  var userStoriesData = allStories[username] || [];
  var storyImg, storyText;

  if (userStoriesData.length && userStoriesData[0].img) {
    storyImg  = '<img src="' + userStoriesData[0].img + '" style="width:100%;max-height:220px;object-fit:cover;border-radius:10px;margin-bottom:12px"/>';
    storyText = '"' + userStoriesData[0].text + '"';
  } else if (userStoriesData.length) {
    storyImg  = '<div style="width:100%;height:160px;background:linear-gradient(135deg,#1a0a0f,#0f1923);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:4rem;margin-bottom:12px">🎮</div>';
    storyText = '"' + userStoriesData[0].text + '"';
  } else {
    var userPosts = posts.filter(function (p) { return p.user === username; });
    storyImg  = userPosts.length && userPosts[0].img
      ? '<img src="' + userPosts[0].img + '" style="width:100%;max-height:220px;object-fit:cover;border-radius:10px;margin-bottom:12px"/>'
      : '<div style="width:100%;height:160px;background:linear-gradient(135deg,#1a0a0f,#0f1923);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:4rem;margin-bottom:12px">🎮</div>';
    storyText = userPosts.length ? '"' + userPosts[0].text.substring(0, 80) + '"' : 'Nenhum story ainda. 🎯';
  }

  var total = storyList.length, current = storyIndex, progressBars = '';
  for (var i = 0; i < total; i++) {
    if (i < current)
      progressBars += '<div style="flex:1;height:3px;background:rgba(255,255,255,.8);border-radius:2px;margin:0 2px"></div>';
    else if (i === current)
      progressBars += '<div style="flex:1;height:3px;background:rgba(255,255,255,.3);border-radius:2px;margin:0 2px;overflow:hidden"><div id="storyProgressBar" style="height:100%;background:#fff;width:0%;border-radius:2px;transition:width 5s linear"></div></div>';
    else
      progressBars += '<div style="flex:1;height:3px;background:rgba(255,255,255,.2);border-radius:2px;margin:0 2px"></div>';
  }

  var overlay = document.createElement('div');
  overlay.id = 'storyOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
  overlay.innerHTML =
    '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;width:100%;max-width:400px;overflow:hidden;animation:mIn .25s ease;position:relative">' +
      '<div style="display:flex;padding:10px 10px 0;gap:0">' + progressBars + '</div>' +
      '<div style="background:linear-gradient(135deg,#1a0a0f,#0f1923);padding:12px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)">' +
        '<img src="' + avt(displayName) + '" style="width:40px;height:40px;border-radius:50%;border:2px solid var(--red)"/>' +
        '<div style="flex:1"><div style="font-weight:800;font-size:.92rem">' + displayName + '</div><div style="font-size:.7rem;color:var(--muted)">' + rank + ' • ' + agent + '</div></div>' +
        '<span style="font-size:.72rem;color:var(--muted);margin-right:8px">' + (current + 1) + '/' + total + '</span>' +
        '<button onclick="closeStory()" style="background:none;border:none;color:var(--muted);font-size:1.2rem;cursor:pointer;padding:4px 8px">✕</button>' +
      '</div>' +
      '<div style="padding:16px">' + storyImg +
        '<div style="font-size:.88rem;color:var(--muted);line-height:1.6;font-style:italic;margin-bottom:14px">' + storyText + '</div>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="pfbtn" style="flex:1" onclick="closeStory();openChat(\'' + username + '\')"><i class="fas fa-paper-plane"></i> Mensagem</button>' +
          '<button class="pmbtn" style="flex:1" onclick="closeStory();openOtherProfile(\'' + username + '\')"><i class="fas fa-user"></i> Perfil</button>' +
        '</div>' +
      '</div>' +
      '<button onclick="prevStory()" style="position:absolute;left:0;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.4);border:none;color:#fff;font-size:1.4rem;padding:16px 10px;cursor:pointer;border-radius:0 8px 8px 0;' + (storyIndex === 0 ? 'opacity:.3;pointer-events:none' : '') + '">‹</button>' +
      '<button onclick="nextStory()" style="position:absolute;right:0;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.4);border:none;color:#fff;font-size:1.4rem;padding:16px 10px;cursor:pointer;border-radius:8px 0 0 8px">›</button>' +
    '</div>';
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeStory(); });
  document.body.appendChild(overlay);
  setTimeout(function () { var bar = document.getElementById('storyProgressBar'); if (bar) bar.style.width = '100%'; }, 50);
  storyTimer = setTimeout(function () { nextStory(); }, 5000);
}

function nextStory() { if (storyTimer) clearTimeout(storyTimer); storyIndex++; if (storyIndex >= storyList.length) { closeStory(); } else { renderStoryOverlay(); } }
function prevStory() { if (storyTimer) clearTimeout(storyTimer); if (storyIndex > 0) { storyIndex--; renderStoryOverlay(); } }
function closeStory() { if (storyTimer) clearTimeout(storyTimer); var o = document.getElementById('storyOverlay'); if (o) o.remove(); }
