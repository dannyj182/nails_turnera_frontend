import Vue from "vue";
import VueRouter from "vue-router"

/* Componentes para rutas */
import Inicio from './components/Index.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Turnos from './components/Turnos.vue'
import Calendario from './components/Calendario.vue'
import Clientes from './components/Clientes.vue'
import Configuration from './components/Configuration.vue'
import NotFound from './components/NotFound.vue'

Vue.use(VueRouter)

export const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', redirect: '/index'},
        {path : '/index' , component: Inicio },
        {path : '/login' , component: Login },
        {path : '/Register' , component: Register },
        {path : '/turnos' , component: Turnos },
        {path : '/calendario' , component: Calendario },
        {path : '/clientes' , component: Clientes },
        {path : '/configuracion' , component: Configuration },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    ]
})