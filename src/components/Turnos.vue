<template>

  <section>
    <div v-show="this.$store.state.isLogin && !mostrarMensaje && !mostrarConfirmacion">
      <div class="jumbotron mb-0">

        <div class="d-flex flex-column bd-highlight p-1 mb-3 border border-secondary rounded">
          <div class="mb-0">
            <p> <span> Agenda del Día: </span> Muestra los turnos confirmados de hoy. </p>
            <p> <span> Mostrar Todo: </span> Todos los turnos a partir de la fecha actual.</p>
            <p> <span> Confirmados: </span> Muestra solo turnos confirmados.</p>
            <p> <span> Pendientes: </span> Muestra solo turnos pendientes.</p>
            <p> <span> Cancelados: </span> Muestra solo turnos cancelados.</p>
            <p>También se pueden confirmar, cancelar o borrar turnos.</p>
            <p>Para crear turnos debe ir al menú <span>Calendario</span>.</p>
          </div>
        </div>

        <h4>Turnos {{ ultimoBoton }}</h4>

        <button v-if="validarRol" class="botones btn btn-outline-dark p-1" @click="mostrarHoy()">Agenda del Día</button>
        <button class="botones btn btn-outline-dark ml-2 p-1" @click="mostrarTodo()">{{mensajeBoton}}</button>
        <button class="botones btn btn-outline-dark ml-2 p-1" @click="mostrarConfirmados()">Confirmados</button>
        <button class="botones btn btn-outline-dark ml-2 p-1" @click="mostrarPendientes()">Pendientes</button>
        <button class="botones btn btn-outline-dark ml-2 p-1" @click="mostrarCancelados()">Cancelados</button>

        <div v-if="mostrarTabla" class="mt-2">
          <input type="text" class="border border-dark rounded mb-1" v-model="criterioBusqueda" placeholder="Buscar">
          <div v-if="turnos.length" class="table-responsive">
            <table class="table table-bordered">
              <thead class="thead-dark">
                <tr id="encabezado">
                  <th class="p-2">Fecha</th>
                  <th class="p-2">Nombre</th>
                  <th class="p-2">Servicio</th>
                  <th class="p-2" v-if="ultimoBoton === ''">Estado</th>
                </tr>
              </thead>
              <tr v-for="(turno,index) in turnos" :key="index" class="contenido">
                <td class="p-1 align-middle">{{ turno.fecha | formatoFecha }}</td>
                <td class="p-1 align-middle">
                  <div >
                    {{ turno.client.nombre | formatoNombre }} {{ turno.client.apellido | formatoNombre }}
                  </div>
                </td>
                <td class="p-1 align-middle">{{ turno.tipoServicio | tipoServicio }}</td>

                <td class="p-1 align-middle" v-if="ultimoBoton === ''">{{ turno.estado }}</td>

                <td v-if="BtnConfirmar" class="p-0 align-middle">
                    <button class="botones btn btn-outline-dark p-1" @click="confirmTurno(turno)"> Confirmar </button>
                </td>
                <td v-if="BtnCancelar" class="p-0 align-middle">
                    <button class="botones btn btn-outline-dark p-1" @click="cancelTurno(turno)"> Cancelar </button>
                </td>
                <td v-if="BtnBorrar" class="p-0 align-middle">
                    <button class="botones btn btn-outline-dark p-1" @click="eraseTurno(turno)"> Borrar </button>
                </td>

              </tr>
            </table>
          </div>
          <h4 v-else class="alert alert-dark text-center mt-2 mb-0" id="mensaje-error">
            {{ mensajeError }}
          </h4>
        </div>

      </div>
    </div>

    <div class="jumbotron mb-0 p-5" v-show="mostrarMensaje || mostrarConfirmacion">
      <div v-if="mostrarMensaje">
        <div class="p-1 border border-secondary rounded">
          <div class="m-1"> {{mensajeBorrar}} </div>
          <div class="m-1"> Nombre: {{mensajeNombre}} </div>
          <div class="m-1"> Fecha: {{mensajeFecha | formatoFecha}} </div>
          <div class="m-1"> Servicio: {{ mensajeServicio | mostrarTipoServicio }}</div>
          <div class="m-1">
            <button class="botones btn btn-outline-dark p-1" @click="botonAceptar()">Aceptar</button>
            <button class="botones btn btn-outline-dark p-1 ml-2" @click="botonCancelar()">Cancelar</button>
          </div>
        </div>
      </div>
      <div v-else-if="mostrarConfirmacion">
        <div class="">
          <div class="m-1"> {{mensajeConfirmacion}} </div>
          <button class="botones btn btn-outline-dark p-1 ml-2" @click="botonCancelar()">Aceptar</button>
        </div>
      </div>
    </div>

  </section>

