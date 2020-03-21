<template>
  <div class="SideBarItem" :class="opened ? 'opened' : ''">
    <div class="text-center SideBarTitle pb-1" v-on:click="toggleOpen">
      {{layerItem.layerType}}
      <!-- TODO: Placeholder stuff needs to go here -->
    </div>
    <div class="itemOptions m-auto" v-if="opened">
      <!-- GENERAL SETTINGS -->
      <label  for="x">X Position: {{layerItem.x}}
        <input name="x" type="range" class="custom-range" :min="0" :max="canvasConfig.width" v-model.number="layerItem.x">
      </label>

      <label  for="y">Y Position: {{layerItem.y}}
        <input name="y" type="range" class="custom-range" :min="0" :max="canvasConfig.height" v-model.number="layerItem.y">
      </label>

      <label for="scale">Scale
        <input name="scale" type="number" class="form-control" :min="0" :max="10" v-model.number="layerItem.scale">
      </label>

      <label for="opacity">Opacity: {{layerItem.opacity}}
        <input name="opacity" type="range" class="custom-range" :min="0" :max="1" step='0.01' v-model.number="layerItem.opacity">
      </label>

      <label for="rotation">Rotation: {{layerItem.rotation}}
        <input name="rotation" type="range" class="custom-range" :min="0" :max="360" v-model.number="layerItem.rotation">
      </label>

      <label for="colour">Fill Colour
        <input name="colour" type="color" class="form-control" v-model="layerItem.fill">
      </label>
      <!-- REGULAR POLYGON SETTINGS -->
      <div v-if="layerItem.layerType == 'RegularPolygon'">
        <label  for="sides">Sides</label>
        <input name="sides" type="number" class="form-control" :min="3" :max="360" v-model.number="layerItem.layerObject.sides">
        <label  for="radius">Radius</label>
        <input name="radius" type="number" class="form-control" :min="0" :max="360" v-model.number="layerItem.layerObject.radius">
      </div>
      <!-- TEXT SETTINGS -->
      <div v-if="layerItem.layerType == 'Text'">
        <label  for="text">Text</label>
        <input name="text" type="text" class="form-control" v-model="layerItem.layerObject.text">
      </div>
    </div>
  </div>
</template>
<script>
import mdbRow from 'mdbvue/lib/components/mdbRow';
import mdbInput from 'mdbvue/lib/components/mdbInput';

export default {
  name: 'SideBarItem',
  props: ['layerItem', 'canvasConfig'],
  components: {
    mdbRow,
    mdbInput,
  },
  data() {
    return {
      opened: false,
    };
  },
  methods: {
    toggleOpen() {
      this.opened = !this.opened;
    },
  },
};
</script>
<style scoped>
  .SideBarItem{
    /* background-color: #00ddff; */
    border: teal;
    margin-left: 1em;
    margin-right: 1em;
  }
  .opened{
    background-color: white;
  }
  .SideBarTitle{
    overflow: wrap;
    transition: font-weight 0.15s;
    font-weight: unset;
  }
  .SideBarTitle:hover{
    cursor: pointer;
    font-weight: bold;
  }
</style>
<style>
  input:focus {
    box-shadow: 0 1px 0 0 #00bbee !important;
    border-bottom: 1px solid #00bbee !important;
}
</style>
