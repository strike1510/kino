<template>
    <div class="review-page">
        <h1>Review Management</h1>
        
        <!-- Statistics -->
        <div class="stats">
            <div class="stat-card">
                <h3>Total Reviews</h3>
                <p class="stat-number">{{ reviews.length }}</p>
            </div>
            <div class="stat-card">
                <h3>Average Rating</h3>
                <p class="stat-number">{{ averageRating.toFixed(1) }}/5</p>
            </div>
            <div class="stat-card">
                <h3>Rated Movies</h3>
                <p class="stat-number">{{ ratedMoviesCount }}</p>
            </div>
        </div>

        <!-- Filters -->
        <div class="filters">
            <div class="filter-group">
                <label for="filmFilter">Filter by movie:</label>
                <select id="filmFilter" v-model="selectedFilm" @change="filterReviews">
                    <option value="">All movies</option>
                    <option v-for="film in films" :key="film.ID_film" :value="film.ID_film">
                        {{ film.Title }}
                    </option>
                </select>
            </div>
            <div class="filter-group">
                <label for="ratingFilter">Filter by rating:</label>
                <select id="ratingFilter" v-model="selectedRating" @change="filterReviews">
                    <option value="">All ratings</option>
                    <option v-for="n in 5" :key="n" :value="n">{{ n }} stars</option>
                </select>
            </div>
        </div>

        <!-- Reviews list -->
        <div class="reviews-list">
            <div v-for="review in filteredReviews" :key="review.ID_review" class="review-card">
                <div class="review-header">
                    <div class="movie-title">{{ getFilmTitle(review.film_id) }}</div>
                    <div class="rating">
                        <span class="stars">{{ '★'.repeat(review.Rating) }}{{ '☆'.repeat(5 - review.Rating) }}</span>
                        <span class="rating-number">({{ review.Rating }}/5)</span>
                    </div>
                </div>
                <div class="review-content">
                    <p class="comment">{{ review.Comment }}</p>
                    <div class="review-meta">
                        <span class="user">By {{ getUsername(review.user_id) }}</span>
                        <span class="date">on {{ formatDate(review.Creation_date) }}</span>
                    </div>
                </div>
                <div class="review-actions">
                    <button @click="editReview(review)" class="btn-edit">Edit</button>
                    <button @click="deleteReview(review.ID_review)" class="btn-delete">Delete</button>
                </div>
            </div>
        </div>

        <!-- Add/Edit form -->
        <div class="review-form">
            <h3>{{ isEditing ? 'Edit Review' : 'Add New Review' }}</h3>
            <form @submit.prevent="submitReview">
                <div class="form-group">
                    <label for="filmSelect">Movie:</label>
                    <select id="filmSelect" v-model="formData.film_id" required>
                        <option value="">Select a movie</option>
                        <option v-for="film in films" :key="film.ID_film" :value="film.ID_film">
                            {{ film.Title }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="userSelect">User:</label>
                    <select id="userSelect" v-model="formData.user_id" required>
                        <option value="">Select a user</option>
                        <option v-for="user in spectators" :key="user.ID_spectator" :value="user.ID_spectator">
                            {{ user.Username }} ({{ user.Email }})
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="rating">Rating:</label>
                    <div class="rating-input">
                        <span 
                            v-for="n in 5" 
                            :key="n" 
                            class="star" 
                            :class="{ active: formData.Rating >= n }"
                            @click="formData.Rating = n"
                        >
                            ★
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="comment">Comment:</label>
                    <textarea 
                        id="comment" 
                        v-model="formData.Comment" 
                        rows="4" 
                        placeholder="Your review for the movie..."
                        required
                    ></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-submit">
                        {{ isEditing ? 'Edit Review' : 'Add Review' }}
                    </button>
                    <button v-if="isEditing" type="button" @click="cancelEdit" class="btn-cancel">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ReviewPage',
    data() {
        return {
            reviews: [],
            films: [],
            spectators: [],
            selectedFilm: '',
            selectedRating: '',
            isEditing: false,
            editingId: null,
            formData: {
                film_id: '',
                user_id: '',
                Rating: 0,
                Comment: ''
            }
        }
    },
    computed: {
        filteredReviews() {
            let filtered = this.reviews
            
            if (this.selectedFilm) {
                filtered = filtered.filter(review => review.film_id == this.selectedFilm)
            }
            
            if (this.selectedRating) {
                filtered = filtered.filter(review => review.Rating == this.selectedRating)
            }
            
            return filtered
        },
        
        averageRating() {
            if (this.reviews.length === 0) return 0
            const sum = this.reviews.reduce((acc, review) => acc + parseInt(review.Rating), 0)
            return sum / this.reviews.length
        },
        
        ratedMoviesCount() {
            const uniqueMovies = new Set(this.reviews.map(review => review.film_id))
            return uniqueMovies.size
        }
    },
    methods: {
        async loadData() {
            try {
                // Load reviews
                const reviewsResponse = await fetch('/data/Review.csv')
                const reviewsText = await reviewsResponse.text()
                this.reviews = this.parseCSV(reviewsText)
                
                // Load films
                const filmsResponse = await fetch('/data/Film.csv')
                const filmsText = await filmsResponse.text()
                this.films = this.parseCSV(filmsText)
                
                // Load spectators
                const spectatorsResponse = await fetch('/data/Spectator.csv')
                const spectatorsText = await spectatorsResponse.text()
                this.spectators = this.parseCSV(spectatorsText)
                
            } catch (error) {
                console.error('Error loading data:', error)
                alert('Error loading data')
            }
        },
        
        parseCSV(csvText) {
            const lines = csvText.split('\n').filter(line => line.trim() !== '')
            if (lines.length === 0) return []
            
            const headers = lines[0].split(',').map(header => header.trim())
            
            return lines.slice(1).map(line => {
                const values = line.split(',').map(value => value.trim())
                const row = {}
                headers.forEach((header, index) => {
                    row[header] = values[index] || ''
                })
                return row
            })
        },
        
        getFilmTitle(filmId) {
            const film = this.films.find(f => f.ID_film == filmId)
            return film ? film.Title : 'Unknown movie'
        },
        
        getUsername(userId) {
            const user = this.spectators.find(u => u.ID_spectator == userId)
            return user ? user.Username : 'Unknown user'
        },
        
        formatDate(dateString) {
            if (!dateString) return 'Unknown date'
            return new Date(dateString).toLocaleDateString('en-GB')
        },
        
        filterReviews() {
            // Filtering is handled by the computed property filteredReviews
        },
        
        editReview(review) {
            this.formData = {
                film_id: review.film_id,
                user_id: review.user_id,
                Rating: parseInt(review.Rating),
                Comment: review.Comment
            }
            this.isEditing = true
            this.editingId = review.ID_review
        },
        
        deleteReview(reviewId) {
            if (confirm('Are you sure you want to delete this review?')) {
                this.reviews = this.reviews.filter(review => review.ID_review !== reviewId)
            }
        },
        
        submitReview() {
            if (this.isEditing) {
                // Edit existing review
                const index = this.reviews.findIndex(review => review.ID_review === this.editingId)
                if (index !== -1) {
                    this.reviews[index] = { 
                        ...this.reviews[index], 
                        ...this.formData,
                        Rating: this.formData.Rating.toString()
                    }
                }
            } else {
                // Add new review
                const currentIds = this.reviews.map(review => parseInt(review.ID_review)).filter(id => !isNaN(id))
                const newId = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1
                
                const newReview = {
                    ID_review: newId.toString(),
                    ...this.formData,
                    Rating: this.formData.Rating.toString(),
                    Creation_date: new Date().toISOString().split('T')[0]
                }
                
                this.reviews.push(newReview)
            }
            
            this.resetForm()
        },
        
        cancelEdit() {
            this.resetForm()
        },
        
        resetForm() {
            this.formData = {
                film_id: '',
                user_id: '',
                Rating: 0,
                Comment: ''
            }
            this.isEditing = false
            this.editingId = null
        }
    },
    mounted() {
        this.loadData()
    }
}
</script>

