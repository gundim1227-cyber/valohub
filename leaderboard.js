/* ============================================================
   DATA.JS — Todos os dados estáticos do jogo
   ============================================================ */

var AGENTS = [
  {
    name: 'Jett', role: 'Duelista', emoji: '🌪️',
    lore: 'A duelista sul-coreana domina os ventos com agilidade incomparável.',
    abilities: [
      {key:'Q', name:'Updraft',     desc:'Impulsiona Jett para cima.'},
      {key:'E', name:'Tailwind',    desc:'Dash rápido na direção do movimento.'},
      {key:'C', name:'Cloudburst',  desc:'Lança uma nuvem de fumaça.'},
      {key:'X', name:'Blade Storm', desc:'Facas precisas que recarregam ao matar.'}
    ]
  },
  {
    name: 'Reyna', role: 'Duelista', emoji: '👁️',
    lore: 'Dominando o campo de batalha com poder sobrenatural.',
    abilities: [
      {key:'Q', name:'Devour',  desc:'Consome alma para se curar.'},
      {key:'E', name:'Dismiss', desc:'Torna-se intangível por instantes.'},
      {key:'C', name:'Leer',    desc:'Cega todos os inimigos que olham para o orbe.'},
      {key:'X', name:'Empress', desc:'Modo frenético com cura automática ao matar.'}
    ]
  },
  {
    name: 'Sage', role: 'Sentinela', emoji: '🌿',
    lore: 'A fortaleza chinesa que cura aliados e controla o campo.',
    abilities: [
      {key:'Q', name:'Slow Orb',     desc:'Cria zona que desacelera inimigos.'},
      {key:'E', name:'Healing Orb',  desc:'Cura aliado ou a si mesma.'},
      {key:'C', name:'Barrier Orb',  desc:'Cria uma parede sólida de gelo.'},
      {key:'X', name:'Resurrection', desc:'Revive um aliado morto.'}
    ]
  },
  {
    name: 'Omen', role: 'Controlador', emoji: '👁️‍🗨️',
    lore: 'Um fantasma nas sombras que assombra inimigos.',
    abilities: [
      {key:'Q', name:'Paranoia',         desc:'Projétil que cega inimigos.'},
      {key:'E', name:'Dark Cover',       desc:'Lança orbes de sombra que bloqueiam visão.'},
      {key:'C', name:'Shrouded Step',    desc:'Teleporte curto de distância.'},
      {key:'X', name:'From the Shadows', desc:'Teleporte para qualquer ponto do mapa.'}
    ]
  },
  {
    name: 'Phoenix', role: 'Duelista', emoji: '🔥',
    lore: 'O duelista britânico que controla o fogo.',
    abilities: [
      {key:'Q', name:'Blaze',       desc:'Cria uma parede de fogo.'},
      {key:'E', name:'Curveball',   desc:'Flash em curva que cega inimigos.'},
      {key:'C', name:'Hot Hands',   desc:'Bola de fogo que cura Phoenix.'},
      {key:'X', name:'Run it Back', desc:'Marca posição e revive nela ao morrer.'}
    ]
  },
  {
    name: 'Sova', role: 'Iniciador', emoji: '🏹',
    lore: 'O caçador russo que revela inimigos com precisão cirúrgica.',
    abilities: [
      {key:'Q', name:'Shock Bolt',    desc:'Flecha elétrica que causa dano em área.'},
      {key:'E', name:'Recon Bolt',    desc:'Flecha que revela inimigos próximos.'},
      {key:'C', name:'Owl Drone',     desc:'Drone controlável que marca inimigos.'},
      {key:'X', name:"Hunter's Fury", desc:'Três rajadas de energia que atravessam paredes.'}
    ]
  },
  {
    name: 'Killjoy', role: 'Sentinela', emoji: '🤖',
    lore: 'A gênio alemã que defende com tecnologia avançada.',
    abilities: [
      {key:'Q', name:'Grenade',  desc:'Granada que causa dano em área.'},
      {key:'E', name:'Alarmbot', desc:'Robô que detecta e debuffa inimigos.'},
      {key:'C', name:'Turret',   desc:'Torre automática que atira em inimigos.'},
      {key:'X', name:'Lockdown', desc:'Dispositivo que detém todos inimigos na área.'}
    ]
  },
  {
    name: 'Viper', role: 'Controlador', emoji: '☠️',
    lore: 'A cientista americana que usa veneno para controlar o campo.',
    abilities: [
      {key:'Q', name:'Poison Cloud', desc:'Emissão de gás venenoso.'},
      {key:'E', name:'Toxic Screen', desc:'Parede de veneno longa.'},
      {key:'C', name:'Snake Bite',   desc:'Projétil que cria poça de ácido.'},
      {key:'X', name:"Viper's Pit",  desc:'Nuvem enorme de veneno ao redor de Viper.'}
    ]
  },
  {
    name: 'Cypher', role: 'Sentinela', emoji: '🕵️',
    lore: 'O espião marroquino que nunca perde informação.',
    abilities: [
      {key:'Q', name:'Cyber Cage',   desc:'Gaiola de fumaça ativável.'},
      {key:'E', name:'Spycam',       desc:'Câmera escondida que revela inimigos.'},
      {key:'C', name:'Trapwire',     desc:'Arame que prende e revela inimigos.'},
      {key:'X', name:'Neural Theft', desc:'Extrai localização de todos inimigos do cadáver.'}
    ]
  },
  {
    name: 'Brimstone', role: 'Controlador', emoji: '🌫️',
    lore: 'O veterano americano com suporte orbital.',
    abilities: [
      {key:'Q', name:'Incendiary',     desc:'Granada incendiária.'},
      {key:'E', name:'Sky Smoke',      desc:'Fumaças orbitais precisas.'},
      {key:'C', name:'Stim Beacon',    desc:'Beacon que aumenta velocidade de aliados.'},
      {key:'X', name:'Orbital Strike', desc:'Laser orbital devastador.'}
    ]
  },
  {
    name: 'Neon', role: 'Duelista', emoji: '⚡',
    lore: 'A filipina ultrarrápida que corre e atira com eletricidade.',
    abilities: [
      {key:'Q', name:'Relay Bolt', desc:'Raio elétrico que ricocheteia.'},
      {key:'E', name:'High Gear',  desc:'Sprint de alta velocidade.'},
      {key:'C', name:'Fast Lane',  desc:'Duas paredes de eletricidade.'},
      {key:'X', name:'Overdrive',  desc:'Raio elétrico preciso e letal.'}
    ]
  },
  {
    name: 'Fade', role: 'Iniciador', emoji: '🌑',
    lore: 'A caçadora turca que usa pesadelos para revelar inimigos.',
    abilities: [
      {key:'Q', name:'Seize',     desc:'Orbe que prende inimigos no lugar.'},
      {key:'E', name:'Haunt',     desc:'Olho que revela e marca inimigos.'},
      {key:'C', name:'Prowler',   desc:'Criatura que persegue e cega inimigos.'},
      {key:'X', name:'Nightfall', desc:'Onda de trevas que debuffa todos inimigos.'}
    ]
  },
  {
    name: 'Harbor', role: 'Controlador', emoji: '🌊',
    lore: 'O misterioso indiano que controla a água.',
    abilities: [
      {key:'Q', name:'Cove',      desc:'Escudo de água que bloqueia tiros.'},
      {key:'E', name:'High Tide', desc:'Parede de água controlável.'},
      {key:'C', name:'Cascade',   desc:'Onda de água que desacelera inimigos.'},
      {key:'X', name:'Reckoning', desc:'Gêiseres que atordoam inimigos.'}
    ]
  },
  {
    name: 'Gekko', role: 'Iniciador', emoji: '🦎',
    lore: 'O californiano que comanda criaturas alienígenas.',
    abilities: [
      {key:'Q', name:'Wingman',  desc:'Criatura que planta ou desativa a spike.'},
      {key:'E', name:'Dizzy',    desc:'Criatura que cega inimigos.'},
      {key:'C', name:'Mosh Pit', desc:'Criatura que explode em área.'},
      {key:'X', name:'Thrash',   desc:'Criatura controlável que detém inimigos.'}
    ]
  },
  {
    name: 'Clove', role: 'Controlador', emoji: '🍀',
    lore: 'O controlador escocês que pode agir mesmo após a morte.',
    abilities: [
      {key:'Q', name:'Pick-me-up',  desc:'Absorve alma para ganhar velocidade e vida.'},
      {key:'E', name:'Meddle',      desc:'Orbe de decaimento de vida.'},
      {key:'C', name:'Ruse',        desc:'Fumaças ativáveis mesmo após morrer.'},
      {key:'X', name:'Not Dead Yet',desc:'Revive temporariamente após ser eliminado.'}
    ]
  }
];

