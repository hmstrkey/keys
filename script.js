document.getElementById('generate-btn').addEventListener('click', function () {
    const gameChoice = document.getElementById('game-select').value;
    const keyCount = document.getElementById('key-count').value;

    if (!keyCount || keyCount < 1 || keyCount > 4) {
        alert("Please enter a valid number of keys (1-4)");
        return;
    }

    startTimer(5, () => { // Таймер на 5 секунд
        const games = {
            1: { name: 'Riding Extreme 3D', promoId: '43e35910' },
            2: { name: 'Chain Cube 2048', promoId: 'b4170868' },
            3: { name: 'My Clone Army', promoId: 'fe693b26' },
            4: { name: 'Train Miner', promoId: 'c4480ac7' },
        };

        const selectedGame = games[gameChoice];
        const keys = generateKeys(selectedGame.promoId, keyCount);
        displayKeys(keys);
    });
});

function startTimer(seconds, callback) {
    const timerDiv = document.getElementById('timer');
    timerDiv.style.display = 'block';
    timerDiv.innerText = `Waiting... ${seconds}s`;

    const interval = setInterval(() => {
        seconds--;
        timerDiv.innerText = `Waiting... ${seconds}s`;

        if (seconds <= 0) {
            clearInterval(interval);
            timerDiv.style.display = 'none';
            callback();
        }
    }, 1000);
}

function generateKeys(promoId, count) {
    const keys = [];
    for (let i = 0; i < count; i++) {
        const key = `${promoId}-${Math.floor(1000 + Math.random() * 9000)}`;
        keys.push(key);
    }
    return keys;
}

function displayKeys(keys) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    keys.forEach(key => {
        const keyDiv = document.createElement('div');
        keyDiv.className = 'key-item';
        keyDiv.innerHTML = `<span>${key}</span><button class="copy-btn">Copy</button>`;
        resultsDiv.appendChild(keyDiv);
    });

    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function () {
            const key = this.previousSibling.textContent;
            navigator.clipboard.writeText(key).then(() => {
                alert('Copied to clipboard');
            });
        });
    });
}
