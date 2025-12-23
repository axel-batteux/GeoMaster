// Game State
let currentState = {
    mode: null,         // 'flags', 'capitals', 'map', 'code', 'prefecture', 'prefecture-inverse', 'capitals-standard', 'capitals-inverse'
    region: 'world',    // 'world', 'france', 'usa'
    difficulty: 2,
    score: 0,
    round: 0,
    maxRounds: 10,
    currentQuestion: null,
    isAnswering: false,
    dataset: [],
    questionQueue: [],
    streak: 0,
    timerValue: 15,
    timerInterval: null,
    highScore: 0,
    survivalMode: false,
    continent: 'all',
    currentRoundMode: null
};

// Map Instance
let map = null;
let geoJsonLayer = null;

// UI Cache
let ui = {};

// GeoJSON URLs
const geoJsonUrls = {
    world: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json',
    france: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson',
    usa: 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
};

// --- DEFINITIVE TRANSLATION MAP (English GeoJSON -> French Data Name) ---
// Keys must be lowercased and normalized (no accents)
const nameMapping = {
    // Europe
    "united kingdom": "royaume-uni",
    "great britain": "royaume-uni",
    "germany": "allemagne",
    "spain": "espagne",
    "italy": "italie",
    "netherlands": "pays-bas",
    "the netherlands": "pays-bas",
    "greece": "grece",
    "sweden": "suede",
    "norway": "norvege",
    "poland": "pologne",
    "austria": "autriche",
    "switzerland": "suisse",
    "belgium": "belgique",
    "denmark": "danemark",
    "finland": "finlande",
    "ireland": "irlande",
    "hungary": "hongrie",
    "czech republic": "republique tcheque",
    "czechia": "republique tcheque",
    "romania": "roumanie",
    "slovakia": "slovaquie",
    "slovenia": "slovenie",
    "croatia": "croatie",
    "bosnia and herzegovina": "bosnie-herzegovine",
    "serbia": "serbie",
    "republic of serbia": "serbie",
    "montenegro": "montenegro",
    "albania": "albanie",
    "macedonia": "macedoine du nord",
    "north macedonia": "macedoine du nord",
    "the former yugoslav republic of macedonia": "macedoine du nord",
    "bulgaria": "bulgarie",
    "cyprus": "chypre",
    "iceland": "islande",
    "estonia": "estonie",
    "latvia": "lettonie",
    "lithuania": "lituanie",
    "moldova": "moldavie",
    "belarus": "bielorussie",
    "byelarus": "bielorussie",
    "ukraine": "ukraine",
    "russia": "russie",
    "turkey": "turquie",

    // Asie
    "china": "chine",
    "japan": "japon",
    "south korea": "coree du sud",
    "republic of korea": "coree du sud",
    "north korea": "coree du nord",
    "democratic people's republic of korea": "coree du nord",
    "india": "inde",
    "thailand": "thailande",
    "vietnam": "vietnam",
    "cambodia": "cambodge",
    "laos": "laos",
    "myanmar": "birmanie (myanmar)",
    "burma": "birmanie (myanmar)",
    "malaysia": "malaisie",
    "singapore": "singapour",
    "indonesia": "indonesie",
    "philippines": "philippines",
    "mongolia": "mongolie",
    "kazakhstan": "kazakhstan",
    "uzbekistan": "ouzbekistan",
    "turkmenistan": "turkmenistan",
    "kyrgyzstan": "kirghizistan",
    "tajikistan": "tadjikistan",
    "afghanistan": "afghanistan",
    "pakistan": "pakistan",
    "iran": "iran",
    "iraq": "irak",
    "syria": "syrie",
    "lebanon": "liban",
    "israel": "israel",
    "jordan": "jordanie",
    "saudi arabia": "arabie saoudite",
    "yemen": "yemen",
    "oman": "oman",
    "united arab emirates": "emirats arabes unis",
    "qatar": "qatar",
    "bahrain": "bahrein",
    "kuwait": "koweit",
    "armenia": "armenie",
    "georgia": "georgie",
    "azerbaijan": "azerbaidjan",
    "timor-leste": "timor oriental",
    "east timor": "timor oriental",

    // Afrique
    "morocco": "maroc",
    "algeria": "algerie",
    "tunisia": "tunisie",
    "libya": "libye",
    "egypt": "egypte",
    "mauritania": "mauritanie",
    "mali": "mali",
    "niger": "niger",
    "chad": "tchad",
    "sudan": "soudan",
    "south sudan": "soudan du sud",
    "eritrea": "erythree",
    "ethiopia": "ethiopie",
    "somalia": "somalie",
    "djibouti": "djibouti",
    "senegal": "senegal",
    "gambia": "gambie",
    "guinea": "guinee",
    "guinea-bissau": "guinee-bissau",
    "sierra leone": "sierra leone",
    "liberia": "liberia",
    "ivory coast": "cote d'ivoire",
    "cote d'ivoire": "cote d'ivoire",
    "ghana": "ghana",
    "togo": "togo",
    "benin": "benin",
    "nigeria": "nigeria",
    "cameroon": "cameroun",
    "central african republic": "republique centrafricaine",
    "equatorial guinea": "guinee equatoriale",
    "gabon": "gabon",
    "congo": "congo",
    "republic of the congo": "congo",
    "democratic republic of the congo": "republique democratique du congo",
    "dr congo": "republique democratique du congo",
    "uganda": "ouganda",
    "kenya": "kenya",
    "tanzania": "tanzanie",
    "united republic of tanzania": "tanzanie",
    "rwanda": "rwanda",
    "burundi": "burundi",
    "angola": "angola",
    "zambia": "zambie",
    "malawi": "malawi",
    "mozambique": "mozambique",
    "zimbabwe": "zimbabwe",
    "botswana": "botswana",
    "namibia": "namibie",
    "south africa": "afrique du sud",
    "lesotho": "lesotho",
    "eswatini": "eswatini",
    "swaziland": "eswatini",
    "madagascar": "madagascar",
    "mauritius": "maurice",
    "seychelles": "seychelles",
    "comoros": "comores",
    "cape verde": "cap-vert",

    // Amériques
    "united states of america": "etats-unis",
    "united states": "etats-unis",
    "usa": "etats-unis",
    "canada": "canada",
    "mexico": "mexique",
    "guatemala": "guatemala",
    "belize": "belize",
    "el salvador": "salvador",
    "honduras": "honduras",
    "nicaragua": "nicaragua",
    "costa rica": "costa rica",
    "panama": "panama",
    "cuba": "cuba",
    "jamaica": "jamaique",
    "haiti": "haiti",
    "dominican republic": "republique dominicaine",
    "bahamas": "bahamas",
    "colombia": "colombie",
    "venezuela": "venezuela",
    "guyana": "guyana",
    "suriname": "suriname",
    "ecuador": "equateur",
    "peru": "perou",
    "brazil": "bresil",
    "bolivia": "bolivie",
    "paraguay": "paraguay",
    "chile": "chili",
    "argentina": "argentine",
    "uruguay": "uruguay",
    "trinidad and tobago": "trinite-et-tobago",

    // Océanie
    "australia": "australie",
    "new zealand": "nouvelle-zelande",
    "papua new guinea": "papouasie-nouvelle-guinee",
    "fiji": "fidji",
    "solomon islands": "iles salomon",
    "vanuatu": "vanuatu",
    "micronesia": "micronesie",
    "kiribati": "kiribati",
    "marshall islands": "iles marshall",
    "palau": "palaos",
    "nauru": "nauru",
    "samoa": "samoa",
    "tonga": "tonga",
    "tuvalu": "tuvalu",

    // USA States (GeoJSON Name -> Data Name)
    "alabama": "alabama",
    "alaska": "alaska",
    "arizona": "arizona",
    "arkansas": "arkansas",
    "california": "californie",
    "colorado": "colorado",
    "connecticut": "connecticut",
    "delaware": "delaware",
    "florida": "floride",
    "georgia": "georgie",
    "hawaii": "hawai",
    "idaho": "idaho",
    "illinois": "illinois",
    "indiana": "indiana",
    "iowa": "iowa",
    "kansas": "kansas",
    "kentucky": "kentucky",
    "louisiana": "louisiane",
    "maine": "maine",
    "maryland": "maryland",
    "massachusetts": "massachusetts",
    "michigan": "michigan",
    "minnesota": "minnesota",
    "mississippi": "mississippi",
    "missouri": "missouri",
    "montana": "montana",
    "nebraska": "nebraska",
    "nevada": "nevada",
    "new hampshire": "new hampshire",
    "new jersey": "new jersey",
    "new mexico": "nouveau-mexique",
    "new york": "new york",
    "north carolina": "caroline du nord",
    "north dakota": "dakota du nord",
    "ohio": "ohio",
    "oklahoma": "oklahoma",
    "oregon": "oregon",
    "pennsylvania": "pennsylvanie",
    "rhode island": "rhode island",
    "south carolina": "caroline du sud",
    "south dakota": "dakota du sud",
    "tennessee": "tennessee",
    "texas": "texas",
    "utah": "utah",
    "vermont": "vermont",
    "virginia": "virginie",
    "washington": "washington",
    "west virginia": "virginie-occidentale",
    "wisconsin": "wisconsin",
    "wyoming": "wyoming",
    "district of columbia": "district de columbia"
};

