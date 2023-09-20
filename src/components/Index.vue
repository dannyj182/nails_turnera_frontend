<template>

  <div class="jumbotron mb-0">
    <div class="d-flex flex-column bd-highlight p-1 border border-secondary rounded">
      <div v-show="!this.$store.state.isLogin">
        <h5>Bienvenido/a</h5>
        <p>Lo que estás viendo en este momento es mi primera web app, sepa disculparme si consigue errores de novato =)</p>
        <p>Mi fuerte no es el Front-end, como se puede observar...</p>
        <p>El objetivo de ésta aplicación es la de llevar el control de los turnos para una manicurista.</p>
        <p>El Front-end está hecho con Vue.js, el Backend con Node.js y Express.js, la DB es MongoDB.</p>
        <p>Para loguearse puede usar éstas credenciales:</p>
        <p class="mb-0">Email => dannyj182@gmail.com</p>
        <p>Contraseña => Danny123</p>
      </div>
      <div v-show="this.$store.state.isLogin">
        <p class="mb-0">Le invito a recorrer cada una de las opciones que están en el menú de 
          la parte superior para que pueda conocer las funcionalidades desarrolladas.
        </p>
      </div>
    </div>
  </div>

</template>

<script>
  export default  {
    name: 'src-components-index',
    props: [],
    mounted () {
      if(this.$store.state.isLogin){
        this.$store.dispatch('lastActivity')
      }
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
