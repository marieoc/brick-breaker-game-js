import Game from './module/Game.js';

document.addEventListener('DOMContentLoaded', () => {
    // Get the context from <canvas> element
    const canvas = document.getElementById('canvas');

    // Instantiate game object from Game class
    const game = new Game(canvas); // pass **canvas** through class constructor

    // Start game
    game.play();
});