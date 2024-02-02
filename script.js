//! -------------------- !//
//! USEFUL NOTES TO SELF !//
//! -------------------- !//
//!Direction Notes
//In order to change direction, we must understnad it first.
//Direction of '1' means the index will keep adding 1 each time, aka it will move right
//If the number surpasses 9 then you have hit a wall
//Direction of '-1'means the index will keep taking1 away each time, aka it will move left
//Up and down work the same way but with -10(up) and +10(down), if the number goes 
//if direction = ?? has to be a condition for comparing which wall
//if going left then it can only go out the left wall etc.
//EVERY ELEMENT ON LEFT WALL IS A MULTIPLE OF 10
//EVERY ELEMENT ON RIGHT WALL IS A MULTIPLE OF 10 -1

//!Moving snake
//Use set interval on a function to move the snake
//Each tiem it is repeated, can change speed. Can add a button to change speeds maybe
//The snake moves by +1, -1, +10, -10 based on arrow input.

//!Snake eating
// in the case that the snake eats on an interval, dont move the snake
// Instead add 'direction' onto the front of the snake so it will not need
//to move instead just get bigger and it will look like its moved.

//!Variables
//Grid array contains all divs inside our game grid, indexed 0-99
let grid = document.querySelectorAll('main div')
let intervalTime = 200 //250ms frames
let interval = 0; //starting on the first interval
let timeDisplay = document.getElementById('time')
let gameOverScreen = 0
let endGameScreen = 0
let score = 0
let direction = 1 //direction right
let currentSnake = [2, 1, 0] //starter snake
let validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const gridWidth = 10; //squares in the grid row/column
let tempDirection //used to save direction before checking if valid
let appleLocation = undefined //apple not generated yet
let endBtns = document.getElementById('endBtnBox')
let restartBtn = document.getElementById('restartBtn')
let gameOverTxt = document.getElementById('gameOverMessage')
let highScoreTxt = document.getElementById('highScoreMessage')
let highScore = 0
//!SOUNDS
const appleSound = new Audio('soundFiles/appleCollision.wav');
const wallSound = new Audio('soundFiles/deathCollision.wav')
//background music
const bgSound = new Audio('soundFiles/bgMusic.mp3')
bgSound.loop=true
bgSound.volume=0.1
// bgSound.play()

