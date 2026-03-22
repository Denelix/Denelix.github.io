// ============================================================
// DW Calculator v2.0 - Extraction.js (FIXED)
// ============================================================

// ===== SAFE DOM HELPERS =====
function $(id) { return document.getElementById(id); }
function setText(id, val) { var el = $(id); if (el) el.textContent = String(val); }
function setDisplay(id, val) { var el = $(id); if (el) el.style.display = val; }
function getVal(id, def) { var el = $(id); return el ? el.value : String(def); }
function getChecked(id) { var el = $(id); return el ? el.checked : false; }
function getNum(id, def) { return parseFloat(getVal(id, String(def))) || def; }
function getInt(id, def) { return parseInt(getVal(id, String(def))) || def; }

// ===== GLOBAL STATE =====
var extractionSpeed = 1;
var movementSpeed = 1;
var skillCheck = 1;
var staminaStar = 3;
var consistentCoin = false;
var consistentCoinLock = "random";
var gourdyBoostLock = "random";
var tests = 1500;
var baseSkillCheckChance = 0.25;
var numberOfPlayers = 1;
var currentHealth = 3;
var goatedAccuracy = false;

var isBoxten = false;
var isLooey = false;
var isEggson = false;
var isBassie = false;
var isShelly = false;
var isSquirm = false;
var isGourdy = false;
var isEclipse = false;
var Ribecca = false;
var currentToonName = "";

var isShellyBoosted = false;
var isBrushaBoosted = false;
var isBobetteBuff = false;
var isGourdyRandomBoost = false;
var isGourdyPanicMS = false;
var isEclipseBlackout = false;
var isShellyMSBuff = false;
var isTeammateShelly = false;
var confusedLevel = 0;
var isTwistedFinn = false;

var extractionCards = 0;
var staminaCards = 0;
var isDyleCheck = false;

var stripeMachines = 1;
var circleMachines = 1;
var treadmillMachines = 1;
var useEvenDist = false;
var totalMachinesEven = 3;

var userAccuracy = 0.80;
var itemRefillRate = 3;
var enableTravel = false;
var distanceBetweenMachines = 8;
var squirmEatBooks = false;

var successfulSkillChecks = 0;
var luckyCoinStat = "None";
var totalTravelTime = 0;
var totalExtractionTime = 0;

// ===== STAT FUNCTIONS =====
function getPerSecondUnits(es)
{
    switch (es) 
	{
        case 1: return 0.75;
        case 2: return 0.85;
        case 3: return 1.0;
        case 4: return 1.2;
        case 5: return 1.5;
        default: return 1.0;
    }
}

function getWalkSpeed() { return movementSpeed * 2.5 + 7.5; }
function getRunSpeed() { return movementSpeed * 2.5 + 17.5; }
function getSkillCheckValue() { return 0.5 + (skillCheck * 0.5); }

function getMaxStamina(trinkets) 
{
    var max = 100 + staminaStar * 25;
    max += staminaCards * 10;
    if (isDyleCheck) max += 50;
    if (isEclipseBlackout && isEclipse) max += 50;
    if (trinkets.indexOf("Speedometer") >= 0) max += 15;
    if (trinkets.indexOf("Friendship Bracelet") >= 0) max += 5 * Math.max(1, numberOfPlayers);
    if (trinkets.indexOf("Cooler") >= 0) max += 50;
    return max;
}

function getBaseStaminaRegen(trinkets)
{
    var regen = 2.4;
    if (trinkets.indexOf("Star Pillow") >= 0) regen *= 2;
    if (isBobetteBuff) regen *= 1.5;
    return regen;
}

function getAccuracy(machineType)
{
    if (goatedAccuracy) return 1.0;
    var base = machineType === 'circle' ? 0.70 : userAccuracy;
    return Math.min(1.0, Math.max(0, base + (skillCheck - 3) * 0.15));
}

function getCooldownTime(machineType)
{
    return machineType === 'circle' ? 3 : 5;
}

function isImmune(trinkets) 
{
    return trinkets.indexOf("Train Whistle") >= 0 || Ribecca;
}

// ===== CONSUMABLE DICTIONARY =====
var CONSUMABLE_DEFS = 
{
    bonbon:             { name: "BonBon",              candy: true,  baseUses: 1, duration: 10,    img: "BonBon.webp" },
    boxChocolates:      { name: "Box o' Chocolates",   candy: true,  baseUses: 5, duration: 10,   img: "Box_o_Chocolates.webp" },
    valve:              { name: "Valve",                candy: false, baseUses: 1, duration: 0,    img: "Valve.webp" },
    pop:                { name: "Pop",                  candy: false, baseUses: 1, duration: 0,    img: "Pop.webp" },
    jumperCable:        { name: "Jumper Cable",         candy: false, baseUses: 1, duration: 0,    img: "Jumper_Cable.webp" },
    skillCheckCandy:    { name: "Skill Check Candy",    candy: true,  baseUses: 1, duration: 15,   img: "Skill_Check_Candy.webp" },
    extractionCandy:    { name: "Extraction Candy",     candy: true,  baseUses: 1, duration: 5,    img: "Extraction_Candy.webp" },
    instructionsScroll: { name: "Instructions Scroll",  candy: false, baseUses: 1, duration: 10, img: "Instructions_Scroll.webp" },
    proteinBar:         { name: "Protein Bar",          candy: false, baseUses: 1, duration: 15,   img: "Protein_Bar.webp" },
    speedCandy:         { name: "Speed Candy",          candy: true,  baseUses: 1, duration: 5,    img: "Speed_Candy.webp" },
    staminaCandy:       { name: "Stamina Candy",        candy: true,  baseUses: 1, duration: 20,   img: "Stamina_Candy.webp" },
    chocolate:          { name: "Chocolate",            candy: true,  baseUses: 1, duration: 10,   img: "Chocolate.webp" },
    gumballs:           { name: "Gumballs",             candy: true,  baseUses: 3, duration: 5,    img: "Gumballs.webp" },
    jawbreaker:         { name: "Jawbreaker",           candy: true,  baseUses: 1, duration: 20, img: "Jawbreaker.webp" }
};

