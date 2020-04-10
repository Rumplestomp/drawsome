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
          <mdbDropdownToggle tag="a" navLink slot="toggle" waves-fixed>Profile</mdbDropdownToggle>
          <!-- <form>
            <mdbInput type="text" class="text-white" placeholder="Search" aria-label="Search" label navInput/>
          </form> -->
          <mdbDropdownMenu right>
            <mdbDropdownItem @click.native="authenticateModal=true">Sign In</mdbDropdownItem>
            <div class="dropdown-divider"></div>
            <mdbDropdownItem>Register</mdbDropdownItem>
          </mdbDropdownMenu>
      </mdbDropdown>
    </mdbNavbar-toggler>
    <!-- Modal for sign in -->
            <mdb-modal :show="authenticateModal" @close="authenticateModal = false">
                <mdb-modal-header class="text-center">
                  <mdb-modal-title tag="h4" bold class="w-100">Sign in</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body class="mx-3 grey-text">
                  <!-- <mdb-btn color="" @click="peerHost">Start Session</mdb-btn>
                  <p v-if="collabCode">Your Collab code: {{collabCode}}</p>
                  <mdb-input label="Collab Code" icon="lock" type="text"/> -->
                  <mdb-input type="text" label="Username"/>
                  <mdb-input type="password" label="Password"/>
                  <div class="text-center">
                    <mdb-btn type="submit">Sign In</mdb-btn>
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
      authenticateModal: false,
    };
  },
};
</script>
<style scoped>

</style>
