<template>
    <mdbCard class="LayerSideBar" card-dark>
      <!-- <mdbContainer> -->
        <mdbCard>
          <mdbCardTitle class="m-auto pt-2">Layers</mdbCardTitle>
          <hr>
          <div class="m-auto" v-bind:key="layer.z" v-for="layer in layerData">
            <SideBarItem :layerItem="layer" :canvasConfig="canvasConfig"></SideBarItem>
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
};
</script>

<style scoped>
  .LayerSideBar{
    padding: 1em 0.75em;
    /* border-radius: 0.5em; */
    background-color: orange;
  }
</style>