function getItemCounts() 
{
    var counts = {};
    for (var key in CONSUMABLE_DEFS) 
	{
        counts[key] = getInt('item_' + key, 0);
    }
    return counts;
}

function createInventory(itemCounts, trinkets) 
{
    var inv = {};
    var hasFondant = trinkets.indexOf("Glazed Fondant Bag") >= 0;
    for (var key in itemCounts)
    {
        if (itemCounts[key] > 0 && CONSUMABLE_DEFS[key])
        {
            var def = CONSUMABLE_DEFS[key];
            var dur = def.duration;
            if (hasFondant && def.candy && dur > 0 && dur < 9999) dur += 4;
            inv[key] = { uses: itemCounts[key] * def.baseUses, baseDuration: dur };
        }
    }
    return inv;
}

function refillInventory(inv, itemCounts, trinkets) 
{
    var hasFondant = trinkets.indexOf("Glazed Fondant Bag") >= 0;
    for (var key in itemCounts) 
	{
        if (itemCounts[key] > 0 && CONSUMABLE_DEFS[key]) 
	
{
            var def = CONSUMABLE_DEFS[key];
            var dur = def.duration;
            if (hasFondant && def.candy && dur > 0 && dur < 9999) dur += 4;
            inv[key] = { uses: itemCounts[key] * def.baseUses, baseDuration: dur };
        }
    }
}

// ===== BUFF SYSTEM =====
function addBuff(buffs, type, value, duration) 
{
    if (type === 'stealth') return;
    buffs.push({ type: type, value: value, remaining: duration });
}

function getBuffMult(buffs, type) 
{
    var m = 1.0;
    for (var i = 0; i < buffs.length; i++) 
	{
        if (buffs[i].type === type) m *= buffs[i].value;
    }
    return m;
}

function getBuffAdd(buffs, type) 
{
    var s = 0;
    for (var i = 0; i < buffs.length; i++)
	{
        if (buffs[i].type === type) s += buffs[i].value;
    }
    return s;
}

//Reduces all buff durations by dt and removes expired ones.
//Uses splice() to mutate the array so the same reference
//persists across machines, allowing buffs (e.g. Stressball stacks for nowww)
//to carry over between machines and through walking time.
function tickBuffs(buffs, dt) 
{
    dt = dt || 1;
    for (var i = buffs.length - 1; i >= 0; i--) 
	{
        buffs[i].remaining -= dt;
        if (buffs[i].remaining <= 0) 
	
{
            buffs.splice(i, 1);
        }
    }
    return buffs;
}

function rollRandomStat() 
{
    var r = Math.floor(Math.random() * 5);
    return ['extractionMult', 'skillCheckBonus', 'speedMult', 'staminaRegenMult', 'stealth'][r];
}

function rollLockedStat(lock) 
{
    if (lock === 'Skill') return 'skillCheckBonus';
    if (lock === 'Extraction') return 'extractionMult';
    if (lock === 'MS') return 'speedMult';
    return rollRandomStat();
}

// ===== CONSUMABLE USAGE =====
function useExtractionConsumables(machineType, inv, buffs, trinkets) 
{
    if (inv.jawbreaker && inv.jawbreaker.uses > 0) 
	{
        inv.jawbreaker.uses--;
        var st = rollRandomStat();
        addBuff(buffs, st, st === 'skillCheckBonus' ? 0.75 : 1.75, inv.jawbreaker.baseDuration);
    }
    if (inv.gumballs && inv.gumballs.uses > 0) 
	{
        var u = Math.min(inv.gumballs.uses, 3);
        for (var i = 0; i < u; i++) 
	
{
            inv.gumballs.uses--;
            var st2 = rollRandomStat();
            addBuff(buffs, st2, st2 === 'skillCheckBonus' ? 0.10 : 1.10, inv.gumballs.baseDuration);
        }
    }
    if (inv.bonbon && inv.bonbon.uses > 0) 
	{
        inv.bonbon.uses--;
        addBuff(buffs, 'extractionMult', 1.5, inv.bonbon.baseDuration);
        addBuff(buffs, 'speedMult', 1.25, inv.bonbon.baseDuration);
    }
    if (inv.skillCheckCandy && inv.skillCheckCandy.uses > 0) 
	{
        inv.skillCheckCandy.uses--;
        addBuff(buffs, 'skillCheckBonus', 0.25, inv.skillCheckCandy.baseDuration);
    }
    if (inv.extractionCandy && inv.extractionCandy.uses > 0) 
	{
        inv.extractionCandy.uses--;
        addBuff(buffs, 'extractionMult', 1.5, inv.extractionCandy.baseDuration);
    }
    if (inv.instructionsScroll && inv.instructionsScroll.uses > 0) 
	{
        inv.instructionsScroll.uses--;
        addBuff(buffs, 'extractionMult', 2.0, inv.instructionsScroll.baseDuration);
    }
}

