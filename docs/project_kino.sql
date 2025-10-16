-- Créer et sélectionner la base de données
CREATE DATABASE IF NOT EXISTS cinema_db;
USE cinema_db;

-- Security if tables already exist --
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS Play;
DROP TABLE IF EXISTS Define;
DROP TABLE IF EXISTS Film; 
DROP TABLE IF EXISTS Spectator;
DROP TABLE IF EXISTS Actor;
DROP TABLE IF EXISTS Genre;
DROP TABLE IF EXISTS Director;

-- Tables --

CREATE TABLE Director(
   ID_director INT AUTO_INCREMENT,
   Name_director VARCHAR(100) NOT NULL,
   First_name_director VARCHAR(100),
   Birth_date_director DATE,
   Nationality_director VARCHAR(50),
   PRIMARY KEY(ID_director)
);
CREATE TABLE Film(
   ID_film INT AUTO_INCREMENT,
   Title VARCHAR(255) NOT NULL,
   Release_year INT,
   Duration INT,
   Synopsis TEXT,
   Average_rating DECIMAL(3,1) DEFAULT 0,
   director_id INT,
   PRIMARY KEY(ID_film),
   FOREIGN KEY(director_id) REFERENCES Director(ID_director)
);
CREATE TABLE Spectator(
   ID_spectator INT AUTO_INCREMENT,
   Email VARCHAR(255) NOT NULL,
   Username VARCHAR(100) NOT NULL,
   Password_hash VARCHAR(255) NOT NULL,
   Registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
   Age INT,
   PRIMARY KEY(ID_spectator),
   UNIQUE(Email),
   UNIQUE(Username)
);
CREATE TABLE Genre(
   ID_genre INT AUTO_INCREMENT,
   Name_genre VARCHAR(50) NOT NULL,
   Period VARCHAR(50),
   PRIMARY KEY(ID_genre),
   UNIQUE(Name_genre)
);
CREATE TABLE Actor(
   ID_actor INT AUTO_INCREMENT,
   Name_actor VARCHAR(100) NOT NULL,
   First_name_actor VARCHAR(100),
   Birth_date_actor DATE,
   Nationality_actor VARCHAR(50),
   PRIMARY KEY(ID_actor)
);

CREATE TABLE Review(
   ID_review INT AUTO_INCREMENT,
   Rating INT CHECK(Rating BETWEEN 1 AND 5),
   Comment TEXT,
   Creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
   user_id INT NOT NULL,
   film_id INT NOT NULL,
   PRIMARY KEY(ID_review),
   UNIQUE(user_id, film_id),
   FOREIGN KEY(user_id) REFERENCES Spectator(ID_spectator),
   FOREIGN KEY(film_id) REFERENCES Film(ID_film)
);
CREATE TABLE Define(
   film_id INT,
   genre_id INT,
   PRIMARY KEY(film_id, genre_id),
   FOREIGN KEY(film_id) REFERENCES Film(ID_film),
   FOREIGN KEY(genre_id) REFERENCES Genre(ID_genre)
);

CREATE TABLE Play(
   ID_film INT,
   actor_id INT,
   Character_name VARCHAR(50) NOT NULL,
   PRIMARY KEY(ID_film, actor_id),
   FOREIGN KEY(ID_film) REFERENCES Film(ID_film),
   FOREIGN KEY(actor_id) REFERENCES Actor(ID_actor)
);



-- Directors
INSERT INTO Director (Name_director, First_name_director, Birth_date_director, Nationality_director) VALUES 
('Cameron', 'James', '1954-08-16', 'Canadian'),
('Nolan', 'Christopher', '1970-07-30', 'British'),
('Spielberg', 'Steven', '1946-12-18', 'American'),
('Tarantino', 'Quentin', '1963-03-27', 'American'),
('Scorsese', 'Martin', '1942-11-17', 'American'),
('Kubrick', 'Stanley', '1928-07-26', 'American'),
('Fincher', 'David', '1962-08-28', 'American'),
('Coppola', 'Francis Ford', '1939-04-07', 'American'),
('Villeneuve', 'Denis', '1967-10-03', 'Canadian'),
('Scott', 'Ridley', '1937-11-30', 'British'),
('Zemeckis', 'Robert', '1952-05-14', 'American'),
('Anderson', 'Wes', '1969-05-01', 'American');

