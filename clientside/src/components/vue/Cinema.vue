<template>
  <div class="cinema-container">
    <h1>Films</h1>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="content">
      <div class="controls-bar">
        <div class="left-controls">
          <div class="control-group">
            <label>Sort by:</label>
            <select v-model="sortBy" @change="applySortAndGroup">
              <option value="">None</option>
              <option value="Title">Title</option>
              <option value="Average_rating">Rating</option>
              <option value="Release_year">Year</option>
            </select>
          </div>
          
          <div class="control-group">
            <label>Group by:</label>
            <select v-model="groupBy" @change="applySortAndGroup">
              <option value="">None</option>
              <option value="director_id">Director</option>
              <option value="Release_year">Year</option>
              <option value="actors">Actors</option>
            </select>
          </div>
        </div>

        <div v-if="isAdmin" class="add-section">
          <button @click="toggleAddForm" class="btn-add">
            {{ showAddForm ? '✕ Cancel' : '+ Add Film' }}
          </button>
        </div>
      </div>

      <div v-if="showAddForm && isAdmin" class="add-form-container">
        <h3>Add New Film</h3>
        <form @submit.prevent="addFilm">
          <div class="form-row">
            <div class="form-group">
              <label>Title *</label>
              <input v-model="newFilm.Title" type="text" required />
            </div>
            <div class="form-group">
              <label>Director *</label>
              <select v-model="newFilm.director_id" required>
                <option value="">Select a director</option>
                <option v-for="director in directors" :key="director.ID_director" :value="director.ID_director">
                  {{ director.First_name_director }} {{ director.Name_director }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Synopsis</label>
            <textarea v-model="newFilm.Synopsis" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">Add Film</button>
            <button type="button" @click="cancelAdd" class="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
      
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Director</th>
              <th>Rating</th>
              <th>Year</th>
              <th>Actors</th>
              <th>Synopsis</th>
              <th v-if="isAdmin">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="groupBy">
              <template v-for="(groupFilms, groupName) in groupedFilms" :key="groupName">
                <tr class="group-header">
                  <td :colspan="isAdmin ? 7 : 6">
                    <strong>{{ getGroupLabel(groupName) }}</strong> ({{ groupFilms.length }} films)
                  </td>
                </tr>
                <template v-for="film in groupFilms" :key="film.ID_film">
                  <tr>
                    <td class="title-cell">{{ film.Title }}</td>
                    <td class="director-cell">{{ getDirectorName(film.director_id) }}</td>
                    <td class="rating-cell">{{ getAverageRating(film.ID_film) }}</td>
                    <td class="year-cell">{{ film.Release_year || 'N/A' }}</td>
                    <td class="actors-cell">{{ getActorNames(film.ID_film) }}</td>
                    <td class="synopsis-cell">{{ film.Synopsis || 'No synopsis available' }}</td>
                    <td v-if="isAdmin" class="actions-cell">
                      <button @click="startEdit(film)" class="btn-modify">Modify</button>
                      <button @click="deleteFilm(film.ID_film)" class="btn-delete">Delete</button>
                    </td>
                  </tr>

                  <tr v-if="editingFilm && editingFilm.ID_film === film.ID_film" class="edit-row">
                    <td :colspan="4">
                      <div class="edit-form">
                        <h3>Edit Film</h3>
                        <form @submit.prevent="saveEdit">
                          <div class="form-row">
                            <div class="form-group">
                              <label>Title *</label>
                              <input v-model="editingFilm.Title" type="text" required />
                            </div>
                            <div class="form-group">
                              <label>Director *</label>
                              <select v-model="editingFilm.director_id" required>
                                <option value="">Select a director</option>
                                <option v-for="director in directors" :key="director.ID_director" :value="director.ID_director">
                                  {{ director.First_name_director }} {{ director.Name_director }}
                                </option>
                              </select>
                            </div>
                          </div>
                          <div class="form-group">
                            <label>Synopsis</label>
                            <textarea v-model="editingFilm.Synopsis" rows="3"></textarea>
                          </div>
                          <div class="form-actions">
                            <button type="submit" class="btn-submit">Save</button>
                            <button type="button" @click="cancelEdit" class="btn-cancel">Cancel</button>
                          </div>
                        </form>
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
            </template>

            <template v-else>
              <template v-for="film in sortedFilms" :key="film.ID_film">
                <tr>
                  <td class="title-cell">{{ film.Title }}</td>
                  <td class="director-cell">{{ getDirectorName(film.director_id) }}</td>
                  <td class="rating-cell">{{ getAverageRating(film.ID_film) }}</td>
                  <td class="year-cell">{{ film.Release_year || 'N/A' }}</td>
                  <td class="actors-cell">{{ getActorNames(film.ID_film) }}</td>
                  <td class="synopsis-cell">{{ film.Synopsis || 'No synopsis available' }}</td>
                  <td v-if="isAdmin" class="actions-cell">
                    <button @click="startEdit(film)" class="btn-modify">Modify</button>
                    <button @click="deleteFilm(film.ID_film)" class="btn-delete">Delete</button>
                  </td>
                </tr>

                <tr v-if="editingFilm && editingFilm.ID_film === film.ID_film" class="edit-row">
                  <td :colspan="isAdmin ? 7 : 6">
                    <div class="edit-form">
                      <h3>Edit Film</h3>
                      <form @submit.prevent="saveEdit">
                        <div class="form-row">
                          <div class="form-group">
                            <label>Title *</label>
                            <input v-model="editingFilm.Title" type="text" required />
                          </div>
                          <div class="form-group">
                            <label>Director *</label>
                            <select v-model="editingFilm.director_id" required>
                              <option value="">Select a director</option>
                              <option v-for="director in directors" :key="director.ID_director" :value="director.ID_director">
                                {{ director.First_name_director }} {{ director.Name_director }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label>Synopsis</label>
                          <textarea v-model="editingFilm.Synopsis" rows="3"></textarea>
                        </div>
                        <div class="form-actions">
                          <button type="submit" class="btn-submit">Save</button>
                          <button type="button" @click="cancelEdit" class="btn-cancel">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cinema',
  data() {
    return {
      films: [],
      directors: [],
      actors: [],
      filmActors: {},
      filmRatings: {},
      loading: true,
      error: null,
      isAdmin: false,
      editingFilm: null,
      showAddForm: false,
      newFilm: {
        Title: '',
        director_id: '',
        Synopsis: ''
      },
      sortBy: '',
      groupBy: ''
    }
  },
  computed: {
    sortedFilms() {
      if (!this.sortBy) return this.films
      
      return [...this.films].sort((a, b) => {
        if (this.sortBy === 'Average_rating') {
          const aRating = this.filmRatings[a.ID_film] || 0
          const bRating = this.filmRatings[b.ID_film] || 0
          return bRating - aRating
        }
        
        let aVal = a[this.sortBy]
        let bVal = b[this.sortBy]
        
        if (typeof aVal === 'string') {
          return aVal.localeCompare(bVal)
        }
        
        if (aVal == null) return 1
        if (bVal == null) return -1
        
        return aVal - bVal
      })
    },
    
    groupedFilms() {
      if (!this.groupBy || !this.sortedFilms.length) return {}
      
      const groups = {}
      this.sortedFilms.forEach(film => {
        if (this.groupBy === 'actors') {
          const actorIds = this.filmActors[film.ID_film] || []
          if (actorIds.length > 0) {
            actorIds.forEach(actorId => {
              if (!groups[actorId]) {
                groups[actorId] = []
              }
              groups[actorId].push(film)
            })
          } else {
            if (!groups['no_actors']) {
              groups['no_actors'] = []
            }
            groups['no_actors'].push(film)
          }
        } else {
          const groupKey = film[this.groupBy]
          if (!groups[groupKey]) {
            groups[groupKey] = []
          }
          groups[groupKey].push(film)
        }
      })
      
      return groups
    }
  },
  methods: {
    async checkAuth() {
      try {
        const response = await fetch('http://localhost:9000/auth/status', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          if (data.isAuthenticated && data.user) {
            this.isAdmin = data.user.is_admin === 1 || data.user.is_admin === true || data.user.is_admin === '1'
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err)
      }
    },
    
    async loadDirectors() {
      try {
        const response = await fetch('http://localhost:9000/cinemaapi/directors')
        if (!response.ok) throw new Error('Failed to load directors')
        this.directors = await response.json()
      } catch (err) {
        console.error('Error loading directors:', err)
      }
    },
    
    async loadActors() {
      try {
        const response = await fetch('http://localhost:9000/cinemaapi/actors')
        if (!response.ok) throw new Error('Failed to load actors')
        this.actors = await response.json()
        
        const playResponse = await fetch('http://localhost:9000/cinemaapi/play')
        if (playResponse.ok) {
          const playData = await playResponse.json()
          this.filmActors = {}
          playData.forEach(play => {
            if (!this.filmActors[play.ID_film]) {
              this.filmActors[play.ID_film] = []
            }
            this.filmActors[play.ID_film].push(play.actor_id)
          })
        }
      } catch (err) {
        console.error('Error loading actors:', err)
      }
    },
    
    async loadRatings() {
      try {
        const response = await fetch('http://localhost:9000/cinemaapi/reviews/average')
        if (response.ok) {
          const ratings = await response.json()
          this.filmRatings = {}
          ratings.forEach(rating => {
            this.filmRatings[rating.film_id] = parseFloat(rating.average_rating)
          })
        }
      } catch (err) {
        console.error('Error loading ratings:', err)
      }
    },
    
    async loadFilms() {
      try {
        const response = await fetch('http://localhost:9000/cinemaapi/films')
        if (!response.ok) throw new Error('Failed to load films')
        this.films = await response.json()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    
    getDirectorName(directorId) {
      const director = this.directors.find(d => d.ID_director === directorId)
      if (!director) return 'Unknown'
      return `${director.First_name_director || ''} ${director.Name_director}`.trim()
    },
    
    getActorNames(filmId) {
      const actorIds = this.filmActors[filmId] || []
      if (actorIds.length === 0) return 'N/A'
      const actorNames = actorIds.map(actorId => {
        const actor = this.actors.find(a => a.ID_actor === actorId)
        return actor ? `${actor.First_name_actor || ''} ${actor.Name_actor}`.trim() : 'Unknown'
      })
      return actorNames.join(', ')
    },
    
    getAverageRating(filmId) {
      const rating = this.filmRatings[filmId]
      return rating != null ? rating.toFixed(1) : 'N/A'
    },
    
    getGroupLabel(groupKey) {
      if (this.groupBy === 'director_id') {
        return this.getDirectorName(parseInt(groupKey))
      }
      if (this.groupBy === 'Release_year') {
        return groupKey || 'Unknown Year'
      }
      if (this.groupBy === 'actors') {
        if (groupKey === 'no_actors') {
          return 'No Actors'
        }
        const actor = this.actors.find(a => a.ID_actor === parseInt(groupKey))
        return actor ? `${actor.First_name_actor || ''} ${actor.Name_actor}`.trim() : 'Unknown Actor'
      }
      return groupKey
    },
    
    applySortAndGroup() {
    },
    
    toggleAddForm() {
      this.showAddForm = !this.showAddForm
      if (!this.showAddForm) {
        this.resetNewFilm()
      }
    },
    
    resetNewFilm() {
      this.newFilm = {
        Title: '',
        director_id: '',
        Synopsis: ''
      }
    },
    
    async addFilm() {
      try {
        const response = await fetch('http://localhost:9000/cinemaapi/films', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(this.newFilm)
        })
        
        if (!response.ok) throw new Error('Failed to add film')
        
        await this.loadFilms()
        this.resetNewFilm()
        this.showAddForm = false
        alert('Film added successfully!')
      } catch (err) {
        alert('Error: ' + err.message)
      }
    },
    
    cancelAdd() {
      this.resetNewFilm()
      this.showAddForm = false
    },
    
    startEdit(film) {
      this.editingFilm = { ...film }
    },
    
    cancelEdit() {
      this.editingFilm = null
    },
    
    async saveEdit() {
      try {
        const response = await fetch(`http://localhost:9000/cinemaapi/films/${this.editingFilm.ID_film}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(this.editingFilm)
        })
        
        if (!response.ok) throw new Error('Failed to update film')
        
        await this.loadFilms()
        this.editingFilm = null
        alert('Film updated successfully!')
      } catch (err) {
        alert('Error: ' + err.message)
      }
    },
    
    async deleteFilm(filmId) {
      if (!confirm('Are you sure you want to delete this film?')) return
      
      try {
        const response = await fetch(`http://localhost:9000/cinemaapi/films/${filmId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (!response.ok) throw new Error('Failed to delete film')
        
        await this.loadFilms()
        alert('Film deleted successfully!')
      } catch (err) {
        alert('Error: ' + err.message)
      }
    }
  },
  
  async mounted() {
    await this.checkAuth()
    await this.loadDirectors()
    await this.loadActors()
    await this.loadRatings()
    await this.loadFilms()
  }
}
</script>

<style src="../css/cinema.css" scoped></style>
