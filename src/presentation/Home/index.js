import React, {useEffect, useState} from 'react'
import pic from '../../images/picture.png';

}


class Imageobject extends GameObject {
    logo;

    constructor(context, x, y, vx, vy) {
        //Pass params to super class
        super(context, x, y, vx, vy);


        //Set default width and height
        this.radius = 82;
    }

    draw() {
        const logo = new Image();
        logo.src = "https://cataas.com/cat";
        logo.width = image_width;
        logo.height = image_width;
        //Draw a simple image
        this.context.drawImage(logo, this.x, this.y, image_width, image_width);

        // this.drawRoundedImage(logo,0,window.innerHeight-100,100,100,50)
    }

    update(secondsPassed) {

        //Move with velocity x/y
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

    }
}


class GameWorld {
    // Trigger init function when the page has loaded

    constructor() {
        this.canvas = null;
        this.context = null;
        this.oldTimeStamp = 0;
        this.gameObjects = [];
    }

    init(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        this.createWorld();

        // Request an animation frame for the first time
        // The gameLoop() function will be called as a callback of this request

        window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
    }


    createWorld() {
        let objectarray = []
        let howmanycircles = 10

        for (let i = 0; i < howmanycircles; i++) {

            objectarray[i] = new Imageobject(this.context, getRndXY()[0], getRndXY()[1], getRndXY()[0] % 100, getRndXY()[1] % 50)

        }

        this.gameObjects = objectarray;
    }


    gameLoop(timeStamp) {
        // Calculate how much time has passed
        let secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
        this.oldTimeStamp = timeStamp;

        secondsPassed = Math.min(secondsPassed, 0.1);

        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update(secondsPassed);
        }

        this.detectCollisions(secondsPassed);

        this.clearCanvas();

        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }

        // The loop function has reached it's end
        // Keep requesting new frames
        window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
    }

    detectCollisions(secondsPassed) {
        var obj1;
        var obj2;

        //console.log("[GameWorld] " + "secondspassed: ", secondsPassed);
        for (var i = 0; i < this.gameObjects.length; i++) {
            obj1 = this.gameObjects[i];
            obj1.isColliding = false;

            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;
            if (obj1.x < obj1.radius) {
                obj1.vx = Math.abs(obj1.vx) * 0.9;
                obj1.x = obj1.radius;
                obj1.isColliding = true;
            } else if (obj1.x > canvasWidth - obj1.radius) {
                obj1.vx = -Math.abs(obj1.vx) * 0.9;
                obj1.x = canvasWidth - obj1.radius;
                obj1.isColliding = true;
            }
            if (obj1.y < obj1.radius) {
                obj1.vy = Math.abs(obj1.vy) * 0.9;
                obj1.y = obj1.radius;
                obj1.isColliding = true;
            } else if (obj1.y > canvasHeight - obj1.radius) {
                obj1.vy = -Math.abs(obj1.vy) * 0.9;
                obj1.y = canvasHeight - obj1.radius;
                obj1.isColliding = true;
            }
        }

        for (var i = 0; i < this.gameObjects.length; i++) {
            obj1 = this.gameObjects[i];
            //obj1.isColliding = false;
            for (var j = i + 1; j < this.gameObjects.length; j++) {
                obj2 = this.gameObjects[j];

                if (
                    this.circleIntersect(
                        obj1.x,
                        obj1.y,
                        obj1.radius,
                        obj2.x,
                        obj2.y,
                        obj2.radius
                    )
                ) {
                    obj1.isColliding = true;
                    obj2.isColliding = true;

                    // this.gameObjects.push(new Circle(this.context, 100, 50, 100, 50));

                    var vecCollision = {
                        x: obj2.x - obj1.x,
                        y: obj2.y - obj1.y
                    };
                    //Distance between the two objects
                    var distance = this.getDistance(obj1.x, obj1.y, obj2.x, obj2.y);

                    //Normalized collision
                    //It is in the same direction but with norm (length) 1
                    var vecCollisionNorm = {
                        x: vecCollision.x / distance,
                        y: vecCollision.y / distance
                    };
                    var vRelativeVelocity = {
                        x: obj1.vx - obj2.vx,
                        y: obj1.vy - obj2.vy
                    };
                    var speed =
                        vRelativeVelocity.x * vecCollisionNorm.x +
                        vRelativeVelocity.y * vecCollisionNorm.y;

                    if (speed < 0) {
                        //console.log("[GameWorld] " + "p: " + p + "objects move away from each other");
                        break;
                    }

                    obj1.vx -= speed * vecCollisionNorm.x;
                    obj1.vy -= speed * vecCollisionNorm.y;
                    obj2.vx += speed * vecCollisionNorm.x;
                    obj2.vy += speed * vecCollisionNorm.y;
                }
            }
        }
    }

    getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    circleIntersect(x1, y1, r1, x2, y2, r2) {
            if(x2 < x1+ image_width && x2 > x1-image_width && y2 < y1+ image_width && y2 > y1-image_width )
                return true
            return  false
    }

    clearCanvas() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function getRndXY() {
    let x = Math.floor(Math.random() * (window.innerWidth));
    let y = Math.floor(Math.random() * (window.innerHeight));
    return [x, y]
}


// Init when page loads

const Home = (props) => {

    useEffect(() => {
        const canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        const gameWorld = new GameWorld();
        gameWorld.init(canvas)


    }, [])

    return (
        <div>
            <canvas id="canvas"></canvas>
        </div>
    )
}


export default Home;
