document.getElementById('generate-btn').addEventListener('click', function () {
    startTimer(120);  // Таймер на 2 минуты (120 секунд)
    
    const games = {
        1: { name: 'Riding Extreme 3D', promoId: 'd28721be-fd2d-4b45-869e-9f253b554e50' },
        2: { name: 'Chain Cube 2048', promoId: 'd1690a07-3780-4068-810f-9b5bbf2931b2' },
        3: { name: 'My Clone Army', promoId: '74ee0b5b-775e-4bee-974f-63e7f4d5bacb' },
        4: { name: 'Train Miner', promoId: '82647f43-3f87-402d-88dd-09a90025313f' },
    };

    const results = [];
    Object.values(games).forEach(game => {
        const keys = generateKeys(game.promoId, 4);  // Генерация 4 ключей для каждой игры
        results.push({ gameName: game.name, keys: keys });
    });

    displayKeys(results);
});

function startTimer(seconds) {
    const timerDiv = document.getElementById('timer');
    timerDiv.style.display = 'block';

    const interval = setInterval(() => {
        seconds--;
        timerDiv.innerText = `Approximately ${Math.ceil(seconds / 60)} minutes remaining...`;

        if (seconds <= 0) {
            clearInterval(interval);
            timerDiv.innerText = 'Generation complete!';
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

function displayKeys(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    results.forEach(result => {
        const title = document.createElement('h2');
        title.innerText = result.gameName;
        resultsDiv.appendChild(title);

        result.keys.forEach(key => {
            const keyDiv = document.createElement('div');
            keyDiv.className = 'key-item';
            keyDiv.innerHTML = `<span>${key}</span><button class="copy-btn">Copy</button>`;
            resultsDiv.appendChild(keyDiv);
        });
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
