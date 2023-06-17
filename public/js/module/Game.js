import Ball from './Ball.js'
import Paddle from './Paddle.js'
import Brick from './Brick.js'

const hearts = Array.from(document.querySelectorAll('.heart'));

class Game {
    // Member properties
    canvas;
    context;
    animationId;
    ball;
    paddle;
    bricks;
    isGameStarted;
    isGamePaused;
    isGameOver;
    isGameWon;
    remainingLives;

    // Constructor
    constructor(canvas) {
        // Initialize member properties
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.animationId = null;
        this.ball = new Ball(canvas.width/2, canvas.height - 25 - 10, 25); // give initial position and size with parameters
        this.paddle = new Paddle(canvas.width/2 - 100/2, canvas.height - 25, 160, 15); // give initial position and size with parameters
        this.bricks = [];
        this.isGameStarted = false;
        this.isGamePaused = false;
        this.isGameOver = false;
        this.remainingLives = 3;

        // Execute initialization methods
        this.generateBricks(15);
        this.addAllEventListeners();
    }

    // Methods
    generateBricks(number){
        for(let i = 0; i < number; i++){
            let color = i%2==0 ? '#23DAFF' : '#CD23FF';
            // Not more than 5 bricks per line
            let width = this.canvas.width/5 - 6;
            let height = 20;
            let x = 5 + i%5*(5 + width);
            let y = 5 + Math.floor(i/5)*(5 + height);
            this.bricks.push(new Brick(x, y, width, height, color));
        }
    }

    resetBricks() {
        this.bricks = [];
        this.generateBricks(15);
    }

    initPositions() {
        // Ball position
        this.ball.position.y = this.paddle.position.y - this.ball.size/2 - 1;
        this.ball.position.x = this.paddle.position.x + this.paddle.width/2;

        // Ball Direction
        this.ball.direction.x = 0;
        this.ball.direction.y = -1;
    }

    play() {
        // If game has been started and not paused, move the ball
        if(this.isGameStarted && !this.isGamePaused){
            this.ball.move(this.canvas.height, this.canvas.width);

        // If game is not started yet, initialize game
        } else if(!this.isGameStarted) {
            this.initPositions();
        }

        // Detect collisions
        this.detectCollisions();

        // Display complete new drawing (dessin)
        this.display();

        // Continue game by calling **Game.play** again
        this.animationId = window.requestAnimationFrame(this.play.bind(this));
    }

    display() {
        // Make the canvas blank before drawing
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Display remaining lives
        for (let i = 0; i < hearts.length; i++) {
            if (i <= this.remainingLives - 1) {
                hearts[i].style.visibility = 'visible';
            } else {
                hearts[i].style.visibility = 'hidden';
            }
        }

        // Draw game objects
        this.ball.display(this.context)
        this.paddle.display(this.context)

        // Keep count of bricks not touched yet
        let brickCount = 0;
        for(const brick of this.bricks){
            brickCount += brick.display(this.context);
        }

        // If there is no brick anymore, display game won message
        if(0 === brickCount){
            this.isGamePaused = true;
            this.isGameWon = true;
            this.displayGameWon();
        }

        // If game is over, display game over message
        if (this.isGameOver) {
            this.displayGameOver();
        }

    }

    detectCollisions() {
        // If ball touches the paddle it bounces back
        if (
            this.ball.position.y + this.ball.size/2 >= this.paddle.position.y &&
            (
                this.ball.position.x >= this.paddle.position.x &&
                this.ball.position.x <= (this.paddle.position.x + this.paddle.width)
            )
        ) {
            this.ball.direction.y *= -1;

            // Calculate the ratio of the ball's position relative to the paddle's width
            const positionRatio = (this.ball.position.x - this.paddle.position.x) / this.paddle.width;

            // Adjust the bounce angle based on the position ratio
            this.ball.direction.x = positionRatio * 2 - 1;


        } 
        // If ball touches bottom, decrease remaining lives
        else if (this.ball.position.y + this.ball.size/2 >= this.canvas.height) {
            this.remainingLives--;
            
            if (this.remainingLives === 0) {
                this.isGameOver = true;
                this.isGamePaused = true;
            } else {
                // Reset ball and paddle positions
                this.isGamePaused = true;
                this.initPositions();
            }
        }

        

        // Detect collision for all bricks
        for (const brick of this.bricks){
            // If brick is still there
            if (brick.collisionNumber > 0) {
                // If ball touches the brick from the top or the bottom
                if (
                    (
                        this.ball.direction.y === -1 &&
                        Math.floor((this.ball.position.y - this.ball.size/2)/this.ball.speed) === Math.floor((brick.position.y + brick.height)/this.ball.speed)
                    ) ||
                    (
                        this.ball.direction.y === 1 &&
                        Math.floor((this.ball.position.y + this.ball.size/2)/this.ball.speed) === Math.floor((brick.position.y)/this.ball.speed)
                    )
                ) {
                    // If ball is right below or above the brick on the horizontal axis
                    if(
                        this.ball.position.x + this.ball.size/2 >= brick.position.x &&
                        this.ball.position.x + this.ball.size/2 <= brick.position.x + brick.width
                    ) {
                        this.ball.direction.y *= -1;
                        brick.collisionNumber--;
                    }
                }
            }
        };
    }
    
    displayGameOver()
    {
        this.context.fillStyle = '#fff';
        this.context.font = 'bold 30px Retro Gaming';
        // Write text on the center by measuring the size first
         
        let txtMetrics = this.context.measureText('Game Over!');
        this.context.fillText('Game Over!', this.canvas.width / 2 - txtMetrics.width/2, this.canvas.height/2);
    }

    displayGameWon()
    {
        this.context.fillStyle = '#fff';
        this.context.font = 'bold 30px Retro Gaming';

        // Write text on the center by measuring the size first
        let txtMetrics = this.context.measureText('You won!');
        this.context.fillText('Victory!', this.canvas.width / 2 - txtMetrics.width/2, this.canvas.height/2);
    }

    // Add all event listener of the game here
    addAllEventListeners() {
        document.addEventListener('keydown', this.handleKeyboardEvent.bind(this))
    }

    // Event listener callbacks
    handleKeyboardEvent(event) {
        switch(event.code) {
            // Move paddle to the left
            case 'ArrowLeft':
                this.paddle.direction = -1;
                this.paddle.move(this.canvas.width);

                // update ball position if user move paddle before starting the game
                if (!this.isGameStarted || this.isGamePaused) {
                    this.ball.position.x = this.paddle.position.x + (this.paddle.width / 2);
                }

                break;

            // Move paddle to the left
            case 'ArrowRight':
                this.paddle.direction = 1;
                this.paddle.move(this.canvas.width);

                // update ball position if user move paddle before starting the game
                if (!this.isGameStarted || this.isGamePaused) {
                    this.ball.position.x = this.paddle.position.x + (this.paddle.width / 2);
                }

                break;

            // Handle Space key
            case 'Space':
                if(!this.isGameStarted) {
                    this.isGameStarted = true;
                    this.isGamePaused = false;
                } else if(this.isGameOver || this.isGameWon) {
                        this.remainingLives = 3;
                        this.isGameOver = false;
                        this.isGameWon = false;
                        this.isGameStarted = false;
                        this.initPositions();
                        this.resetBricks();
                } else {
                    this.isGamePaused = !this.isGamePaused;
                }
        }
    }
}

export default Game;