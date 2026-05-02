/* ============================================================
   POSTS.JS — Criar, listar, curtir, comentar e apagar posts
   ============================================================ */

function prevImg(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    postImgData = e.target.result;
    document.getElementById('iprevImg').src = e.target.result;
    document.getElementById('iprev').style.display = 'block';
  };
  reader.readAsDataURL(input.files[0]);
}

function remImg() {
  postImgData = '';
  document.getElementById('iprev').style.display = 'none';
  document.getElementById('iprevImg').src = '';
}

// ── CRIAR POST ────────────────────────────────────────────
function createPost() {
  var txt   = document.getElementById('postTxt').value.trim();
  var tag   = document.getElementById('postTag').value;
  var agent = document.getElementById('postAgent').value;
  if (!txt && !postImgData) { showToast('⚠️ Escreva algo ou adicione uma imagem!'); return; }

  posts.unshift({
    id:       Date.now(),
    user:     CU.username,
    text:     txt,
    img:      postImgData,
    likes:    0,
    liked:    false,
    comments: [],
    time:     nowTime(),
    tag:      tag,
    agent:    agent
  });

  localStorage.setItem('vh_posts', JSON.stringify(posts));
  document.getElementById('postTxt').value   = '';
  document.getElementById('postTag').value   = '';
  document.getElementById('postAgent').value = '';
  remImg();
  buildPosts();
  updateProfilePostCount();
  showToast('✅ Post publicado!');
}

// ── LISTAR POSTS ──────────────────────────────────────────
function buildPosts() {
  var el = document.getElementById('feedPosts'); if (!el) return;
  if (!posts.length) {
    el.innerHTML =
      '<div style="text-align:center;padding:40px;color:var(--muted)">' +
        'Nenhum post ainda. Seja o primeiro! 🎯' +
      '</div>';
    return;
  }
  el.innerHTML = posts.map(function (p) { return renderPost(p); }).join('');
  updateProfilePostsGrid();
}

