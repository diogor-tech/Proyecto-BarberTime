<script setup>
import Sidebar from "@/components/Sidebar.vue"
import products from "@/data/products"
import { useRoute } from "vue-router"
import { ref } from "vue"

const route = useRoute()

const sidebarMinimized = ref(false)

const handleToggleSidebar = (v) => {
  sidebarMinimized.value = v
}

const producto = products.find(
  p => p.id == route.params.id
)

const agregarCarrito = () => {

  const carrito =
    JSON.parse(localStorage.getItem("cart")) || []

  const existe = carrito.find(
    p => p.id === producto.id
  )

  if (existe) {
    existe.cantidad++
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    })
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(carrito)
  )

  alert("Producto agregado al carrito 🛒")

}
</script>

<template>

<div class="page-shell">

<Sidebar
@toggleSidebar="handleToggleSidebar"
/>

<main :class="['main-content',{ 'sidebar-minimized': sidebarMinimized }]">

<div
v-if="producto"
class="product"
>

<img
:src="producto.image"
>

<div class="info">

<h1>{{ producto.name }}</h1>

<h2>{{ producto.brand }}</h2>

<p class="rating">
⭐ {{ producto.rating }}
</p>

<p class="price">

${{ producto.price }}

</p>

<p>

Categoría:
<b>{{ producto.category }}</b>

</p>

<p>

Stock:
<b>{{ producto.stock }}</b>

</p>

<button
@click="agregarCarrito"
>

🛒 Agregar al carrito

</button>

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

.product{
display:grid;
grid-template-columns:450px 1fr;
gap:50px;
color:white;
}

.product img{
width:100%;
border-radius:25px;
}

.info{
display:flex;
flex-direction:column;
gap:18px;
}

.price{
font-size:42px;
font-weight:bold;
color:#BF924B;
}

.rating{
color:#FFD700;
font-size:22px;
}

button{
margin-top:20px;
padding:18px;
border:none;
border-radius:15px;
background:linear-gradient(135deg,#BF924B,#F3DDA7);
font-size:18px;
font-weight:bold;
cursor:pointer;
}

</style>