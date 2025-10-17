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
      <h2>Table: {{ selectedTable }} ({{ tableData.length }} Loading)</h2>
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
          <input
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

<script src="../javascript/home.js"></script>
<style scoped src="../css/home.css"></style>