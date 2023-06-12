DROP TABLE IF EXISTS urls;

DROP TABLE IF EXISTS shares;

CREATE TABLE shares(
    id CHAR(36) PRIMARY KEY,
    title TEXT NOT NULL
);

CREATE TABLE urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    share_id CHAR(36),
    FOREIGN KEY (share_id) REFERENCES shares(id)
);

PRAGMA foreign_keys = true;