<template>

  <section v-show="this.$store.state.isLogin">
    <div class="jumbotron mb-0 p-3">
      <div class="w-100">

        <div class="d-flex flex-column bd-highlight p-1 mb-3 border border-secondary rounded">
          <div class="mb-0">
            <p class="mb-2">
              En ésta sección puede definir que días va a habilitar para poder tomar turnos, 
              en que horario se pueden tomar los turnos, cuando inicia las actividades, también 
              puede cargar ausencias o vacaciones y actualizar los datos del usuario.
            </p>
            <p>Siéntase libre de realizar los cambios que desee y los verá reflejados en la sección 
              <span>Calendario</span>. Solo los usuarios con rol de <span>Owner</span> pueden hacer estas modificaciones
            </p>
          </div>
        </div>

        <h4>Configuración</h4>
        <button v-show="validarRol" class="btn btn-outline-dark ml-0" @click="mostrarHorario()">Calendario</button>
        <button class="btn btn-outline-dark ml-2" @click="mostrarMisDatos()">Mis Datos</button>

        <div v-show="validarRol" v-if="mostrar === 'horario'" class="m-0">
          <vue-form :state="formState" @submit.prevent="guardarConfig()">
            <div class="row">
              <div class="col-auto d-flex flex-column bd-highlight m-3 p-1 border border-secondary rounded">
                <div class="bd-highlight p-1">Dias:</div>
                <validate tag="div" v-for="(dia,index) in diasLaborales" :key="index">
                  <div class="bd-highlight">
                    <div class="d-flex justify-content-between">
                      <div class="d-flex">
                        <label class="m-1" :for=dia>{{ dia }}</label>
                      </div>
                      <div class="d-flex">
                        <input class="m-1" type="checkbox" :id=dia v-model="formData.dias[index]" :name=dia>
                      </div>
                    </div>
                  </div>
                </validate>
              </div>
              <div class="col-auto px-0">
                <div class="my-3 d-flex flex-column bd-highlight p-1 border border-secondary rounded">
                  <div class="bd-highlight p-1">Horas:</div>
                  <div class="bd-highlight">
                    <validate tag="div" v-for="(hora,index) in horasLaborales" :key="index">
                      <div class="d-flex flex-row bd-highlight justify-content-between p-1">
                        <div class="d-flex bd-highlight pr-0">
                          <label class="m-1" :for=hora>{{ hora }}</label>
                        </div>
                        <div class="d-flex bd-highlight pl-0">
                          <select class="m-1" type="text" :id=hora v-model="formData.horas[index]" :name=hora>
                            <option v-for="(hora,index) in opcionesHoras" :key="index">{{ hora }}</option>
                          </select>
                        </div>
                      </div>
                    </validate>
                  </div>
                </div>
                <div class="d-flex flex-column bd-highlight mb-3 p-1 border border-secondary rounded">
                  <validate tag="div">
                    <label class="bd-highlight mb-0 p-1" for="fechaInicio">Inicio de Actividades:</label>
                    <div class="bd-highlight p-1">
                      <input type="date" id="fechaInicio" name="fechaInicio" v-model="formData.fechaInicio">
                    </div>
                  </validate>
                </div>
              </div>
              <br>
            </div>
            <div class="row">
              <div class="col-auto d-flex flex-column bd-highlight mx-3 mb-3 p-1 border border-secondary rounded">

                <div class="bd-highlight p-1">Cargar Ausencias:</div>

                <validate tag="div" class="d-flex flex-row bd-highlight justify-content-between p-1">
                  <label class="bd-highlight m-0 p-1" for="fechaIni">Fecha Inicio:</label>
                  <div class="d-flex bd-highlight">
                    <input type="date" id="fechaIni" name="fechaIni" v-model="formData.fechaIni">
                  </div>
                </validate>

                <validate tag="div" class="d-flex flex-row bd-highlight justify-content-between p-1">
                  <label class="bd-highlight m-0 p-1" for="fechaFin">Fecha Fin:</label>
                  <div class="d-flex bd-highlight">
                    <input type="date" id="fechaFin" name="fechaFin" v-model="formData.fechaFin">
                  </div>
                </validate>

                <div class="btn btn-outline-dark ml-2 p-1" @click="agregarAusencias()">Agregar</div>

                <div v-if="mostrarMensajeError" class="text-danger ml-3 mt-1">{{ mensajeError }}</div>

                <div v-if="ausencias.length">
                  <div class="ml-2 mt-2">
                    <table class="table table-bordered mt-1">
                      <thead class="thead-light">
                        <tr id="encabezado">
                          <th class="p-1">#</th>
                          <th class="p-1">Fecha Inicio</th>
                          <th class="p-1">Fecha Fin</th>
                        </tr>
                      </thead>
                      <tr v-for="(item,index) in ausencias" :key="index">
                      <td class="p-1">{{ `${parseInt(index)+1}` }}</td>
                      <td class="p-1">{{ item.fechaIni | formatoFecha }}</td>
                      <td class="p-1">{{ item.fechaFin | formatoFecha }}</td>
                      <td class="p-1">
                        <div class="botones btn btn-outline-dark" @click="borrarFechas(index)">Borrar</div>
                      </td>
                      </tr>
                    </table>
                  </div>
                </div>

              </div>
            </div>
            <button class="m-0 btn btn-outline-dark" :disabled="activarBtn">Guardar</button>
          </vue-form>
        </div>

        <div v-if="mostrar === 'misDatos'" class="m-0">
          <Register :modoEdit="modoEdit"/>
        </div>

      </div>
    </div>
  </section>