/* ---------------------------------------------------------- */

var WEAPONS = [
  {
    name:'Vandal', type:'Rifle', cat:'rifle', emoji:'🔫',
    price:'2900', damage:'160', fireRate:'9.75', magazine:25,
    skins:[
      {name:'Reaver',         rarity:'premium'},
      {name:'Prime',          rarity:'premium'},
      {name:'Glitchpop',      rarity:'ultra'},
      {name:'Champions 2021', rarity:'exclusive'},
      {name:'Oni',            rarity:'premium'}
    ]
  },
  {
    name:'Phantom', type:'Rifle', cat:'rifle', emoji:'🔫',
    price:'2900', damage:'156', fireRate:'11', magazine:30,
    skins:[
      {name:'Ion',         rarity:'premium'},
      {name:'Singularity', rarity:'ultra'},
      {name:'Oni',         rarity:'premium'},
      {name:'Magepunk',    rarity:'deluxe'},
      {name:'Spectrum',    rarity:'ultra'}
    ]
  },
  {
    name:'Operator', type:'Sniper', cat:'sniper', emoji:'🎯',
    price:'4700', damage:'255', fireRate:'0.6', magazine:5,
    skins:[
      {name:'Reaver',     rarity:'premium'},
      {name:'Elderflame', rarity:'ultra'},
      {name:'Prime',      rarity:'premium'},
      {name:'Glitchpop',  rarity:'ultra'}
    ]
  },
  {
    name:'Sheriff', type:'Pistola', cat:'pistol', emoji:'🔫',
    price:'800', damage:'160', fireRate:'4', magazine:6,
    skins:[
      {name:'Aristocrat', rarity:'select'},
      {name:'Luxe',       rarity:'deluxe'},
      {name:'Sakura',     rarity:'select'}
    ]
  },
  {
    name:'Spectre', type:'SMG', cat:'smg', emoji:'🔫',
    price:'1600', damage:'78', fireRate:'13.33', magazine:30,
    skins:[
      {name:'Wasteland', rarity:'select'},
      {name:'Infinity',  rarity:'deluxe'},
      {name:'Magepunk',  rarity:'deluxe'}
    ]
  },
  {
    name:'Bucky', type:'Shotgun', cat:'shotgun', emoji:'🔫',
    price:'850', damage:'88', fireRate:'1.1', magazine:5,
    skins:[
      {name:'Galleria', rarity:'select'},
      {name:'Hivemind', rarity:'deluxe'}
    ]
  },
  {
    name:'Odin', type:'Metralhadora', cat:'heavy', emoji:'🔫',
    price:'3200', damage:'38', fireRate:'12', magazine:100,
    skins:[
      {name:'Glitchpop',                         rarity:'ultra'},
      {name:'Gravitational Uranium Neuroblaster', rarity:'ultra'}
    ]
  },
  {
    name:'Marshal', type:'Sniper', cat:'sniper', emoji:'🎯',
    price:'950', damage:'202', fireRate:'1.5', magazine:5,
    skins:[
      {name:'Transition', rarity:'select'},
      {name:'Depths',     rarity:'deluxe'}
    ]
  },
  {
    name:'Ares', type:'Metralhadora', cat:'heavy', emoji:'🔫',
    price:'1600', damage:'30', fireRate:'13', magazine:50,
    skins:[
      {name:'Spline', rarity:'select'},
      {name:'Surge',  rarity:'deluxe'}
    ]
  },
  {
    name:'Guardian', type:'Rifle', cat:'rifle', emoji:'🔫',
    price:'2250', damage:'195', fireRate:'5.25', magazine:12,
    skins:[
      {name:'Prism',              rarity:'deluxe'},
      {name:'Sentinels of Light', rarity:'ultra'}
    ]
  },
  {
    name:'Bulldog', type:'Rifle', cat:'rifle', emoji:'🔫',
    price:'2100', damage:'116', fireRate:'9.15', magazine:24,
    skins:[
      {name:'Hivemind', rarity:'deluxe'},
      {name:'Sakura',   rarity:'select'}
    ]
  },
  {
    name:'Stinger', type:'SMG', cat:'smg', emoji:'🔫',
    price:'950', damage:'67', fireRate:'18', magazine:20,
    skins:[
      {name:'Spline',   rarity:'select'},
      {name:'Galleria', rarity:'select'}
    ]
  },
  {
    name:'Frenzy', type:'Pistola', cat:'pistol', emoji:'🔫',
    price:'450', damage:'78', fireRate:'13', magazine:13,
    skins:[
      {name:'Glitchpop', rarity:'ultra'},
      {name:'Luxe',      rarity:'deluxe'}
    ]
  },
  {
    name:'Ghost', type:'Pistola', cat:'pistol', emoji:'🔫',
    price:'500', damage:'105', fireRate:'6.75', magazine:15,
    skins:[
      {name:'Reaver', rarity:'premium'},
      {name:'Ion',    rarity:'premium'}
    ]
  },
  {
    name:'Classic', type:'Pistola', cat:'pistol', emoji:'🔫',
    price:'0', damage:'78', fireRate:'6.75', magazine:12,
    skins:[
      {name:'Aristocrat', rarity:'select'},
      {name:'Surge',      rarity:'deluxe'}
    ]
  },
  {
    name:'Judge', type:'Shotgun', cat:'shotgun', emoji:'🔫',
    price:'1850', damage:'69', fireRate:'3.5', magazine:7,
    skins:[
      {name:'Glitchpop', rarity:'ultra'},
      {name:'Magepunk',  rarity:'deluxe'}
    ]
  }
];

