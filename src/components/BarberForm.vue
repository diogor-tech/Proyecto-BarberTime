<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRouter } from 'vue-router'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit'])
const router = useRouter()
const mapContainer = ref(null)
let map = null
let marker = null

const form = reactive({
  nombre: props.initialData?.nombre ?? '',
  direccion: props.initialData?.direccion ?? '',
  ciudad: props.initialData?.ciudad ?? '',
  latitud: props.initialData?.latitud ?? null,
  longitud: props.initialData?.longitud ?? null,
  telefono: props.initialData?.telefono ?? '',
  descripcion: props.initialData?.descripcion ?? '',
  imagen: props.initialData?.imagen ?? '',
  precio: props.initialData?.precio ?? 500,
  servicios: props.initialData?.servicios ?? [],
  horario: props.initialData?.horario ?? '',
  disponible: props.initialData?.disponible ?? true,
})
function inicializarMapa() {
  if (!mapContainer.value) return

  // Ubicación inicial: si ya existe una ubicación,
  // usamos esa. Si no, usamos Uruguay.
  const latInicial = form.latitud ?? -32.5228
  const lngInicial = form.longitud ?? -55.7658

  map = L.map(mapContainer.value).setView(
    [latInicial, lngInicial],
    form.latitud && form.longitud ? 16 : 7
  )

 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Si la barbería ya tiene ubicación, mostramos el marcador
  if (form.latitud && form.longitud) {
    marker = L.marker([
      form.latitud,
      form.longitud
    ]).addTo(map)
  }

  // Cuando el usuario hace clic en el mapa
  map.on('click', (e) => {
    const lat = e.latlng.lat
    const lng = e.latlng.lng

    form.latitud = Number(lat.toFixed(6))
    form.longitud = Number(lng.toFixed(6))

    if (marker) {
      marker.setLatLng([lat, lng])
    } else {
      marker = L.marker([lat, lng]).addTo(map)
    }
  })

  // Leaflet necesita esto cuando el mapa está dentro
  // de un componente que acaba de aparecer
  setTimeout(() => {
    map.invalidateSize()
  }, 100)
}

onMounted(async () => {
  await nextTick()
  inicializarMapa()
})

const servicios = [
  'Fade',
  'Barba',
  'Premium',
  'Express',
  'VIP',
  'Diseño',
  'Skin Fade',
  'Afro'
]

const imageInput = ref(null)
const imageError = ref('')

function openImagePicker() {
  imageInput.value?.click()
}

