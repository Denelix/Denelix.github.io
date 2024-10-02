//Values the user is ablke to change
let numberOfMachines = 5;
let extractionSpeed = 3;
let skillCheck = 5;
let consistentCoin = false
let tests = 1000;
let ShellyBoost = 65

const random = Math.random;
let luckyCoinStat = "None"
let skillCheckValue = 0.5 + (skillCheck * 0.5);
let baseSkillCheckChance = 0.25;
let skillCheckCooldown = 4;//The cooldown is 2 but i am also including time to do the skillcheck
let AllTrinkets = ["Lucky Coin", "Participation Award"]; // Example trinkets
let numberOfPlayers = 1
let isShellyBoosted = false
let isBoxten = false

function getPerSecondUnits(extractionSpeed) 
{
    switch (extractionSpeed) 
    {
        case 1: return 0.75;
        case 2: return 0.85;
        case 3: return 1.0;
        case 4: return 1.25;
        case 5: return 1.5;
        default: return 1.0;
    }
}

//=============================LOGIC================================
function runSimulation(trinkets) 
{
    let sum = 0;
    for (let i = 0; i < tests; i++) 
    {
        sum += floorSimulation(trinkets);
    }
    return sum / tests;
}

function floorSimulation(trinkets) 
{
	let ShellyBoost = 65
    luckyCoinStat = LuckyCoin()
    let completedMachines = 0;
    let time = 0;
    
    if (trinkets.includes("Veemote")) 
    {
        time += 1;
        completedMachines += 1;
    }
    
    while (completedMachines < numberOfMachines) 
    {
        time += fillMachine(trinkets, completedMachines);
        completedMachines += 1;
    }
    return time;
}

function fillMachine(trinkets, completedMachines) 
{
    let time = 0;
    let cooldown = 2;
    let maxCompletion = 45;
    let currentCompletion = 0.0;
    let extraction = getPerSecondUnits(extractionSpeed);
	ShellyBoost = 65
    //TRINKET IMPLEMENTATION!!!!
    if (trinkets.includes("Machine Manual")) 
    {
        extraction= extraction*1.05;
    }
    if (trinkets.includes("Lucky Coin")) 
    {
        if (luckyCoinStat=="Extraction") 
        {
            extraction= extraction*1.12;
        }
    }
    if (trinkets.includes("Wrench") && completedMachines==0) 
    {
        currentCompletion+=maxCompletion/3;
    }
    if (trinkets.includes("Blue Bandana")) 
    {
        extraction = extraction*1.075;
    }
    //TRINKET IMPLEMENTATION!!!!
    
    if (isBoxten) 
    {
		if (numberOfPlayers < 1)
		{
			numbersOfPlayers=1;
		}
        extraction= extraction+(1.06*numberOfPlayers);
    }
	
    while (currentCompletion < maxCompletion) 
    {
        time += 1;
        cooldown += -1;
        //Does skillcheck and extraction at same time.
        currentCompletion += extraction + simulateSkillCheck(trinkets, cooldown);
		if (isShellyBoosted && (ShellyBoost>50)) 
		{
			currentCompletion += extraction*0.75;
			console.log(ShellyBoost);
		}
		if (ShellyBoost<0)
		{
			ShellyBoost=65;
		}
		ShellyBoost += -1;
    }
    return time;
}

function simulateSkillCheck(trinkets, cooldown) 
{
    let skillCheckBonus = 0;
    let skillValueBonus = 0;
    if (cooldown < 1) //This is just incase I want to multithread this process
    {
        
        //TRINKET IMPLEMENTATION!!!!
        
        if (trinkets.includes("Magnifing Glass")) 
        {
            skillValueBonus += 1.5;
        }
        if (trinkets.includes("Participation Award")) 
        {
            skillCheckBonus += .25;
        }
        if (trinkets.includes("Blue Bandana")) 
        {
            skillCheckBonus += -.05;
        }
        if (trinkets.includes("Lucky Coin")) 
        {
            if (luckyCoinStat=="Skill") 
            {
                skillCheckBonus +=.12;
            }
        }
        
        //TRINKET IMPLEMENTATION!!!!
        
        let chance = Math.random();
        if (chance < baseSkillCheckChance+skillCheckBonus)
        {
            cooldown = 4; //includes skill check doing and fading away and the actual cooldown between skillchecks
            return skillCheckValue+skillValueBonus;
        }
        return 0;
    }
    return 0;
}