/* ---------------------------------------------------------- */

var LB = [
  {name:'admin',      rank:1, rankLabel:'Radiante', agent:'Jett',  emoji:'🌪️', kd:2.4, score:9999},
  {name:'Player2',    rank:2, rankLabel:'Imortal',  agent:'Reyna', emoji:'👁️', kd:1.8, score:8500},
  {name:'JettMain',   rank:3, rankLabel:'Imortal',  agent:'Jett',  emoji:'🌪️', kd:1.9, score:8200},
  {name:'SagePro',    rank:4, rankLabel:'Diamante', agent:'Sage',  emoji:'🌿', kd:1.5, score:7800},
  {name:'OmenGod',    rank:5, rankLabel:'Diamante', agent:'Omen',  emoji:'👁️‍🗨️', kd:1.7, score:7500},
  {name:'ViperQueen', rank:6, rankLabel:'Platina',  agent:'Viper', emoji:'☠️', kd:1.4, score:7000},
  {name:'SovaHawk',   rank:7, rankLabel:'Platina',  agent:'Sova',  emoji:'🏹', kd:1.6, score:6800},
  {name:'NeonSpeed',  rank:8, rankLabel:'Ouro',     agent:'Neon',  emoji:'⚡', kd:1.3, score:6500}
];

/* ---------------------------------------------------------- */

