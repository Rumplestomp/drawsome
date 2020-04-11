<template>
  <div class="hello">
    <Navbar/>
    <mdbContainer class="mb-5">
      <!-- <h1>Drawesome</h1> -->
      <!-- <ImageUpload
        :backgroundImage=backgroundImage
        v-on:update:backgroundImage="backgroundImage = $event"
      >
        <div slot="activator">
          <mdbBtn>Set Background Image</mdbBtn>
        </div>
      </ImageUpload> -->
    </mdbContainer>

    <mdbContainer fluid>
      <mdbRow class="justify-content-around">
        <mdbCol col=9>
          <mdbRow class="mb-2">
            <mdbCol md=3>
            <ImageUpload
              :backgroundImage=backgroundImage
              v-on:update:backgroundImage="backgroundImage = $event"
            >
              <div slot="activator">
                <mdbBtn>Set Background Image</mdbBtn>
              </div>
            </ImageUpload>
            </mdbCol>

            <mdbCol offsetMd=4 md=3>
            <mdbBtn v-on:click="downloadCanvasImage('canvasImage.png')">Download Image</mdbBtn>
            </mdbCol>

            <mdbCol md=2>
              <mdb-btn color="default" @click.native="collaborateModal=true">Collaborate</mdb-btn>
              <!-- Modal for collaboration button -->
              <mdb-modal :show="collaborateModal" @close="collaborateModal = false">
                <mdb-modal-header class="text-center">
                  <mdb-modal-title tag="h4" bold class="w-100">Collaboration</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body class="mx-3 grey-text">
                  <mdb-btn color="" @click="peerHost">Start Session</mdb-btn>
                  <p v-if="collabCode">Your Collab code: {{collabCode}}</p>
                  <mdb-input label="Collab Code" icon="lock" type="text"/>
                </mdb-modal-body>
              </mdb-modal>
            </mdbCol>

          </mdbRow>
          <mdbCard>
            <Canvass
              ref="canvass"
              :yeet=canvDefault
              :backgroundImage=backgroundImage
              :layerData=layerData
              v-on:update:defaultConfigKonva="canvasConfig = $event"
            />
          </mdbCard>
        </mdbCol>
        <!-- LAYER INPUT MENU + SIDEBAR COMPONENT FOR VIEWING LAYERS -->
        <mdbCol col="3" class="pl-5">
          <LayerInputForm v-on:submit:newLayer="pushLayer($event)"></LayerInputForm>
          <div class="pb-3"/>
          <LayerSideBar
            :layerData=layerData
            :canvasConfig="canvasConfig"
          />
        </mdbCol>
      </mdbRow>
    </mdbContainer>

  </div>
</template>

<script>
// UTILITY IMPORTS //
// import Peer from 'simple-peer';
import io from 'socket.io-client';
import SimpleSignalClient from 'simple-signal-client';
// MDB STYLING IMPORTS //
import mdbContainer from 'mdbvue/lib/components/mdbContainer';
import mdbRow from 'mdbvue/lib/components/mdbRow';
import mdbBtn from 'mdbvue/lib/components/mdbBtn';
import mdbCol from 'mdbvue/lib/components/mdbCol';
import mdbIcon from 'mdbvue/lib/components/mdbIcon';
import mdbInput from 'mdbvue/lib/components/mdbInput';
import mdbCard from 'mdbvue/lib/components/mdbCard';
import mdbModal from 'mdbvue/lib/components/mdbModal';
import mdbModalBody from 'mdbvue/lib/components/mdbModalBody';
import mdbModalHeader from 'mdbvue/lib/components/mdbModalHeader';
import mdbModalTitle from 'mdbvue/lib/components/mdbModalTitle';
// LOCAL IMPORTS //
import Canvass from './Canvass';
import ImageUpload from './ImageUpload';
import LayerSideBar from './sidebar/LayerSideBar';
import LayerInputForm from './LayerInputForm';
import Navbar from './Navbar';


export default {
  name: 'MainPage',
  components: {
    // LOCAL COMPONENTS
    Canvass,
    ImageUpload,
    LayerSideBar,
    LayerInputForm,
    Navbar,
    // MDB STYLING COMPONENTS
    mdbContainer,
    mdbRow,
    mdbBtn,
    mdbCol,
    mdbIcon,
    mdbCard,
    mdbInput,
    mdbModal,
    mdbModalBody,
    mdbModalHeader,
    mdbModalTitle,
  },
  data() {
    return {
      canvDefault: 'This just some text passed to the Canvass component',
      backgroundImage: null, //   will become a file object!
      layerData: [],
      canvasConfig: null,
      topLayerNum: 0,
      collaborateModal: false, // used for modal activation
      // WEBSOCKET + WEBRTC //
      collabCode: null,
      selfPeer: null, //      will be the simple-peer object used for webRTC communication
      signalClient: null, //  will be the client for the signaling server, used to set up webRTC connection
    };
  },
  created() {

  },
  methods: {
    pushLayer(layer) {
      layer.setZ(this.topLayerNum);
      this.topLayerNum += 1;
      this.layerData.push(layer);
    },
    // removing layers is handled in the LayerSideBar component

    // method to save canvas image
    downloadCanvasImage(name = 'canvasImage.png') {
      const link = document.createElement('a');
      const canvass = this.$refs.canvass;
      const stage = canvass.$refs.stage;

      link.download = name;
      // stage method to export data to URL
      link.href = stage.getNode().toDataURL();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async peerHost() {
      // Either give user random unique code, or use their username as the id to send to the signaling server
      await this.connectSignalingServer();
      // upon new connections to the host, we send the entire layerData for initialization on the client
      if (!this.selfPeer) {
        this.selfPeer.on('connect', () => {
          this.selfPeer.send(JSON.stringify(this.layerData));
        });
      }
      // this.selfPeer.on('')
      // console.log(Peer.WEBRTC_SUPPORT);
    },
    peerJoin() {
      this.connectSignalingServer();
    },
    connectSignalingServer() {
      if (!this.signalClient) {
        const socket = io(window.location);
        this.signalClient = new SimpleSignalClient(socket);
        // the action to take when discovered by signaling server
        this.signalClient.on('discover', async (allIds) => { // depends on wtfs going on
          const id = allIds[0];
          this.selfPeer = await this.signalClient.connect(id);
        });
        // the action to take when a request to from someone else to join you occurs
        this.signalClient.on('request', async (request) => { // depends on wtfs going on
          this.selfPeer = await request.accept();
        });
      }
    },
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
.hello{
  background-color: rgb(244,244,244);
  height: 100vh;
}
</style>