function useTreadmillConsumables(inv, buffs, trinkets) 
{
    var sg = 0;
    if (inv.jawbreaker && inv.jawbreaker.uses > 0) 
	{
        inv.jawbreaker.uses--;
        var st = rollRandomStat();
        addBuff(buffs, st, st === 'skillCheckBonus' ? 0.75 : 1.75, inv.jawbreaker.baseDuration);
    }
    if (inv.gumballs && inv.gumballs.uses > 0) 
	{
        var u = Math.min(inv.gumballs.uses, 3);
        for (var i = 0; i < u; i++) 
	
{
            inv.gumballs.uses--;
            var st2 = rollRandomStat();
            addBuff(buffs, st2, st2 === 'skillCheckBonus' ? 0.10 : 1.10, inv.gumballs.baseDuration);
        }
    }
    if (inv.speedCandy && inv.speedCandy.uses > 0) 
	{
        inv.speedCandy.uses--;
        addBuff(buffs, 'speedMult', 1.25, inv.speedCandy.baseDuration);
    }
    if (inv.staminaCandy && inv.staminaCandy.uses > 0) 
	{
        inv.staminaCandy.uses--;
        addBuff(buffs, 'staminaRegenMult', 1.5, inv.staminaCandy.baseDuration);
    }
    if (inv.proteinBar && inv.proteinBar.uses > 0) 
	{
        inv.proteinBar.uses--;
        addBuff(buffs, 'staminaRegenMult', 2.5, inv.proteinBar.baseDuration);
    }
    if (inv.chocolate && inv.chocolate.uses > 0) 
	{
        inv.chocolate.uses--;
        addBuff(buffs, 'walkSpeedMult', 1.2, inv.chocolate.baseDuration);
        sg += 25;
    }
    return sg;
}

// ===== LUCKY COIN ===== Old
function LuckyCoin() 
{
    if (consistentCoin) 
	{
        if (consistentCoinLock === 'random') 
	
{
            var r = Math.floor(Math.random() * 3);
            return ["Skill", "Extraction", "MS"][r];
        }
        return consistentCoinLock;
    }
    if (Math.random() < 0.4) 
	{
        var r2 = Math.floor(Math.random() * 3);
        return ["Skill", "Extraction", "MS"][r2];
    }
    return "None";
}

// ===== TWISTED LIST =====
var twisteds = [
    { name: "Twisted Boxten", speed: 18 },
    { name: "Twisted Shrimpo", speed: 16.5 },
    { name: "Twisted Tisha", speed: 18 },
    { name: "Twisted Cocoa", speed: 21 },
    { name: "Twisted Looey", speed: 18 },
    { name: "Twisted Toodles", speed: 20 },
    { name: "Twisted Brightney", speed: 18 },
    { name: "Twisted Teagan", speed: 18.5 },
    { name: "Twisted Finn", speed: 15.5 },
    { name: "Twisted Goob", speed: 16 },
    { name: "Twisted Scraps", speed: 16 },
    { name: "Twisted Flutter", speed: 18.5 },
    { name: "Twisted Glisten", speed: 24 },
    { name: "Twisted Gigi", speed: 19 },
    { name: "Twisted Astro", speed: 19 },
    { name: "Twisted Pebble", speed: 24 },
    { name: "Twisted Coal", speed: 15 },
    { name: "Twisted Ginger", speed: 15 },
    { name: "Twisted Rudie", speed: 18 },
    { name: "Twisted Bobette", speed: 25 },
    { name: "Twisted Coal-Blackout", speed: 25 },
    { name: "Twisted Vee", speed: 18 },
    { name: "Twisted Shelly", speed: 20 },
    { name: "Twisted Sprout", speed: 17 },
    { name: "Twisted Dandy", speed: 16.5 },
    { name: "Twisted Yatta", speed: 19 },
    { name: "Twisted Bassie", speed: 19 },
    { name: "Twisted Flyte", speed: 17 },
    { name: "Twisted Eggson", speed: 18 },
    { name: "Twisted Brusha", speed: 18 },
    { name: "Twisted Gourdy", speed: 26 },
    { name: "Twisted Soulvester", speed: 18 },
    { name: "Twisted Eclipse", speed: 19 },
    { name: "Twisted Ribecca", speed: 18 },
    { name: "Twisted Dyle", speed: 40 }
];
twisteds.sort(function(a, b) { return b.speed - a.speed; });

// ===== SIMULATION CORE =====
function generateMachineOrder()
{
    var s, c, t;
    if (useEvenDist)
    {
        var total = totalMachinesEven;
        s = Math.floor(total / 3);
        c = Math.floor(total / 3);
        t = total - s - c;
    } else
    {
        s = stripeMachines; c = circleMachines; t = treadmillMachines;
    }
    var machines = [];
    var i;
    for (i = 0; i < s; i++) machines.push('stripe');
    for (i = 0; i < c; i++) machines.push('circle');
    for (i = 0; i < t; i++) machines.push('treadmill');
    for (i = machines.length - 1; i > 0; i--)
    {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = machines[i]; machines[i] = machines[j]; machines[j] = tmp;
    }
    return machines;
}

