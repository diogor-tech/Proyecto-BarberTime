<script setup>
import Sidebar from "@/components/Sidebar.vue"
import { ref, computed } from "vue"
import Login from "@/components/Login.vue"
import { UserRound } from "lucide-vue-next"

const sidebarMinimized = ref(false)
const showLogin = ref(false)

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

<header class="topbar">
  <div>
    <h1>Mi carrito</h1>
    <p>Revisa tus productos antes de finalizar la compra.</p>
  </div>
  <div class="user-box">
    <input type="text" placeholder="Buscar producto..." />
    <div class="avatar-box" @click="showLogin = true">
      <UserRound class="user-icon" />
    </div>
  </div>
</header>

<div v-if="carrito.length" class="cart-layout">

<section class="cart-items">

<div
class="card"
v-for="producto in carrito"
:key="producto.id"
>

<img :src="producto.image" :alt="producto.name">

<div class="info">

<h2>{{producto.name}}</h2>

<p>{{producto.brand}}</p>

<h3>${{ Math.round(producto.price - producto.price * (producto.discount || 0) / 100) }}</h3>

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

</section>

<aside class="total">

<h2>Total</h2>

<h1>${{total}}</h1>

<button class="checkout-btn" @click="$router.push('/checkout')">
Finalizar compra

</button>

</aside>

</div>

<div v-else class="empty">
<h2>

Tu carrito está vacío 🛒

</h2>
<p>Añade herramientas y productos profesionales para continuar.</p>
</div>

</main>

<Login v-if="showLogin" @close="showLogin = false" />

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

.topbar { margin-bottom: 35px; }
.topbar h1 { margin: 6px 0 8px; font-family: 'FuenteBlesh', sans-serif; }
.topbar p { color: #9ca3af; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 45px; }
.user-box { display: flex; align-items: center; gap: 20px; }
.user-box input { width: 280px; padding: 15px 20px; border: none; border-radius: 14px; background: #1f2937; color: white; outline: none; }
.user-box input::placeholder { color: #9ca3af; }
.avatar-box { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: linear-gradient(135deg, rgba(191,146,75,.12), rgba(255,183,67,.08)); border: 1px solid rgba(255,255,255,.06); cursor: pointer; }
.user-icon { width: 28px; height: 28px; color: #BF924B; }
.cart-layout { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 28px; align-items: start; }
.cart-items { display: grid; gap: 18px; }
.card { background: #1a1a1a; border: 1px solid rgba(255, 255, 255, 0.08); }
.card img { width: 150px; height: 150px; }
.total { position: sticky; top: 25px; margin-top: 0; text-align: left; border: 1px solid rgba(191, 146, 75, 0.2); }
.checkout-btn { width: 100%; padding: 14px; border: none; border-radius: 11px; background: linear-gradient(135deg, #BF924B, #ffb743); color: #000; font-weight: 700; cursor: pointer; }
.empty { margin-top: 0; padding: 70px 30px; background: #1a1a1a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; }
.empty p { margin-top: 12px; color: #9ca3af; }
.main-content { width: calc(100% - 280px); padding: 35px 100px 50px; background: transparent; }
.main-content.sidebar-minimized { width: calc(100% - 80px); padding: 35px 120px 50px; }
@media (max-width: 900px) {
  .main-content, .main-content.sidebar-minimized { margin-left: 80px; width: calc(100% - 80px); padding: 25px 30px 40px; }
  .cart-layout { grid-template-columns: 1fr; }
  .total { position: static; }
  .topbar { flex-direction: column; align-items: flex-start; gap: 20px; }
  .user-box, .user-box input { width: 100%; }
}
@media (max-width: 600px) {
  .main-content, .main-content.sidebar-minimized { margin-left: 0; width: 100%; padding: 25px 20px 40px; }
  .card img { width: 105px; height: 105px; }
}
</style>