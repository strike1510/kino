<template>
  <div class="hello">
    <h1>DataBase Panel</h1>
    
    <div class="table-selector">
      <label for="tableSelect">Choose a table : </label>
      <select id="tableSelect" v-model="selectedTable" @change="loadTableData">
        <option value="Film">Films</option>
        <option value="Director">Realisators</option>
        <option value="Actor">Actors</option>
        <option value="Spectator">Spectators</option>
        <option value="Review">Rate</option>
        <option value="Genre">Genres</option>
        <option value="Define">Genres of Films</option>
        <option value="Play">Acteurs of Films</option>
      </select>
    </div>

    <div v-if="loading" class="message loading">Loading the datas...</div>
    <div v-if="error" class="message error">{{ error }}</div>

    <div v-if="!loading && !error" class="data-table">
      <h2>Table: {{ selectedTable }} ({{ tableData.length }} records)</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th v-for="column in columns" :key="column">{{ column }}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row[primaryKey]">
              <td v-for="column in columns" :key="column">
                {{ row[column] }}
              </td>
              <td class="actions">
                <button @click="editRow(row)" class="btn-edit">Modify</button>
                <button @click="deleteRow(row[primaryKey])" class="btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="!loading && !error" class="form-section">
      <h3>{{ isEditing ? 'Modify' : 'Add' }} un enregistrement</h3>
      <form @submit.prevent="submitForm">
        <div v-for="column in editableColumns" :key="column" class="form-group">
          <label :for="column">{{ column }}:</label>
          <textarea
            v-if="getInputType(column) === 'textarea'"
            :id="column"
            v-model="formData[column]"
            :required="isRequired(column)"
            rows="4"
          ></textarea>
          <input
            v-else
            :id="column"
            v-model="formData[column]"
            :type="getInputType(column)"
            :required="isRequired(column)"
          />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-submit">
            {{ isEditing ? 'Modify' : 'Add' }}
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
  name: 'CinemaDatabase',
  data() {
    return {
      selectedTable: 'Film',
      tableData: [],
      formData: {},
      isEditing: false,
      editingId: null,
      loading: false,
      error: null
    }
  },
  computed: {
    columns() {
      if (this.tableData.length === 0) return []
      return Object.keys(this.tableData[0])
    },
    primaryKey() {
      return this.columns[0]
    },
    editableColumns() {
      return this.columns.filter(col => col !== this.primaryKey)
    }
  },
  methods: {
    async loadTableData() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`/data/${this.selectedTable}.csv`)
        
        if (!response.ok) {
          throw new Error(`Fichier ${this.selectedTable}.csv non trouvé`)
        }
        
        const csvText = await response.text()
        this.tableData = this.parseCSV(csvText)
        this.resetForm()
        
        if (this.tableData.length === 0) {
          this.error = 'Aucune donnée trouvée dans le fichier CSV'
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        this.error = `Erreur: ${error.message}. Assurez-vous que le fichier ${this.selectedTable}.csv existe dans le dossier public/data/`
        this.tableData = []
      } finally {
        this.loading = false
      }
    },

    parseCSV(csvText) {
      const lines = csvText.split('\n').filter(line => line.trim() !== '')
      
      if (lines.length === 0) return []
      
      const headers = lines[0].split(',').map(header => header.trim())
      
      return lines.slice(1).map((line, index) => {
        const values = line.split(',').map(value => value.trim())
        const row = {}
        
        headers.forEach((header, i) => {
          row[header] = values[i] !== undefined ? values[i] : ''
        })
        
        return row
      })
    },

    getInputType(column) {
      const lowerColumn = column.toLowerCase()
      
      if (lowerColumn.includes('date')) return 'date'
      if (lowerColumn.includes('email')) return 'email'
      if (lowerColumn.includes('password')) return 'password'
      if (lowerColumn.includes('year') || lowerColumn.includes('duration') || 
          lowerColumn.includes('age') || lowerColumn.includes('rating') || 
          lowerColumn.includes('id_')) return 'number'
      if (lowerColumn.includes('synopsis') || lowerColumn.includes('comment')) return 'textarea'
      return 'text'
    },

    isRequired(column) {
      const lowerColumn = column.toLowerCase()
      const optionalColumns = ['first_name', 'period', 'birth_date', 'nationality', 
                              'registration_date', 'creation_date', 'average_rating']
      return !optionalColumns.some(opt => lowerColumn.includes(opt))
    },

    resetForm() {
      this.formData = {}
      this.editableColumns.forEach(col => {
        this.formData[col] = ''
      })
      this.isEditing = false
      this.editingId = null
    },

    submitForm() {
      if (this.isEditing) {
        const index = this.tableData.findIndex(row => row[this.primaryKey] === this.editingId)
        if (index !== -1) {
          this.tableData[index] = { ...this.tableData[index], ...this.formData }
        }
      } else {
        const currentIds = this.tableData
          .map(row => parseInt(row[this.primaryKey]))
          .filter(id => !isNaN(id))
        
        const newId = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1
        const newRow = { 
          [this.primaryKey]: newId.toString(), 
          ...this.formData 
        }
        this.tableData.push(newRow)
      }
      this.resetForm()
    },

    editRow(row) {
      this.formData = { ...row }
      delete this.formData[this.primaryKey]
      this.isEditing = true
      this.editingId = row[this.primaryKey]
    },

    deleteRow(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.tableData = this.tableData.filter(row => row[this.primaryKey] !== id)
      }
    },

    cancelEdit() {
      this.resetForm()
    }
  },
  mounted() {
    this.loadTableData()
  }
}
</script>

<style scoped>
.hello {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.table-selector {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 10px;
  min-width: 200px;
}

.message {
  padding: 15px;
  margin: 20px 0;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}

.loading {
  background-color: #e3f2fd;
  color: #1565c0;
  border: 1px solid #bbdefb;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.data-table {
  margin-bottom: 30px;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-height: 500px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  font-size: 14px;
}

th {
  background-color: #2c3e50;
  color: white;
  font-weight: bold;
  position: sticky;
  top: 0;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

tr:hover {
  background-color: #e9ecef;
}

.actions {
  white-space: nowrap;
}

.form-section {
  border: 1px solid #ddd;
  padding: 25px;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin-top: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #2c3e50;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.form-actions {
  margin-top: 25px;
  text-align: center;
}

button {
  padding: 10px 20px;
  margin: 0 5px;
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

button:active {
  transform: translateY(0);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #34495e;
  margin-bottom: 15px;
}

h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}
</style>