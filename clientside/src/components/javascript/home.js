export default {
  name: 'HelloWorld',
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
          throw new Error(`File ${this.selectedTable}.csv not found`)
        }
        
        const csvText = await response.text()
        this.tableData = this.parseCSV(csvText)
        this.resetForm()
        
        if (this.tableData.length === 0) {
          this.error = 'No data found in CSV file'
        }
        
      } catch (error) {
        console.error('Error loading data:', error)
        this.error = `Error: ${error.message}. Make sure ${this.selectedTable}.csv exists in public/data/ folder`
        this.tableData = []
      } finally {
        this.loading = false
      }
    },

    parseCSV(csvText) {
      const lines = csvText.split('\n').filter(line => line.trim() !== '')
      
      if (lines.length === 0) return []
      
      const headers = lines[0].split(',').map(header => header.trim())
      
      return lines.slice(1).map((line) => {
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
      if (confirm('Are you sure you want to delete this record?')) {
        this.tableData = this.tableData.filter(row => row[this.primaryKey] !== id)
      }
    },

    cancelEdit() {
      this.resetForm()
    },

    exportToCSV() {
      if (this.tableData.length === 0) return
      
      const headers = this.columns
      const csvContent = [
        headers.join(','),
        ...this.tableData.map(row => 
          headers.map(header => `"${row[header] || ''}"`).join(',')
        )
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${this.selectedTable}_export.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    },

    importFromCSV(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const csvText = e.target.result
        this.tableData = this.parseCSV(csvText)
        this.resetForm()
      }
      reader.readAsText(file)
    }
  },
  watch: {
    tableData: {
      handler(newData) {
        console.log(`Table ${this.selectedTable} updated:`, newData.length, 'records')
      },
      deep: true
    }
  },
  mounted() {
    this.loadTableData()
  }
}