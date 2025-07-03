# 📝 DaviForms - Plataforma de Encuestas

## 🚀 Tecnologías Principales

- **Node.js**: v24.3.0
- **Angular**: 20.0.5
- **Dependencias principales**:
  - Angular Material (opcional)
  - RxJS
  - NgRx (opcional para state management)

## 🔍 Módulos Principales

### 📊 Gestión de Encuestas
- **Crear encuestas**: 
  - Constructor con arrastrar y soltar
  - Tipos de preguntas: múltiple opción, texto, escalas, etc.
  - Personalización de diseño
  
- **Editar encuestas**:
  - Modificar estructura existente
  - Reordenar preguntas
  - Previsualización en tiempo real

- **Borrar encuestas**:
  - Eliminación con confirmación
  - Histórico de encuestas eliminadas (opcional)

### ✍️ Llenado de Encuestas
- Interfaz responsive para respondientes
- Validación en tiempo real
- Guardado automático de progreso
- Soporte para adjuntos de archivos

## 🛠️ Configuración del Entorno

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/daviforms.git

# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve

# Build para producción
ng build --configuration production
```

## 📋 Requisitos del Sistema

- Node.js v24.3.0
- npm v10+ o yarn
- Angular CLI 20.0.5

## 🌐 Estructura del Proyecto

```
src/
├── app/
│   ├── modules/
│   │   ├── survey-creator/    # Módulo de creación
│   │   ├── survey-filler/     # Módulo para responder
│   │   ├── survey-manager/    # Gestión de encuestas
│   │   └── auth/              # Autenticación
├── assets/                    # Recursos estáticos
└── environments/              # Configs por ambiente
```

## 🔧 Dependencias Opcionales

```json
"dependencies": {
  "survey-angular": "latest",  // Para constructor de encuestas
  "ngx-ui-loader": "^10.0.0"   // Loaders visuales
}
```

## 💡 Características Futuras

- Exportación a PDF/Excel
- Análisis estadístico integrado
- Colaboración en tiempo real
- Plantillas predefinidas

## 📬 Contacto

¿Preguntas o sugerencias?  
✉️ contacto@daviforms.com  
🌐 [daviforms.com](https://www.daviforms.com)

---

📌 **Nota**: Actualiza las versiones según tus necesidades exactas. Este README incluye placeholders para características comunes en sistemas de encuestas.