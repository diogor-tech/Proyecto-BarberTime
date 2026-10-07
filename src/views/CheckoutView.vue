<script setup>
import Sidebar from "@/components/Sidebar.vue"
import { ref, computed } from "vue"

const sidebarMinimized = ref(false)

const handleToggleSidebar = (v)=>{
  sidebarMinimized.value=v
}

const carrito =
JSON.parse(localStorage.getItem("cart")) || []

const total = computed(()=>{

return carrito.reduce((s,p)=>{

const precio=p.discount
? Math.round(p.price-p.price*p.discount/100)
: p.price

return s+precio*p.cantidad

},0)

})

const nombre=ref("")
const telefono=ref("")
const direccion=ref("")
const pago=ref("Tarjeta")

const finalizarCompra=()=>{

alert("✅ Compra realizada correctamente")

localStorage.removeItem("cart")

window.location.href="/store"

}
</script>

<template>

<div class="page-shell">

<Sidebar
@toggleSidebar="handleToggleSidebar"
/>

<main :class="['main-content',{'sidebar-minimized':sidebarMinimized}]">

<h1>Finalizar compra</h1>

<div class="checkout">

<div class="form">

<input
v-model="nombre"
placeholder="Nombre completo"
/>

<input
v-model="telefono"
placeholder="Teléfono"
/>

<input
v-model="direccion"
placeholder="Dirección"
/>

<select v-model="pago">

<option>Tarjeta</option>

<option>Transferencia</option>

<option>Efectivo</option>

</select>

<button @click="finalizarCompra">

Confirmar compra

</button>

</div>

<div class="resume">

<h2>Resumen</h2>

<div
v-for="item in carrito"
:key="item.id"
class="item"
>

<span>

{{item.name}}

</span>

<span>

x{{item.cantidad}}

</span>

</div>

<hr>

<h3>

Total:

${{total}}

</h3>

</div>

</div>

</main>

</div>

</template>

<style scoped>

.main-content{
margin-left:280px;
padding:50px;
background:#0f172a;
min-height:100vh;
}

.sidebar-minimized{
margin-left:80px;
}

h1{
color:white;
margin-bottom:40px;
}

.checkout{
display:grid;
grid-template-columns:2fr 1fr;
gap:40px;
}

.form{

background:#111827;

padding:35px;

border-radius:20px;

display:flex;

flex-direction:column;

gap:20px;

}

.form input,
.form select{

padding:16px;

border:none;

border-radius:12px;

background:#1f2937;

color:white;

}

.form button{

padding:18px;

border:none;

border-radius:14px;

background:linear-gradient(135deg,#BF924B,#F3DDA7);

font-weight:bold;

cursor:pointer;

}

.resume{

background:#111827;

padding:35px;

border-radius:20px;

color:white;

}

.item{

display:flex;

justify-content:space-between;

margin:18px 0;

}

hr{

margin:20px 0;

border:.5px solid #444;

}

</style>