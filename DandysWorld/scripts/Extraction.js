// ============================================================
// Dandy's World Calculator v2.1
// ============================================================

// ===== DOM HELPERS =====
function $(id) { return document.getElementById(id); }
function setText(id, val) { var el = $(id); if (el) el.textContent = String(val); }
function setDisplay(id, val) { var el = $(id); if (el) el.style.display = val; }
function getVal(id, def) { var el = $(id); return el ? el.value : String(def); }
function getChecked(id) { var el = $(id); return el ? el.checked : false; }
function getNum(id, def) { return parseFloat(getVal(id, String(def))) || def; }
function getInt(id, def) { return parseInt(getVal(id, String(def)), 10) || def; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ===== CONSTANTS =====
var DRAIN_PER_SEC = 8.3333333333333;
var REGEN_PER_SEC = 2.4;
var TICK = 0.25;
var TICKS_PER_SEC = 4;
var BASE_MACHINE_UNITS = 45;
var BASE_SC_CHANCE = 0.25;
var TREADMILL_UNITS = 675;
var SIM_TESTS = 1000;

// ===== TOON DATA =====
var TOONS = [
    { name: "Astro", img: "Astro_Render.webp", skill: 2, extraction: 4, speed: 3, stamina: 2, health: 2 },
    { name: "Bassie", img: "Bassie_Render.webp", skill: 1, extraction: 2, speed: 5, stamina: 4, health: 2 },
    { name: "Blot", img: "Blot_Render.webp", skill: 1, extraction: 2, speed: 4, stamina: 5, health: 3 },
    { name: "Bobette", img: "Bobette_Render.webp", skill: 4, extraction: 2, speed: 3, stamina: 5, health: 2 },
    { name: "Boxten", img: "Boxten_Render.webp", skill: 3, extraction: 3, speed: 3, stamina: 3, health: 3 },
    { name: "Brightney", img: "Brightney_Render.webp", skill: 3, extraction: 4, speed: 3, stamina: 4, health: 3 },
    { name: "Brusha", img: "Brusha_Render.webp", skill: 4, extraction: 3, speed: 3, stamina: 3, health: 3 },
    { name: "Coal", img: "Coal_Render.webp", skill: 2, extraction: 2, speed: 4, stamina: 4, health: 3 },
    { name: "Cocoa", img: "Cocoa_Render.webp", skill: 3, extraction: 2, speed: 4, stamina: 2, health: 3 },
    { name: "Connie", img: "Connie_Render.webp", skill: 2, extraction: 4, speed: 1, stamina: 3, health: 3 },
    { name: "Cosmo", img: "Cosmo_Render.webp", skill: 1, extraction: 3, speed: 3, stamina: 4, health: 3 },
    { name: "Dandy", img: "Dandy_Render.webp", skill: 5, extraction: 5, speed: 5, stamina: 5, health: 3 },
    { name: "Eclipse", img: "Eclipse_Render.webp", skill: 3, extraction: 3, speed: 4, stamina: 3, health: 3 },
    { name: "Eggson", img: "Eggson_Render.webp", skill: 3, extraction: 3, speed: 3, stamina: 3, health: 3 },
    { name: "Finn", img: "Finn_Render.webp", skill: 4, extraction: 3, speed: 3, stamina: 2, health: 3 },
    { name: "Flutter", img: "Flutter_Render.webp", skill: 2, extraction: 2, speed: 4, stamina: 4, health: 3 },
    { name: "Flyte", img: "Flyte_Render.webp", skill: 2, extraction: 4, speed: 4, stamina: 2, health: 3 },
    { name: "Gigi", img: "Gigi_Render.webp", skill: 5, extraction: 3, speed: 3, stamina: 1, health: 3 },
    { name: "Ginger", img: "Ginger_Render.webp", skill: 3, extraction: 3, speed: 2, stamina: 3, health: 3 },
    { name: "Glisten", img: "Glisten_Render.webp", skill: 2, extraction: 5, speed: 3, stamina: 3, health: 3 },
    { name: "Goob", img: "Goob_Render.webp", skill: 3, extraction: 2, speed: 4, stamina: 4, health: 3 },
    { name: "Gourdy", img: "Gourdy_Render.webp", skill: 5, extraction: 5, speed: 4, stamina: 1, health: 2 },
    { name: "Looey", img: "Looey_Render.webp", skill: 4, extraction: 3, speed: 3, stamina: 3, health: 3 },
    { name: "Pebble", img: "Pebble_Render.webp", skill: 3, extraction: 1, speed: 5, stamina: 4, health: 2 },
    { name: "Poppy", img: "Poppy_Render.webp", skill: 3, extraction: 3, speed: 3, stamina: 3, health: 3 },
    { name: "Razzle & Dazzle", img: "Razzle_%26_Dazzle_Render.webp", skill: 3, extraction: 3, speed: 3, stamina: 3, health: 3 },
    { name: "Ribecca", img: "Ribecca_Render.webp", skill: 3, extraction: 3, speed: 3, stamina: 3, health: 3 },
    { name: "Rodger", img: "Rodger_Render.webp", skill: 3, extraction: 4, speed: 2, stamina: 3, health: 3 },
    { name: "Rudie", img: "Rudie_Render.webp", skill: 3, extraction: 3, speed: 3, stamina: 3, health: 3 },
    { name: "Scraps", img: "Scraps_Render.webp", skill: 2, extraction: 3, speed: 2, stamina: 5, health: 3 },
    { name: "Shelly", img: "Shelly_Render.webp", skill: 5, extraction: 3, speed: 3, stamina: 2, health: 2 },
    { name: "Shrimpo", img: "Shrimpo_Render.webp", skill: 1, extraction: 1, speed: 1, stamina: 1, health: 3 },
    { name: "Soulvester", img: "Soulvester_Render.webp", skill: 5, extraction: 5, speed: 1, stamina: 1, health: 3 },
    { name: "Sprout", img: "Sprout_Render.webp", skill: 2, extraction: 2, speed: 4, stamina: 5, health: 2 },
    { name: "Squirm", img: "Squirm_Render.webp", skill: 3, extraction: 5, speed: 3, stamina: 2, health: 3 },
    { name: "Teagan", img: "Teagan_Render.webp", skill: 3, extraction: 3, speed: 3, stamina: 4, health: 3 },
    { name: "Tisha", img: "Tisha_Render.webp", skill: 4, extraction: 2, speed: 4, stamina: 2, health: 3 },
    { name: "Toodles", img: "Toodles_Render.webp", skill: 3, extraction: 2, speed: 3, stamina: 3, health: 3 },
    { name: "Vee", img: "Vee_Render.webp", skill: 4, extraction: 5, speed: 2, stamina: 3, health: 2 },
    { name: "Waxwell", img: "Waxwell_Render.webp", skill: 5, extraction: 2, speed: 5, stamina: 1, health: 3 },
    { name: "Yatta", img: "Yatta_Render.webp", skill: 3, extraction: 5, speed: 4, stamina: 1, health: 3 }
];

// ===== ABILITIES =====
var ABILITIES = {
    "Astro": { name: "Nap Time", cooldown: 55, type: "staminaRestore" },
    "Bassie": { name: "Springful Sharing", cooldown: 0, type: "manual" },
    "Brusha": { name: "Artistic Inspiration", cooldown: 15, type: "manual", noPeppermint: true, noPeppermintReason: "No Peppermint Icing, since you cannot paint and run a machine at the same time." },
    "Soulvester": { name: "Soul Shield", cooldown: 0, type: "manual", noPeppermint: true, noPeppermintReason: "No Peppermint Icing, since it has no cooldown." },
    "Blot": { name: "Blot Jr.", cooldown: 60, type: "none" },
    "Bobette": { name: "Precious Packaging", cooldown: 90, type: "none" },
    "Brightney": { name: "Night Light", cooldown: 45, type: "none" },
    "Coal": { name: "Scout", cooldown: 30, type: "none" },
    "Cocoa": { name: "Bonbon", cooldown: 40, type: "none" },
    "Connie": { name: "Haunting Escape", cooldown: 50, type: "none" },
    "Cosmo": { name: "Sharing is Caring", cooldown: 60, type: "none" },
    "Flutter": { name: "Floaty Dash", cooldown: 45, type: "speed", value: 1.5, duration: 0.75 },
    "Flyte": { name: "Gust", cooldown: 50, type: "speed", value: 1.15, duration: 5 },
    "Gigi": { name: "Surprise!", cooldown: 60, type: "none" },
    "Ginger": { name: "Baked with Care!", cooldown: 100, type: "none" },
    "Glisten": { name: "Reflection", cooldown: 100, type: "none" },
    "Goob": { name: "Hug!", cooldown: 30, type: "none" },
    "Gourdy": { name: "Trick or Treat", cooldown: 35, type: "random", value: 0.20, duration: 15, skillValue: 0.50 },
    "Pebble": { name: "Speak!", cooldown: 60, type: "none" },
    "Rudie": { name: "Antler Charge", cooldown: 23, type: "none" },
    "Scraps": { name: "Crafty Grapple", cooldown: 25, type: "none" },
    "Shelly": { name: "Inspiration", cooldown: 60, type: "extraction", value: 1.75, duration: 15 },
    "Sprout": { name: "Baked Sweets", cooldown: 100, type: "none" },
    "Squirm": { name: "Distressed Delicacy", cooldown: 80, type: "extraction", value: 2.0, duration: 10 },
    "Teagan": { name: "Tea Time", cooldown: 100, type: "none" },
    "Tisha": { name: "Tidy Up!", cooldown: 50, type: "speed", value: 1.25, duration: 5 },
    "Toodles": { name: "Beginner's Luck", cooldown: 25, type: "random", value: 0.15, duration: 10, skillValue: 0.15 },
    "Vee": { name: "Mic Check", cooldown: 50, type: "none" },
    "Waxwell": { name: "Ignite", cooldown: 60, type: "waxwell", duration: 10 }
};

// ===== TRINKETS =====
var TRINKETS = [
    { name: "Lucky Coin", img: "Lucky_Coin.webp", desc: "Boosts a random stat by 12% once per floor." },
    { name: "Participation Award", img: "Participation_Award.webp", desc: "+25% Skill Check chance, -10% Skill Check size." },
    { name: "Veemote", img: "Veemote.webp", desc: "Skip the first machine on the floor." },
    { name: "Machine Manual", img: "Machine_Manual.webp", desc: "+5% Extraction Speed." },
    { name: "Wrench", img: "Wrench.webp", desc: "Adds 33% completion to the first machine on a floor." },
    { name: "Blue Bandana", img: "Blue_Bandana.webp", desc: "+7.5% Extraction Speed, -5% Skill Check chance." },
    { name: "Magnifying Glass", img: "Magnifying_Glass.webp", desc: "Adds 4% completion per successful Skill Check, -33% Skill Check size." },
    { name: "Alarm", img: "Alarm.webp", desc: "+25% Movement Speed for 10 seconds when Panic Mode starts." },
    { name: "Bone", img: "Bone_Trinket.webp", desc: "Speed boost when picking up an item. Not simulated." },
    { name: "Brick", img: "Brick.webp", desc: "-10% Walk and Run Speed." },
    { name: "Dog Plush", img: "Dog_Plush.webp", desc: "+10% Walk Speed." },
    { name: "Pink Bow", img: "Pink_Bow.webp", desc: "+7.5% Run Speed." },
    { name: "Pull Toy", img: "Pull_Toy.webp", desc: "+25% Movement Speed for 10 seconds when a new floor starts." },
    { name: "Ribbon Spool", img: "Ribbon_Spool.webp", desc: "+10% Walk and Run Speed on even floors." },
    { name: "Speedy Shoes", img: "Speedy_Shoes.webp", desc: "+5% Walk and Run Speed." },
    { name: "Vanity Mirror", img: "Vanity_Mirror.webp", desc: "+30% Run Speed during Panic Mode." },
    { name: "Clown Horn", img: "Clown_Horn.webp", desc: "+10% Walk and Run Speed on odd floors." },
    { name: "Coal", img: "Coal_Trinket.webp", desc: "-10% Stealth and Movement Speed." },
    { name: "Train Whistle", img: "Train_Whistle.webp", desc: "Immune to the Slow debuff." },
    { name: "Star Pillow", img: "Star_Pillow.webp", desc: "Doubles Stamina Regeneration while extracting." },
    { name: "Speedometer", img: "Speedometer.webp", desc: "+15 max Stamina." },
    { name: "Friendship Bracelet", img: "Friendship_Bracelet.webp", desc: "+5 max Stamina per alive Toon, max 40." },
    { name: "Cooler", img: "Cooler.webp", desc: "+50 max Stamina, -5% Movement Speed." },
    { name: "Glazed Fondant Bag", img: "Glazed_Fondant_Bag.webp", desc: "Candy effects last 4 seconds longer." },
    { name: "Paint Bucket", img: "Paint_Bucket.webp", desc: "+10% Skill Check size and chance." },
    { name: "Feather Duster", img: "Feather_Duster.webp", desc: "Restores 20 Stamina when picking up an item. Not simulated." },
    { name: "Stress Ball", img: "Stress_Ball.webp", desc: "+5% Extraction Speed per successful Skill Check, 15 seconds, stacks." },
    { name: "Peppermint Icing", img: "Peppermint_Icing.webp", desc: "Grants 30 Stamina after using any active Ability." }
];

// ===== CONSUMABLES =====
var CONSUMABLES = {
    bonbon: { name: "BonBon", img: "BonBon.webp", duration: 10, uses: 1, candy: true },
    boxChocolates: { name: "Box o' Chocolates", img: "Box_o_Chocolates.webp", duration: 10, uses: 5, candy: true },
    valve: { name: "Valve", img: "Valve.webp", duration: 0, uses: 1, candy: false },
    pop: { name: "Pop", img: "Pop.webp", duration: 0, uses: 1, candy: false },
    bottlePop: { name: "Bottle o' Pop", img: "Bottle_o_Pop.webp", duration: 0, uses: 1, candy: false },
    jumperCable: { name: "Jumper Cable", img: "Jumper_Cable.webp", duration: 0, uses: 1, candy: false },
    skillCheckCandy: { name: "Skill Check Candy", img: "Skill_Check_Candy.webp", duration: 15, uses: 1, candy: true },
    extractionCandy: { name: "Extraction Candy", img: "Extraction_Candy.webp", duration: 5, uses: 1, candy: true },
    instructions: { name: "Instructions", img: "Instructions.webp", duration: 10, uses: 1, candy: false },
    proteinBar: { name: "Protein Bar", img: "Protein_Bar.webp", duration: 15, uses: 1, candy: false },
    speedCandy: { name: "Speed Candy", img: "Speed_Candy.webp", duration: 5, uses: 1, candy: true },
    staminaCandy: { name: "Stamina Candy", img: "Stamina_Candy.webp", duration: 20, uses: 1, candy: true },
    chocolate: { name: "Chocolate", img: "Chocolate.webp", duration: 10, uses: 1, candy: true },
    gumballs: { name: "Gumballs", img: "Gumballs.webp", duration: 5, uses: 3, candy: true },
    jawbreaker: { name: "Jawbreaker", img: "Jawbreaker.webp", duration: 20, uses: 1, candy: true },
    stopwatch: { name: "Stopwatch", img: "Stopwatch.webp", duration: 15, uses: 1, candy: false }
};

var CANDY_POOL = ["chocolate", "gumballs", "staminaCandy", "extractionCandy", "skillCheckCandy", "speedCandy", "jawbreaker", "boxChocolates", "stealthCandy"];

// ===== TWISTED DATA =====
// chase = normal chase speed, panic = Panic Mode chase speed (+20%)
var TWISTEDS = [
    { name: "Twisted Boxten", roam: 10, chase: 18, panic: 21.6, attention: "1.5s", rarity: "Common" },
    { name: "Twisted Brusha", roam: 10, chase: 18, panic: 21.6, attention: "1.5s", rarity: "Common" },
    { name: "Twisted Cosmo", roam: 10, chase: 18, panic: 21.6, attention: "1.5s", rarity: "Common" },
    { name: "Twisted Eggson", roam: 10, chase: 18, panic: 21.6, attention: "1.5s", rarity: "Common" },
    { name: "Twisted Looey", roam: 10, chase: 18, panic: 21.6, attention: "1.5s", rarity: "Common" },
    { name: "Twisted Poppy", roam: 10, chase: 18, panic: 21.6, attention: "1.5s", rarity: "Common" },
    { name: "Twisted Ribecca", roam: 10, chase: 18, panic: 21.6, attention: "1.5s", rarity: "Common" },
    { name: "Twisted Rudie", roam: 10, chase: 18, panic: 21.6, attention: "1.5s", rarity: "Common" },
    { name: "Twisted Shrimpo", roam: 9.5, chase: 16.5, panic: 19.8, attention: "2s", rarity: "Common" },
    { name: "Twisted Tisha", roam: 10, chase: 18, panic: 21.6, attention: "1.5s", rarity: "Common" },
    { name: "Twisted Yatta", roam: 7, chase: 19, panic: 22.8, attention: "1.5s", rarity: "Common" },
    { name: "Twisted Brightney", roam: 12, chase: 18, panic: 21.6, attention: "2s", rarity: "Uncommon" },
    { name: "Twisted Connie", roam: 8, chase: 8, panic: 9.6, attention: "Always", rarity: "Uncommon" },
    { name: "Twisted Finn", roam: 8.5, chase: 16, panic: 19.2, attention: "1.5s", rarity: "Uncommon" },
    { name: "Twisted Flyte", roam: 17, chase: 17.5, panic: 21, attention: "2s", rarity: "Uncommon" },
    { name: "Twisted Ginger", roam: 6, chase: 14, panic: 17.5, attention: "10s", rarity: "Uncommon" },
    { name: "Twisted Razzle & Dazzle", roam: 0, chase: 0, panic: 0, attention: "Static", rarity: "Uncommon", static: true },
    { name: "Twisted Rodger", roam: 0, chase: 0, panic: 0, attention: "Static", rarity: "Uncommon", static: true },
    { name: "Twisted Soulvester", roam: 8, chase: 16, panic: 19.2, attention: "3.5s", rarity: "Uncommon" },
    { name: "Twisted Teagan", roam: 10, chase: 18.5, panic: 22.2, attention: "1.75s", rarity: "Uncommon" },
    { name: "Twisted Toodles", roam: 12, chase: 20, panic: 24, attention: "1s", rarity: "Uncommon" },
    { name: "Twisted Blot", roam: 0, chase: 0, panic: 0, attention: "Static", rarity: "Rare", static: true },
    { name: "Twisted Coal", roam: 8, chase: 16, panic: 19.2, attention: "5s", rarity: "Rare" },
    { name: "Twisted Coal", roam: 10, chase: 25, panic: 30, attention: "3s", rarity: "Rare", sub: "Blackout" },
    { name: "Twisted Cocoa", roam: 8, chase: 21, panic: 25.2, attention: "0.8s", rarity: "Rare" },
    { name: "Twisted Eclipse", roam: 10, chase: 19, panic: 22.8, attention: "2s", rarity: "Rare" },
    { name: "Twisted Flutter", roam: 18, chase: 18.5, panic: 22.2, attention: "2s", rarity: "Rare" },
    { name: "Twisted Gigi", roam: 10, chase: 19, panic: 22.8, attention: "2.25s", rarity: "Rare" },
    { name: "Twisted Glisten", roam: 15, chase: 24, panic: 28.8, attention: "3s", rarity: "Rare", sub: "CRASHOUT" },
    { name: "Twisted Goob", roam: 8, chase: 16, panic: 19.2, attention: "3s", rarity: "Rare" },
    { name: "Twisted Scraps", roam: 8, chase: 16, panic: 19.2, attention: "2s", rarity: "Rare" },
    { name: "Twisted Squirm", roam: 0, chase: 0, panic: 0, attention: "Static", rarity: "Rare", static: true },
    { name: "Twisted Astro", roam: 10, chase: 19, panic: 22.8, attention: "3s", rarity: "Main" },
    { name: "Twisted Bassie", roam: 10, chase: 19, panic: 22.8, attention: "3s", rarity: "Main" },
    { name: "Twisted Bobette", roam: 8, chase: 25, panic: 30, attention: "2.5s", rarity: "Main" },
    { name: "Twisted Gourdy", roam: 18, chase: 26, panic: 31.2, attention: "3s", rarity: "Main", sub: "Enraged" },
    { name: "Twisted Pebble", roam: 10, chase: 24, panic: 28.8, attention: "3s", rarity: "Main" },
    { name: "Twisted Shelly", roam: 10, chase: 20, panic: 24, attention: "2s", rarity: "Main" },
    { name: "Twisted Sprout", roam: 8.5, chase: 17, panic: 20.4, attention: "3s", rarity: "Main" },
    { name: "Twisted Vee", roam: 10, chase: 18, panic: 21.6, attention: "3s", rarity: "Main" },
    { name: "Twisted Dandy", roam: 9, chase: 16, panic: 19.2, attention: "5s", rarity: "Lethal" },
    { name: "Twisted Dyle", roamMin: 9, roam: 22.5, chaseMin: 16, chase: 40, panicMin: 19.2, panic: 48, attention: "1s", rarity: "Lethal" },
    { name: "Chasing Twisted Waxwell", roam: 8, chase: 18, panic: 21.6, suppression: 21.7, attention: "3s", rarity: "Rare", sub: "Lit" },
    { name: "Chasing Twisted Waxwell", roam: 8, chase: 20, panic: 24, attention: "3s", rarity: "Rare", sub: "Extinguishing" }
];

// ===== STATE =====
var state = {
    toon: null,
    skill: 1,
    extraction: 1,
    speed: 1,
    stamina: 3,
    health: 3,
    trinkets: [],
    consumables: {},
    toonOptions: {},
    machines: { stripe: 1, circle: 1, barnaby: 0, treadmill: 1 },
    evenDist: false,
    totalMachines: 4,
    extractionCards: 0,
    staminaCards: 0,
    players: 1,
    dyleCheck: false,
    consistentCoin: false,
    suppressionCard: false,
    twistedFilter: "all",
    twistedSort: "speed",
    coinLock: "random",
    gourdyLock: "random",
    travel: false,
    distance: 8,
    accuracy: 0.8,
    goated: false,
    itemRefill: 3,
    ally: { shelly: false, brusha: false, bobette: false, gourdyRandom: false, gourdySugarRush: false },
    debuffs: {
        illness: 0, slow: 0, tired: 0, confused: 0,
        ichorLeak: false, twistedBrusha: false, twistedShelly: false,
        springFever: false, twistedBassie: "none", trickOrTreat: "none"
    },
    cooldownCards: 0,
    muted: (function () {
        var cookie = readMutedCookie();
        if (cookie !== null) return cookie;
        return localStorage.getItem("dwMuted") === "1";
    })()
};

var currentLuckyStat = "None";

// ===== AUDIO =====
var audioCtx = null;
var audioBuffers = {};
var audioOffsets = {};
var fallbackHover = new Audio("assets/sounds/select.mp3");
var fallbackSelect = new Audio("assets/sounds/click.mp3");
fallbackHover.preload = "auto";
fallbackSelect.preload = "auto";
fallbackHover.volume = 0.35;
fallbackSelect.volume = 0.5;

function readMutedCookie() {
    var match = document.cookie.match(/(?:^|;\s*)dwMuted=([^;]+)/);
    return match ? match[1] === "1" : null;
}

function writeMutedCookie(muted) {
    document.cookie = "dwMuted=" + (muted ? "1" : "0") + "; Max-Age=31536000; Path=/; SameSite=Lax";
}

function initAudio() {
    if (audioCtx) return;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
        audioCtx = new Ctx();
        loadAudioBuffer("hover", "assets/sounds/select.mp3");
        loadAudioBuffer("select", "assets/sounds/click.mp3");
    } catch (e) {
        audioCtx = null;
    }
}