function getTravelSpeed(trinkets, toMachineType, activeBuffs, isFirstTravel, afterMachine)
{
    var walk = getWalkSpeed();
    var run = getRunSpeed();
    var immune = isImmune(trinkets);

    if (trinkets.indexOf("Dog Plush") >= 0) walk *= 1.1;
    if (trinkets.indexOf("Lucky Coin") >= 0 && luckyCoinStat === "MS") { walk *= 1.12; run *= 1.12; }
    if (trinkets.indexOf("Pink Bow") >= 0) run *= 1.075;
    if (trinkets.indexOf("Ribbon Spool") >= 0 || trinkets.indexOf("Clown Horn") >= 0) { walk *= 1.1; run *= 1.1; }
    if (trinkets.indexOf("Speedy Shoes") >= 0) { walk *= 1.05; run *= 1.05; }
    if (trinkets.indexOf("Brick") >= 0 && !immune) { walk *= 0.9; run *= 0.9; }
    if (trinkets.indexOf("Coal") >= 0 && !immune) { walk *= 0.9; run *= 0.9; }
    if (trinkets.indexOf("Cooler") >= 0 && !immune) { walk *= 0.95; run *= 0.95; }

    var sMult = getBuffMult(activeBuffs, 'speedMult');
    var wMult = getBuffMult(activeBuffs, 'walkSpeedMult');
    walk *= sMult * wMult;
    run *= sMult;

    if (isEclipseBlackout && isEclipse) { walk *= 1.2; run *= 1.2; }
    if (isBobetteBuff) { walk *= 1.25; run *= 1.25; }
    if (isLooey && currentHealth < 3 && currentHealth > 0)
    {
        var b = 1 + 0.2 * (3 - currentHealth);
        walk *= b; run *= b;
    }
    if (isGourdyPanicMS && isFirstTravel) { walk *= 1.3; run *= 1.3; }
    if (isShellyMSBuff && isShelly && afterMachine) { run *= 1.25; walk *= 1.25; }
    if (isTeammateShelly && afterMachine) { run *= 1.25; walk *= 1.25; }
    if (isTwistedFinn && afterMachine && !immune) { walk *= 0.5; run *= 0.5; }

    if (toMachineType === 'treadmill') return walk;
    return run;
}

function calculateTravelTime(trinkets, toMachineType, activeBuffs, isFirstTravel, afterMachine)
{
    if (!enableTravel) return 0;
    var gameDist = distanceBetweenMachines * 15;
    var speed = getTravelSpeed(trinkets, toMachineType, activeBuffs, isFirstTravel, afterMachine);

    if (isSquirm && squirmEatBooks)

    {
        var remaining = gameDist;
        var time = 0;
        var eating = true;
        while (remaining > 0)
        {
            var phaseTime = 5;
            var phaseSpeed = eating ? speed * 0.5 : speed;
            var phaseDist = phaseSpeed * phaseTime;
            if (phaseDist >= remaining)
            {
                time += remaining / phaseSpeed;
                remaining = 0;
            } else
            {
                remaining -= phaseDist;
                time += phaseTime;
            }
            eating = !eating;
        }
        return time;
    }

    return speed > 0 ? gameDist / speed : 999;
}

function runSimulation(trinkets, itemCounts)
{
    successfulSkillChecks = 0;
    totalTravelTime = 0;
    totalExtractionTime = 0;
    var sum = 0;
    for (var i = 0; i < tests; i++) sum += floorSimulation(trinkets, itemCounts);
    totalTravelTime /= tests;
    totalExtractionTime /= tests;
    return sum / tests;
}

function floorSimulation(trinkets, itemCounts)
{
    var machines = generateMachineOrder();
    var time = 0;
    var inventory = createInventory(itemCounts, trinkets);
    var machinesSinceRefill = 0;
    var machineCount = 0;
    var activeBuffs = [];
    var squirmEatCounter = 0;
    luckyCoinStat = LuckyCoin();

    if (trinkets.indexOf("Veemote") >= 0 && machines.length > 0)

    {
        time += 1;
        machines.shift();
        machinesSinceRefill++;
        machineCount++;
    }

    for (var i = 0; i < machines.length; i++)

    {
        if (itemRefillRate > 0 && machinesSinceRefill >= itemRefillRate)
        {
            refillInventory(inventory, itemCounts, trinkets);
            machinesSinceRefill = 0;
            if (isBassie)
            {
                addBuff(activeBuffs, 'speedMult', 1.0, 4);
                // Bassie flat +40 handled separately in speed calc
            } else
            {
                addBuff(activeBuffs, 'speedMult', 1.25, 4);
            }
        }

        var isFirst = (machineCount === 0 && trinkets.indexOf("Veemote") < 0);
        var afterMach = machineCount > 0;
        var travelT = calculateTravelTime(trinkets, machines[i], activeBuffs, isFirst, afterMach);
        time += travelT;
        totalTravelTime += travelT;
        activeBuffs = tickBuffs(activeBuffs, travelT);

        var squirmExtraBuff = false;
        if (isSquirm && squirmEatBooks && enableTravel)
        {
            squirmEatCounter++;
            if (squirmEatCounter % 2 === 0) squirmExtraBuff = true;
        }

        if (inventory.valve && inventory.valve.uses > 0 &&
            (machines[i] === 'stripe' || machines[i] === 'circle'))
            {
            inventory.valve.uses--;
            time += 1;
            totalExtractionTime += 1;
            machinesSinceRefill++;
            machineCount++;
            continue;
        }

        var machineTime;
        if (machines[i] === 'treadmill')
        {
            machineTime = simulateTreadmill(trinkets, inventory, activeBuffs);
        } else
        {
            machineTime = simulateExtraction(machines[i], trinkets, inventory, activeBuffs, machineCount, squirmExtraBuff);
        }
        time += machineTime;
        totalExtractionTime += machineTime;
        machinesSinceRefill++;
        machineCount++;
    }
    return time;
}