const continentBounds = {
    "Europe": [[35, -20], [72, 45]],
    "Asie": [[-10, 35], [75, 180]], // Widened for Indonesia/Japan
    "Afrique": [[-35, -20], [38, 55]],
    "Amériques": [[-56, -160], [75, -30]], // Widened West
    "Océanie": [[-50, 110], [10, 180]]
};


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    if (darkModeBtn) {
        if (localStorage.getItem('geoMaster_darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
        darkModeBtn.addEventListener('click', toggleDarkMode);
    }

    if (document.getElementById('menu-screen')) {
        initMenuPage();
    } else if (document.getElementById('game-screen')) {
        initGamePage();
    }
});

// --- MENU PAGE LOGIC ---
function initMenuPage() {
    ui = {};
    setRegion('world');
    loadHighScore();

    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (selectedMode) launchGame(selectedMode);
        });
    }
}

function launchGame(mode) {
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('region', currentState.region);

    const diffSelect = document.getElementById('difficulty-select');
    if (diffSelect) params.set('difficulty', diffSelect.value);

    const countSelect = document.getElementById('question-count-select');
    if (countSelect) params.set('count', countSelect.value);

    const continentSelect = document.getElementById('continent-select');
    if (continentSelect) params.set('continent', continentSelect.value);

    const survivalCheckbox = document.getElementById('survival-mode');
    if (survivalCheckbox) params.set('survival', survivalCheckbox.checked);

    window.location.href = `game.html?${params.toString()}`;
}

