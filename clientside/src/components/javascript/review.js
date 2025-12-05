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
            showAddForm: false,
            currentUser: null,
            currentSpectatorId: null,
            isAdmin: false,
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
        async checkAuthentication() {
            try {
                const response = await fetch('http://localhost:9000/auth/status', {
                    credentials: 'include'
                })
                const data = await response.json()
                
                if (data.isAuthenticated) {
                    this.currentUser = data.user
                    this.isAdmin = data.user.is_admin === 1 || data.user.is_admin === true
                    console.log('Review - User:', this.currentUser)
                    console.log('Review - Is Admin:', this.isAdmin)
                    // Find the spectator ID matching this user's username
                    await this.loadSpectators()
                    const spectator = this.spectators.find(s => s.Username === data.user.username)
                    if (spectator) {
                        this.currentSpectatorId = spectator.ID_spectator
                        this.formData.user_id = spectator.ID_spectator
                    }
                } else {
                    this.currentUser = null
                    this.currentSpectatorId = null
                    this.isAdmin = false
                }
            } catch (error) {
                console.error('Auth check error:', error)
            }
        },

        async loadSpectators() {
            try {
                const spectatorsResponse = await fetch('http://localhost:9000/cinemaapi/spectators')
                if (!spectatorsResponse.ok) throw new Error('Failed to load spectators')
                this.spectators = await spectatorsResponse.json()
            } catch (error) {
                console.error('Error loading spectators:', error)
            }
        },

        async loadData() {
            try {
                const reviewsResponse = await fetch('http://localhost:9000/cinemaapi/reviews')
                if (!reviewsResponse.ok) throw new Error('Failed to load reviews')
                this.reviews = await reviewsResponse.json()
                
                const filmsResponse = await fetch('http://localhost:9000/cinemaapi/films')
                if (!filmsResponse.ok) throw new Error('Failed to load films')
                this.films = await filmsResponse.json()
                
                await this.loadSpectators()
                
            } catch (error) {
                console.error('Error loading data:', error)
                alert('Error loading data. Make sure the backend server is running on port 9000')
            }
        },

        canModifyReview(review) {
            // Admins can modify any review, regular users can only modify their own
            if (this.isAdmin) {
                return true
            }
            return this.currentSpectatorId && review.user_id == this.currentSpectatorId
        },

        isLoggedIn() {
            return this.currentUser !== null
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

        toggleAddForm() {
            this.showAddForm = !this.showAddForm
            if (this.showAddForm) {
                // Close any open edit forms
                this.isEditing = false
                this.editingId = null
                // Reset form but keep user_id
                this.formData = {
                    film_id: '',
                    user_id: this.currentSpectatorId || '',
                    Rating: 0,
                    Comment: ''
                }
            } else {
                this.resetForm()
            }
        },

        toggleEditForm(review) {
            if (!this.canModifyReview(review)) {
                alert('You can only edit your own reviews!')
                return
            }

            // Close add form if open
            this.showAddForm = false

            // Toggle edit form
            if (this.isEditing && this.editingId === review.ID_review) {
                this.cancelEdit()
            } else {
                this.formData = {
                    film_id: review.film_id,
                    user_id: review.user_id,
                    Rating: parseInt(review.Rating),
                    Comment: review.Comment
                }
                this.isEditing = true
                this.editingId = review.ID_review
            }
        },
        
        editReview(review) {
            if (!this.canModifyReview(review)) {
                alert('You can only edit your own reviews!')
                return
            }
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
            const review = this.reviews.find(r => r.ID_review === reviewId)
            if (!this.canModifyReview(review)) {
                alert('You can only delete your own reviews!')
                return
            }
            
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
            if (!this.isLoggedIn()) {
                alert('You must be logged in to submit a review!')
                this.$router.push('/auth')
                return
            }

            if (!this.currentSpectatorId) {
                alert('User account not found in spectators database. Please contact administrator.')
                return
            }

            // Validation
            if (!this.formData.film_id) {
                alert('Please select a movie!')
                return
            }

            if (!this.formData.Rating || this.formData.Rating === 0) {
                alert('Please select a rating!')
                return
            }

            if (!this.formData.Comment || this.formData.Comment.trim() === '') {
                alert('Please write a comment!')
                return
            }

            try {
                if (this.isEditing) {
                    const response = await fetch(`http://localhost:9000/cinemaapi/reviews/${this.editingId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            Rating: this.formData.Rating,
                            Comment: this.formData.Comment,
                            user_id: this.currentSpectatorId,
                            film_id: this.formData.film_id
                        })
                    })
                    if (!response.ok) {
                        const errorData = await response.json()
                        throw new Error(errorData.error || 'Update failed')
                    }
                    alert('Review updated successfully!')
                } else {
                    const response = await fetch('http://localhost:9000/cinemaapi/reviews', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            Rating: this.formData.Rating,
                            Comment: this.formData.Comment,
                            user_id: this.currentSpectatorId,
                            film_id: this.formData.film_id
                        })
                    })
                    if (!response.ok) {
                        const errorData = await response.json()
                        throw new Error(errorData.error || 'Create failed')
                    }
                    alert('Review added successfully!')
                }
                
                await this.loadData()
                this.resetForm()
            } catch (error) {
                console.error('Error submitting review:', error)
                alert('Error submitting review: ' + error.message)
            }
        },
        
        cancelEdit() {
            this.resetForm()
        },
        
        resetForm() {
            this.formData = {
                film_id: '',
                user_id: this.currentSpectatorId || '',
                Rating: 0,
                Comment: ''
            }
            this.isEditing = false
            this.editingId = null
            this.showAddForm = false
        }
    },
    async mounted() {
        await this.checkAuthentication()
        await this.loadData()
    }
}