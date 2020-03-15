<template>
    <div class="canvass">
        <h2>This is a Canvass component</h2>
        <p>{{ yeet }}</p>
        <!-- <div class="canvas-border">
            <canvas id="main-canvass" v-bind:height=canvHeight v-bind:width=canvWidth></canvas>
        </div> -->
        <div>
            <!-- RELOAD CONFIGKONVA (watch) BASED ON HEIGHT WIDTH  -->
            <v-stage class="mainCanvas" ref='stage' :config='defaultConfigKonva'>
                <!-- OPTIONAL BACKGROUND IMAGE LAYER (RESIZES CANVAS)-->
                <v-layer ref="background-image" v-if="backgroundImage">
                  <v-image v-bind:config="{
                    image: backgroundImageLayer,
                  }">
                  </v-image>
                </v-layer>
                <!-- SINGLE TEST LAYER WITH MANY SHAPES -->
                <v-layer ref='layer'>
                  <v-regular-polygon
                    v-for="item in list"
                    :key=item.Id
                    :config="{
                      x: item.x,
                      y: item.y,
                      rotation: item.rotation,
                      scaleX: item.scale,
                      scaleY: item.scale,
                      sides: item.sides,
                      stroke: item.stroke,
                      strokeWidth: item.strokeWidth,
                      draggable: false,
                      opacity: 0.75,
                      radius: item.strokeWidth
                    }"
                  />
                </v-layer>
                <!-- END TEST LAYER -->
            </v-stage>
        </div>
    </div>
</template>
<script>
const colours = ['red', 'blue', 'teal', 'gold', 'grey', 'purple']; // temp shit
const maxSides = 7;
const minSides = 3;
export default {
  name: 'Canvass',
  props: ['yeet', 'backgroundImage'],
  data: () => ({
    // need list of graphic layers in the canvas
    list: [],
    // dragItemId: null
    // default height and width
    defaultConfigKonva: {
      width: 1280,
      height: 720,
    },
  }),

  // this is all placeholder shits.
  mounted() {
    for (let i = 0; i < 20; i += 1) {
      this.list.push({
        id: Math.round(Math.random() * 100000),
        x: Math.random() * parseInt(this.defaultConfigKonva.width, 10),
        y: Math.random() * parseInt(this.defaultConfigKonva.height, 10),
        rotation: Math.random() * 180,
        scale: (Math.random() * (0.5)) + 0.5, // gets a random float between 0.5 and 1.0
        // gets a random color from the list
        stroke: colours[Math.round(Math.random() * colours.length)],
        strokeWidth: 35,
        // gets a random number of sides for the shape
        sides: Math.round((Math.random() * (maxSides - minSides)) + minSides),
      });
    }
    this.list.forEach((item) => {
      // console.log(this.configKonva.width);
      // console.log(item.id);
    });
  },

  computed: {
    backgroundImageLayer() {
      // console.log('backgroundImageLayer change in canvas component');
      if (!this.backgroundImage) {
        return null;
      }
      const imageURL = URL.createObjectURL(this.backgroundImage);
      const img = new window.Image();
      img.src = imageURL;
      img.onload = () => {
        this.setKonvaConfig({ width: img.width, height: img.height });
      };
      return img;
    },
  },
  methods: {
    setKonvaConfig(config) {
      this.defaultConfigKonva = config;
    },
  },
};
</script>
<style scoped>
    .canvass{
        border: 3px solid red;
    }
    .mainCanvas{
      border: 3px solid teal;
    }
</style>