// ── RENDERIZAR UM POST ────────────────────────────────────
function renderPost(p) {
  var acc         = ACCOUNTS[p.user];
  var lb          = LB.find(function (l) { return l.name === p.user; });
  var displayName = acc ? acc.name : p.user;
  var rank        = acc ? acc.rank : (lb ? lb.rankLabel : '');
  var agent       = p.agent || (acc ? acc.agent : '');
  var isOwner     = CU && (p.user === CU.username);
  var avatarSrc   = (acc && acc.avatar) ? acc.avatar : avt(displayName);
  var txt         = p.text.replace(/(#\w+)/g, '<span class="htag">$1</span>');

  var coms = p.comments.map(function (c) {
    return '<div class="citm">' +
      '<img class="cavt" src="' + avt(c.user) + '"/>' +
      '<div class="cbub">' +
        '<div class="cauth">' + c.user + '</div>' +
        '<div class="ctxt">'  + c.text + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  return (
    '<div class="pcard" id="post-' + p.id + '">' +

      // ── Cabeçalho ──────────────────────────────────────
      '<div class="phead">' +
        '<img class="pavt" src="' + avatarSrc + '" onclick="openOtherProfile(\'' + p.user + '\')"/>' +
        '<div class="pui">' +
          '<div class="pun" onclick="openOtherProfile(\'' + p.user + '\')">' + displayName + '</div>' +
          '<div class="pmeta">' +
            (rank  ? '<span class="prank">' + rank  + '</span>' : '') +
            '<span class="ptime">'  + p.time + '</span>' +
            (agent ? '<span class="pagb">'  + agent + '</span>' : '') +
            (p.tag ? '<span class="pmapb">' + p.tag + '</span>' : '') +
            (isOwner ? '<span class="peditb">✏️ seu post</span>' : '') +
          '</div>' +
        '</div>' +
        (isOwner
          ? '<div class="popt-wrap">' +
              '<button class="popt" onclick="togglePostMenu(' + p.id + ')">⋯</button>' +
              '<div class="pmenu" id="pmenu-' + p.id + '">' +
                '<div class="pmenu-item" onclick="editPost(' + p.id + ')"><i class="fas fa-edit"></i> Editar</div>' +
                '<div class="pmenu-item danger" onclick="deletePost(' + p.id + ')"><i class="fas fa-trash"></i> Apagar</div>' +
              '</div>' +
            '</div>'
          : '') +
      '</div>' +

      // ── Imagem ─────────────────────────────────────────
      (p.img ? '<img class="pimg" src="' + p.img + '" onclick="viewImage(\'' + p.img + '\')"/>' : '') +

      // ── Texto ──────────────────────────────────────────
      '<div class="ptxt">' + txt + '</div>' +

      // ── Ações ──────────────────────────────────────────
      '<div class="pstats">' +
        '<span class="pst' + (p.liked ? ' liked' : '') + '" onclick="likePost(' + p.id + ',' + JSON.stringify(p.user) + ')">' +
          '<i class="fas fa-heart"></i> ' + p.likes +
        '</span>' +
        '<span class="pst" onclick="toggleComments(' + p.id + ')">' +
          '<i class="fas fa-comment"></i> ' + p.comments.length +
        '</span>' +
        '<span class="pst" onclick="sharePost()">' +
          '<i class="fas fa-share"></i> Compartilhar' +
        '</span>' +
      '</div>' +

      // ── Comentários ────────────────────────────────────
      '<div class="pcoms" id="coms-' + p.id + '" style="display:none">' +
        '<div class="cinrow">' +
          '<img class="cavt" src="' + (CU ? (CU.avatar || avt(CU.name)) : avt('?')) + '"/>' +
          '<input class="cinput" id="cinp-' + p.id + '" placeholder="Comentar..."' +
            ' onkeydown="if(event.key===\'Enter\')addComment(' + p.id + ',' + JSON.stringify(p.user) + ')"/>' +
          '<button class="csbtn" onclick="addComment(' + p.id + ',' + JSON.stringify(p.user) + ')">Enviar</button>' +
        '</div>' +
        coms +
      '</div>' +

    '</div>'
  );
}

// ── MENU DO POST ──────────────────────────────────────────
function togglePostMenu(id) {
  document.querySelectorAll('.pmenu').forEach(function (m) {
    if (m.id !== 'pmenu-' + id) m.classList.remove('show');
  });
  var m = document.getElementById('pmenu-' + id);
  if (m) m.classList.toggle('show');
}

// ── CURTIR POST ───────────────────────────────────────────
function likePost(id, postOwner) {
  var p = posts.find(function (x) { return x.id === id; }); if (!p) return;

  p.liked  = !p.liked;
  p.likes += p.liked ? 1 : -1;
  localStorage.setItem('vh_posts', JSON.stringify(posts));

  // 🔔 Notifica o dono do post ao curtir
  if (p.liked) {
    pushNotif(postOwner, 'like', CU.username, CU.name, '');
  }

  buildPosts();
}

// ── MOSTRAR/ESCONDER COMENTÁRIOS ──────────────────────────
function toggleComments(id) {
  var el = document.getElementById('coms-' + id);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// ── ADICIONAR COMENTÁRIO ──────────────────────────────────
function addComment(id, postOwner) {
  var inp = document.getElementById('cinp-' + id);
  if (!inp || !inp.value.trim()) return;

  var texto = inp.value.trim();
  var p     = posts.find(function (x) { return x.id === id; }); if (!p) return;

  p.comments.push({ user: CU.name, text: texto });
  localStorage.setItem('vh_posts', JSON.stringify(posts));

  // 🔔 Notifica o dono do post
  pushNotif(postOwner, 'comment', CU.username, CU.name, texto.substring(0, 40));

  buildPosts();
  setTimeout(function () {
    var el = document.getElementById('coms-' + id);
    if (el) el.style.display = 'block';
  }, 50);
}

// ── EDITAR POST ───────────────────────────────────────────
function editPost(id) {
  var p = posts.find(function (x) { return x.id === id; }); if (!p) return;
  document.getElementById('editPostTxt').value = p.text;
  document.getElementById('editPostId').value  = id;
  openModal('modalEditPost');
  document.querySelectorAll('.pmenu').forEach(function (m) { m.classList.remove('show'); });
}

function saveEditPost() {
  var id  = parseInt(document.getElementById('editPostId').value);
  var txt = document.getElementById('editPostTxt').value.trim();
  if (!txt) { showToast('⚠️ Post não pode ser vazio!'); return; }
  var p = posts.find(function (x) { return x.id === id; }); if (!p) return;
  p.text = txt;
  localStorage.setItem('vh_posts', JSON.stringify(posts));
  closeModal('modalEditPost');
  buildPosts();
  showToast('✅ Post editado!');
}

// ── APAGAR POST ───────────────────────────────────────────
function deletePost(id) {
  if (!confirm('Apagar este post?')) return;
  posts = posts.filter(function (x) { return x.id !== id; });
  localStorage.setItem('vh_posts', JSON.stringify(posts));
  buildPosts();
  updateProfilePostCount();
  showToast('🗑️ Post apagado!');
}

// ── COMPARTILHAR ──────────────────────────────────────────
function sharePost() { showToast('🔗 Link copiado!'); }

// ── VISUALIZAR IMAGEM ─────────────────────────────────────
function viewImage(src) {
  if (!src) return;
  document.getElementById('imageViewImg').src = src;
  openModal('modalImageView');
}
