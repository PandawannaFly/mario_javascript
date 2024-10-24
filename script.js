const mario = document.getElementById("mario");
    const container = document.getElementById("container");
    const coins = document.querySelectorAll('.coin');
    const obstacles = document.querySelectorAll('.obstacle');

    let marioPos = {
        x: parseInt(mario.style.left) || 100,
        y: parseInt(mario.style.bottom) || 100
    };
    
    let isJumping = false;
    let moveSpeed = 5;
    let score = 0;
    let coinCount = 0;
    let jumpHeight = 0;
    const maxJumpHeight = 120;

    // Movement controls
    const keys = {
        left: false,
        right: false,
        up: false
    };

    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case 'arrowleft':
            case 'a':
                keys.left = true;
                mario.classList.add('lookingLeft', 'runningLeft');
                mario.classList.remove('lookingRight', 'runningRight');
                break;
            case 'arrowright':
            case 'd':
                keys.right = true;
                mario.classList.add('lookingRight', 'runningRight');
                mario.classList.remove('lookingLeft', 'runningLeft');
                break;
            case 'arrowup':
            case 'w':
                if (!isJumping) jump();
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch(e.key.toLowerCase()) {
            case 'arrowleft':
            case 'a':
                keys.left = false;
                mario.classList.remove('runningLeft');
                break;
            case 'arrowright':
            case 'd':
                keys.right = false;
                mario.classList.remove('runningRight');
                break;
        }
    });

    function jump() {
        if (isJumping) return;
        
        isJumping = true;
        mario.classList.add('jumping');
        
        const jumpSound = new Audio('https://itc.yananas.com/git/mario/assets/jump.wav');
        jumpSound.play();

        // Track the actual jump position for collision detection
        let jumpInterval = setInterval(() => {
            if (jumpHeight < maxJumpHeight && isJumping) {
                jumpHeight += 10;
                marioPos.y += 10;
            } else {
                clearInterval(jumpInterval);
                setTimeout(() => {
                    let fallInterval = setInterval(() => {
                        if (jumpHeight > 0) {
                            jumpHeight -= 10;
                            marioPos.y -= 10;
                        } else {
                            clearInterval(fallInterval);
                            isJumping = false;
                            mario.classList.remove('jumping');
                        }
                    }, 20);
                }, 100);
            }
        }, 20);
    }

    function checkCollision(rect1, rect2) {
        return (rect1.left < rect2.right &&
                rect1.right > rect2.left &&
                rect1.top > rect2.bottom &&
                rect1.bottom < rect2.top);
    }

    function getMarioRect() {
        const marioHeight = mario.offsetHeight;
        const marioWidth = mario.offsetWidth;
        
        return {
            left: marioPos.x,
            right: marioPos.x + marioWidth,
            top: marioPos.y + marioHeight,
            bottom: marioPos.y,
            width: marioWidth,
            height: marioHeight
        };
    }

    function checkCoinCollision() {
        const marioRect = getMarioRect();
        
        coins.forEach(coin => {
            if (coin.classList.contains('hidden')) return;
            
            const coinLeft = parseInt(coin.style.left);
            const coinBottom = parseInt(coin.style.bottom);
            
            const coinRect = {
                left: coinLeft,
                right: coinLeft + coin.offsetWidth,
                top: coinBottom + coin.offsetHeight,
                bottom: coinBottom,
                width: coin.offsetWidth,
                height: coin.offsetHeight
            };

            if (checkCollision(marioRect, coinRect)) {
                collectCoin(coin);
            }
        });
    }

    function collectCoin(coin) {
        if (coin.classList.contains('hidden')) return;
        
        coin.classList.add('hidden');
        coinCount++;
        score += 100;
        
        // Update UI
        document.getElementById('updateCoins').textContent = 
            coinCount.toString().padStart(2, '0');
        document.getElementById('bottomline-score').textContent = 
            score.toString().padStart(6, '0');
        
        // Play coin sound
        const coinSound = new Audio('https://itc.yananas.com/git/mario/assets/coin.mp3');
        coinSound.volume = 0.5;
        coinSound.play();
    }

    function gameLoop() {
        if (keys.left && marioPos.x > 0) {
            let canMove = true;
            const nextPos = marioPos.x - moveSpeed;
            
            obstacles.forEach(obstacle => {
                const obstacleRect = {
                    left: parseInt(obstacle.style.left),
                    right: parseInt(obstacle.style.left) + obstacle.offsetWidth,
                    top: parseInt(obstacle.style.bottom) + obstacle.offsetHeight,
                    bottom: parseInt(obstacle.style.bottom)
                };
                
                const marioRect = getMarioRect();
                marioRect.left = nextPos;
                marioRect.right = nextPos + mario.offsetWidth;
                
                if (checkCollision(marioRect, obstacleRect)) {
                    canMove = false;
                }
            });
            
            if (canMove) marioPos.x = nextPos;
        }
        
        if (keys.right && marioPos.x < container.offsetWidth - mario.offsetWidth) {
            let canMove = true;
            const nextPos = marioPos.x + moveSpeed;
            
            obstacles.forEach(obstacle => {
                const obstacleRect = {
                    left: parseInt(obstacle.style.left),
                    right: parseInt(obstacle.style.left) + obstacle.offsetWidth,
                    top: parseInt(obstacle.style.bottom) + obstacle.offsetHeight,
                    bottom: parseInt(obstacle.style.bottom)
                };
                
                const marioRect = getMarioRect();
                marioRect.left = nextPos;
                marioRect.right = nextPos + mario.offsetWidth;
                
                if (checkCollision(marioRect, obstacleRect)) {
                    canMove = false;
                }
            });
            
            if (canMove) marioPos.x = nextPos;
        }

        mario.style.left = marioPos.x + 'px';
        mario.style.bottom = marioPos.y + 'px';
        
        checkCoinCollision();
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    gameLoop();

   // Background music setup
const music = new Audio('https://itc.yananas.com/git/mario/assets/overworld.mp3');
music.loop = true;
music.volume = 0.3;
music.play();

// Sound toggle button
const soundButton = document.getElementById('soundButton');
let soundOn = true; // variable to track sound state

soundButton.addEventListener('click', () => {
    if (soundOn) {
        music.pause(); // Pause the music
        soundButton.textContent = 'Sound Off'; // Update button text
    } else {
        music.play(); // Play the music
        soundButton.textContent = 'Sound On'; // Update button text
    }
    soundOn = !soundOn; // Toggle sound state
});