/* ============================================================
   CHAT.JS — Lista de contatos e bate-papo
   ============================================================ */

var currentChat = null;

// ── LISTA DE CONTATOS ─────────────────────────────────────
function buildMsgList() {
  var el = document.getElementById('msgList'); if (!el) return;
  chatData = JSON.parse(localStorage.getItem('vh_chats') || '{}');

  var contacts = [];

  LB.slice(0, 6).forEach(function (p) {
    if (p.name !== CU.username)
      contacts.push({ username: p.name, name: p.name, avatar: avt(p.name) });
  });

  Object.values(ACCOUNTS).forEach(function (acc) {
    if (acc.username === CU.username) return;
    if (!contacts.find(function (c) { return c.username === acc.username; }))
      contacts.push({ username: acc.username, name: acc.name, avatar: acc.avatar || avt(acc.name) });
  });

  if (!contacts.length) {
    el.innerHTML =
      '<div style="text-align:center;padding:30px;color:var(--muted)">Nenhum contato ainda.</div>';
    return;
  }

  el.innerHTML = contacts.map(function (c) {
    var key      = chatKey(CU.username, c.username);
    var msgs     = chatData[key] || [];
    var last     = msgs.length ? msgs[msgs.length - 1] : null;
    var lastText = last
      ? (last.from === CU.username ? 'Você: ' + last.text : last.text)
      : 'Inicie uma conversa!';
    var lastTime = last ? last.time : '';

    return (
      '<div class="mitm" onclick="openChat(\'' + c.username + '\')">' +
        '<div class="mavtw">' +
          '<div class="mavt">' +
            '<img src="' + c.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>' +
          '</div>' +
          '<div class="monl"></div>' +
        '</div>' +
        '<div class="minfo">' +
          '<div class="mname">' + c.name   + '</div>' +
          '<div class="mprev">' + lastText + '</div>' +
        '</div>' +
        '<div class="mtime">' + lastTime + '</div>' +
      '</div>'
    );
  }).join('');
}

// ── ABRIR CHAT ────────────────────────────────────────────
function openChat(username) {
  chatData    = JSON.parse(localStorage.getItem('vh_chats') || '{}');
  currentChat = username;

  var acc         = ACCOUNTS[username];
  var lb          = LB.find(function (p) { return p.name === username; });
  var displayName = acc ? acc.name : username;
  var avatarSrc   = (acc && acc.avatar) ? acc.avatar : avt(displayName);

  document.getElementById('chatUavt').innerHTML =
    '<img src="' + avatarSrc + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>';
  document.getElementById('chatUname').textContent   = displayName;
  document.getElementById('chatUstatus').textContent =
    (lb ? lb.rankLabel : (acc ? acc.rank : 'Jogador')) + ' • Online';

  var listWrap = document.getElementById('msgListWrap');
  var chatWrap = document.getElementById('chatWrap');
  if (listWrap) listWrap.style.display = 'none';
  if (chatWrap) chatWrap.classList.add('show');

  renderChatMsgs();

  setTimeout(function () {
    var inp = document.getElementById('chatInp');
    if (inp) inp.focus();
  }, 150);
}

// ── RENDERIZAR MENSAGENS ──────────────────────────────────
function renderChatMsgs() {
  var el = document.getElementById('chatMsgs');
  if (!el || !currentChat) return;

  var key  = chatKey(CU.username, currentChat);
  var msgs = chatData[key] || [];

  if (!msgs.length) {
    el.innerHTML =
      '<div style="text-align:center;padding:30px;color:var(--muted);font-size:.85rem">' +
        'Nenhuma mensagem ainda.<br/>Diga olá! 👋' +
      '</div>';
    return;
  }

  el.innerHTML = msgs.map(function (m) {
    var isMine    = m.from === CU.username;
    var avatarSrc = isMine
      ? (CU.avatar || avt(CU.name))
      : (function () {
          var a = ACCOUNTS[m.from];
          return (a && a.avatar) ? a.avatar : avt(m.senderName || m.from);
        })();

    return (
      '<div style="display:flex;align-items:flex-end;gap:6px;margin-bottom:4px;' +
          (isMine ? 'flex-direction:row-reverse' : '') + '">' +
        '<img src="' + avatarSrc + '" ' +
          'style="width:26px;height:26px;border-radius:50%;object-fit:cover;flex-shrink:0"/>' +
        '<div class="cmsg ' + (isMine ? 'mine' : 'theirs') + '">' +
          (!isMine
            ? '<div style="font-size:.7rem;font-weight:700;color:var(--red);margin-bottom:3px">' +
                (m.senderName || m.from) +
              '</div>'
            : '') +
          m.text +
          '<div class="cmsg-time">' + m.time + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  el.scrollTop = el.scrollHeight;
}

// ── ENVIAR MENSAGEM ───────────────────────────────────────
function sendMsg() {
  var inp = document.getElementById('chatInp');
  if (!inp)              { console.error('chatInp não encontrado'); return; }
  if (!inp.value.trim()) return;
  if (!currentChat)      { showToast('⚠️ Nenhuma conversa aberta!'); return; }

  var text = inp.value.trim();
  var time = nowTime();
  var key  = chatKey(CU.username, currentChat);

  chatData = JSON.parse(localStorage.getItem('vh_chats') || '{}');
  if (!chatData[key]) chatData[key] = [];

  chatData[key].push({
    from:       CU.username,
    senderName: CU.name,
    text:       text,
    time:       time
  });

  localStorage.setItem('vh_chats', JSON.stringify(chatData));

  // 🔔 Notifica o destinatário
  pushNotif(currentChat, 'message', CU.username, CU.name, text.substring(0, 40));

  inp.value = '';
  renderChatMsgs();

  // Resposta automática para bots
  if (!ACCOUNTS[currentChat]) {
    var botName = currentChat;
    setTimeout(function () {
      var respostas = [
        'Boa jogada! 🎯', 'Vamos jogar juntos?', 'Que rank você está?',
        'Esse Vandal tá destruindo 🔥', 'GG EZ!', 'Precisamos de um Sage no time 🌿',
        'Operator ou Vandal? 🤔', 'Clutch ou kick? 😂', 'Tô subindo de elo hoje 🏆',
        'Boa sorte no próximo jogo! 🍀', 'Que agente você tá usando?', 'Vai de Jett? 🌪️'
      ];
      var r = respostas[Math.floor(Math.random() * respostas.length)];

      chatData = JSON.parse(localStorage.getItem('vh_chats') || '{}');
      if (!chatData[key]) chatData[key] = [];
      chatData[key].push({
        from:       botName,
        senderName: botName,
        text:       r,
        time:       nowTime()
      });
      localStorage.setItem('vh_chats', JSON.stringify(chatData));

      // 🔔 Bot notifica o usuário logado
      pushNotif(CU.username, 'message', botName, botName, r.substring(0, 40));

      renderChatMsgs();
    }, 800 + Math.random() * 1200);
  }
}

// ── FECHAR CHAT ───────────────────────────────────────────
function closeChat() {
  currentChat = null;
  var listWrap = document.getElementById('msgListWrap');
  var chatWrap = document.getElementById('chatWrap');
  if (listWrap) listWrap.style.display = 'block';
  if (chatWrap) chatWrap.classList.remove('show');
  buildMsgList();
}
