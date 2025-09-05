# backend/memory.py
import sqlite3, os
from contextlib import closing

DB_PATH = os.path.join(os.path.dirname(__file__), 'zulgap.db')

def _conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def ensure_schema():
    with closing(_conn()) as c:
        cur = c.cursor()
        cur.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          assignee TEXT,
          status TEXT,
          brief TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS task_notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_id INTEGER NOT NULL,
          note_type TEXT,  -- RESULT | FEEDBACK | PLAN
          summary TEXT,
          artifact_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(task_id) REFERENCES tasks(id)
        );
        """)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS session_summaries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT,
          summary TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """)
        c.commit()

def add_task(title, assignee=None, brief=""):
    with closing(_conn()) as c:
        cur = c.cursor()
        cur.execute("INSERT INTO tasks (title, assignee, status, brief) VALUES (?, ?, ?, ?)",
                    (title, assignee, "NEW", (brief or "")[:300]))
        c.commit()
        return cur.lastrowid

def update_task_status(task_id, status):
    with closing(_conn()) as c:
        c.execute("UPDATE tasks SET status=? WHERE id=?", (status, task_id))
        c.commit()

def add_task_note(task_id, note_type, summary, artifact_url=None):
    with closing(_conn()) as c:
        c.execute("""INSERT INTO task_notes (task_id, note_type, summary, artifact_url)
                     VALUES (?, ?, ?, ?)""",
                  (task_id, note_type, (summary or "")[:500], artifact_url))
        c.commit()

def upsert_session_summary(session_id, summary):
    with closing(_conn()) as c:
        c.execute("DELETE FROM session_summaries WHERE session_id=?", (session_id,))
        c.execute("INSERT INTO session_summaries (session_id, summary) VALUES (?, ?)",
                  (session_id, (summary or "")[:300]))
        c.commit()

def get_context_for_prompt(session_id, limit=5):
    with closing(_conn()) as c:
        cur = c.cursor()
        cur.execute("""SELECT summary FROM session_summaries
                       WHERE session_id=? ORDER BY updated_at DESC LIMIT 1""", (session_id,))
        sess = cur.fetchone()
        cur.execute("""SELECT id, title, assignee, status, brief
                       FROM tasks ORDER BY id DESC LIMIT ?""", (limit,))
        tasks = cur.fetchall()

    lines = []
    if sess:
        lines.append(f"[세션요약] {sess['summary']}")
    if tasks:
        lines.append("[최근 업무]")
        for r in tasks:
            lines.append(f"- #{r['id']} {r['status']} {r['title']} / 담당:{r['assignee'] or '-'} / {r['brief'] or ''}")
    return "\n".join(lines) if lines else "(기록 없음)"