// --- MULTIPLAYER LOGIC (V17 SAFE) ---
let socket = null;
let mpPersistentId = null;

function initSocket() {
    if (typeof io === 'undefined') return; // Safety check if socket.io not loaded
    if (socket) return;
    socket = io();

    socket.on('connect', () => {
        console.log("Connected to server");
    });

    socket.on('room_created', (code) => {
        // Auto-join as host
        joinRoomLogic(code);
    });

    socket.on('joined_room', (data) => {
        mpPersistentId = data.persistentId;
        sessionStorage.setItem('mp_pid', mpPersistentId);
        sessionStorage.setItem('mp_room', data.code);

        document.getElementById('multiplayer-menu').classList.add('hidden');
        document.getElementById('menu-screen').style.display = 'none'; // Hack to hide menu
        document.getElementById('lobby-screen').classList.remove('hidden');
        document.getElementById('lobby-room-code').innerText = data.code;

        if (data.isHost) {
            document.getElementById('host-controls').classList.remove('hidden');
            document.getElementById('guest-msg').classList.add('hidden');
        } else {
            document.getElementById('host-controls').classList.add('hidden');
            document.getElementById('guest-msg').classList.remove('hidden');
        }
    });

    socket.on('update_lobby', (players) => {
        const list = document.getElementById('lobby-player-list');
        if (list) {
            list.innerHTML = players.map(p => `
                <li style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between;">
                    <strong>${p.name}</strong>
                    <span>${p.persistentId === mpPersistentId ? '(Vous)' : ''}</span>
                </li>
            `).join('');
        }
    });

    socket.on('game_start_signal', () => {
        // Redirect everyone to Game Page
        window.location.href = `game.html?mode=multiplayer&room=${sessionStorage.getItem('mp_room')}`;
    });

    // GAME EVENTS (Only processed if on game page)
    if (window.location.pathname.includes('game.html')) {
        setupGameSocketEvents();
    }
}

function showMultiplayerMenu() {
    initSocket();
    document.getElementById('menu-content').classList.add('hidden'); // Hide main menu content
    document.getElementById('multiplayer-menu').classList.remove('hidden');
}

function showMainMenu() {
    document.getElementById('multiplayer-menu').classList.add('hidden');
    document.getElementById('menu-content').classList.remove('hidden');
}

function mpCreateRoom() {
    const name = prompt("Votre pseudo ?") || "Hôte";
    sessionStorage.setItem('mp_name', name);
    socket.emit('create_room', { playerName: name });
}

function mpJoinRoom() {
    const code = document.getElementById('room-code-input').value;
    if (!code) return alert("Entrez un code !");
    joinRoomLogic(code);
}

