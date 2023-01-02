
"use strict";

// Declare as variable

const myImage = new Image(100);
myImage.src = 'picture.png';
document.body.appendChild(myImage);


class GameObject {
  constructor(context, x, y, vx, vy,usedata) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.userdata = usedata;
    this.isColliding = false;
  }
}


class Circle extends GameObject {
  constructor(context, x, y, vx, vy,userdata) {
    //Pass params to super class
    super(context, x, y, vx, vy,userdata);

    //Set default width and height
    this.radius = 25;
  }

  draw() {
    //Draw a simple square
    this.context.strokeStyle = this.isColliding ? "#ff8080" : "#0099b0";
    this.context.lineWidth = 3;
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.stroke();
    this.context.Image = myImage
  }

  update(secondsPassed) {
    const canvasWidth = 750;
    const canvasHeight = 400;

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

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");

    this.createWorld();

    // Request an animation frame for the first time
    // The gameLoop() function will be called as a callback of this request

    window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
  }




  
  createWorld() {
    let objectarray = []
    let howmanycircles = 100

    for (let i = 0; i <= howmanycircles; i++) {

      objectarray[i] = new Circle(this.context, getRndXY()[0],getRndXY()[1], getRndXY()[0]%100, getRndXY()[1]%50,{name:"hi"})

     }
     console.log(objectarray)


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

      const canvasWidth = 750;
      const canvasHeight = 400;
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
    // Calculate the distance between the two circles
    var distance = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles overlap
    return distance <= (r1 + r2) * (r1 + r2);
  }

  clearCanvas() {
    // Clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function getRndXY() {
  let x = Math.floor(Math.random() * (1025) );
  let y = Math.floor(Math.random() * (1025) );
  return [x,y]
}


// Init when page loads
var gameWorld = new GameWorld();
gameWorld.init("canvas");