function loadAudioBuffer(key, url) {
    if (!audioCtx) return;
    fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
        return audioCtx.decodeAudioData(buf);
    }).then(function (decoded) {
        audioBuffers[key] = decoded;
        audioOffsets[key] = findAudioStart(decoded);
    }).catch(function () {});
}

function findAudioStart(buffer) {
    var data = buffer.getChannelData(0);
    var threshold = 0.01;
    for (var i = 0; i < data.length; i++) {
        if (Math.abs(data[i]) > threshold) return i / buffer.sampleRate;
    }
    return 0;
}

function playBuffer(key, volume) {
    if (!audioCtx || !audioBuffers[key]) {
        var el = key === "hover" ? fallbackHover : fallbackSelect;
        try {
            el.currentTime = 0;
            el.volume = volume;
            el.play().catch(function () {});
        } catch (e) {}
        return;
    }
    var start = function () {
        var src = audioCtx.createBufferSource();
        src.buffer = audioBuffers[key];
        var gain = audioCtx.createGain();
        var now = audioCtx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.004);
        src.connect(gain);
        gain.connect(audioCtx.destination);
        src.start(0, audioOffsets[key] || 0);
    };
    if (audioCtx.state === "suspended") {
        audioCtx.resume().then(start).catch(function () { start(); });
    } else {
        start();
    }
}