function simulateExtraction(machineType, trinkets, inventory, activeBuffs, machineIndex, squirmExtraBuff)
{
    var time = 0;
    var maxCompletion = 45 - (extractionCards * 5);
    var currentCompletion = 0;
    var cooldown = 0;
    var shellyTimer = 65;

    var baseExtraction = getPerSecondUnits(extractionSpeed);
    if (confusedLevel > 0 && !Ribecca) baseExtraction *= (1 - confusedLevel * 0.25);
    if (isBoxten) baseExtraction += 0.06 * Math.max(1, numberOfPlayers);
    if (isEggson) maxCompletion *= 0.8;
    if (trinkets.indexOf("Machine Manual") >= 0) baseExtraction *= 1.05;
    if (trinkets.indexOf("Blue Bandana") >= 0) baseExtraction *= 1.075;
    if (trinkets.indexOf("Lucky Coin") >= 0 && luckyCoinStat === "Extraction") baseExtraction *= 1.12;

    if (trinkets.indexOf("Wrench") >= 0 && machineIndex === 0) currentCompletion += maxCompletion / 3;
    if (inventory.jumperCable && inventory.jumperCable.uses > 0)
    {
        inventory.jumperCable.uses--;
        currentCompletion += maxCompletion * 0.33;
    }

    if (squirmExtraBuff) addBuff(activeBuffs, 'extractionMult', 2.0, 10);

    var squirmAbilityCooldown = isSquirm ? 0 : 9999;

    useExtractionConsumables(machineType, inventory, activeBuffs, trinkets);

    var cooldownMax = getCooldownTime(machineType);
    var accuracy = getAccuracy(machineType);
    var scValue = getSkillCheckValue();

    var permSCValueBonus = trinkets.indexOf("Magnifing Glass") >= 0 ? 1.5 : 0;
    var permSCChanceBonus = 0;
    if (trinkets.indexOf("Participation Award") >= 0) permSCChanceBonus += 0.25;
    if (trinkets.indexOf("Blue Bandana") >= 0) permSCChanceBonus -= 0.05;
    if (trinkets.indexOf("Lucky Coin") >= 0 && luckyCoinStat === "Skill") permSCChanceBonus += 0.12;
    if (trinkets.indexOf("Paint Bucket") >= 0) permSCChanceBonus += 0.05;
    if (isBrushaBoosted) permSCChanceBonus += 0.50;

    var gCooldown = 0;

    while (currentCompletion < maxCompletion)

    {
        var extraction = baseExtraction * getBuffMult(activeBuffs, 'extractionMult');
        extraction *= (1 + getBuffAdd(activeBuffs, 'stressball'));

        if (isSquirm && squirmAbilityCooldown <= 0)

        {
            addBuff(activeBuffs, 'extractionMult', 2.0, 10);
            squirmAbilityCooldown = 20;
        }
        squirmAbilityCooldown--;

        if (isGourdyRandomBoost && isGourdy && gCooldown <= 0)

        {
            var gst = rollLockedStat(gourdyBoostLock);
            addBuff(activeBuffs, gst, gst === 'skillCheckBonus' ? 0.15 : 1.15, 15);
            gCooldown = 35;
        }
        gCooldown--;

        currentCompletion += extraction;

        if (isShellyBoosted && shellyTimer > 50)

        {
            var shellyExtra = extraction * 0.75;
            currentCompletion += shellyExtra;
        }

        if (cooldown < 1)

        {
            var scChance = baseSkillCheckChance + permSCChanceBonus + getBuffAdd(activeBuffs, 'skillCheckBonus');
            if (Math.random() < scChance)
            {
                if (Math.random() < accuracy)
                {
                    currentCompletion += scValue + permSCValueBonus;
                    successfulSkillChecks++;
                    if (trinkets.indexOf("Stress Ball") >= 0)
                    {
                        addBuff(activeBuffs, 'stressball', 0.05, 15);
                    }
                }
                cooldown = cooldownMax;
            }
        }

        time++;
        cooldown--;
        shellyTimer--;
        if (shellyTimer < 0) shellyTimer = 65;
        activeBuffs = tickBuffs(activeBuffs, 1);
        if (time > 300) break;
    }
    return time;
}

function simulateTreadmill(trinkets, inventory, activeBuffs)
{
    var time = 0;
    var treadmillGoal = 1100 * (45 - extractionCards * 5) / 45;
    if (isEggson) treadmillGoal *= 0.9;

    var maxStamina = getMaxStamina(trinkets);
    var currentStamina = maxStamina;
    var baseRegen = getBaseStaminaRegen(trinkets);
    var baseWalk = getWalkSpeed();
    var baseRun = getRunSpeed();
    var progress = 0;
    var immune = isImmune(trinkets);

    if (trinkets.indexOf("Cooler") >= 0 && !immune) { baseWalk *= 0.95; baseRun *= 0.95; }
    if (trinkets.indexOf("Dog Plush") >= 0) baseWalk *= 1.1;
    if (trinkets.indexOf("Ribbon Spool") >= 0 || trinkets.indexOf("Clown Horn") >= 0) { baseWalk *= 1.1; baseRun *= 1.1; }
    if (trinkets.indexOf("Speedy Shoes") >= 0) { baseWalk *= 1.05; baseRun *= 1.05; }
    if (trinkets.indexOf("Coal") >= 0 && !immune) { baseWalk *= 0.9; baseRun *= 0.9; }
    if (trinkets.indexOf("Lucky Coin") >= 0 && luckyCoinStat === "MS") { baseWalk *= 1.12; baseRun *= 1.12; }
    if (trinkets.indexOf("Pink Bow") >= 0) baseRun *= 1.075;
    if (isEclipseBlackout && isEclipse) { baseWalk *= 1.2; baseRun *= 1.2; }
    if (isBobetteBuff) { baseWalk *= 1.25; baseRun *= 1.25; }
    if (isLooey && currentHealth < 3 && currentHealth > 0)
    {
        var b = 1 + 0.2 * (3 - currentHealth);
        baseWalk *= b; baseRun *= b;
    }

    var staminaGain = useTreadmillConsumables(inventory, activeBuffs, trinkets);
    currentStamina = Math.min(maxStamina, currentStamina + staminaGain);

    while (progress < treadmillGoal)

    {
        var sMult = getBuffMult(activeBuffs, 'speedMult');
        var wMult = getBuffMult(activeBuffs, 'walkSpeedMult');
        var rMult = getBuffMult(activeBuffs, 'staminaRegenMult');
        var eWalk = baseWalk * sMult * wMult;
        var eRun = baseRun * sMult;
        var eRegen = baseRegen * rMult;

        if (currentStamina >= 10)

        {
            progress += eRun;
            currentStamina -= 10;
        } else
        {
            progress += eWalk;
            currentStamina = Math.min(maxStamina, currentStamina + eRegen);
        }

        if (isBassie && trinkets.indexOf("Feather Duster") >= 0 && currentStamina <= 0)

        {
            currentStamina = maxStamina;
        }

        if (currentStamina <= 0 && inventory.pop && inventory.pop.uses > 0)

        {
            inventory.pop.uses--;
            currentStamina = Math.min(maxStamina, currentStamina + 40);
        }
        if (currentStamina < maxStamina * 0.10 && inventory.boxChocolates && inventory.boxChocolates.uses > 0)
        {
            inventory.boxChocolates.uses--;
            addBuff(activeBuffs, 'speedMult', 1.15, inventory.boxChocolates.baseDuration);
        }

        time++;
        activeBuffs = tickBuffs(activeBuffs, 1);
        if (time > 500) break;
    }
    return time;
}