function handleImageUpload(event) {
  const file = event.target.files?.[0]
  imageError.value = ''

  if (!file) return

  if (!file.type.startsWith('image/')) {
    imageError.value = 'Selecciona un archivo de imagen válido.'
    event.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    imageError.value = 'La imagen no puede superar los 5 MB.'
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    form.imagen = reader.result
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  form.imagen = ''
  imageError.value = ''
  if (imageInput.value) imageInput.value.value = ''
}

function toggleServicio(servicio) {
  const index = form.servicios.indexOf(servicio)
  if (index === -1) {
    form.servicios.push(servicio)
  } else {
    form.servicios.splice(index, 1)
  }
}

function handleSubmit() {
  if (!form.nombre || !form.direccion || !form.ciudad || !form.imagen) {
    alert('Por favor completa todos los campos requeridos')
    return
  }
  emit('submit', { ...form })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="barber-form">
    <div class="form-section">
      <h3>Información Básica</h3>
      
      <div class="form-group">
        <label>Nombre de la barbería *</label>
        <input
          v-model="form.nombre"
          type="text"
          placeholder="Ej: Barber King"
          required
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Dirección *</label>
          <input
            v-model="form.direccion"
            type="text"
            placeholder="Ej: Calle Principal 123"
            required
          />
        </div>

        <div class="form-group">
          <label>Ciudad *</label>
          <input
            v-model="form.ciudad"
            type="text"
            placeholder="Ej: Melo"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Teléfono</label>
          <input
            v-model="form.telefono"
            type="tel"
            placeholder="Ej: 099123456"
          />
        </div>

        <div class="form-group">
          <label>Horario de atención</label>
          <input
            v-model="form.horario"
            type="text"
            placeholder="Ej: 09:00 - 21:00"
          />
        </div>
      </div>
      <div class="form-section">
  <h3>📍 Ubicación de la barbería</h3>

  <p class="map-instruction">
    Haz clic en el mapa para marcar exactamente dónde está tu barbería.
  </p>

  <div ref="mapContainer" class="map-container"></div>

  <div v-if="form.latitud && form.longitud" class="coordinates">
    <span>📍 Ubicación seleccionada</span>
    <small>
      Latitud: {{ form.latitud }} |
      Longitud: {{ form.longitud }}
    </small>
  </div>

  <p v-else class="map-warning">
    ⚠️ Todavía no seleccionaste una ubicación.
  </p>
</div>

      <div class="form-group">
        <label>Descripción</label>
        <textarea
          v-model="form.descripcion"
          placeholder="Describe tu barbería, servicios especiales, promociones, etc."
          rows="4"
        />
      </div>
    </div>

    <div class="form-section">
      <h3>Imagen y precios</h3>
      
      <div class="form-group">
        <label>Foto de la barbería *</label>
        <input
          ref="imageInput"
          class="file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          @change="handleImageUpload"
        />
        <button type="button" class="image-picker" @click="openImagePicker">
          <span class="picker-icon">+</span>
          <span>
            <strong>{{ form.imagen ? 'Cambiar imagen' : 'Seleccionar imagen' }}</strong>
            <small>JPG, PNG o WEBP · máximo 5 MB</small>
          </span>
        </button>
        <p v-if="imageError" class="field-error">{{ imageError }}</p>
      </div>

      <div v-if="form.imagen" class="image-preview">
        <img :src="form.imagen" :alt="form.nombre" />
        <button type="button" class="remove-image" @click="removeImage">Quitar imagen</button>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Precio base ($)</label>
          <input
            v-model.number="form.precio"
            type="number"
            min="1"
            placeholder="500"
          />
        </div>

      </div>
    </div>

    <div class="form-section">
      <h3>Servicios Disponibles</h3>
      <div class="servicios-grid">
        <label
          v-for="servicio in servicios"
          :key="servicio"
          class="servicio-checkbox"
        >
          <input
            type="checkbox"
            :checked="form.servicios.includes(servicio)"
            @change="toggleServicio(servicio)"
          />
          <span>{{ servicio }}</span>
        </label>
      </div>
    </div>

    <div class="form-section">
      <div class="form-group">
        <label class="checkbox-label">
          <input
            v-model="form.disponible"
            type="checkbox"
          />
          <span>Barbería disponible ahora</span>
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn-submit">
        {{ initialData ? 'Actualizar' : 'Crear' }} Barbería
      </button>
      <button type="button" class="btn-cancel" @click="router.back()">
        Cancelar
      </button>
    </div>
  </form>
</template>

<style scoped>
.barber-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  background: #0e0e0e;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 25px;
}

.form-section h3 {
  color: #BF924B;
  font-size: 1.3rem;
  margin-bottom: 25px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #d1d5db;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  background: #1f2937;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 14px 16px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1rem;
  transition: 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #BF924B;
  box-shadow: 0 0 0 3px rgba(191, 146, 75, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.image-picker {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: rgba(191, 146, 75, 0.08);
  border: 1px dashed rgba(191, 146, 75, 0.65);
  border-radius: 14px;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: 0.2s ease;
}

.image-picker:hover {
  background: rgba(191, 146, 75, 0.16);
  border-color: #BF924B;
}

.picker-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #BF924B;
  color: #111;
  font-size: 1.6rem;
  line-height: 1;
}

.image-picker strong,
.image-picker small {
  display: block;
}

.image-picker small {
  margin-top: 4px;
  color: #9ca3af;
}

.field-error {
  margin-top: 8px;
  color: #fca5a5;
  font-size: 0.9rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.image-preview {
  margin: 15px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #1f2937;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.image-preview img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.remove-image {
  width: 100%;
  padding: 11px;
  background: rgba(255, 255, 255, 0.08);
  border: 0;
  color: #d1d5db;
  cursor: pointer;
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.servicio-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #1f2937;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s ease;
}

.servicio-checkbox input {
  width: auto;
  margin: 0;
  cursor: pointer;
  accent-color: #BF924B;
}

.servicio-checkbox:hover {
  border-color: #BF924B;
  background: rgba(191, 146, 75, 0.05);
}

.servicio-checkbox input:checked + span {
  color: #BF924B;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
  margin: 0;
  cursor: pointer;
  accent-color: #BF924B;
}

.checkbox-label span {
  color: #d1d5db;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-submit,
.btn-cancel {
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.3s ease;
}

.btn-submit {
  background: linear-gradient(135deg, #BF924B, #ffb743);
  color: black;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(191, 146, 75, 0.3);
}

.btn-cancel {
  background: #1f2937;
  color: #d1d5db;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel:hover {
  background: #2d3748;
}
.map-instruction {
  color: #9ca3af;
  margin-bottom: 15px;
  line-height: 1.5;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(191, 146, 75, 0.4);
  cursor: crosshair;
}

.coordinates {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 15px;
  padding: 15px;
  background: rgba(191, 146, 75, 0.1);
  border: 1px solid rgba(191, 146, 75, 0.3);
  border-radius: 10px;
}

.coordinates span {
  color: #BF924B;
  font-weight: 600;
}

.coordinates small {
  color: #d1d5db;
}

.map-warning {
  margin-top: 12px;
  color: #fbbf24;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .form-section {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .servicios-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
  }
}
</style>
