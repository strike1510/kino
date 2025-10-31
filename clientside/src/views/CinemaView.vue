<template>
  <div class="cinema">
    <CinemaDatabase />
  </div>
</template>

<script>
import CinemaDatabase from '@/components/vue/Cinema.vue'

export default {
  name: 'CinemaView',
  components: {
    CinemaDatabase
  }
}
</script>