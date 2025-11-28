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
                const reviewsResponse = await fetch('http://localhost:9000/cinemaapi/reviews')
                if (!reviewsResponse.ok) throw new Error('Failed to load reviews')
                this.reviews = await reviewsResponse.json()
                
                const filmsResponse = await fetch('http://localhost:9000/cinemaapi/films')
                if (!filmsResponse.ok) throw new Error('Failed to load films')
                this.films = await filmsResponse.json()
                
                const spectatorsResponse = await fetch('http://localhost:9000/cinemaapi/spectators')
                if (!spectatorsResponse.ok) throw new Error('Failed to load spectators')
                this.spectators = await spectatorsResponse.json()
                
            } catch (error) {
                console.error('Error loading data:', error)
                alert('Error loading data. Make sure the backend server is running on port 9000')
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
        
        async deleteReview(reviewId) {
            if (confirm('Are you sure you want to delete this review?')) {
                try {
                    const response = await fetch(`http://localhost:9000/cinemaapi/reviews/${reviewId}`, {
                        method: 'DELETE'
                    })
                    if (!response.ok) throw new Error('Delete failed')
                    await this.loadData()
                } catch (error) {
                    console.error('Error deleting review:', error)
                    alert('Error deleting review')
                }
            }
        },
        
        async submitReview() {
            try {
                if (this.isEditing) {
                    const response = await fetch(`http://localhost:9000/cinemaapi/reviews/${this.editingId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            Rating: this.formData.Rating,
                            Comment: this.formData.Comment,
                            user_id: this.formData.user_id,
                            film_id: this.formData.film_id
                        })
                    })
                    if (!response.ok) throw new Error('Update failed')
                } else {
                    const response = await fetch('http://localhost:9000/cinemaapi/reviews', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            Rating: this.formData.Rating,
                            Comment: this.formData.Comment,
                            user_id: this.formData.user_id,
                            film_id: this.formData.film_id
                        })
                    })
                    if (!response.ok) throw new Error('Create failed')
                }
                
                await this.loadData()
                this.resetForm()
            } catch (error) {
                console.error('Error submitting review:', error)
                alert('Error submitting review')
            }
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