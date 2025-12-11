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
      <!-- Test for group by -->
      <div class="sort-controls" style="margin: 16px 0; display:flex; gap:12px; align-items:center; justify-content:center;">
        <label for="sort-by" style="font-weight:600;">Sort by:</label>
        <select id="sort-by" v-model="sortBy" style="padding:8px; border-radius:6px;">
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
        </select>

        <label for="sort-order" style="font-weight:600; margin-left:8px;">Order:</label>
        <select id="sort-order" v-model="sortOrder" style="padding:8px; border-radius:6px;">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <!-- end of test -->

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
            <template v-for="film in sortedFilms" :key="film.ID_film">
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
      },

      // === Tri (ajouts) ===
      sortBy: 'title',              // valeur par défaut
      sortOrder: 'asc',             // 'asc' or 'desc'
      sortOptions: [
        { value: 'title', text: 'Title (Film)' },
        { value: 'director', text: 'Director' },
        { value: 'actor', text: 'Actor' },
        { value: 'genre', text: 'Genre' }
      ],
      actors: [],    // sera rempli si tu charges la liste des acteurs
      genres: []     // sera rempli si tu charges la liste des genres
    }
  },

  // === computed : retourne la liste triée ===
  computed: {
  sortedFilms() {
    const filmsCopy = Array.isArray(this.films) ? [...this.films] : [];
    const orderFactor = this.sortOrder === 'asc' ? 1 : -1;

    // helper local pour obtenir la valeur à comparer (toujours chaîne)
    const valueFor = (film) => {
      const s = this.sortBy;

      if (s === 'title') {
        return String(film.Title ?? film.title ?? '').trim().toLowerCase();
      }

      if (s === 'director') {
        // essaye d'abord d'obtenir le nom directement depuis le film s'il est présent
        const nameFromFilm = String(film.director_name ?? film.DirectorName ?? '').trim();
        if (nameFromFilm) return nameFromFilm.toLowerCase();

        // sinon utilise la fonction globale (qui essaie plusieurs formats)
        return String(this.getDirectorName(film.director_id ?? film.ID_director ?? film.directorId ?? '') || '').trim().toLowerCase();
      }

      if (s === 'actor') {
        const actorName = String(this.getFirstActorName(film) || '').trim().toLowerCase();
        return actorName;
      }

      if (s === 'genre') {
        // valeur directe ou via mapping genres
        const g = this.getGenreName(film);
        return String(g || '').trim().toLowerCase();
      }

      // fallback
      return String(film.Title ?? film.title ?? '').trim().toLowerCase();
    };

    filmsCopy.sort((a, b) => {
      const va = valueFor(a);
      const vb = valueFor(b);

      // debug (décommente si besoin)
      // console.log('sort compare', this.sortBy, va, vb);

      // si les deux valeurs sont vides on retombe sur le titre pour garder un ordre stable
      if (!va && !vb) {
        const ta = String(a.Title ?? a.title ?? '').toLowerCase();
        const tb = String(b.Title ?? b.title ?? '').toLowerCase();
        return ta.localeCompare(tb) * orderFactor;
      }

      // compare chaînes avec localeCompare (plus fiable)
      const cmp = va.localeCompare(vb, undefined, { numeric: true, sensitivity: 'base' });
      return cmp * orderFactor;
    });

    return filmsCopy;
  }
},

  methods: {
  // --- Auth check ---
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

  // --- load directors ---
  async loadDirectors() {
    try {
      const response = await fetch('http://localhost:9000/cinemaapi/directors')
      if (!response.ok) throw new Error('Failed to load directors')
      this.directors = await response.json()
    } catch (err) {
      console.error('Error loading directors:', err)
      this.directors = []
    }
  },

  // --- load films ---
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

  // Robust director name resolver (accepts id or direct name)
  getDirectorName(directorIdOrName) {
    if (!directorIdOrName && directorIdOrName !== 0) return ''

    // If a string that looks like a name (contains letters and spaces), try to match by name
    if (typeof directorIdOrName === 'string' && /[a-zA-Z]/.test(directorIdOrName)) {
      const byName = this.directors.find(d => {
        const name = (d.Name || d.name || '').toString().toLowerCase()
        return name && name === directorIdOrName.toString().toLowerCase()
      })
      if (byName) return byName.Name || byName.name || directorIdOrName
      // if not found, return the original string (it may already be a name)
      return directorIdOrName
    }

    // normalize id (number or numeric string)
    const normalize = (v) => {
      if (v === null || v === undefined || v === '') return null
      if (typeof v === 'number') return v
      const n = Number(v)
      return Number.isNaN(n) ? v : n
    }

    const idNorm = normalize(directorIdOrName)
    if (this.directors && this.directors.length) {
      const found = this.directors.find(d => {
        return d.ID_director === idNorm || d.id === idNorm || String(d.ID_director) === String(idNorm) || String(d.id) === String(idNorm)
      })
      if (found) return found.Name || found.name || ''
    }

    return ''
  },

  toggleAddForm() {
    this.showAddForm = !this.showAddForm
    if (!this.showAddForm) this.resetNewFilm()
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
  },

  // --- load actors & genres (optional endpoints) ---
  async loadActors() {
    try {
      const resp = await fetch('http://localhost:9000/cinemaapi/actors')
      if (!resp.ok) throw new Error('Failed to load actors')
      this.actors = await resp.json()
    } catch (err) {
      console.warn('Actors not loaded (endpoint may not exist):', err.message)
      this.actors = []
    }
  },

  async loadGenres() {
    try {
      const resp = await fetch('http://localhost:9000/cinemaapi/genres')
      if (!resp.ok) throw new Error('Failed to load genres')
      this.genres = await resp.json()
    } catch (err) {
      console.warn('Genres not loaded (endpoint may not exist):', err.message)
      this.genres = []
    }
  },

  // getFirstActorName : supports many possible film formats
  getFirstActorName(film) {
    if (!film) return ''

    // 1) film.Actors = [{ Name / name }]
    if (Array.isArray(film.Actors) && film.Actors.length) {
      return film.Actors[0].Name || film.Actors[0].name || ''
    }

    // 2) film.actor_names = ['John Doe', ...]
    if (Array.isArray(film.actor_names) && film.actor_names.length) {
      return film.actor_names[0] || ''
    }

    // 3) film.actor_ids = [id1, id2]  -> resolve via this.actors if loaded
    if (Array.isArray(film.actor_ids) && film.actor_ids.length && this.actors.length) {
      const id = film.actor_ids[0]
      const a = this.actors.find(x => x.ID_actor === id || x.id === id || String(x.ID_actor) === String(id))
      return a ? (a.Name || a.name || '') : ''
    }
    if (Array.isArray(film.actorIds) && film.actorIds.length && this.actors.length) {
      const id = film.actorIds[0]
      const a = this.actors.find(x => x.ID_actor === id || x.id === id || String(x.ID_actor) === String(id))
      return a ? (a.Name || a.name || '') : ''
    }

    // 4) film.ActorsCSV = "John Doe,Jane Roe"
    if (typeof film.ActorsCSV === 'string' && film.ActorsCSV.trim()) {
      const parts = film.ActorsCSV.split(',').map(s => s.trim()).filter(Boolean)
      if (parts.length) return parts[0]
    }

    // 5) film.first_actor or film.leadActor
    if (film.first_actor) return film.first_actor
    if (film.leadActor) return film.leadActor

    return ''
  },

  // getGenreName : supporte plusieurs formats et mapping via this.genres
  getGenreName(film) {
    if (!film) return ''

    if (typeof film.Genre === 'string' && film.Genre.trim()) return film.Genre
    if (typeof film.genre === 'string' && film.genre.trim()) return film.genre

    if ((film.genre_id || film.genreId) && Array.isArray(this.genres) && this.genres.length) {
      const gid = film.genre_id ?? film.genreId
      const g = this.genres.find(x => x.ID_genre === gid || x.id === gid || String(x.ID_genre) === String(gid))
      if (g) return g.Name || g.name || ''
    }

    if (Array.isArray(film.genres) && film.genres.length) {
      const g0 = film.genres[0]
      if (typeof g0 === 'string') return g0
      return g0.Name || g0.name || ''
    }

    return ''
  }
},


  async mounted() {
    await this.checkAuth()
    await this.loadDirectors()
    await this.loadActors()    // <-- ajouté
    await this.loadGenres()    // <-- ajouté
    await this.loadFilms()
  }
}
</script>

<style src="../css/cinema.css" scoped></style>
