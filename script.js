document.getElementById('generate-btn').addEventListener('click', async function () {
    startTimer(120);  // Таймер на 2 минуты (120 секунд)

    document.getElementById('results').innerHTML = ''; // Очистка результатов перед новой генерацией

    await delay(120000);  // Ожидание 2 минуты (120000 миллисекунд)

    const games = {
        1: {
            name: 'Riding Extreme 3D',
            appToken: 'd28721be-fd2d-4b45-869e-9f253b554e50',
            promoId: '43e35910-c168-4634-ad4f-52fd764a843f',
        },
        2: {
            name: 'Chain Cube 2048',
            appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',
            promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
        },
        3: {
            name: 'My Clone Army',
            appToken: '74ee0b5b-775e-4bee-974f-63e7f4d5bacb',
            promoId: 'fe693b26-b342-4159-8808-15e3ff7f8767',
        },
        4: {
            name: 'Train Miner',
            appToken: '82647f43-3f87-402d-88dd-09a90025313f',
            promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
        }
    };

    const results = [];
    for (const game of Object.values(games)) {
        const keys = await generateKeys(game.appToken, game.promoId, 4);  // Генерация 4 ключей для каждой игры
        results.push({ gameName: game.name, keys: keys });
    }

    displayKeys(results);
    stopTimer();
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startTimer(seconds) {
    const timerDiv = document.getElementById('timer');
    timerDiv.style.display = 'block';

    const interval = setInterval(() => {
        seconds--;
        timerDiv.innerText = `Approximately ${Math.ceil(seconds / 60)} minutes remaining...`;

        if (seconds <= 0) {
            clearInterval(interval);
        }
    }, 1000);
}

function stopTimer() {
    const timerDiv = document.getElementById('timer');
    timerDiv.innerText = 'Generation complete!';
}

async function generateKeys(appToken, promoId, count) {
    const keys = [];
    for (let i = 0; i < count; i++) {
        await delay(2000 + Math.random() * 1000);  // Ожидание 2-3 секунд для имитации работы генератора

        // Имитация генерации ключа с использованием appToken и promoId
        const key = `${appToken.slice(0, 4)}-${promoId.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
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