<style scoped>
.review-page {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
}

.stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;
    gap: 20px;
}

.stat-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    flex: 1;
    border: 1px solid #e9ecef;
}

.stat-card h3 {
    margin: 0 0 10px 0;
    color: #6c757d;
    font-size: 14px;
    text-transform: uppercase;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
}

.filters {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.filter-group {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.filter-group label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #2c3e50;
}

select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.reviews-list {
    margin-bottom: 40px;
}

.review-card {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.movie-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2c3e50;
}

.rating {
    display: flex;
    align-items: center;
    gap: 10px;
}

.stars {
    color: #ffc107;
    font-size: 1.2rem;
}

.rating-number {
    color: #6c757d;
    font-weight: bold;
}

.review-content {
    margin-bottom: 15px;
}

.comment {
    font-style: italic;
    color: #495057;
    line-height: 1.5;
    margin-bottom: 10px;
}

.review-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #6c757d;
}

.review-actions {
    display: flex;
    gap: 10px;
}

.review-form {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #2c3e50;
}

.rating-input {
    display: flex;
    gap: 5px;
}

.star {
    font-size: 2rem;
    color: #ddd;
    cursor: pointer;
    transition: color 0.2s;
}

.star.active {
    color: #ffc107;
}

.star:hover {
    color: #ffc107;
}

textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    resize: vertical;
}

.form-actions {
    text-align: center;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
}

.btn-edit {
    background-color: #28a745;
    color: white;
}

.btn-delete {
    background-color: #dc3545;
    color: white;
}

.btn-submit {
    background-color: #007bff;
    color: white;
}

.btn-cancel {
    background-color: #6c757d;
    color: white;
}

button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

@media (max-width: 768px) {
    .stats {
        flex-direction: column;
    }
    
    .filters {
        flex-direction: column;
    }
    
    .review-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}
</style>