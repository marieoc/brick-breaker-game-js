class Ball {
    // Member properties
    position;
    size;
    direction;
    speed;

    // Constructor
    constructor(x, y, size) {
        this.position = {
            x: x, // put argument **x** inside property **x** of member property **position**
            y: y  // put argument **y** inside property **y** of member property **position**
        };
        this.size = size; // Size of the ball (2 times the radius)
        this.direction = {
            x: 1,
            y: -1
        }
        this.speed = 4; // for later, we might need to control the speed of the ball
    }

    // Methods
    move(bottomLimit, rightLimit, topLimit = 0, leftLimit = 0, ) {
        // If ball goes outside the vertical canvas borders, change direction (rebound)
        if (
            this.position.y <= (topLimit + this.size/2) ||
            this.position.y >= (bottomLimit - this.size/2)
        ) {
            this.direction.y *= -1;
        }

        // If ball goes outside the horizontal canvas borders, change direction (rebound)
        if (
            this.position.x <= (leftLimit + this.size/2) ||
            this.position.x >= (rightLimit - this.size/2)
        ) {
            this.direction.x *= -1;
        }

        // Modify ball position
        this.position.y += this.speed * this.direction.y;
        this.position.x += this.speed * this.direction.x;
    }

    display(context) {
        // Choose color
        context.fillStyle = '#23FFFF';

        // Draw a disk
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.size/2, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
}

export default Ball;