</template>

<script>
  import Register from './Register.vue'
  export default  {
    name: 'src-components-configuration',
    components: {
      Register,
    },
    props: [],
    mounted () {
      this.enviarLogin()
      this.cargarHorario()
    },
    beforeUpdate (){
      this.$store.dispatch('lastActivity')
      this.$store.dispatch('globalConfig')
    },
    data () {
      return {
        url: this.$store.state.url + 'settings/',
        formState: {},
        formData: this.getInitialData(),
        diasLaborales: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        horasLaborales: ['Inicio', 'Fin'],
        opcionesHoras: [
          '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
          '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00' 
        ],
        mostrar: 'horario',
        ausencias: [],
        mostrarMensajeError: false,
        mensajeError: '',
        activarBtnSave: false,
        modoEdit: false,
      }
    },
    methods: {
      enviarLogin(){
        if(!this.$store.state.isLogin){
          this.$router.push('/')
        }
      },
      cargarHorario (){
        if(this.$store.state.globalConfig) {
          this.formData = { ...this.$store.state.globalConfig }
          this.setAusencias()
        }
      },
      setAusencias(){
        this.$store.state.globalConfig.ausencias.forEach(item => {
          const fechaIni = new Date (item.fechaIni)
          const fechaFin = new Date(item.fechaFin)
          this.pushObjeto(fechaIni, fechaFin)
        });
      },
      pushObjeto(fechaIni, fechaFin){
        const objeto = {
          fechaIni: fechaIni,
          fechaFin: fechaFin,
        }
        this.ausencias.push(objeto)
      },
      getInitialData() {
        return {
          dias: [false,false,false,false,false,false,false],
          horas: ['06:00','21:00'],
          fechaInicio: '2023-01-01',
          fechaIni: '2023-01-01',
          fechaFin: '2023-01-01',
        }
      },
      mostrarHorario(){
        this.mostrar = 'horario'
      },
      mostrarMisDatos(){
        this.modoEdit = true
        this.mostrar = 'misDatos'
      },
      async guardarConfig(){
        if(this.validarHoras()){
          if(this.$store.state.globalConfig){
            const res = await this.updateConfig()
            if(res.modifiedCount || res.upsertedCount) {
              this.$store.dispatch('globalConfig')
              alert(`Configuración actualizada exitosamente!`)
            }
            else alert(`No se pudo actualizar la configuración`)
          }else{
            const res = await this.saveConfig()
            if(res.acknowledged) {
              this.$store.dispatch('globalConfig')
              alert(`Configuración guardada exitosamente!`)
            }
            else alert(`No se pudo guardar la configuración`)
          }
        } else alert(`La hora de inicio debe ser menor a la hora de finalización de jornada`)
        this.formState._reset()
      },
      async saveConfig(){
        const config = this.crearConfig({ ...this.formData })
        try {
          const { data : res } = await this.axios.post(this.url, config, { 'content-type' : 'application/json' })
          return res
        }catch(error) {
          console.error('Error en saveConfig', error.message) 
        }
      },
      async updateConfig(){
        const config = this.crearConfig({ ...this.formData })
        try {
          const { data : res } = await this.axios.put(this.url, config, { 'content-type' : 'application/json' })
          return res
        }catch(error) {
          console.error('Error en updateConfig', error.message) 
        }
      },
      crearConfig(config){
        return {
          dias: config.dias,
          horas: config.horas,
          fechaInicio: config.fechaInicio,
          ausencias: Array.from(this.ausencias)
        }
      },
      validarHoras(){
        const data = { ...this.formData }
        const horas = this.opcionesHoras
        return horas.indexOf(data.horas[0]) < horas.indexOf(data.horas[1])
      },
      agregarAusencias(){
        if(this.formData.fechaIni && this.formData.fechaFin){
          const fechaIni = new Date(`${this.formData.fechaIni}T00:00`)
          const fechaFin = new Date(`${this.formData.fechaFin}T00:00`)
          if(fechaIni.getTime() < fechaFin.getTime()){
            this.pushObjeto(fechaIni, fechaFin)
            this.setMensajeError('', false)
          }else{
            this.setMensajeError('Error en fechas seleccionadas', true)
          }
        }else{
          this.setMensajeError('Debe seleccionar fechas', true)
        }
      },
      setMensajeError(mensaje, validacion){
        this.mensajeError = mensaje
        this.mostrarMensajeError = validacion
      },
      borrarFechas(item){
        this.ausencias.splice(item,1)
        this.activarBtnSave = true
      }
    },
    computed: {
      validarRol(){
        if(this.$store.state.currentUser) return this.$store.state.currentUser.rol === 'Owner'
        else return false
      },
      activarBtn(){
        return !this.formState.$touched && !this.formState.$dirty && !this.activarBtnSave
      },
    }
}
</script>

<style scoped lang="css">
#encabezado{
  font-size: x-small;
}
.botones{
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
