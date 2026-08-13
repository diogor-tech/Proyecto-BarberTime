<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit'])
const router = useRouter()

const form = reactive({
  nombre: props.initialData?.nombre ?? '',
  direccion: props.initialData?.direccion ?? '',
  ciudad: props.initialData?.ciudad ?? '',
  telefono: props.initialData?.telefono ?? '',
  descripcion: props.initialData?.descripcion ?? '',
  imagen: props.initialData?.imagen ?? '',
  rating: props.initialData?.rating ?? 4.8,
  precio: props.initialData?.precio ?? 500,
  servicios: props.initialData?.servicios ?? [],
  horario: props.initialData?.horario ?? '',
  disponible: props.initialData?.disponible ?? true,
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
      <h3>Imagen y Precios</h3>
      
      <div class="form-group">
        <label>URL de imagen *</label>
        <input
          v-model="form.imagen"
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          required
        />
      </div>

      <div v-if="form.imagen" class="image-preview">
        <img :src="form.imagen" :alt="form.nombre" />
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

        <div class="form-group">
          <label>Calificación (1-5)</label>
          <input
            v-model.number="form.rating"
            type="number"
            min="1"
            max="5"
            step="0.1"
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
