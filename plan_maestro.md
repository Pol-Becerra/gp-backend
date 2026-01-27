plan_maestro.md

Este es el archivo de arquitectura técnica y plan de desarrollo en formato Markdown (`.md`), diseñado específicamente para ser procesado por un IDE con capacidades de generación de contexto (como Google Antigravity).

---

# ARCHITECTURE & DEVELOPMENT PLAN: GUÍA PYMES SYSTEM

## 1. Executive Summary

Este documento define la arquitectura técnica para una plataforma de gestión de PYMES, Negocios y Profesionales. El sistema permite la gestión CRUD (Crear, Leer, Actualizar, Borrar), visualización mediante Dashboards, auditoría de cambios y gestión de contactos jerarquizados.

---

## 2. Technical Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS + ShadcnUI (Componentes)
* **Database & Auth:** Supabase (PostgreSQL + GoTrue)
* **Charts:** Recharts / Tremor (para Dashboard)
* **Deployment:** Dockerized for Dokploy (VPS)

---

## 3. Database Schema (SQL - Supabase)

Ejecutar este script en el Editor SQL de Supabase para inicializar la estructura.

```sql
-- 1. Extensiones y Esquemas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Categorías (Anidadas/Self-referencing)
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    nombre TEXT NOT NULL,
    parent_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla Principal: Entidades (Empresas, Negocios, Profesionales)
CREATE TYPE tipo_entidad AS ENUM ('PYME', 'NEGOCIO', 'PROFESIONAL');

CREATE TABLE entidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    tipo tipo_entidad NOT NULL DEFAULT 'PYME',
    nombre_comercial TEXT NOT NULL,
    razon_social TEXT,
    categoria_id UUID REFERENCES categorias(id),
    emails TEXT[] DEFAULT '{}',
    telefonos TEXT[] DEFAULT '{}',
    redes_sociales JSONB DEFAULT '{}', -- {twitter: '', linkedin: ''}
    direcciones JSONB DEFAULT '[]',     -- [{tipo: 'fiscal', calle: ''}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Contactos
CREATE TYPE rol_contacto AS ENUM ('Administrativo', 'Dueño', 'Contador', 'Ventas', 'Otro');

CREATE TABLE contactos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
    nombre_completo TEXT NOT NULL,
    rol rol_contacto NOT NULL DEFAULT 'Otro',
    telefonos TEXT[] DEFAULT '{}',
    emails TEXT[] DEFAULT '{}',
    redes_sociales JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de Auditoría (Log de Tareas)
CREATE TABLE auditoria_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    accion TEXT NOT NULL, -- 'CREATE_ENTIDAD', 'UPDATE_CONTACT', etc.
    entidad_afectada TEXT, -- Nombre o ID de la empresa
    detalles JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Índices para Performance
CREATE INDEX idx_entidades_user ON entidades(user_id);
CREATE INDEX idx_contactos_entidad ON contactos(entidad_id);
CREATE INDEX idx_categorias_parent ON categorias(parent_id);

-- 7. Row Level Security (RLS)
ALTER TABLE entidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own entities" 
ON entidades FOR ALL USING (auth.uid() = user_id);

-- (Repetir RLS para contactos, categorias y auditoria_logs)

```

---

## 4. Project Structure (File Map)

```text
/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard con gráficas
│   │   ├── entidades/          # CRUD Empresas/Negocios
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── categorias/         # Gestión de Clusters
│   ├── api/                    # Webhooks o Endpoints específicos
│   └── layout.tsx
├── components/
│   ├── ui/                     # Botones, Inputs (Shadcn)
│   ├── dashboard/
│   │   ├── stats-cards.tsx
│   │   └── main-chart.tsx      # Gráficas de gestión
│   ├── forms/
│   │   ├── entidad-form.tsx    # Maneja múltiples teléfonos/redes
│   │   └── contacto-form.tsx
│   └── shared/
│       └── sidebar.tsx
├── lib/
│   ├── supabase/               # Cliente de Supabase
│   ├── utils.ts                # Helpers de Tailwind/Fechas
│   └── audit-logger.ts         # Función para insertar en auditoria_logs
├── docker/
│   └── Dockerfile              # Configuración para Dokploy
└── next.config.js

```

---

## 5. Implementation Logic & Audit

### Multi-campo (Teléfonos/Redes)

Se implementará mediante **campos dinámicos** en el frontend usando `react-hook-form`. Los datos se guardan en PostgreSQL como `TEXT[]` (Arrays) para teléfonos y `JSONB` para redes sociales, permitiendo flexibilidad total sin crear tablas infinitas.

### Auditoría Automática

Cada vez que se ejecute una mutación (Server Action en Next.js), se llamará a la función `logger`:

```typescript
// lib/audit-logger.ts
export async function logAction(action: string, entityName: string, details: any) {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from('auditoria_logs').insert({
    user_id: user.id,
    accion: action,
    entidad_afectada: entityName,
    detalles: details
  });
}

```

---

## 6. Deployment (Dokploy / VPS)

Para el despliegue en Dokploy, utilizaremos un **Dockerfile** multi-etapa para optimizar el peso de la imagen de Next.js:

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]

```

> **Nota:** En Dokploy, configurar las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 7. Development Roadmap

1. **Fase 1:** Setup de Supabase y Auth (Email/Password).
2. **Fase 2:** Implementación de tablas y RLS (Seguridad por usuario).
3. **Fase 3:** Desarrollo de formularios dinámicos para Entidades y Contactos.
4. **Fase 4:** Dashboard con agregaciones SQL (Total empresas vs contactadas).
5. **Fase 5:** Dockerización y despliegue en VPS vía Dokploy.

---

**¿Deseas que profundice en el código de algún componente específico del Dashboard o en la lógica de los filtros avanzados?**