function joinRoomLogic(code) {
    const name = sessionStorage.getItem('mp_name') || prompt("Votre pseudo ?") || "Joueur";
    sessionStorage.setItem('mp_name', name);
    // Send persistent ID if exists to reconnect
    const pid = sessionStorage.getItem('mp_pid');
    socket.emit('join_room', { code, playerName: name, persistentId: pid });
}

function mpSignalStart() {
    const code = sessionStorage.getItem('mp_room');
    socket.emit('start_game_request', code);
}

// --- GAME PAGE SOCKET LOGIC ---
function setupGameSocketEvents() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') !== 'multiplayer') return;

    const code = sessionStorage.getItem('mp_room');
    const pid = sessionStorage.getItem('mp_pid');

    // Reconnect
    socket.emit('reconnect_game', { code, persistentId: pid });

    socket.on('next_question', (data) => {
        // data.index is 0-195
        // Map to World Dataset
        let qIndex = data.index % datasets.world.length;
        const qData = datasets.world[qIndex];

        currentState.mode = 'map'; // Force MAP mode for MP
        currentState.region = 'world'; // Force WORLD for MP

        currentState.currentQuestion = qData;
        currentState.isAnswering = false;
        renderQuestion(qData);
        startTimer();
    });

    socket.on('update_scores', (players) => {
        // Update Leaderboard overlay? 
        // For V1, just log or simple alert?
        // Let's replace the "Streak" with "Rank" maybe? 
        console.log("Leaderboard updated", players);
    });
}

// --- GAME PAGE LOGIC ---
function initGamePage() {
    ui = {
        questionText: document.getElementById('question-text'),
        questionContent: document.getElementById('question-content'),
        optionsGrid: document.getElementById('options-grid'),
        mapContainer: document.getElementById('map-container'),
        gameHeader: document.getElementById('game-header'),
        currentScore: document.getElementById('current-score'),
        totalQuestions: document.getElementById('total-questions'),
        exitBtn: document.getElementById('exit-btn'),
        feedbackOverlay: document.getElementById('feedback-overlay'),
        feedbackIcon: document.getElementById('feedback-icon'),
        feedbackMessage: document.getElementById('feedback-message'),
        timer: document.getElementById('timer'),
        streak: document.getElementById('streak-counter')
    };

    if (ui.exitBtn) {
        ui.exitBtn.addEventListener('click', () => {
            if (confirm("Quitter la partie ?")) window.location.href = 'index.html';
        });
    }

    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) retryBtn.addEventListener('click', () => window.location.reload());

    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) homeBtn.addEventListener('click', () => window.location.href = 'index.html');

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    if (!mode) {
        alert("Données de jeu manquantes. Retour au menu.");
        window.location.href = 'index.html';
        return;
    }

    currentState.mode = mode;
    currentState.region = urlParams.get('region') || 'world';
    currentState.difficulty = parseInt(urlParams.get('difficulty')) || 2;
    currentState.continent = urlParams.get('continent') || 'all';
    currentState.survivalMode = urlParams.get('survival') === 'true';

    const countVal = urlParams.get('count') || '10';
    if (countVal === 'infinite') currentState.maxRounds = Infinity;
    else if (countVal === 'all') currentState.maxRounds = 9999;
    else currentState.maxRounds = parseInt(countVal);

    console.log("Starting Game with State:", currentState);

    startGameLogic();
}

async function startGameLogic() {
    try {
        currentState.score = 0;
        currentState.round = 0;
        currentState.streak = 0;

        if (currentState.region === 'world') {
            const rawData = datasets.world;
            let filtered = rawData;

            if (currentState.continent !== 'all') {
                filtered = filtered.filter(c => c.continent === currentState.continent);
            }

            if (currentState.difficulty === 1) {
                currentState.dataset = filtered.filter(c => c.tier === 1);
            } else if (currentState.difficulty === 2) {
                currentState.dataset = filtered.filter(c => (c.tier || 2) <= 2);
            } else {
                currentState.dataset = filtered;
            }
        } else if (currentState.region === 'france') {
            currentState.dataset = datasets.france;
        } else {
            currentState.dataset = datasets.usa;
        }

        if (!currentState.dataset || currentState.dataset.length === 0) {
            alert("Erreur: Aucune donnée disponible pour ces paramètres.");
            return;
        }

        if (currentState.maxRounds !== Infinity) {
            if (currentState.maxRounds > currentState.dataset.length) {
                currentState.maxRounds = currentState.dataset.length;
            }
        }
        if (currentState.maxRounds === 9999) currentState.maxRounds = currentState.dataset.length;

        currentState.questionQueue = [...currentState.dataset].sort(() => 0.5 - Math.random());

        if (ui.currentScore) ui.currentScore.innerText = 0;
        if (ui.totalQuestions) ui.totalQuestions.innerText = currentState.maxRounds === Infinity ? '∞' : currentState.maxRounds;
        updateStreakDisplay();

        if (ui.gameHeader) {
            ui.gameHeader.classList.remove('hidden');
            ui.gameHeader.style.display = 'flex';
        }

        if (currentState.mode === 'map') {
            ui.optionsGrid.classList.add('hidden');
            ui.mapContainer.classList.remove('hidden');
            initMap();
        } else {
            ui.optionsGrid.classList.remove('hidden');
            ui.mapContainer.classList.add('hidden');
        }

        nextQuestion();

    } catch (e) {
        console.error("Game Start Error", e);
        alert("Erreur au démarrage du jeu.");
    }
}

