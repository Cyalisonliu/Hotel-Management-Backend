CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- hotel name
    webLink VARCHAR(255), -- hotel website link
    address VARCHAR(255) NOT NULL, -- hotel address
    email VARCHAR(255) NOT NULL, -- hotel contact email
    status TINYINT(1) NOT NULL, -- 0: close, 1: open
    coordinate VARCHAR(50) NOT NULL -- hotel location coordinate
);