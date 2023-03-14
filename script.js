import Vector from "./vector.js";

var canvas = document.querySelector('canvas');

var width = 800;
var height = 600;

canvas.setAttribute('width', width);
canvas.setAttribute('height', height);

var drawingSurface = canvas.getContext('2d');

class Attractor {
    constructor(w, h) {
        (w && h) ? this.size = new Vector(w, h) : this.size = new Vector(25, 25);
        //(w && h) ? this.mass = (w + h) : this.mass = 20;
        this.coordinates = new Vector(width / 2, height / 2);
        this.mass = 1500;
    };

    clamp(n) {
        return Math.min(Math.max(n, 25), 50);
        //return 50;
    }

    attract(m) {
        var force = new Vector().subStatic(this.coordinates, m.coordinates)
        var dist = force.mag();
        dist = this.clamp(dist);
        force.normalize();
        var strength = (this.mass) / (dist * dist);
        force.mult(strength);
        /*
        var dist = force.mag();
        dist = this.clamp(dist);
        console.log(dist)
        force.normalize();
        var strength = (this.mass) / (dist * dist);
        force.mult(strength);*/

        return force;
    };

    display() {
        drawingSurface.beginPath();
        drawingSurface.fillStyle = 'burlywood'
        drawingSurface.arc(width / 2, height / 2, this.size.x / 2, 0, 2 * Math.PI, false);
        drawingSurface.fill();
        //drawingSurface.stroke();
        drawingSurface.closePath();
    };
};

class Mover {
    constructor(x, y, w, h, bounce) {
        (w && h) ? this.size = new Vector(w, h) : this.size = new Vector(25, 25);
        (w && h) ? this.mass = (w + h) / 10 : this.mass = 5;
        (x && y) ? this.coordinates = new Vector(x, y) : this.coordinates = new Vector(50, 250);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.topSpeed = 10;
    }

    checkEdges() {
        if(this.coordinates.x > width - this.size.x) {
            //this.velocity.x *= -1;
        }
        if(this.coordinates.x < 0) {
            //this.velocity.x *= -1;
        }
        if(this.coordinates.y > height - this.size.y) {
            this.velocity.y *= -1;
        }
        if(this.coordinates.y < 0) {
            this.velocity.y *= -1;
        }
    };

    applyGravity() {
        this.acceleration.add(this.gravity);
    }

    applyForce(force) {
        var f = force.makeCopy();
        f.div(this.mass);
        this.acceleration.add(f);
    };

    update() {
        this.velocity.add(this.acceleration);

        this.velocity.limit(this.topSpeed)
        
        this.coordinates.add(this.velocity);

        this.acceleration.mult(0);
    };

    display() {
        drawingSurface.beginPath();
        drawingSurface.fillStyle = 'black'
        drawingSurface.arc(this.coordinates.x, this.coordinates.y, this.size.x / 2, 0, 2 * Math.PI, false);
        drawingSurface.fill();
        drawingSurface.closePath();
    };
    
    animate() {
        /*drawingSurface.beginPath();
        drawingSurface.fillStyle = 'white'
        drawingSurface.arc(this.coordinates.x, this.coordinates.y, this.size.x / 2, 0, 2 * Math.PI, false);
        drawingSurface.fill();
        drawingSurface.closePath();*/
        //drawingSurface.clearRect(this.coordinates.x - this.size.x / 2, this.coordinates.y - this.size.y / 2, this.size.x, this.size.y);
        this.update();
        this.checkEdges();
        this.display();
    };
};

var click = false;

var clicks = 0;

var button = document.querySelector('button');

button.onclick = () => {
    ++clicks;
    if(clicks % 2 == 0) {
        click = false;
    }
    else {
        //mover.acceleration.mult(0);
        click = true;
    }
}

var attractor = new Attractor(10, 10);

var mArr = [];

for(let i = 0; i < 10; ++i) {
    var size = Math.random() * 50;
    var obj = new Mover((Math.random() * 800), (Math.random() * 600), size, size);
    mArr.push(obj);
}

var mover = new Mover(30, 200, 10, 10);
var mover2 = new Mover(width - 60, 200, 40, 40);
var mover3 = new Mover(30, 400, 30, 30);
var mover4 = new Mover(width - 50, 100, 10, 10);

window.addEventListener('keypress', e => {
    if(e.keyCode == 32) {
        window.requestAnimationFrame(update);
    }
}, {once: true});

function attract(m) {
    var f = attractor.attract(m);
    m.applyForce(f);
}

function combineAnimate() {
    for(let i = 0; i < mArr.length; ++i) {
        mArr[i].animate();
    }
    /*mover.animate();
    mover2.animate()
    mover3.animate()
    mover4.animate()*/
}

function update(time) {
    
    drawingSurface.clearRect(0, 0, width, height);
    attractor.display();
    
    if(click) {
        /*attract(mover);
        attract(mover2);
        attract(mover3);
        attract(mover4);*/
        for(let i = 0; i < mArr.length; ++i) {
            attract(mArr[i])
        }
    }

    combineAnimate();

    var id = window.requestAnimationFrame(update);
}