// --- MENU HELPERS ---
function setRegion(region) {
    currentState.region = region;
    const rWorld = document.getElementById('region-world');
    const rFrance = document.getElementById('region-france');
    const rUsa = document.getElementById('region-usa');

    if (rWorld) rWorld.classList.toggle('active', region === 'world');
    if (rFrance) rFrance.classList.toggle('active', region === 'france');
    if (rUsa) rUsa.classList.toggle('active', region === 'usa');

    const grpDiff = document.getElementById('group-difficulty');
    const grpCont = document.getElementById('continent-row');
    const isWorld = region === 'world';

    if (grpDiff) grpDiff.style.display = isWorld ? 'flex' : 'none';
    if (grpCont) grpCont.style.display = isWorld ? 'flex' : 'none';

    const btnMode4 = document.getElementById('btn-mode-4');
    if (btnMode4) btnMode4.style.display = region === 'france' ? 'flex' : 'none';

    selectMode(null);

    // V13+ Mode Labels
    if (region === 'world') {
        updateModeButton(1, '🏳️', 'Drapeaux');
        updateModeButton(2, '🏛️', 'Capitales');
        updateModeButton(3, '🗺️', 'Localisation');
    } else if (region === 'usa') {
        updateModeButton(1, '🏛️', 'Capitales');
        updateModeButton(2, '🔄', 'Inversé');
        updateModeButton(3, '🗺️', 'Localisation');
    } else {
        updateModeButton(1, '#️⃣', 'Codes');
        updateModeButton(2, '🏢', 'Préfectures');
        updateModeButton(3, '🗺️', 'Localisation');
    }
}

function updateModeButton(index, icon, label) {
    const iconEl = document.getElementById(`icon-mode-${index}`);
    if (iconEl) {
        iconEl.innerText = icon;
        document.getElementById(`label-mode-${index}`).innerText = label;
    }
}

let selectedMode = null;
function handleModeClick(indexOrMode) {
    let internalMode = '';

    // Logic for internalMode mapping
    if (indexOrMode === 'mixed') {
        internalMode = 'mixed';
    } else {
        if (currentState.region === 'world') {
            if (indexOrMode === 1) internalMode = 'flags';
            if (indexOrMode === 2) internalMode = 'capitals';
            if (indexOrMode === 3) internalMode = 'map';
        } else if (currentState.region === 'usa') {
            if (indexOrMode === 1) internalMode = 'capitals-standard';
            if (indexOrMode === 2) internalMode = 'capitals-inverse';
            if (indexOrMode === 3) internalMode = 'map';
        } else {
            if (indexOrMode === 1) internalMode = 'code';
            if (indexOrMode === 2) internalMode = 'prefecture';
            if (indexOrMode === 3) internalMode = 'map';
            if (indexOrMode === 4) internalMode = 'prefecture-inverse';
        }
    }

    selectMode(indexOrMode, internalMode);
}

function selectMode(cardId, internalMode) {
    document.querySelectorAll('.mode-card').forEach(el => el.classList.remove('selected'));
    selectedMode = internalMode;

    const startBtn = document.getElementById('start-game-btn');
    if (internalMode) {
        let elId = typeof cardId === 'string' ? `btn-mode-${cardId}` : `btn-mode-${cardId}`;
        const card = document.getElementById(elId);
        if (card) card.classList.add('selected');

        if (startBtn) {
            startBtn.classList.remove('disabled');
            startBtn.disabled = false;
            startBtn.innerHTML = `COMMENCER 🚀`;
        }
    } else {
        if (startBtn) {
            startBtn.classList.add('disabled');
            startBtn.disabled = true;
            startBtn.innerHTML = `CHOISISSEZ UN MODE<br><span style="font-size: 0.8em; font-weight: 400;">pour commencer</span>`;
        }
    }
}

