class Brick {
    // Member properties
    position;
    width;
    height;
    color;
    collisionNumber;

    // Constructor
    constructor(x, y, width, height, color = 'black') {
        this.position = {
            x: x, // put argument **x** inside property **x** of member property **position**
            y: y  // put argument **y** inside property **y** of member property **position**
        };
        this.width = width;
        this.height = height;
        this.color = color;
        this.collisionNumber = 1;
    }

    display(context){
        if(this.collisionNumber > 0){
            context.fillStyle = this.color;
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
            return 1; // Brick is displayed
        }

        return 0; // Brick is not displayed
    }
}

export default Brick;