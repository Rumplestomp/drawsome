<template>
    <div class="LayerSideBar">
      <mdbContainer>
        <mdbRow v-bind:key="layer.z" v-for="layer in layerData">
          <SideBarItem :layerItem="layer" :canvasConfig="canvasConfig"></SideBarItem>
        </mdbRow>
      </mdbContainer>

    </div>
</template>

<script>
// MDB STYLING IMPORTS
import mdbContainer from 'mdbvue/lib/components/mdbContainer';
import mdbRow from 'mdbvue/lib/components/mdbRow';
import mdbBtn from 'mdbvue/lib/components/mdbBtn';
// LOCAL IMPORTS
import SideBarItem from './SideBarItem';

export default {
  name: 'LayerSideBar',
  components: {
    mdbContainer,
    mdbRow,
    mdbBtn,
    // LOCAL COMPONENTS
    SideBarItem,
  },
  props: ['layerData', 'canvasConfig'],
};
</script>

<style scoped>
  .LayerSideBar{
    background-color: orange;
  }
</style>