function playHover() {
    if (state.muted) return;
    playBuffer("hover", 0.35);
}

function playSelect() {
    if (state.muted) return;
    playBuffer("select", 0.5);
}

function toggleMute() {
    state.muted = !state.muted;
    localStorage.setItem("dwMuted", state.muted ? "1" : "0");
    writeMutedCookie(state.muted);
    var btn = $("muteBtn");
    if (btn) btn.textContent = state.muted ? "🔇" : "🔊";
    if (!state.muted) playSelect();
}

// ===== DATA HELPERS =====
function getToon() {
    return state.toon;
}
function toonName() {
    return state.toon ? state.toon.name : "";
}
function hasTrinket(name, trinkets) {
    return (trinkets || []).indexOf(name) >= 0;
}
function isRibecca() { return toonName() === "Ribecca"; }
function isTisha() { return toonName() === "Tisha"; }
function isIchorImmune() {
    return ["Flutter", "Blot", "Connie", "Soulvester", "Ribecca", "Tisha"].indexOf(toonName()) >= 0;
}
function isSlowImmune() {
    return isRibecca() || hasTrinket("Train Whistle", state.trinkets);
}
function getAbility() {
    return ABILITIES[toonName()] || null;
}

function getToonStats() {
    return {
        skill: state.skill,
        extraction: state.extraction,
        speed: state.speed,
        stamina: state.stamina,
        health: state.health
    };
}

function getMaxStamina(trinkets, buffs) {
    var stats = getToonStats();
    var max = 25 * (stats.stamina + 3);
    max += state.staminaCards * 10;
    if (state.dyleCheck) max += 50;
    if (hasTrinket("Speedometer", trinkets)) max += 15;
    if (hasTrinket("Friendship Bracelet", trinkets)) {
        max += Math.min(40, 5 * Math.max(1, state.players));
    }
    if (hasTrinket("Cooler", trinkets)) max += 50;
    if (buffs) {
        for (var i = 0; i < buffs.length; i++) {
            if (buffs[i].type === "maxStamina") max += buffs[i].value;
        }
    }
    if (toonName() === "Eclipse" && state.toonOptions.eclipseBlackout) max *= 1.6;
    return max;
}

function getRegen(trinkets, extracting, buffs) {
    var regen = REGEN_PER_SEC;
    if (toonName() === "Astro") regen *= 1.5;
    if (state.ally.bobette) regen *= 1.5;
    if (extracting && hasTrinket("Star Pillow", trinkets)) regen *= 2;
    if (buffs) regen *= getBuffMult(buffs, "staminaRegenMult");
    regen *= getDebuffMult("tired", buffs);
    return regen;
}

function getWalkSpeed(trinkets, buffs, panic) {
    var stats = getToonStats();
    var walk = stats.speed * 2.5 + 7.5;
    if (hasTrinket("Dog Plush", trinkets)) walk *= 1.1;
    if (hasTrinket("Ribbon Spool", trinkets) || hasTrinket("Clown Horn", trinkets)) walk *= 1.1;
    if (hasTrinket("Speedy Shoes", trinkets)) walk *= 1.05;
    if (hasTrinket("Brick", trinkets)) walk *= 0.9;
    if (hasTrinket("Coal", trinkets)) walk *= 0.9;
    if (hasTrinket("Cooler", trinkets)) walk *= 0.95;
    if (hasTrinket("Lucky Coin", trinkets) && currentLuckyStat === "MS") walk *= 1.12;
    if (toonName() === "Eclipse" && state.toonOptions.eclipseBlackout) walk *= 1.2;
    if (state.ally.bobette) walk *= 1.25;
    if (toonName() === "Looey" && state.health < 3 && state.health > 0) {
        walk *= 1 + 0.2 * (3 - state.health);
    }
    if (buffs) {
        walk *= getBuffMult(buffs, "speedMult");
        walk *= getBuffMult(buffs, "walkSpeedMult");
    }
    walk *= getDebuffMult("slow", buffs);
    if (panic) {
        if (hasTrinket("Alarm", trinkets)) walk *= 1.25;
        if (state.ally.gourdySugarRush || toonName() === "Gourdy") walk *= 1.2;
        if (toonName() === "Finn" && state.toonOptions.finnPassive !== false) walk *= 1.35 * (state.toonOptions.phantomFriend ? 2 : 1);
        if (toonName() === "Shelly" && state.toonOptions.shellyMS !== false) walk *= 1.25 * (state.toonOptions.teammateShelly ? 2 : 1);
    }
    return walk;
}

function getRunSpeed(trinkets, buffs, panic) {
    var stats = getToonStats();
    var run = stats.speed * 2.5 + 17.5;
    if (hasTrinket("Pink Bow", trinkets)) run *= 1.075;
    if (hasTrinket("Ribbon Spool", trinkets) || hasTrinket("Clown Horn", trinkets)) run *= 1.1;
    if (hasTrinket("Speedy Shoes", trinkets)) run *= 1.05;
    if (hasTrinket("Brick", trinkets)) run *= 0.9;
    if (hasTrinket("Coal", trinkets)) run *= 0.9;
    if (hasTrinket("Cooler", trinkets)) run *= 0.95;
    if (hasTrinket("Lucky Coin", trinkets) && currentLuckyStat === "MS") run *= 1.12;
    if (toonName() === "Eclipse" && state.toonOptions.eclipseBlackout) run *= 1.2;
    if (state.ally.bobette) run *= 1.25;
    if (toonName() === "Looey" && state.health < 3 && state.health > 0) {
        run *= 1 + 0.2 * (3 - state.health);
    }
    if (buffs) {
        run *= getBuffMult(buffs, "speedMult");
        run *= getBuffMult(buffs, "runSpeedMult");
    }
    run *= getDebuffMult("slow", buffs);
    if (panic) {
        if (hasTrinket("Alarm", trinkets)) run *= 1.25;
        if (hasTrinket("Vanity Mirror", trinkets)) run *= 1.3;
        if (state.ally.gourdySugarRush || toonName() === "Gourdy") run *= 1.2;
        if (toonName() === "Finn" && state.toonOptions.finnPassive !== false) run *= 1.35 * (state.toonOptions.phantomFriend ? 2 : 1);
        if (toonName() === "Shelly" && state.toonOptions.shellyMS !== false) run *= 1.25 * (state.toonOptions.teammateShelly ? 2 : 1);
    }
    return run;
}

function getTapSpeed(walk, run, regen) {
    if (run <= walk || regen <= 0) return walk;
    var runTime = 10 / DRAIN_PER_SEC;
    var walkTime = 10 / regen;
    return (run * runTime + walk * walkTime) / (runTime + walkTime);
}

function getExtractionRate(trinkets, buffs, machine) {
    var stats = getToonStats();
    var rate = [0.75, 0.85, 1.0, 1.2, 1.5][clamp(stats.extraction, 1, 5) - 1];
    rate *= getDebuffMult("confused", buffs);
    if (toonName() === "Boxten") {
        rate *= Math.pow(1.06, Math.max(1, state.players));
    }
    if (hasTrinket("Machine Manual", trinkets)) rate *= 1.05;
    if (hasTrinket("Blue Bandana", trinkets)) rate *= 1.075;
    if (hasTrinket("Lucky Coin", trinkets) && currentLuckyStat === "Extraction") rate *= 1.12;
    if (state.ally.brusha) rate *= 1.25;
    if (buffs) {
        rate *= getBuffMult(buffs, "extractionMult");
        rate *= 1 + getBuffAdd(buffs, "stressball");
    }
    return rate;
}

function getSCChance(trinkets, buffs, machine, vandalized) {
    var chance = BASE_SC_CHANCE;
    if (hasTrinket("Participation Award", trinkets)) chance += 0.25;
    if (hasTrinket("Paint Bucket", trinkets)) chance += 0.10;
    if (hasTrinket("Blue Bandana", trinkets)) chance -= 0.05;
    if (hasTrinket("Lucky Coin", trinkets) && currentLuckyStat === "Skill") chance += 0.12;
    if (state.ally.brusha) chance += 0.15;
    if (buffs) chance += getBuffAdd(buffs, "skillCheckChance");
    if (vandalized && machine !== "treadmill") chance -= 0.15;
    return clamp(chance, 0, 1);
}

function getSCValue(trinkets, buffs) {
    var stats = getToonStats();
    var value = 0.5 + stats.skill * 0.5;
    if (hasTrinket("Magnifying Glass", trinkets)) value += 1.8;
    if (buffs) value += getBuffAdd(buffs, "skillCheckValue");
    return value;
}

function getAccuracy(trinkets, buffs, machine) {
    if (state.goated) return 1;
    var accuracy = machine === "circle" ? 0.70 : state.accuracy;
    accuracy += (getToonStats().skill - 3) * 0.15;
    accuracy *= getDebuffMult("illness", buffs);
    if (hasTrinket("Magnifying Glass", trinkets)) accuracy *= 0.67;
    if (hasTrinket("Participation Award", trinkets)) accuracy *= 0.9;
    if (hasTrinket("Paint Bucket", trinkets)) accuracy *= 1.1;
    if (buffs) accuracy *= getBuffMult(buffs, "accuracyMult");
    return clamp(accuracy, 0, 1);
}

function getDebuffMult(type, buffs) {
    if (isRibecca()) return 1;
    if (type === "slow" && isSlowImmune()) return 1;

    var mult = 1;
    var illnessTable = [1, 0.85, 0.75, 0.5];
    var slowTable = [1, 0.85, 0.75, 0.5];
    var tiredTable = [1, 0.75, 0.5, 0.25];
    var confusedTable = [1, 0.75, 0.5, 0.25];

    if (type === "illness") mult *= illnessTable[clamp(state.debuffs.illness, 0, 3)];
    if (type === "slow") mult *= slowTable[clamp(state.debuffs.slow, 0, 3)];
    if (type === "tired") mult *= tiredTable[clamp(state.debuffs.tired, 0, 3)];
    if (type === "confused") mult *= confusedTable[clamp(state.debuffs.confused, 0, 3)];

    if (type === "confused" && state.debuffs.twistedShelly) mult *= confusedTable[1];
    if (state.debuffs.twistedBassie === "vines" && type === "slow") mult *= slowTable[2];
    if (state.debuffs.twistedBassie === "flowers") {
        if (type === "slow") mult *= slowTable[3];
        if (type === "tired") mult *= tiredTable[2];
    }
    if (type === "tired" && state.debuffs.springFever) mult *= tiredTable[2];

    if (buffs) {
        for (var i = 0; i < buffs.length; i++) {
            var b = buffs[i];
            if (b.type === "debuffIllness" && type === "illness") mult *= illnessTable[clamp(b.value, 0, 3)];
            if (b.type === "debuffSlow" && type === "slow") mult *= slowTable[clamp(b.value, 0, 3)];
            if (b.type === "debuffTired" && type === "tired") mult *= tiredTable[clamp(b.value, 0, 3)];
            if (b.type === "debuffConfused" && type === "confused") mult *= confusedTable[clamp(b.value, 0, 3)];
            if (b.type === "debuffBarnabyDoor" && type === "slow") mult *= 0.7;
        }
    }
    return mult;
}

