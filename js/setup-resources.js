var money = 0;
var resources = [
    new Resource("wood", "Wood", "#634F2E"),
    new Resource("stone", "Stone", "#888888"),
];

window.onload = function() {
    setupLinks();

    for(resource of resources) {
        resource.buildResourceDisplay();
        resource.buildMarketDisplay();
    }
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

function updateMoney() {
    document.getElementById("money-span").innerHTML = money;
}

function Resource(name, displayName, color) {
    this.name = name;
    this.displayName = displayName;
    this.color = color;
    this.price = 1;
    this.incr = 1;
    this.cap = 100;
    this.count = 0;
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
    resCont.classList.add("resource-market-container");

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