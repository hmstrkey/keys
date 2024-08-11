document.getElementById('generate-btn').addEventListener('click', async function () {
    const gameChoice = document.getElementById('game-select').value;
    const keyCount = document.getElementById('key-count').value;

    if (!keyCount || keyCount < 1 || keyCount > 4) {
        alert("Please enter a valid number of keys (1-4)");
        return;
    }

    const response = await fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ game_choice: gameChoice, key_count: keyCount }),
    });

    const data = await response.json();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    data.keys.forEach(key => {
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
});