// --- GAME LOGIC ---
function nextQuestion() {
    try {
        if (currentState.round >= currentState.maxRounds) {
            endGame();
            return;
        }

        if (currentState.questionQueue.length === 0) {
            if (currentState.maxRounds === Infinity) {
                currentState.questionQueue = [...currentState.dataset].sort(() => 0.5 - Math.random());
            } else {
                endGame();
                return;
            }
        }

        currentState.round++;
        currentState.isAnswering = false;

        if (ui.feedbackOverlay) ui.feedbackOverlay.classList.add('hidden');

        const country = currentState.questionQueue.pop();
        currentState.currentQuestion = country;

        renderQuestion(country);
        startTimer();
    } catch (e) {
        console.error("Next Question Error", e);
    }
}

function renderQuestion(country) {
    ui.questionContent.innerHTML = '';
    let effectiveMode = currentState.mode;

    if (!['world', 'france', 'usa'].includes(currentState.region)) currentState.region = 'world';

    if (currentState.mode === 'mixed') {
        const modesWorld = ['flags', 'capitals', 'map'];
        const modesUsa = ['capitals-standard', 'capitals-inverse', 'map'];
        const modesFr = ['code', 'prefecture', 'map', 'prefecture-inverse'];

        let pool = [];
        if (currentState.region === 'world') pool = modesWorld;
        else if (currentState.region === 'usa') pool = modesUsa;
        else pool = modesFr;

        effectiveMode = pool[Math.floor(Math.random() * pool.length)];
        currentState.currentRoundMode = effectiveMode;
    } else {
        currentState.currentRoundMode = currentState.mode;
    }

    if (currentState.region === 'usa' && (effectiveMode === 'code' || effectiveMode === 'prefecture')) {
        effectiveMode = 'capitals-standard';
        currentState.currentRoundMode = 'capitals-standard';
    }

    console.log("Render Mode:", effectiveMode);
    let qText = '';

    // -- FLAGS --
    if (effectiveMode === 'flags') {
        if (currentState.region === 'usa') qText = "De quel État est ce drapeau ?";
        else qText = "De quel pays est ce drapeau ?";

        if (!country.flag) {
            effectiveMode = 'capitals-standard';
            currentState.currentRoundMode = 'capitals-standard';
            qText = `Quelle est la capitale de : ${country.name} ?`;
            generateOptions(country, 'capital');
        } else {
            ui.questionContent.innerHTML = `<img src="${country.flag}" alt="Drapeau" style="max-height:150px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">`;
            generateOptions(country, 'name');
        }
    }
    // -- CAPITALS (Std) --
    else if (effectiveMode === 'capitals-standard') {
        ui.questionContent.innerHTML = '';
        qText = `Quelle est la capitale de : ${country.name} ?`;
        generateOptions(country, 'capital');
    }
    // -- CAPITALS (Inv) --
    else if (effectiveMode === 'capitals-inverse') {
        ui.questionContent.innerHTML = '';
        const isUSA = currentState.region === 'usa';
        qText = `${country.capital} est la capitale de quel ${isUSA ? 'État' : 'pays'} ?`;
        generateOptions(country, 'name');
    }
    // -- CAPITALS (Mixed/Legacy) --
    else if (effectiveMode === 'capitals') {
        ui.questionContent.innerHTML = '';
        if (Math.random() > 0.5) {
            qText = `Quelle est la capitale de : ${country.name} ?`;
            generateOptions(country, 'capital');
        } else {
            qText = `${country.capital} est la capitale de quel pays ?`;
            generateOptions(country, 'name');
        }
    }
    // -- MAP (V14 GeoJSON) --
    else if (effectiveMode === 'map') {
        ui.questionContent.innerHTML = '';
        qText = `Situez la zone sur la carte : ${country.name}`;
        ui.optionsGrid.classList.add('hidden');
        ui.mapContainer.classList.remove('hidden');
        initMap();
        resetMap();
    }
    // -- CODE --
    else if (effectiveMode === 'code') {
        ui.questionContent.innerHTML = '';
        qText = `Quel est le numéro du département : ${country.name} ?`;
        generateOptions(country, 'code');
    }
    // -- PREFECTURE --
    else if (effectiveMode === 'prefecture') {
        ui.questionContent.innerHTML = '';
        qText = `Quelle est la préfecture de : ${country.name} ?`;
        generateOptions(country, 'prefecture');
    }
    // -- PREFECTURE INV --
    else if (effectiveMode === 'prefecture-inverse') {
        ui.questionContent.innerHTML = '';
        qText = `De quel département ${country.prefecture} est-elle la préfecture ?`;
        generateOptions(country, 'name');
    }

    if (effectiveMode !== 'map') {
        ui.optionsGrid.classList.remove('hidden');
        ui.mapContainer.classList.add('hidden');
    }

    ui.questionText.innerText = qText;
}

