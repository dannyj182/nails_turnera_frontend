<template>

  <section>

    <div v-if="validarRol">
      <div v-if="this.$store.state.isLogin && !mostrarMensaje && !mostrarConfirmacion" >
        <div :class=setClase>

          <div v-show="!modoTurno">
            <div class="d-flex flex-column bd-highlight p-1 mb-3 border border-secondary rounded">
              <div class="mb-0">
                <p class="mb-2">
                  Esta sección es muy similar a la de <span>Turnos</span>, puede ver a todos los usuarios 
                  (salvo el usuario actual, ese lo puede ver desde la configuración, parte 
                  superior derecha donde está el nombre), también puede ver que usuarios están 
                  habilitados o deshabilitados para acceder a esta aplicación y crear nuevos usuarios. 
                  Puede habilitar o deshabilitar usuarios, editarlos y borrarlos.
                </p>
                <p>Solo los usuarios con rol de Owner pueden acceder a esta sección.</p>
              </div>
            </div>
          </div>

          <h4 v-show="!modoTurno" >Clientes {{ ultimoBoton }}</h4>
          <h6 v-show="modoTurno" >Clientes:</h6>
          <button v-show="!modoTurno" class="botones btn btn-outline-dark p-1" @click="mostrarTodo()">{{mensajeBoton}}</button>
          <button v-show="!modoTurno" class="botones btn btn-outline-dark ml-2 p-1" @click="mostrarHabilitados()">Habilitados</button>
          <button v-show="!modoTurno" class="botones btn btn-outline-dark mx-2 p-1" @click="mostrarDeshabilitados()">Deshabilitados</button>
          <button class="botones btn btn-outline-dark p-1" @click="nuevoCliente()">{{ BtnNewClient }}</button>

          <div v-if="mostrarForm">
            <vue-form :state="formState" @submit.prevent="editar()">
              <br>
              <p class="m-0">Editar Cliente</p>

              <div class="">
                <validate tag="div" class="">
                  <input type="text" id="nombre" class="form-control border border-dark mt-1" autocomplete="off" v-model.trim="formData.nombre"
                  name="nombre" 
                  required
                  />
                  <field-messages name="nombre" show="$touched || $dirty">
                    <div slot="required" class="alert alert-danger mt-1">Campo requerido</div>
                  </field-messages>
                </validate>

                <validate tag="div" class="">
                  <input type="text" id="apellido" class="form-control border border-dark mt-1" autocomplete="off" v-model.trim="formData.apellido"
                  name="apellido" 
                  required
                  />
                  <field-messages name="apellido" show="$touched || $dirty">
                    <div slot="required" class="alert alert-danger mt-1">Campo requerido</div>
                  </field-messages>
                </validate>

                <validate tag="div" class="">
                  <input type="text" id="celular" class="form-control border border-dark mt-1" autocomplete="off" v-model.trim="formData.celular"
                  name="celular" 
                  required
                  solo-numeros
                  />
                  <field-messages name="celular" show="$touched || $dirty">
                    <div slot="required" class="alert alert-danger mt-1">Campo requerido</div>
                    <div slot="solo-numeros" class="alert alert-danger mt-1">Ingrese solo números</div>
                  </field-messages>
                </validate>

                <validate tag="div" class="">
                  <input type="text" id="email" class="form-control border border-dark mt-1" autocomplete="off" v-model.trim="formData.email"
                  name="email" 
                  required
                  />
                  <field-messages name="email" show="$touched || $dirty">
                    <div slot="required" class="alert alert-danger mt-1">Campo requerido</div>
                  </field-messages>
                </validate>

                <validate tag="div" class="">
                    <select type="text" id="rol" class="form-control border border-dark mt-1" autocomplete="off" v-model.trim="formData.rol"
                    name="rol"
                    required
                    >
                      <option>Owner</option>
                      <option>Administrador</option>
                      <option>Cliente</option>
                    </select>
                  <field-messages name="rol" show="$touched || $dirty">
                    <div slot="required" class="alert alert-danger mt-1">Campo requerido</div>
                  </field-messages>
                </validate>
                <div class="row mt-1">
                  <div class="col-auto">
                    <button class="btn btn-outline-dark p-1" :disabled="formState.$invalid">Guardar</button>
                  </div>
                  <div class="col-auto pl-0">
                    <button type="button" class="btn btn-outline-dark p-1" @click="cerrar()">Cerrar</button>
                  </div>
                </div>
              </div>

              <hr>
            </vue-form>
          </div>

          <div v-if="(mostrarTabla || modoTurno) && !modoAlta" class="mt-2">
            <input type="text" class="border border-dark rounded mb-1" v-model="criterioBusqueda" placeholder="Buscar">
            <div v-if="listaFiltrada.length" class="table-responsive">
              <table class="table table-bordered">
                <thead class="thead-dark">
                  <tr id="encabezado">
                    <th class="p-2">Nombre</th>
                    <th class="p-2">Apellido</th>
                    <th v-show="!modoTurno" class="p-2">Celular</th>
                    <th v-show="!modoTurno" class="p-2">Rol</th>
                    <th v-show="!modoTurno && BtnHab" class="p-2">Acción</th>
                    <th v-show="!modoTurno && BtnEdit" class="p-2">Editar</th>
                    <th v-show="!modoTurno && BtnBorrar" class="p-2">Borrar</th>
                    <th v-show="modoTurno" class="p-2">Seleccione</th>
                  </tr>
                </thead>
                <tr v-for="(cliente,index) in listaFiltrada" :key="index" class="contenido">
                  <td class="p-1 align-middle">{{ cliente.nombre }}</td>
                  <td class="p-1 align-middle">{{ cliente.apellido }}</td>
                  <td v-show="!modoTurno" class="p-1 align-middle">{{ cliente.celular }}</td>
                  <td v-show="!modoTurno" class="p-1 align-middle">{{ cliente.rol }}</td>

                  <td v-show="!modoTurno && BtnHab" class="p-1 align-middle">
                    <button class="botones btn btn-outline-dark" @click="habilitarCliente(cliente)">{{cliente.isEnabled | enabled}}</button>
                  </td>
                  <td v-show="!modoTurno && BtnEdit" class="p-1 align-middle">
                    <button class="botones btn btn-outline-dark" @click="editarCliente(cliente)">Editar</button>
                  </td>
                  <td v-show="!modoTurno && BtnBorrar" class="p-1 align-middle">
                    <button class="botones btn btn-outline-dark ml-2" @click="deleteCliente(cliente)">Borrar</button>
                  </td>
                  <td v-show="modoTurno" class="p-1 align-middle">
                    <button class="botones btn btn-outline-dark ml-2" @click="selectClient(cliente)">Seleccionar</button>
                  </td>
                </tr>
              </table>
            </div>
            <h4 v-else class="alert alert-dark text-center mt-2 mb-0 d-inline-flex" id="mensaje-error">
            No hay usuarios para la opción seleccionada
            </h4>
          </div>

          <div v-if="modoAlta" class="m-0">
            <Register :modoAlta="modoAlta" @registroCompletado="registroCompletado=$event"/>
          </div>

        </div>
      </div>

      <div class="jumbotron mb-0 p-5" v-show="mostrarMensaje || mostrarConfirmacion">
        <div v-if="mostrarMensaje">
          <div class="p-1 border border-secondary rounded">
            <div class="m-1"> {{mensajeBorrar}} </div>
            <div class="m-1">
              <button class="botones btn btn-outline-dark p-1" @click="botonAceptar()">Aceptar</button>
              <button class="botones btn btn-outline-dark p-1 ml-2" @click="botonCancelar()">Cancelar</button>
            </div>
          </div>
        </div>
        <div v-else-if="mostrarConfirmacion">
          <div class="m-1"> {{mensajeConfirmacion}} </div>
          <button class="botones btn btn-outline-dark p-1 ml-2" @click="botonCancelar()">Aceptar</button>
        </div>
      </div>

    </div>

  </section>
  