function getBuffMult(buffs, type) {
    var m = 1;
    if (!buffs) return m;
    for (var i = 0; i < buffs.length; i++) {
        if (buffs[i].type === type) m *= buffs[i].value;
    }
    return m;
}

function getBuffAdd(buffs, type) {
    var s = 0;
    if (!buffs) return s;
    for (var i = 0; i < buffs.length; i++) {
        if (buffs[i].type === type) s += buffs[i].value;
    }
    return s;
}

function addBuff(buffs, type, value, duration) {
    buffs.push({ type: type, value: value, remaining: duration, duration: duration });
}

function tickBuffs(sim, dt) {
    for (var i = sim.buffs.length - 1; i >= 0; i--) {
        sim.buffs[i].remaining -= dt;
        if (sim.buffs[i].remaining <= 0) {
            sim.buffs.splice(i, 1);
        }
    }
    sim.maxStamina = sim.getMaxStamina();
    if (sim.stamina > sim.maxStamina) sim.stamina = sim.maxStamina;
}

// ===== INVENTORY =====
function createInventory(itemCounts, trinkets) {
    var inv = {};
    for (var key in CONSUMABLES) {
        var def = CONSUMABLES[key];
        var count = itemCounts[key] || 0;
        if (count > 0) {
            var duration = def.duration;
            if (hasTrinket("Glazed Fondant Bag", trinkets) && def.candy && duration > 0) duration += 4;
            inv[key] = { uses: count * def.uses, duration: duration };
        }
    }
    return inv;
}

function refillInventory(sim, itemCounts, trinkets) {
    for (var key in CONSUMABLES) {
        var def = CONSUMABLES[key];
        var count = itemCounts[key] || 0;
        if (count > 0) {
            var duration = def.duration;
            if (hasTrinket("Glazed Fondant Bag", trinkets) && def.candy && duration > 0) duration += 4;
            sim.inventory[key] = { uses: count * def.uses, duration: duration };
        }
    }
}

function useExtractionConsumables(sim) {
    var inv = sim.inventory;
    var buffs = sim.buffs;
    while (inv.jawbreaker && inv.jawbreaker.uses > 0) {
        inv.jawbreaker.uses--;
        rollRandomEffect(buffs, 0.5, inv.jawbreaker.duration, 0.5, null);
    }
    while (inv.gumballs && inv.gumballs.uses > 0) {
        inv.gumballs.uses--;
        rollRandomEffect(buffs, 0.10, inv.gumballs.duration, 0.10, null);
    }
    while (inv.bonbon && inv.bonbon.uses > 0) {
        inv.bonbon.uses--;
        addBuff(buffs, "extractionMult", 1.5, inv.bonbon.duration);
        addBuff(buffs, "speedMult", 1.25, inv.bonbon.duration);
    }
    while (inv.skillCheckCandy && inv.skillCheckCandy.uses > 0) {
        inv.skillCheckCandy.uses--;
        addBuff(buffs, "skillCheckChance", 0.25, inv.skillCheckCandy.duration);
    }
    while (inv.extractionCandy && inv.extractionCandy.uses > 0) {
        inv.extractionCandy.uses--;
        addBuff(buffs, "extractionMult", 1.5, inv.extractionCandy.duration);
    }
    while (inv.instructions && inv.instructions.uses > 0) {
        inv.instructions.uses--;
        addBuff(buffs, "extractionMult", 2.0, inv.instructions.duration);
    }
    while (inv.stopwatch && inv.stopwatch.uses > 0) {
        inv.stopwatch.uses--;
        addBuff(buffs, "accuracyMult", 1.1, inv.stopwatch.duration);
    }
    while (inv.boxChocolates && inv.boxChocolates.uses > 0) {
        inv.boxChocolates.uses--;
        sim.addBuff("maxStamina", 25, inv.boxChocolates.duration);
        addBuff(buffs, "runSpeedMult", 1.1, inv.boxChocolates.duration);
    }
    while (inv.chocolate && inv.chocolate.uses > 0) {
        inv.chocolate.uses--;
        sim.addBuff("maxStamina", 25, inv.chocolate.duration);
        addBuff(buffs, "walkSpeedMult", 1.1, inv.chocolate.duration);
    }
    while (inv.proteinBar && inv.proteinBar.uses > 0) {
        inv.proteinBar.uses--;
        addBuff(buffs, "staminaRegenMult", 2.5, inv.proteinBar.duration);
    }
    while (inv.staminaCandy && inv.staminaCandy.uses > 0) {
        inv.staminaCandy.uses--;
        addBuff(buffs, "staminaRegenMult", 1.5, inv.staminaCandy.duration);
    }
    while (inv.speedCandy && inv.speedCandy.uses > 0) {
        inv.speedCandy.uses--;
        addBuff(buffs, "speedMult", 1.25, inv.speedCandy.duration);
    }
}

function rollRandomEffect(buffs, value, duration, skillValue, lock) {
    var pool = ["Extraction", "Skill", "MS", "Stamina", "Stealth"];
    var pick = pool[Math.floor(Math.random() * pool.length)];
    if (lock && lock !== "random") pick = lock;
    if (pick === "Stealth") return;
    if (pick === "Skill") addBuff(buffs, "skillCheckChance", skillValue, duration);
    if (pick === "Extraction") addBuff(buffs, "extractionMult", 1 + value, duration);
    if (pick === "MS") addBuff(buffs, "speedMult", 1 + value, duration);
    if (pick === "Stamina") addBuff(buffs, "staminaRegenMult", 1 + value, duration);
}

function applyCandy(sim, key) {
    var buffs = sim.buffs;
    if (key === "chocolate") {
        sim.addBuff("maxStamina", 25, 10);
        addBuff(buffs, "walkSpeedMult", 1.1, 10);
    } else if (key === "gumballs") {
        for (var i = 0; i < 3; i++) rollRandomEffect(buffs, 0.10, 5, 0.10, null);
    } else if (key === "staminaCandy") {
        addBuff(buffs, "staminaRegenMult", 1.5, 20);
    } else if (key === "extractionCandy") {
        addBuff(buffs, "extractionMult", 1.5, 5);
    } else if (key === "skillCheckCandy") {
        addBuff(buffs, "skillCheckChance", 0.25, 15);
    } else if (key === "speedCandy") {
        addBuff(buffs, "speedMult", 1.25, 5);
    } else if (key === "jawbreaker") {
        rollRandomEffect(buffs, 0.5, 20, 0.5, null);
    } else if (key === "boxChocolates") {
        sim.addBuff("maxStamina", 25, 10);
        addBuff(buffs, "runSpeedMult", 1.1, 10);
    }
}

// ===== FLOOR SIMULATION =====
function FloorSim(itemCounts) {
    this.trinkets = state.trinkets.slice();
    this.itemCounts = itemCounts;
    this.inventory = createInventory(itemCounts, this.trinkets);
    this.buffs = [];
    this.time = 0;
    this.travelTime = 0;
    this.extractionTime = 0;
    this.skillChecks = 0;
    this.abilityCooldown = 0;
    this.abilityUses = 0;
    this.maxStamina = 0;
    this.stamina = 0;
    this.exhausted = false;
    this.machines = generateMachineOrder();
    this.machineIndex = 0;
    this.machinesSinceRefill = 0;
    this.shellyCheerTimer = 75;
    this.gourdyRandomTimer = 35;
    this.waxwellIgnited = 0;
    this.waxwellTired = false;
    this.candyInventory = [];
    this.squirmMachineCounter = 0;
    this.squirmBookshelfTimer = 0;
    this.firstMachine = true;
    this.machines.forEach(function (m) {
        m.ichorLeak = state.debuffs.ichorLeak && Math.random() < 0.10;
        m.vandalized = state.debuffs.twistedBrusha && m.type !== "treadmill" && Math.random() < 0.25;
    });
    currentLuckyStat = rollLuckyCoin();
    this.floorStartBuffs();
    this.maxStamina = getMaxStamina(this.trinkets, this.buffs);
    this.stamina = this.maxStamina;
    if (toonName() === "Waxwell") {
        addBuff(this.buffs, "debuffTired", 2, 9999);
        this.waxwellTired = true;
    }
}

FloorSim.prototype.addBuff = function (type, value, duration) {
    if (type === "maxStamina") {
        var before = this.getMaxStamina();
        addBuff(this.buffs, type, value, duration);
        var after = this.getMaxStamina();
        this.stamina = Math.min(after, this.stamina + (after - before));
        this.maxStamina = after;
    } else {
        addBuff(this.buffs, type, value, duration);
    }
};

FloorSim.prototype.getMaxStamina = function () {
    return getMaxStamina(this.trinkets, this.buffs);
};

FloorSim.prototype.floorStartBuffs = function () {
    if (state.ally.gourdySugarRush || toonName() === "Gourdy") this.addBuff("speedMult", 1.2, 5);
    if (hasTrinket("Pull Toy", this.trinkets)) this.addBuff("speedMult", 1.25, 10);
    if (state.debuffs.springFever) this.addBuff("speedMult", 1.5, 9999);
    if (state.debuffs.trickOrTreat === "sugarRush") {
        this.addBuff("speedMult", 1.3, 30);
        this.addBuff("staminaRegenMult", 1.3, 30);
    }
    if (state.debuffs.trickOrTreat === "barnabyDoor") this.addBuff("debuffBarnabyDoor", 1, 15);
    if (state.debuffs.trickOrTreat === "slow1") this.addBuff("debuffSlow", 1, 15);
    if (state.debuffs.trickOrTreat === "tired1") this.addBuff("debuffTired", 1, 15);
    if (state.debuffs.twistedBassie === "vines") this.addBuff("debuffSlow", 2, 9999);
    if (state.debuffs.twistedBassie === "flowers") {
        this.addBuff("debuffSlow", 3, 9999);
        this.addBuff("debuffTired", 2, 9999);
    }
};

FloorSim.prototype.run = function () {
    if (hasTrinket("Veemote", this.trinkets) && this.machines.length > 0) {
        this.machines.shift();
        this.time += 1;
    }
    for (var i = 0; i < this.machines.length; i++) {
        if (state.itemRefill > 0 && this.machinesSinceRefill >= state.itemRefill) {
            refillInventory(this, this.itemCounts, this.trinkets);
            this.machinesSinceRefill = 0;
        }
        this.useYattaCandies();
        this.travelTo(this.machines[i]);
        this.doMachine(this.machines[i]);
        this.afterMachine();
        this.machinesSinceRefill++;
        this.machineIndex++;
        this.firstMachine = false;
    }
};

FloorSim.prototype.applyIchorLeakTravel = function (machine) {
    if (!machine.ichorLeak || machine.ichorTravelApplied) return;
    machine.ichorTravelApplied = true;
    if (isRibecca() || isIchorImmune()) return;
    this.addBuff("debuffIllness", 3, 25);
    this.addBuff("debuffSlow", 1, 5);
};

FloorSim.prototype.applyIchorLeakMachine = function (machine) {
    if (!machine.ichorLeak) return;
    if (isRibecca()) {
        this.applyRibeccaBuff();
        return;
    }
    if (isIchorImmune()) return;
    if (!machine.ichorTravelApplied) {
        this.addBuff("debuffIllness", 3, 25);
        this.addBuff("debuffSlow", 1, 5);
        machine.ichorTravelApplied = true;
    }
};

FloorSim.prototype.travelTo = function (machine) {
    if (!state.travel) return;
    this.applyIchorLeakTravel(machine);
    var remaining = state.distance * 15;
    var useRun = machine.type !== "treadmill";
    var guard = 0;
    while (remaining > 0 && guard < 20000) {
        var running = useRun && !this.exhausted;
        var speed = running ? getRunSpeed(this.trinkets, this.buffs, false) : getWalkSpeed(this.trinkets, this.buffs, false);
        if (toonName() === "Squirm" && state.toonOptions.squirmEatBooks) speed *= 0.5;
        if (speed <= 0) break;
        remaining -= speed * TICK;
        if (running) {
            this.stamina -= DRAIN_PER_SEC * TICK;
            if (this.stamina <= 0) {
                this.stamina = 0;
                this.exhausted = true;
            }
        } else {
            this.stamina = Math.min(this.getMaxStamina(), this.stamina + getRegen(this.trinkets, false, this.buffs) * TICK);
            if (this.exhausted && this.stamina >= 10) this.exhausted = false;
        }
        this.tickTime(TICK);
        if (toonName() === "Squirm" && state.toonOptions.squirmBookshelves) {
            this.squirmBookshelfTimer += TICK;
            if (this.squirmBookshelfTimer >= 1) {
                this.squirmBookshelfTimer -= 1;
                if (Math.random() < 0.33) this.abilityCooldown -= 1;
            }
        }
        this.time += TICK;
        this.travelTime += TICK;
        guard++;
    }
};

