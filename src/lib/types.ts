export type TipoEntidad = 'PYME' | 'NEGOCIO' | 'PROFESIONAL' | 'SERVICIO'
export type RolContacto = 'Administrativo' | 'Dueño' | 'Contador' | 'Ventas' | 'Otro'

// direcciones table is now independent but linked to sucursales. 
// We keep this interface for UI consistency but it maps to the 'direcciones' table.
export interface Direccion {
    id: string
    sucursal_id?: string // new
    calle: string
    numero?: string // Deprecated in new model? Or kept in 'calle'? New model has 'calle' as text.
    piso?: string
    oficina?: string
    localidad_id?: string
    cp: string
    lat?: number
    lng?: number
    // UI Helpers
    provincia?: string
    ciudad?: string
}

export interface Sucursal {
    id: string
    entidad_id: string
    nombre: string | null
    es_principal: boolean
    created_at: string
    direcciones?: Direccion[]
    // Relaciones
    entidades?: Entidad
}

export interface EntidadCobertura {
    id: string
    entidad_id: string
    cp: string
    localidad_id?: string
    created_at: string
}

export interface EntidadEmail {
    id: string
    entidad_id: string
    email: string
    tipo: string
}

export interface EntidadTelefono {
    id: string
    entidad_id: string
    telefono: string
    whatsapp: boolean
    tipo: string
}

export interface RedSocial {
    id: string
    nombre: string
}

export interface EntidadRed {
    entidad_id: string
    red_social_id: string
    url: string
    red_social?: RedSocial
}

export interface RedesSociales {
    twitter?: string
    linkedin?: string
    instagram?: string
    facebook?: string
    website?: string
    github?: string
}

export interface Categoria {
    id: string
    user_id: string
    nombre: string
    descripcion: string | null
    icono: string
    color: string
    parent_id: string | null
    orden: number
    created_at: string
    updated_at: string
    // Relaciones
    subcategorias?: Categoria[]
    parent?: Categoria
    _count?: {
        entidades: number
    }
}

export interface Entidad {
    id: string
    user_id: string
    tipo: TipoEntidad
    nombre_comercial: string
    razon_social: string | null
    cuit: string | null
    descripcion: string | null
    // Relational Fields
    sucursales?: Sucursal[]
    cobertura?: EntidadCobertura[]
    emails_rel?: EntidadEmail[]
    telefonos_rel?: EntidadTelefono[]
    redes_rel?: EntidadRed[]

    // Legacy / Flat for UI (will be computed or mapped)
    categorias: Partial<Categoria>[] // now via entidad_categorias
    emails: string[]
    telefonos: string[]
    redes_sociales: RedesSociales
    direcciones: Direccion[] // derived from sucursales
    logo_url: string | null
    activo: boolean
    notas: string | null
    codigos_postales: string[] // derived from cobertura
    etiquetas?: string[]
    created_at: string
    updated_at: string
    // Relaciones
    contactos?: Contacto[]
    _count?: {
        contactos: number
    }
}

export interface Contacto {
    id: string
    entidad_id: string
    nombre_completo: string
    cargo: string | null
    rol: RolContacto
    telefonos: string[]
    emails: string[]
    redes_sociales: RedesSociales
    es_principal: boolean
    notas: string | null
    created_at: string
    updated_at: string
    // Relaciones
    entidad?: Entidad
}

export interface AuditoriaLog {
    id: string
    user_id: string
    accion: string
    entidad_afectada: string | null
    detalles: Record<string, unknown>
    ip_address: string | null
    created_at: string
}

// Tipos para formularios
export interface EntidadFormData {
    tipo: TipoEntidad
    nombre_comercial: string
    razon_social?: string
    cuit?: string
    descripcion?: string
    categorias: Partial<Categoria>[]
    emails: string[]
    telefonos: string[]
    redes_sociales: RedesSociales
    direcciones: Direccion[]
    activo: boolean
    notas?: string
    codigos_postales: string[]
    etiquetas?: string[]
}

