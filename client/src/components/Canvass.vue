<template>
    <div class="canvass pb-2 px-2">
        <h2>This is a Canvass component</h2>
        <p>{{ yeet }}</p>
        <!-- <div class="canvas-border">
            <canvas id="main-canvass" v-bind:height=canvHeight v-bind:width=canvWidth></canvas>
        </div> -->
        <div>
            <!-- RELOAD CONFIGKONVA (watch) BASED ON HEIGHT WIDTH  -->
            <v-stage
              class="mainCanvas"
              ref='stage'
              :config='defaultConfigKonva'
              :style="{ width: this.defaultConfigKonva.width+1+'px', height: this.defaultConfigKonva.height+1+'px' }"
            >
                <!-- OPTIONAL BACKGROUND IMAGE LAYER (RESIZES CANVAS)-->
                <v-layer ref="background-image" v-if="backgroundImage">
                  <v-image v-bind:config="{
                    image: backgroundImageLayer,
                  }">
                  </v-image>
                </v-layer>
                <!-- DYNAMIC LAYER RENDERING -->

                <v-layer :key="layer.z" v-for="layer in layerData">
                  <v-regular-polygon
                    v-if="layer.layerType == 'RegularPolygon'"
                    @dragstart="handleDragStart(layer)"
                    @dragend="handleDragEnd(layer)"
                    :config="{
                      draggable: true,
                      x: layer.x,
                      y: layer.y,
                      rotation: layer.rotation,
                      scaleX: layer.scale,
                      scaleY: layer.scale,
                      fill: layer.fill,
                      opacity: layer.opacity,
                      // polygon specifics
                      radius: layer.layerObject.radius,
                      sides: layer.layerObject.sides
                    }"
                  />
                  <v-text
                    v-if="layer.layerType == 'Text'"
                    @dragstart="handleDragStart(layer)"
                    @dragend="handleDragEnd(layer)"
                    :config="{
                      draggable: true,
                      x: layer.x,
                      y: layer.y,
                      rotation: layer.rotation,
                      scaleX: layer.scale,
                      scaleY: layer.scale,
                      fill: layer.fill,
                      opacity: layer.opacity,
                      // text specifics
                      text: layer.layerObject.text
                    }"
                  />
                </v-layer>
            </v-stage>
        </div>
    </div>
</template>
<script>
export default {
  name: 'Canvass',
  props: {
    yeet: String,
    backgroundImage: String,
    layerData: Array,
  },
  data: () => ({
    // need list of graphic layers in the canvas
    list: [],
    // default height and width
    defaultConfigKonva: {
      width: 1280,
      height: 720,
    },
    curDraggingLayer: { offsetX: 0, offsetY: 0 },
  }),

  created() {
    // initial emit of config settings for parent component to grab
    this.$emit('update:defaultConfigKonva', this.defaultConfigKonva);
  },
  // this is all placeholder shits.
  mounted() {

  },

  computed: {
    backgroundImageLayer() {
      if (!this.backgroundImage) {
        return null;
      }
      // const imageURL = URL.createObjectURL(this.backgroundImage);
      const img = new window.Image();
      img.src = `http://127.0.0.1:3000/api/image/${this.backgroundImage}`;
      img.onload = () => {
        this.setKonvaConfig({ width: img.width, height: img.height });
      };
      // TODO: move all existing layers to within new canvas
      return img;
    },
  },
  methods: {
    setKonvaConfig(config) {
      this.defaultConfigKonva = config;
      this.$emit('update:defaultConfigKonva', config);
    },
    handleDragStart(layer) {
      // GET the position on the layer that the mouse grabs
      const mousePos = this.$refs.stage.getNode().getPointerPosition();
      this.curDraggingLayer.offsetX = layer.x - parseInt(mousePos.x, 10);
      this.curDraggingLayer.offsetY = layer.y - parseInt(mousePos.y, 10);
    },
    handleDragEnd(layer) {
      const mousePos = this.$refs.stage.getNode().getPointerPosition();
      this.$set(layer, 'x', parseInt(mousePos.x, 10) + this.curDraggingLayer.offsetX);
      this.$set(layer, 'y', parseInt(mousePos.y, 10) + this.curDraggingLayer.offsetY);
    },
  },
};
</script>
<style scoped>
    .canvass{
        border: 3px solid rgba(250,158,58, 0.5);
        overflow:scroll;
    }
    .wrapper{
      border: 3px solid teal;
      margin: 3px;
    }
    .mainCanvas{
      /* border: solid teal 1px; */
      box-shadow: 0px 0px 5px 2px #999999;
    }
</style>