</template>

<script>
  import Register from './Register.vue'
  export default  {
    name: 'src-components-clientes',
    components: {
      Register,
    },
    props: {
      modoTurno: Boolean,
    },
    mounted () {
      this.enviarLogin()
      this.$store.dispatch('lastActivity')
      this.cargarClientes()
    },
    beforeUpdate (){
      this.$store.dispatch('lastActivity')
    },
    data () {
      return {
        url: this.$store.state.url + 'usuarios/',
        formState: {},
        formData: this.getInitialData(),
        listaClientes: [],
        listaFiltrada: [],
        copiaLista: [],
        mostrarTabla: false,
        mostrarForm: false,
        ultimoBoton: '',
        criterioBusqueda: '',
        mostrarMensaje: false,
        mensajeBorrar: '',
        borrarCliente: {},
        mostrarConfirmacion: false,
        mensajeConfirmacion: '',
        modoAlta: false,
        registroCompletado: false,
      }
    },
    methods: {
      enviarLogin(){
        const validacion = !this.$store.state.isLogin || this.$store.state.currentUser.rol === 'Cliente'
        if(validacion) this.$router.push('/')
      },
      async cargarClientes(){
        if(this.$store.state.isLogin){
          try {
            let { data : listaClientes } = await this.axios(this.url)
            this.listaClientes = listaClientes
            this.setListaFiltrada()
          }catch(error) { console.error('Error en cargarClientes', error.message) }
        }
      },
      setListaFiltrada(){
        const _id = this.$store.state.currentUser._id
        this.listaFiltrada = this.listaClientes.filter(c => c._id !== _id)
        this.copiaLista = Array.from(this.listaFiltrada)
      },
      async habilitarCliente(cliente){
        try {
          cliente.isEnabled = !cliente.isEnabled
          await this.axios.put(this.url + cliente._id, cliente, { 'content-type' : 'application/json' })
          this.apretarBoton(this.ultimoBoton)
        }catch(error) {
          cliente.isEnabled = !cliente.isEnabled
          console.error('Error en habilitarCliente', error.message) 
        }
      },
      async editarCliente(cliente){
        this.formData = this.crearUsuario(cliente)
        this.mostrarForm = true
      },
      deleteCliente(cliente){
        this.mensajeBorrar = `Deseas borrar a ${cliente.nombre} ${cliente.apellido}?`
        this.mostrarMensaje = true
        this.borrarCliente = {...cliente}
      },
      async botonAceptar(){
        try {
          let { data : res } = await this.axios.delete(this.url + this.borrarCliente._id, { 'content-type' : 'application/json' })
          this.setConfirmacion(res)
          await this.cargarClientes()
        }catch(error) {
          console.error('Error en deleteCliente (botonAceptar)', error.message) 
        }
      },
      botonCancelar(){
        this.limpiarMensaje()
      },
      limpiarMensaje(){
        this.mostrarMensaje = false
        this.mostrarConfirmacion = false
        this.mensajeBorrar = ''
        this.mensajeConfirmacion = ''
        this.borrarCliente = {}
      },
      setConfirmacion(res){
        this.mostrarMensaje = false
        this.mostrarConfirmacion = true
        if(res.acknowledged) this.mensajeConfirmacion = 'Cliente borrado'
        else if(res.error) this.mensajeConfirmacion = res.error
      },
      mostrarTodo(){
        if(this.mostrarTabla) {
          const id = this.$store.state.currentUser._id
          this.listaFiltrada = this.listaClientes.filter(c => c._id !== id)
          this.copiaLista = Array.from(this.listaFiltrada)
        }
        this.mostrarTabla = !this.mostrarTabla
        this.ultimoBoton = ''
        this.modoAlta = false
      },
      mostrarHabilitados(){
        const id = this.$store.state.currentUser._id
        this.listaFiltrada = this.listaClientes.filter(c => c.isEnabled && c._id !== id)
        this.copiaLista = Array.from(this.listaFiltrada)
        this.mostrarTabla = true
        this.ultimoBoton = 'Habilitados'
        this.modoAlta = false
      },
      mostrarDeshabilitados(){
        const id = this.$store.state.currentUser._id
        this.listaFiltrada = this.listaClientes.filter(c => !c.isEnabled && c._id !== id)
        this.copiaLista = Array.from(this.listaFiltrada)
        this.mostrarTabla = true
        this.ultimoBoton = 'Deshabilitados'
        this.modoAlta = false
      },
      apretarBoton(boton){
        switch(boton){
          case 'Habilitados':
            this.mostrarHabilitados()
            break
          case 'Deshabilitados':
            this.mostrarDeshabilitados()
            break
        }
      },
      getInitialData() {
        return {
          nombre: null,
          apellido: null,
          celular: null,
          email: null,
          rol: null,
        }
      },
      limpiarForm() {
        this.formData = this.getInitialData()
        this.formState._reset()
      },
      async editar(){
        const cliente = { ...this.formData }
        try {
          await this.axios.put(this.url + cliente._id, cliente, { 'content-type' : 'application/json' })
          this.cerrar()
          await this.cargarClientes()
          this.apretarBoton(this.ultimoBoton)
        }catch(error) {
          console.error('Error en editar', error.message) 
        }
      },
      crearUsuario(usuario){
        return {
          _id: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          celular: usuario.celular,
          email: usuario.email,
          rol: usuario.rol
        }
      },
      cerrar(){
        this.mostrarForm = false
        this.limpiarForm()
      },
      selectClient(client){
        this.$emit('selectClient', client)
      },
      nuevoCliente(){
        this.mostrarTabla = false
        this.modoAlta = !this.modoAlta
      },
    },
    computed: {
      validarRol(){
        if(this.$store.state.currentUser) return this.$store.state.currentUser.rol === 'Owner'
        else return false
      },
      mensajeBoton(){
        let mensajeBoton = 'Mostrar Todo'
        !this.mostrarTabla ? mensajeBoton = 'Mostrar Todo' : mensajeBoton = 'Ocultar Lista'
        return mensajeBoton
      },
      setClase(){
        if(this.modoTurno) return 'jumbotron mb-0 p-2'
        else return 'jumbotron mb-0'
      },
      BtnHab(){
        return this.ultimoBoton === 'Habilitados' || this.ultimoBoton === 'Deshabilitados'
      },
      BtnEdit(){
        return this.ultimoBoton === ''
      },
      BtnBorrar(){
        return this.ultimoBoton === ''
      },
      BtnNewClient(){
        if(this.modoAlta) return 'Cerrar'
        else return 'Nuevo Cliente'
      },
    },
    watch: {
      criterioBusqueda: function(){
        if(this.criterioBusqueda){
          let c = this.criterioBusqueda.toLowerCase()
          this.listaFiltrada = this.copiaLista.filter(cliente => {
            let nombreCompleto = `${cliente.nombre.toLowerCase()} ${cliente.apellido.toLowerCase()}`
            let celular = cliente.celular.toLowerCase()
            let email = cliente.email.toLowerCase()
            return nombreCompleto.includes(c) || celular.includes(c) || email.includes(c)
          })
        }else this.listaFiltrada = Array.from(this.copiaLista)
      },
      registroCompletado: async function(){
        if(this.registroCompletado){
          this.mostrarTabla = true
          this.modoAlta = false
          await this.cargarClientes()
        }
      },
    }
}
</script>

<style scoped lang="css">
.botones{
  font-size: x-small;
}
#encabezado{
  font-size: x-small;
}
.contenido{
  font-size: x-small;
}
#mensaje-error{
  font-size: small;
}
p{
  font-size: small;
  margin-bottom: 0;
}
span{
  font-weight: bold
}
</style>