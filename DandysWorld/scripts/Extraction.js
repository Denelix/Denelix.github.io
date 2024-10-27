//Values the user is ablke to change
let numberOfMachines = 1;
let extractionSpeed = 1;
let movementSpeed = 1;
let skillCheck = 1;
let consistentCoin = false
let tests = 1500;

//let luckyCoinStat = "None"
let skillCheckValue = 0.5 + (skillCheck * 0.5);
let baseSkillCheckChance = 0.25;
let numberOfPlayers = 1
let isShellyBoosted = false
let isBoxten = false
let successfulSkillChecks = 0
let ShellyBoost = 65
let cooldown = 0
let extractionCards = 0

//Get sets and defaults

setSkill(1) 
setExtraction(1) 
setMovementSpeed(1) 

function getPerSecondUnits(extractionSpeed) 
{
    switch (extractionSpeed) 
    {
        case 1: return 0.75;
        case 2: return 0.85;
        case 3: return 1.0;
        case 4: return 1.2;
        case 5: return 1.5;
        default: return 1.0;
    }
}

function getWalkSpeed() 
{
    return movementSpeed*2.5+7.5;
}

function getRunSpeed() 
{
    return movementSpeed*2.5+17.5;
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

function setMovementSpeed(stars) 
{
    movementSpeed = stars;
    updateStars('movementSpeedStars', stars);
}

function setExtractionCard(cards) 
{
	if (extractionCards==cards)
	{
		extractionCards=0
		updateCards('extractionCards', 0);
		//If select same one twice it just removes it.
	}
	else
	{
		extractionCards = cards;
		updateCards('extractionCards', cards);
	}
}


//=============================Calculations :nerd:================================
function runSimulation(trinkets) 
{
	successfulSkillChecks = 0;
    let sum = 0;
	
    for (let i = 0; i < tests; i++) 
    {
        sum += floorSimulation(trinkets);
    }
    return sum / tests;
}

function floorSimulation(trinkets) 
{
	let ShellyBoost = 65;
    let completedMachines = 0;
    let time = 0;
    luckyCoinStat = LuckyCoin()
    
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
    let maxCompletion = 45-(extractionCards*5);
    let currentCompletion = 0.0;
    let extraction = getPerSecondUnits(extractionSpeed);
	ShellyBoost = 65
    //TRINKET IMPLEMENTATION!!!!
    if (isBoxten) 
    {
		if (numberOfPlayers < 1)
		{
			numbersOfPlayers=1;
		}
        extraction= extraction+(0.06*numberOfPlayers);
    }
	
    if (trinkets.includes("Machine Manual")) 
    {
        extraction *=1.05;
    }
    if (trinkets.includes("Lucky Coin")) 
    {
        if (luckyCoinStat=="Extraction") 
        {
            extraction*=1.12;
        }
    }
    if (trinkets.includes("Wrench") && completedMachines==0) 
    {
        currentCompletion+=maxCompletion/3;
    }
    if (trinkets.includes("Blue Bandana")) 
    {
        extraction *=1.075;
    }
    //TRINKET IMPLEMENTATION!!!!
    while (currentCompletion < maxCompletion) 
    {
        time += 1;
        //Does skillcheck and extraction at same time.
        currentCompletion += extraction + simulateSkillCheck(trinkets,);
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
        cooldown += -1;
    }
	cooldown =0; //By the time you reach a new machine most likely this will be back to 0.
    return time;
}

function simulateSkillCheck(trinkets) 
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
			successfulSkillChecks+=1;
            return skillCheckValue+skillValueBonus;
			//Solved and 100% accurate now. SkillChecks  happed every 5 seconds and every 1 second if skillcheckchance is false.
        }
        return 0;
    }
    return 0;
}
// now for movementspeed related stuff


function getMovementSpeed(trinkets) 
{
	let ms = [0.0,0.0];
	
	//default ms
    ms[0] = getWalkSpeed();
    ms[1] = getRunSpeed();
	
    if (trinkets.includes("Alarm")) 
	{
		ms[0]*=1.25;
		ms[1]*=1.25;
	}
    if (trinkets.includes("Bone")) 
	{
		ms[0]*=1.25;
		ms[1]*=1.25;
	}
    if (trinkets.includes("Brick")) 
	{
		ms[0]*=.9;
		ms[1]*=.9;
	}
    if (trinkets.includes("Dog Plush")) 
	{
		ms[0]*=1.1;
	}
    if (trinkets.includes("Lucky Coin")) 
	{
		ms[0]*=1.12;
		ms[1]*=1.12;
	}
    if (trinkets.includes("Pink Bow")) 
	{
		ms[1]*=1.075;
	}
    if (trinkets.includes("Pull Toy")) 
	{
		ms[0]*=1.25;
		ms[1]*=1.25;
	}
    if (trinkets.includes("Ribbon Spool")) 
	{
		ms[0]*=1.1;
		ms[1]*=1.1;
	}
    if (trinkets.includes("Speedy Shoes")) 
	{
		ms[0]*=1.05;
		ms[1]*=1.05;
	}
    if (trinkets.includes("Vanity Mirror")) 
	{
		ms[1]*=1.3;
	}
	return ms;
}

///////////////Toons and trinkets

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
    const trinket1Name = selectedTrinkets[0] ? selectedTrinkets[0].alt : 'None';
    const trinket2Name = selectedTrinkets[1] ? selectedTrinkets[1].alt : 'None';

    document.getElementById('trinket1Name').textContent = trinket1Name;
    document.getElementById('trinket2Name').textContent = trinket2Name;
}


function removeTrinket(element) {
    element.innerHTML = ''; // Clear the trinket
    element.classList.remove('has-image');
    updateTrinkets();
}


