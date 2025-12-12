// controllers/cinema.route.js
const express = require('express');
const router = express.Router();
const cinemaRepo = require('../utils/cinema.repository');

// Films routes
router.get('/films', async (req, res) => {
    try {
        const films = await cinemaRepo.getAllFilms();
        res.json(films);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/films', async (req, res) => {
    try {
        const id = await cinemaRepo.addFilm(req.body);
        res.json({ id, message: 'Film created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/films/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.updateFilm(req.params.id, req.body);
        res.json({ rowsUpdated: rows, message: 'Film updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/films/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.deleteFilm(req.params.id);
        res.json({ rowsDeleted: rows, message: 'Film deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Directors routes
router.get('/directors', async (req, res) => {
    try {
        const directors = await cinemaRepo.getAllDirectors();
        res.json(directors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/directors', async (req, res) => {
    try {
        const id = await cinemaRepo.addDirector(req.body);
        res.json({ id, message: 'Director created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/directors/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.updateDirector(req.params.id, req.body);
        res.json({ rowsUpdated: rows, message: 'Director updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/directors/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.deleteDirector(req.params.id);
        res.json({ rowsDeleted: rows, message: 'Director deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actors routes
router.get('/actors', async (req, res) => {
    try {
        const actors = await cinemaRepo.getAllActors();
        res.json(actors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/actors', async (req, res) => {
    try {
        const id = await cinemaRepo.addActor(req.body);
        res.json({ id, message: 'Actor created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/actors/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.updateActor(req.params.id, req.body);
        res.json({ rowsUpdated: rows, message: 'Actor updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/actors/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.deleteActor(req.params.id);
        res.json({ rowsDeleted: rows, message: 'Actor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Spectators routes
router.get('/spectators', async (req, res) => {
    try {
        const spectators = await cinemaRepo.getAllSpectators();
        res.json(spectators);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/spectators', async (req, res) => {
    try {
        const id = await cinemaRepo.addSpectator(req.body);
        res.json({ id, message: 'Spectator created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/spectators/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.updateSpectator(req.params.id, req.body);
        res.json({ rowsUpdated: rows, message: 'Spectator updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/spectators/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.deleteSpectator(req.params.id);
        res.json({ rowsDeleted: rows, message: 'Spectator deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reviews routes
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await cinemaRepo.getAllReviews();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/reviews', async (req, res) => {
    try {
        const id = await cinemaRepo.addReview(req.body);
        res.json({ id, message: 'Review created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/reviews/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.updateReview(req.params.id, req.body);
        res.json({ rowsUpdated: rows, message: 'Review updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/reviews/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.deleteReview(req.params.id);
        res.json({ rowsDeleted: rows, message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Genres routes
router.get('/genres', async (req, res) => {
    try {
        const genres = await cinemaRepo.getAllGenres();
        res.json(genres);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/genres', async (req, res) => {
    try {
        const id = await cinemaRepo.addGenre(req.body);
        res.json({ id, message: 'Genre created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/genres/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.updateGenre(req.params.id, req.body);
        res.json({ rowsUpdated: rows, message: 'Genre updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/genres/:id', async (req, res) => {
    try {
        const rows = await cinemaRepo.deleteGenre(req.params.id);
        res.json({ rowsDeleted: rows, message: 'Genre deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Play (Film-Actor relationships) routes
router.get('/play', async (req, res) => {
    try {
        const play = await cinemaRepo.getAllPlay();
        res.json(play);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reviews routes
router.get('/reviews/average', async (req, res) => {
    try {
        const ratings = await cinemaRepo.getAverageRatings();
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
