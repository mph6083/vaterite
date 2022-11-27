CREATE TABLE USERS(
    Username VARCHAR(100) PRIMARY KEY NOT NULL,
    Password TEXT NOT NULL
);
CREATE TABLE REVIEWS(
    Review_ID INT,
    Username TEXT,
    ReviewText TEXT,
    ReviewValue INT
);