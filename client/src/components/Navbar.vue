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
          <mdbDropdownToggle tag="a" navLink slot="toggle" waves-fixed>Sign in</mdbDropdownToggle>
          <form>
            <mdbInput type="text" class="text-white" placeholder="Search" aria-label="Search" label navInput/>
          </form>
          <!-- <mdbDropdownMenu>
            <mdbDropdownItem>Action</mdbDropdownItem>
            <mdbDropdownItem>Another action</mdbDropdownItem>
            <mdbDropdownItem>Something else here</mdbDropdownItem>
          </mdbDropdownMenu> -->
      </mdbDropdown>
    </mdbNavbar-toggler>
  </mdbNavbar>
</template>
<script>
import { mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbDropdown, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbDropdownItem } from 'mdbvue';

export default {
  name: 'Navbar',
  components: {
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavbarToggler,
    mdbNavbarNav,
    mdbNavItem,
    mdbDropdown,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbInput,
    mdbDropdownItem,
  },
};
</script>
<style scoped>

</style>