var NOTIFS = [
  {user:'JettMain',   action:'curtiu seu post',          type:'like',    time:'5m',  unread:true},
  {user:'SagePro',    action:'comentou: "Boa jogada!"',  type:'comment', time:'1h',  unread:true},
  {user:'OmenGod',    action:'começou a seguir você',    type:'follow',  time:'2h',  unread:false},
  {user:'ViperQueen', action:'curtiu seu post',          type:'like',    time:'3h',  unread:false}
];

/* ---------------------------------------------------------- */

var TRENDING = [
  {tag:'#Vandal',   count:'12k'},
  {tag:'#JettNerf', count:'8k'},
  {tag:'#VCT2025',  count:'6k'},
  {tag:'#Phantom',  count:'5k'},
  {tag:'#Radiante', count:'4k'}
];

/* ---------------------------------------------------------- */

var MAPS = [
  {name:'Ascent',   emoji:'🏛️', desc:'Mapa italiano com mid aberto'},
  {name:'Bind',     emoji:'🏜️', desc:'Teleportes únicos sem mid'},
  {name:'Haven',    emoji:'⛩️', desc:'Único mapa com 3 bombsites'},
  {name:'Split',    emoji:'🏙️', desc:'Mapa vertical com muros'},
  {name:'Icebox',   emoji:'🧊', desc:'Mapa ártico com ziplines'},
  {name:'Breeze',   emoji:'🏝️', desc:'Espaços abertos e longas distâncias'},
  {name:'Fracture', emoji:'⚗️', desc:'Formato H único'},
  {name:'Pearl',    emoji:'🌊', desc:'Cidade subaquática'},
  {name:'Lotus',    emoji:'🪷', desc:'Ruínas antigas com 3 sites'},
  {name:'Sunset',   emoji:'🌅', desc:'Los Angeles com portões'},
  {name:'Abyss',    emoji:'🌌', desc:'Sem bordas — cuidado com as quedas!'}
];

