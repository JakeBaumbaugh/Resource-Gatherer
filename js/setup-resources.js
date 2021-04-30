var money = 0;
var prestigePoints = 0;
var prestigePointCost = 100;
var resources = null;

window.onload = function() {
    setupLinks();
    setupResources();
    setupPrestige();
}

function setupLinks() {
    let sections = document.getElementById("body").getElementsByTagName("section");
    let links = document.getElementById("nav").getElementsByTagName("a");

    let linkClick = function() {
        for(sec of sections) {
            sec.classList.add("hidden");
        }
        this.classList.remove("hidden");
    }

    for (let i = 0; i < links.length; i++) {
        links[i].onclick = linkClick.bind(sections[i]);
    }
    
    linkClick.call(sections[0]);
}

function setupResources() {
    // Clear generated resource divs
    if(resources != null) {
        for(resource of resources) {
            document.getElementById(resource.name+"-container").remove();
            document.getElementById(resource.name+"-market-container").remove();
            document.getElementById(resource.name+"-blacksmith-container").remove();
        }
    }
    // Setup values and HTML
    resources = [
        new Resource("wood", "Wood", "#634F2E", "axe", "Axe"),
        new Resource("stone", "Stone", "#888888", "pickaxe", "Pickaxe"),
    ];
    for(resource of resources) {
        resource.buildResourceDisplay();
        resource.buildMarketDisplay();
        resource.buildBlacksmithDisplay();
    }
}

function setupPrestige() {
    document.getElementById("prestige-button").onclick = prestigeClick;
}

function updateMoney() {
    // Update money values
    let elem;
    for(let i=0; (elem=document.getElementById("money-span-"+i)) != null; i++) {
        elem.innerHTML = money;
    }
    // Update prestige gain
    document.getElementById("prestige-gain-span").innerHTML = prestigeGain();
    document.getElementById("prestige-next-span").innerHTML = nextPrestigePoint();
}

function prestigeClick() {
    // Make sure prestigeGain > 0
    if(prestigeGain() == 0) {
        return;
    }
    prestigePoints += prestigeGain();
    money = 0;
    document.getElementById("prestige-span").innerHTML = prestigePoints;
    document.getElementById("prestige-boost-span").innerHTML = capBoost();
    setupResources();
    updateMoney();
}

function capBoost() {
    return 2 ** prestigePoints;
}

function prestigeGain() {
    let gain = Math.floor(Math.log(money) / Math.log(10)) - 1;
    return Math.max(gain, 0);
}

function nextPrestigePoint() {
    let log = Math.log(money) / Math.log(10)
    let dec = log % 1;
    if(dec == 0) {
        return Math.max(10 ** (log+1), 100);
    } else {
        return Math.max(10 ** Math.ceil(log), 100);
    }
}

