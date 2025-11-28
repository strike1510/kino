// utils/cinema.repository.js
const pool = require(__dirname + "\\db.include.js");

module.exports = {
    // Films
    async getAllFilms() {
        try {
            let sql = "SELECT * FROM Film ORDER BY ID_film";
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async addFilm(data) {
        try {
            let sql = "INSERT INTO Film (Title, Release_year, Duration, Synopsis, director_id) VALUES (?, ?, ?, ?, ?)";
            const [result] = await pool.execute(sql, [data.Title, data.Release_year, data.Duration, data.Synopsis, data.director_id]);
            return result.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async updateFilm(id, data) {
        try {
            let sql = "UPDATE Film SET Title=?, Release_year=?, Duration=?, Synopsis=?, Average_rating=?, director_id=? WHERE ID_film=?";
            const [result] = await pool.execute(sql, [data.Title, data.Release_year, data.Duration, data.Synopsis, data.Average_rating, data.director_id, id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async deleteFilm(id) {
        try {
            let sql = "DELETE FROM Film WHERE ID_film=?";
            const [result] = await pool.execute(sql, [id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    // Directors
    async getAllDirectors() {
        try {
            let sql = "SELECT * FROM Director ORDER BY ID_director";
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async addDirector(data) {
        try {
            let sql = "INSERT INTO Director (Name_director, First_name_director, Birth_date_director, Nationality_director) VALUES (?, ?, ?, ?)";
            const [result] = await pool.execute(sql, [data.Name_director, data.First_name_director, data.Birth_date_director, data.Nationality_director]);
            return result.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async updateDirector(id, data) {
        try {
            let sql = "UPDATE Director SET Name_director=?, First_name_director=?, Birth_date_director=?, Nationality_director=? WHERE ID_director=?";
            const [result] = await pool.execute(sql, [data.Name_director, data.First_name_director, data.Birth_date_director, data.Nationality_director, id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async deleteDirector(id) {
        try {
            let sql = "DELETE FROM Director WHERE ID_director=?";
            const [result] = await pool.execute(sql, [id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    // Actors
    async getAllActors() {
        try {
            let sql = "SELECT * FROM Actor ORDER BY ID_actor";
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async addActor(data) {
        try {
            let sql = "INSERT INTO Actor (Name_actor, First_name_actor, Birth_date_actor, Nationality_actor) VALUES (?, ?, ?, ?)";
            const [result] = await pool.execute(sql, [data.Name_actor, data.First_name_actor, data.Birth_date_actor, data.Nationality_actor]);
            return result.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async updateActor(id, data) {
        try {
            let sql = "UPDATE Actor SET Name_actor=?, First_name_actor=?, Birth_date_actor=?, Nationality_actor=? WHERE ID_actor=?";
            const [result] = await pool.execute(sql, [data.Name_actor, data.First_name_actor, data.Birth_date_actor, data.Nationality_actor, id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async deleteActor(id) {
        try {
            let sql = "DELETE FROM Actor WHERE ID_actor=?";
            const [result] = await pool.execute(sql, [id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    // Spectators
    async getAllSpectators() {
        try {
            let sql = "SELECT * FROM Spectator ORDER BY ID_spectator";
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async addSpectator(data) {
        try {
            let sql = "INSERT INTO Spectator (Email, Username, Password_hash, Age) VALUES (?, ?, ?, ?)";
            const [result] = await pool.execute(sql, [data.Email, data.Username, data.Password_hash, data.Age]);
            return result.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async updateSpectator(id, data) {
        try {
            let sql = "UPDATE Spectator SET Email=?, Username=?, Password_hash=?, Age=? WHERE ID_spectator=?";
            const [result] = await pool.execute(sql, [data.Email, data.Username, data.Password_hash, data.Age, id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async deleteSpectator(id) {
        try {
            let sql = "DELETE FROM Spectator WHERE ID_spectator=?";
            const [result] = await pool.execute(sql, [id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    // Reviews
    async getAllReviews() {
        try {
            let sql = "SELECT * FROM Review ORDER BY ID_review";
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async addReview(data) {
        try {
            let sql = "INSERT INTO Review (Rating, Comment, user_id, film_id) VALUES (?, ?, ?, ?)";
            const [result] = await pool.execute(sql, [data.Rating, data.Comment, data.user_id, data.film_id]);
            return result.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async updateReview(id, data) {
        try {
            let sql = "UPDATE Review SET Rating=?, Comment=?, user_id=?, film_id=? WHERE ID_review=?";
            const [result] = await pool.execute(sql, [data.Rating, data.Comment, data.user_id, data.film_id, id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async deleteReview(id) {
        try {
            let sql = "DELETE FROM Review WHERE ID_review=?";
            const [result] = await pool.execute(sql, [id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    // Genres
    async getAllGenres() {
        try {
            let sql = "SELECT * FROM Genre ORDER BY ID_genre";
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async addGenre(data) {
        try {
            let sql = "INSERT INTO Genre (Name_genre, Period) VALUES (?, ?)";
            const [result] = await pool.execute(sql, [data.Name_genre, data.Period]);
            return result.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async updateGenre(id, data) {
        try {
            let sql = "UPDATE Genre SET Name_genre=?, Period=? WHERE ID_genre=?";
            const [result] = await pool.execute(sql, [data.Name_genre, data.Period, id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async deleteGenre(id) {
        try {
            let sql = "DELETE FROM Genre WHERE ID_genre=?";
            const [result] = await pool.execute(sql, [id]);
            return result.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
};
