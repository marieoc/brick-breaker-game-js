class Paddle {
    // Member properties
    position;
    width;
    height;
    direction;
    speed;

    // Constructor
    constructor(x, y, width, height) {
        this.position = {
            x: x, // put argument **x** inside property **x** of member property **position**
            y: y  // put argument **y** inside property **y** of member property **position**
        };
        this.width = width;
        this.height = height;
        this.direction = 1;
        this.speed = 12; // for later, we might need to control the speed of the ball
    }

    // Methods
    move(rightLimit, leftLimit = 0) {
        // If inside the limits modify ball position
        if (
            this.position.x >= leftLimit &&
            this.position.x <= (rightLimit - this.width)
        ) {
            this.position.x += this.speed * this.direction * 3;

            // If new position outside the limits, readjust position
            if (this.position.x < leftLimit) {
                this.position.x = leftLimit;
            } else if (this.position.x > (rightLimit - this.width)) {
                this.position.x = rightLimit - this.width;
            }
        }
    }

    display(context) {
        // Choose color
        context.fillStyle = '#FF0CD6';

        // Draw a rectangle
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

export default Paddle;