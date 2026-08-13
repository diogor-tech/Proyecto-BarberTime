<script setup>

import { ref, computed } from "vue"

const hoy = new Date()

const año = ref(hoy.getFullYear())
const mes = ref(hoy.getMonth())

const diaSeleccionado = ref(null)
const horaSeleccionada = ref(null)

const meses = [
"Enero",
"Febrero",
"Marzo",
"Abril",
"Mayo",
"Junio",
"Julio",
"Agosto",
"Septiembre",
"Octubre",
"Noviembre",
"Diciembre"
]

const horarios = [

"08:00",
"08:30",
"09:00",
"09:30",
"10:00",
"10:30",
"11:00",
"11:30",
"12:00",
"12:30",
"13:00",
"13:30",
"14:00",
"14:30",
"15:00",
"15:30",
"16:00",
"16:30",
"17:00",
"17:30",
"18:00",
"18:30",
"19:00",
"19:30",
"20:00"

]

const reservas = ref([])

const diasDelMes = computed(()=>{

    return new Date(
        año.value,
        mes.value + 1,
        0
    ).getDate()

})

const primerDia = computed(()=>{

    let dia = new Date(
        año.value,
        mes.value,
        1
    ).getDay()

    if(dia===0){

        dia=7

    }

    return dia-1

})

function seleccionarDia(dia){

    diaSeleccionado.value=dia

    horaSeleccionada.value=null

}

function seleccionarHora(hora){

    if(ocupado(hora)) return

    horaSeleccionada.value=hora

}

function ocupado(hora){

    return reservas.value.some(r=>{

        return(

            r.año===año.value &&

            r.mes===mes.value &&

            r.dia===diaSeleccionado.value &&

            r.hora===hora

        )

    })

}

function reservar(){

    if(!diaSeleccionado.value){

        alert("Selecciona un día")

        return

    }

    if(!horaSeleccionada.value){

        alert("Selecciona una hora")

        return

    }

    reservas.value.push({

        año:año.value,

        mes:mes.value,

        dia:diaSeleccionado.value,

        hora:horaSeleccionada.value

    })

    alert("Reserva realizada")

    horaSeleccionada.value=null

}

function mesAnterior(){

    mes.value--

    if(mes.value<0){

        mes.value=11

        año.value--

    }

    diaSeleccionado.value=null

}

function mesSiguiente(){

    mes.value++

    if(mes.value>11){

        mes.value=0

        año.value++

    }

    diaSeleccionado.value=null

}

</script>
<template>

<div class="agenda">

    <div class="calendar">

        <div class="calendar-header">

            <button @click="mesAnterior">
                ◀
            </button>

            <h2>
                {{ meses[mes] }} {{ año }}
            </h2>

            <button @click="mesSiguiente">
                ▶
            </button>

        </div>

        <div class="diasSemana">

            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
            <div>Dom</div>

        </div>

        <div class="dias">

            <div
                v-for="n in primerDia"
                :key="'vacio'+n"
                class="vacio"
            ></div>

            <div

                v-for="dia in diasDelMes"

                :key="dia"

                class="dia"

                :class="{

                    activo: diaSeleccionado==dia

                }"

                @click="seleccionarDia(dia)"

            >

                {{ dia }}

            </div>

        </div>

    </div>



    <div
        v-if="diaSeleccionado"
        class="horarios"
    >

        <h3>

            Horarios del {{ diaSeleccionado }}

        </h3>

        <div

            v-for="hora in horarios"

            :key="hora"

            class="hora"

            :class="{

                ocupado: ocupado(hora),

                seleccionado: horaSeleccionada==hora

            }"

            @click="seleccionarHora(hora)"

        >

            {{ hora }}

        </div>

    </div>

</div>

</template>
<style scoped>
.agenda{
    display:flex;
    gap:40px;
    align-items:flex-start;
    padding:30px;
    flex-wrap:wrap;
}

.calendar{
    width:420px;
    background:#181818;
    border-radius:20px;
    padding:25px;
    box-shadow:0 0 20px rgba(0,0,0,.35);
}

.calendar-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:25px;
}

.calendar-header h2{
    color:#fff;
    margin:0;
    font-size:24px;
}

.calendar-header button{
    width:42px;
    height:42px;
    border:none;
    border-radius:50%;
    background:#d4af37;
    color:#111;
    font-size:20px;
    cursor:pointer;
    transition:.3s;
}

.calendar-header button:hover{
    transform:scale(1.08);
}

.diasSemana{
    display:grid;
    grid-template-columns:repeat(7,1fr);
    margin-bottom:10px;
    text-align:center;
}

.diasSemana div{
    color:#c5c5c5;
    font-weight:bold;
}

.dias{
    display:grid;
    grid-template-columns:repeat(7,1fr);
    gap:8px;
}

.vacio{
    height:48px;
}

.dia{
    height:48px;
    display:flex;
    justify-content:center;
    align-items:center;
    border-radius:10px;
    background:#252525;
    color:white;
    cursor:pointer;
    transition:.3s;
}

.dia:hover{
    background:#d4af37;
    color:#111;
}

.activo{
    background:#d4af37;
    color:#111;
    font-weight:bold;
}

.horarios{
    width:380px;
    background:#181818;
    border-radius:20px;
    padding:25px;
}

.horarios h3{
    color:white;
    margin-bottom:20px;
}

.hora{
    background:#252525;
    color:white;
    padding:14px;
    border-radius:10px;
    margin-bottom:12px;
    cursor:pointer;
    transition:.3s;
    text-align:center;
}

.hora:hover{
    background:#d4af37;
    color:#111;
}

.seleccionado{
    background:#d4af37;
    color:#111;
    font-weight:bold;
}

.ocupado{
    background:#b91c1c;
    color:white;
    cursor:not-allowed;
}

.btnReservar{
    width:100%;
    margin-top:25px;
    padding:15px;
    border:none;
    border-radius:12px;
    background:#d4af37;
    color:#111;
    font-size:17px;
    font-weight:bold;
    cursor:pointer;
    transition:.3s;
}

.btnReservar:hover{
    transform:scale(1.03);
}
</style>