// ===== MOVEMENT SPEED DISPLAY =====
function getMovementSpeed(trinkets)
{
    var walk = getWalkSpeed();
    var run = getRunSpeed();
    var immune = isImmune(trinkets);

    if (trinkets.indexOf("Brick") >= 0 && !immune) { walk *= 0.9; run *= 0.9; }
    if (trinkets.indexOf("Dog Plush") >= 0) walk *= 1.1;
    if (trinkets.indexOf("Lucky Coin") >= 0 && luckyCoinStat === "MS") { walk *= 1.12; run *= 1.12; }
    if (trinkets.indexOf("Pink Bow") >= 0) run *= 1.075;
    if (trinkets.indexOf("Ribbon Spool") >= 0 || trinkets.indexOf("Clown Horn") >= 0) { walk *= 1.1; run *= 1.1; }
    if (trinkets.indexOf("Coal") >= 0 && !immune) { walk *= 0.9; run *= 0.9; }
    if (trinkets.indexOf("Speedy Shoes") >= 0) { walk *= 1.05; run *= 1.05; }
    if (trinkets.indexOf("Cooler") >= 0 && !immune) { walk *= 0.95; run *= 0.95; }
    if (isEclipseBlackout && isEclipse) { walk *= 1.2; run *= 1.2; }
    if (isBobetteBuff) { walk *= 1.25; run *= 1.25; }
    if (isLooey && currentHealth < 3 && currentHealth > 0)
    {
        var b = 1 + 0.2 * (3 - currentHealth);
        walk *= b; run *= b;
    }
    return [walk, run];
}

// ===== UI FUNCTIONS =====
function revertToGithubImage()
{
    var el = $('topImage');
    if (el) el.src = 'https://avatars.githubusercontent.com/u/69168805?v=4';
}

function setExtraction(s) { extractionSpeed = s; updateStars('extractionStars', s); revertToGithubImage(); }
function setSkill(s) { skillCheck = s; updateStars('skillStars', s); revertToGithubImage(); }
function setMovementSpeed(s) { movementSpeed = s; updateStars('movementSpeedStars', s); revertToGithubImage(); }
function setStamina(s) { staminaStar = s; updateStars('staminaStars', s); revertToGithubImage(); }

function setExtractionCard(c)

{
    extractionCards = extractionCards === c ? 0 : c;
    updateCards('extractionCardsEl', extractionCards);
}
function setStaminaCard(c)
{
    staminaCards = staminaCards === c ? 0 : c;
    updateCards('staminaCardsEl', staminaCards);
}
function setConfused(level)
{
    confusedLevel = level;
    var btns = document.querySelectorAll('.confused-btn');
    for (var i = 0; i < btns.length; i++)
    {
        if (i > 0 && i <= level)
        {
            btns[i].classList.add('active-debuff');
        } else
        {
            btns[i].classList.remove('active-debuff');
        }
    }
}

function updateStars(id, stars)
{
    var el = $(id);
    if (!el) return;
    var children = el.children;
    for (var i = 0; i < children.length; i++)
    {
        children[i].src = i < stars ? 'assets/star-on.png' : 'assets/star-off.png';
    }
}

function updateCards(id, count)
{
    var el = $(id);
    if (!el) return;
    var children = el.children;
    for (var i = 0; i < children.length; i++)
    {
        children[i].src = i < count ? 'assets/extract-on.png' : 'assets/extract-off.png';
    }
}

function selectToon(skill, extraction, speed, stamina, toonName)
{
    var btn = $('extract');
    isBoxten = false; isLooey = false; isEggson = false;
    isBassie = false; isShelly = false; isSquirm = false;
    isGourdy = false; isEclipse = false; Ribecca = false;
    currentToonName = toonName;

    var label = "Calculate";
    if (toonName === 'Boxten') { isBoxten = true; label = "Calculate (BOXTEN)"; }
    else if (toonName === 'Looey') { isLooey = true; label = "Calculate (LOOEY)"; }
    else if (toonName === 'Eggson') { isEggson = true; label = "Calculate (EGGSON)"; }
    else if (toonName === 'Bassie') { isBassie = true; label = "Calculate (BASSIE)"; }
    else if (toonName === 'Shelly') { isShelly = true; label = "Calculate (SHELLY)"; }
    else if (toonName === 'Squirm') { isSquirm = true; label = "Calculate (SQUIRM)"; }
    else if (toonName === 'Gourdy') { isGourdy = true; label = "Calculate (GOURDY)"; }
    else if (toonName === 'Eclipse') { isEclipse = true; label = "Calculate (ECLIPSE)"; }
    else if (toonName === 'Ribecca') { Ribecca = true; label = "Calculate (RIBECCA)"; }
    if (btn) btn.textContent = label;

    skillCheck = skill; updateStars('skillStars', skill);
    extractionSpeed = extraction; updateStars('extractionStars', extraction);
    movementSpeed = speed; updateStars('movementSpeedStars', speed);
    staminaStar = stamina; updateStars('staminaStars', stamina);

    var imgName = toonName.replace(/ /g, '_').replace('&', '%26');
    var topImg = $('topImage');
    if (topImg) topImg.src = 'assets/Toons/' + imgName + '_Render.webp';
}

