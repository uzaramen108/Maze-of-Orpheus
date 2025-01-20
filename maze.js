        const virtualMazeSize = 180; // Virtual maze size
        const viewSize = 36; // Viewport size
        const wallThickness = 21; // Outer wall thickness
        let stagenum = 1; // 스테이지의 넘버
        let bombnum = 3; //폭탄 수
        let shovelnum = 0; //삽 수
        let snacknum = 3; //간식 수
        let hpadjust = 0.1;
        let sandnum = 0;
        let stopgamenum = 0;
        let confusenum = 0;
        let endingcount = 0;
        let nowife = 0;

        // Player's initial position in the virtual maze
        const playerPosition = { x: 90, y: 90 };
        const maze = [];
        const stairs = [
            { x: 25, y: 25 },
            { x: 25, y: 155 },
            { x: 155, y: 155 },
            { x: 155, y: 25 }
        ];


        function getPathClass() {
            if (stagenum >= 3 && stagenum <= 4) {
                return 'path-sand';
            } else if (stagenum >= 5 && stagenum <= 6) {
                return 'path-gray';
            } else if (stagenum == 7) {
                return 'path-grass';
            } else if (stagenum == 0) {
                return 'path-red';
            }
            return 'path';
        }



        let randwall = 0;
        let randgreen = 0;
        let randblue = 0;
        let randsand = 0;
        let randbomb = 0;
        let randtrap = 0;
        let randconfuse = 0;

        function defineVariable(stagenum) {
            if (stagenum == 1) {
                randwall = 0.3;
                randgreen = 0.05;
                randblue = 0.05;
                randbomb = 0.00;
                randsand = 0;
                randtrap = 0;
                randconfuse = 0;
                hpadjust = 0.8;
            } else if (stagenum == 2) {
                randwall = 0.32;
                randgreen = 0.1;
                randblue = 0.1;
                randbomb = 0.02;
                randsand = 0;
                randtrap = 0;
                randconfuse = 0;
                hpadjust = 0.85;
            } else if (stagenum ==3) {
                randwall = 0.33;
                randgreen = 0.1;
                randblue = 0.2;
                randbomb = 0.00;
                randsand = 0.15;
                randtrap = 0;
                randconfuse = 0;
                hpadjust = 0.9;
            } else if (stagenum ==4) {
                randwall = 0.34;
                randgreen = 0.1;
                randblue = 0.2;
                randbomb = 0.00;
                randsand = 0.17;
                randtrap = 0;
                randconfuse = 0;
                hpadjust = 0.95;
            } else if (stagenum ==5) {
                randwall = 0.34;
                randgreen = 0.1;
                randblue = 0.2;
                randbomb = 0.05;
                randsand = 0;
                randtrap = 0.1;
                randconfuse = 0.01;
                hpadjust = 1;
            } else if (stagenum ==6) {
                randwall = 0.4;
                randgreen = 0.1;
                randblue = 0.2;
                randbomb = 0.05;
                randsand = 0;
                randtrap = 0;
                randconfuse = 0.05;
                hpadjust = 1.1;
            } else if (stagenum ==7) {
                randwall = 0.25;
                randgreen = 0.0;
                randblue = 0.0;
                randbomb = 0.0;
                randsand = 0;
                randtrap = 0.2;
                randconfuse = 0.1;
                hpadjust = 0.1;
            } else if (stagenum ==0) {
                randwall = 0.34;
                randgreen = 0.05;
                randblue = 0.08;
                randbomb = 0.1;
                randsand = 0;
                randtrap = 0.1;
                randconfuse = 0.02;
                hpadjust = 1.2;
            }
        }
                
        function showStagePopup(stagenum) {
            let stagePopup = document.getElementById('stagePopup');
            
            // Set the popup content
            if (stagenum == 1) {
                stagePopup.innerText = `심계 6층`;                
            } else if (stagenum == 2) {
                stagePopup.innerText = `심계 5층`;                
            } else if (stagenum == 3) {
                stagePopup.innerText = `심계 4층`;                
            } else if (stagenum == 4) {
                stagePopup.innerText = `심계 3층`;                
            } else if (stagenum == 5) {
                stagePopup.innerText = `심계 2층`;                
            } else if (stagenum == 6) {
                stagePopup.innerText = `심계 1층`;                
            } else if (stagenum == 7) {
                stagePopup.innerText = `지상 1층-미혹의 숲`;                
            } else if (stagenum == 0) {
                stagePopup.innerText = `심계-공전`;                
            }
            // Display the popup
            stagePopup.classList.add('show');
            stagePopup.style.display = 'flex';

            // After 3 seconds, hide the popup with fade-out effect
            setTimeout(() => {
                stagePopup.classList.add('hide');
                setTimeout(() => {
                    stagePopup.style.display = 'none';
                    stagePopup.classList.remove('show', 'hide');
                }, 1000); // Wait for the fade-out transition to complete
            }, 3000);

        }

        function firstplay() {
            const fpopup = document.querySelector('.first-popup');
                 
            fpopup.style.display = 'flex';
            clearInterval(this.downInterval);
            clearInterval(this.timeInterval);
            const gogosing = document.querySelector('.start');
            gogosing.addEventListener('click', () => {
                fpopup.style.display = 'none';
                this.gamestart();
            })

        }

        // Create the virtual maze
        function createVirtualMaze() {
            defineVariable(stagenum);
            showStagePopup(stagenum);
            updateHelpMessages(stagenum);
            confusenum = 0;
            for (let row = 0; row < virtualMazeSize; row++) {
                maze[row] = [];
                for (let col = 0; col < virtualMazeSize; col++) {
                    if (
                        row < wallThickness || row > virtualMazeSize - wallThickness ||
                        col < wallThickness || col > virtualMazeSize - wallThickness
                    ) {
                        maze[row][col] = 'strictwall';
                    } else if (
                        (row % 2 === 0 && col % 2 === 0) ||
                        ((row % 2 === 0 || col % 2 === 0) && Math.random() < randwall)
                    ) {
                        if (stagenum !== 7) {
                            maze[row][col] = 'wall';
                        } else {
                            maze[row][col] = 'wall-seven';
                        }
                    } else if ((row % 2 === 0 && col % 2 === 0) ||
                    ((row % 2 === 0 || col % 2 === 0) && Math.random() < randgreen)) {
                        maze[row][col] = 'green-tile';
                    } else if ((row % 2 === 0 && col % 2 === 0) ||
                    ((row % 2 === 0 || col % 2 === 0) && Math.random() < randblue)) {
                        maze[row][col] = 'blue-tile';
                    } else if ((row % 2 === 0 && col % 2 === 0) ||
                    ((row % 2 === 0 || col % 2 === 0) && Math.random() < randbomb)) {
                        maze[row][col] = 'bomb';
                    } else if ((row % 2 === 0 && col % 2 === 0) ||
                    ((row % 2 === 0 || col % 2 === 0) && Math.random() < randsand)) {
                        maze[row][col] = 'flowsand';
                    } else if ((row % 2 === 0 && col % 2 === 0) ||
                    ((row % 2 === 0 || col % 2 === 0) && Math.random() < randtrap)) {
                        maze[row][col] = 'trap';
                    } else if ((row % 2 === 0 && col % 2 === 0) ||
                    ((row % 2 === 0 || col % 2 === 0) && Math.random() < randconfuse)) {
                        maze[row][col] = 'confuse';
                    } else {
                        maze[row][col] = getPathClass();
                    }
                }
            }

            // Create paths around the player's starting position
            for (let row = playerPosition.y - 2; row <= playerPosition.y + 2; row++) {
                for (let col = playerPosition.x - 2; col <= playerPosition.x + 2; col++) {
                    if (maze[row][col] !== "strictwall") {
                        maze[row][col] = getPathClass();
                    }
                }
            }

            // Create paths around each stair
            if (stagenum !== 7 && stagenum !== 0) {
            stairs.forEach(stair => {
                for (let row = stair.y - 2; row <= stair.y + 2; row++) {
                    for (let col = stair.x - 2; col <= stair.x + 2; col++) {
                        maze[row][col] = getPathClass();
                    }
                }
                maze[stair.y][stair.x] = 'stair';
            }
            );} else {
                if (endingcount == 2) {
                    maze[80][90] = 'exit';
                } else {
                    maze[90][90] = 'exit';
                }
                
            }
            if (stagenum == 0) {
                startAutoblast();
            }
        }

        // Render the visible portion of the maze
        function renderView() {
            const gameTable = document.getElementById('gameTable');
            gameTable.innerHTML = '';

            
            const startX = playerPosition.x - Math.floor(viewSize / 2);
            const startY = playerPosition.y - Math.floor(viewSize / 2);           
            
            for (let row = 0; row < viewSize; row++) {
                const tableRow = document.createElement('tr');
                for (let col = 0; col < viewSize; col++) {
                    const cell = document.createElement('td');

                    const virtualX = startX + col;
                    const virtualY = startY + row;

                    if (virtualX >= 0 && virtualX < virtualMazeSize && virtualY >= 0 && virtualY < virtualMazeSize) {
                        if (virtualX === playerPosition.x && virtualY === playerPosition.y) {
                            cell.classList.add('player');
                        } else {
                            cell.classList.add(maze[virtualY][virtualX]);
                        }
                    } else {
                        cell.classList.add('strictwall');
                    }

                    tableRow.appendChild(cell);
                }
                gameTable.appendChild(tableRow);
            }
        }

        function wifemove() {
            const wifeX = playerPosition.x;
            const wifeY = playerPosition.y;
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    const wargetX = wifeX + x;
                    const wargetY = wifeY + y;
                    if (
                        Math.abs(x) + Math.abs(y) == 1 &&
                        maze[wargetY][wargetX] == 'wife'
                    ) {
                        maze[wargetY][wargetX] = getPathClass();
                    }
                }
            }
            maze[wifeY][wifeX] = 'wife';
        }

        // Move the player and update the view
        function movePlayer(dx, dy) {
            const newX = playerPosition.x + dx;
            const newY = playerPosition.y + dy;

            if (
                maze[newY] &&
                maze[newY][newX] &&
                maze[newY][newX] !== 'strictwall' &&
                maze[newY][newX] !== 'wall' &&
                maze[newY][newX] !== 'wall-seven'
            ) {
                if (maze[newY][newX] === 'green-tile') {
                    const wallX = newX + 2 * dx;
                    const wallY = newY + 2 * dy;
                    if (maze[wallY] && maze[wallY][wallX] && maze[wallY][wallX] !== 'strictwall') {
                        maze[wallY][wallX] = 'wall';
                    }
                } else if (maze[newY][newX] === 'blue-tile') {
                    for (let y = -2; y <= 2; y++) {
                        for (let x = -2; x <= 2; x++) {
                            const targetX = newX + x;
                            const targetY = newY + y;
                            if (
                                Math.abs(x) + Math.abs(y) == 2 &&
                                maze[targetY] &&
                                maze[targetY][targetX] &&
                                maze[targetY][targetX] !== 'strictwall'
                            ) {
                                maze[targetY][targetX] = maze[targetY][targetX] === 'wall' ? getPathClass() : 'wall';
                            }
                        }
                    }
                } else if (maze[newY][newX] === 'bomb') {
                    alert("폭탄을 1개 주웠다.");
                    bombnum =  bombnum + 1;
                    updateResourceDisplay();
                } else if (maze[newY][newX] === 'stair') {
                    stagenum += 1;
                    health += 50;
                    sandnum = 0;
                    updateResourceDisplay();
                    createVirtualMaze();
                    
                     // Show popup instead of alert
                } else if (maze[newY][newX] === 'wife') {
                    
                    showImageForTwoSeconds('./img/damn.png');
                } else if (maze[newY][newX] === 'path-sand') {
                    if (Math.random() < 0.015) {
                        alert("모래 속에서 폭탄을 1개 주웠다.");
                        bombnum =  bombnum + 1;
                    } else if (Math.random() < 0.02) {
                        alert("모래 속에서 간식을 1개 주웠다.");
                        snacknum =  snacknum + 1;
                    } else if (Math.random() < 0.006) {
                        alert("모래 속에서 삽을 1개 주웠다.");
                        shovelnum =  shovelnum + 1;
                    } 
                    updateResourceDisplay();
                } else if (maze[newY][newX] === 'flowsand') {
                    if (sandnum > 4) {
                        alert("유사에 몸이 휩쓸려버렸다!")
                        stagenum = stagenum - 1;
                        createVirtualMaze(); // Regenerate the maze
                        sandnum = 0;
                    } else {
                        alert("모래에 발이 빠졌다.")
                        sandnum = sandnum + 1
                    }
                } else if (maze[newY][newX] === 'exit') {
                    if (stagenum == 7) {
                        if (endingcount == 0) {
                            endingcount = 1;
                            showImageForTwoSeconds('./img/damn.png');
                        } else if (endingcount == 2) {
                            hiddenending();
                        }
                    } else if (stagenum == 0) {
                        stagenum = 7;
                        health = 100;
                        sandnum = 0;
                        endingcount = 2;
                        createVirtualMaze();
                    }
                } else if (maze[newY][newX] === 'trap') {
                    alert("함정을 밟았다. 당신은 힘없이 주저앉았다.");
                    health -= 30;
                } else if (maze[newY][newX] === 'blast') {
                    health -= 30;
                } else if (maze[newY][newX] === 'confuse') {
                    alert("당신의 감각이 이상해지는 것을 느꼈다.");
                    if (confusenum == 0) {
                        confusenum = 1;
                    } else {
                        confusenum = 0;
                    }
                } else if (maze[newY][newX] === 'path-red' && Math.random() < 0.1) {
                    // 랜덤 조건 및 범위 설정
                    const originalTiles = [];
                    for (let dy = -4; dy <= 4; dy++) {
                        for (let dx = -4; dx <= 4; dx++) {
                            const distance = Math.abs(dx) + Math.abs(dy);
                            if (distance >= 2 && distance <= 4 && Math.random() < 0.6) { // 거리 2~4 조건 및 30% 확률
                                const targetX = newX + dx;
                                const targetY = newY + dy;
                
                                // 유효한 타일인지 확인 후 blast 처리
                                if (maze[targetY] && maze[targetY][targetX] && maze[targetY][targetX] !== 'strictwall') {
                                    const originalValue = maze[targetY][targetX] === 'wife' ? 'path-red' : maze[targetY][targetX]; 
                                    originalTiles.push({ x: targetX, y: targetY, value: originalValue });
                                    maze[targetY][targetX] = 'blast';
                
                                    // 타일 즉시 갱신 (렌더링 필요)
                                    renderView();
                                }
                            }
                        }
                    }
                
                    // 5초 후 blast → path-red 복원
                    setTimeout(() => {
                        for (const tile of originalTiles) {
                            // originalTiles 배열의 각각의 tile 객체에서 x, y 좌표와 value를 가져와 복원
                            maze[tile.y][tile.x] = tile.value;
                    
                            // 타일 즉시 갱신 (렌더링 필요)
                            renderView();
                        }
                    }, 3000);
                }
                
                
                if (nowife == 0) {
                    maze[playerPosition.y][playerPosition.x] = 'wife'; // Mark previous position as path
                    wifemove();
                }
                
                health -= 0.02 * hpadjust;

                playerPosition.x = newX;
                playerPosition.y = newY;

                

                renderView();
            }
        }

        function shoveldown() {
            if (shovelnum == 0) {
                alert("보유한 삽이 없습니다.");
            } else {
                if (stagenum == 0) {
                    alert("땅이 너무 단단하다.");

                } else {
                    alert("삽으로 땅을 파고 내려갑니다.");
                    if (stagenum == 1) {
                        playerPosition.x = 90;
                        playerPosition.y = 150;
                    } 
                    stagenum -= 1;
                    health += 50;
                    sandnum = 0;
                    
                    createVirtualMaze();
                }
                updateResourceDisplay();
            }
        }

        function eatsnack() {
            if (snacknum > 0) {
                if (health >80) {
                    health = 100;
                    
                } else {
                    health = health + 20;
                }
                alert("초코바를 하나 꺼내먹었다.");
                snacknum = snacknum - 1;
            }
            updateResourceDisplay();
        }

        // Clear cross walls on 'q'
        function clearCrossWalls() {
            if (bombnum > 0) {
                const directions = [
                    { dx: 0, dy: -1 }, // Up
                    { dx: 0, dy: 1 },  // Down
                    { dx: -1, dy: 0 }, // Left
                    { dx: 1, dy: 0 }   // Right
                ];

                directions.forEach(({ dx, dy }) => {
                    const targetX = playerPosition.x + dx;
                    const targetY = playerPosition.y + dy;

                    if (maze[targetY] && maze[targetY][targetX] === 'wall') {
                        maze[targetY][targetX] = getPathClass();
                    }
                });
                bombnum = bombnum - 1
                updateResourceDisplay();
                renderView();
            }
        }

        function updateResourceDisplay() {
            const bombDisplay = document.getElementById('bombDisplay');
            const shovelDisplay = document.getElementById('shovelDisplay');
            const snackDisplay = document.getElementById('snackDisplay');
        
            bombDisplay.textContent = `Bombs: ${bombnum}`;
            shovelDisplay.textContent = `Shovels: ${shovelnum}`;
            snackDisplay.textContent = `Snacks: ${snacknum}`;
        }
        
        // Update all displays (stage and resources)
        

        // Handle player movement and special actions with keys
        document.addEventListener('keydown', (e) => {
            if (stopgamenum == 0) {
                if (confusenum == 0) {
                    switch (e.key) {
                        case 'w':
                            movePlayer(0, -1);
                            break;
                        case 's':
                            movePlayer(0, 1);
                            break;
                        case 'a':
                            movePlayer(-1, 0);
                            break;
                        case 'd':
                            movePlayer(1, 0);
                            break;
                        case 'q':
                            clearCrossWalls();
                            break;
                        case 'e':
                            eatsnack();
                            break;
                        case 'r':
                            shoveldown();

                        case 'W':
                            movePlayer(0, -1);
                            break;
                        case 'S':
                            movePlayer(0, 1);
                            break;
                        case 'A':
                            movePlayer(-1, 0);
                            break;
                        case 'D':
                            movePlayer(1, 0);
                            break;
                        case 'Q':
                            clearCrossWalls();
                            break;
                        case 'E':
                            eatsnack();
                            break;
                        case 'R':
                            shoveldown();
                    }
                } else {
                    switch (e.key) {
                        case 'S':
                            movePlayer(0, -1);
                            break;
                        case 'W':
                            movePlayer(0, 1);
                            break;
                        case 'D':
                            movePlayer(-1, 0);
                            break;
                        case 'A':
                            movePlayer(1, 0);
                            break;
                        case 'Q':
                            clearCrossWalls();
                            break;
                        case 'E':
                            eatsnack();
                            break;
                        case 'R':
                            shoveldown();

                        case 's':
                            movePlayer(0, -1);
                            break;
                        case 'w':
                            movePlayer(0, 1);
                            break;
                        case 'd':
                            movePlayer(-1, 0);
                            break;
                        case 'a':
                            movePlayer(1, 0);
                            break;
                        case 'q':
                            clearCrossWalls();
                            break;
                        case 'e':
                            eatsnack();
                            break;
                        case 'r':
                            shoveldown();
                    }
                }
            }
                
            
        });

        let health = 100; // Starting health
        const healthBar = document.getElementById('healthBar');

        function updateHealth() {
            health -= hpadjust; // Decrease health by 1 per second
            if (health < 0) {
                health = 0;
                gameover();
            } else if (health > 151) {
                health = 150;
            } // Prevent health from going negative

            // Update the health bar width
            const healthPercentage = (health / 100) * 100; // Calculate percentage
            healthBar.style.width = `${healthPercentage}%`;

            // Change color based on health percentage
            if (health > 50) {
                healthBar.style.background = 'linear-gradient(to right, #4caf50, #8bc34a)';
            } else if (health > 20) {
                healthBar.style.background = 'linear-gradient(to right, #ff9800, #ff5722)';
            } else {
                healthBar.style.background = 'linear-gradient(to right, #f44336, #d32f2f)';
            }

            if (health > 0) {
                setTimeout(updateHealth, 1000); // Continue decreasing health every second
            }
        }

        // Start updating health
        function gamestart() {
            const popup = document.querySelector('.popup');
            popup.style.display = 'none';
            const ending = document.querySelector('.ending');
            ending.style.display = 'none';
            nowife = 0;
            endingcount = 0;
            health = 100;
            stagenum = 1; // 스테이지의 넘버
            bombnum = 3; //폭탄 수
            shovelnum = 0; //삽 수
            nacknum = 3; //간식 수
            hpadjust = 1;
            sandnum = 0;
            updateResourceDisplay();
            updateHealth();
            createVirtualMaze();
            renderView();
            showStagePopup();
        }

        function restart() {
            const popup = document.querySelector('.popup');
            popup.style.display = 'none';
            const ending = document.querySelector('.ending');
            ending.style.display = 'none';
            const hending = document.querySelector('.hending');
            hending.style.display = 'none';
        
            if (stopgamenum === 0) {
                alert("게임을 다시 시작합니다.");
            }
            endingcount = 0;
            nowife = 0;
            stopgamenum = 0;
            stagenum = 1; // 스테이지의 넘버
            bombnum = 3; // 폭탄 수
            shovelnum = 0; // 삽 수
            snacknum = 3; // 간식 수
            health = 100;
            hpadjust = 1;
            sandnum = 0;
            playerPosition.x = 90;
            playerPosition.y = 90;
        
            updateResourceDisplay()
            updateHealth();
            createVirtualMaze();
            renderView();
        }

        function gameover() {
            const popup = document.querySelector('.popup');
                 
            popup.style.display = 'flex';
            clearInterval(this.downInterval);
            clearInterval(this.timeInterval);
            const restart = document.querySelector('.restart');
            stopgamenum = 1;
            restart.addEventListener('click', () => {
            this.restart();
          })
        }

        function normalend() {
            const ending = document.querySelector('.ending');
            ending.style.display = 'flex';
            clearInterval(this.downInterval);
            clearInterval(this.timeInterval);
            const restart = document.querySelector('.restart');
            stopgamenum = 1;
            restart.addEventListener('click', () => {
            this.restart();
          })
        }

        function hiddenending() {
            const hending = document.querySelector('.hending');
            hending.style.display = 'flex';
            clearInterval(this.downInterval);
            clearInterval(this.timeInterval);
            const restart = document.querySelector('.restart');
            stopgamenum = 1;
            restart.addEventListener('click', () => {
            this.restart();
          })
        }

        firstplay();

        document.addEventListener("DOMContentLoaded", () => {
            // Select all restart buttons
            const restartButtons = document.querySelectorAll(".restart");
        
            // Add event listeners to restart buttons
            restartButtons.forEach(button => {
                button.addEventListener("click", restart);
            });

        });

        // 스테이지에 따른 도움말 설정 함수
        function updateHelpMessages(stagenum) {
            let helpMessages = [];
            
            // 각 스테이지에 따른 도움말 메시지를 설정
            if (stagenum == 1) {
                helpMessages = [
                    "에우리디케를 데리고 밖으로 나가야 합니다!",
                    "에우리디케를 보기 위해 뒤돌아봐선 안됩니다!",
                    "조작 방법은 W,A,S,D입니다.",
                    "초록색 타일을 밟는다면 두 칸 앞에 벽이 설치됩니다.",
                    "파랑색 타일을 밟는다면 당신의 주위로 벽이 반전됩니다.",
                    "쉽게 말해 벽이 있다면 사라지고, 없다면 생겨납니다.",
                    "폭탄은 q키로 사용합니다. 당신 주위의 벽들을 없애버리죠.",
                    "지쳤다면 간식이라도 먹는게 어떨까요? e키를 사용해서요.",
                    "밖으로 나가는 계단은 귀퉁이에 위치해있습니다."
                ];
            } else if (stagenum == 2) {
                helpMessages = [
                    "저기 폭탄이 떨어져있네요. 빨간색 타일 안보이시나요?",
                    "초록색 타일을 밟는다면 두 칸 앞에 벽이 설치됩니다.",
                    "파랑색 타일을 밟는다면 당신의 주위로 벽이 반전됩니다.",
                    "폭탄은 q키로 사용합니다. 당신 주위의 벽들을 없애버리죠.",
                    "지쳤다면 간식이라도 먹는게 어떨까요? e키를 사용해서요."
                ];
            } else if (stagenum == 3) {
                helpMessages = [
                    "바닥에 모래들이 깔려있네요. 유용한 도구들을 발견할수도...",
                    "짙은 색의 모래는 보기보다 깊은 듯 합니다.",
                    "r키로 삽을 사용한다면 아래층으로 이동할 수 있습니다.",
                    "위급한 상황에 삽을 사용해보세요."
                ];
            } else if (stagenum == 4) {
                helpMessages = [
                    "바닥에 모래들이 깔려있네요. 유용한 도구들을 발견할수도...",
                    "짙은 색의 모래는 보기보다 깊은 듯 합니다.",
                    "r키로 삽을 사용한다면 아래층으로 이동할 수 있습니다.",
                    "위급한 상황에 삽을 사용해보세요.",
                    "만약 상황이 안좋으면 일부러 유사를 밟는것도 방법입니다."
                ];
            } else if (stagenum == 5) {
                helpMessages = [
                    "붉은색 타일은 함정입니다! 폭탄과 혼동하지 마세요.",
                    "보라색 타일을 밟으면 키보드가 반전됩니다! 뒤를 돌아보지 않게 조심하세요!",
                    "화면이 알록달록하지만 PC사상을 지지하지는 않습니다...",
                    "폭탄 수가 부족하다면 삽을 적극 이용해보세요!",
                    "간식은 충분히 챙겨왔나요? 모래가 묻어있어도 괜찮을겁니다."
                ];
            } else if (stagenum == 6) {
                helpMessages = [
                    "붉은색 타일은 함정입니다! 폭탄과 혼동하지 마세요.",
                    "보라색 타일을 밟으면 키보드가 반전됩니다! 뒤를 돌아보지 않게 조심하세요!",
                    "고지가 눈 앞입니다. 이 미로와도 작별입니다.",
                    "폭탄 수가 부족하다면 삽을 적극 이용해보세요!",
                    "간식은 충분히 챙겨왔나요? 모래가 묻어있어도 괜찮을겁니다."
                ];
            } else if (stagenum == 7) {
                helpMessages = [
                    "문 밖을 나서보니, 설국이었다.",
                    "출구는 중앙에 있을겁니다.",
                    "신선한 공기가 감동스럽다는것을 알았다.",
                    "이제 미로와 작별할 일만 남았습니다...그래서 이게 끝이냐고요?"
                ];
            } else if (stagenum == 0) {
                helpMessages = [
                    "당신은 죽은 자를 데리고 나갈 유일한 방법을 생각해내었다.",
                    "뜨거운 열기는 생명을 앗아가는듯 하다.",
                    "불길이 사그라들길 기다리세요.",
                    "중앙에 출구가 있을 겁니다."
                ];
            }

            // 기존의 도움말을 지우고 새 메시지로 교체
            displayHelpMessages(helpMessages);
        }

        // 도움말을 화면에 표시하는 함수
        function displayHelpMessages(messages) {
            const helpTextElement = document.getElementById("helpText");

            // 메시지를 한 번에 하나씩만 표시하도록 변경
            let currentIndex = 0;

            // 메시지 표시 함수
            function showNextMessage() {
                if (currentIndex < messages.length) {
                    helpTextElement.textContent = messages[currentIndex];
                    currentIndex++;
                } else {
                    currentIndex = 0; // 메시지 끝나면 처음으로 돌아가도록
                }
            }

            function showPrevHelp() {
                currentIndex = (currentIndex - 1 + messages.length) % messages.length;
                helpTextElement.textContent = messages[currentIndex];
            }

            // 10초마다 메시지 변경
            clearInterval(displayHelpMessages.interval); // 기존의 interval을 먼저 지워서 중복 실행 방지
            displayHelpMessages.interval = setInterval(showNextMessage, 5000);

            // 처음 메시지부터 표시
            showNextMessage();

            // 이전 버튼 클릭시
            document.getElementById("prevHelp").addEventListener("click", function() {
                showPrevHelp();
            });

            // 다음 버튼 클릭시
            document.getElementById("nextHelp").addEventListener("click", function() {
                showNextMessage();
            });
        }
        
        function showImageForTwoSeconds(imagePath) {
            const container = document.getElementById('image-container');
            nowife = 1;
            // 이미지 요소 생성
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = 'Displayed Image';
          
            // 컨테이너에 이미지 추가
            
            for (let c = -2; c <= 2; c++) {
                for (let d = -2; d <= 2; d++) {
                    const eargetX = playerPosition.x + c;
                    const eargetY = playerPosition.y + d;
                    if (
                        maze[eargetY][eargetX] == 'wife'
                    ) {
                        maze[eargetY][eargetX] = getPathClass();
                    }
                }
            }
            container.appendChild(img);
          
            // 2초 후 이미지 제거
            setTimeout(() => {
              container.removeChild(img);
              
              if (endingcount == 0) {
                gameover();
              } else if (endingcount == 1) {
                normalend();
              }
            
            }, 1000);
          }
          
          
     
