<template>
  <div class="success-view">
    <h2>Processing Successful</h2>
    <p>Results after processing the uploaded file!</p>

    <!-- Display images in a grid -->
    <div class="image-grid">
      <img v-for="(image, index) in images" :key="index" :src="image" :alt="'Image ' + (index + 1)" />
    </div>
  </div>
</template>

<script>
import image1 from '@/assets/image1.png';
import image2 from '@/assets/image2.png';
import image3 from '@/assets/image3.png';
import image4 from '@/assets/image4.png';

export default {
  name: 'SuccessView',
  data() {
    return {
      images: [image1, image2, image3, image4], // Array of image paths
    };
  },
};
</script>

<style scoped>
.success-view {
  text-align: center;
  margin: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 images per row */
  gap: 15px; /* Space between images */
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd; /* Optional styling */
  border-radius: 5px; /* Optional styling */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Optional shadow */
}
</style>
