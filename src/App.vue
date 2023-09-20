<template>

  <section>
    <Navbar/>
    <router-view></router-view>
    <Foooter/>
  </section>

</template>

<script>
import Navbar from './components/Navbar.vue'
import Foooter from './components/Foooter.vue'
export default {
  name: 'App',
  components: {
    Navbar,
    Foooter,
  }
}
</script>

<style>

</style>