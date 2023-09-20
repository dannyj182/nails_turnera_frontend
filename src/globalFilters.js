import Vue from 'vue'

Vue.filter('mostrarDiaDelMes', function(value){
    let mensaje
    if(value){
        let dia = value.getDate()
        if( dia < 10 ) mensaje = `0${value.getDate()}`
        else mensaje = `${value.getDate()}`
    }else{
        mensaje = ''
    }
    return mensaje
})
Vue.filter('enabled', function(value){
    if(value) return 'Deshabilitar'
    else return 'Habilitar'
})
Vue.filter('mostrarFecha', function(value){
    if(value){
        const mes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        return `${value.getDate()} de ${mes[value.getMonth()]}`
    }else return ''
})
Vue.filter('mostrarTipoServicio', function(value){
    if(value){
        value = parseInt(value)
        const servicio = ["Pies","Manos","Manos y Pies"]
        return `${servicio[--value]}`
    }else return ''
})
Vue.filter('mostrarHora', function(value){
    if(value){
        if(value.getHours() < 10 ) return `0${value.getHours()}:00`
        else return `${value.getHours()}:00`
    }else return ''
})
Vue.filter('formatoFecha', function(value){
    if (typeof value === "string"){
        value = new Date(value)
        let mes = value.getMonth()+1
        let dia = value.getDate()
        let hora = value.getHours()
        if(hora < 10) hora = `0${hora}`
        if(mes < 10) mes = `0${mes}`
        if(dia < 10) dia = `0${dia}`
        return `${dia}-${mes}-${value.getFullYear()} ${hora}:00`
    }
    if(value){
        let mes = value.getMonth()+1
        let dia = value.getDate()
        if(mes < 10) mes = `0${mes}`
        if(dia < 10) dia = `0${dia}`
        return `${dia}-${mes}-${value.getFullYear()}`
    }else return ''

})
Vue.filter('formatoNombre', function(value){
    if(value){
        const array = value.split(" ")
        return array[0]
    }else return ''
})
Vue.filter('tipoServicio', function(value){
    if(value){
        const tipoServicio = ["Pies","Manos","Manos y Pies"]
        return tipoServicio[value - 1]
    }else return ''
})