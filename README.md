# 📝 DaviForms - Plataforma de Encuestas Empresariales

## 🚀 Stack Tecnológico

### Frontend (Angular)
- **Versión**: 20.0.5
- **Dependencias principales**:
  - Angular Material 20.0.5 (UI components)
  - Chart.js 4.5.0 + ng2-charts 8.0.0 (visualización de datos)
  - RxJS 7.8.0 (gestión reactiva)
  - Font Awesome 6.7.2 (iconos)

### Backend (NestJS)
- **Node.js**: v24.3.0
- **Dependencias principales**:
  - NestJS 11.0.1 (framework backend)
  - Mongoose 8.16.1 (MongoDB ODM)
  - Passport + JWT (autenticación)
  - Swagger (documentación API)

## 🌟 Módulos Principales

### 📊 Constructor de Encuestas
- **Creación**:
  - Interfaz drag-and-drop
  - 10+ tipos de preguntas (selección múltiple, rating, texto abierto)
  - Lógica condicional entre preguntas

### 🔧 Gestión
- **Edición en tiempo real** con preview
- **Versionado** de encuestas
- **Eliminación segura** con confirmación

### ✍️ Experiencia de Usuario
- **Validación en tiempo real**
- **Guardado automático** de progreso

## 🛠️ Configuración del Entorno

```bash
# 1. Clonar repositorio
git clone https://github.com/AlveiroDiaz/DaviForms.git
cd DaviForms

# 2. Configurar frontend
cd daviforms-frontend
npm install
ng serve --open  # http://localhost:4200

# 3. Configurar backend
cd ../daviforms-backend
npm install
npm run start:dev  # http://localhost:3000
```

## 📋 Requisitos del Sistema

| Componente | Versión |
|------------|---------|
| Node.js | ≥24.3.0 |
| npm | ≥10.0.0 |
| Angular CLI | 20.0.5 |
| MongoDB | ≥6.0 |



## 📬 Contacto y Soporte

**Desarrollador Principal**:  
Alveiro Díaz  
📧 alveiro.diaz1@gmail.com  

**Reporte de Issues**:  
[GitHub Issues](https://github.com/AlveiroDiaz/DaviForms/issues)

**Documentación API**:  
`http://localhost:3000/api` (disponible al iniciar backend)

---

> ℹ️ **Nota**: Para variables de entorno, crear archivo `.env` en backend basado en `.env.example`