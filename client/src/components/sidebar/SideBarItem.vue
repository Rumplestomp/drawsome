<template>
  <div
  class="SideBarItem"
  :class="opened ? 'opened' : ''"
  >
    <!-- Placeholder stuff needs to go here -->
    <div v-on:click="toggleOpen">{{layerItem.layerType}}</div>
    <div class="itemOptions" v-if="opened">
      <!-- GENERAL SETTINGS -->
      <mdbInput type="number" label="X position" v-model="layerItem.x" :min="0" :max="canvasConfig.width" />
      <mdbInput type="number" label="Y position" v-model="layerItem.y" :min="0" :max="canvasConfig.height"/>
      <mdbInput type="number" label="Scale" v-model="layerItem.scale"  :min="0" :max="100"/>
      <mdbInput type="number" label="Opacity" v-model="layerItem.opacity" :min="0" :max="1" :step='0.01'/>
      <mdbInput type="number" label="Rotation" v-model="layerItem.rotation" :min="0" :max="360"/>
      <mdbInput type="color" label="Fill Colour" v-model="layerItem.fill"/>
      <!-- REGULAR POLYGON SETTINGS -->
      <div v-if="layerItem.layerType == 'RegularPolygon'">
        <mdbInput label="Sides" v-model="layerItem.layerObject.sides"/>
        <mdbInput label="radius" v-model="layerItem.layerObject.radius"/>
      </div>
      <!-- TEXT SETTINGS -->
      <div v-if="layerItem.layerType == 'Text'">
        <mdbInput label="Text" v-model="layerItem.layerObject.text"/>
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
      opened: true,
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
    background-color: #00ddff;
    border: teal;
  }
  .opened{
    background-color: #339999;
  }
  .input:focus {
    box-shadow: 0 1px 0 0 green !important;

    border-bottom: 1px solid green !important;
}
</style>