export interface ContactoFormData {
    entidad_id: string
    nombre_completo: string
    cargo?: string
    rol: RolContacto
    telefonos: string[]
    emails: string[]
    redes_sociales: RedesSociales
    es_principal: boolean
    notas?: string
}

export interface CategoriaFormData {
    nombre: string
    descripcion?: string
    icono: string
    color: string
    parent_id?: string
    orden: number
}

// Tipos para Dashboard Stats
export interface DashboardStats {
    total_entidades: number
    total_pymes: number
    total_negocios: number
    total_profesionales: number
    total_servicios: number
    entidades_activas: number
    total_contactos: number
    nuevas_ultimo_mes: number
    categorias_count: number
}

export interface EntidadPorCategoria {
    categoria_nombre: string
    categoria_color: string
    count: number
}

export interface EntidadPorMes {
    mes: string
    pymes: number
    negocios: number
    profesionales: number
    servicios: number
}

// Google Maps Data
export interface GoogleMapsData {
    id: string
    created_at: string
    rubro_buscado: string | null
    title: string | null
    phone: string | null
    phone_unformatted: string | null
    website: string | null
    address: string | null
    street: string | null
    city: string | null
    postal_codes: string[] | null
    state: string | null
    country_code: string
    latitude: number | null
    longitude: number | null
    plus_code: string | null
    category_name: string | null
    categories: string[] | null
    total_score: number | null
    reviews_count: number | null
    opening_hours: string | null
    open_now: string | null
    price_level: string | null
    description: string | null
    etiquetas?: string[]
    images: any[] | null
    attributes: any[] | null
    service_options: any[] | null
    menu_link: string | null
    reservation_link: string | null
    order_link: string | null
    google_maps_url: string | null
}

export interface GoogleMapsFormData {
    rubro_buscado?: string
    title?: string
    phone?: string
    phone_unformatted?: string
    website?: string
    address?: string
    street?: string
    city?: string
    postal_codes?: string[]
    state?: string
    country_code?: string
    latitude?: number
    longitude?: number
    plus_code?: string
    category_name?: string
    categories?: string[]
    total_score?: number
    reviews_count?: number
    opening_hours?: string
    open_now?: string
    price_level?: string
    description?: string
    images?: any[]
    attributes?: any[]
    service_options?: any[]
    menu_link?: string
    reservation_link?: string
    order_link?: string
    google_maps_url?: string
    etiquetas?: string[]
}
// Tasks System
export type PrioridadTarea = 'Baja' | 'Media' | 'Alta' | 'Crítica'
export type EstadoTarea = 'Pendiente' | 'En Progreso' | 'En Revisión' | 'Completada' | 'Cancelada'

export interface TareaArea {
    id: string
    user_id: string
    nombre: string
    color: string
    created_at: string
    updated_at: string
}

export interface Tarea {
    id: string
    user_id: string
    area_id: string | null
    parent_id: string | null
    titulo: string
    descripcion: string | null
    prioridad: PrioridadTarea
    estado: EstadoTarea
    asignado_a: string | null
    fecha_limite: string | null
    created_at: string
    updated_at: string
    // Relaciones
    area?: TareaArea
    parent?: Tarea
    subtasks?: Tarea[]
    asignado?: {
        id: string
        email: string
    }
}

export interface TareaFormData {
    area_id?: string
    parent_id?: string
    titulo: string
    descripcion?: string
    prioridad: PrioridadTarea
    estado: EstadoTarea
    asignado_a?: string
    fecha_limite?: string
}

export interface TareaAreaFormData {
    nombre: string
    color: string
}

// Geographic Data
export interface Provincia {
    id: string
    nombre: string
}

export interface Partido {
    id: string
    nombre: string
    provincia_id: string
}

export interface Localidad {
    id: string
    nombre: string
    partido_id: string
    cp: string | null
}
