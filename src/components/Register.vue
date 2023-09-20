<template>

  <section>
    <div :class=setClase>
      <div v-if="( !this.$store.state.isLogin || modoEdit || modoAlta ) && ( !mostrarMensaje )">
        <h4 v-if="!modoEdit && !modoAlta">Regístrese</h4>
        <h4 v-if="modoAlta">Nuevo Cliente</h4>
        <vue-form :state="formState" @submit.prevent="register()">

          <div>
            <validate tag="div">
              <label class="mt-2" for="nombre">Nombre</label>
              <input type="text" id="nombre" autocomplete="off" v-model.trim="formData.nombre"
              name="nombre" :class="fieldClassName(formData.nombre, formState.nombre)"
              required
              :minlength="nombreMinLength"
              :maxlength="nombreMaxLength"
              placeholder="Ingrese su nombre" />
              <field-messages name="nombre" show="$touched || $dirty">
                <div slot="required" class="text-danger pl-1">Campo requerido</div>
                <div slot="minlength" class="text-danger pl-1">Nombre de al menos {{ nombreMinLength }} caracteres</div>
              </field-messages>
            </validate>

            <validate tag="div">
              <label class="mt-2" for="apellido">Apellido</label>
              <input type="text" id="apellido" autocomplete="off" v-model.trim="formData.apellido"
              name="apellido" :class="fieldClassName(formData.apellido, formState.apellido)"
              required
              :minlength="apellidoMinLength"
              :maxlength="apellidoMaxLength"
              placeholder="Ingrese su apellido" />
              <field-messages name="apellido" show="$touched || $dirty">
                <div slot="required" class="text-danger pl-1">Campo requerido</div>
                <div slot="minlength" class="text-danger pl-1">Apellido de al menos {{ apellidoMinLength }} caracteres</div>
              </field-messages>
            </validate>
          </div>

          <div>
            <validate tag="div" v-if="!modoEdit">
              <label class="mt-2" for="codigo">Codigo de Área</label>
              <input type="text" id="codigo" autocomplete="off" v-model.trim="formData.codigo"
              name="codigo" :class="fieldClassName(formData.codigo, formState.codigo)"
              required
              :minlength="codigoMinLength"
              :maxlength="codigoMaxLength"
              solo-numeros
              placeholder="Ej. 54911" />
              <field-messages name="codigo" show="$touched || $dirty">
                <div slot="required" class="text-danger pl-1">Campo requerido</div>
                <div slot="minlength" class="text-danger pl-1">Código de área al menos de {{ codigoMinLength }} digitos</div>
                <div slot="solo-numeros" class="text-danger pl-1">Ingrese solo números</div>
              </field-messages>
            </validate>

            <validate tag="div">
              <label class="mt-2" for="celular">Celular</label>
              <input type="text" id="celular" autocomplete="off" v-model.trim="formData.celular"
              name="celular" :class="fieldClassName(formData.celular, formState.celular)"
              required
              :minlength="celularMinLength"
              :maxlength="celularMaxLength"
              solo-numeros
              placeholder="Ej. 12345678" />
              <field-messages name="celular" show="$touched || $dirty">
                <div slot="required" class="text-danger pl-1">Campo requerido</div>
                <div slot="minlength" class="text-danger pl-1">Número de celular al menos de {{ celularMinLength }} digitos</div>
                <div slot="solo-numeros" class="text-danger pl-1">Ingrese solo números</div>
              </field-messages>
            </validate>

            <validate tag="div">
              <label class="mt-2" for="email">Email</label>
              <input type="text" id="email" autocomplete="off" v-model.trim="formData.email"
              name="email" :class="fieldClassName(formData.email, formState.email)"
              required
              :minlength="correoMinLength"
              :maxlength="correoMaxLength"
              placeholder="Ingrese Email" />
              <field-messages name="email" show="$touched || $dirty">
                <div slot="required" class="text-danger pl-1">Campo requerido</div>
                <div slot="minlength" class="text-danger pl-1">Correo de al menos {{ correoMinLength }} caracteres</div>
              </field-messages>
            </validate>

            <validate tag="div">
              <label class="mt-2" for="dominio">Dominio</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text">@</div>
                </div>
                <select type="text" id="dominio" autocomplete="off" v-model="formData.dominio"
                name="dominio" :class="fieldClassName(formData.dominio, formState.dominio)"
                required
                value-zero
                placeholder="Ej. gmail.com">
                  <option disabled value="0">Seleccione una opción</option>
                  <option>gmail.com</option>
                  <option>outlook.com</option>
                  <option>hotmail.com</option>
                  <option>yahoo.com</option>
                </select>
              </div>
              <field-messages name="dominio" show="$touched || $dirty">
                <div slot="value-zero" class="text-danger pl-1">Campo requerido</div>
              </field-messages>
            </validate>

          </div>

          <div>
            <validate tag="div">
              <label class="mt-2" for="password">Contraseña</label>
              <input type="password" id="password" autocomplete="off" v-model.trim="formData.password"
              name="password" :class="fieldClassName(formData.password, formState.password)"
              required
              password-strength
              placeholder="Ingrese la Contraseña" />
              <field-messages name="password" show="$touched || $dirty">
                <div slot="required" class="text-danger pl-1">Campo requerido</div>
                <div slot="password-strength" class="text-danger pl-1">
                  La contraseña requiere mayúsculas, minúsculas, números o caracteres especiales y un mínimo de 8 caracteres</div>
              </field-messages>
            </validate>

            <validate tag="div">
              <label class="mt-2" for="confirmPassword">Repita la Contraseña</label>
              <input type="password" id="confirmPassword" autocomplete="off" v-model.trim="formData.confirmPassword"
              name="confirmPassword" :class="fieldClassName(formData.confirmPassword, formState.confirmPassword)"
              required
              :matches="formData.password"
              placeholder="Repita la Contraseña" />
              <field-messages name="confirmPassword" show="$touched || $dirty">
                <div slot="required" class="text-danger pl-1">Campo requerido</div>
                <div slot="matches" class="text-danger pl-1">Contraseñas no coinciden</div>
              </field-messages>
            </validate>
          </div>

          <button class="btn btn-outline-dark mt-3" :disabled="formState.$invalid">{{ mensajeBoton }}</button>
          <br>
          <hr v-if="!modoEdit && !modoAlta">
        </vue-form>
        <a v-if="!modoEdit && !modoAlta" href="#" class="text-primary" @click="$router.push('/login')">Iniciar Sesión</a>
      </div>
      <div v-if="mostrarMensaje">
        <div>
          {{mensajeRegister}}
        </div>
        <button class="btn btn-outline-dark mt-3" @click="botonAceptar()">Aceptar</button>
      </div>
    </div>
  </section>