function generateOptions(correctCountry, property) {
    ui.optionsGrid.innerHTML = '';
    const correctValue = correctCountry[property];
    let options = [correctValue];

    let pool = currentState.dataset.filter(c => c.name !== correctCountry.name);
    while (options.length < 4 && pool.length > 0) {
        const randIndex = Math.floor(Math.random() * pool.length);
        const wrongC = pool.splice(randIndex, 1)[0];
        const val = wrongC[property];
        if (!options.includes(val) && val) options.push(val);
    }
    options.sort(() => 0.5 - Math.random());

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opt;
        btn.onclick = () => handleAnswer(opt, correctValue, btn);
        ui.optionsGrid.appendChild(btn);
    });
}

function handleAnswer(selected, correct, btnElement) {
    if (currentState.isAnswering) return;
    currentState.isAnswering = true;
    stopTimer();

    const isCorrect = selected === correct;
    if (isCorrect) {
        currentState.score++;
        currentState.streak++;
        ui.currentScore.innerText = currentState.score;
        btnElement.classList.add('correct');
        try { playSound('correct'); } catch (e) { }
    } else {
        currentState.streak = 0;
        btnElement.classList.add('wrong');
        try { playSound('wrong'); } catch (e) { }
        highlightCorrectOption(correct);
    }
    updateStreakDisplay();
    setTimeout(nextQuestion, 1000);
}

function highlightCorrectOption(correctValue) {
    const buttons = ui.optionsGrid.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.innerText === correctValue) {
            btn.classList.add('correct');
            btn.style.backgroundColor = '#10b981';
        }
    });
}

// --- V14 MAP LOGIC ---
function initMap() {
    if (map) return;

    map = L.map('map-container', {
        zoomControl: true,
        attributionControl: false,
        zoomSnap: 0.1
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    loadGeoJSON(currentState.region);
}

function resetMap() {
    if (map) {
        if (geoJsonLayer && geoJsonLayer.options.region !== currentState.region) {
            map.removeLayer(geoJsonLayer);
            loadGeoJSON(currentState.region);
        } else if (geoJsonLayer) {
            geoJsonLayer.resetStyle();
        } else {
            loadGeoJSON(currentState.region);
        }
    }
}

async function loadGeoJSON(region) {
    ui.mapContainer.classList.add('loading');
    try {
        const url = geoJsonUrls[region];
        if (!url) throw new Error("No URL for region");

        const response = await fetch(url);
        if (!response.ok) throw new Error("GeoJSON Load Failed");
        const data = await response.json();

        if (geoJsonLayer) map.removeLayer(geoJsonLayer);

        geoJsonLayer = L.geoJSON(data, {
            style: {
                fillColor: '#ffffff',
                weight: 1,
                opacity: 1,
                color: '#cccccc',
                dashArray: '3',
                fillOpacity: 0.2
            },
            onEachFeature: onEachFeature,
            region: region
        }).addTo(map);

        // Initial Zoom Logic with Continent Awareness
        if (currentState.region === 'world' && continentBounds[currentState.continent]) {
            console.log("Fitting bounds for continent:", currentState.continent);
            map.fitBounds(continentBounds[currentState.continent], { padding: [10, 10] });
        } else {
            const bounds = geoJsonLayer.getBounds();
            map.fitBounds(bounds, { padding: [20, 20] });
        }

    } catch (e) {
        console.error("Map Load Error", e);
    } finally {
        ui.mapContainer.classList.remove('loading');
    }
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: (e) => {
            if (currentState.isAnswering) return;
            const l = e.target;
            l.setStyle({ weight: 2, color: '#666', fillOpacity: 0.5 });
            l.bringToFront();
        },
        mouseout: (e) => {
            if (currentState.isAnswering) return;
            geoJsonLayer.resetStyle(e.target);
        },
        click: (e) => onFeatureClick(e, feature, layer)
    });
}

