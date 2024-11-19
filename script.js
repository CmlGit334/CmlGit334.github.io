const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const sonDefaite = new Audio('Défaite.m4a');
const sonMange = new Audio('Snake.m4a')


// Taille de la grille et du serpent
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Position initiale de la cerise
let cerise = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };

// Position du serpent
let snake = [{ x: 10, y: 10 }];
let dx = 1; // Direction horizontale
let dy = 0; // Direction verticale

function gameLoop() {
    // Vérifier si le joueur a perdu
    if (verifierDefaite()) {
        sonDefaite.play(); // Joue le son de défaite
        alert("Vous avez perdu !");
        reinitialiserJeu();
    } else {
        // Mettre à jour le serpent et dessiner le jeu
        updateSnake();
        drawGame();
    }

    // Répéter la boucle
    setTimeout(gameLoop, 100);
}

// Met à jour la position du serpent
function updateSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Vérifie si le serpent mange la cerise
    if (head.x === cerise.x && head.y === cerise.y) {
        cerise = genererCerise(); // Génère une nouvelle cerise
        sonMange.play();
    } else {
        snake.pop(); // Retire la queue uniquement si la cerise n'est pas mangée
    }
}

// Génère une nouvelle position pour la cerise
function genererCerise() {
    let nouvelleCerise;
    let positionValide = false;

    while (!positionValide) {
        nouvelleCerise = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
        };

        // Vérifie que la cerise n'est pas sur le serpent
        positionValide = !snake.some(part => part.x === nouvelleCerise.x && part.y === nouvelleCerise.y);
    }

    return nouvelleCerise;
}

// Vérifie si le joueur a perdu
function verifierDefaite() {
    const head = snake[0];

    // Vérifie si la tête touche un mur
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Vérifie si la tête touche le corps du serpent
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Dessine le jeu
function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner le serpent
    ctx.fillStyle = "lime";
    for (const part of snake) {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    }

    // Dessiner la cerise
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(
        cerise.x * gridSize + gridSize / 2,
        cerise.y * gridSize + gridSize / 2,
        gridSize / 2.5,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Écoute les touches pour changer la direction
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            break;
        case "ArrowDown":
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
        case "ArrowLeft":
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case "ArrowRight":
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// Redémarre le jeu après une défaite
function reinitialiserJeu() {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    cerise = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
}

// Démarrer le jeu
gameLoop();