function LuckyCoin() {
    let chance = Math.random();
    if (chance < 0.4 || consistentCoin) 
    {
        return Math.random() > 0.5 ? "Skill" : "Extraction";
    }
    return "None"
}

const twisteds = 
[
	{ name: "Twisted Boxten", speed: 18 },
	{ name: "Twisted Shrimpo", speed: 16.5 },
	{ name: "Twisted Tisha", speed: 18 },
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
	{ name: "Twisted Pebble", speed: 25 },
	{ name: "Twisted Vee", speed: 18 },
	{ name: "Twisted Shelly", speed: 20 },
	{ name: "Twisted Sprout", speed: 17 },
	{ name: "Twisted Dandy", speed: 16.5 }
];

twisteds.sort((a, b) => b.speed - a.speed);
const twistedContainer = document.getElementById('twistedContainer');

twisteds.forEach(twisted => 
{
	const box = document.createElement('div');
	box.className = 'twisted-box';
	box.textContent = `${twisted.name}: Speed ${twisted.speed}`;
	twistedContainer.appendChild(box);
});
//STATS AND STAT UPDATES

function selectToon(Skill, Extraction, Speed, boxten) 
{
	console.log("boxten value:", boxten);
    const button = document.getElementById('extract');
    if (boxten === 'Boxten') 
	{
		console.log("I MADE IT");
        isBoxten = true;
        button.textContent = "Extract (WARNING: HAS BOXTEN PASSIVE!)";
    } 
	else 
	{
		isBoxten = false;
        button.textContent = "Extract";
    }

    setSkill(Skill);
    setExtraction(Extraction);
    setMovementSpeed(Speed);
}

function updateStars(elementId, stars) 
{
    const starElements = document.getElementById(elementId).children;
    for (let i = 0; i < starElements.length; i++) 
	{
        starElements[i].src = i < stars ? 'assets/star-on.png' : 'assets/star-off.png';
    }
}

function updateCards(elementId, stars) 
{
    const starElements = document.getElementById(elementId).children;
    for (let i = 0; i < starElements.length; i++) 
	{
        starElements[i].src = i < stars ? 'assets/extract-on.png' : 'assets/extract-off.png';
    }
}


//======================= TEST DOWN HERE ============================

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

	//for now adding "successfulSkillChecks = 0;" here just so I can have this done now.
    const resultsNoTrinket = runSimulation([]);
    const scNoTrinket = successfulSkillChecks/tests;
	successfulSkillChecks = 0;
    const resultsTrinket1 = trinket1 ? runSimulation([trinket1]) : 'N/A';
    const scTrinket1 = trinket1 ? successfulSkillChecks/tests : 0;
	successfulSkillChecks = 0;
    const resultsTrinket2 = trinket2 ? runSimulation([trinket2]) : 'N/A';
    const scTrinket2 = trinket2 ? successfulSkillChecks/tests : 0;
    const resultsBothTrinkets = trinket1 && trinket2 ? runSimulation([trinket1, trinket2]) : 'N/A';
    const scBothTrinkets = trinket1 && trinket2 ? successfulSkillChecks/tests : 0;

	//Checking if it's a number if not put N/A. This is to prevent a function not exsisting and making the code not work as intended.
	document.getElementById('noneResult').textContent = typeof resultsNoTrinket === 'number' ? resultsNoTrinket.toFixed(1) : 'N/A';
	document.getElementById('trinket1Result').textContent = typeof resultsTrinket1 === 'number' ? resultsTrinket1.toFixed(1) : 'N/A';
	document.getElementById('trinket2Result').textContent = typeof resultsTrinket2 === 'number' ? resultsTrinket2.toFixed(1) : 'N/A';
	document.getElementById('bothResult').textContent = typeof resultsBothTrinkets === 'number' ? resultsBothTrinkets.toFixed(1) : 'N/A';

	//document.getElementById('machinesCompleted').textContent = numberOfMachines; seems unncessesary

	document.getElementById('noneSC').textContent = typeof scNoTrinket === 'number' ? Math.floor(scNoTrinket) : 'N/A';
	document.getElementById('trinket1SC').textContent = typeof scTrinket1 === 'number' ? Math.floor(scTrinket1) : 'N/A';
	document.getElementById('trinket2SC').textContent = typeof scTrinket2 === 'number' ? Math.floor(scTrinket2) : 'N/A';
	document.getElementById('bothSC').textContent = typeof scBothTrinkets === 'number' ? Math.floor(scBothTrinkets) : 'N/A';

	
	//Then this is for movementspeed checks which was realy easy.
	let movementSpeed = [0.0, 0.0];
    movementSpeed = getMovementSpeed([trinket1, trinket2]);
	document.getElementById('walkSpeed').textContent = movementSpeed[0].toFixed(2); 
	document.getElementById('runSpeed').textContent = movementSpeed[1].toFixed(2);
	
	twistedContainer.innerHTML = ''; //clears all effects

	twisteds.forEach(twisted => {
		const box = document.createElement('div');
		box.className = 'twisted-box';
		box.textContent = `${twisted.name}: Speed ${twisted.speed}`;

		if (twisted.speed <= movementSpeed[0]) 
		{
			//wiki said by 20-25%
			if (twisted.speed*1.225 <= movementSpeed[0]) 
			{
				box.classList.add('blue');
			}
			else
			{
				box.classList.add('green');
			}
		} 
		else if (twisted.speed <= movementSpeed[1]) 
		{
			box.classList.add('orange');
		} 
		else 
		{
			box.classList.add('red');
		}

		twistedContainer.appendChild(box);
	});
}

