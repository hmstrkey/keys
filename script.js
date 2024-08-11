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

function generateClientId() {
    const timestamp = Date.now();
    const randomNumbers = [];

    for (let i = 0; i < 19; i++) {
        randomNumbers.push(Math.floor(Math.random() * 10));
    }

    return `${timestamp}-${randomNumbers.join('')}`;
}

async function loginClient(gameNumber) {
    const clientId = generateClientId();
    const url = 'https://api.gamepromo.io/promo/login-client';

    const data = {
        appToken: games[gameNumber].appToken,
        clientId: clientId,
        clientOrigin: 'deviceid'
    };

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.error_code === 'TooManyIpRequest') {
            console.log('Too many requests');
            await new Promise(resolve => setTimeout(resolve, 10000));
            return loginClient(gameNumber);
        }
        return result.clientToken;
    } catch (error) {
        return loginClient(gameNumber);
    }
}

async function registerEvent(token, gameNumber) {
    await new Promise(resolve => setTimeout(resolve, 20000));
    const eventId = generateRandomUUID();
    const url = 'https://api.gamepromo.io/promo/register-event';
    const data = {
        promoId: games[gameNumber].promoId,
        eventId: eventId,
        eventOrigin: 'undefined'
    };
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!result.hasCode) {
            console.log('Retry register event');
            return registerEvent(token, gameNumber);
        } else {
            return token;
        }
    } catch (error) {
        console.error('Fatal error:', error.message);
        let newToken = await loginClient(gameNumber);
        return registerEvent(newToken, gameNumber);
    }
}

async function createCode(token, gameNumber) {
    let response;
    do {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const url = 'https://api.gamepromo.io/promo/create-code';

            const data = {
                promoId: games[gameNumber].promoId
            };

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json; charset=utf-8',
            };
            response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.promoCode) {
                return result.promoCode;
            }

        } catch (error) {
            console.error('Fatal error:', error.message);
        }
    } while (!response || !response.promoCode); // Повторяем запрос, если ничего не возвращает
}

function generateRandomUUID() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

const generateButton = document.getElementById('generateButton');
const generateTimeValue = document.getElementById('generate-time-value');
const generateProcessBlock = document.getElementById('process-generate-block');
const keyBlock = document.getElementById('keys-block');

async function generate() {
    generateButton.style.display = 'none';
    generateProcessBlock.style.display = 'flex';
    const endGenerateTime = Date.now() + 4 * 40 * 1000;

    keyBlock.innerHTML = ''; // Очистка блока с ключами
    keyBlock.style.display = 'none';

    generateTimeValue.innerText = '⏳';

    let generateTimeInterval = setInterval(() => startProcessGeneration(endGenerateTime), 1000);

    const codes = [];

    await new Promise(resolve => setTimeout(resolve, 5000));

    const tasks = [];

    // Генерируем 4 кода для каждой из 4 игр
    for (let gameIndex = 1; gameIndex <= 4; gameIndex++) {
        for (let i = 0; i < 4; i++) {
            tasks.push((async (gameIndex) => {
                try {
                    let token = await loginClient(gameIndex);
                    let registerToken = await registerEvent(token, gameIndex);
                    let promoCode = await createCode(registerToken, gameIndex);
                    codes.push({ gameIndex, promoCode });
                } catch (error) {
                    codes.push({ gameIndex, promoCode: `Error: ${error.message}` });
                }
            })(gameIndex));
        }
    }

    await Promise.all(tasks);

    keyBlock.style.display = 'flex';

    codes.forEach((code) => {
        const keyContainer = document.createElement('div');
        keyContainer.className = 'key-container';

        const keyText = document.createElement('span');
        keyText.className = 'key-text';
        keyText.innerText = code.promoCode;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerText = 'Copy';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(code.promoCode).then(() => {
                alert('Code copied to clipboard');
            });
        });

        keyContainer.appendChild(keyText);
        keyContainer.appendChild(copyButton);
        keyBlock.appendChild(keyContainer);
    });

    generateButton.style.display = 'block';
    clearInterval(generateTimeInterval);
    generateProcessBlock.style.display = 'none';
    generateTimeValue.innerText = '👌';
    console.log(codes);
}

function startProcessGeneration(generationTime) {
    function updateProcessGenerationTime() {
        const now = new Date();
        const distance = generationTime - now.getTime();

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        generateTimeValue.innerText = '' +
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');

        if (distance < 0) {
            generateTimeValue.innerText = "Ожидайте...";
        }
    }

    updateProcessGenerationTime();
}

generateButton.addEventListener('click', generate);