//!WHEN START BUTTON IS PRESSED
function startGame() {
    //!RESETS ALL VARIABLES
    function resetVariables() {
        currentSnake = [2, 1, 0]
        direction = 1
        appleLocation = undefined
        //forEach - shorthand way of writing (i=0;i<curSn.len;i++)
        currentSnake.forEach((i) => {
            grid[i].classList.add('snake'); //defines box 1,2,3 as snake
        });
        newApple() //calls for first apple
        clearInterval(interval) //reset game timer
        startBtn.style.display = 'none';//Hides start button
        endBtns.style.display = 'none'; //Hides restart buttons
        //!CALLS CLOCK TO START
        clockTimer = setInterval(gameTimer, 1000)
        //!CALLS GAME LOOP TO START
        interval = setInterval(gameLoop, intervalTime) //runs game loop every intervalTime (250ms)
    }
    resetVariables()

    //!Generate Apple - Called at beginning and when apple eaten
    function newApple() {
        appleLocation = Math.floor(Math.random() * 100) //random num between 0-99, generates each time function is called
        for (let i = 0; i < currentSnake.length; i++) { //iterate through snake array
            if (appleLocation == currentSnake[i]) { //check if apple is inside snake
                newApple() //If apple would be inside snake, choses new number
            }
        }
        grid[appleLocation].classList.add('apple') //spawns apple
    }

    //!Clock function
    function gameTimer() { //runs every second
        let clock = Number(timeDisplay.innerText) //sets clock as the html documents 'Time'
        clock++ //adds a second on each time
        timeDisplay.innerText = clock //updates UI
    }

    //!GAME LOOP
    function gameLoop() {
        //!DIRECTION -- INPUT
        document.addEventListener('keydown', keyCheck) //adds event for key pressed
        function keyCheck(keyPressed) { //checks if valid key
            //!INVALID KEY
            if (!validKeys.includes(keyPressed.key)) {
                return //do nothing
            }
            //!VALID KEY
            changeDirection(keyPressed.key) //next function
        }
        //!DIRECTION -- LEFT,RIGHT,UP,DOWN
        function changeDirection(keyPressed) { //passed on from validity check
            //!Notes on this one apply to all
            if (keyPressed === 'ArrowRight') {
                //!BACKWARDS CHECK
                tempDirection = 1 //direction for comparing
                if (currentSnake[0] + tempDirection == currentSnake[1]) {
                    return //does nothing if attempting to go backwards
                } else {
                    //!LOCKS IN DIRECTION
                    direction = 1
                }
            }

            if (keyPressed === 'ArrowLeft') {
                tempDirection = -1
                if (currentSnake[0] + tempDirection == currentSnake[1]) {
                    console.log('class to left is snake')
                    return
                } else {
                    direction = -1
                }
            }

            if (keyPressed === 'ArrowUp') {
                tempDirection = -10
                if (currentSnake[0] + tempDirection == currentSnake[1]) {
                    console.log('class up is snake')
                    return
                } else {
                    direction = -10
                }

            }
            if (keyPressed === 'ArrowDown') {
                tempDirection = 10
                if (currentSnake[0] + tempDirection == currentSnake[1]) {
                    console.log('class down is snake')
                    return
                } else {
                    direction = 10
                }
            }
        }

        //!BORDER DEFINITION
        if ((currentSnake[0] + gridWidth > 99 && direction == 10) || //hits bottom wall
            (currentSnake[0] - gridWidth < 0 && direction == -10) || //hits top wall
            (currentSnake[0] % gridWidth === 0 && direction == -1) || //hits left wall
            (currentSnake[0] % gridWidth === gridWidth - 1 && direction == 1) || //hits right wall
            (grid[currentSnake[0] + direction].classList.contains('snake')) // hits itself
        ) {
            //!END GAME
            wallSound.play()//plays crash sound
            document.querySelector('.gameBox').classList.add('shake-horizontal')//shakes play box
            clearInterval(interval)//stops gameloop
            clearInterval(clockTimer)//stops clock
            //!DISPLAY GAME OVER
            gameOverScreen = setTimeout(gameOver, 700)//700ms pause before game over
            function gameOver() {
                gameOverTxt.style.display = 'flex'//displays message
                timeDisplay.innerText = 0 //sets clock to 0
                //!DETERMINE HIGH SCORE
                if (score > highScore) { //high score check
                    highScoreTxt.style.display = 'flex' //Displays new high score
                    highScore = score //set high score
                    highScoreTxt.classList.add('highScorePulse') //pulses 'NEW HIGHSCORE!'
                    document.getElementById('highScore').classList.add('highScorePulse') //pulses value of high score
                }
                document.getElementById('highScore').innerText = highScore //display high score
                score = 0 //reset score
                document.getElementById('score').innerText = score //display reset score
                //!REMOVE ELEMENTS FROM GRID
                currentSnake.forEach((i) => {
                    grid[i].classList.remove('snake'); //removes snake from existence
                });
                grid[appleLocation].classList.remove('apple')//removes apple
                //!RESTART/QUIT FUNCTION
                endGameScreen = setTimeout(endGame, 2000)
            }
            //!DISPLAY RESTART/QUIT BUTTONS
            function endGame() {
                //!RESET BUTTONS
                gameOverTxt.style.display = 'none' //removes game over text
                highScoreTxt.style.display = 'none' //removes high score text
                endBtns.style.display = 'flex'; //displays buttons
                //!REMOVE ANIMATIONS
                document.querySelector('.gameBox').classList.remove('shake-horizontal')
                highScoreTxt.classList.remove('highScorePulse')
                document.getElementById('highScore').classList.remove('highScorePulse')
                //!RESTART GAME
                restartBtn.addEventListener('mousedown', resetVariables) 
            }
            return
        }

        //!APPLE COLLISION
        if ((currentSnake[0] + direction) == appleLocation) {//if square infront of snake == apple
            grid[appleLocation].classList.remove('apple') //remove eaten apple
            score++ //Score +1
            appleSound.play(); //apple eaten sound
            newApple() //Generate new apple
        } else {
            //!MOVING SNAKE - remove tail add head, stays same size
            //Apple Eaten - Keep tail - grows by 1
            //Apple not eaten - remove tail - stays same length
            const tail = currentSnake.pop() //last item = tail
            grid[tail].classList.remove('snake') //removes tail

        }
        //Apple Eaten || Not Eaten - head moves by 1 forward
        currentSnake.unshift(currentSnake[0] + direction) //new head - front of array
        grid[currentSnake[0]].classList.add('snake') //defines head as a snake segment

        document.getElementById('score').innerText = score //updates score each interval
    }
}
