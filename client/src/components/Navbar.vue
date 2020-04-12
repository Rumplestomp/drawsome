<template>
  <mdbNavbar color="default-color" dark>
    <mdbNavbarBrand href="#">
      Drawesome
    </mdbNavbarBrand>
    <mdbNavbar-toggler>
      <mdbNavbar-nav>
        <mdbNavItem href="#" active>Home</mdbNavItem>
        <mdbNavItem href="#" disabled>New Project</mdbNavItem>
      </mdbNavbar-nav>
      <!-- ADD SIGNIN HERE -->
      <mdbDropdown tag="li" class="nav-item">
          <mdbDropdownToggle v-if="authUsername"  tag="a" navLink slot="toggle" waves-fixed>{{authUsername}}</mdbDropdownToggle>
          <mdbDropdownToggle v-else               tag="a" navLink slot="toggle" waves-fixed>Profile</mdbDropdownToggle>
          <!-- <form>
            <mdbInput type="text" class="text-white" placeholder="Search" aria-label="Search" label navInput/>
          </form> -->
          <mdbDropdownMenu right>
            <div v-if="authUsername">
              <mdbDropdownItem @click.native="signout">Sign Out</mdbDropdownItem>
            </div>
            <div v-else>
              <mdbDropdownItem @click.native="registering=false; authenticateModal=true">Sign In</mdbDropdownItem>
              <div class="dropdown-divider"></div>
              <mdbDropdownItem @click.native="registering=true; authenticateModal=true">Register</mdbDropdownItem>
            </div>
          </mdbDropdownMenu>
      </mdbDropdown>
    </mdbNavbar-toggler>
    <!-- Modal for sign in -->
            <mdb-modal :show="authenticateModal" @close="authenticateModal = false">
                <mdb-modal-header class="text-center">
                  <mdb-modal-title v-if="registering" tag="h4" bold class="w-100">Register</mdb-modal-title>
                  <mdb-modal-title v-else             tag="h4" bold class="w-100">Sign In</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body class="mx-3 grey-text">
                  <!-- <mdb-btn color="" @click="peerHost">Start Session</mdb-btn>
                  <p v-if="collabCode">Your Collab code: {{collabCode}}</p>
                  <mdb-input label="Collab Code" icon="lock" type="text"/> -->
                  <mdb-input type="text"      label="Username" v-model="user"/>
                  <mdb-input type="password"  label="Password" v-model="pass"/>
                  <!-- Error dialogs -->
                  <p v-if="invalidCreds" class="red-text">{{ invalidCreds }}</p>
                  <p v-else-if="invalidRegister" class="red-text">{{ invalidRegister }}</p>

                  <div class="text-center">
                    <mdb-btn v-if="registering" type="submit" @click="register">Sign Up</mdb-btn>
                    <mdb-btn v-else             type="submit" @click="signin">Sign In</mdb-btn>
                  </div>
                </mdb-modal-body>
              </mdb-modal>
  </mdbNavbar>
</template>
<script>
import { mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbBtn, mdbDropdownItem } from 'mdbvue';
import mdbModal from 'mdbvue/lib/components/mdbModal';
import mdbModalBody from 'mdbvue/lib/components/mdbModalBody';
import mdbModalHeader from 'mdbvue/lib/components/mdbModalHeader';
import mdbModalTitle from 'mdbvue/lib/components/mdbModalTitle';

export default {
  name: 'Navbar',
  components: {
    mdbInput,
    mdbBtn,
    // NAVBAR
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavbarToggler,
    mdbNavbarNav,
    mdbNavItem,
    // DROPDOWNS
    mdbDropdown,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbDropdownItem,
    // MODALS
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalTitle,
  },
  data() {
    return {
      /** MODAL DATA */
      authenticateModal: false,
      registering: false,
      invalidCreds: false,
      invalidRegister: false,
      /** FORM DATA */
      user: '',
      pass: '',
      authUsername: '',
    };
  },
  created() {
    // intialize username if they are signed in
    this.updateAuthData();
  },
  methods: {
    register() {
      fetch('http://127.0.0.1:3000/api/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: this.user, password: this.pass }),
      }).then((response) => {
        if (response.status >= 400) {
          throw response.json();
        }
        this.invalidRegister = false;
        this.invalidCreds = false;
        // close modal upon signing in
        this.authenticateModal = false;
        // console.log('response:', response);
      }).catch(function (err) {
        this.invalidRegister = err.toString();
      }).finally(() => {
        this.updateAuthData();
      });
    },
    signin() {
      fetch('http://127.0.0.1:3000/api/signin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: this.user, password: this.pass }),
      }).then((response) => {
        if (response.status >= 400) {
          throw response.json();
        }
        this.invalidRegister = false;
        this.invalidCreds = false;
        // close modal upon signing in
        this.authenticateModal = false;

        // console.log('response:', response);
      }).catch(function (err) {
        this.invalidCreds = err.toString();
      }).finally(() => {
        this.updateAuthData();
      });
    },
    signout() {
      fetch('http://127.0.0.1:3000/api/signout', {
        method: 'GET',
        credentials: 'include',
      }).finally(() => {
        this.updateAuthData();
      });
    },
    updateAuthData() {
      this.user = '';
      this.pass = '';
      this.authUsername = this.$cookies.get('username') || '';
    },
  },
};
</script>
<style scoped>

</style>
