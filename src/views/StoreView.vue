<script setup>
import Sidebar from "@/components/Sidebar.vue"
import products from "@/data/products"
import { useRouter } from "vue-router"
import { ref, computed, onMounted, onUnmounted } from "vue"

const router = useRouter()
const abrirProducto = (producto) => {
  router.push(`/product/${producto.id}`)
}

const sidebarMinimized = ref(false)
const search = ref("")
const categoria = ref("Todos")
const banners = [

{
titulo:"🔥 HOT SALE WAHL",
texto:"20% OFF en máquinas profesionales",
imagen:"https://picsum.photos/1400/450?random=40"
},

{
titulo:"💈 BABYLISS GOLD FX",
texto:"La máquina favorita de los barberos",
imagen:"https://picsum.photos/1400/450?random=41"
},

{
titulo:"⚡ OFERTAS EN POMADAS",
texto:"Hasta 30% OFF",
imagen:"https://picsum.photos/1400/450?random=42"
}

]

const bannerActual = ref(0)

let intervalo

onMounted(()=>{

intervalo=setInterval(()=>{

bannerActual.value++

if(bannerActual.value>=banners.length){

bannerActual.value=0

}

},5000)

})

onUnmounted(()=>{

clearInterval(intervalo)

})
const categorias = [
  "Todos",
  "Máquinas",
  "Trimmers",
  "Pomadas",
  "Barba"
]
const filteredProducts = computed(() => {

  return products.filter(product => {

    const coincideNombre =
      product.name.toLowerCase().includes(search.value.toLowerCase())

    const coincideCategoria =
      categoria.value === "Todos" ||
      product.category === categoria.value

    return coincideNombre && coincideCategoria

  })

})

const handleToggleSidebar = (value) => {
  sidebarMinimized.value = value
}
const agregarCarrito = (producto) => {

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
style="
background:red;
color:white;
font-size:40px;
padding:30px;
margin-bottom:30px;
"
>
ESTOY EDITANDO EL STOREVIEW
</div>

<h1 style="color:red;font-size:60px">
ALEJANDRA LA TARJETA
</h1>
<div
class="store-banner"
:style="{
backgroundImage:`url(${banners[bannerActual].imagen})`
}"
>

<div class="overlay">

<h2>

{{banners[bannerActual].titulo}}

</h2>

<p>

{{banners[bannerActual].texto}}

</p>

<button>

Ver ofertas

</button>

</div>

</div>
<input
v-model="search"
class="search"
placeholder="🔍 Buscar productos..."
>

<div class="categories">

<button
v-for="cat in categorias"
:key="cat"
@click="categoria=cat"
:class="{active:categoria===cat}"
>

{{cat}}

</button>
</div>

<div class="products">

<div
v-for="producto in filteredProducts"
class="card"
@click="abrirProducto(producto)"
>
<span
v-if="producto.featured"
class="featured"
>
🔥 Más vendido
</span>
<span
v-if="producto.discount"
class="discount"
>

-{{producto.discount}}%

</span>


<img
:src="producto.image"
/>
<h2>{{ producto.name }}</h2>

<p class="brand">
  {{ producto.brand }}
</p>

<p class="rating">
  ⭐ {{ producto.rating }}
</p>

<p class="price">
<span
v-if="producto.discount"
class="old-price"
>
${{ producto.price }}
</span>

${{
Math.round(
producto.price -
producto.price * producto.discount / 100
)
}}
</p>

<p class="shipping">
🚚 Envío gratis a todo Uruguay
</p>

<p class="stock">
Quedan {{ producto.stock }} unidades
</p>

<button
@click="agregarCarrito(producto)"
>
🛒 Comprar ahora
</button>
</div>

</div>

</main>

</div>

</template>
*{
  box-sizing:border-box;
}

<style scoped>

.main-content{
margin-left:280px;
padding:50px;
min-height:100vh;
background:#0f172a;
transition:.3s;
}

.sidebar-minimized{
margin-left:80px;
}


h1{
color:white;
margin-bottom:35px;
}

.products{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:30px;
  width:100%;
}

.card{
  width:100%;
  min-width:0;
}

.card:hover{
transform:translateY(-8px);
}

.card img{
width:100%;
height:220px;
object-fit:cover;
}

.card h2{
color:white;
padding:15px;
font-size:20px;
}
.card{
cursor:pointer;
}

.card p{
padding:0 15px;
color:#BF924B;
font-weight:bold;
font-size:18px;
}

.card button{
margin:20px 15px 0;
width:calc(100% - 30px);
padding:14px;
border:none;
border-radius:12px;
cursor:pointer;
background:linear-gradient(135deg,#BF924B,#F3DDA7);
font-weight:bold;
}
.brand{
color:#9ca3af;
padding:0 15px;
margin-top:-10px;
}

.rating{
padding:10px 15px;
color:#FFD700;
font-weight:bold;
}

.price{
padding:0 15px;
color:#BF924B;
font-size:22px;
font-weight:bold;
}
.search{
width:100%;
padding:16px;
border-radius:15px;
border:none;
margin:25px 0;
background:#1b1b1b;
color:white;
font-size:16px;
}

.categories{
display:flex;
gap:12px;
margin-bottom:30px;
flex-wrap:wrap;
}

.categories button{
padding:10px 20px;
border:none;
border-radius:25px;
background:#222;
color:white;
cursor:pointer;
}

.categories .active{
background:#BF924B;
color:black;
}

.discount{
position:absolute;
top:15px;
left:15px;
background:#dc2626;
color:white;
padding:6px 12px;
border-radius:30px;
font-weight:bold;
}
.store-banner{

height:320px;

border-radius:25px;

background-size:cover;

background-position:center;

overflow:hidden;

margin-bottom:40px;

display:flex;

align-items:center;

}

.overlay{

width:100%;

height:100%;

background:linear-gradient(
90deg,
rgba(0,0,0,.75),
rgba(0,0,0,.15)
);

display:flex;

flex-direction:column;

justify-content:center;

padding-left:70px;

}

.overlay h2{

color:white;

font-size:52px;

margin-bottom:15px;

}

.overlay p{

color:white;

font-size:22px;

margin-bottom:30px;

}

.overlay button{

width:220px;

padding:18px;

border:none;

border-radius:15px;

background:#BF924B;

font-size:18px;

font-weight:bold;

cursor:pointer;

transition:.3s;

}

.overlay button:hover{

transform:scale(1.05);

}

.store-banner h2{

font-size:40px;

margin-bottom:8px;

}

.store-banner p{

font-size:18px;

font-weight:600;

}

.old-price{
text-decoration:line-through;
color:#777;
margin-right:10px;
}
.featured{
position:absolute;
top:15px;
right:15px;
background:#16a34a;
color:white;
padding:8px 14px;
border-radius:25px;
font-size:13px;
font-weight:bold;
z-index:2;
}

.shipping{
color:#22c55e;
font-weight:bold;
padding:8px 15px;
font-size:15px;
}

.stock{
padding:0 15px;
color:#d1d5db;
font-size:15px;
margin-top:5px;
}

.card button{
margin-top:auto;
transition:.25s;
}

.card button:hover{
transform:scale(1.03);
}

.card img{
transition:.3s;
}

.card:hover img{
transform:scale(1.05);
}

.card{
box-shadow:0 10px 30px rgba(0,0,0,.35);
}
</style>