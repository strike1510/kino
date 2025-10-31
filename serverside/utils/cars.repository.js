// utils/cars.repository.js
pool = require(__dirname + "\\db.include.js"); // use same folder as the current file

module.exports = {
    getBlankCar(){ // defines the entity model
        return {
            "car_id": 0,
            "car_brand": 0,
            "car_name": "XXXX",
            "car_baseprice": 0,
            "car_isfancy": 0,
            "car_realprice": 0
        };
    },
    async getAllBrands(){ // TODO? move to brands.repository.js
        try {
            let sql = "SELECT * FROM brands";
			// .execute() does: getConnection() + prepare() + query() + releaseConnection()
            const [rows, fields] = await pool.execute(sql); 
            console.log("BRANDS FETCHED: "+rows.length);
            return rows;
        }
        catch (err) {
            // TODO: log/send error ... 
            console.log(err);
            throw err; // return false ???
        }
    },
    async getAllCars(){ 
        try {
            let sql = "SELECT * FROM cars INNER JOIN brands ON car_brand=brand_id";
            const [rows, fields] = await pool.execute(sql);
            console.log("CARS FETCHED: "+rows.length);
            return rows;
        }
        catch (err) {
            console.log(err);
            throw err; 
        }
    },
    async getCarsByName(name){ 
        try {
            let sql = "SELECT * FROM cars INNER JOIN brands ON car_brand=brand_id WHERE upper(name) like upper(?)";
            const [rows, fields] = await pool.execute(sql, [ `%${name}%` ]);
            console.log("CARS FILTERED: "+rows.length);
            return rows;
        }
        catch (err) {
            console.log(err);
            throw err; 
        }
    },
    async getOneCar(carId){ 
        try {
            // sql = "SELECT * FROM cars INNER JOIN brands ON car_brand=brand_id WHERE car_id = "+carId; 
            // SQL INJECTION => !!!!ALWAYS!!!! sanitize user input!
            // escape input (not very good) OR prepared statements (good) OR use orm (GOOD!)
            let sql = "SELECT * FROM cars INNER JOIN brands ON car_brand=brand_id WHERE car_id = ?";
            const [rows, fields] = await pool.execute(sql, [ carId ]);
            console.log("SINGLE CAR FETCHED: "+rows.length);
            if (rows.length == 1) {
                return rows[0];
            } else {
                return false;
            }
        }
        catch (err) {
            console.log(err);
            throw err; 
        }
    },
    async delOneCar(carId){ 
        try {
            let sql = "DELETE FROM cars WHERE car_id = ?";
            const [okPacket, fields] = await pool.execute(sql, [ carId ]); 
            console.log("DELETE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        }
        catch (err) {
            console.log(err);
            throw err; 
        }
    },
    async addOneCar(brandId){ 
        try {
            let sql = "INSERT INTO cars (car_id, car_brand) VALUES (NULL, ?) ";
            const [okPacket, fields] = await pool.execute(sql, [ brandId ]); 
            console.log("INSERT " + JSON.stringify(okPacket));
            return okPacket.insertId;
        }
        catch (err) {
            console.log(err);
            throw err; 
        }
    },
    async editOneCar(carId, carBrand, carName, carBaseprice, carIsfancy, carRealprice){ 
        try {
            let sql = "UPDATE cars SET car_brand=?, car_name=?, car_baseprice=?, car_isfancy=?, car_realprice=? WHERE car_id=? "; // positional parameters
            const [okPacket, fields] = await pool.execute(sql, 
                  [carBrand, carName, carBaseprice, carIsfancy, carRealprice, carId]); // positional parameters
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        }
        catch (err) {
            console.log(err);
            throw err; 
        }
    }
};
