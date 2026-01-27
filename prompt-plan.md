Necesito un plan de desarrollo que defina una arquitectura completa de una aplicación que quiero crear. Para ello, este plan debe ser un fichero .MD para entregarlo al IDE Google Antigravity que tenga la capacidad de crear todo el sistema y el contexto de todo: diseño, back, front, autenticación, etc.

# DESCRIPCIÓN:
[
El sistema que quiero crear es una app para la gestion de una duia de Pequeñas y medianas empresas (Guía PyMES). Una app sencilla donde el usuario añade empresas y contactos que seran parte del listado de pymes (que se mostraran en el frontend).
La app permitirá:
Login y Registro de usuarios.
Cada usuario podrá visualizar, crear, modificar y eliminar los registros de las empresas, contactos y categorias.
Cada usuario dispondrá de un panel (Dashboard) con gráficas que permitan de un solo vistazo ver su gestion de empresas cargadas, empresas contactadas, etc.
Tambien el panel tendrá unos filtros para las búsquedas y los datos que tienen en pantalla.
Tanto los contactos, como las empresas podrán tener mas de un yelefono, redes sociales, email, direcciones, etc. Una empresa podrá tener más de un contacto y estos deeberán estar identificados como Administrtivo, Dueño, Contador, etc.
Las caregorías podran ser anidadas para armar en el frontend cluster de categorias.
Ademas de empresas tambien se podraá registrar Negocios y Profesionales (como Abogados, Maestro mayot de obra, Arquitectos, etc)
Genera un log de cada tarea realizada para una auditoria de gestiòn






]

# CARACTERÍSTICAS TÉCNICAS:
## Tecnologías: Next.js y Tailwind CSS  
## Base de datos: Supabase (Postgres).
## Sistema de autenticación de Login y Registro de usuarios. Cada usuario debe tener su registro propio de sus registros de suscripciones activas. Usaremos Supabase.
## Esquema de Base de Datos (SQL): debes generar el esquema de las bases de datos tanto para el sistema de usuarios como para los registros de las sPymes, contactos, categorias, profesionales y negocios. El editor escribirá SQL con tablas, índices, etc listo para generar en supabase.
## Decide que campos debe tener las tablas los registros de historial de gestion de los usuarios, de forma que tenga la información necesaria.

# Estructura de Proyecto
[El editor mapeará rutas, carpetas, componentes, librerías y
organización del código.]

## Hosting VPS: el sistema debe prepararse para desplegarse en un VPS en Dokploy.

## Sistema Control de Versiones y Repositorio: Git y GitHub
 

