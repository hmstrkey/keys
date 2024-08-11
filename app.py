from flask import Flask, request, jsonify
import asyncio
import random

app = Flask(__name__)

# Ваш генератор в виде функции
async def generate_key_process(app_token, promo_id):
    # Генерация ключа, имитируем процесс с задержкой
    await asyncio.sleep(random.uniform(0.1, 0.5))
    return f"{promo_id[:4]}-{random.randint(1000, 9999)}"

@app.route('/generate', methods=['POST'])
async def generate():
    data = request.json
    game_choice = int(data['game_choice'])
    key_count = int(data['key_count'])

    games = {
        1: {'name': 'Riding Extreme 3D', 'promoId': '43e35910-c168-4634-ad4f-52fd764a843f'},
        2: {'name': 'Chain Cube 2048', 'promoId': 'b4170868-cef0-424f-8eb9-be0622e8e8e3'},
        3: {'name': 'My Clone Army', 'promoId': 'fe693b26-b342-4159-8808-15e3ff7f8767'},
        4: {'name': 'Train Miner', 'promoId': 'c4480ac7-e178-4973-8061-9ed5b2e17954'},
    }

    game = games[game_choice]

    tasks = [generate_key_process(game['promoId'], game['promoId']) for _ in range(key_count)]
    keys = await asyncio.gather(*tasks)
    
    return jsonify({'keys': keys})

if __name__ == '__main__':
    app.run(debug=True)

