<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ImageUpload v-model="avatar" v-bind:backgroundImage=backgroundImage v-on:update:backgroundImage="backgroundImage = $event">
      <div slot="activator">
        <span>Yeet it here boi</span>
      </div>
    </ImageUpload>
    <Canvass v-bind:yeet=canvDefault v-bind:backgroundImage=backgroundImage></Canvass>
  </div>
</template>

<script>
import Canvass from './Canvass';
import ImageUpload from './ImageUpload';

export default {
  name: 'HelloWorld',
  components: {
    Canvass,
    ImageUpload,
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      canvDefault: 'This just some text passed to the Canvass component',
      avatar: null,
      backgroundImage: null,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