</template>

<script>
  export default  {
    name: 'src-components-turnos',
    props: [],
    mounted () {
      this.enviarLogin()
      this.getTurnos()
      this.$store.dispatch('lastActivity')
    },
    beforeUpdate (){
      this.$store.dispatch('lastActivity')
    },
    data () {
      return {
        url: this.$store.state.url + 'shifts/',
        listaTurnos: [],
        turnos: [],
        fechas: {},
        fechaHoy: new Date(),
        mostrarTabla: false,
        ultimoBoton: '',
        mensajeError: '',
        mostrarMensaje: false,
        mensajeBorrar: '',
        mensajeFecha: '',
        mensajeNombre: '',
        mensajeServicio: '',
        turnoElegido: {},
        mostrarConfirmacion: false,
        mensajeConfirmacion: '',
        botonAccion: '',
        criterioBusqueda: '',
      }
    },
    methods: {
      enviarLogin(){
        if(!this.$store.state.isLogin){
          this.$router.push('/')
        }
      },
      async getTurnos(){
        this.setFechas()
        try {
          const { data : turnos } = await this.axios.post(this.url, this.fechas, { 'content-type' : 'application/json' })
          this.setArrayTurnos(turnos)
          this.setTurnos()
        }catch(error) {
          console.error('Error en getTurnos', error.message) 
        }
      },
      setArrayTurnos(turnos){
        if(this.$store.state.currentUser.rol !== 'Owner'){
          turnos.forEach( turno => {
            delete turno['clientId']
            turno.client = this.$store.state.currentUser
          })
        }
        this.listaTurnos = turnos
      },
      setTurnos(){
        this.turnos = Array.from(this.listaTurnos)
        this.copiaLista = Array.from(this.turnos)
      },
      setFechas(){
        let anio = this.fechaHoy.getFullYear()
        let mes = this.fechaHoy.getMonth()
        let dia = this.fechaHoy.getDate()
        this.fechas = {
          inicio: new Date(anio, mes, dia, 0, 0, 0, 0),
          fin: new Date(anio + 1, mes, dia, 23, 59, 59, 999),
          reqId: this.$store.state.currentUser._id,
          estado: null
        }
      },
      validarFecha(fecha){
        const anio = this.fechaHoy.getFullYear()
        const mes = this.fechaHoy.getMonth()
        const dia = this.fechaHoy.getDate()
        const fechaInicio = new Date(anio, mes, dia, 0, 0, 0, 0)
        const fechaFin = new Date(anio, mes, dia, 23, 59, 59, 999)
        const fechaNueva = new Date(fecha)
        return fechaNueva.getTime() >= fechaInicio.getTime() && fechaNueva.getTime() <= fechaFin.getTime()
      },
      mostrarHoy(){
        this.turnos = this.listaTurnos.filter(turno => turno.estado === 'Confirmado' && this.validarFecha(turno.fecha) )
        this.mostrarVarios(true, 'de Hoy', 'No tienes turnos hoy')
      },
      mostrarTodo(){
        this.turnos = Array.from(this.listaTurnos)
        this.mostrarVarios(!this.mostrarTabla, '', 'No hay turnos')
      },
      mostrarConfirmados(){
        this.turnos = this.listaTurnos.filter(turno => ( turno.estado === 'Confirmado' ) )
        this.mostrarVarios(true, 'Confirmados', 'No hay turnos confirmados')
      },
      mostrarPendientes(){
        this.turnos = this.listaTurnos.filter(turno => ( turno.estado === 'Pendiente' ) )
        this.mostrarVarios(true, 'Pendientes', 'No hay turnos pendientes')
      },
      mostrarCancelados(){
        this.turnos = this.listaTurnos.filter(turno => ( turno.estado === 'Cancelado' ) )
        this.mostrarVarios(true, 'Cancelados', 'No hay turnos cancelados')
      },
      mostrarVarios(mostrarTabla, ultimoBoton, mensajeError){
        this.copiaLista = Array.from(this.turnos)
        this.mostrarTabla = mostrarTabla
        this.ultimoBoton = ultimoBoton
        this.mensajeError = mensajeError
      },
      confirmTurno(turno){
        this.botonAccion = 'Confirma'
        this.modifyTurno(turno)
      },
      cancelTurno(turno){
        this.botonAccion = 'Cancela'
        this.modifyTurno(turno)
      },
      eraseTurno(turno){
        this.botonAccion = 'Borra'
        this.modifyTurno(turno)
      },
      modifyTurno(turno){
        this.mensajeBorrar = `${this.botonAccion} el turno de:`
        this.mensajeNombre = `${turno.client.nombre} ${turno.client.apellido}`
        this.mensajeFecha = turno.fecha
        this.mensajeServicio = turno.tipoServicio
        this.mostrarMensaje = true
        this.turnoElegido = turno
      },
      async botonAceptar(){
        let res
        if(this.botonAccion === 'Confirma') res = await this.confirmarTurno()
        if(this.botonAccion === 'Cancela') res = await this.cancelarTurno()
        if(this.botonAccion === 'Borra') res = await this.borrarTurno()
        this.setConfirmacion(res)
      },
      setConfirmacion(res){
        this.mostrarMensaje = false
        this.mostrarConfirmacion = true
        if(res.acknowledged) this.mensajeConfirmacion = `Turno ${this.botonAccion}do`
        else if(res.error) this.mensajeConfirmacion = res.error
      },
      botonCancelar(){
        this.limpiarMensaje()
      },
      limpiarMensaje(){
        this.mostrarMensaje = false
        this.mostrarConfirmacion = false
        this.mensajeBorrar = ''
        this.mensajeNombre = ''
        this.mensajeFecha = ''
        this.mensajeServicio = ''
        this.mensajeConfirmacion = ''
        this.turnoElegido = {}
        this.botonAccion = ''
      },
      async confirmarTurno(){
        return await this.actualizarTurno('Confirmado')
      },
      async cancelarTurno(){
        return await this.actualizarTurno('Cancelado')
      },
      async actualizarTurno(estado){
        this.turnoElegido.estado = estado
        const res = await this.updateTurno(this.turnoElegido)
        if(res.acknowledged) this.turnos = this.turnos.filter( t => t._id !== this.turnoElegido._id )
        return res
      },
      async updateTurno(turno){
        const turnoModificado = this.modificarTurno(turno)
        try {
          const { data : res } = await this.axios.put(this.url + turno._id, turnoModificado, { 'content-type' : 'application/json' })
          return res
        }catch(error) {
          console.error('Error en updateTurno', error.message) 
        }
      },
      modificarTurno(turno){
        let turnoModificado = {...turno}
        turnoModificado.clientId = turnoModificado.client._id
        delete turnoModificado["client"]
        return turnoModificado
      },
      async borrarTurno(){
        const res = await this.deleteTurno(this.turnoElegido._id)
        if(res.acknowledged) {
          this.listaTurnos = this.listaTurnos.filter( t => t._id !== this.turnoElegido._id )
          this.turnos = this.turnos.filter( t => t._id !== this.turnoElegido._id )
          this.copiaLista = Array.from(this.turnos)
        }
        return res
      },
      async deleteTurno(id){
        try {
          let { data : res } = await this.axios.delete(this.url + id, { 'content-type' : 'application/json' })
          return res
        }catch(error) {
          console.error('Error en deleteTurno', error.message)
        }
      },
      formatoFechaString(value){
        value = new Date(value)
        let mes = value.getMonth()+1
        let dia = value.getDate()
        let hora = value.getHours()
        if(hora < 10) hora = `0${hora}`
        if(mes < 10) mes = `0${mes}`
        if(dia < 10) dia = `0${dia}`
        return `${dia}-${mes}-${value.getFullYear()} ${hora}:00`
      },
    },
    computed: {
      mensajeBoton(){
        let mensajeBoton = 'Mostrar Todo'
        !this.mostrarTabla ? mensajeBoton = 'Mostrar Todo' : mensajeBoton = 'Ocultar Lista'
        return mensajeBoton
      },
      validarRol(){
        if(this.$store.state.currentUser) return this.$store.state.currentUser.rol === 'Owner'
        else return false
      },
      BtnConfirmar(){
        return this.ultimoBoton === 'Pendientes' && this.$store.state.currentUser.rol === 'Owner'
      },
      BtnCancelar(){
        return ( this.ultimoBoton === 'Pendientes' || this.ultimoBoton === 'Confirmados' ) && this.$store.state.currentUser.rol === 'Owner'
      },
      BtnBorrar(){
        return this.ultimoBoton === 'Cancelados' && this.$store.state.currentUser.rol === 'Owner'
      },
    },
    watch: {
      criterioBusqueda: function(){
        if(this.criterioBusqueda){
          let c = this.criterioBusqueda.toLowerCase()
          const tipoServicio = ["Pies","Manos","Manos y Pies"]
          this.turnos = this.copiaLista.filter(turno => {
            let fecha = this.formatoFechaString(turno.fecha)
            let nombreCompleto = `${turno.client.nombre.toLowerCase()} ${turno.client.apellido.toLowerCase()}`
            let servicio = tipoServicio[turno.tipoServicio - 1].toLowerCase()
            let estado = turno.estado.toLowerCase()
            return fecha.includes(c) || nombreCompleto.includes(c) || servicio.includes(c) || estado.includes(c)
          })
        }else this.turnos = Array.from(this.copiaLista)
      }
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