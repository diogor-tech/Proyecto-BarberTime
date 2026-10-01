<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit'])
const router = useRouter()

function normalizeServices(services, fallbackPrice = 500) {
  const defaultPrice = Number(fallbackPrice) || 500

  if (!Array.isArray(services) || services.length === 0) {
    return [{ nombre: 'Corte de pelo', precio: defaultPrice }]
  }

  return services.map((service, index) => {
    if (typeof service === 'string') {
      return { nombre: service, precio: index === 0 ? defaultPrice : 0 }
    }

    return {
      nombre: service.nombre ?? service.name ?? 'Servicio',
      precio: Number(service.precio ?? 0)
    }
  })
}

const form = reactive({
  nombre: props.initialData?.nombre ?? '',
  direccion: props.initialData?.direccion ?? '',
  ciudad: props.initialData?.ciudad ?? '',
  telefono: props.initialData?.telefono ?? '',
  descripcion: props.initialData?.descripcion ?? '',
  imagen: props.initialData?.imagen ?? '',
  precio: props.initialData?.precio ?? 500,
  servicios: normalizeServices(props.initialData?.servicios, props.initialData?.precio),
  horario: props.initialData?.horario ?? '',
  disponible: props.initialData?.disponible ?? true,
})

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

function addServicio() {
  form.servicios.push({ nombre: '', precio: 0 })
}

function removeServicio(index) {
  if (form.servicios.length === 1) return
  form.servicios.splice(index, 1)
}

function handleSubmit() {
  const serviciosValidos = form.servicios.filter(servicio => String(servicio.nombre).trim() && Number(servicio.precio) > 0)

  if (!form.nombre || !form.direccion || !form.ciudad || !form.imagen || serviciosValidos.length === 0) {
    alert('Por favor completa todos los campos requeridos')
    return
  }

  emit('submit', {
    ...form,
    precio: Number(serviciosValidos[0].precio),
    servicios: serviciosValidos.map(servicio => ({
      nombre: String(servicio.nombre).trim(),
      precio: Number(servicio.precio)
    }))
  })
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

    </div>

    <div class="form-section">
      <div class="section-heading">
        <h3>Servicios y precios</h3>
        <span class="section-hint">Añade cada servicio con su precio</span>
      </div>

      <div class="service-list">
        <div v-for="(servicio, index) in form.servicios" :key="index" class="service-row">
          <div class="form-group">
            <label :for="`servicio-${index}`">Categoría {{ index + 1 }}</label>
            <input
              :id="`servicio-${index}`"
              v-model="servicio.nombre"
              type="text"
              placeholder="Ej: Corte de pelo"
            />
          </div>

          <div class="form-group">
            <label :for="`precio-servicio-${index}`">Precio ($)</label>
            <input
              :id="`precio-servicio-${index}`"
              v-model.number="servicio.precio"
              type="number"
              min="1"
              placeholder="500"
            />
          </div>

          <button
            v-if="form.servicios.length > 1"
            type="button"
            class="remove-service"
            :aria-label="`Quitar ${servicio.nombre || 'servicio'}`"
            @click="removeServicio(index)"
          >
            Quitar
          </button>
        </div>
      </div>

      <button type="button" class="add-service" @click="addServicio">
        + Añadir nuevo servicio
      </button>
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

.section-heading {
  margin-bottom: 25px;
}

.section-heading h3 {
  margin-bottom: 6px;
}

.section-hint {
  color: #9ca3af;
  font-size: 0.9rem;
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

.service-list {
  display: grid;
  gap: 14px;
}

.service-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px auto;
  align-items: end;
  gap: 14px;
  padding: 16px;
  background: #1f2937;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.service-row .form-group {
  margin-bottom: 0;
}

.remove-service,
.add-service {
  border: 1px solid rgba(191, 146, 75, 0.55);
  border-radius: 10px;
  padding: 12px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.remove-service {
  background: transparent;
  color: #d1d5db;
}

.remove-service:hover {
  color: #fca5a5;
  border-color: #fca5a5;
}

.add-service {
  margin-top: 16px;
  background: rgba(191, 146, 75, 0.1);
  color: #BF924B;
}

.add-service:hover {
  background: rgba(191, 146, 75, 0.2);
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

@media (max-width: 600px) {
  .form-section {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .service-row {
    grid-template-columns: 1fr;
  }

  .remove-service {
    width: 100%;
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
