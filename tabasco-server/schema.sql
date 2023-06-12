DROP TABLE IF EXISTS shares;

CREATE TABLE shares(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
);

DROP TABLE IF EXISTS urls;

CREATE TABLE urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    share_id INTEGER,
    FOREIGN KEY (share_id) REFERENCES shares(id)
);

PRAGMA foreign_keys = true;