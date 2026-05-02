/* ============================================================
   CLIPS.JS — Grid de clips em destaque
   ============================================================ */

function buildClips() {
  ['clipsGrid', 'profClipsGrid'].forEach(function (gid) {
    var el = document.getElementById(gid); if (!el) return;
    el.innerHTML = CLIPS.map(function (c) {
      return '<div>' +
        '<div class="cthumb" onclick="showToast(\'▶️ Reproduzindo: ' + c.title + '\')">' +
          '<img class="cthumb-img" src="' + c.img + '" alt="' + c.title + '"/>' +
          '<div class="cplay"><i class="fas fa-play"></i></div>' +
        '</div>' +
        '<div class="ctitle">' + c.title + '</div>' +
        '<div class="cviews">' + c.views + ' visualizações</div>' +
      '</div>';
    }).join('');
  });
}