function Resource(name, displayName, color, upgradeName, upgradeDisplayName) {
    this.name = name;
    this.displayName = displayName;
    this.color = color;
    this.price = 1;
    this.incr = 1;
    this.cap = 100 * capBoost();
    this.count = 0;

    this.upgradeName = upgradeName;
    this.upgradeDisplayName = upgradeDisplayName;
    this.upgradeCost = 10;
}
Resource.prototype.buildResourceDisplay = function() {
    let sec = document.getElementById("resources");
    
    let cont = document.createElement("div");
    cont.id = this.name+"-container";
    cont.classList.add("resource-container");

    let img = document.createElement("img");
    img.src = "img/"+this.name+".png";
    img.id = this.name+"-collect-button";
    img.classList.add("collect-button");
    img.classList.add("clickable");
    img.onmousedown = this.clickFunc.bind(this);
    img.onmouseup = this.releaseFunc.bind(this);
    
    let p = document.createElement("p");
    p.innerHTML = this.displayName+": ";
    let span = document.createElement("span");
    span.id = this.name+"-count-span";
    span.innerHTML = this.count+" / "+this.cap;
    p.appendChild(span);

    let stock = document.createElement("div");
    stock.id = this.name+"-stockpile";
    stock.classList.add("resource-stockpile");
    let stockContent = document.createElement("div");
    stockContent.style.width = "0%";
    stockContent.style.backgroundColor = this.color;
    stock.appendChild(stockContent);

    cont.appendChild(img);
    cont.appendChild(p);
    cont.appendChild(stock);

    sec.appendChild(cont);
}
Resource.prototype.buildMarketDisplay = function() {
    let cont = document.getElementById("market-container");

    let resCont = document.createElement("div");
    resCont.id = this.name+"-market-container";

    let num = document.createElement("p");
    num.innerHTML = this.displayName+": ";
    let span = document.createElement("span");
    span.id = this.name+"-market-span";
    span.innerHTML = this.count+" / "+this.cap;
    num.appendChild(span);

    let img = document.createElement("img");
    img.src = "img/"+this.name+".png";

    let sellOne = document.createElement("p");
    sellOne.innerHTML = "Sell One";
    sellOne.classList.add("clickable");
    sellOne.onclick = this.sellOneFunc.bind(this);

    let sellAll = document.createElement("p");
    sellAll.innerHTML = "Sell All";
    sellAll.classList.add("clickable");
    sellAll.onclick = this.sellAllFunc.bind(this);

    resCont.appendChild(num);
    resCont.appendChild(img);
    resCont.appendChild(sellOne);
    resCont.appendChild(sellAll);

    cont.appendChild(resCont);
}
Resource.prototype.buildBlacksmithDisplay = function() {
    let cont = document.getElementById("blacksmith-container");

    let resCont = document.createElement("div");
    resCont.id = this.name+"-blacksmith-container";

    let cost = document.createElement("p");
    cost.innerHTML = "Upgrade "+this.upgradeDisplayName+": $";
    let span = document.createElement("span");
    span.id = this.name+"-upgrade-cost-span";
    span.innerHTML = this.upgradeCost;
    cost.appendChild(span);

    let img = document.createElement("img");
    img.src = "img/"+this.name+".png";

    let buyOne = document.createElement("p");
    buyOne.innerHTML = "Buy One";
    buyOne.classList.add("clickable");
    buyOne.onclick = this.buyOneUpgradeFunc.bind(this);

    let buyAll = document.createElement("p");
    buyAll.innerHTML = "Buy All";
    buyAll.classList.add("clickable");
    buyAll.onclick = this.buyAllUpgradeFunc.bind(this);

    resCont.appendChild(cost);
    resCont.appendChild(img);
    resCont.appendChild(buyOne);
    resCont.appendChild(buyAll);

    cont.appendChild(resCont);
}
Resource.prototype.clickFunc = function() {
    this.count = Math.min(this.count+this.incr, this.cap);
    this.updateCount();

    let img = document.getElementById(this.name+"-collect-button");
    img.classList.add("clicked");
}
Resource.prototype.releaseFunc = function() {
    let img = document.getElementById(this.name+"-collect-button");
    img.classList.remove("clicked");
}
Resource.prototype.sellOneFunc = function() {
    if(this.count >= 1) {
        this.count--;
        money += this.price;
    }
    this.updateCount();
    updateMoney();
}
Resource.prototype.sellAllFunc = function() {
    money += this.count * this.price;
    this.count = 0;
    this.updateCount();
    updateMoney();
}
Resource.prototype.buyOneUpgradeFunc = function() {
    if(money >= this.upgradeCost) {
        money -= this.upgradeCost;
        this.upgradeCost += 2;
        this.incr += 1;
        updateMoney();
        this.updateUpgradeCost();
        return true;
    }
    return false;
}
Resource.prototype.buyAllUpgradeFunc = function() {
    while(this.buyOneUpgradeFunc()) {}
}
Resource.prototype.updateCount = function() {
    // Update count spans
    let str = this.count+" / "+this.cap;
    document.getElementById(this.name+"-count-span").innerHTML = str;
    document.getElementById(this.name+"-market-span").innerHTML = str;
    // Update stockpile
    let stockpile = document.getElementById(this.name+"-stockpile");
    let contents = stockpile.getElementsByTagName("div")[0];
    contents.style.width = (100 * this.count / this.cap)+"%"
}
Resource.prototype.updateUpgradeCost = function() {
    document.getElementById(this.name+"-upgrade-cost-span").innerHTML = this.upgradeCost;
}