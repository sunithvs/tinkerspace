import React, {useEffect, useState} from 'react'
// read user data from firestore
import {collection, getDocs} from "firebase/firestore";
import {db} from '../../firebase/config';
import "../../App.css"
import backgroundVideo from "../../images/4K_8.mp4"

const image_width = 100;
const image_padding = 10;

class GameObject {
    constructor(context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isColliding = false;
    }
}


class Imageobject extends GameObject {
    padding = image_padding;

    constructor(context, x, y, vx, vy, src) {
        //Pass params to super class
        super(context, x, y, vx, vy);

        this.src = src;
        //Set default width and height
        this.radius = 82;
    }
    randomColor() {
        //     return a random color from a list of colors
        const colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"];
        return colors[Math.floor(Math.random() * colors.length)];
    };
    draw() {
        const logo = new Image();
        logo.src = this.src;
        logo.width = image_width;
        logo.height = image_width;
        //  add a border rectangle to the image
        this.context.beginPath();

        // fill the rectangle with a color from a array of colors
        this.context.fillStyle = this.randomColor();
        this.context.fillRect(this.x - this.padding / 2, this.y - this.padding / 2, image_width + this.padding, image_width + this.padding);


        this.context.drawImage(logo, this.x, this.y, image_width, image_width);

    }

    update(secondsPassed) {

        //Move with velocity x/y
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

    }
}


class GameWorld {
    // Trigger init function when the page has loaded

    constructor(users) {
        this.canvas = null;
        this.context = null;
        this.oldTimeStamp = 0;
        this.gameObjects = [];
        this.users = users;


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
        let objectArray = [];
        for (let i = 0; i < this.users.length; i++) {
            objectArray.push(new Imageobject(this.context, getRndXY(), getRndXY(), getRndXY() , getRndXY(), this.users[i].profile_url));
        }


        console.log(objectArray)
        this.gameObjects = objectArray;
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
        let obj1;
        let obj2;

        //console.log("[GameWorld] " + "secondspassed: ", secondsPassed);
        for (let i = 0; i < this.gameObjects.length; i++) {
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

        for (let i = 0; i < this.gameObjects.length; i++) {
            obj1 = this.gameObjects[i];
            //obj1.isColliding = false;
            for (let j = i + 1; j < this.gameObjects.length; j++) {
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

                    const vecCollision = {
                        x: obj2.x - obj1.x,
                        y: obj2.y - obj1.y
                    };
                    //Distance between the two objects
                    const distance = this.getDistance(obj1.x, obj1.y, obj2.x, obj2.y);

                    //Normalized collision
                    //It is in the same direction but with norm (length) 1
                    const vecCollisionNorm = {
                        x: vecCollision.x / distance,
                        y: vecCollision.y / distance
                    };
                    const vRelativeVelocity = {
                        x: obj1.vx - obj2.vx,
                        y: obj1.vy - obj2.vy
                    };
                    const speed =
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
        return x2 < x1 + image_width+image_padding && x2 > x1 - (image_width+image_padding) && y2 < y1 + image_width+image_padding && y2 > y1 - (image_width+image_padding);

    }

    clearCanvas() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function getRndXY() {
    return Math.floor(Math.random() * (window.innerWidth));

}


// Init when page loads

const Home = (props) => {
    // users state

    useEffect(() => {
        const users = []
        const canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight
        const userRef = collection(db, "users");
        // get all users

        getDocs(userRef).then((querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    const data = await doc.data();
                    users.push(data);
                });

            }
        ).then(() => {
            const gameWorld = new GameWorld(users);
            gameWorld.init(canvas)
        })


    }, [])

    return ( <div>

                <video autoPlay muted id = 'background-video' >
                    <source src={backgroundVideo}/>
                </video>
                <canvas id="canvas"></canvas>
        </div>



    )
}

export default Home;
