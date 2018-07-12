var dragonOffset = 2;
var score = 0;

class Entity {
    constructor (img, x, y, speed) {
        this.img = loadImage(img);
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
    
    render() {
        image(this.img, this.x, this.y);
    }

    update () {
        this.x -= this.speed;
    }

    isOutsideCanvas () {
        if (this.x + this.img.width > 0)
            return false
        else
            return true
    }
}

var CloudManager = function() {

    cloudDelay = 0;

    types = [
        "assets/sky/cloud1.png",
        "assets/sky/cloud2.png",
        "assets/sky/cloud3.png",
        "assets/sky/cloud4.png"
    ];

    clouds = []

    this.updateClouds = () => {
        cloudDelay -= 1;

        if (cloudDelay <= 0) {
            clouds.push(new Entity(random(types), 720, random(50, 90), 1.5));
            cloudDelay = random(70, 100);
        }

        for (var i = clouds.length - 1; i > 0; i--)
        {
            if (clouds[i].isOutsideCanvas())
                clouds.splice(i, 1);
            else
                clouds[i].update();
        }
    }
    
    this.renderClouds = () => {
        for (var i = 0; i < clouds.length; i++)
        {
            clouds[i].render();
        } 
    }
}

var GrassManager = function() {

    grassDelay = 0;

    typesGrass = [
        "assets/grass/grass1.png",
        "assets/grass/grass2.png",
        "assets/grass/grass3.png",
        "assets/grass/grass4.png",
        "assets/grass/grass5.png",
    ];

    grasss = []

    this.updateGrass = () => {
        grassDelay -= 1;

        if (grassDelay <= 0) {
            grasss.push(new Entity(random(typesGrass), 720,  height-10, 5));
            grassDelay = random(40, 70);
        }

        for (var i = grasss.length - 1; i > 0; i--)
        {
            if (grasss[i].isOutsideCanvas())
                grasss.splice(i, 1);
            else
                grasss[i].update();
        }
    }
    
    this.renderGrass = () => {
        for (var i = 0; i < grasss.length; i++)
        {
            grasss[i].render();
        } 
    }
}

var RoadManager = function() {

    road = []

    typesRoad = [
        "assets/road/road1.png",
        "assets/road/road2.png",
        "assets/road/road3.png",
        "assets/road/road4.png",
        "assets/road/road5.png",
        "assets/road/road6.png",
    ]

    this.updateRoad = () => {
        road.push(new Entity(random(typesRoad), 720,  height-3, 3));
        for (var i = road.length - 1; i > 0; i--)
        {
            if (road[i].isOutsideCanvas())
                road.splice(i, 1);
            else
                road[i].update();
        }
    }

    this.renderRoad = () => {
        for (var i = 0; i < road.length; i++)
        {
            road[i].render();
        } 
    }
}

class Dragon {

    constructor(x, y) {
        this.dragonSprites = []
        this.dragonSprites.push(loadImage("assets/dragon/dragon.png"))
        this.dragonSprites.push(loadImage("assets/dragonrun/dragonrun1.png"))
        this.dragonSprites.push(loadImage("assets/dragonrun/dragonrun2.png"))
        this.dragonSprites.push(loadImage("assets/dragonrun/dragonrun3.png"))
        this.dragonSprites.push(loadImage("assets/dragonrun/dragonrun4.png"))
        
        this.jumpingDragonSprites = []
        this.jumpingDragonSprites.push(loadImage("assets/dragonjump/dragonjump1.png"))
        this.jumpingDragonSprites.push(loadImage("assets/dragonjump/dragonjump2.png"))
        this.jumpingDragonSprites.push(loadImage("assets/dragonjump/dragonjump3.png"))
        this.jumpingDragonSprites.push(loadImage("assets/dragonjump/dragonjump4.png"))
        this.jumpingDragonSprites.push(loadImage("assets/dragonjump/dragonjump5.png"))

        this.img = this.dragonSprites[0];

        this.mx = 0;
        this.my = 0;
        this.x = x;
        this.y = y;
        this.canJump;
        this.animationState = 0;
        this.animationDelay = 20;
    }

    move() {
    
        this.x += this.mx;
        if(this.y >= height - this.img.height - dragonOffset && this.my > 0)
        {
            this.y = height - this.img.height - dragonOffset;
            this.canJump = true;
            this.my = 0;  
        } else {
            this.my += 0.17;
            this.y += this.my;
            this.canJump = false;
        }
    }

    animate() {

        if (this.canJump) {
            if (this.animationState >= this.dragonSprites.length-1)
                this.animationState = 0;

            if (this.animationDelay == 0) {
                this.img = this.dragonSprites[this.animationState];
                this.animationDelay = 10;
                this.animationState += 1;
            }
        } else {

            if (this.animationDelay == 0 && !(this.animationState >= this.jumpingDragonSprites.length-1)) {
                this.img = this.jumpingDragonSprites[this.animationState];
                this.animationDelay = 10;
                this.animationState += 1;
            }
        }

        this.animationDelay -= 1;
    }
}

function setup() {
    createCanvas(720, 200);
    dragon = new Dragon(0, 0);
    cloudManager = new CloudManager();
    grassManager = new GrassManager();
    roadManager = new RoadManager();
}

function draw() {

    if (keyIsPressed == true && dragon.canJump == true && keyCode == 32) {
        dragon.my -= 4;
        dragon.animationState = 0;
        dragon.animationDelay = 0;
        dragon.canJump = false;
    }

    dragon.move();
    dragon.animate();
    background(51);

    fill(200)
    cloudManager.updateClouds();
    cloudManager.renderClouds();
    fill(255)

    grassManager.updateGrass();
    grassManager.renderGrass();

    roadManager.updateRoad();
    roadManager.renderRoad();

    text('Socre: ' + score, 10, 20);
    fill(200);

    image(dragon.img, 40, dragon.y);
    score += 1;
}