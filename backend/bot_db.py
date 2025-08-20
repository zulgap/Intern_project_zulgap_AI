import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'bots.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS bots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            avatar TEXT,
            color TEXT,
            personality TEXT,
            response_length TEXT,
            expertise TEXT,
            prompt TEXT,
            randomness REAL,
            api_config TEXT,
            deleted INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

def create_bot(bot):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        INSERT INTO bots (name, avatar, color, personality, response_length, expertise, prompt, randomness, api_config)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        bot.get('name'),
        bot.get('avatar'),
        bot.get('color'),
        bot.get('personality'),
        bot.get('response_length'),
        ','.join(bot.get('expertise', [])),
        bot.get('prompt'),
        bot.get('randomness'),
        bot.get('api_config')
    ))
    conn.commit()
    bot_id = c.lastrowid
    conn.close()
    return bot_id

def get_all_bots():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM bots WHERE deleted=0')
    rows = c.fetchall()
    conn.close()
    bots = []
    for row in rows:
        bots.append({
            'id': row[0],
            'name': row[1],
            'avatar': row[2],
            'color': row[3],
            'personality': row[4],
            'response_length': row[5],
            'expertise': row[6].split(',') if row[6] else [],
            'prompt': row[7],
            'randomness': row[8],
            'api_config': row[9],
        })
    return bots

def get_bot_by_id(bot_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM bots WHERE id=? AND deleted=0', (bot_id,))
    row = c.fetchone()
    conn.close()
    if row:
        return {
            'id': row[0],
            'name': row[1],
            'avatar': row[2],
            'color': row[3],
            'personality': row[4],
            'response_length': row[5],
            'expertise': row[6].split(',') if row[6] else [],
            'prompt': row[7],
            'randomness': row[8],
            'api_config': row[9],
        }
    return None

def update_bot(bot_id, bot):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        UPDATE bots SET name=?, avatar=?, color=?, personality=?, response_length=?, expertise=?, prompt=?, randomness=?, api_config=?
        WHERE id=?
    """, (
        bot.get('name'),
        bot.get('avatar'),
        bot.get('color'),
        bot.get('personality'),
        bot.get('response_length'),
        ','.join(bot.get('expertise', [])),
        bot.get('prompt'),
        bot.get('randomness'),
        bot.get('api_config'),
        bot_id
    ))
    conn.commit()
    conn.close()


def delete_bot(bot_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE bots SET deleted=1 WHERE id=?', (bot_id,))
    conn.commit()
    affected = c.rowcount   # 몇 행이 바뀌었는지
    conn.close()
    return affected > 0     # 1행 이상이면 True, 아니면 False

