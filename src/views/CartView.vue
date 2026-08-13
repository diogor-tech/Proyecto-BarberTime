<script setup>
import Sidebar from "@/components/Sidebar.vue"
import { ref, computed } from "vue"

const sidebarMinimized = ref(false)

const handleToggleSidebar = (value) => {
  sidebarMinimized.value = value
}

const carrito = ref(
  JSON.parse(localStorage.getItem("cart")) || []
)

const total = computed(() => {
  return carrito.value.reduce((sum, producto) => {

    const precio =
      producto.discount
        ? producto.price - (producto.price * producto.discount / 100)
        : producto.price

    return sum + precio * producto.cantidad

  }, 0)
})

const guardarCarrito = () => {
  localStorage.setItem(
    "cart",
    JSON.stringify(carrito.value)
  )
}

const aumentar = (producto) => {
  producto.cantidad++
  guardarCarrito()
}

const disminuir = (producto) => {

  if (producto.cantidad > 1) {
    producto.cantidad--
  }

  guardarCarrito()
}

const eliminar = (id) => {

  carrito.value =
    carrito.value.filter(
      p => p.id !== id
    )

  guardarCarrito()
}
</script>

<template>

<div class="page-shell">

<Sidebar
@toggleSidebar="handleToggleSidebar"
/>

<main :class="['main-content',{ 'sidebar-minimized': sidebarMinimized }]">

<h1>🛒 Mi carrito</h1>

<div
v-if="carrito.length"
>

<div
class="card"
v-for="producto in carrito"
:key="producto.id"
>

<img :src="producto.image">

<div class="info">

<h2>{{producto.name}}</h2>

<p>{{producto.brand}}</p>

<h3>${{producto.price}}</h3>

<div class="cantidad">

<button @click="disminuir(producto)">-</button>

<span>{{producto.cantidad}}</span>

<button @click="aumentar(producto)">+</button>

</div>

<button
class="delete"
@click="eliminar(producto.id)"
>

Eliminar

</button>

</div>

</div>

<div class="total">

<h2>Total</h2>

<h1>${{total}}</h1>

<button @click="$router.push('/checkout')">
Finalizar compra

</button>

</div>

</div>

<h2
v-else
class="empty"
>

Tu carrito está vacío 🛒

</h2>

</main>

</div>

</template>

<style scoped>

.main-content{
margin-left:280px;
padding:50px;
background:#0f172a;
min-height:100vh;
transition:.3s;
}

.sidebar-minimized{
margin-left:80px;
}

h1{
color:white;
margin-bottom:35px;
}

.card{

display:flex;
gap:25px;
background:#111827;
padding:20px;
border-radius:20px;
margin-bottom:25px;

}

.card img{

width:160px;
height:160px;
object-fit:cover;
border-radius:15px;

}

.info{

display:flex;
flex-direction:column;
justify-content:center;
color:white;
flex:1;

}

.info p{

color:#9ca3af;

}

.info h3{

color:#BF924B;
margin:10px 0;

}

.cantidad{

display:flex;
gap:15px;
align-items:center;
margin-top:15px;

}

.cantidad button{

width:35px;
height:35px;
border:none;
border-radius:10px;
cursor:pointer;
background:#BF924B;
font-size:18px;

}

.delete{

margin-top:20px;
width:170px;
padding:12px;
border:none;
border-radius:10px;
cursor:pointer;
background:#dc2626;
color:white;

}

.total{

margin-top:40px;
background:#111827;
padding:35px;
border-radius:20px;
text-align:right;
color:white;

}

.total h1{

color:#BF924B;

}

.buy{

margin-top:20px;
padding:15px 35px;
border:none;
border-radius:12px;
cursor:pointer;
font-weight:bold;
background:linear-gradient(135deg,#BF924B,#F3DDA7);

}

.empty{

color:white;
text-align:center;
margin-top:120px;

}
</style>