/* ---------------------------------------------------------- */

var CLIPS = [
  {title:'Ace com Jett',     views:'12k', img:'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300'},
  {title:'1v5 Clutch',       views:'8k',  img:'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300'},
  {title:'Operator Montage', views:'5k',  img:'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300'},
  {title:'Reyna Highlight',  views:'3k',  img:'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300'},
  {title:'Sage Wall Save',   views:'2k',  img:'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300'},
  {title:'Neon Speedrun',    views:'1.5k',img:'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=300'}
];

/* ============================================================
   SISTEMA DE SEGUIDORES
   ============================================================ */

var SOCIAL = (function () {
  var s = localStorage.getItem('vh_social');
  if (s) { try { return JSON.parse(s); } catch (e) {} }
  return {};
})();

function saveSocial() {
  localStorage.setItem('vh_social', JSON.stringify(SOCIAL));
}

function ensureUser(username) {
  if (!SOCIAL[username]) {
    SOCIAL[username] = { following: [], followers: [] };
  }
}

function isFollowing(me, target) {
  ensureUser(me);
  return SOCIAL[me].following.indexOf(target) !== -1;
}

function followUser(me, target) {
  ensureUser(me);
  ensureUser(target);
  // Evita duplicatas
  if (SOCIAL[me].following.indexOf(target) === -1) {
    SOCIAL[me].following.push(target);
  }
  if (SOCIAL[target].followers.indexOf(me) === -1) {
    SOCIAL[target].followers.push(me);
  }
  saveSocial();
}

function unfollowUser(me, target) {
  ensureUser(me);
  ensureUser(target);
  SOCIAL[me].following     = SOCIAL[me].following.filter(function (u) { return u !== target; });
  SOCIAL[target].followers = SOCIAL[target].followers.filter(function (u) { return u !== me; });
  saveSocial();
}

function getFollowingCount(username) {
  ensureUser(username);
  return SOCIAL[username].following.length;
}

function getFollowersCount(username) {
  ensureUser(username);
  return SOCIAL[username].followers.length;
}
