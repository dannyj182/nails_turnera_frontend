import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios)
Vue.use(Vuex)

export default new Vuex.Store({
    state : {
        isLogin : false,
        currentUser: null,
        globalConfig: null,
        lastActivity: null,
        //url: 'http://192.168.0.167:8082/',
        url: '',
    },
    actions : {
        desloguearse({commit}){
            commit('desloguearse')   
        },
        loguearse({commit}, res) {
            commit('loguearse', res)  
        },
        lastActivity({commit}){
            commit('lastActivity')
        },
        currentUser({commit}) {
            commit('currentUser')
        },
        globalConfig({commit}) {
            commit('globalConfig')
        },
    },
    mutations : {
        desloguearse(state) {
            state.isLogin = false
            state.currentUser = null
        },
        loguearse(state, res) {
            state.isLogin = true
            state.currentUser = res.usuario
            state.globalConfig = res.config
        },
        lastActivity(state) {
            state.lastActivity = new Date()
        },
        async currentUser(state) {
            if(state.currentUser){
                try {
                    const { data : currentUser } = await axios(state.url + 'usuarios/' + state.currentUser._id)
                    state.currentUser = currentUser
                } catch (error) { console.error('Error en currentUser', error.message) }
            }
        },
        async globalConfig(state){
            if(state.currentUser){
                try {
                    const { data : globalConfig } = await axios(state.url + 'settings/')
                    state.globalConfig = globalConfig
                }catch(error) { console.error('Error en globalConfig', error.message) }
            }
        },
    },
    plugins:[
        new VuexPersistence({
            storage: window.sessionStorage
        }).plugin
    ]
})