</template>

<script>
  export default {
    name: 'src-components-register',
    props: {
      modoEdit: Boolean,
      modoAlta: Boolean,
    },
    mounted () {
      this.enviarIndex()
    },
    data () {
      return {
        url: this.$store.state.url + 'usuarios/',
        formState: {},
        formData: this.getInitialData(),
        nombreMinLength: 3,
        nombreMaxLength: 20,
        apellidoMinLength: 4,
        apellidoMaxLength: 20,
        codigoMinLength: 2,
        codigoMaxLength: 5,
        celularMinLength: 7,
        celularMaxLength: this.getCelularMaxLength(),
        correoMinLength: 5,
        correoMaxLength: 20,
        mensajeRegister: '',
        mostrarMensaje: false,
        registroExitoso: false,
      }
    },
    methods: {
      enviarIndex(){
        if(this.$store.state.isLogin && !this.modoEdit && !this.modoAlta ){
          this.$router.push('/')
        }
      },
      getInitialData(){
        if(this.modoEdit) return this.getInitialDataUser()
        else return this.getInitialDataVoid()
      },
      getInitialDataUser() {
        if(this.$store.state.currentUser){
          let array = this.getEmailArray()
          return {
            nombre: this.$store.state.currentUser.nombre,
            apellido: this.$store.state.currentUser.apellido,
            codigo: '',
            celular: this.$store.state.currentUser.celular,
            email: array[0],
            dominio: array[1],
            password: null,
            confirmPassword: null,
          }
        }else return this.getInitialDataVoid()
      },
      getEmailArray(){
        if(this.$store.state.currentUser.email){
          return this.$store.state.currentUser.email.split("@")
        }
      },
      getInitialDataVoid() {
        return {
          nombre: null,
          apellido: null,
          codigo: null,
          celular: null,
          email: null,
          dominio: 0,
          password: null,
          confirmPassword: null,
        }
      },
      crearUsuario(usuario){
        let array = usuario.email.split("@")
        return {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          celular: `${usuario.codigo}${usuario.celular}`,
          email: `${array[0].toLowerCase()}@${usuario.dominio}`,
          password: usuario.password
        }
      },
      async register() {
        const user = this.crearUsuario({ ...this.formData })
        if(this.modoEdit) await this.actualizarUsuario(user)
        else await this.registrarUsuario(user)
        this.limpiarForm()
        this.mostrarMensaje = true
      },
      async registrarUsuario(user){
        const resultado = await this.registerUser(user)
        if(resultado.acknowledged) {
          if(this.modoAlta) this.mensajeRegister = `Cliente agregado`
          else this.mensajeRegister = `Hola ${user.nombre}, su cuenta está a la espera de que la apruebe el administrador`
          this.registroExitoso = true
        }else{
          this.mensajeRegister = resultado.error
          this.registroExitoso = false
        }
      },
      async registerUser(user) {
        try {
          let { data : resultado } =  await this.axios.post(this.url, user, { 'content-type' : 'application/json' })
          return resultado
        }
        catch(error) { console.error('Error en registerUser', error.message) }
      },
      async actualizarUsuario(user){
        const resultado = await this.updateUser(user)
        if(resultado.acknowledged) {
          this.mensajeRegister = `Datos almacenados exitosamente!`
          this.registroExitoso = true
          this.$store.dispatch('currentUser')
        }else{
          this.mensajeRegister = resultado.error
          this.registroExitoso = false
        }
      },
      async updateUser(user) {
        try {
          const usuario = this.$store.state.currentUser
          let { data : resultado } =  await this.axios.put(this.url + usuario._id, user, { 'content-type' : 'application/json' })
          return resultado
        }
        catch(error) { console.error('Error en updateUser', error.message) }
      },
      limpiarForm() {
        this.formData = this.getInitialData();
        this.formState._reset();
      },
      botonAceptar(){
        if(this.registroExitoso) {
          if(this.modoEdit || this.modoAlta) {
            this.mostrarMensaje = false
            this.$emit('registroCompletado', true)
          }
          else this.$router.push('/')
        }
        else {
          this.mostrarMensaje = false
          this.limpiarForm()
        }
      },
      fieldClassName(formData, formState){
        if(formState){
          if( (formState.$touched || formState.$dirty) && (!formData || formState.$invalid) ) return 'form-control is-invalid'
          else if( ( formState.$touched || formState.$dirty ) && formState.$valid ) return 'form-control is-valid'
        }
        return 'form-control'
      },
      getCelularMaxLength(){
        if(this.modoEdit) return 13
        else return 8
      }
    },
    computed: {
      setClase(){
        if(this.modoEdit) return 'jumbotron mb-0 p-3'
        if(this.modoAlta) return 'jumbotron mb-0 p-3'
        else return 'jumbotron mb-0 p-5'
      },
      mensajeBoton(){
        if(this.modoEdit) return 'Guardar'
        else return 'Enviar'
      }
    }
}
</script>

<style scoped lang="css">
.required-field > label::after {
  content: '*';
  color: red;
  margin-left: 0.25rem;
}
</style>