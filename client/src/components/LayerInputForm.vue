<template>
  <div class="LayerInputForm">
    <mdb-dropdown>
    <mdb-dropdown-toggle slot="toggle">Add Layer</mdb-dropdown-toggle>
    <mdb-dropdown-menu>
      <mdb-dropdown-item v-on:click="addNewLayer('RegularPolygon')">New RegularPolygon Layer</mdb-dropdown-item>
      <mdb-dropdown-item v-on:click="addNewLayer('Text')">New Text Layer</mdb-dropdown-item>
      <!-- <div class="dropdown-divider"></div> -->
    </mdb-dropdown-menu>
  </mdb-dropdown>
  </div>
</template>
<script>
// MDB STYLING IMPORTS
import mdbDropdown from 'mdbvue/lib/components/mdbDropdown';
import mdbDropdownItem from 'mdbvue/lib/components/mdbDropdownItem';
import mdbDropdownMenu from 'mdbvue/lib/components/mdbDropdownMenu';
import mdbDropdownToggle from 'mdbvue/lib/components/mdbDropdownToggle';

import CanvasLayer from '../models/layer';

export default {
  name: 'LayerInputForm',
  components: {
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
  },
  methods: {
    // method used for onclick menu items
    addNewLayer(layerType) {
      const layer = new CanvasLayer();
      switch (layerType) {
        case 'RegularPolygon':
          layer.createRegularPolygon();
          break;
        case 'Text':
          layer.createText();
          break;
        default:
      }
      if (layer.layerObject) {
        this.$emit('submit:newLayer', layer);
      }
    },
  },
};
</script>
<style scoped>

</style>
