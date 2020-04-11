<template>
  <div class="hello">
    <Navbar/>

    <!-- Vertical Spacing -->
    <mdbContainer class="mb-5">
    </mdbContainer>

    <mdbContainer fluid>
      <mdbRow class="justify-content-around">
        <mdbCol col=9>

          <!-- Buttons Above Canvas -->
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
                  <p class="teal-text" v-if="collabCode && hosting">Your Collab code: <span class="grey-text">{{collabCode}}</span> </p>
                  <mdb-input label="Collab Code" icon="lock" type="text" v-model="joinCode"/>
                  <mdb-btn color="" @click="peerJoin(joinCode)">Join Session</mdb-btn>
                </mdb-modal-body>
              </mdb-modal>
            </mdbCol>
          </mdbRow>

          <!-- Main Canvas Component -->
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
            v-on:update:layer="handleUpdateLayer($event)"
            v-on:delete:layer="handleDeleteLayer($event)"
            :layerData=layerData
            :canvasConfig="canvasConfig"
          />
        </mdbCol>
      </mdbRow>
    </mdbContainer>

  </div>
</template>

<script>
/* eslint-disable no-console */

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
      hosting: false,
      collabCode: null,
      joinCode: '',
      signalClient: null, //  will be the client for the signaling server, used to set up webRTC connection
      allIds: [],
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
      this.hosting = true;
      await this.connectSignalingServer();
      // The unique ID is displayed dynamically, to be able to share with friends
      // console.log(this.connectedPeer.WEBRTC_SUPPORT);
    },
    async peerJoin(id) {
      this.connectSignalingServer();
      await this.signalClient.connect(id);
    },
    // as a host, this code initializes the peer who is connecting to you
    peerInit(peer, host=true) {
      if (host) {
        peer.on('connect', () => {
          // send layer data to peer
          peer.send(JSON.stringify(this.layerData));
        });
      }
      peer.on('data', (data) => {
        this.handleReceiveLayer(data);
      });
    },
    /**
     * Function to connect to the websocket signaling server, and get ones own collaboration code
     *
     * Initializes the following:
     * this.signalClient:   SimpleSignalClient  object
     * this.collabCode:     str                 used for sending invites
     * this.allIds:         str[]               all Ids of users connected to ws signaling server
     *
     * Note that this.signalClient.peers is an array of all connected peers
     */
    connectSignalingServer() {
      if (!this.signalClient) {
        const socket = io('127.0.0.1:3000');
        // const socket = io(`${process.env.HOST}:3000`);
        this.signalClient = new SimpleSignalClient(socket);
        console.log('signalClient.id (before discovery):', this.signalClient.id);
        // the action to take when discovered by signaling server
        this.signalClient.on('discover', async (allIds) => { // depends on wtfs going on
          console.log('client discovery');
          console.log('signalClient.id (after discovery):', this.signalClient.id);
          this.collabCode = this.signalClient.id;
          console.log(JSON.parse(JSON.stringify(allIds)));
          this.allIds = allIds;
        });
        // the action to take when a request to from someone else to join you occurs
        this.signalClient.on('request', async (request) => {
          const { peer } = await request.accept();
          // initialize this peer
          this.peerInit(peer);
        });
        if (this.signalClient) {
          this.signalClient.discover();
        }
      } // end if
    },
    /**
     * Handler used to transmit specific updated layer data.
     */
    handleUpdateLayer(layer) {
      if (this.signalClient) {
        this.signalClient.peers.forEach((peer) => {
          peer.send(layer);
        });
      }
    },
    /**
     * Handler to delete layer based on RTC peer signals
     */
    handleDeleteLayer(z) {
      this.layerData.forEach((layer, index) => {
        if (layer.z === z) {
          this.layerData.splice(index, 1);
        }
      });
    },
    /**
     * Handler to update layerData based on RTC peer signals
     * Replaces the layer with matching z value.
     * If there is no matching z value, it is assumed that the layer is to be added
     */
    handleReceiveLayer(layer) {
      this.layerData.forEach((curLayer, index) => {
        if (curLayer.z === layer.z) {
          this.$set(this.layerData, index, layer);
        } else {
          this.pushLayer(layer);
        }
      });
    },
  }, // end methods
  computed: {
    // used for keeping track of layerData before and after changes
    computedLayerData() {
      return Object.assign({}, this.layerData);
    },
  },
  watch: {
    computedLayerData: {
      deep: true,
      handler(newval, oldval) {
        console.log(JSON.parse(JSON.stringify(newval)), JSON.parse(JSON.stringify(oldval)));
      },
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
