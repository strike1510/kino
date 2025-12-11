<template>
  <div class="cinema-container">
    <h1>Films</h1>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="content">
      <div v-if="isAdmin" class="add-section">
        <button @click="toggleAddForm" class="btn-add">
          {{ showAddForm ? '✕ Cancel' : '+ Add Film' }}
        </button>
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
                  {{ director.Name }}
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
              <th>Synopsis</th>
              <th v-if="isAdmin">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="film in films" :key="film.ID_film">
              <tr>
                <td class="title-cell">{{ film.Title }}</td>
                <td class="director-cell">{{ getDirectorName(film.director_id) }}</td>
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
                              {{ director.Name }}
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
      loading: true,
      error: null,
      isAdmin: false,
      editingFilm: null,
      showAddForm: false,
      newFilm: {
        Title: '',
        director_id: '',
        Synopsis: ''
      }
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
      return director ? director.Name : 'Unknown'
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
    await this.loadFilms()
  }
}
</script>

<style src="../css/cinema.css" scoped></style>
