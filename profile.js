/* ============================================================
   NOTIFICATIONS.JS — Sistema de notificações em tempo real
   ============================================================ */

function loadNotifs() {
  var s = localStorage.getItem('vh_notifs_' + CU.username);
  if (s) { try { return JSON.parse(s); } catch (e) {} }
  return NOTIFS.slice();
}

function saveNotifs(list) {
  localStorage.setItem('vh_notifs_' + CU.username, JSON.stringify(list));
}

function pushNotif(targetUsername, type, fromUsername, fromName, extra) {
  if (!CU || targetUsername === CU.username) return;

  var key  = 'vh_notifs_' + targetUsername;
  var list = [];
  var s    = localStorage.getItem(key);
  if (s) { try { list = JSON.parse(s); } catch (e) { list = []; } }

  var messages = {
    like:    'curtiu seu post.',
    comment: 'comentou: "' + (extra || '') + '"',
    follow:  'começou a seguir você.',
    message: 'enviou uma mensagem: "' + (extra || '') + '"'
  };

  list.unshift({
    fromUsername: fromUsername,
    fromName:     fromName,
    action:       messages[type] || extra || '',
    type:         type,
    time:         nowTime(),
    unread:       true
  });

  if (list.length > 50) list = list.slice(0, 50);
  localStorage.setItem(key, JSON.stringify(list));

  if (targetUsername === CU.username) {
    buildNotifications();
    updateNotifBadge();
  }
}

function updateNotifBadge() {
  var list   = loadNotifs();
  var unread = list.filter(function (n) { return n.unread; }).length;

  document.querySelectorAll('.notif-badge').forEach(function (b) { b.remove(); });

  if (unread > 0) {
    var num   = unread > 9 ? '9+' : unread;
    var badge =
      '<span class="notif-badge" style="' +
        'background:var(--red);color:#fff;border-radius:50%;' +
        'width:16px;height:16px;font-size:.6rem;font-weight:800;' +
        'display:inline-flex;align-items:center;justify-content:center;' +
        'margin-left:4px;vertical-align:middle">' + num + '</span>';

    var si = document.getElementById('si-notifications');
    if (si) si.innerHTML = '<i class="fas fa-bell"></i> Notificações' + badge;

    var bn = document.getElementById('bn-notifications');
    if (bn) bn.innerHTML = '<i class="fas fa-bell"></i>Notif' + badge;
  }
}

function buildNotifications() {
  var el = document.getElementById('notifList'); if (!el) return;

  var list = loadNotifs();

  if (!list.length) {
    el.innerHTML =
      '<div style="text-align:center;padding:40px;color:var(--muted)">' +
        '<div style="font-size:2.5rem;margin-bottom:10px">🔔</div>' +
        'Nenhuma notificação ainda.' +
      '</div>';
    updateNotifBadge();
    return;
  }

  var iconMap = {
    like:    { bg:'rgba(255,70,85,.2)',   color:'#ff4655', icon:'fa-heart'       },
    comment: { bg:'rgba(100,180,255,.2)', color:'#64b4ff', icon:'fa-comment'     },
    follow:  { bg:'rgba(80,220,120,.2)',  color:'#50dc78', icon:'fa-user-plus'   },
    message: { bg:'rgba(180,100,255,.2)', color:'#b464ff', icon:'fa-paper-plane' }
  };

  el.innerHTML =
    '<div style="display:flex;justify-content:flex-end;margin-bottom:12px">' +
      '<button class="sfbtn" onclick="markAllRead()">✅ Marcar todas como lidas</button>' +
    '</div>' +

    list.map(function (n, i) {
      var ic        = iconMap[n.type] || { bg:'rgba(255,255,255,.1)', color:'#fff', icon:'fa-bell' };
      var fromUser  = n.fromUsername || n.user || '?';
      var fromName  = n.fromName    || n.user || '?';
      var acc       = ACCOUNTS[fromUser];
      var avatarSrc = (acc && acc.avatar) ? acc.avatar : avt(fromName);

      return (
        '<div class="nitm' + (n.unread ? ' unread' : '') + '" ' +
          'onclick="readNotif(' + i + ')" ' +
          'style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;' +
            'background:' + (n.unread ? 'rgba(255,70,85,.06)' : 'rgba(255,255,255,.02)') + ';' +
            'border:1px solid ' + (n.unread ? 'rgba(255,70,85,.2)' : 'rgba(255,255,255,.06)') + ';' +
            'margin-bottom:8px;cursor:pointer;transition:background .2s">' +

          // ── Avatar + ícone do tipo ──────────────────────
          '<div style="position:relative;flex-shrink:0">' +
            '<img src="' + avatarSrc + '" ' +
              'onclick="event.stopPropagation();openOtherProfile(\'' + fromUser + '\')" ' +
              'style="width:46px;height:46px;border-radius:50%;object-fit:cover;' +
                'border:2px solid ' + ic.color + ';cursor:pointer"/>' +
            '<div style="position:absolute;bottom:-3px;right:-3px;' +
              'width:20px;height:20px;border-radius:50%;' +
              'background:' + ic.bg + ';border:2px solid var(--dark);' +
              'display:flex;align-items:center;justify-content:center">' +
              '<i class="fas ' + ic.icon + '" style="font-size:.5rem;color:' + ic.color + '"></i>' +
            '</div>' +
          '</div>' +

          // ── Texto ──────────────────────────────────────
          '<div style="flex:1;min-width:0">' +
            '<div style="font-size:.85rem;line-height:1.5">' +
              '<span ' +
                'onclick="event.stopPropagation();openOtherProfile(\'' + fromUser + '\')" ' +
                'style="font-weight:800;color:#fff;cursor:pointer">' +
                fromName +
              '</span> ' +
              '<span style="color:var(--muted)">' + n.action + '</span>' +
            '</div>' +
            '<div style="font-size:.72rem;color:var(--muted);margin-top:2px">' +
              '<i class="fas fa-clock" style="margin-right:3px"></i>' + n.time +
            '</div>' +
          '</div>' +

          // ── Bolinha não lida ───────────────────────────
          '<div style="width:9px;height:9px;border-radius:50%;flex-shrink:0;' +
            'background:' + (n.unread ? 'var(--red)' : 'transparent') + '"></div>' +

        '</div>'
      );
    }).join('');

  updateNotifBadge();
}

function readNotif(index) {
  var list = loadNotifs();
  if (list[index]) list[index].unread = false;
  saveNotifs(list);
  buildNotifications();
}

function markAllRead() {
  var list = loadNotifs();
  list.forEach(function (n) { n.unread = false; });
  saveNotifs(list);
  buildNotifications();
  showToast('✅ Todas as notificações lidas!');
}
