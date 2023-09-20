<template>

  <section>
    <div class="jumbotron mb-0 p-5">
      <div v-show="!$store.state.isLogin && !mostrarMensaje" >
        <h4>Iniciar Sesión</h4>
        <vue-form :state="formState" @submit.prevent="iniciarSesion()">

          <validate tag="div">
            <label class="mt-2" for="email">Email</label>
            <input type="email" id="email" autocomplete="off" v-model.trim="formData.email"
            name="email" :class="fieldClassName(formData.email, formState.email)"
            required 
            mail-format
            placeholder="Ingrese el Email" />
            <field-messages name="email" show="$touched || $submitted">
              <div slot="required" class="text-danger pl-1">Campo requerido</div>
              <div slot="mail-format" class="text-danger pl-1">Email no válido</div>
            </field-messages>
          </validate>

          <validate tag="div">
            <label class="mt-2" for="password">Contraseña</label>
            <input type="password" id="password" autocomplete="off" v-model.trim="formData.password"
            name="password" :class="fieldClassName(formData.password, formState.password)"
            required
            :minlength="8"
            placeholder="Ingrese la Constraseña" />
            <field-messages name="password" show="$touched || $submitted">
              <div slot="required" class="text-danger pl-1">Campo requerido</div>
            </field-messages>
          </validate>

          <button class="btn btn-outline-dark mt-3" :disabled="formState.$invalid">Iniciar Sesión</button>
          <hr>
        </vue-form>
        <a href="#" class="text-primary" @click="$router.push('/register')">Regístrese</a>
      </div>
      <div v-show="mostrarMensaje">
        <div>
          {{mensajeLogin}}
        </div>
        <button class="btn btn-outline-dark mt-3" @click="botonAceptar()">Aceptar</button>
      </div>
    </div>
  </section>

</template>

<script>
  export default  {
    name: 'src-components-login',
    props: [],
    mounted () {
      this.enviarIndex()
    },
    data () {
      return {
        url: this.$store.state.url + 'usuarios/validar/',
        formState: {},
        formData: this.getInitialData(),
        mensajeLogin: '',
        mostrarMensaje: false
      }
    },
    methods: {
      enviarIndex(){
        if(this.$store.state.isLogin){
          this.$router.push('/')
        }
      },
      getInitialData() {
        return {
          email: null,
          password: null,
        }
      },
      crearUsuario(usuario){
        return {
          email: usuario.email.toLowerCase(),
          password: usuario.password,
        }
      },
      async iniciarSesion() {
        const user = this.crearUsuario({ ...this.formData })
        const res = await this.validarUsuario(user)
        if(res.usuario) {
          this.$store.dispatch('loguearse', res)
          this.mensajeLogin = `Bienvenido/a ${this.$store.state.currentUser.nombre} ${this.$store.state.currentUser.apellido}`
        }else{
          this.mensajeLogin = res.error
        }
        this.limpiarForm()
        this.mostrarMensaje = true
      },
      async validarUsuario(user) {
        try {
          let { data : res } =  await this.axios.post(this.url, user, { 'content-type' : 'application/json' })
          return res
        }
        catch(error) { console.error('Error en validarUsuario', error.message) }
      },
      limpiarForm() {
        this.formData = this.getInitialData()
        this.formState._reset()
      },
      botonAceptar(){
        this.limpiarForm()
        if(this.$store.state.isLogin) this.$router.push('/')
        else {
          this.mostrarMensaje = false
        }
      },
      fieldClassName(formData, formState){
        if( formState && ( formState.$touched || formState.$dirty ) && ( !formData || formState.$invalid ) ) {
          return 'form-control is-invalid'
        }else if( !formData ) {
          return 'form-control'
        }else if( ( formState.$touched || formState.$dirty ) && formState.$valid ) {
          return 'form-control is-valid'
        }
      }
    },
    computed: {

    }
}
</script>

<style scoped lang="css">

</style>