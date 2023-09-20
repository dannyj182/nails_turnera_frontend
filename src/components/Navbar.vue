<template>

  <section class="sticky-top">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/index">
        <a class="navbar-brand" href="#">Inicio</a>
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <ul class="navbar-nav text-center " v-if="!$store.state.isLogin">
          <li class="nav-item ">
            <router-link to="/login">
              <a class="nav-link text-light" href="#">Iniciar Sesión</a>
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav" v-else>
          <li class="nav-item">
            <router-link to="/turnos">
              <a class="nav-link" href="#">Turnos</a>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/calendario">
              <a class="nav-link" href="#">Calendario</a>
            </router-link>
          </li>
          <li class="nav-item" v-show="$store.state.currentUser.rol !== 'Cliente'">
            <router-link to="/clientes">
              <a class="nav-link" href="#">Clientes</a>
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" 
            href="#" 
            id="navbarDropdownMenuLink" 
            data-toggle="dropdown" 
            aria-haspopup="true" 
            aria-expanded="false">
            {{ this.$store.state.currentUser.nombre | formatoNombre }}
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <router-link to="/configuracion">
                <a class="dropdown-item" href="#">Configuración</a>
              </router-link>
              <a class="dropdown-item" href="#" @click=desloguearse()>Cerrar Sesión</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </section>
  
</template>

<script>
  export default  {
    name: 'src-components-navbar',
    props: [],
    mounted () {

    },
    beforeUpdate (){
      this.$store.dispatch('lastActivity')
    },
    data () {
      return {

      }
    },
    methods: {
      desloguearse(){
        if(this.$router.currentRoute.path !== '/index') this.$router.push('/')
        this.$store.dispatch('desloguearse')
      },
    },
    computed: {

    }
}
</script>

<style scoped lang="css">

</style>