function onFeatureClick(e, feature, layer) {
    if (currentState.isAnswering) return;
    currentState.isAnswering = true;
    stopTimer();

    const target = currentState.currentQuestion;
    const isCorrect = checkMapAnswer(feature, target);

    if (isCorrect) {
        layer.setStyle({ fillColor: '#10b981', color: '#059669', fillOpacity: 0.8 }); // Green
        currentState.score++;
        currentState.streak++;
        try { playSound('correct'); } catch (e) { }
    } else {
        layer.setStyle({ fillColor: '#ef4444', color: '#b91c1c', fillOpacity: 0.8 }); // Red
        currentState.streak = 0;
        try { playSound('wrong'); } catch (e) { }
        highlightCorrectRegion(target);
    }

    ui.currentScore.innerText = currentState.score;
    updateStreakDisplay();
    setTimeout(nextQuestion, 1500);
}

// --- CHECK ANSWER LOGIC (Stricter but exhaustive) ---
function checkMapAnswer(feature, target) {
    // 1. France: Strict Check on Code
    if (currentState.region === 'france') {
        const fCode = feature.properties.code;
        const tCode = target.code;
        if (fCode && tCode && fCode == tCode) return true;
    }

    // 2. Normalization
    const norm = (str) => str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    const p = feature.properties;
    // Check all possible name properties in GeoJSON (USA often uses NAME or NAME_1)
    const possibleNames = [
        p.name, p.nom, p.admin, p.sovereignt, p.formal_en, p.name_long, p.NAME, p.NAME_1, p.st_nm
    ].map(n => norm(n || ""));

    const tName = norm(target.name);

    // 3. Strict Match loop
    if (possibleNames.includes(tName)) return true;

    // 4. Translation Match loop
    for (const name of possibleNames) {
        if (nameMapping[name] === tName) return true;
    }

    console.log(`Mismatch: Geo([${possibleNames.join(", ")}]) vs Target "${tName}"`);
    return false;
}

function highlightCorrectRegion(target) {
    if (!geoJsonLayer) return;
    geoJsonLayer.eachLayer(layer => {
        // EXACT same logic
        if (checkMapAnswer(layer.feature, target)) {
            layer.setStyle({ fillColor: '#10b981', color: '#059669', fillOpacity: 0.8 });
            layer.bringToFront();
        }
    });
}

// --- TIMER & UTILS ---
function startTimer() {
    stopTimer();
    // Timer disabled
    if (ui.timer) ui.timer.innerText = `♾️`;
}

function stopTimer() {
    if (currentState.timerInterval) {
        clearInterval(currentState.timerInterval);
        currentState.timerInterval = null;
    }
}

function handleTimeout() {
    stopTimer();
    currentState.isAnswering = true;
    currentState.streak = 0;

    if (currentState.currentRoundMode !== 'map') {
        try { playSound('wrong'); } catch (e) { }
    } else {
        highlightCorrectRegion(currentState.currentQuestion);
    }

    try { playSound('wrong'); } catch (e) { }
    updateStreakDisplay();
    setTimeout(() => nextQuestion(), 1500);
}

function updateStreakDisplay() {
    if (ui.streak) ui.streak.innerText = `🔥 ${currentState.streak}`;
}

function endGame() {
    stopTimer();
    saveHighScore();
    if (ui.gameHeader) ui.gameHeader.style.display = 'none';
    if (ui.feedbackOverlay) ui.feedbackOverlay.classList.add('hidden');
    if (currentState.score / currentState.maxRounds >= 0.5) setTimeout(triggerConfetti, 300);

    document.getElementById('final-score').innerText = currentState.score;
    document.getElementById('final-total').innerText = currentState.maxRounds === Infinity ? '∞' : currentState.maxRounds;
    document.getElementById('best-score-display').innerText = currentState.highScore;

    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    if (gameScreen) gameScreen.classList.add('hidden');
    if (endScreen) {
        endScreen.classList.remove('hidden');
        endScreen.style.display = 'block';
    }
}

function playSound(type) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        if (type === 'correct') {
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            osc.start(); osc.stop(audioCtx.currentTime + 0.1);
        } else {
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            osc.start(); osc.stop(audioCtx.currentTime + 0.2);
        }
    } catch (e) { console.warn("Audio Error", e); }
}

function triggerConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}

function saveHighScore() {
    if (currentState.score > currentState.highScore) {
        currentState.highScore = currentState.score;
        localStorage.setItem(`geoMaster_highScore_${currentState.region}`, currentState.highScore);
    }
}

function loadHighScore() {
    const saved = localStorage.getItem(`geoMaster_highScore_${currentState.region}`);
    if (saved) currentState.highScore = parseInt(saved);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('geoMaster_darkMode', isDark);
}
