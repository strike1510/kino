<template>
  <div class="main-page">
    <h1>Cinema Database Project</h1>
    
    <div class="project-description">
      <p>As part of this project, we chose the theme of cinema. Because we really love movies and we are quite film enthusiasts. We therefore decided to create a database focused on films. To make our movie database better, we want to add much more detailed information about the main subjects: actors and directors. For every director, we will include a special ID, their name, their birth details and nationality, and facts about their career like how many films they made. We will do the same for actors and their nominations. Spectator will therefore be able to make reviews of the films they have seen.</p>
    </div>

    <div class="navigation-links">
      <router-link to="/cinema" class="nav-link">
        <span class="text">Cinema Database</span>
      </router-link>
      
      <router-link to="/about" class="nav-link">
        <span class="text">About Project</span>
      </router-link>
      
      <router-link to="/review" class="nav-link">
        <span class="text">Reviews</span>
      </router-link>
    </div>

    <div class="authors">
      <p>Pierson Macéo ; Berly Yuushi ; Thouraud de Lavignère Hugo</p>
    </div>
  </div>
</template>

<script>
import '../css/Main.css'

export default {
  name: 'MainPage'
}
</script>