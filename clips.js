/* ============================================================
   AUTH.JS — Login, cadastro, sessão e logout
   ============================================================ */

// Carrega contas salvas
var ACCOUNTS = JSON.parse(localStorage.getItem('vh_accounts') || '{}');

// Alterna entre aba Login e Cadastro
function switchAuth(tab) {
  document.querySelectorAll('.atab').forEach(function (t) { t.classList.remove('on'); });
  document.querySelectorAll('.aform').forEach(function (f) { f.classList.remove('on'); });
  if (tab === 'login') {
    document.querySelectorAll('.atab')[0].classList.add('on');
    document.getElementById('fLogin').classList.add('on');
  } else {
    document.querySelectorAll('.atab')[1].classList.add('on');
    document.getElementById('fReg').classList.add('on');
  }
}

// Cadastro
function doReg() {
  var name  = document.getElementById('rName').value.trim();
  var user  = document.getElementById('rUser').value.trim();
  var pass  = document.getElementById('rPass').value;
  var pass2 = document.getElementById('rPass2').value;
  var rank  = document.getElementById('rRank').value;
  var agent = document.getElementById('rAgent').value;
  var err   = document.getElementById('regErr');

  err.classList.remove('show');

  if (!name || !user || !pass) {
    err.textContent = '⚠️ Preencha todos os campos!';
    err.classList.add('show');
    return;
  }
  if (pass !== pass2) {
    err.textContent = '⚠️ Senhas não conferem!';
    err.classList.add('show');
    return;
  }
  if (ACCOUNTS[user]) {
    err.textContent = '⚠️ Usuário já existe!';
    err.classList.add('show');
    return;
  }

  ACCOUNTS[user] = {
    name: name, username: user, password: pass,
    rank: rank || 'Ferro', agent: agent || '',
    bio: 'Jogador de Valorant.', favMap: ''
  };
  localStorage.setItem('vh_accounts', JSON.stringify(ACCOUNTS));
  showToast('✅ Conta criada! Faça login.');
  switchAuth('login');
}

// Login
function doLogin() {
  var user = document.getElementById('lUser').value.trim();
  var pass = document.getElementById('lPass').value;
  var err  = document.getElementById('loginErr');
  err.classList.remove('show');

  if (ACCOUNTS[user] && ACCOUNTS[user].password === pass) {
    startApp(ACCOUNTS[user]);
  } else {
    err.classList.add('show');
  }
}

// Inicia o app após login
function startApp(user) {
  CU = user;
  localStorage.setItem('vh_session', JSON.stringify(user));
  document.getElementById('auth').classList.remove('show');
  document.getElementById('app').classList.add('show');
  initApp();
}

// Logout
function doLogout() {
  CU = null;
  localStorage.removeItem('vh_session');
  location.reload();
}

// Auto-login se sessão existir
(function () {
  var s = localStorage.getItem('vh_session');
  if (s) {
    try {
      var u = JSON.parse(s);
      if (u && ACCOUNTS[u.username]) {
        startApp(ACCOUNTS[u.username]);
        return;
      }
    } catch (e) {}
  }
  document.getElementById('auth').classList.add('show');
})();