function LuckyCoin() {
    let chance = Math.random();
    if (chance > 0.4 || consistentCoin) 
    {
        return Math.random() > 0.5 ? "Skill" : "Extraction";
    }
    return "None"
}

function setExtraction(stars) 
{
    extractionSpeed = stars;
    updateStars('extractionStars', stars);
}

function setSkill(stars) 
{
    skillCheck = stars;
    updateStars('skillStars', stars);
}

function updateStars(elementId, stars) 
{
    const starElements = document.getElementById(elementId).children;
    for (let i = 0; i < starElements.length; i++) {
        starElements[i].src = i < stars ? 'assets/star-on.png' : 'assets/star-off.png';
    }
}
//======================= TEST DOWN HERE ============================
function selectTrinket(trinket, element) {
    const selectedTrinkets = document.querySelectorAll('.selected-trinket');
    for (let selected of selectedTrinkets) {
        if (!selected.classList.contains('has-image')) {
            const img = document.createElement('img');
            img.src = element.querySelector('img').src;
            img.alt = element.querySelector('img').alt; // Set the alt attribute
            selected.appendChild(img);
            selected.classList.add('has-image');
            updateTrinkets();
            break;
        }
    }
}

function updateTrinkets() {
    const selectedTrinkets = document.querySelectorAll('.selected-trinket.has-image img');
    const trinket1Name = selectedTrinkets[0] ? selectedTrinkets[0].alt : 'Trinket 1';
    const trinket2Name = selectedTrinkets[1] ? selectedTrinkets[1].alt : 'Trinket 2';

    document.getElementById('trinket1Name').textContent = trinket1Name;
    document.getElementById('trinket2Name').textContent = trinket2Name;
}

function runSimulations() 
{
	skillCheckValue = 0.5 + (skillCheck * 0.5);
    numberOfMachines = document.getElementById('machines').value;
    numberOfPlayers = document.getElementById('players').value;
    isShellyBoosted = document.getElementById('Shelly').checked;
    consistentCoin = document.getElementById('consistent').checked;

    const selectedTrinkets = document.querySelectorAll('.selected-trinket.has-image img');
    const trinket1 = selectedTrinkets[0] ? selectedTrinkets[0].alt : null;
    const trinket2 = selectedTrinkets[1] ? selectedTrinkets[1].alt : null;

    const resultsNoTrinket = runSimulation([]);
    const resultsTrinket1 = trinket1 ? runSimulation([trinket1]) : 'N/A';
    const resultsTrinket2 = trinket2 ? runSimulation([trinket2]) : 'N/A';
    const resultsBothTrinkets = trinket1 && trinket2 ? runSimulation([trinket1, trinket2]) : 'N/A';

    document.getElementById('noneResult').textContent = resultsNoTrinket;
    document.getElementById('trinket1Result').textContent = resultsTrinket1;
    document.getElementById('trinket2Result').textContent = resultsTrinket2;
    document.getElementById('bothResult').textContent = resultsBothTrinkets;
    document.getElementById('machinesCompleted').textContent = numberOfMachines;
}


function removeTrinket(element) {
    element.innerHTML = ''; // Clear the trinket
    element.classList.remove('has-image');
    updateTrinkets();
}

function selectToon(Skill, Extraction, boxten) 
{
    console.log(Skill, Extraction, boxten); // Add this log to see what is passed
    const button = document.getElementById('extract');

    if (boxten == 'true') 
	{
		console.log("I MADE IT");
        isboxten = true;
        button.textContent = "Extract (WARNING: HAS BOXTEN PASSIVE!)";
    } 
	else 
	{
    isboxten = false;
        button.textContent = "Extract";
    }

    setSkill(Skill);
    setExtraction(Extraction);
}

function selectToon(Skill, Extraction)
{
    setSkill(Skill) 
	setExtraction(Extraction) 
}