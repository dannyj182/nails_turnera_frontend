import Vue from "vue";
import VueForm from "vue-form";

let options = {
    validators : {
        matches: function (value, attrValue) {
            if(!attrValue) {
                return true;
            }
            return value === attrValue;
        },
        'password-strength': function (value) {
            return /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value);
        },
        'mail-format': function (value) {
            return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
        },
        'solo-numeros': function (value) {
            return /^[0-9]+$/.test(value);
        },
        'value-zero': function (value) {
            return value;
        },
    }
}

Vue.use(VueForm, options)