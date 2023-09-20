<template>

  <section>
    <div v-if="this.$store.state.isLogin && !mostrarMensaje && !mostrarConfirmacion">
      <div class="jumbotron mb-0 pl-2">
        <div class="w-100">

          <div class="d-flex flex-column bd-highlight p-1 mb-3 border border-secondary rounded">
            <div class="mb-0">
              <p class="mb-2">Acá se reservan los turnos, los colores juegan un papel importante en cada fecha:</p>
              <p> <span> Gris: </span> Día deshabilitado para tomar turnos. </p>
              <p> <span> Verde agua: </span> Fecha no disponible por haber pasado. </p>
              <p> <span> Azul cielo: </span> Día habilitado y sin turnos confirmados. </p>
              <p> <span> Amarillo: </span> Día con turnos disponibles para reservar. </p>
              <p> <span> Rojo: </span> Día sin turnos disponibles. </p>
              <p class="mt-1">Si el cliente no existe lo puede crear.</p>
              <p>Los clientes pueden pedir turnos pero los debe confirmar el owner.</p>
            </div>
          </div>

          <h4>Calendario</h4>

          <div class="col-auto p-0">
            <div class="d-flex justify-content-center row p-2">
              <button class="btn btn-outline-primary col-auto m-2 p-1" @click="atrasarMes()">Anterior</button>
              <p class="col-auto m-2 p-1">{{ `${mesActual} de ${anioActual}` }}</p>
              <button class="btn btn-outline-primary col-auto m-2 p-1" @click="avanzarMes()">Próximo</button>
            </div>
            <table class="table mb-0">
              <thead>
                <tr>
                  <th scope="col" v-for="(dia,index) in diasSemana" :key="index">
                    <div class="nav justify-content-center" id="dia">{{ dia }}</div>
                  </th>
                </tr>
              </thead>
              <tbody v-for="(semana,index) in mes" :key="index">
                <tr>
                  <td class="p-1" v-for="(dia,index) in semana" :key="index">
                    <div v-if="dia" :class=setClassDia(dia) id="fecha" @click="mostrarDia(dia)">
                      {{ dia.fecha | mostrarDiaDelMes }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="mostrarDetalle">
            <div class="d-flex justify-content-center mb-1">
              <div class="d-inline-flex border border-secondary rounded p-1">{{ dia.fecha | mostrarFecha }}</div>
            </div>
            <div v-for="(item,index) in dia.turnos" :key="index">
              <div :class=setClassHora(item) @click="cargarForm(item, index)">
                <div>{{ item.hora }}</div>
                <div v-if="item.tipoServicio">
                  <div v-if="item.client">
                    <div>{{ item.client.nombre + ' ' + item.client.apellido }}</div>
                    <div>
                      Celular: 
                      <a :href=linkWs(item.client.celular) target="_blank">+{{ item.client.celular }}</a>
                    </div>
                    <div class="d-flex justify-content-between">
                      <div> Servicio: {{ item.tipoServicio | mostrarTipoServicio }} </div>
                      <div v-if="validarTurno(item.hora)">
                        <div @click="cancelarTurno(item)">Cancelar Turno</div>
                      </div>
                    </div>
                  </div>
                  <div v-else>Reservado</div>
                </div>
                <div v-else>
                  <div v-if="validarTurno(item.hora)">Disponible</div>
                  <div v-else>No Disponible</div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="mostrarForm">
            <h5>Pedir Turno</h5>
            <div class="border border-secondary rounded">

              <vue-form :state="formState" @submit.prevent="pedirTurno()">
                <div class="m-1">
                  <validate class="pl-0 mt-1" tag="div">
                    <label for="nombreCal">Nombre:</label>
                    <input type="text" id="nombreCal" class="form-control" v-model="formData.nombre"
                    name="nombreCal"
                    required
                    :disabled="true"
                    />
                  </validate>
                  <validate class="pl-0 mt-1" tag="div">
                    <label for="fecha">Fecha:</label>
                    <input type="datetime-local" id="fecha" class="form-control" v-model="formData.fecha"
                    name="fecha" 
                    required
                    :disabled="true"
                    />
                  </validate>
                  <validate class="px-0 mt-1" tag="div">
                    <label for="tipoServicio">Tipo de Servicio:</label>
                    <select type="text" id="tipoServicio" class="form-control" v-model="formData.tipoServicio"
                    name="tipoServicio"
                    required
                    >
                      <option disabled value="0">Seleccione una opción</option>
                      <option :disabled="!opcionDos" value="2">Manos</option>
                      <option value="1">Pies</option>
                      <option :disabled="!opcionTres" value="3">Manos y Pies</option>
                    </select>
                  </validate>
                </div>
                <div class="row m-1">
                  <div class="col-auto pl-0">
                    <button class="btn btn-outline-dark" :disabled="validarForm">Pedir Turno</button>
                  </div>
                  <div class="col-auto pl-0">
                    <button type="button" class="btn btn-outline-dark" @click="cerrarForm()">Cerrar</button>
                  </div>
                </div>
              </vue-form>
              <div v-if="validarRol">
                <Clientes :modoTurno="modoTurno" @selectClient="selectClient=$event"/>
              </div>
            </div>

          </div>
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
        <div class="m-1"> {{mensajeConfirmacion}} </div>
        <button class="botones btn btn-outline-dark p-1 ml-2" @click="botonCancelar()">Aceptar</button>
      </div>
    </div>

  </section>

</template>

<script>
  import Clientes from './Clientes.vue'
  export default  {
    name: 'src-components-calendario',
    components: {
      Clientes,
    },
    props: [],
    mounted () {
      this.enviarIndex()
      this.actualizarMes()
      this.setFechaInicio()
    },
    beforeUpdate (){
      this.$store.dispatch('lastActivity')
    },
    data () {
      return {
        formData: {},
        formState: {},
        mostrarForm: false,
        modoTurno: false,
        selectClient: '',
        ultimaFecha: '',
        mes: [],
        fecha: new Date(),
        fechaHoy: this.inicializarFecha(),
        fechaInicio: this.setFechaInicio(),
        fechas: {},
        url: this.$store.state.url + 'shifts/',
        turnosMes: [],
        opcionesHoras: [
          '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
          '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00' 
        ],
        mostrarDetalle: false,
        dia: {},
        opcionDos: true,
        opcionTres: true,
        diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
        meses: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
        mostrarMensaje: false,
        mensajeBorrar: '',
        mensajeFecha: '',
        mensajeNombre: '',
        mensajeServicio: '',
        turnoBorrado: {},
        mostrarConfirmacion: false,
        mensajeConfirmacion: '',
      }
    },
    methods: {
      enviarIndex(){
        if(!this.$store.state.isLogin){
          this.$router.push('/')
        }
      },
      async actualizarMes(){
        if(this.$store.state.isLogin){
          this.cerrarForm()
          this.mostrarDetalle = false
          this.ultimaFecha = ''
          await this.cargarMes()
        }
      },
      cerrarForm(){
        if(this.mostrarForm){
          this.limpiarForm()
          this.mostrarForm = false
          this.modoTurno = false
          this.selectClient = ''
          this.mostrarDetalle = true
        }
      },
      limpiarForm() {
        this.formData = this.getInitialData()
        this.formState._reset()
      },
      getInitialData() {
        return {
          nombre: null,
          fecha: null,
          tipoServicio: 0,
          clientId: null,
        }
      },
      async cargarMes(){
        this.mes = []
        const anio = this.fecha.getFullYear()
        const mes = this.fecha.getMonth()
        const diasMes = this.obtenerDiasMes(anio, mes + 1)
        const semanasMes = this.obtenerSemanasMes(anio, mes)
        let diaMes = 1
        this.setFechas(anio, mes, diasMes)
        await this.getTurnosMes()
        for (let iSemana = 0 ; iSemana < semanasMes ; iSemana++) {
          let json = this.generarSemana(anio, mes, diaMes, diasMes)
          diaMes = json.diaMes
          this.mes.push(json.semana)
        }
      },
      obtenerDiasMes(anio, mes){
        if(mes === 12) mes = 0
        return new Date(anio, mes, 0).getDate()
      },
      obtenerSemanasMes(anio, mes){
        let primerDiaMes = ((new Date(anio, mes, 1).getDay()-1)%7+7)%7
        let result=new Date(anio, mes + 1, 0).getDate()-7+primerDiaMes
        return Math.ceil(result/7)+1
      },
      setFechas(anio, mes, diasMes){
        this.fechas = {
          inicio: new Date(anio, mes, 1, 0, 0, 0, 0),
          fin: new Date(anio, mes, diasMes, 23, 59, 59, 999),
          reqId: this.$store.state.currentUser._id,
          estado: 'Confirmado'
        }
      },
      async getTurnosMes(){
        try {
          const { data : turnosMes } = await this.axios.post(this.url, this.fechas, { 'content-type' : 'application/json' })
          this.turnosMes = turnosMes
        }catch(error) {
          console.error('Error en getTurnosMes', error.message) 
        }
      },
      generarSemana(anio, mes, diaMes, diasMes){
        let semana = []
        for (let iDia = 0; iDia < 7 ; iDia++) {
          let fecha = new Date(anio, mes, diaMes, 23, 59, 59, 999)
          let diaSemana = ((fecha.getDay()-1)%7+7)%7
          let json = this.generarJson()
          if( iDia === diaSemana && diaMes <= diasMes ){
            json.fecha = fecha
            this.enableDay(json)
            if(json.isEnabled) {
              this.setDia(json)
              this.setEstadoFecha(json)
            }
            semana.push(json)
            diaMes++
          }else semana.push(json)
        }
        return {
          diaMes: diaMes,
          semana: semana,
        }
      },
      generarJson(){
        return {
          fecha: '',
          cantHoras: 0,
          isEnabled: false,
          turnos: [],
        }
      },
      enableDay(json){
        if(this.$store.state.globalConfig){
          const dias = {...this.$store.state.globalConfig.dias}
          const diaSemana = ((json.fecha.getDay()-1)%7+7)%7
          json.isEnabled = dias[diaSemana] && !this.validarFecha(json.fecha)
        }else json.isEnabled = true
      },
      setDia(json){
        const horas = this.$store.state.globalConfig.horas
        if(horas){
          let index = this.opcionesHoras.indexOf(horas[0])
          const fin = this.opcionesHoras.indexOf(horas[1])
          let aux = 0
          for ( index ; index <= fin ; index++ ) {
            let hora = this.opcionesHoras[index]
            let turno = {}
            if(aux === 0){
              let fechaActual = new Date(json.fecha.getFullYear(), json.fecha.getMonth(), json.fecha.getDate(),`${hora.at(0)}${hora.at(1)}`)
              let res = this.buscarTurno(fechaActual)
              if(res){
                json.cantHoras+= res.tipoServicio
                turno = this.setObjeto(res._id, hora, res.client, res.tipoServicio, true, res.fecha)
                aux = --res.tipoServicio
              }else turno = this.setObjeto(0, hora, null, null, false, '')
            }else{
              turno = this.setObjeto(0, hora, null, null, true, '')
              aux--
            }
            json.turnos.push(turno)
          }
        }
      },
      buscarTurno(fecha){
        let index = 0
        let validacion = true
        let valor1 = fecha.getTime()
        while(index < this.turnosMes.length && validacion){
          let valor2 = new Date(this.turnosMes[index].fecha).getTime()
          if(valor1 === valor2) {
            let turnos = this.turnosMes.splice(index, 1)
            return turnos[0]
          }
          validacion = valor1 > valor2
          index++
        }
        return null
      },
      setObjeto(id, hora, client, tipoServicio, validacion, fecha){
        return {
          _id: id,
          hora: hora,
          client: client,
          tipoServicio: tipoServicio,
          estaReservado: validacion,
          fecha: fecha
        }
      },
      setEstadoFecha(json){
        let cantReservado = 0
        let cantNoReservado = 0
        json.turnos.forEach( turno => turno.estaReservado ? cantReservado++ : cantNoReservado++ )
        if(cantReservado === json.turnos.length) json.estado = 'No disponible'
        else if(cantNoReservado === json.turnos.length) json.estado = 'Disponible'
        else json.estado = 'Parcialmente Disponible'
      },
      async atrasarMes(){
        let mes = this.fecha.getMonth() - 1
        this.fecha = new Date(this.fecha.setMonth(mes,1))
        await this.actualizarMes()
      },
      async avanzarMes(){
        let mes = this.fecha.getMonth() + 1
        this.fecha = new Date(this.fecha.setMonth(mes,1))
        await this.actualizarMes()
      },
      setClassDia(json){
        let clase = 'nav justify-content-center'
        if(json.isEnabled){
          if(json.fecha < this.fechaHoy || json.fecha < this.fechaInicio) clase = `${clase} bg-info text-white`
          else if(json.estado === 'Disponible') clase = `${clase} bg-primary text-white`
          else if(json.estado === 'Parcialmente Disponible') clase = `${clase} bg-warning text-dark`
          else if(json.estado === 'No disponible') clase = `${clase} bg-danger text-dark`
        }else clase = `${clase} bg-secondary text-white`
        return clase
      },
      mostrarDia(json){
        if(json.fecha && json.isEnabled){
          this.fecha = new Date(json.fecha)
          this.cerrarForm()
          this.habilitarDetalle(json)
        }
      },
      habilitarDetalle(json){
        let copiaFecha = json.fecha.toDateString()
        if(this.ultimaFecha !== copiaFecha){
          this.dia = {...json}
          this.mostrarDetalle = true
          this.ultimaFecha = copiaFecha
        }
        else this.mostrarDetalle = !this.mostrarDetalle
      },
      setClassHora(item){
        let clase = 'border border-secondary rounded p-1 mb-1'
        if(item.estaReservado) {
          if(item.tipoServicio) return `${clase} bg-success text-white`
          else return `d-none`
        } else if( this.validarTurno(item.hora) ) return `${clase} bg-primary text-white`
          else return `${clase} bg-secondary text-white`
      },
      validarTurno(hora){
        let fechaTurno = new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate(), `${hora.at(0)}${hora.at(1)}`)
        const diferencia1 = fechaTurno.getTime() - new Date().getTime()
        const diferencia2 = fechaTurno.getTime() - this.fechaInicio.getTime()
        return ( diferencia1 > 0 ) && ( diferencia2 > 0) && !this.validarFecha(this.fecha)
      },
      validarFecha(fecha){
        let validacion = false
        if(this.$store.state.globalConfig && this.$store.state.globalConfig.ausencias){
          let index = 0
          let ausencias = Array.from(this.$store.state.globalConfig.ausencias)
          while(index < ausencias.length && !validacion){
            let time = fecha.getTime()
            let fechaIni = new Date(ausencias[index].fechaIni)
            let fechaFin = new Date(ausencias[index].fechaFin)
            validacion = time >= fechaIni.getTime() && time <= fechaFin.getTime()
            index++
          }
        }
        return validacion
      },
      cargarForm(turno, index){
        if(!turno.estaReservado){
          this.cargarFecha(turno.hora)
          const fechaTurno = new Date(this.formData.fecha)
          if(fechaTurno > new Date() && fechaTurno > this.fechaInicio){
            this.setOptions(index)
            this.setForm()
            this.mostrarDetalle = false
            this.mostrarForm = true
            this.modoTurno = true
          }
        }
      },
      cargarFecha(hora){
        const f = this.fecha
        let mes = f.getMonth()+1
        if(mes < 10) mes = `0${mes}`
        let dia = f.getDate()
        if(dia < 10) dia = `0${dia}`
        this.formData.fecha = `${f.getFullYear()}-${mes}-${dia}T${hora.at(0)}${hora.at(1)}:00`
      },
      setOptions(index){
        if(index === this.dia.turnos.length-1){
          this.opcionDos = true
          this.opcionTres = true
        }else if(index === this.dia.turnos.length-2){
          this.opcionDos = !this.dia.turnos[index+1].estaReservado
          this.opcionTres = this.opcionDos
        }else{
          this.opcionDos = !this.dia.turnos[index+1].estaReservado
          this.opcionTres = !this.dia.turnos[index+1].estaReservado && !this.dia.turnos[index+2].estaReservado
        }
      },
      setForm(){
        if(this.$store.state.currentUser.rol === 'Cliente') {
          this.formData.nombre = `${this.$store.state.currentUser.nombre} ${this.$store.state.currentUser.apellido}`
          this.formData.clientId = this.$store.state.currentUser._id
        }
      },
      linkWs(numero){
        return `https://wa.me/${numero}`
      },
      async pedirTurno(){
        await this.saveTurno()
        await this.actualizarMes()
      },
      async saveTurno(){
        const turno = this.crearTurno()
        try {
          const { data : res } = await this.axios.post(this.url, turno, { 'content-type' : 'application/json' })
          return res
        }catch(error) {
          console.error('Error en saveTurno', error.message) 
        }
      },
      crearTurno(){
        const turno = {
          fecha: new Date(this.formData.fecha),
          tipoServicio: this.formData.tipoServicio,
          clientId: this.formData.clientId,
          reqId: this.$store.state.currentUser._id
        }
        return turno
      },
      inicializarFecha(){
        this.fecha = new Date()
        return new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate())
      },
      setFechaInicio(){
        if(this.$store.state.globalConfig && this.$store.state.globalConfig.fechaInicio) {
          let fInicio = new Date(`${this.$store.state.globalConfig.fechaInicio}T00:00`)
          this.fechaInicio = fInicio
        }
      },
      cancelarTurno(turno){
        this.mensajeBorrar = `Confirma para cancelar el turno de:`
        this.mensajeNombre = `${turno.client.nombre} ${turno.client.apellido}`
        this.mensajeFecha = turno.fecha
        this.mensajeServicio = turno.tipoServicio
        this.mostrarMensaje = true
        this.turnoBorrado = {...turno}
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
        this.turnoBorrado = {}
      },
      async botonAceptar(){
        await this.actualizarTurno()
        await this.actualizarMes()
      },
      async actualizarTurno(){
        const turno = this.modificarTurno(this.turnoBorrado)
        try {
          const { data : res } = await this.axios.put(this.url + turno._id, turno, { 'content-type' : 'application/json' })
          this.setConfirmacion(res)
        }catch(error) {
          console.error('Error en cancelar turno (botonAceptar)', error.message) 
        }
      },
      modificarTurno(turno){
        const t = {
          _id: turno._id,
          fecha: turno.fecha,
          tipoServicio: turno.tipoServicio,
          clientId: turno.clientId,
          reqId: turno.reqId,
          estado: 'Cancelado'
        }
        return t
      },
      setConfirmacion(res){
        this.mostrarMensaje = false
        this.mostrarConfirmacion = true
        if(res.acknowledged) this.mensajeConfirmacion = 'Turno Cancelado'
        else if(res.error) this.mensajeConfirmacion = res.error
      },
    },
    computed: {
      mesActual(){
        return `${this.meses[this.fecha.getMonth()]}`
      },
      anioActual(){
        return `${this.fecha.getFullYear()}`
      },
      validarForm(){
        if(this.$store.state.currentUser) {
          if(this.selectClient || this.$store.state.currentUser.rol !== 'Owner'){
            return this.formData.clientId && this.formData.tipoServicio === 0
          } else return true
        } else return true
      },
      validarRol(){
        if(this.$store.state.currentUser) return this.$store.state.currentUser.rol === 'Owner'
        else return false
      },
    },
    watch: {
      selectClient: function(){
        if(this.selectClient) {
          if(this.$store.state.currentUser.rol === 'Owner') {
            this.formData.nombre = `${this.selectClient.nombre} ${this.selectClient.apellido}`
            this.formData.clientId = this.selectClient._id
          }
        }
      }
    }
}
</script>

<style scoped lang="css">
#fecha{
  font-size: larger;
}
#dia{
  font-size: xx-small;
}
a{
  color: white;
}.botones{
  font-size: x-small;
}
p{
  font-size: small;
  margin-bottom: 0;
}
span{
  font-weight: bold
}
</style>