function selectTrinket(trinket, element)
{
    var slots = document.querySelectorAll('.selected-trinket');
    var img = element ? element.querySelector('img') : null;
    if (!img) return;
    for (var i = 0; i < slots.length; i++)
    {
        if (!slots[i].classList.contains('has-image'))
        {
            var newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.alt = img.alt;
            slots[i].appendChild(newImg);
            slots[i].classList.add('has-image');
            updateTrinketNames();
            break;
        }
    }
}

function updateTrinketNames()
{
    var imgs = document.querySelectorAll('.selected-trinket.has-image img');
    setText('trinket1Name', imgs[0] ? imgs[0].alt : 'None');
    setText('trinket2Name', imgs[1] ? imgs[1].alt : 'None');
}

function removeTrinket(el)
{
    el.innerHTML = '';
    el.classList.remove('has-image');
    updateTrinketNames();
}

function toggleSection(id)
{
    var sec = $(id);
    if (!sec) return;
    var btn = sec.previousElementSibling;
    if (sec.style.display === 'none' || sec.style.display === '')
    {
        sec.style.display = 'block';
        if (btn) btn.classList.add('open');
    } else
    {
        sec.style.display = 'none';
        if (btn) btn.classList.remove('open');
    }
}

function incrementItem(key)
{
    var el = $('item_' + key);
    if (el) el.value = parseInt(el.value || 0) + 1;
    updateItemCounts();
}

function updateItemCounts()
{
    var count = 0;
    for (var key in CONSUMABLE_DEFS)
    {
        var el = $('item_' + key);
        if (el && parseInt(el.value) > 0) count++;
    }
    setText('selectedItemCount', count);
}

function toggleDistMode()
{
    var cb = $('evenDistCheck');
    useEvenDist = cb ? cb.checked : false;
    setDisplay('evenDistSection', useEvenDist ? 'block' : 'none');
    setDisplay('customDistSection', useEvenDist ? 'none' : 'block');
    updateMachineDistribution();
}

function updateMachineDistribution()
{
    if (useEvenDist)
    {
        totalMachinesEven = getInt('totalMachinesInput', 3);
        var s = Math.floor(totalMachinesEven / 3);
        var c = Math.floor(totalMachinesEven / 3);
        var t = totalMachinesEven - s - c;
        setText('totalMachinesDisplay', totalMachinesEven + ' (S:' + s + ' C:' + c + ' T:' + t + ')');
    } else
    {
        stripeMachines = getInt('stripeMachineCount', 0);
        circleMachines = getInt('circleMachineCount', 0);
        treadmillMachines = getInt('treadmillMachineCount', 0);
        setText('totalMachinesDisplay', stripeMachines + circleMachines + treadmillMachines);
    }
}

function renderItemCards()
{
    var container = $('itemCardsGrid');
    if (!container) return;
    container.innerHTML = '';
    for (var key in CONSUMABLE_DEFS)
    {
        var def = CONSUMABLE_DEFS[key];
        var card = document.createElement('div');
        card.className = 'item-card';
        card.setAttribute('data-key', key);
        card.innerHTML =
            '<img src="assets/items/' + def.img + '" alt="' + def.name + '" onerror="this.style.display=\'none\'">' +
            '<span class="item-name">' + def.name + '</span>' +
            '<input type="number" class="item-count" id="item_' + key + '" value="0" min="0">';
        container.appendChild(card);
    }

    container.addEventListener('click', function(e)

    {
        if (e.target.tagName === 'INPUT') return;
        var card = e.target.closest('.item-card');
        if (card)
        {
            var k = card.getAttribute('data-key');
            if (k) incrementItem(k);
        }
    });

    container.addEventListener('change', function(e)

    {
        if (e.target.classList.contains('item-count')) updateItemCounts();
    });
}

function help()
{
    setDisplay('helpModal', 'flex');
}
function closeHelp()
{
    setDisplay('helpModal', 'none');
}