-- Genres
INSERT INTO Genre (Name_genre, Period) VALUES 
('Science Fiction', 'Modern'),
('Action', 'Contemporary'),
('Drama', 'Classic'),
('Adventure', 'Timeless'),
('Fantasy', 'Modern'),
('Thriller', 'Contemporary'),
('Crime', 'Contemporary'),
('Mystery', 'Classic'),
('Psychological', 'Modern'),
('Comedy', 'Contemporary'),
('Romance', 'Classic'),
('Historical', 'Timeless');

-- Actors (removed Woody Harrelson)
INSERT INTO Actor (Name_actor, First_name_actor, Birth_date_actor, Nationality_actor) VALUES
('DiCaprio', 'Leonardo', '1974-11-11', 'American'),
('Hanks', 'Tom', '1956-07-09', 'American'),
('Pitt', 'Brad', '1963-12-18', 'American'),
('Worthington', 'Sam', '1976-08-02', 'Australian'),
('Bale', 'Christian', '1974-01-30', 'British'),
('Ledger', 'Heath', '1979-04-04', 'Australian'),
('Murphy', 'Cillian', '1976-05-25', 'Irish'),
('Bonham Carter', 'Helena', '1966-05-26', 'British'),
('Norton', 'Edward', '1969-08-18', 'American'),
('Jack Nicholson', 'Jack', '1937-04-22', 'American'),
('Freeman', 'Morgan', '1937-06-01', 'American'),
('Ruffalo', 'Mark', '1967-11-22', 'American'),
('Kingsley', 'Ben', '1943-12-31', 'British'),
('Hardy', 'Tom', '1977-09-15', 'British'),
('Robbie', 'Margot', '1990-07-02', 'Australian'),
('Damon', 'Matt', '1970-10-08', 'American'),
('Pugh', 'Florence', '1996-01-03', 'British'),
('Oldman', 'Gary', '1958-03-21', 'British'),
('Brolin', 'Josh', '1968-02-12', 'American');

-- Films (added new titles and replaced Godfather/Lord of the Rings with Oppenheimer)
INSERT INTO Film (Title, Release_year, Duration, Synopsis, director_id) VALUES
('Avatar', 2009, 162, 'A paraplegic marine dispatched to the moon Pandora becomes torn between following orders and protecting the world he feels is his home.', 1),
('Inception', 2010, 148, 'A thief who steals corporate secrets through dream-sharing technology is tasked with planting an idea into a CEO’s mind.', 2),
('The Dark Knight', 2008, 152, 'Batman faces the Joker in a battle of chaos and morality.', 2),
('Forrest Gump', 1994, 142, 'A simple man witnesses key moments of American history with kindness and innocence.', 3),
('Pulp Fiction', 1994, 154, 'The lives of criminals intertwine in a web of violence and redemption.', 4),
('Inglourious Basterds', 2009, 153, 'A group of Jewish soldiers plot to assassinate Nazi leaders during World War II.', 4),
('Shutter Island', 2010, 138, 'Two U.S. marshals investigate a disappearance at a psychiatric hospital.', 5),
('Fight Club', 1999, 139, 'An office worker and a soap maker form an underground fight club.', 7),
('Se7en', 1995, 127, 'Two detectives hunt a serial killer who uses the seven deadly sins as his motive.', 7),
('The Shining', 1980, 146, 'A man descends into madness while caring for an isolated hotel.', 6),
('Oppenheimer', 2023, 180, 'The story of J. Robert Oppenheimer, who led the creation of the atomic bomb.', 2);

-- Define (film-genre links)
INSERT INTO Define (film_id, genre_id) VALUES
(1, 1), (1, 4),
(2, 1), (2, 9),
(3, 2), (3, 6),
(4, 3),
(5, 3), (5, 7),
(6, 2), (6, 11),
(7, 6), (7, 8),
(8, 9), (8, 2),
(9, 7), (9, 6),
(10, 8), (10, 9),
(11, 12), (11, 3), (11, 9);

