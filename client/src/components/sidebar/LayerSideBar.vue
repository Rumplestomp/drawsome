<template>
    <mdbCard class="LayerSideBar" card-dark>
      <!-- <mdbContainer> -->
        <mdbCard>
          <mdbCardTitle class="m-auto pt-2">Layers</mdbCardTitle>
          <hr>
          <div v-bind:key="layer.z" v-for="layer in reversedLayerData">
            <SideBarItem
              v-on:delete:layer="handleDeleteLayer($event)"
              v-on:change:layer="handleLiftLayer($event)"
              v-on:update:layer="handleUpdateLayer($event)"
              :layerItem="layer"
              :canvasConfig="canvasConfig"
              >
            </SideBarItem>
          </div>
        </mdbCard>
      <!-- </mdbContainer> -->
    </mdbCard>
</template>

<script>
// MDB STYLING IMPORTS
import mdbContainer from 'mdbvue/lib/components/mdbContainer';
import mdbRow from 'mdbvue/lib/components/mdbRow';
import mdbBtn from 'mdbvue/lib/components/mdbBtn';
import mdbCard from 'mdbvue/lib/components/mdbCard';
import mdbCardTitle from 'mdbvue/lib/components/mdbCardTitle';
// LOCAL IMPORTS
import SideBarItem from './SideBarItem';

export default {
  name: 'LayerSideBar',
  components: {
    mdbContainer,
    mdbRow,
    mdbBtn,
    mdbCard,
    mdbCardTitle,
    // LOCAL COMPONENTS
    SideBarItem,
  },
  props: ['layerData', 'canvasConfig'],
  computed: {
    reversedLayerData() {
      return this.layerData.slice().reverse();
    },
  },
  methods: {
    handleDeleteLayer(layer) {
      const z = layer.z;
      for (let i = 0; i < this.layerData.length; i += 1) {
        if (z === this.layerData[i].z) {
          this.layerData.splice(i, 1);
          // tell parent component to handle deletion of the layer
          this.$emit('delete:layer', z);
        }
      }
    },
    handleLiftLayer(event) {
      const layer = event.layer;
      const increment = event.incr;
      for (let i = 0; i < this.layerData.length; i += 1) {
        if (this.layerData[i].z === layer.z) {
          const oldZ = this.layerData[i].z;
          if (increment === 1 && i === 0) {
            // if there is no layer below the current one, do nothing
            return null;
          } else if (increment === -1 && i === this.layerData.length - 1) {
            // if there is no layer above the current one, do nothing
            return null;
          }
          // swap z values of layers
          const newZ = this.layerData[i - increment].z;

          this.$set(this.layerData[i], 'z', newZ);
          this.$set(this.layerData[i - increment], 'z', oldZ);
          // swap postitions in array, but keep data reactive
          this.layerData.splice(Math.min(i, i - increment), 2, this.layerData[Math.max(i, i - increment)], this.layerData[Math.min(i, i - increment)]);
        }
      }
    },
    /**
     * Function used to send update data to parent component for RTC transmission
     * Has no effect if user is not in a collaboration session.
     */
    handleUpdateLayer(event) {
      this.$emit('update:layer', event);
    },
  },
};
</script>

<style scoped>
  .LayerSideBar{
    padding: 0.50vw 0.50vw;
    background-color: orange;
  }
</style>