// ===== RUN SIMULATIONS =====
function runSimulations() 
{
    numberOfPlayers = getInt('players', 1);
    currentHealth = getInt('health', 3);
    isShellyBoosted = getChecked('Shelly');
    isBrushaBoosted = getChecked('BrushaBoost');
    isBobetteBuff = getChecked('BobetteBuff');
    isGourdyRandomBoost = getChecked('GourdyRandom');
    isGourdyPanicMS = getChecked('GourdyPanic');
    isEclipseBlackout = getChecked('EclipseBlackout');
    isShellyMSBuff = getChecked('ShellyMSBuff');
    isTeammateShelly = getChecked('TeammateShelly');
    consistentCoin = getChecked('consistent');
    consistentCoinLock = getVal('coinLock', 'random');
    gourdyBoostLock = getVal('gourdyLock', 'random');
    isDyleCheck = getChecked('dyleCheck');
    isTwistedFinn = getChecked('twistedFinn');
    squirmEatBooks = getChecked('squirmBooks');
    goatedAccuracy = getChecked('goatedAccuracy');
    userAccuracy = getNum('accuracyInput', 80) / 100;
    itemRefillRate = getInt('itemRefill', 3);
    enableTravel = getChecked('enableTravel');
    distanceBetweenMachines = getInt('distanceInput', 8);

    updateMachineDistribution();

    var totalM;
    if (useEvenDist) 
	{
        totalM = totalMachinesEven;
    } else 
	{
        totalM = stripeMachines + circleMachines + treadmillMachines;
    }
    if (totalM < 1) 
	{
        setText('noneResult', 'Need ≥1 machine dummy.');
        return;
    }

    var selImgs = document.querySelectorAll('.selected-trinket.has-image img');
    var t1 = selImgs[0] ? selImgs[0].alt : null;
    var t2 = selImgs[1] ? selImgs[1].alt : null;
    var itemCounts = getItemCounts();

    var fmt = function(v) { return typeof v === 'number' ? v.toFixed(1) : 'N/A'; };

    // Run: No trinkets
    successfulSkillChecks = 0; totalTravelTime = 0; totalExtractionTime = 0;
    var rNone = runSimulation([], itemCounts);
    var scNone = successfulSkillChecks / tests;

    // Run: Trinket 1 only
    successfulSkillChecks = 0; totalTravelTime = 0; totalExtractionTime = 0;
    var r1 = t1 ? runSimulation([t1], itemCounts) : null;
    var sc1 = t1 ? successfulSkillChecks / tests : 0;

    // Run: Trinket 2 only
    successfulSkillChecks = 0; totalTravelTime = 0; totalExtractionTime = 0;
    var r2 = t2 ? runSimulation([t2], itemCounts) : null;
    var sc2 = t2 ? successfulSkillChecks / tests : 0;

    // Run: Both trinkets
    successfulSkillChecks = 0; totalTravelTime = 0; totalExtractionTime = 0;
    var rBoth = (t1 && t2) ? runSimulation([t1, t2], itemCounts) : null;
    var scBoth = (t1 && t2) ? successfulSkillChecks / tests : 0;
    var travBoth = totalTravelTime;
    var extBoth = totalExtractionTime;

    setText('noneResult', fmt(rNone));
    setText('trinket1Result', fmt(r1));
    setText('trinket2Result', fmt(r2));
    setText('bothResult', fmt(rBoth));
    setText('noneSC', Math.floor(scNone));
    setText('trinket1SC', Math.floor(sc1));
    setText('trinket2SC', Math.floor(sc2));
    setText('bothSC', Math.floor(scBoth));

    if (enableTravel) 
	{
        setDisplay('travelInfo', 'block');
        setText('travelTimeDisplay', travBoth.toFixed(1));
        setText('extractOnlyDisplay', extBoth.toFixed(1));
        var warnings = [];
        if (isTwistedFinn) warnings.push("TWISTED FINN IS PRESENT AND TRAVEL IS ENABLED!");
        if (isSquirm && squirmEatBooks) warnings.push("SQUIRM IS EATING BOOKS DURING TRAVEL!");
        setText('travelWarnings', warnings.join(' '));
    } 
	else 
	{
        setDisplay('travelInfo', 'none');
    }

    var allT = [];
    if (t1) allT.push(t1);
    if (t2) allT.push(t2);
    var ms = getMovementSpeed(allT);
    setText('walkSpeed', ms[0].toFixed(2));
    setText('runSpeed', ms[1].toFixed(2));
    setText('staminaDisplay', getMaxStamina(allT));
    setText('regenDisplay', getBaseStaminaRegen(allT).toFixed(1));

	// Twisted comparison
	var trainWhistle = isImmune(allT);

	// Compute effective speeds
	for (var ti = 0; ti < twisteds.length; ti++)
	{
		var tw = twisteds[ti];
		tw.effectiveSpeed = tw.speed;
		if (!trainWhistle && !Ribecca && tw.name === "Twisted Vee") tw.effectiveSpeed = 21;
	}

	// Sort by fastest to slowes
	twisteds.sort(function(a, b) { return b.effectiveSpeed - a.effectiveSpeed; });

	var tCont = $('twistedContainer');
	if (tCont) 
	{
		tCont.innerHTML = '';
		for (var ti = 0; ti < twisteds.length; ti++)
		{
			var tw = twisteds[ti];
			var sp = tw.effectiveSpeed;
			var box = document.createElement('div');
			box.className = 'twisted-box';
			box.textContent = tw.name + ': ' + sp;
			if (sp <= ms[0])
			{
				box.classList.add(sp * 1.25 <= ms[0] ? 'blue' : 'green');
			} 
			else if (sp <= ms[1])
			{
				box.classList.add('orange');
			} 
			else
			{
				box.classList.add('red');
			}
			tCont.appendChild(box);
		}
	}
	twisteds.sort(function(a, b) { return b.speed - a.speed; });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function()
{
    try
    {
        setSkill(1);
        setExtraction(1);
        setMovementSpeed(1);
        setStamina(3);
        renderItemCards();
        updateMachineDistribution();

        var tCont = $('twistedContainer');
        if (tCont)
        {
            for (var i = 0; i < twisteds.length; i++)
            {
                var tw = twisteds[i];
                var box = document.createElement('div');
                box.className = 'twisted-box';
                box.textContent = tw.name + ': ' + tw.speed;
                tCont.appendChild(box);
            }
        }

        // Mobile tooltip support
        document.addEventListener('click', function(e)
        {
            var allTT = document.querySelectorAll('.tt.tt-active');
            for (var j = 0; j < allTT.length; j++) allTT[j].classList.remove('tt-active');
            var tt = e.target.closest('.tt');
            if (tt)
            {
                e.stopPropagation();
                tt.classList.add('tt-active');
            }
        });
    } catch (err)
    {
        console.error('Init error:', err);
    }
});