FloorSim.prototype.doMachine = function (machine) {
    if (machine.type === "treadmill") {
        this.doTreadmill(machine);
    } else {
        this.doExtraction(machine);
    }
};

FloorSim.prototype.doExtraction = function (machine) {
    var maxCompletion = BASE_MACHINE_UNITS - state.extractionCards * 5;
    var completion = 0;

    if (this.firstMachine && hasTrinket("Wrench", this.trinkets)) completion += maxCompletion / 3;
    if (toonName() === "Eggson") completion += maxCompletion * 0.2;

    while (this.inventory.jumperCable && this.inventory.jumperCable.uses > 0) {
        this.inventory.jumperCable.uses--;
        completion += maxCompletion * 0.33;
    }
    if (this.inventory.valve && this.inventory.valve.uses > 0) {
        this.inventory.valve.uses--;
        this.time += 0.5;
        this.extractionTime += 0.5;
        return;
    }

    this.applyIchorLeakMachine(machine);
    useExtractionConsumables(this);

    var scCooldown = 0;
    var scRollTimer = 0;
    var barnabyPhase = 0;
    var barnabyFirstCoin = machine.type === "barnaby" && getChecked("firstCoinCheck");
    var guard = 0;

    while (completion < maxCompletion && guard < 5000) {
        var rate = getExtractionRate(this.trinkets, this.buffs, machine.type);
        var scChance = getSCChance(this.trinkets, this.buffs, machine.type, machine.vandalized);
        var scValue = getSCValue(this.trinkets, this.buffs);
        var accuracy = getAccuracy(this.trinkets, this.buffs, machine.type);

        if (barnabyFirstCoin) {
            if (barnabyPhase === 0) {
                completion += rate * TICK;
                barnabyPhase = 1;
            } else if (barnabyPhase === 1) {
                barnabyPhase = 2;
            } else {
                completion += rate * TICK;
                var gotCoin = scChance >= 0.5 || Math.random() < scChance;
                if (gotCoin) {
                    if (Math.random() < accuracy) {
                        completion += scValue;
                        this.skillChecks++;
                        if (hasTrinket("Stress Ball", this.trinkets)) this.addBuff("stressball", 0.05, 15);
                    }
                    barnabyPhase = 0;
                } else {
                    barnabyPhase = 1;
                }
            }
        } else {
            completion += rate * TICK;
            if (scCooldown > 0) {
                scCooldown -= TICK;
            } else if (scChance >= 0.5) {
                if (Math.random() < accuracy) {
                    completion += scValue;
                    this.skillChecks++;
                    if (hasTrinket("Stress Ball", this.trinkets)) this.addBuff("stressball", 0.05, 15);
                }
                scCooldown = 3;
            } else {
                scRollTimer += TICK;
                if (scRollTimer >= 1) {
                    scRollTimer -= 1;
                    if (Math.random() < scChance) {
                        if (Math.random() < accuracy) {
                            completion += scValue;
                            this.skillChecks++;
                            if (hasTrinket("Stress Ball", this.trinkets)) this.addBuff("stressball", 0.05, 15);
                        }
                        scCooldown = 3;
                    }
                }
            }
        }

        this.stamina = Math.min(this.getMaxStamina(), this.stamina + getRegen(this.trinkets, true, this.buffs) * TICK);
        this.tickTime(TICK);
        this.time += TICK;
        this.extractionTime += TICK;
        guard++;
    }
};

FloorSim.prototype.doTreadmill = function (machine) {
    var goal = TREADMILL_UNITS * (BASE_MACHINE_UNITS - state.extractionCards * 5) / BASE_MACHINE_UNITS;
    var progress = 0;
    this.applyIchorLeakMachine(machine);
    useExtractionConsumables(this);
    var magTimer = 0;
    var guard = 0;

    while (progress < goal && guard < 5000) {
        var walk = getWalkSpeed(this.trinkets, this.buffs, false);
        var run = getRunSpeed(this.trinkets, this.buffs, false);
        if (!this.exhausted && this.stamina > 0 && run > walk) {
            progress += run * TICK;
            this.stamina -= DRAIN_PER_SEC * TICK;
            if (this.stamina <= 0) {
                this.stamina = 0;
                this.exhausted = true;
            }
        } else {
            progress += walk * TICK;
            this.stamina = Math.min(this.getMaxStamina(), this.stamina + getRegen(this.trinkets, false, this.buffs) * TICK);
            if (this.exhausted && this.stamina >= 10) this.exhausted = false;
        }

        if (this.stamina <= 11 && this.inventory.pop && this.inventory.pop.uses > 0) {
            this.inventory.pop.uses--;
            this.stamina = Math.min(this.getMaxStamina(), this.stamina + 45);
            if (this.stamina >= 10) this.exhausted = false;
        }
        if (this.stamina <= 11 && this.inventory.bottlePop && this.inventory.bottlePop.uses > 0) {
            this.inventory.bottlePop.uses--;
            this.stamina = this.getMaxStamina();
            this.exhausted = false;
        }

        if (hasTrinket("Magnifying Glass", this.trinkets)) {
            magTimer += TICK;
            if (magTimer >= 5) {
                progress += goal * 0.04;
                magTimer -= 5;
            }
        }

        this.tickTime(TICK);
        this.time += TICK;
        this.extractionTime += TICK;
        guard++;
    }
};

FloorSim.prototype.tickTime = function (dt) {
    tickBuffs(this, dt);
    this.tickAbility(dt);
    if (state.ally.shelly) {
        this.shellyCheerTimer -= dt;
        if (this.shellyCheerTimer <= 0) {
            this.addBuff("extractionMult", 1.75, 15);
            this.shellyCheerTimer = 75;
        }
    }
    if (state.ally.gourdyRandom) {
        this.gourdyRandomTimer -= dt;
        if (this.gourdyRandomTimer <= 0) {
            rollRandomEffect(this.buffs, 0.20, 15, 0.50, state.gourdyLock);
            this.gourdyRandomTimer = 35;
        }
    }
    if (this.waxwellIgnited > 0) {
        this.waxwellIgnited -= dt;
        if (this.waxwellIgnited <= 0 && this.waxwellTired) {
            this.addBuff("debuffTired", 2, 9999);
        }
    }
};

FloorSim.prototype.tickAbility = function (dt) {
    var def = getAbility();
    if (!def || def.type === "manual") return;
    if (toonName() === "Brusha") return;
    if (toonName() === "Toodles" && !state.toonOptions.toodlesAutoCast) return;
    if (toonName() === "Waxwell" && !state.toonOptions.waxwellAutoIgnite) return;
    this.abilityCooldown -= dt;
    if (this.abilityCooldown > 0) return;
    this.abilityCooldown = Math.max(0, def.cooldown - state.cooldownCards * 5);
    if (def.type === "staminaRestore") {
        this.stamina = Math.min(this.getMaxStamina(), this.stamina + this.getMaxStamina() * 0.2);
    } else if (def.type === "extraction") {
        this.addBuff("extractionMult", def.value, def.duration);
    } else if (def.type === "random") {
        var lock = toonName() === "Gourdy" ? state.gourdyLock : null;
        rollRandomEffect(this.buffs, def.value, def.duration, def.skillValue, lock);
    } else if (def.type === "speed") {
        this.addBuff("speedMult", def.value, def.duration);
    } else if (def.type === "waxwell") {
        this.waxwellIgnited = def.duration;
        for (var i = this.buffs.length - 1; i >= 0; i--) {
            if (this.buffs[i].type === "debuffTired" && this.buffs[i].value === 2) {
                this.buffs.splice(i, 1);
            }
        }
    }
    if (toonName() === "Glisten") {
        this.addBuff("debuffConfused", 3, 10);
    }
    if (hasTrinket("Peppermint Icing", this.trinkets)) {
        this.stamina = Math.min(this.getMaxStamina(), this.stamina + 30);
    }
    this.abilityUses++;
};

FloorSim.prototype.afterMachine = function () {
    if (toonName() === "Finn" && state.toonOptions.finnPassive !== false) {
        var mult = 1.35 * (state.toonOptions.phantomFriend ? 2 : 1);
        this.addBuff("speedMult", mult, 10);
    }
    if (toonName() === "Shelly" && state.toonOptions.shellyMS !== false) {
        var mult2 = 1.25 * (state.toonOptions.teammateShelly ? 2 : 1);
        this.addBuff("speedMult", mult2, 10);
    }
    if (toonName() === "Yatta") {
        var slots = state.toonOptions.yattaCandySlots || 0;
        if (slots > 0) {
            for (var i = 0; i < 2; i++) {
                if (this.candyInventory.length < slots) {
                    this.candyInventory.push(CANDY_POOL[Math.floor(Math.random() * CANDY_POOL.length)]);
                }
            }
        }
    }
    if (toonName() === "Squirm" && state.toonOptions.squirmEatBooks) {
        this.squirmMachineCounter++;
        if (this.squirmMachineCounter % 2 === 0) this.addBuff("extractionMult", 2.0, 10);
    }
};

FloorSim.prototype.useYattaCandies = function () {
    while (this.candyInventory.length > 0) {
        applyCandy(this, this.candyInventory.shift());
    }
};

FloorSim.prototype.applyRibeccaBuff = function () {
    var roll = Math.floor(Math.random() * 5);
    if (roll === 0) {
        this.addBuff("skillCheckChance", 0.10, 10);
        this.addBuff("accuracyMult", 1.1, 10);
    } else if (roll === 1) {
        this.addBuff("speedMult", 1.1, 10);
    } else if (roll === 2) {
        this.addBuff("staminaRegenMult", 1.1, 10);
    } else if (roll === 3) {
        this.addBuff("extractionMult", 1.1, 10);
    }
};

function rollLuckyCoin() {
    if (state.consistentCoin) {
        if (state.coinLock === "random") {
            return ["Skill", "Extraction", "MS"][Math.floor(Math.random() * 3)];
        }
        return state.coinLock;
    }
    if (Math.random() < 0.4) {
        return ["Skill", "Extraction", "MS"][Math.floor(Math.random() * 3)];
    }
    return "None";
}

function generateMachineOrder() {
    var s, c, b, t;
    if (state.evenDist) {
        var total = state.totalMachines;
        s = Math.floor(total / 4);
        c = Math.floor(total / 4);
        b = Math.floor(total / 4);
        t = total - s - c - b;
    } else {
        s = state.machines.stripe;
        c = state.machines.circle;
        b = state.machines.barnaby;
        t = state.machines.treadmill;
    }
    var machines = [];
    var i;
    for (i = 0; i < s; i++) machines.push({ type: "stripe" });
    for (i = 0; i < c; i++) machines.push({ type: "circle" });
    for (i = 0; i < b; i++) machines.push({ type: "barnaby" });
    for (i = 0; i < t; i++) machines.push({ type: "treadmill" });
    for (i = machines.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = machines[i];
        machines[i] = machines[j];
        machines[j] = tmp;
    }
    return machines;
}

// ===== SIMULATION RUNNER =====
function runOneScene() {
    var totalTime = 0;
    var totalSC = 0;
    var totalTravel = 0;
    var totalExtraction = 0;
    for (var i = 0; i < SIM_TESTS; i++) {
        var sim = new FloorSim(state.consumables);
        sim.run();
        totalTime += sim.time;
        totalSC += sim.skillChecks;
        totalTravel += sim.travelTime;
        totalExtraction += sim.extractionTime;
    }
    return {
        time: totalTime / SIM_TESTS,
        sc: totalSC / SIM_TESTS,
        travel: totalTravel / SIM_TESTS,
        extraction: totalExtraction / SIM_TESTS
    };
}

