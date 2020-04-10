<template>
  <mdbContainer fluid class="SideBarItem">
    <mdbRow :class=" opened ? 'orangeBackground SideBarTitle pt-1' : 'SideBarTitle pt-1'">
      <mdbCol class="pr-0" v-on:click.native='toggleOpen'>
        <v-stage :config="layerIconConfig" class="layerIconCanvas" :ref="layerItem.z+'_layerIcon'">
          <v-layer>
            <!-- Consider adding transparent background image thingy grey checkerboard whatever here -->
            <v-regular-polygon
              v-if="layerItem.layerType == 'RegularPolygon'"
              :config="{
                draggable: false,
                x: layerIconConfig.width  / 2, // layer.x,
                y: layerIconConfig.height / 2, // layer.y,
                rotation: layerItem.rotation,
                scaleX: Math.min(layerItem.scale/layerItem.scale, layerItem.scale/layerItem.scale), // layer.scale,
                scaleY: Math.min(layerItem.scale/layerItem.scale, layerItem.scale/layerItem.scale), // layer.scale,
                fill: layerItem.fill,
                opacity: layerItem.opacity,
                // polygon specifics
                radius: 12, // layer.layerObject.radius,
                sides: layerItem.layerObject.sides
              }"
            />
            <v-text
              v-if="layerItem.layerType == 'Text'"
              :config="{
                draggable: false,
                x: 0, // layer.x,
                y: layerIconConfig.height / 2, // layer.y,
                rotation: layerItem.rotation,
                scaleX: Math.min(layerItem.scale/layerItem.scale, layerItem.scale/layerItem.scale), // layerItem.scale,
                scaleY: Math.min(layerItem.scale/layerItem.scale, layerItem.scale/layerItem.scale), // layerItem.scale,
                fill: layerItem.fill,
                opacity: layerItem.opacity,
                // text specifics
                text: layerItem.layerObject.text
              }"
            />
          </v-layer>
        </v-stage>
      </mdbCol>
      <!-- Layer Text -->
      <mdbCol class="px-0" col="5" v-on:click.native='toggleOpen'>
        {{layerItem.layerType}}
      </mdbCol>
      <mdbCol col="1">
        <mdbIcon icon="arrow-up"   class="arrowIcon" v-on:click.native="liftLayer(-1)" ></mdbIcon>
        <mdbIcon icon="arrow-down" class="arrowIcon" v-on:click.native="liftLayer(1)"></mdbIcon>
      </mdbCol>
      <!-- Layer delete button -->
      <mdbCol col="2" v-on:click.native='deleteLayer'>
        <mdbIcon class="deleteLayerIcon p-1" icon="trash-alt"></mdbIcon>
      </mdbCol>
    </mdbRow>

    <mdbRow  class='opened px-3 pb-2 pt-0'>
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
          <input name="text" type="textfield" class="form-control" v-model="layerItem.layerObject.text">
        </div>
      </div>
    </mdbRow>
    <!-- Spacing div -->
    <div class="pb-4"></div>
  </mdbContainer>
</template>
<script>
import mdbRow from 'mdbvue/lib/components/mdbRow';
import mdbCol from 'mdbvue/lib/components/mdbCol';
import mdbContainer from 'mdbvue/lib/components/mdbContainer';
import mdbInput from 'mdbvue/lib/components/mdbInput';
import mdbIcon from 'mdbvue/lib/components/mdbIcon';

export default {
  name: 'SideBarItem',
  props: ['layerItem', 'canvasConfig'],
  components: {
    mdbRow,
    mdbCol,
    mdbContainer,
    mdbInput,
    mdbIcon,
  },
  data() {
    return {
      opened: false,
      layerIconConfig: { width: 40, height: 40 },
    };
  },
  methods: {
    toggleOpen() {
      this.opened = !this.opened;
    },
    deleteLayer() {
      this.$emit('delete:layer', this.layerItem);
    },
    liftLayer(increment) {
      this.$emit('change:layer', { layer: this.layerItem, incr: increment });
    },
  },
};
</script>
<style scoped>
  .SideBarItem{
    /* background-color: #00ddff; */
    border: teal;
  }
  .opened{
    background-color: rgba(235,235,235, 0.7);
  }
  .SideBarTitle{
    /* overflow: wrap; */
    transition: font-weight 0.15s;
    font-weight: unset;
    border-bottom: 2px rgba(222, 222, 222, 0.8) solid;
  }
  .SideBarTitle:hover{
    cursor: pointer;
    font-weight: bold;
  }
  .layerIconCanvas{
    border: 2px rgba(222, 222, 222, 0.8) solid;
  }
  .orangeBackground{
    background-color: rgba(255, 170, 0, 0.8);
  }
  .deleteLayerIcon:hover{
    color: red
  }
  .arrowIcon:hover{
    color: teal;
  }
</style>
<style>
  input:focus {
    box-shadow: 0 1px 0 0 #00bbee !important;
    border-bottom: 1px solid #00bbee !important;
}
</style>
