<template>
  <div class="review-view">
    <ReviewPage />
  </div>
</template>

<script>
import ReviewPage from '@/components/vue/review.vue'

export default {
  name: 'ReviewView',
  components: {
    ReviewPage
  }
}
</script>

<style scoped>
.review-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>