function runSimulations() {
    syncStateFromUI();
    updateMachineDistribution();
    var totalM = state.evenDist ? state.totalMachines : (state.machines.stripe + state.machines.circle + state.machines.barnaby + state.machines.treadmill);
    if (totalM < 1) {
        setText("noneResult", "Need at least 1 machine.");
        return;
    }

    state.trinkets = getSelectedTrinkets();
    state.consumables = getItemCounts();

    var t1 = state.trinkets[0] || null;
    var t2 = state.trinkets[1] || null;

    state.trinkets = [];
    var rNone = runOneScene();
    state.trinkets = t1 ? [t1] : [];
    var r1 = t1 ? runOneScene() : null;
    state.trinkets = t2 ? [t2] : [];
    var r2 = t2 ? runOneScene() : null;
    state.trinkets = [];
    if (t1) state.trinkets.push(t1);
    if (t2) state.trinkets.push(t2);
    var rBoth = (t1 && t2) ? runOneScene() : null;

    var fmt = function (v) { return v === null || v === undefined ? "-" : v.toFixed(1); };
    setText("noneResult", fmt(rNone.time));
    setText("noneSC", Math.floor(rNone.sc));
    setText("trinket1Name", t1 || "None");
    setText("trinket2Name", t2 || "None");
    setText("trinket1Result", r1 ? fmt(r1.time) : "-");
    setText("trinket2Result", r2 ? fmt(r2.time) : "-");
    setText("trinket1SC", r1 ? Math.floor(r1.sc) : 0);
    setText("trinket2SC", r2 ? Math.floor(r2.sc) : 0);
    setText("bothResult", rBoth ? fmt(rBoth.time) : "-");
    setText("bothSC", rBoth ? Math.floor(rBoth.sc) : 0);

    if (state.travel) {
        setDisplay("travelInfo", "block");
        setText("travelTimeDisplay", (rBoth ? rBoth.travel : rNone.travel).toFixed(1));
        setText("extractOnlyDisplay", (rBoth ? rBoth.extraction : rNone.extraction).toFixed(1));
        var warnings = [];
        if (state.debuffs.ichorLeak) warnings.push("ICHOR LEAK IS ACTIVE.");
        if (state.debuffs.twistedBrusha) warnings.push("TWISTED BRUSHA IS VANDALIZING MACHINES.");
        if (toonName() === "Squirm" && state.toonOptions.squirmEatBooks) warnings.push("SQUIRM IS EATING BOOKS DURING TRAVEL.");
        if (toonName() === "Shelly" && state.toonOptions.teammateShelly) warnings.push("PHANTOM FRIEND IS DOUBLING YOUR MOVEMENT SPEED BUFF.");
        setText("travelWarnings", warnings.join(" "));
    } else {
        setDisplay("travelInfo", "none");
    }

    updateSpeedPreview();
}

function getDisplaySpeeds() {
    currentLuckyStat = state.coinLock === "random" ? "None" : state.coinLock;
    var walk = getWalkSpeed(state.trinkets, [], false);
    var run = getRunSpeed(state.trinkets, [], false);
    var panicWalk = getWalkSpeed(state.trinkets, [], true);
    var panicRun = getRunSpeed(state.trinkets, [], true);
    var regen = getRegen(state.trinkets, false, []);
    var stamina = getMaxStamina(state.trinkets, []);
    return {
        walk: walk,
        run: run,
        panicWalk: panicWalk,
        panicRun: panicRun,
        tap: getTapSpeed(walk, run, regen),
        stamina: stamina,
        regen: regen
    };
}

function updateSpeedPreview() {
    var speeds = getDisplaySpeeds();
    setText("walkSpeed", speeds.walk.toFixed(2));
    setText("runSpeed", speeds.run.toFixed(2));
    setText("tapSpeed", speeds.tap.toFixed(2));
    setText("staminaDisplay", speeds.stamina.toFixed(0));
    setText("regenDisplay", speeds.regen.toFixed(1));
    renderTwistedComparison(speeds);
}

function refreshPreview() {
    state.trinkets = getSelectedTrinkets();
    state.players = getInt("players", 1);
    if (state.toon && state.toon.name === "Boxten") {
        var boxtenPlayers = $("boxtenPlayers");
        if (boxtenPlayers) boxtenPlayers.value = state.players;
    }
    state.health = getInt("health", 3);
    state.dyleCheck = getChecked("dyleCheck");
    state.consistentCoin = getChecked("consistent");
    state.twistedFilter = getVal("twistedFilter", "all");
    state.twistedSort = getVal("twistedSort", "speed");
    state.coinLock = getVal("coinLock", "random");
    state.ally.shelly = getChecked("Shelly");
    state.ally.brusha = getChecked("BrushaBoost");
    state.ally.bobette = getChecked("BobetteBuff");
    state.ally.gourdyRandom = getChecked("GourdyRandom");
    state.ally.gourdySugarRush = getChecked("GourdySugarRush");
    state.debuffs.illness = getInt("debuffIllness", 0);
    state.debuffs.slow = getInt("debuffSlow", 0);
    state.debuffs.tired = getInt("debuffTired", 0);
    state.debuffs.confused = getInt("debuffConfused", 0);
    state.debuffs.ichorLeak = getChecked("ichorLeak");
    state.debuffs.twistedBrusha = getChecked("twistedBrusha");
    state.debuffs.twistedShelly = getChecked("twistedShelly");
    state.debuffs.springFever = getChecked("springFever");
    state.debuffs.twistedBassie = getVal("twistedBassie", "none");
    state.debuffs.trickOrTreat = getVal("trickOrTreat", "none");
    updateSpeedPreview();
}

function getPanicSpeed(tw) {
    if (state.suppressionCard) {
        if (tw.suppression !== undefined) return tw.suppression;
        return Math.floor((tw.chase * 1.15 + 1e-9) * 100) / 100;
    }
    return tw.panic;
}

function getPanicMin(tw) {
    if (tw.chaseMin === undefined) return undefined;
    if (state.suppressionCard) return Math.floor((tw.chaseMin * 1.15 + 1e-9) * 100) / 100;
    return tw.panicMin;
}

var TWISTED_COLORS = {
    purple: "#6a1b9a",
    blue: "#1565c0",
    orange: "#e65100",
    pink: "#c2185b",
    red: "#b71c1c",
    gray: "#3a3a4a"
};

var DEMON_NAMES = [
    "Twisted Brusha",
    "Twisted Glisten",
    "Twisted Flutter",
    "Twisted Flyte",
    "Twisted Shelly",
    "Twisted Pebble",
    "Twisted Bassie",
    "Twisted Gourdy",
    "Twisted Ginger"
];

var RARITY_RANK = { Common: 0, Uncommon: 1, Rare: 2, Main: 3, Lethal: 4 };

function parseAttention(value) {
    var n = parseFloat(value);
    return isNaN(n) ? Infinity : n;
}

function getNormalCategory(speeds, chaseSpeed) {
    if (speeds.walk >= chaseSpeed) return "blue";
    if (speeds.tap >= chaseSpeed) return "orange";
    if (speeds.run >= chaseSpeed) return "pink";
    return "red";
}

function getPanicCategory(speeds, panicSpeed) {
    if (speeds.panicWalk >= panicSpeed) return "purple";
    if (speeds.walk >= panicSpeed) return "blue";
    if (speeds.tap >= panicSpeed) return "orange";
    if (speeds.run >= panicSpeed) return "pink";
    return "red";
}

function renderTwistedComparison(speeds) {
    var container = $("twistedContainer");
    if (!container) return;
    container.innerHTML = "";
    setDisplay("suppressionNote", state.suppressionCard ? "block" : "none");
    var list = TWISTEDS.slice();
    if (state.twistedFilter === "demons") {
        list = list.filter(function (tw) { return DEMON_NAMES.indexOf(tw.name) >= 0; });
    } else if (state.twistedFilter !== "all") {
        list = list.filter(function (tw) { return tw.rarity === state.twistedFilter; });
    }
    if (state.twistedSort === "rarity") {
        list.sort(function (a, b) {
            var ra = RARITY_RANK[a.rarity] === undefined ? 9 : RARITY_RANK[a.rarity];
            var rb = RARITY_RANK[b.rarity] === undefined ? 9 : RARITY_RANK[b.rarity];
            if (ra !== rb) return ra - rb;
            return b.chase - a.chase;
        });
    } else if (state.twistedSort === "attention") {
        list.sort(function (a, b) {
            var aa = parseAttention(a.attention);
            var ba = parseAttention(b.attention);
            if (aa !== ba) return aa - ba;
            return b.chase - a.chase;
        });
    } else if (state.twistedSort === "annoying") {
        list.sort(function (a, b) {
            var ai = DEMON_NAMES.indexOf(a.name);
            var bi = DEMON_NAMES.indexOf(b.name);
            if (ai >= 0 && bi >= 0) return ai - bi;
            if (ai >= 0) return -1;
            if (bi >= 0) return 1;
            return b.chase - a.chase;
        });
    } else {
        list.sort(function (a, b) {
            if (a.static && !b.static) return 1;
            if (!a.static && b.static) return -1;
            return b.chase - a.chase;
        });
    }
    for (var i = 0; i < list.length; i++) {
        var tw = list[i];
        var panicSpeed = getPanicSpeed(tw);
        var panicMin = getPanicMin(tw);
        var panicLabel = state.suppressionCard ? "Suppr." : "Panic";
        var box = document.createElement("div");
        box.className = "twisted-box";
        box.title = "Rarity: " + tw.rarity + " | Attention: " + tw.attention + (state.suppressionCard ? " | Suppression Card active" : "");
        var cls = "gray";
        if (!tw.static) {
            var leftCls = getNormalCategory(speeds, tw.chase);
            var rightCls = getPanicCategory(speeds, panicSpeed);
            if (speeds.panicWalk >= panicSpeed && speeds.walk >= tw.chase) {
                cls = "purple";
            } else if (leftCls === rightCls) {
                cls = leftCls;
            } else {
                cls = "split";
                box.style.background = "linear-gradient(90deg, " + TWISTED_COLORS[leftCls] + " 0%, " + TWISTED_COLORS[leftCls] + " 50%, " + TWISTED_COLORS[rightCls] + " 50%, " + TWISTED_COLORS[rightCls] + " 100%)";
            }
        }
        box.classList.add(cls);
        var name = document.createElement("span");
        name.className = "twisted-name";
        name.innerHTML = tw.name + (tw.sub ? ' <span class="twisted-sub">(' + tw.sub + ')</span>' : '');
        box.appendChild(name);
        if (tw.static) {
            var staticSpan = document.createElement("span");
            staticSpan.className = "twisted-stat";
            staticSpan.textContent = "Static";
            box.appendChild(staticSpan);
        } else {
            var walkText = tw.roamMin !== undefined ? tw.roamMin + " to " + tw.roam : tw.roam;
            var runText = tw.chaseMin !== undefined ? tw.chaseMin + " to " + tw.chase : tw.chase;
            var panicText = panicMin !== undefined ? panicMin + " to " + panicSpeed : panicSpeed;
            var walkSpan = document.createElement("span");
            walkSpan.className = "twisted-stat";
            walkSpan.innerHTML = '<span class="twisted-stat-label">Walk</span> ' + walkText;
            var runSpan = document.createElement("span");
            runSpan.className = "twisted-stat";
            runSpan.innerHTML = '<span class="twisted-stat-label">Run</span> ' + runText + '<br><span class="twisted-sub">' + panicLabel + ' ' + panicText + '</span>';
            var attentionSpan = document.createElement("span");
            attentionSpan.className = "twisted-stat";
            attentionSpan.innerHTML = '<span class="twisted-stat-label">Attention</span> ' + tw.attention;
            box.appendChild(walkSpan);
            box.appendChild(runSpan);
            box.appendChild(attentionSpan);
        }
        container.appendChild(box);
    }
}

