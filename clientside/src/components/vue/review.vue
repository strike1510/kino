<template>
    <div class="review-page">
        <h1>Review Management</h1>
        
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

<script src="../javascript/review.js"></script>
<style scoped src="../css/review.css"></style>