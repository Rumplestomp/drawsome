<template>
  <div class="hello">
    <mdbContainer>
      <h1>Drawesome</h1>
      <ImageUpload
        :backgroundImage=backgroundImage
        v-on:update:backgroundImage="backgroundImage = $event"
      >
        <div slot="activator">
          <button>Yeet it here boi</button>
        </div>
      </ImageUpload>
    </mdbContainer>

    <mdbContainer>
      <mdbRow>
        <mdbCol col=10>
          <Canvass
            :yeet=canvDefault
            :backgroundImage=backgroundImage
            :layerData=layerData
            v-on:update:defaultConfigKonva="canvasConfig = $event"
          />
        </mdbCol>
        <!-- ADD SIDEBAR COMPONENT FOR VIEWING LAYERS -->
        <mdbCol col=2>
          <LayerSideBar :layerData=layerData :canvasConfig="canvasConfig">LOL</LayerSideBar>
        </mdbCol>
      </mdbRow>
    </mdbContainer>

  </div>
</template>

<script>
// MDB STYLING IMPORTS //
import mdbContainer from 'mdbvue/lib/components/mdbContainer';
import mdbRow from 'mdbvue/lib/components/mdbRow';
import mdbBtn from 'mdbvue/lib/components/mdbBtn';
import mdbCol from 'mdbvue/lib/components/mdbCol';
// LOCAL IMPORTS //
import Canvass from './Canvass';
import ImageUpload from './ImageUpload';
import LayerSideBar from './sidebar/LayerSideBar';
import CanvasLayer from '../models/layer';

export default {
  name: 'HelloWorld',
  components: {
    // LOCAL COMPONENTS
    Canvass,
    ImageUpload,
    LayerSideBar,
    // MDB STYLING COMPONENTS
    mdbContainer,
    mdbRow,
    mdbBtn,
    mdbCol,
  },
  data() {
    return {
      canvDefault: 'This just some text passed to the Canvass component',
      backgroundImage: null, // HARDCODE-ish, remove!
      layerData: [],
      canvasConfig: null,
    };
  },
  created() {
    /** HARDCODE TESTING STUFF */
    let x = new CanvasLayer({
      isBackground: true,
      fill: 'red',
      x: 50,
      y: 50,
    });
    x.createRegularPolygon();
    this.layerData.push(x);
    let x2 = new CanvasLayer({
      isBackground: true,
      fill: 'blue',
      x: 500,
      y: 500,
    });
    x2.createRegularPolygon();
    this.layerData.push(x2);
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