// ===== UI RENDERING =====
function renderToonGrid() {
    var grid = $("toonGrid");
    if (!grid) return;
    grid.innerHTML = "";
    for (var i = 0; i < TOONS.length; i++) {
        var t = TOONS[i];
        var div = document.createElement("div");
        div.className = "preset";
        div.setAttribute("data-toon", t.name);
        div.setAttribute("title", t.name);
        div.setAttribute("onclick", "selectToon('" + t.name.replace(/'/g, "\\'") + "')");
        var img = document.createElement("img");
        img.src = "assets/Toons/" + t.img;
        img.alt = t.name;
        div.appendChild(img);
        grid.appendChild(div);
    }
    layoutToonGrid();
}

function layoutFlexGrid(container, count, cellSize, gap) {
    if (!container) return;
    var parent = container.parentElement;
    if (!parent) return;
    var parentStyle = window.getComputedStyle(parent);
    var paddingLeft = parseFloat(parentStyle.paddingLeft) || 0;
    var paddingRight = parseFloat(parentStyle.paddingRight) || 0;
    var width = parent.clientWidth - paddingLeft - paddingRight;
    if (!width || width < cellSize) return;
    var maxCols = Math.max(1, Math.floor((width + gap) / (cellSize + gap)));
    var cols = Math.min(maxCols, count);
    if (maxCols >= 3 && count > 3) {
        var bestScore = Infinity;
        for (var c = maxCols; c >= 3; c--) {
            var rows = Math.ceil(count / c);
            var remainder = count % c;
            var shortfall = remainder === 0 ? 0 : c - remainder;
            var score = rows * 2 + shortfall;
            if (score < bestScore || (score === bestScore && remainder === 0)) {
                bestScore = score;
                cols = c;
            }
        }
    }
    container.style.maxWidth = (cols * (cellSize + gap) - gap) + "px";
    container.style.marginLeft = "auto";
    container.style.marginRight = "auto";
}

function layoutToonGrid() {
    layoutFlexGrid($("toonGrid"), TOONS.length, 48, 4);
}

function layoutTrinketGrid() {
    layoutFlexGrid($("trinketGrid"), TRINKETS.length, 50, 4);
}

function layoutItemGrid() {
    layoutFlexGrid($("itemCardsGrid"), Object.keys(CONSUMABLES).length, 72, 6);
}

function layoutAllGrids() {
    layoutToonGrid();
    layoutTrinketGrid();
    layoutItemGrid();
}

function renderTrinketGrid() {
    var grid = $("trinketGrid");
    if (!grid) return;
    grid.innerHTML = "";
    for (var i = 0; i < TRINKETS.length; i++) {
        var t = TRINKETS[i];
        var div = document.createElement("div");
        div.className = "trinket";
        div.setAttribute("title", t.desc);
        div.setAttribute("onclick", "selectTrinket('" + t.name.replace(/'/g, "\\'") + "', this)");
        var img = document.createElement("img");
        img.src = "assets/items/" + t.img;
        img.alt = t.name;
        div.appendChild(img);
        grid.appendChild(div);
    }
    setTimeout(layoutTrinketGrid, 0);
}

function renderItemCards() {
    var container = $("itemCardsGrid");
    if (!container) return;
    container.innerHTML = "";
    for (var key in CONSUMABLES) {
        var def = CONSUMABLES[key];
        var card = document.createElement("div");
        card.className = "item-card";
        card.setAttribute("data-key", key);
        card.innerHTML =
            '<img src="assets/items/' + def.img + '" alt="' + def.name + '" onerror="this.style.display=\'none\'">' +
            '<span class="item-name">' + def.name + '</span>' +
            '<input type="number" class="item-count" id="item_' + key + '" value="0" min="0">';
        container.appendChild(card);
    }
    container.addEventListener("click", function (e) {
        if (e.target.tagName === "INPUT") return;
        var card = e.target.closest(".item-card");
        if (card) incrementItem(card.getAttribute("data-key"));
    });
    container.addEventListener("change", function (e) {
        if (e.target.classList.contains("item-count")) updateItemCounts();
    });
    setTimeout(layoutItemGrid, 0);
}

function renderToonOptions() {
    var box = $("toonOptions");
    var group = $("toonSpecificGroup");
    var healthRow = $("healthRow");
    if (!box) return;
    box.innerHTML = "";
    if (!state.toon) {
        if (group) group.classList.add("hidden");
        if (healthRow) healthRow.classList.add("hidden");
        return;
    }
    if (group) group.classList.add("hidden");
    if (healthRow) {
        if (state.toon.name === "Looey") healthRow.classList.remove("hidden");
        else healthRow.classList.add("hidden");
    }

    var html = "";
    var def = getAbility();
    if (def) {
        var effectiveCd = def.cooldown > 0 ? Math.max(0, def.cooldown - state.cooldownCards * 5) : 0;
        var cdText = effectiveCd > 0 ? ' (' + effectiveCd + 's cooldown)' : ' (no cooldown)';
        var autoText = def.type === "manual" ? ' - not auto-cast' : '';
        html += '<div class="ability-note">Ability: ' + def.name + cdText + autoText + '</div>';
    } else if (state.toon.name === "Boxten") {
        html += '<div class="ability-note">Passive: Wind-Up</div>';
    } else {
        html += '<div class="ability-note">Passive only.</div>';
    }
    if (def && def.noPeppermint) {
        html += '<div class="option-note">' + def.noPeppermintReason + '</div>';
    }

    if (state.toon.name === "Boxten") {
        html += '<div class="option-note"><strong>PEOPLE STILL DONT KNOW BOXTEN GOT BUFFED LIKE 9 MONTHS AGO</strong><br>Gains 6% more Extraction Speed for every alive Toon, <strong>Mutilative</strong> 0-59.4% bonus</div>';
        html += '<div class="option-row"><label for="boxtenPlayers">Players:</label><input type="number" id="boxtenPlayers" min="1" max="8" value="' + state.players + '" oninput="setToonOption(\'boxtenPlayers\', parseInt(this.value)||1)"></div>';
    }
    if (state.toon.name === "Looey") {
        html += '<div class="option-note">Heart of Helium: each missing heart gives 20% more Walk and Run Speed. Set Health in Stats.</div>';
    }
    if (state.toon.name === "Shelly") {
        html += checkboxRow("shellyMS", "Shelly MS Buff (after machine)", state.toonOptions.shellyMS !== false, "Problem Solver: Shelly gains a 25% Movement Speed boost for 10 seconds when any Machine is completed.");
        html += checkboxRow("teammateShelly", "Phantom friend!", state.toonOptions.teammateShelly === true, "Pretends there are 2 Shellies completing machines at the same time, doubling your movement speed buff. This is the old Teammate Shelly option.");
    }
    if (state.toon.name === "Finn") {
        html += checkboxRow("finnPassive", "Reel In (+35% MS after machine)", state.toonOptions.finnPassive !== false, "Finn gains a 35% Movement Speed boost for 10 seconds when any Machine is completed.");
        html += checkboxRow("phantomFriend", "Phantom friend!", state.toonOptions.phantomFriend === true, "Pretends there are 2 Finns completing machines at the same time, doubling your movement speed buff.");
    }
    if (state.toon.name === "Squirm") {
        html += checkboxRow("squirmEatBooks", "Eat Books While Traveling (Squirm)", state.toonOptions.squirmEatBooks === true, "Squirm eats books during travel (50% slower) and gains +100% extraction for 10 seconds every 2 machines. Requires Travel.");
        html += checkboxRow("squirmBookshelves", "Eat Bookshelves While Traveling (Squirm)", state.toonOptions.squirmBookshelves === true, "While traveling, each second has a 33% chance to reduce your Ability cooldown by an extra second. That averages to 1.33x cooldown recovery instead of the canonical 2x. Requires Travel.");
    }
    if (state.toon.name === "Eclipse") {
        html += checkboxRow("eclipseBlackout", "Eclipse Blackout (+20% MS, +60% stam yes it is.)", state.toonOptions.eclipseBlackout === true, "Eclipse gets +20% Movement Speed and +60% max Stamina during Blackouts.");
    }
    if (state.toon.name === "Ribecca") {
        html += '<div class="option-note">The Undead: immune to all debuffs. During Ichor Leak she gains a random 10% buff before each machine. Stealth rolls do nothing. Stamina is regeneration only.</div>';
    }
    if (state.toon.name === "Tisha") {
        html += '<div class="option-note">Tidy Up!: Tisha cleans Ichor Puddles, so she ignores Ichor Leak in the calculator.</div>';
    }
    if (state.toon.name === "Toodles") {
        html += checkboxRow("toodlesAutoCast", "Auto-cast Beginner's Luck (25s)", state.toonOptions.toodlesAutoCast !== false, "Toodles automatically uses her Ability whenever it is ready.");
    }
    if (state.toon.name === "Soulvester") {
        html += checkboxRow("soulvesterProtecting", "Protecting (+1 MS Star)", state.toonOptions.soulvesterProtecting === true, "Soulvester gets a 1 Star Movement Speed boost while guarding.");
    }
    if (state.toon.name === "Yatta") {
        html += '<div class="option-row"><label for="yattaCandySlots">Piñata Party candy slots (0-3):</label><input type="number" id="yattaCandySlots" min="0" max="3" value="' + (state.toonOptions.yattaCandySlots || 0) + '" oninput="setToonOption(\'yattaCandySlots\', parseInt(this.value)||0)"></div>';
        html += '<div class="option-note">0 is off. Each completed machine drops 2 random candy items (no BonBons). Stored candy is used before the next machine.</div>';
    }
    if (state.toon.name === "Waxwell") {
        html += checkboxRow("waxwellAutoIgnite", "Auto-ignite (60s)", state.toonOptions.waxwellAutoIgnite !== false, "Waxwell automatically uses Ignite whenever it is ready. Ignite removes Tired II for 10 seconds.");
        html += '<div class="option-note">Waxwell constantly has Tired II unless Ignite is active.</div>';
    }
    if (state.toon.name === "Razzle & Dazzle") {
        var parity = state.toonOptions.razzleParity || "odd";
        html += '<div class="option-row"><label for="razzleParity">Floor parity:</label><select id="razzleParity" onchange="setToonOption(\'razzleParity\', this.value)">' +
            '<option value="odd"' + (parity === "odd" ? " selected" : "") + '>Odd floor (5 speed, 1 extraction)</option>' +
            '<option value="even"' + (parity === "even" ? " selected" : "") + '>Even floor (1 speed, 5 extraction)</option>' +
            '</select></div>';
    }
    if (state.toon.name === "Brusha") {
        html += '<div class="option-note">Artistic Inspiration is not auto-cast. Use the Brusha Boost Ally Buff for the reworked always-on machine buff.</div>';
    }
    if (state.toon.name === "Gourdy") {
        html += '<div class="option-note">Trick or Treat is auto-used every 35 seconds. The Ally Buff Gourdy Random Boost represents a teammate Gourdy.</div>';
    }
    if (state.toon.name === "Waxwell" || state.toon.name === "Toodles" || state.toon.name === "Gourdy" || state.toon.name === "Shelly" || state.toon.name === "Squirm") {
        html += '<div class="option-note">Active Abilities are used automatically when their cooldown reaches 0.</div>';
    }
    box.innerHTML = html;
}

function checkboxRow(id, label, checked, tooltip) {
    return '<div class="option-row"><label><input type="checkbox" id="' + id + '" onchange="setToonOption(\'' + id + '\', this.checked)"' + (checked ? " checked" : "") + '> ' + label +
        ' <span class="tt">?<span class="tt-text">' + tooltip + '</span></span></label></div>';
}

function setToonOption(key, value) {
    if (key === "yattaCandySlots") value = clamp(parseInt(value, 10) || 0, 0, 3);
    if (key === "boxtenPlayers") {
        value = clamp(parseInt(value, 10) || 1, 1, 8);
        state.players = value;
        var playerInput = $("players");
        if (playerInput) playerInput.value = value;
    }
    state.toonOptions[key] = value;
    if (key === "razzleParity") {
        if (value === "odd") {
            state.speed = 5;
            state.extraction = 1;
        } else if (value === "even") {
            state.speed = 1;
            state.extraction = 5;
        } else {
            state.speed = 5;
            state.extraction = 1;
        }
        updateStatsDisplay();
    }
    if (key === "soulvesterProtecting") {
        state.speed = value ? 2 : 1;
        updateStatsDisplay();
    }
    if (key === "eclipseBlackout") {
        updateStatsDisplay();
    }
    refreshPreview();
}

function selectToon(name) {
    var toon = null;
    for (var i = 0; i < TOONS.length; i++) {
        if (TOONS[i].name === name) {
            toon = TOONS[i];
            break;
        }
    }
    if (!toon) return;
    state.toon = toon;
    state.skill = toon.skill;
    state.extraction = toon.extraction;
    state.speed = toon.speed;
    state.stamina = toon.stamina;
    state.health = toon.health;
    state.toonOptions = {
        shellyMS: true,
        teammateShelly: false,
        finnPassive: true,
        phantomFriend: false,
        squirmEatBooks: false,
        squirmBookshelves: false,
        eclipseBlackout: false,
        toodlesAutoCast: true,
        soulvesterProtecting: false,
        yattaCandySlots: 0,
        waxwellAutoIgnite: true,
        razzleParity: "odd"
    };
    if (toon.name === "Soulvester") state.speed = 1;
    if (toon.name === "Razzle & Dazzle") {
        state.speed = 5;
        state.extraction = 1;
    }
    updateStatsDisplay();
    renderToonOptions();
    var top = $("topImage");
    if (top) top.src = "assets/Toons/" + toon.img;
    var presets = document.querySelectorAll(".preset");
    for (var j = 0; j < presets.length; j++) {
        presets[j].classList.toggle("active", presets[j].getAttribute("data-toon") === name);
    }
    var btn = $("extract");
    if (btn) btn.textContent = "Calculate (" + toon.name.toUpperCase() + ")";
    var health = $("health");
    if (health) health.value = state.health;
    refreshPreview();
}

function updateStatsDisplay() {
    var stats = getToonStats();
    updateStars("skillStars", stats.skill);
    updateStars("extractionStars", stats.extraction);
    updateStars("movementSpeedStars", stats.speed);
    updateStars("staminaStars", stats.stamina);
    var healthRow = $("healthRow");
    if (healthRow) {
        if (state.toon && state.toon.name === "Looey") healthRow.classList.remove("hidden");
        else healthRow.classList.add("hidden");
    }
}

function setSkill(s) { state.skill = s; updateStatsDisplay(); refreshPreview(); }
function setExtraction(s) { state.extraction = s; updateStatsDisplay(); refreshPreview(); }
function setMovementSpeed(s) { state.speed = s; updateStatsDisplay(); refreshPreview(); }
function setStamina(s) { state.stamina = s; updateStatsDisplay(); refreshPreview(); }

function updateStars(id, stars) {
    var el = $(id);
    if (!el) return;
    var children = el.children;
    for (var i = 0; i < children.length; i++) {
        children[i].src = i < stars ? "assets/star-on.png" : "assets/star-off.png";
    }
}

function setExtractionCard(c) {
    state.extractionCards = state.extractionCards === c ? 0 : c;
    updateCards("extractionCardsEl", state.extractionCards);
    refreshPreview();
}
function setStaminaCard(c) {
    state.staminaCards = state.staminaCards === c ? 0 : c;
    updateCards("staminaCardsEl", state.staminaCards);
    refreshPreview();
}
function setCooldownCard(c) {
    state.cooldownCards = state.cooldownCards === c ? 0 : c;
    updateCards("cooldownCardsEl", state.cooldownCards);
    if (state.toon) renderToonOptions();
}

function setSuppressionCard() {
    state.suppressionCard = !state.suppressionCard;
    updateCards("suppressionCardEl", state.suppressionCard ? 1 : 0);
    refreshPreview();
}
function updateCards(id, count) {
    var el = $(id);
    if (!el) return;
    var children = el.children;
    for (var i = 0; i < children.length; i++) {
        children[i].src = i < count ? "assets/extract-on.png" : "assets/extract-off.png";
    }
}

function selectTrinket(name, element) {
    var slots = document.querySelectorAll(".selected-trinket");
    var img = element ? element.querySelector("img") : null;
    if (!img) return;
    for (var i = 0; i < slots.length; i++) {
        if (!slots[i].classList.contains("has-image")) {
            var newImg = document.createElement("img");
            newImg.src = img.src;
            newImg.alt = name;
            slots[i].appendChild(newImg);
            slots[i].classList.add("has-image");
            updateTrinketNames();
            refreshPreview();
            break;
        }
    }
}

function removeTrinket(el) {
    el.innerHTML = "";
    el.classList.remove("has-image");
    updateTrinketNames();
    refreshPreview();
}

function updateTrinketNames() {
    var imgs = document.querySelectorAll(".selected-trinket.has-image img");
    setText("trinket1Name", imgs[0] ? imgs[0].alt : "None");
    setText("trinket2Name", imgs[1] ? imgs[1].alt : "None");
}

function getSelectedTrinkets() {
    var imgs = document.querySelectorAll(".selected-trinket.has-image img");
    var out = [];
    for (var i = 0; i < imgs.length; i++) out.push(imgs[i].alt);
    return out;
}

function toggleSection(id) {
    var sec = $(id);
    if (!sec) return;
    var btn = sec.previousElementSibling;
    if (sec.style.display === "none" || sec.style.display === "") {
        sec.style.display = "block";
        if (btn) btn.classList.add("open");
        if (id === "trinketSection") setTimeout(layoutTrinketGrid, 0);
        if (id === "itemsSection") setTimeout(layoutItemGrid, 0);
    } else {
        sec.style.display = "none";
        if (btn) btn.classList.remove("open");
    }
}

function incrementItem(key) {
    var el = $("item_" + key);
    if (el) el.value = parseInt(el.value || 0, 10) + 1;
    updateItemCounts();
}

function updateItemCounts() {
    var count = 0;
    for (var key in CONSUMABLES) {
        var el = $("item_" + key);
        if (el && parseInt(el.value, 10) > 0) count++;
    }
    setText("selectedItemCount", count);
}

function getItemCounts() {
    var counts = {};
    for (var key in CONSUMABLES) {
        var el = $("item_" + key);
        counts[key] = el ? (parseInt(el.value, 10) || 0) : 0;
    }
    return counts;
}

function toggleDistMode() {
    state.evenDist = getChecked("evenDistCheck");
    setDisplay("evenDistSection", state.evenDist ? "block" : "none");
    setDisplay("customDistSection", state.evenDist ? "none" : "block");
    updateMachineDistribution();
}

function updateMachineDistribution() {
    state.evenDist = getChecked("evenDistCheck");
    if (state.evenDist) {
        state.totalMachines = getInt("totalMachinesInput", 4);
        var s = Math.floor(state.totalMachines / 4);
        var c = Math.floor(state.totalMachines / 4);
        var b = Math.floor(state.totalMachines / 4);
        var t = state.totalMachines - s - c - b;
        setText("totalMachinesDisplay", state.totalMachines + " (S:" + s + " C:" + c + " B:" + b + " T:" + t + ")");
    } else {
        state.machines.stripe = getInt("stripeMachineCount", 0);
        state.machines.circle = getInt("circleMachineCount", 0);
        state.machines.barnaby = getInt("barnabyMachineCount", 0);
        state.machines.treadmill = getInt("treadmillMachineCount", 0);
        setText("totalMachinesDisplay", state.machines.stripe + state.machines.circle + state.machines.barnaby + state.machines.treadmill);
    }
}

function updateDebuffControls() {
    state.debuffs.illness = getInt("debuffIllness", 0);
    state.debuffs.slow = getInt("debuffSlow", 0);
    state.debuffs.tired = getInt("debuffTired", 0);
    state.debuffs.confused = getInt("debuffConfused", 0);
    state.debuffs.twistedBassie = getVal("twistedBassie", "none");
    state.debuffs.trickOrTreat = getVal("trickOrTreat", "none");
    refreshPreview();
}

function syncStateFromUI() {
    state.players = getInt("players", 1);
    state.health = getInt("health", 3);
    state.dyleCheck = getChecked("dyleCheck");
    state.consistentCoin = getChecked("consistent");
    state.twistedFilter = getVal("twistedFilter", "all");
    state.twistedSort = getVal("twistedSort", "speed");
    state.coinLock = getVal("coinLock", "random");
    state.gourdyLock = getVal("gourdyLock", "random");
    state.travel = getChecked("enableTravel");
    state.distance = getNum("distanceInput", 8);
    state.accuracy = getNum("accuracyInput", 80) / 100;
    state.goated = getChecked("goatedAccuracy");
    state.itemRefill = getInt("itemRefill", 3);
    state.extractionCards = state.extractionCards;
    state.staminaCards = state.staminaCards;
    state.ally.shelly = getChecked("Shelly");
    state.ally.brusha = getChecked("BrushaBoost");
    state.ally.bobette = getChecked("BobetteBuff");
    state.ally.gourdyRandom = getChecked("GourdyRandom");
    state.ally.gourdySugarRush = getChecked("GourdySugarRush");
    state.debuffs.ichorLeak = getChecked("ichorLeak");
    state.debuffs.twistedBrusha = getChecked("twistedBrusha");
    state.debuffs.twistedShelly = getChecked("twistedShelly");
    state.debuffs.springFever = getChecked("springFever");
    updateDebuffControls();
    state.evenDist = getChecked("evenDistCheck");
    if (!state.evenDist) {
        state.machines.stripe = getInt("stripeMachineCount", 0);
        state.machines.circle = getInt("circleMachineCount", 0);
        state.machines.barnaby = getInt("barnabyMachineCount", 0);
        state.machines.treadmill = getInt("treadmillMachineCount", 0);
    } else {
        state.totalMachines = getInt("totalMachinesInput", 4);
    }
    state.trinkets = getSelectedTrinkets();
    state.consumables = getItemCounts();
}

function help() { setDisplay("helpModal", "flex"); }
function closeHelp() { setDisplay("helpModal", "none"); }

// ===== INIT =====
document.addEventListener("DOMContentLoaded", function () {
    try {
        var muteBtn = $("muteBtn");
        if (muteBtn) muteBtn.textContent = state.muted ? "🔇" : "🔊";
        initAudio();
        var unlockAudio = function () {
            if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
        };
        document.addEventListener("pointerdown", unlockAudio, { once: true });
        document.addEventListener("keydown", unlockAudio, { once: true });
        document.addEventListener("mouseover", unlockAudio, { once: true });
        setSkill(1);
        setExtraction(1);
        setMovementSpeed(1);
        setStamina(3);
        renderToonGrid();
        renderTrinketGrid();
        renderItemCards();
        updateMachineDistribution();
        updateDebuffControls();
        updateStatsDisplay();
        refreshPreview();

        var settingsPanel = document.querySelector(".settings");
        if (settingsPanel) {
            settingsPanel.addEventListener("change", refreshPreview);
            settingsPanel.addEventListener("input", function (e) {
                if (e.target && e.target.type === "number") refreshPreview();
            });
        }

        var soundSelector = ".preset, .trinket, .item-card, .star, .card, .section-toggle, button, select, input[type='checkbox'], .tt";
        var lastHover = null;
        document.addEventListener("mouseover", function (e) {
            var el = e.target.closest(soundSelector);
            if (!el || el === lastHover) return;
            lastHover = el;
            playHover();
        });
        document.addEventListener("mouseout", function (e) {
            if (lastHover && !lastHover.contains(e.relatedTarget)) lastHover = null;
        });
        document.addEventListener("click", function (e) {
            if (e.target.closest(soundSelector)) playSelect();
        });
        document.addEventListener("change", function (e) {
            if (e.target.closest(soundSelector)) playSelect();
        });

        document.addEventListener("click", function (e) {
            var allTT = document.querySelectorAll(".tt.tt-active");
            for (var j = 0; j < allTT.length; j++) allTT[j].classList.remove("tt-active");
            var tt = e.target.closest(".tt");
            if (tt) {
                e.stopPropagation();
                tt.classList.add("tt-active");
            }
        });

        window.addEventListener("resize", function () {
            clearTimeout(window.__dwResize);
            window.__dwResize = setTimeout(layoutAllGrids, 80);
        });
    } catch (err) {
        console.error("Init error:", err);
    }
});
