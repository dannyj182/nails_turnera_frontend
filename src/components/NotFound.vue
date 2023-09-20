<template>

  <section>
    <div class="jumbotron mb-0">
      <h4>NotFound</h4>
      <p>Haz click en Inicio</p>
    </div>
  </section>

</template>

<script>
  export default  {
    name: 'src-components-not-found',
    props: [],
    mounted () {
      this.$store.dispatch('lastActivity')
    },
    beforeUpdate (){
      if(this.$store.state.isLogin){
        this.$store.dispatch('lastActivity')
      }
    },
    data () {
      return {

      }
    },
    methods: {
      
    },
    computed: {

    }
}
</script>

<style scoped lang="css">

</style>