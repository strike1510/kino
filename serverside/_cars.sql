CREATE DATABASE if not exists carsDb;
USE carsDb;

DROP TABLE if exists conn;
DROP TABLE if exists features;
DROP TABLE if exists cars;
DROP TABLE if exists brands;
DROP TABLE if exists users;

CREATE TABLE users ( 
    user_id int auto_increment primary key,
    user_created datetime,
    user_name varchar(100) unique,
    user_email varchar(100) unique,
    user_role varchar(100),
    user_pass varchar(100)
);

CREATE TABLE brands (
    brand_id int auto_increment primary key, 
    brand_name varchar(100)
);
CREATE TABLE cars (
    car_id int auto_increment primary key,
    car_brand int , 
    car_name varchar(100),
    car_baseprice int ,
    CONSTRAINT fk_cars FOREIGN KEY (car_brand) REFERENCES brands(brand_id)
);
CREATE TABLE features (
    feat_id int auto_increment primary key,
    feat_name varchar(100),
    feat_price int,
    CONSTRAINT chk_price CHECK (feat_price>1000)
);
CREATE TABLE conn (
    conn_id int auto_increment primary key,
    conn_car int,
    conn_feat int,
    CONSTRAINT fk_conn_car FOREIGN KEY (conn_car) REFERENCES cars(car_id),
    CONSTRAINT fk_conn_feat FOREIGN KEY (conn_feat) REFERENCES features(feat_id)
);


INSERT INTO `brands` VALUES (1, "BMW");
INSERT INTO brands VALUES (2, 'Audi');
INSERT INTO brands VALUES (3, 'Citroen');
INSERT INTO brands VALUES (4, 'Suzuki');

INSERT INTO cars VALUES 
    (1, 1, '116i', 40000),
    (2, 1, 'i8', 80000),
    (3, 2, 'A3', 40000),
    (4, 2, 'S5', 50000),
    (5, 3, 'C2', 20000),
    (6, 3, 'C4', 30000),
    (7, 4, 'Swift', 15000);
    
INSERT INTO features VALUES
    (1, 'Sunroof', 1500), 
    (2, 'Sports Gearbox', 2500),
    (3, 'Leather seats', 3000),
    (4, 'Seat warmers', 1400),
    (5, 'Special paint', 2200),
    (6, 'GPS Nav', 1001);
    
INSERT INTO conn (conn_car, conn_feat) VALUES
    (1, 2), (1, 4), (1, 6), (2, 5), (3, 1), (4, 1), (4, 2), (5, 3), (6, 4), (6, 5);

INSERT INTO users VALUES (NULL, now(), 'bill', 'bill@bill.bill', 'USER', sha2(concat(now(), 'billpass'), 224) );
SELECT sleep(1);
INSERT INTO users VALUES (NULL, now(), 'joeuser', 'joe@joe.one', 'USER', sha2(concat(now(), 'joepass'), 224) );
SELECT sleep(1);
INSERT INTO users VALUES (NULL, now(), 'joeadmin', 'joe@joe.two', 'ADMIN', sha2(concat(now(), 'joepass'), 224) );
-- TODO: !!! USE BETTER SALT / PW HASH (scrypt, bcrypt, pbkdf2, argon2) !!!

SET sql_mode = 'ONLY_FULL_GROUP_BY';

DROP VIEW if exists totalExtraPriceForCars;
DROP VIEW if exists carsWithTotalPrices;

CREATE VIEW totalExtraPriceForCars AS
	SELECT conn_car, sum(feat_price) as totalExtraPrice
	FROM conn INNER JOIN features ON conn_feat = feat_id
	GROUP BY conn_car;
CREATE VIEW carsWithTotalPrices AS 
	SELECT cars.*, 
		car_baseprice + ifnull(totalExtraPrice, 0) as car_totalprice 
	FROM cars LEFT JOIN totalExtraPriceForCars ON car_id = conn_car;

DROP VIEW if exists extrasPerCar;
DROP VIEW if exists extrasPerBrand;
DROP VIEW if exists fancyCars;

CREATE VIEW extrasPerCar AS
	SELECT conn_car as car_id, count(1) as numberOfFeatures
    FROM conn
    GROUP BY conn_car;

CREATE VIEW extrasPerBrand AS
	SELECT car_brand as brand_id, avg(numberOfFeatures) as avgNumberOfFeatures
    FROM cars INNER JOIN extrasPerCar ON cars.car_id=extrasPerCar.car_id
    GROUP BY car_brand;

CREATE VIEW fancyCars AS 
	SELECT cars.car_id
	FROM cars 
		LEFT JOIN extrasPerCar ON cars.car_id=extrasPerCar.car_id
		LEFT JOIN extrasPerBrand ON car_brand=brand_id
	WHERE ifnull(numberOfFeatures, 0)>=ifnull(avgNumberOfFeatures, 0);

ALTER TABLE cars ADD car_isfancy tinyint;
ALTER TABLE cars ADD car_realprice int;

UPDATE cars SET car_isFancy = 0;

UPDATE cars INNER JOIN fancyCars ON cars.car_id=fancyCars.car_id
SET car_isfancy=1;

UPDATE cars INNER JOIN carsWithTotalPrices ON cars.car_id=carsWithTotalPrices.car_id
SET car_realprice=car_totalprice; -- D

SELECT * FROM cars;
