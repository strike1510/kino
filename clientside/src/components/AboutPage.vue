<template>
    <div class="about">
        <h1>About our Cinema Application</h1>
        <p>This application allows managing a database of movies, actors, directors and reviews.</p>
        <p>Features:</p>
        <ul>
            <li>View movie data</li>
            <li>Manage directors and actors</li>
            <li>Read and write reviews</li>
            <li>Edit the database</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'AboutView'
}
</script>

<style scoped>
.about {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    text-align: left;
}

h1 {
    color: #2c3e50;
    margin-bottom: 20px;
}

p {
    margin-bottom: 10px;
    line-height: 1.6;
}

ul {
    margin-left: 20px;
}

li {
    margin-bottom: 8px;
    line-height: 1.5;
}
</style>