-- Play (films and actors — updated to reflect reality)
INSERT INTO Play (ID_film, actor_id, Character_name) VALUES
(1, 4, 'Jake Sully'),
(2, 1, 'Dom Cobb'),
(2, 7, 'Robert Fischer'),
(2, 14, 'Eames'),
(3, 5, 'Bruce Wayne / Batman'),
(3, 6, 'The Joker'),
(4, 2, 'Forrest Gump'),
(5, 3, 'Vincent Vega'),
(5, 15, 'Mia Wallace'),
(5, 1, 'Butch Coolidge'),
(6, 3, 'Lt. Aldo Raine'),
(6, 15, 'Shosanna Dreyfus'),
(7, 1, 'Teddy Daniels'),
(7, 12, 'Chuck Aule'),
(7, 13, 'Dr. Cawley'),
(8, 3, 'Tyler Durden'),
(8, 9, 'The Narrator'),
(8, 8, 'Marla Singer'),
(9, 3, 'Detective Mills'),
(9, 11, 'Detective Somerset'),
(10, 10, 'Jack Torrance'),
(11, 7, 'J. Robert Oppenheimer'),
(11, 14, 'Lewis Strauss'),
(11, 17, 'Jean Tatlock');

-- Spectators
INSERT INTO Spectator (Email, Username, Password_hash, Age) VALUES
('maceo.pierson@gmail.com', 'My CEO', 'hash123', 19),
('yuuushii@outlouk.com', 'SUGE', 'hash456', 21),
('strike1510bot@gmail.com', 'Strike1510', 'hash789', 24),
('roadtoirononvalorant@gmail.com', 'Calysin', 'hash012', 28),
('wasabikipikfort@gmail.com', 'Sushi', 'hash345', 30),
('lalienestmauve@gmail.com', 'Alien', 'hash678', 27),
('gugafiletmignon@gmail.com', 'Guga2', 'hash901', 22),
('spirits.kuuun@gmail.com', 'Spirit', 'hash234', 25),
('cloutier.thibault@gmail.com', 'Clthib', 'hash567', 23),
('davide.goudron@gmail.com', 'LeDav', 'hash890', 26),
('maurice.rivière@gmail.com', 'MauMauRiv', 'hash135', 31),
('o.celeste.f@outlouk.com', 'Triplex', 'hash246', 20);

-- Reviews
INSERT INTO Review (Rating, Comment, user_id, film_id) VALUES
(5, 'Absolute Cinema!', 1, 1),
(4, 'SO COOOOL !', 2, 2),
(5, 'Heath Ledger’s performance as Joker is legendary.', 1, 3),
(5, 'What a BANGER.', 4, 5),
(4, 'Incredible tension.', 3, 7),
(5, 'Brad Pitt at his finest', 5, 8),
(5, 'Dark and deep.', 6, 9),
(5, 'Masterpiece of psychological horror.', 7, 10),
(5, 'Visualy stunning.', 8, 1),
(4, 'Brilliant storytelling.', 9, 2),
(5, 'Cillian Murphy delivers an Oscar-worthy performance.', 10, 11),
(4, 'The direction is phenomenal.', 11, 3);

-- CRUD --

-- CREATE
INSERT INTO Film (Title, Release_year, Duration, Synopsis, director_id) 
VALUES ('Dune: Part Two', 2024, 166, 'Paul Atreides unites with the Fremen to avenge his family and save Arrakis.', 9);

-- READ
SELECT * FROM Film;

-- UPDATE
UPDATE Film 
SET Average_rating = 9.0 
WHERE Title = 'Oppenheimer';

-- DELETE
DELETE FROM Review 
WHERE user_id = 2 
AND film_id = 2;

-- Non-CRUD --

-- Best Rated Films
SELECT Title, Average_rating 
FROM Film 
ORDER BY Average_rating DESC 
LIMIT 5;

-- Director Statistics
SELECT d.Name_director, COUNT(f.ID_film) AS Nb_Films, AVG(f.Average_rating) AS Note_Moyenne
FROM Director d
LEFT JOIN Film f ON d.ID_director = f.director_id
GROUP BY d.Name_director
HAVING Nb_Films > 0;

-- Spectator Activity (modifiée pour enlever la référence à Watch)
SELECT s.Username, COUNT(r.ID_review) AS Nb_Avis
FROM Spectator s
LEFT JOIN Review r ON s.ID_spectator = r.user_id
GROUP BY s.Username;

-- Films with Principal Actors
SELECT f.Title, a.Name_actor, p.Character_name
FROM Film f
JOIN Play p ON f.ID_film = p.ID_film
JOIN Actor a ON p.actor_id = a.ID_actor;