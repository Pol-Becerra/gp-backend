--
-- PostgreSQL database dump
--

\restrict 0LedeVAuL4cKIhSUNdcWqLIchblurkPfc0qj0kh6KEcrx2bMxW1zqlpVb18aqdA

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: guiapymes_user
--

CREATE TABLE public.addresses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    street character varying(100) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100),
    "zipCode" character varying(20),
    country character varying(100) NOT NULL,
    type character varying(20),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "companyId" uuid,
    "contactId" uuid,
    active boolean DEFAULT true NOT NULL,
    status character varying(50),
    labels json
);


ALTER TABLE public.addresses OWNER TO guiapymes_user;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: guiapymes_user
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    icon character varying(50),
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    status character varying(50),
    labels json
);


ALTER TABLE public.categories OWNER TO guiapymes_user;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: guiapymes_user
--

CREATE TABLE public.companies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    cuit character varying(20),
    website character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    active boolean DEFAULT true NOT NULL,
    status character varying(50),
    labels json,
    "categoryId" uuid,
    "subcategoryId" uuid
);


ALTER TABLE public.companies OWNER TO guiapymes_user;

--
-- Name: contacts; Type: TABLE; Schema: public; Owner: guiapymes_user
--

CREATE TABLE public.contacts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "firstName" character varying(100) NOT NULL,
    "lastName" character varying(100),
    "position" character varying(100),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "companyId" uuid,
    active boolean DEFAULT true NOT NULL,
    status character varying(50),
    labels json
);


ALTER TABLE public.contacts OWNER TO guiapymes_user;

--
-- Name: emails; Type: TABLE; Schema: public; Owner: guiapymes_user
--

CREATE TABLE public.emails (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    address character varying(100) NOT NULL,
    type character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "companyId" uuid,
    "contactId" uuid,
    active boolean DEFAULT true NOT NULL,
    status character varying(50),
    labels json
);


ALTER TABLE public.emails OWNER TO guiapymes_user;

--
-- Name: phones; Type: TABLE; Schema: public; Owner: guiapymes_user
--

CREATE TABLE public.phones (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    number character varying(50) NOT NULL,
    type character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "companyId" uuid,
    "contactId" uuid,
    active boolean DEFAULT true NOT NULL,
    status character varying(50),
    labels json
);


ALTER TABLE public.phones OWNER TO guiapymes_user;

--
-- Name: social_networks; Type: TABLE; Schema: public; Owner: guiapymes_user
--

CREATE TABLE public.social_networks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    platform character varying(50) NOT NULL,
    url character varying,
    username character varying(100),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "companyId" uuid,
    "contactId" uuid,
    active boolean DEFAULT true NOT NULL,
    status character varying(50),
    labels json
);


ALTER TABLE public.social_networks OWNER TO guiapymes_user;

--
-- Name: subcategories; Type: TABLE; Schema: public; Owner: guiapymes_user
--

CREATE TABLE public.subcategories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    status character varying(50),
    labels json
);


ALTER TABLE public.subcategories OWNER TO guiapymes_user;

--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: guiapymes_user
--

COPY public.addresses (id, street, city, state, "zipCode", country, type, created_at, updated_at, "companyId", "contactId", active, status, labels) FROM stdin;
fbb1717c-732c-483b-8434-4fb328f1d86f	Av. Illia1723	Pergamino	Buenos Aires		Argentina	Principal	2026-01-15 02:59:14.077911	2026-01-15 02:59:14.077911	188299fe-30b9-40af-a58c-4142628b24ec	\N	t	\N	\N
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: guiapymes_user
--

COPY public.categories (id, name, slug, description, icon, active, created_at, updated_at, status, labels) FROM stdin;
5aab4855-a226-4faf-8e47-93687a17e939	Gastronomía	gastronomia	Restaurantes y bares	\N	t	2026-01-14 23:19:23.449924	2026-01-14 23:19:23.449924	\N	\N
53a3c301-73a4-4439-9965-d43f8456b249	Marketing & Ventas	marketing-ventas		\N	t	2026-01-14 23:49:22.006873	2026-01-14 23:49:22.006873	\N	\N
de955a7c-c152-4830-99fa-c4e44d356d68	Abastecimiento Logístico	abastecimiento-logístico	Servicios profesionales de PyME especializados en Abastecimiento Logístico.	icon-abastecimiento-logístico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
24c5f4bf-3274-4d3c-b541-4c1ab0fe7072	Administración de Consorcios	administración-de-consorcios	Servicios profesionales de PyME especializados en Administración de Consorcios.	icon-administración-de-consorcios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4ed89dd9-9419-42c9-94f2-e9255cfeae72	Agencia de Aduanas	agencia-de-aduanas	Servicios profesionales de PyME especializados en Agencia de Aduanas.	icon-agencia-de-aduanas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5e0d4d08-7089-443f-b963-c0d8076d49a6	Agencia de Publicidad	agencia-de-publicidad	Servicios profesionales de PyME especializados en Agencia de Publicidad.	icon-agencia-de-publicidad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
13839190-94aa-4744-bbce-81f9b76f0e78	Agencia de Viajes	agencia-de-viajes	Servicios profesionales de PyME especializados en Agencia de Viajes.	icon-agencia-de-viajes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c890b2fb-2897-4d10-88e6-f576fae23f0a	Agroindustria Cerealera	agroindustria-cerealera	Servicios profesionales de PyME especializados en Agroindustria Cerealera.	icon-agroindustria-cerealera	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
aa799979-5851-4874-8921-d91b4ee9f351	Alarmas y Monitoreo	alarmas-y-monitoreo	Servicios profesionales de PyME especializados en Alarmas y Monitoreo.	icon-alarmas-y-monitoreo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
36250dc9-be9e-42d5-9fb1-7c5d6e596d8e	Alquiler de Maquinaria	alquiler-de-maquinaria	Servicios profesionales de PyME especializados en Alquiler de Maquinaria.	icon-alquiler-de-maquinaria	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4037918d-434f-446b-8536-4219bbc28cbe	Análisis de Datos	análisis-de-datos	Servicios profesionales de PyME especializados en Análisis de Datos.	icon-análisis-de-datos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1fdddc73-0449-4b8a-adee-fcfa92028391	Análisis Clínicos	análisis-clínicos	Servicios profesionales de PyME especializados en Análisis Clínicos.	icon-análisis-clínicos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
71f7adb3-01e8-488d-bf73-a8def44ea869	Arquitectura Comercial	arquitectura-comercial	Servicios profesionales de PyME especializados en Arquitectura Comercial.	icon-arquitectura-comercial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
62044cd7-ceba-477c-8eef-9003dbf70877	Artes Gráficas	artes-gráficas	Servicios profesionales de PyME especializados en Artes Gráficas.	icon-artes-gráficas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
69934fd6-5d47-4311-81f8-b002af868f87	Asesoría Contable	asesoría-contable	Servicios profesionales de PyME especializados en Asesoría Contable.	icon-asesoría-contable	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1a9d7b28-68f2-4d7d-ba22-8162903d3df4	Asesoría de Imagen	asesoría-de-imagen	Servicios profesionales de PyME especializados en Asesoría de Imagen.	icon-asesoría-de-imagen	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
221b6477-b506-4c9b-85b5-732abdcfc587	Asesoría de Inversiones	asesoría-de-inversiones	Servicios profesionales de PyME especializados en Asesoría de Inversiones.	icon-asesoría-de-inversiones	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f46c3e91-1bce-433c-a516-d112b63ab396	Asesoría en Franquicias	asesoría-en-franquicias	Servicios profesionales de PyME especializados en Asesoría en Franquicias.	icon-asesoría-en-franquicias	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4331a19e-25e0-42b9-907d-055d819b2c1e	Asesoría en Seguros	asesoría-en-seguros	Servicios profesionales de PyME especializados en Asesoría en Seguros.	icon-asesoría-en-seguros	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
e24065fb-5a94-49b8-85ab-5dcccb11b2bb	Asesoría Fiscal	asesoría-fiscal	Servicios profesionales de PyME especializados en Asesoría Fiscal.	icon-asesoría-fiscal	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7b972a44-ddf8-428c-89cc-2a04edd55b44	Asesoría Jurídica	asesoría-jurídica	Servicios profesionales de PyME especializados en Asesoría Jurídica.	icon-asesoría-jurídica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a2f54d85-fe4e-429f-a488-c36e128d08c3	Asesoría Laboral	asesoría-laboral	Servicios profesionales de PyME especializados en Asesoría Laboral.	icon-asesoría-laboral	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5cc28109-75c8-40eb-ba43-14a4f91276ca	Asistencia al Viajero	asistencia-al-viajero	Servicios profesionales de PyME especializados en Asistencia al Viajero.	icon-asistencia-al-viajero	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
47dab54d-28f4-49f9-81d5-a8a72fbed06f	Auditoría Ambiental	auditoría-ambiental	Servicios profesionales de PyME especializados en Auditoría Ambiental.	icon-auditoría-ambiental	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6b71fd33-34d7-4145-aff5-1419ff79f58b	Auditoría de Sistemas	auditoría-de-sistemas	Servicios profesionales de PyME especializados en Auditoría de Sistemas.	icon-auditoría-de-sistemas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8095d2bd-503f-43d7-8585-743546ece2be	Automatización Industrial	automatización-industrial	Servicios profesionales de PyME especializados en Automatización Industrial.	icon-automatización-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9792e21b-5188-4013-bea3-ff024b0989ff	Banca Privada	banca-privada	Servicios profesionales de PyME especializados en Banca Privada.	icon-banca-privada	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9ff6bb26-3260-4bf9-abe2-cfba3856b395	Big Data y Analytics	big-data-y-analytics	Servicios profesionales de PyME especializados en Big Data y Analytics.	icon-big-data-y-analytics	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a23cee0d-11ea-47bc-b7ff-f5bb5c4034fd	Bioingeniería	bioingeniería	Servicios profesionales de PyME especializados en Bioingeniería.	icon-bioingeniería	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
57191272-38c1-4df2-a0bb-0d32491f1631	Biotecnología Agrícola	biotecnología-agrícola	Servicios profesionales de PyME especializados en Biotecnología Agrícola.	icon-biotecnología-agrícola	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9ec3bb4f-feb1-46f8-9d77-ba91ea86b27c	Catering Corporativo	catering-corporativo	Servicios profesionales de PyME especializados en Catering Corporativo.	icon-catering-corporativo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
73e3ea9b-ac9f-4603-bbdd-980cbbf2b635	Centro de Estética	centro-de-estética	Servicios profesionales de PyME especializados en Centro de Estética.	icon-centro-de-estética	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
bd0a0bbf-8919-42bf-a89d-9d0eaa5e3cbe	Climatización Industrial	climatización-industrial	Servicios profesionales de PyME especializados en Climatización Industrial.	icon-climatización-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5af2d397-e112-4928-a046-4e1d7185c6c7	Cloud Computing	cloud-computing	Servicios profesionales de PyME especializados en Cloud Computing.	icon-cloud-computing	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3a605c82-3c6b-49ee-b6fe-d70284196807	Comercio Exterior	comercio-exterior	Servicios profesionales de PyME especializados en Comercio Exterior.	icon-comercio-exterior	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ba495ae2-cf33-426a-b071-d3d243ddc171	Compra y Venta de Divisas	compra-y-venta-de-divisas	Servicios profesionales de PyME especializados en Compra y Venta de Divisas.	icon-compra-y-venta-de-divisas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3bb5f790-121a-4d19-8627-f56200611efe	Comunicación Institucional	comunicación-institucional	Servicios profesionales de PyME especializados en Comunicación Institucional.	icon-comunicación-institucional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b6028fd6-f30c-4777-ae65-5dfe4837a047	Consultoría de Procesos	consultoría-de-procesos	Servicios profesionales de PyME especializados en Consultoría de Procesos.	icon-consultoría-de-procesos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
bc99aace-b444-49ee-8b37-eefb65108fb5	Consultoría Estratégica	consultoría-estratégica	Servicios profesionales de PyME especializados en Consultoría Estratégica.	icon-consultoría-estratégica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f296b034-2370-4a3a-8974-58d0526f2e1c	Consultoría Humana	consultoría-humana	Servicios profesionales de PyME especializados en Consultoría Humana.	icon-consultoría-humana	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3281600a-538c-4b88-8895-f97a1521680f	Control de Calidad	control-de-calidad	Servicios profesionales de PyME especializados en Control de Calidad.	icon-control-de-calidad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8cf271e4-7558-4c6d-89cc-3a67620ee569	Control de Plagas	control-de-plagas	Servicios profesionales de PyME especializados en Control de Plagas.	icon-control-de-plagas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d6bbf0bd-0b7b-45fc-b35e-39726abec782	Corretaje de Cereales	corretaje-de-cereales	Servicios profesionales de PyME especializados en Corretaje de Cereales.	icon-corretaje-de-cereales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
94d34d0c-604f-4b0d-aa68-d34cdf406cd8	Ciberseguridad	ciberseguridad	Servicios profesionales de PyME especializados en Ciberseguridad.	icon-ciberseguridad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6833b37e-5a11-4aac-92c6-5a7f99a27976	Desarrollo de Apps	desarrollo-de-apps	Servicios profesionales de PyME especializados en Desarrollo de Apps.	icon-desarrollo-de-apps	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c1b230b8-451f-4954-a596-c7b3626194aa	Desarrollo Inmobiliario	desarrollo-inmobiliario	Servicios profesionales de PyME especializados en Desarrollo Inmobiliario.	icon-desarrollo-inmobiliario	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
22d94345-e5f6-40f2-a18d-e276862c358b	Desarrollo Web	desarrollo-web	Servicios profesionales de PyME especializados en Desarrollo Web.	icon-desarrollo-web	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
987fd9ac-6e44-488e-b064-5fbf03bcb590	Diseño de Packaging	diseño-de-packaging	Servicios profesionales de PyME especializados en Diseño de Packaging.	icon-diseño-de-packaging	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8b9a109b-3146-480b-9c89-54bf550f9a61	Diseño de Producto	diseño-de-producto	Servicios profesionales de PyME especializados en Diseño de Producto.	icon-diseño-de-producto	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a0241da4-beb2-4279-a689-3e0d2682ea0b	Diseño de Software	diseño-de-software	Servicios profesionales de PyME especializados en Diseño de Software.	icon-diseño-de-software	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
48ee6303-05bc-44b7-abf0-ee98cd4be508	Diseño Gráfico	diseño-gráfico	Servicios profesionales de PyME especializados en Diseño Gráfico.	icon-diseño-gráfico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
34037ca4-43a5-4a10-8fac-e766b4f15e20	Diseño Industrial	diseño-industrial	Servicios profesionales de PyME especializados en Diseño Industrial.	icon-diseño-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2cc6b96f-a0a1-4f1f-bd9f-ad8cc2d75264	Distribución de Bebidas	distribución-de-bebidas	Servicios profesionales de PyME especializados en Distribución de Bebidas.	icon-distribución-de-bebidas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
106b7248-1bff-4b44-89c5-e7bba74ea3df	Distribución de Energía	distribución-de-energía	Servicios profesionales de PyME especializados en Distribución de Energía.	icon-distribución-de-energía	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
afc54beb-332f-4e73-a4a0-83e8f9bdde43	Domótica	domótica	Servicios profesionales de PyME especializados en Domótica.	icon-domótica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
de84c0bb-3ef0-4137-8a23-46f389ae4b71	E-learning	e-learning	Servicios profesionales de PyME especializados en E-learning.	icon-e-learning	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c3ed134c-9329-420e-9ad3-671f9cb24296	E-commerce	e-commerce	Servicios profesionales de PyME especializados en E-commerce.	icon-e-commerce	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7a6bb8ab-2133-45f8-b504-63da87ef387f	Educación Ejecutiva	educación-ejecutiva	Servicios profesionales de PyME especializados en Educación Ejecutiva.	icon-educación-ejecutiva	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
aa367428-25ca-4660-a9c2-93e221a21022	Eficiencia Energética	eficiencia-energética	Servicios profesionales de PyME especializados en Eficiencia Energética.	icon-eficiencia-energética	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c3d92410-ffa7-4c4c-92c7-3c0ec4f5e005	Energía Solar	energía-solar	Servicios profesionales de PyME especializados en Energía Solar.	icon-energía-solar	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ea0a160b-bbb9-4b8a-bbd2-4db56f9dc750	Energía Eólica	energía-eólica	Servicios profesionales de PyME especializados en Energía Eólica.	icon-energía-eólica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4bc1564a-a093-47e2-8778-bf9825be6e6b	Ensayos de Materiales	ensayos-de-materiales	Servicios profesionales de PyME especializados en Ensayos de Materiales.	icon-ensayos-de-materiales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
e100a904-8a30-4457-a51a-ace2304dd181	Equipamiento Hospitalario	equipamiento-hospitalario	Servicios profesionales de PyME especializados en Equipamiento Hospitalario.	icon-equipamiento-hospitalario	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
e7e316f5-598c-4bae-b1bb-8094aaefb16e	Equipos de Laboratorio	equipos-de-laboratorio	Servicios profesionales de PyME especializados en Equipos de Laboratorio.	icon-equipos-de-laboratorio	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
fc1b7b86-b565-48e3-a1fe-ea40c0b0f244	Estudio de Arquitectura	estudio-de-arquitectura	Servicios profesionales de PyME especializados en Estudio de Arquitectura.	icon-estudio-de-arquitectura	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
26b4aba4-5a32-4583-a5aa-506813af3195	Estudio de Diseño	estudio-de-diseño	Servicios profesionales de PyME especializados en Estudio de Diseño.	icon-estudio-de-diseño	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
443e5df4-abe6-4499-984b-72174380c1dc	Estudio Jurídico	estudio-jurídico	Servicios profesionales de PyME especializados en Estudio Jurídico.	icon-estudio-jurídico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
de2ee1cd-5c6b-4068-97c6-6723269bf11b	Eventos Corporativos	eventos-corporativos	Servicios profesionales de PyME especializados en Eventos Corporativos.	icon-eventos-corporativos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5ec23336-c832-4a41-aa04-5466d2b370b7	Exportación de Carne	exportación-de-carne	Servicios profesionales de PyME especializados en Exportación de Carne.	icon-exportación-de-carne	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a78cc8d2-0b29-4f2b-a4cc-33939d7e911e	Fabricación de Muebles	fabricación-de-muebles	Servicios profesionales de PyME especializados en Fabricación de Muebles.	icon-fabricación-de-muebles	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b69c2d41-df10-491e-bd39-34b3fa0272e1	Fabricación de Plásticos	fabricación-de-plásticos	Servicios profesionales de PyME especializados en Fabricación de Plásticos.	icon-fabricación-de-plásticos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
bd9d9d43-b6e6-4a13-8ce7-5fc300255a21	Ferretería Industrial	ferretería-industrial	Servicios profesionales de PyME especializados en Ferretería Industrial.	icon-ferretería-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a64a0331-4c24-4f03-bac8-d405e2efcfce	Finanzas Tecnológicas	finanzas-tecnológicas	Servicios profesionales de PyME especializados en Finanzas Tecnológicas.	icon-finanzas-tecnológicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5607dd50-af2f-430c-a6ef-f1f60ddcb2a8	Fisioterapia y Rehabilitación	fisioterapia-y-rehabilitación	Servicios profesionales de PyME especializados en Fisioterapia y Rehabilitación.	icon-fisioterapia-y-rehabilitación	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ee18f2f0-2023-479e-ab87-44fdae2b5794	Formación de Líderes	formación-de-líderes	Servicios profesionales de PyME especializados en Formación de Líderes.	icon-formación-de-líderes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f3d22c45-5b11-48f5-89e5-e248a1880cdd	Fotografía Profesional	fotografía-profesional	Servicios profesionales de PyME especializados en Fotografía Profesional.	icon-fotografía-profesional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
818723f8-872d-420f-8cea-d56209bcc3c8	Fundición de Metales	fundición-de-metales	Servicios profesionales de PyME especializados en Fundición de Metales.	icon-fundición-de-metales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
38fecf10-dba1-402b-9303-60313248406c	Ganadería Bovina	ganadería-bovina	Servicios profesionales de PyME especializados en Ganadería Bovina.	icon-ganadería-bovina	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
878d618d-2780-46e1-bdbb-dbbeb98a7320	Gestión de Activos	gestión-de-activos	Servicios profesionales de PyME especializados en Gestión de Activos.	icon-gestión-de-activos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
31dd391e-014d-4dd9-a482-170e70773390	Gestión de Cobranzas	gestión-de-cobranzas	Servicios profesionales de PyME especializados en Gestión de Cobranzas.	icon-gestión-de-cobranzas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
71a1c5b6-c4cd-425b-ac28-a38b22f1fc16	Gestión de Residuos	gestión-de-residuos	Servicios profesionales de PyME especializados en Gestión de Residuos.	icon-gestión-de-residuos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c5e8be97-5103-46d8-aabe-9fce5cb24947	Gestión de Riesgos	gestión-de-riesgos	Servicios profesionales de PyME especializados en Gestión de Riesgos.	icon-gestión-de-riesgos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5d5694d9-5e6a-43b7-89e1-5b6f775e0895	Gestión Documental	gestión-documental	Servicios profesionales de PyME especializados en Gestión Documental.	icon-gestión-documental	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a3097759-e9b7-4072-99cf-43c9d09b4e34	Gestión Educativa	gestión-educativa	Servicios profesionales de PyME especializados en Gestión Educativa.	icon-gestión-educativa	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6aed18f2-28c5-45ba-934f-1f56987d797d	Gestión Hotelera	gestión-hotelera	Servicios profesionales de PyME especializados en Gestión Hotelera.	icon-gestión-hotelera	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2a39d3d9-4778-4261-9d4a-0bbfce4699f4	Gestión Municipal	gestión-municipal	Servicios profesionales de PyME especializados en Gestión Municipal.	icon-gestión-municipal	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3161860c-5f33-4665-b809-47dc39da106a	Gestión Patrimonial	gestión-patrimonial	Servicios profesionales de PyME especializados en Gestión Patrimonial.	icon-gestión-patrimonial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7c0cd508-017a-4dcf-8907-b4a28ce2cd85	Hidráulica Industrial	hidráulica-industrial	Servicios profesionales de PyME especializados en Hidráulica Industrial.	icon-hidráulica-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5939372e-2a94-4aa6-bb3a-04df8bb348b8	Hormigón Elaborado	hormigón-elaborado	Servicios profesionales de PyME especializados en Hormigón Elaborado.	icon-hormigón-elaborado	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
eed4c649-577a-4ea1-b073-33576feeb9e8	Hotelería de Lujo	hotelería-de-lujo	Servicios profesionales de PyME especializados en Hotelería de Lujo.	icon-hotelería-de-lujo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
679f20d5-47ec-47c9-9ef0-7a3bcd5016ab	Imprenta Digital	imprenta-digital	Servicios profesionales de PyME especializados en Imprenta Digital.	icon-imprenta-digital	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
26c829f0-3d1d-464b-a497-cd25c45f0aab	Impresión 3D	impresión-3d	Servicios profesionales de PyME especializados en Impresión 3D.	icon-impresión-3d	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6b5b1911-9e69-47f6-9ace-d553c80118b9	Infraestructura de Redes	infraestructura-de-redes	Servicios profesionales de PyME especializados en Infraestructura de Redes.	icon-infraestructura-de-redes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b2df1f1d-b40d-46f7-be6a-3084eaf580ff	Ingeniería Civil	ingeniería-civil	Servicios profesionales de PyME especializados en Ingeniería Civil.	icon-ingeniería-civil	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b77d705d-9c56-48f2-aa8f-ec7d1893370d	Ingeniería Eléctrica	ingeniería-eléctrica	Servicios profesionales de PyME especializados en Ingeniería Eléctrica.	icon-ingeniería-eléctrica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
cee96093-a13b-4a33-a6b5-52bdf112e5d4	Ingeniería Mecánica	ingeniería-mecánica	Servicios profesionales de PyME especializados en Ingeniería Mecánica.	icon-ingeniería-mecánica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7bb9b10a-8c85-424a-be08-cf46a7eae9bb	Ingeniería Naval	ingeniería-naval	Servicios profesionales de PyME especializados en Ingeniería Naval.	icon-ingeniería-naval	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
cc4919f0-6c6b-44d9-a3aa-7f737a3c6fe2	Inmobiliaria Rural	inmobiliaria-rural	Servicios profesionales de PyME especializados en Inmobiliaria Rural.	icon-inmobiliaria-rural	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9fb87914-a59c-46f4-a631-90f2a1677ac4	Inmótica	inmótica	Servicios profesionales de PyME especializados en Inmótica.	icon-inmótica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b368c90a-e664-4c39-bb89-0d7d381b8ab0	Instalaciones Eléctricas	instalaciones-eléctricas	Servicios profesionales de PyME especializados en Instalaciones Eléctricas.	icon-instalaciones-eléctricas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2ff41748-9ff4-4d5a-b157-1a63ab3af479	Instalaciones de Gas	instalaciones-de-gas	Servicios profesionales de PyME especializados en Instalaciones de Gas.	icon-instalaciones-de-gas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
96cf33cc-755e-4265-8297-1387e1503eaa	Insumos Agropecuarios	insumos-agropecuarios	Servicios profesionales de PyME especializados en Insumos Agropecuarios.	icon-insumos-agropecuarios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6a51b242-9580-4d7c-92e7-16648c8008a7	Insumos de Limpieza	insumos-de-limpieza	Servicios profesionales de PyME especializados en Insumos de Limpieza.	icon-insumos-de-limpieza	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
25e3a51c-222d-4fb1-8e71-c3b3671b5f43	Insumos Médicos	insumos-médicos	Servicios profesionales de PyME especializados en Insumos Médicos.	icon-insumos-médicos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
873fba13-c062-485f-b754-b48afe59bd96	Inteligencia Artificial	inteligencia-artificial	Servicios profesionales de PyME especializados en Inteligencia Artificial.	icon-inteligencia-artificial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
15dfe789-5f4c-429a-9ca8-2b9f3b30979e	Inteligencia de Negocios	inteligencia-de-negocios	Servicios profesionales de PyME especializados en Inteligencia de Negocios.	icon-inteligencia-de-negocios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
da5b2c64-64f4-4d09-aa54-a850f8dad1ee	Interiorismo	interiorismo	Servicios profesionales de PyME especializados en Interiorismo.	icon-interiorismo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d62a527f-9475-4cb6-a5bf-f7ecf6bc05e2	Investigación de Mercado	investigación-de-mercado	Servicios profesionales de PyME especializados en Investigación de Mercado.	icon-investigación-de-mercado	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d1da41ea-dd77-407a-9081-20aa2cec2d7f	Jardinería Paisajista	jardinería-paisajista	Servicios profesionales de PyME especializados en Jardinería Paisajista.	icon-jardinería-paisajista	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
72fd061c-7e4f-40e6-8244-f098d0d42f13	Joyatría Artesanal	joyatría-artesanal	Servicios profesionales de PyME especializados en Joyatría Artesanal.	icon-joyatría-artesanal	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c92c3514-9530-4ca4-a33c-dfb57bb61802	Kinesiología Deportiva	kinesiología-deportiva	Servicios profesionales de PyME especializados en Kinesiología Deportiva.	icon-kinesiología-deportiva	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4814d67a-c4a2-4238-9e10-91749a457d03	Laboratorio de Suelos	laboratorio-de-suelos	Servicios profesionales de PyME especializados en Laboratorio de Suelos.	icon-laboratorio-de-suelos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8338f6f7-6f7a-410d-a15f-75ac401476fa	Lavandería Industrial	lavandería-industrial	Servicios profesionales de PyME especializados en Lavandería Industrial.	icon-lavandería-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6a2823ac-40d8-4d6b-93cd-39a76bc87bc3	LegalTech	legaltech	Servicios profesionales de PyME especializados en LegalTech.	icon-legaltech	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8ee38405-6f4c-49c2-9c49-70041063e859	Limpieza de Oficinas	limpieza-de-oficinas	Servicios profesionales de PyME especializados en Limpieza de Oficinas.	icon-limpieza-de-oficinas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3a3ad7ae-24e0-4ed1-ac2b-dafcf4bc5a21	Litigios Civiles	litigios-civiles	Servicios profesionales de PyME especializados en Litigios Civiles.	icon-litigios-civiles	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
acdce3d2-f227-44f0-a34e-8f52f076c32e	Logística de Distribución	logística-de-distribución	Servicios profesionales de PyME especializados en Logística de Distribución.	icon-logística-de-distribución	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
917083b2-0e25-48b7-9cde-79efbc5e0139	Logística de Frío	logística-de-frío	Servicios profesionales de PyME especializados en Logística de Frío.	icon-logística-de-frío	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1fd243bc-a811-4531-ab4c-d58e47fed2a4	Logística de Última Milla	logística-de-última-milla	Servicios profesionales de PyME especializados en Logística de Última Milla.	icon-logística-de-última-milla	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7a944709-15d6-4897-b14d-ff0051a3d232	Logística Internacional	logística-internacional	Servicios profesionales de PyME especializados en Logística Internacional.	icon-logística-internacional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a53b821e-7bac-4dc9-819f-5a240ba88b76	Mantenimiento de Ascensores	mantenimiento-de-ascensores	Servicios profesionales de PyME especializados en Mantenimiento de Ascensores.	icon-mantenimiento-de-ascensores	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
582faf66-5726-45f1-8ab0-3017efa7cdeb	Mantenimiento Preventivo	mantenimiento-preventivo	Servicios profesionales de PyME especializados en Mantenimiento Preventivo.	icon-mantenimiento-preventivo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1c9b50fc-0cb0-4f65-93bb-9668c5d6cd4a	Maquinaria Agrícola	maquinaria-agrícola	Servicios profesionales de PyME especializados en Maquinaria Agrícola.	icon-maquinaria-agrícola	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
cdd062cc-e768-4cfd-bd63-61ff277cdaa4	Maquinaria de Construcción	maquinaria-de-construcción	Servicios profesionales de PyME especializados en Maquinaria de Construcción.	icon-maquinaria-de-construcción	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
858472d5-34ff-4c15-88f7-4370011f36bb	Maquinaria Textil	maquinaria-textil	Servicios profesionales de PyME especializados en Maquinaria Textil.	icon-maquinaria-textil	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f4d1db17-1f66-4d47-bb3d-9e8a7e784cd3	Marketing de Influencers	marketing-de-influencers	Servicios profesionales de PyME especializados en Marketing de Influencers.	icon-marketing-de-influencers	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0296127f-93d3-4a8d-bad4-0292f1275940	Marketing Digital	marketing-digital	Servicios profesionales de PyME especializados en Marketing Digital.	icon-marketing-digital	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4eeda3b5-738b-4e1a-9adf-40fd0c5f8a8e	Marketing Político	marketing-político	Servicios profesionales de PyME especializados en Marketing Político.	icon-marketing-político	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b7df1b0d-7095-485c-b14f-ecc6f32fd09c	Materiales de Construcción	materiales-de-construcción	Servicios profesionales de PyME especializados en Materiales de Construcción.	icon-materiales-de-construcción	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a0c28ba6-1e23-4683-ab19-7da7dc6fcdec	Matricería	matricería	Servicios profesionales de PyME especializados en Matricería.	icon-matricería	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1fa5afec-b1e0-40b1-a706-8f73ce552714	Medicina del Trabajo	medicina-del-trabajo	Servicios profesionales de PyME especializados en Medicina del Trabajo.	icon-medicina-del-trabajo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ce01d94f-a646-4dcd-a057-644aecb2c233	Medicina Estética	medicina-estética	Servicios profesionales de PyME especializados en Medicina Estética.	icon-medicina-estética	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5f6b3dc2-6b5d-438a-8dce-f95a05ec9830	Medios de Pago	medios-de-pago	Servicios profesionales de PyME especializados en Medios de Pago.	icon-medios-de-pago	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
e581031d-248b-4cbf-8fee-72cfbce31260	Mercado de Capitales	mercado-de-capitales	Servicios profesionales de PyME especializados en Mercado de Capitales.	icon-mercado-de-capitales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
91b8e52c-d22d-4b13-9150-7214a2d3d9f6	Merchandising	merchandising	Servicios profesionales de PyME especializados en Merchandising.	icon-merchandising	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3616b715-1161-45cd-988e-d47a128477a9	Metalúrgica Pesada	metalúrgica-pesada	Servicios profesionales de PyME especializados en Metalúrgica Pesada.	icon-metalúrgica-pesada	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ddc8fe51-8b88-43eb-a32f-feaf91b7f5f2	Microfinanzas	microfinanzas	Servicios profesionales de PyME especializados en Microfinanzas.	icon-microfinanzas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4b14e104-b304-437e-b361-c9d793c089ef	Minería de Datos	minería-de-datos	Servicios profesionales de PyME especializados en Minería de Datos.	icon-minería-de-datos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ed5ee88d-c61f-4cc1-801b-29b7bdf01a0a	Montajes Industriales	montajes-industriales	Servicios profesionales de PyME especializados en Montajes Industriales.	icon-montajes-industriales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d83a0155-ddaf-40e3-a2bc-74628f991eca	Mudanzas Internacionales	mudanzas-internacionales	Servicios profesionales de PyME especializados en Mudanzas Internacionales.	icon-mudanzas-internacionales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
263d7820-33b2-4f88-bebd-ff5a0748f731	Nanotecnología	nanotecnología	Servicios profesionales de PyME especializados en Nanotecnología.	icon-nanotecnología	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b33d76d9-df2a-4adf-b519-ae85566f3662	Nutrición Animal	nutrición-animal	Servicios profesionales de PyME especializados en Nutrición Animal.	icon-nutrición-animal	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5ae93109-86f1-4fd1-86cb-a7469aeee251	Nutrición Deportiva	nutrición-deportiva	Servicios profesionales de PyME especializados en Nutrición Deportiva.	icon-nutrición-deportiva	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ba0db769-e394-46e8-9325-2f4030e40850	Obras de Infraestructura	obras-de-infraestructura	Servicios profesionales de PyME especializados en Obras de Infraestructura.	icon-obras-de-infraestructura	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a033e425-dc89-4406-9c0d-3f97edb3c804	Obras Viales	obras-viales	Servicios profesionales de PyME especializados en Obras Viales.	icon-obras-viales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
e290bf23-1273-43f4-953c-d74f153dac10	Odontología Especializada	odontología-especializada	Servicios profesionales de PyME especializados en Odontología Especializada.	icon-odontología-especializada	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6ab3df08-2f11-4f0f-b4f0-3604b078b823	Ofimática	ofimática	Servicios profesionales de PyME especializados en Ofimática.	icon-ofimática	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ae4d1062-682c-45e7-94ca-08991ac73eef	Operador Logístico	operador-logístico	Servicios profesionales de PyME especializados en Operador Logístico.	icon-operador-logístico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d33fc54a-f22b-43ff-a95c-8a0785eaad28	Optimización de Almacenes	optimización-de-almacenes	Servicios profesionales de PyME especializados en Optimización de Almacenes.	icon-optimización-de-almacenes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8c666819-a7b0-4ce0-98b1-701accede1a6	Organización de Congresos	organización-de-congresos	Servicios profesionales de PyME especializados en Organización de Congresos.	icon-organización-de-congresos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3dceed43-988c-40e3-aa9a-1779909bce39	Outsourcing Comercial	outsourcing-comercial	Servicios profesionales de PyME especializados en Outsourcing Comercial.	icon-outsourcing-comercial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8b03bd25-5e53-4d6d-90e3-4030692f756b	Outsourcing de IT	outsourcing-de-it	Servicios profesionales de PyME especializados en Outsourcing de IT.	icon-outsourcing-de-it	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9fc38ab3-a4eb-4197-abc9-c0ac43f9e192	Packaging Sustentable	packaging-sustentable	Servicios profesionales de PyME especializados en Packaging Sustentable.	icon-packaging-sustentable	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
37b6e5fd-6596-464a-9a2e-ea4a6d61887e	Panificación Industrial	panificación-industrial	Servicios profesionales de PyME especializados en Panificación Industrial.	icon-panificación-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4f697611-af5c-47f7-b8f3-8dcb5a61986c	Parques Industriales	parques-industriales	Servicios profesionales de PyME especializados en Parques Industriales.	icon-parques-industriales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4fa40ebb-1343-4cca-912c-9af9d0c07b95	Pavimentación	pavimentación	Servicios profesionales de PyME especializados en Pavimentación.	icon-pavimentación	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
84d52827-7a47-4ebf-96ab-86c43b363e43	Periodismo Especializado	periodismo-especializado	Servicios profesionales de PyME especializados en Periodismo Especializado.	icon-periodismo-especializado	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4dfd1e6e-cb1c-4861-b179-8f4b0233f785	Peritajes Judiciales	peritajes-judiciales	Servicios profesionales de PyME especializados en Peritajes Judiciales.	icon-peritajes-judiciales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b2f3662a-47ef-403d-9618-028c19b3cd56	Pintura Industrial	pintura-industrial	Servicios profesionales de PyME especializados en Pintura Industrial.	icon-pintura-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7b37c35f-8a55-44cc-9b6c-78ebf5e83e20	Plataformas de Pago	plataformas-de-pago	Servicios profesionales de PyME especializados en Plataformas de Pago.	icon-plataformas-de-pago	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
994a3c1a-5bda-430d-95f9-e87722afb655	Podología	podología	Servicios profesionales de PyME especializados en Podología.	icon-podología	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0ca0e6c0-c3f0-420c-916d-f2a5c3eeccbe	Postproducción de Video	postproducción-de-video	Servicios profesionales de PyME especializados en Postproducción de Video.	icon-postproducción-de-video	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
99dc2299-e43b-4ea7-9a23-41ae3b2c5613	Prevención de Riesgos	prevención-de-riesgos	Servicios profesionales de PyME especializados en Prevención de Riesgos.	icon-prevención-de-riesgos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
88100910-968d-44be-be9e-4ebee945f472	Procesamiento de Alimentos	procesamiento-de-alimentos	Servicios profesionales de PyME especializados en Procesamiento de Alimentos.	icon-procesamiento-de-alimentos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a0ed3144-fbed-4a49-ae9f-950dba49ba17	Producción Audiovisual	producción-audiovisual	Servicios profesionales de PyME especializados en Producción Audiovisual.	icon-producción-audiovisual	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c72683e4-f6cc-4ef0-9f4b-6466217bae7d	Producción de Eventos	producción-de-eventos	Servicios profesionales de PyME especializados en Producción de Eventos.	icon-producción-de-eventos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
715fe8e4-f99c-4a46-8052-739f89111964	Producción de Semillas	producción-de-semillas	Servicios profesionales de PyME especializados en Producción de Semillas.	icon-producción-de-semillas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
33f8378c-64cb-4b41-bedc-83618a098020	Programación de PLC	programación-de-plc	Servicios profesionales de PyME especializados en Programación de PLC.	icon-programación-de-plc	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b3182cf5-2d74-4c65-9dd6-a7673299d786	Promoción de Exportaciones	promoción-de-exportaciones	Servicios profesionales de PyME especializados en Promoción de Exportaciones.	icon-promoción-de-exportaciones	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3973418c-ba31-4c5f-b213-1e13be964b97	Propiedad Intelectual	propiedad-intelectual	Servicios profesionales de PyME especializados en Propiedad Intelectual.	icon-propiedad-intelectual	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2dc963dc-607f-4332-9ddb-b359835a41c0	Protección de Datos	protección-de-datos	Servicios profesionales de PyME especializados en Protección de Datos.	icon-protección-de-datos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
62989cbd-9317-468b-b8c8-d9c7a6dc65cd	Protocolo y Ceremonial	protocolo-y-ceremonial	Servicios profesionales de PyME especializados en Protocolo y Ceremonial.	icon-protocolo-y-ceremonial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f51993d8-c7c1-41c5-a924-93a80d052cd9	Proyectos de Ingeniería	proyectos-de-ingeniería	Servicios profesionales de PyME especializados en Proyectos de Ingeniería.	icon-proyectos-de-ingeniería	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2948eeba-32e3-4813-bfbc-b7265eab8b0b	Psicología Organizacional	psicología-organizacional	Servicios profesionales de PyME especializados en Psicología Organizacional.	icon-psicología-organizacional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f86270c1-0161-438b-9476-f2e66dd077b4	Publicidad Exterior	publicidad-exterior	Servicios profesionales de PyME especializados en Publicidad Exterior.	icon-publicidad-exterior	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d92d4ede-54eb-4767-809b-57786e2a6225	Pymes Exportadoras	pymes-exportadoras	Servicios profesionales de PyME especializados en Pymes Exportadoras.	icon-pymes-exportadoras	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3dc46ae7-6eae-401e-8d8c-be8b818912e5	Química Industrial	química-industrial	Servicios profesionales de PyME especializados en Química Industrial.	icon-química-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c5f8b69a-db2a-4915-9226-18d6a75041ec	Radiología Digital	radiología-digital	Servicios profesionales de PyME especializados en Radiología Digital.	icon-radiología-digital	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
92d02a35-623e-48fb-a211-4c0a9dcb41d2	Reciclaje de Metales	reciclaje-de-metales	Servicios profesionales de PyME especializados en Reciclaje de Metales.	icon-reciclaje-de-metales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6ee7ffb9-7cd9-4f52-9cda-5b33987f4fdf	Reciclaje de Plásticos	reciclaje-de-plásticos	Servicios profesionales de PyME especializados en Reciclaje de Plásticos.	icon-reciclaje-de-plásticos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
83194d46-7ccf-4cd5-b2fb-3f537733c74c	Recubrimientos Industriales	recubrimientos-industriales	Servicios profesionales de PyME especializados en Recubrimientos Industriales.	icon-recubrimientos-industriales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6dfecc5e-0595-4c95-b2c6-59364416aa66	Recuperación de Datos	recuperación-de-datos	Servicios profesionales de PyME especializados en Recuperación de Datos.	icon-recuperación-de-datos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4013e672-2d8a-46ce-aae4-9ec01df43e7c	Recursos Humanos	recursos-humanos	Servicios profesionales de PyME especializados en Recursos Humanos.	icon-recursos-humanos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a9e16460-124a-4fbb-acb1-87b0c889ce89	Redes Sociales	redes-sociales	Servicios profesionales de PyME especializados en Redes Sociales.	icon-redes-sociales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a340bc92-6dea-4154-b8a2-5f3cc717c0f3	Refrigeración Comercial	refrigeración-comercial	Servicios profesionales de PyME especializados en Refrigeración Comercial.	icon-refrigeración-comercial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4ba3ee49-8122-4a2f-a49c-f4d775914e77	Regalos Empresariales	regalos-empresariales	Servicios profesionales de PyME especializados en Regalos Empresariales.	icon-regalos-empresariales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3273826b-4c57-4e20-bca6-7aafc063a64a	Relaciones Públicas	relaciones-públicas	Servicios profesionales de PyME especializados en Relaciones Públicas.	icon-relaciones-públicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3bc2569d-3e93-42af-b217-41ec991af78d	Remediación Ambiental	remediación-ambiental	Servicios profesionales de PyME especializados en Remediación Ambiental.	icon-remediación-ambiental	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b53c6e10-417a-448e-a416-1474da49e5bd	Renting de Vehículos	renting-de-vehículos	Servicios profesionales de PyME especializados en Renting de Vehículos.	icon-renting-de-vehículos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
16b8ec42-cf93-4307-8f4a-450fa7314993	Reparación de Hardware	reparación-de-hardware	Servicios profesionales de PyME especializados en Reparación de Hardware.	icon-reparación-de-hardware	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0d149cdc-e6b6-4e6b-934f-dd1d15edf539	Reparación de Maquinaria	reparación-de-maquinaria	Servicios profesionales de PyME especializados en Reparación de Maquinaria.	icon-reparación-de-maquinaria	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7f74d203-e90f-430d-b147-67c08cf66db8	Representaciones Comerciales	representaciones-comerciales	Servicios profesionales de PyME especializados en Representaciones Comerciales.	icon-representaciones-comerciales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d872c4e9-de0b-4fe1-b71b-2dcda7ba8b67	Repuestos del Automotor	repuestos-del-automotor	Servicios profesionales de PyME especializados en Repuestos del Automotor.	icon-repuestos-del-automotor	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
71718fd4-ef5c-468a-8ed0-68d5199c8aa2	Retail	retail	Servicios profesionales de PyME especializados en Retail.	icon-retail	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1ac2039e-92c1-4488-b6e2-57ecb06d1686	Robótica Colaborativa	robótica-colaborativa	Servicios profesionales de PyME especializados en Robótica Colaborativa.	icon-robótica-colaborativa	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
89149548-73ab-4076-b790-6186972176fe	Salud Ocupacional	salud-ocupacional	Servicios profesionales de PyME especializados en Salud Ocupacional.	icon-salud-ocupacional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a9465596-bc71-4d56-96c0-d898358dc7d3	Sanidad Vegetal	sanidad-vegetal	Servicios profesionales de PyME especializados en Sanidad Vegetal.	icon-sanidad-vegetal	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b706e4b3-e9bc-4286-89fa-30bfbf41ee9b	Seguridad de la Información	seguridad-de-la-información	Servicios profesionales de PyME especializados en Seguridad de la Información.	icon-seguridad-de-la-información	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
934fee7f-d8fd-4e96-aabc-205be68ca87a	Seguridad Electrónica	seguridad-electrónica	Servicios profesionales de PyME especializados en Seguridad Electrónica.	icon-seguridad-electrónica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
43c88ed7-63f3-4545-a666-6d13be59e012	Seguridad Higiene	seguridad-higiene	Servicios profesionales de PyME especializados en Seguridad Higiene.	icon-seguridad-higiene	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c51b9469-18e4-48b1-ac7c-a9dfe4e41cd6	Seguridad Privada	seguridad-privada	Servicios profesionales de PyME especializados en Seguridad Privada.	icon-seguridad-privada	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
05cc3636-826b-4125-96d1-01e3634faa31	Seguros de Caución	seguros-de-caución	Servicios profesionales de PyME especializados en Seguros de Caución.	icon-seguros-de-caución	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2291c712-93e0-4ae6-b9f8-0659a52d212e	Seguros de Vida	seguros-de-vida	Servicios profesionales de PyME especializados en Seguros de Vida.	icon-seguros-de-vida	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
e92075ac-db1b-4122-8d64-601cdfb8fb61	Semillas y Cereales	semillas-y-cereales	Servicios profesionales de PyME especializados en Semillas y Cereales.	icon-semillas-y-cereales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
368f8f56-5882-4bed-8c5c-3a31c0a482c0	Servicio de Courier	servicio-de-courier	Servicios profesionales de PyME especializados en Servicio de Courier.	icon-servicio-de-courier	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3fded89f-8dbe-449e-a018-2c7035d40d04	Servicio de Grúas	servicio-de-grúas	Servicios profesionales de PyME especializados en Servicio de Grúas.	icon-servicio-de-grúas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
48f4c401-ac7e-441c-9862-11a16a2e50c3	Servicio de Mensajería	servicio-de-mensajería	Servicios profesionales de PyME especializados en Servicio de Mensajería.	icon-servicio-de-mensajería	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1e29b544-88b8-458c-93ce-b7e5a458845b	Servicios Aeroportuarios	servicios-aeroportuarios	Servicios profesionales de PyME especializados en Servicios Aeroportuarios.	icon-servicios-aeroportuarios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7820c452-12b7-40a0-af65-a6db4a5eb224	Servicios de Catering	servicios-de-catering	Servicios profesionales de PyME especializados en Servicios de Catering.	icon-servicios-de-catering	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
355c5ae7-6893-495f-b106-817f1ae371bc	Servicios de Impresión	servicios-de-impresión	Servicios profesionales de PyME especializados en Servicios de Impresión.	icon-servicios-de-impresión	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
edd82519-211a-4ebc-8cca-50071b8c675b	Servicios de Limpieza	servicios-de-limpieza	Servicios profesionales de PyME especializados en Servicios de Limpieza.	icon-servicios-de-limpieza	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b20db356-2af7-4157-8228-58ab6874f5ec	Servicios de Traducción	servicios-de-traducción	Servicios profesionales de PyME especializados en Servicios de Traducción.	icon-servicios-de-traducción	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
aa089602-55f8-463b-8051-68dfee0aed8f	Servicios Editoriales	servicios-editoriales	Servicios profesionales de PyME especializados en Servicios Editoriales.	icon-servicios-editoriales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
dca9c7d4-a7e0-4695-bf0e-6e13e4710027	Servicios Financieros	servicios-financieros	Servicios profesionales de PyME especializados en Servicios Financieros.	icon-servicios-financieros	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
099efbbb-0c0c-48e7-a8f8-275f431b56b8	Servicios Funerarios	servicios-funerarios	Servicios profesionales de PyME especializados en Servicios Funerarios.	icon-servicios-funerarios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7e8f895f-a920-4647-aa9c-b93372677263	Servicios Meteorológicos	servicios-meteorológicos	Servicios profesionales de PyME especializados en Servicios Meteorológicos.	icon-servicios-meteorológicos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8f45caed-f8e7-4d75-85c3-cd02078cc14a	Servicios Petroleros	servicios-petroleros	Servicios profesionales de PyME especializados en Servicios Petroleros.	icon-servicios-petroleros	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f8677b8d-407d-45a7-b412-000d91f1ac30	Sistemas de Gestión	sistemas-de-gestión	Servicios profesionales de PyME especializados en Sistemas de Gestión.	icon-sistemas-de-gestión	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
82f7d633-5213-498b-ad92-7102df000b24	Sistemas de Riego	sistemas-de-riego	Servicios profesionales de PyME especializados en Sistemas de Riego.	icon-sistemas-de-riego	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
bb129daf-fb4d-4570-bed0-3feea5f84c1d	Sistemas Embebidos	sistemas-embebidos	Servicios profesionales de PyME especializados en Sistemas Embebidos.	icon-sistemas-embebidos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
59d7fbd1-af31-4adb-b574-97d0e664e78b	Software de Gestión	software-de-gestión	Servicios profesionales de PyME especializados en Software de Gestión.	icon-software-de-gestión	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7f81cfde-6a5b-4778-8ef7-179a23f86b50	Software para RRHH	software-para-rrhh	Servicios profesionales de PyME especializados en Software para RRHH.	icon-software-para-rrhh	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3c6bfe6a-63b8-4437-b705-fb75d55d6666	Soporte Técnico	soporte-técnico	Servicios profesionales de PyME especializados en Soporte Técnico.	icon-soporte-técnico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
34536a61-9d12-4aab-ba91-b08c9e70b043	Streaming Profesional	streaming-profesional	Servicios profesionales de PyME especializados en Streaming Profesional.	icon-streaming-profesional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c7bbe1ae-1d52-4afc-8f7d-35abc9c2903d	Suministros de Oficina	suministros-de-oficina	Servicios profesionales de PyME especializados en Suministros de Oficina.	icon-suministros-de-oficina	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a8e85f5e-fc55-46c4-9f48-7c45cae045f3	Suministros Eléctricos	suministros-eléctricos	Servicios profesionales de PyME especializados en Suministros Eléctricos.	icon-suministros-eléctricos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
165dfe15-f608-41e4-b1ab-63866e934fa6	Taller de Chapa y Pintura	taller-de-chapa-y-pintura	Servicios profesionales de PyME especializados en Taller de Chapa y Pintura.	icon-taller-de-chapa-y-pintura	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
980e86e5-fd03-44d7-a84d-8daa049b513c	Taller Mecánico	taller-mecánico	Servicios profesionales de PyME especializados en Taller Mecánico.	icon-taller-mecánico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ebbe363b-84c0-418c-9154-0b29814e3792	Tecnología Educativa	tecnología-educativa	Servicios profesionales de PyME especializados en Tecnología Educativa.	icon-tecnología-educativa	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
15a5d1ca-6ce9-4d87-b426-8b4437592302	Telecomunicaciones	telecomunicaciones	Servicios profesionales de PyME especializados en Telecomunicaciones.	icon-telecomunicaciones	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
336899ab-0041-4813-ad51-105912c8659f	Telemarketing	telemarketing	Servicios profesionales de PyME especializados en Telemarketing.	icon-telemarketing	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b86f13e3-f0f6-45c5-8043-7843690ca494	Tercerización de Nómina	tercerización-de-nómina	Servicios profesionales de PyME especializados en Tercerización de Nómina.	icon-tercerización-de-nómina	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
043cf47b-dc5f-48a9-95b6-249e7e2e82ba	Textiles del Hogar	textiles-del-hogar	Servicios profesionales de PyME especializados en Textiles del Hogar.	icon-textiles-del-hogar	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ef7cc8c0-d044-417a-ae54-670eb8fd67c2	Tiendas Online	tiendas-online	Servicios profesionales de PyME especializados en Tiendas Online.	icon-tiendas-online	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a0fd4e5d-8562-4a14-a918-6e5e4e4ab5a8	Topografía	topografía	Servicios profesionales de PyME especializados en Topografía.	icon-topografía	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
10d0e75b-7549-4bfe-8e9d-a75be5f3bb5f	Tornería de Precisión	tornería-de-precisión	Servicios profesionales de PyME especializados en Tornería de Precisión.	icon-tornería-de-precisión	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
899a4ac3-eca8-4c46-8cb3-68421b3909b1	Trámites Aduaneros	trámites-aduaneros	Servicios profesionales de PyME especializados en Trámites Aduaneros.	icon-trámites-aduaneros	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
11a5b6fb-d996-42c1-9b90-3b5c49f636bd	Transformación Digital	transformación-digital	Servicios profesionales de PyME especializados en Transformación Digital.	icon-transformación-digital	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d27409c9-bc61-43dc-8e05-f85f3c8fce64	Transporte de Caudales	transporte-de-caudales	Servicios profesionales de PyME especializados en Transporte de Caudales.	icon-transporte-de-caudales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6e4070bb-738b-4134-88da-1a279d3b239c	Transporte de Pasajeros	transporte-de-pasajeros	Servicios profesionales de PyME especializados en Transporte de Pasajeros.	icon-transporte-de-pasajeros	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
17715484-1336-4732-b5a8-732c81350d89	Transporte Escolar	transporte-escolar	Servicios profesionales de PyME especializados en Transporte Escolar.	icon-transporte-escolar	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2c7b788c-003f-4531-b468-fd037b2c6a26	Transporte Nacional	transporte-nacional	Servicios profesionales de PyME especializados en Transporte Nacional.	icon-transporte-nacional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ce6b9911-0065-4c70-aea0-af592102682f	Transporte Sanitario	transporte-sanitario	Servicios profesionales de PyME especializados en Transporte Sanitario.	icon-transporte-sanitario	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9c4a9078-fd91-45c4-9674-ca6d829c2e2e	Tratamiento de Agua	tratamiento-de-agua	Servicios profesionales de PyME especializados en Tratamiento de Agua.	icon-tratamiento-de-agua	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8933d388-6fcc-47ea-a868-618d4586dc31	Tratamiento de Efluentes	tratamiento-de-efluentes	Servicios profesionales de PyME especializados en Tratamiento de Efluentes.	icon-tratamiento-de-efluentes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4dd2798d-b709-4ffa-84c7-764671160dd4	Turismo Aventura	turismo-aventura	Servicios profesionales de PyME especializados en Turismo Aventura.	icon-turismo-aventura	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
76f184fb-da85-4635-a70f-a658a9d62649	Turismo de Negocios	turismo-de-negocios	Servicios profesionales de PyME especializados en Turismo de Negocios.	icon-turismo-de-negocios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6ca836b2-6af0-4953-a3aa-f28db48a4da2	Turismo Rural	turismo-rural	Servicios profesionales de PyME especializados en Turismo Rural.	icon-turismo-rural	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ffe7303b-c11f-4c0c-ba8f-a5ab7ea8ef2f	Unidades Móviles	unidades-móviles	Servicios profesionales de PyME especializados en Unidades Móviles.	icon-unidades-móviles	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ffd8088c-3fd1-4aa3-afee-f5f6bc86a275	Urbanismo	urbanismo	Servicios profesionales de PyME especializados en Urbanismo.	icon-urbanismo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
288fbd9a-e7a1-4a92-b8a0-b9be7a8f7300	Venta de Neumáticos	venta-de-neumáticos	Servicios profesionales de PyME especializados en Venta de Neumáticos.	icon-venta-de-neumáticos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f3410ab7-83dd-48fa-a202-cc1c6e7c7586	Venta de Vehículos	venta-de-vehículos	Servicios profesionales de PyME especializados en Venta de Vehículos.	icon-venta-de-vehículos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a7c16c2e-9b3d-46ee-8e59-6cee7c0c9863	Veterinaria de Grandes Animales	veterinaria-de-grandes-animales	Servicios profesionales de PyME especializados en Veterinaria de Grandes Animales.	icon-veterinaria-de-grandes-animales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
df2f4961-8b70-4a74-9cb7-1f4c44fecf4c	Video Vigilancia	video-vigilancia	Servicios profesionales de PyME especializados en Video Vigilancia.	icon-video-vigilancia	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6e150326-7996-4a93-958b-de5209b2edbf	Vidriería	vidriería	Servicios profesionales de PyME especializados en Vidriería.	icon-vidriería	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
55e13027-93dc-458e-a3fe-f5cce083ee4f	Vigilancia Física	vigilancia-física	Servicios profesionales de PyME especializados en Vigilancia Física.	icon-vigilancia-física	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
33527408-7c8b-4cf2-88a5-11da4e9eee57	Viveros Industriales	viveros-industriales	Servicios profesionales de PyME especializados en Viveros Industriales.	icon-viveros-industriales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b2df63f4-4807-4e75-9622-e4506ab5e1ce	Asesoría en Normas ISO	asesoría-en-normas-iso	Servicios profesionales de PyME especializados en Asesoría en Normas ISO.	icon-asesoría-en-normas-iso	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2b2bc205-d9b6-4842-9c0f-bf4a096b4450	Certificación de Calidad	certificación-de-calidad	Servicios profesionales de PyME especializados en Certificación de Calidad.	icon-certificación-de-calidad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3d91b8d7-e6c2-4c64-ad01-fc4b4415c2c8	Consultoría en Sustentabilidad	consultoría-en-sustentabilidad	Servicios profesionales de PyME especializados en Consultoría en Sustentabilidad.	icon-consultoría-en-sustentabilidad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
12e45fc9-7ca8-41fa-ad30-24e3436b2784	Gestión de Crisis	gestión-de-crisis	Servicios profesionales de PyME especializados en Gestión de Crisis.	icon-gestión-de-crisis	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c23db11b-97fa-4459-8fa9-27450819e8ca	Desarrollo de Franquicias	desarrollo-de-franquicias	Servicios profesionales de PyME especializados en Desarrollo de Franquicias.	icon-desarrollo-de-franquicias	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b3f15098-2f46-4768-931f-6ce6b74ee829	Marketing para E-commerce	marketing-para-e-commerce	Servicios profesionales de PyME especializados en Marketing para E-commerce.	icon-marketing-para-e-commerce	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
967d3d17-55ff-4210-8848-b907004e1bbb	Desarrollo de Videojuegos	desarrollo-de-videojuegos	Servicios profesionales de PyME especializados en Desarrollo de Videojuegos.	icon-desarrollo-de-videojuegos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
dcf149f2-28d0-411b-bcde-d58c40ab187e	Inteligencia Geográfica	inteligencia-geográfica	Servicios profesionales de PyME especializados en Inteligencia Geográfica.	icon-inteligencia-geográfica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
eef8409a-061c-4da9-a316-f43190f05167	Gestión de Flotas	gestión-de-flotas	Servicios profesionales de PyME especializados en Gestión de Flotas.	icon-gestión-de-flotas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
22d1364c-44e2-4236-a92f-597263279ee0	Ingeniería Acústica	ingeniería-acústica	Servicios profesionales de PyME especializados en Ingeniería Acústica.	icon-ingeniería-acústica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4e242b3b-6b5f-42b1-8e23-e55a3e55d7e1	Diseño de Experiencia de Usuario	diseño-de-experiencia-de-usuario	Servicios profesionales de PyME especializados en Diseño de Experiencia de Usuario.	icon-diseño-de-experiencia-de-usuario	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d09509d8-730c-40b4-8096-64c6663d8f4f	Ciberseguridad Forense	ciberseguridad-forense	Servicios profesionales de PyME especializados en Ciberseguridad Forense.	icon-ciberseguridad-forense	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f46890a7-6704-448e-82b1-96182814bea2	Blockchain para Empresas	blockchain-para-empresas	Servicios profesionales de PyME especializados en Blockchain para Empresas.	icon-blockchain-para-empresas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a7659872-013b-4003-b411-e43081fee7bc	Realidad Virtual Industrial	realidad-virtual-industrial	Servicios profesionales de PyME especializados en Realidad Virtual Industrial.	icon-realidad-virtual-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
79731b50-f31c-4fd7-abc0-8e8df48aaa92	Realidad Aumentada	realidad-aumentada	Servicios profesionales de PyME especializados en Realidad Aumentada.	icon-realidad-aumentada	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2eb2979e-260e-49e5-b9f0-479ee7d8f6a5	Internet de las Cosas	internet-de-las-cosas	Servicios profesionales de PyME especializados en Internet de las Cosas.	icon-internet-de-las-cosas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0ecb86df-cabe-4c23-b30d-22826956d78a	Gestión de Proyectos ágiles	gestión-de-proyectos-ágiles	Servicios profesionales de PyME especializados en Gestión de Proyectos ágiles.	icon-gestión-de-proyectos-ágiles	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9f05b615-51e7-455e-9171-ae9ab723d2e7	Coaching Ejecutivo	coaching-ejecutivo	Servicios profesionales de PyME especializados en Coaching Ejecutivo.	icon-coaching-ejecutivo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
52def771-4d63-42b2-b98d-019999df7fb9	Mentoria de Negocios	mentoria-de-negocios	Servicios profesionales de PyME especializados en Mentoria de Negocios.	icon-mentoria-de-negocios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
36fe869d-5894-4d8d-a510-9321490d4e31	Asesoría de Comercio Electrónico	asesoría-de-comercio-electrónico	Servicios profesionales de PyME especializados en Asesoría de Comercio Electrónico.	icon-asesoría-de-comercio-electrónico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1065ecb1-3a89-49a2-ac10-f5ed965bef6a	Servicios de Drones	servicios-de-drones	Servicios profesionales de PyME especializados en Servicios de Drones.	icon-servicios-de-drones	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d446a3f2-4fe3-4f7a-a002-df06fc36b0fd	Mapeo Satelital	mapeo-satelital	Servicios profesionales de PyME especializados en Mapeo Satelital.	icon-mapeo-satelital	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
de283546-df12-43a6-ac8b-7aa98bac19f5	Análisis de Riesgo Crediticio	análisis-de-riesgo-crediticio	Servicios profesionales de PyME especializados en Análisis de Riesgo Crediticio.	icon-análisis-de-riesgo-crediticio	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
74c87d9a-352b-48b8-9622-f351216867de	Consultoría de Ventas	consultoría-de-ventas	Servicios profesionales de PyME especializados en Consultoría de Ventas.	icon-consultoría-de-ventas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9e9ce7d9-d33d-48c3-9440-d8bb7a7bc03b	Automatización de Marketing	automatización-de-marketing	Servicios profesionales de PyME especializados en Automatización de Marketing.	icon-automatización-de-marketing	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b4e1f925-5306-4446-87af-aa1fb49cb757	Gestión de Reputación Online	gestión-de-reputación-online	Servicios profesionales de PyME especializados en Gestión de Reputación Online.	icon-gestión-de-reputación-online	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
82d39d8c-c6c2-41fe-9239-7cb96d324491	Servicios de Firma Digital	servicios-de-firma-digital	Servicios profesionales de PyME especializados en Servicios de Firma Digital.	icon-servicios-de-firma-digital	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ffa3809e-3e53-4ba3-979b-780760f4b65c	Custodia de Documentos	custodia-de-documentos	Servicios profesionales de PyME especializados en Custodia de Documentos.	icon-custodia-de-documentos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
fe688f8d-46c9-4aa5-96d6-c31e8f89df5e	Escaneo de Planos	escaneo-de-planos	Servicios profesionales de PyME especializados en Escaneo de Planos.	icon-escaneo-de-planos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
814cd84e-3810-4185-99f0-7735244c4312	Destrucción de Información	destrucción-de-información	Servicios profesionales de PyME especializados en Destrucción de Información.	icon-destrucción-de-información	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3fdb6984-68c5-4ad8-bdf2-260d41c7cced	Mobiliario para Oficinas	mobiliario-para-oficinas	Servicios profesionales de PyME especializados en Mobiliario para Oficinas.	icon-mobiliario-para-oficinas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4439a8b4-6031-483e-a8c8-4f12130e1bfb	Equipamiento Gastronómico	equipamiento-gastronómico	Servicios profesionales de PyME especializados en Equipamiento Gastronómico.	icon-equipamiento-gastronómico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
40d2fbb0-29dd-4270-9da2-0b8278952006	Suministros Hosteleros	suministros-hosteleros	Servicios profesionales de PyME especializados en Suministros Hosteleros.	icon-suministros-hosteleros	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
fbf2113c-a4c4-46c0-8ea6-29c91d2f9feb	Tratamiento de Suelos	tratamiento-de-suelos	Servicios profesionales de PyME especializados en Tratamiento de Suelos.	icon-tratamiento-de-suelos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8ebc0633-3342-432d-880e-1169ab3c5b91	Impermeabilización	impermeabilización	Servicios profesionales de PyME especializados en Impermeabilización.	icon-impermeabilización	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3503065e-0953-4612-837c-6e1c632e08ab	Construcción en Seco	construcción-en-seco	Servicios profesionales de PyME especializados en Construcción en Seco.	icon-construcción-en-seco	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
024095e5-ba71-4835-b14d-4511e219ca08	Pisos Industriales	pisos-industriales	Servicios profesionales de PyME especializados en Pisos Industriales.	icon-pisos-industriales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c3efe0ac-6e6d-4639-814b-9694dc41c12e	Estructuras Metálicas	estructuras-metálicas	Servicios profesionales de PyME especializados en Estructuras Metálicas.	icon-estructuras-metálicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5da8c01c-8903-4310-8809-2cfd0a824127	Cercos Eléctricos	cercos-eléctricos	Servicios profesionales de PyME especializados en Cercos Eléctricos.	icon-cercos-eléctricos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
95194e7b-404d-48f5-ab36-43062dc30e08	Control de Accesos Biométrico	control-de-accesos-biométrico	Servicios profesionales de PyME especializados en Control de Accesos Biométrico.	icon-control-de-accesos-biométrico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ffb5aebd-6119-4e08-82d5-9e1e9b02581a	Detección de Incendios	detección-de-incendios	Servicios profesionales de PyME especializados en Detección de Incendios.	icon-detección-de-incendios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0e7ee346-3b2f-4d32-b950-b3f7ff97dd6b	Mantenimiento de Piscinas	mantenimiento-de-piscinas	Servicios profesionales de PyME especializados en Mantenimiento de Piscinas.	icon-mantenimiento-de-piscinas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
890b7100-70e7-408f-b389-d61d311c44a1	Paisajismo Urbano	paisajismo-urbano	Servicios profesionales de PyME especializados en Paisajismo Urbano.	icon-paisajismo-urbano	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
80092c57-7c27-4995-a9b9-e35fefb9ff5e	Riego Automatizado	riego-automatizado	Servicios profesionales de PyME especializados en Riego Automatizado.	icon-riego-automatizado	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
127d69ac-c82b-4dfa-b85a-07dc34017dd8	Venta de Agroquímicos	venta-de-agroquímicos	Servicios profesionales de PyME especializados en Venta de Agroquímicos.	icon-venta-de-agroquímicos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c9a7be17-a240-4209-bbfa-be3b60240dcd	Servicios de Siembra	servicios-de-siembra	Servicios profesionales de PyME especializados en Servicios de Siembra.	icon-servicios-de-siembra	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
65a69705-d6d9-41fc-9735-9f3c0fb3cd40	Cosecha de Cereales	cosecha-de-cereales	Servicios profesionales de PyME especializados en Cosecha de Cereales.	icon-cosecha-de-cereales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
73f3e31d-51dc-4083-9423-c265851e32cf	Fumigación Aérea	fumigación-aérea	Servicios profesionales de PyME especializados en Fumigación Aérea.	icon-fumigación-aérea	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
75ba133a-f56a-44b5-9d0b-76c1897ddc43	Inseminación Artificial	inseminación-artificial	Servicios profesionales de PyME especializados en Inseminación Artificial.	icon-inseminación-artificial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7d2f09ca-2766-4f3b-b1e8-c62697d5d5ea	Genética Bovina	genética-bovina	Servicios profesionales de PyME especializados en Genética Bovina.	icon-genética-bovina	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d57ccd7a-d95d-4006-b1c1-6ac7e2b713a7	Alimentos para Mascotas	alimentos-para-mascotas	Servicios profesionales de PyME especializados en Alimentos para Mascotas.	icon-alimentos-para-mascotas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
96e49413-05b9-43d4-809c-25176264c8de	Acuicultura	acuicultura	Servicios profesionales de PyME especializados en Acuicultura.	icon-acuicultura	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6843c14f-0ac4-498e-8eda-f48f6a8ff130	Apicultura Profesional	apicultura-profesional	Servicios profesionales de PyME especializados en Apicultura Profesional.	icon-apicultura-profesional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8d4b1c05-6afb-46f8-9f90-b800952b148c	Producción de Aceites	producción-de-aceites	Servicios profesionales de PyME especializados en Producción de Aceites.	icon-producción-de-aceites	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
964a5a72-3888-4eeb-b38c-06960bfafeb7	Bodegas y Viñedos	bodegas-y-viñedos	Servicios profesionales de PyME especializados en Bodegas y Viñedos.	icon-bodegas-y-viñedos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b233b5ce-42c1-4918-affa-80bc525b2561	Destilerías Artesanales	destilerías-artesanales	Servicios profesionales de PyME especializados en Destilerías Artesanales.	icon-destilerías-artesanales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
deeba169-33e2-48db-bfeb-7d8250c0a8ce	Cervecería Artesanal	cervecería-artesanal	Servicios profesionales de PyME especializados en Cervecería Artesanal.	icon-cervecería-artesanal	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
79d39152-72a3-47ca-996d-d89450b83c1b	Embutidos Gourmet	embutidos-gourmet	Servicios profesionales de PyME especializados en Embutidos Gourmet.	icon-embutidos-gourmet	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c90ee80e-b97b-4749-adae-faa4abb0d671	Queserías Especializadas	queserías-especializadas	Servicios profesionales de PyME especializados en Queserías Especializadas.	icon-queserías-especializadas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
072be366-5523-4787-b65a-f7c3bcfc3555	Conservas Vegetales	conservas-vegetales	Servicios profesionales de PyME especializados en Conservas Vegetales.	icon-conservas-vegetales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1dca04ff-b1ea-419f-8b43-30cefd16b49b	Frutos Secos al Por Mayor	frutos-secos-al-por-mayor	Servicios profesionales de PyME especializados en Frutos Secos al Por Mayor.	icon-frutos-secos-al-por-mayor	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f6cba35b-a2c4-44a7-827c-90b7c65e4c2d	Congelados Mayoristas	congelados-mayoristas	Servicios profesionales de PyME especializados en Congelados Mayoristas.	icon-congelados-mayoristas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
474b4128-7ebe-47bc-9893-59df573aa683	Distribución de Lácteos	distribución-de-lácteos	Servicios profesionales de PyME especializados en Distribución de Lácteos.	icon-distribución-de-lácteos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ae841344-fc21-4542-a576-6b765e3832fc	Panadería Artesanal	panadería-artesanal	Servicios profesionales de PyME especializados en Panadería Artesanal.	icon-panadería-artesanal	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
28cdc7c3-2998-487a-9a70-8ec092474b2c	Pastelería Fina	pastelería-fina	Servicios profesionales de PyME especializados en Pastelería Fina.	icon-pastelería-fina	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ed7f00d2-ec67-4e15-b8dd-e4255daede36	Heladerías Mayoristas	heladerías-mayoristas	Servicios profesionales de PyME especializados en Heladerías Mayoristas.	icon-heladerías-mayoristas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
776709ce-4bbd-4bc7-8121-45059a0a5880	Chocolatería de Autor	chocolatería-de-autor	Servicios profesionales de PyME especializados en Chocolatería de Autor.	icon-chocolatería-de-autor	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
aab008b8-2d2c-4b94-ba1b-9ffd6dd2593c	Tostaderos de Café	tostaderos-de-café	Servicios profesionales de PyME especializados en Tostaderos de Café.	icon-tostaderos-de-café	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b01013f1-8ae3-4831-a3db-0d795fdf880e	Importación de Té	importación-de-té	Servicios profesionales de PyME especializados en Importación de Té.	icon-importación-de-té	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1d76fd1b-f408-46b8-a7ff-3c91fbee919c	Venta de Especias	venta-de-especias	Servicios profesionales de PyME especializados en Venta de Especias.	icon-venta-de-especias	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ef425677-63ef-42df-b17e-e9172f905b30	Diseño de Indumentaria	diseño-de-indumentaria	Servicios profesionales de PyME especializados en Diseño de Indumentaria.	icon-diseño-de-indumentaria	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
aaae68d1-1b15-4703-92c1-fbd0fbcc199c	Confección de Uniformes	confección-de-uniformes	Servicios profesionales de PyME especializados en Confección de Uniformes.	icon-confección-de-uniformes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
cff91c45-1300-4131-ab5c-37b6a9e5b200	Bordados Industriales	bordados-industriales	Servicios profesionales de PyME especializados en Bordados Industriales.	icon-bordados-industriales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0ed2492c-3f80-4e68-8a99-c4737db97ce3	Serigrafía y Estampado	serigrafía-y-estampado	Servicios profesionales de PyME especializados en Serigrafía y Estampado.	icon-serigrafía-y-estampado	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0cd453ef-9c88-4036-954f-421b3669f39a	Tejidos de Punto	tejidos-de-punto	Servicios profesionales de PyME especializados en Tejidos de Punto.	icon-tejidos-de-punto	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b849d8b4-1552-4c83-a37a-7d612a505170	Marroquinería	marroquinería	Servicios profesionales de PyME especializados en Marroquinería.	icon-marroquinería	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ae7f9dac-af20-42e8-8c51-6e7913c433a6	Calzado de Seguridad	calzado-de-seguridad	Servicios profesionales de PyME especializados en Calzado de Seguridad.	icon-calzado-de-seguridad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ee11118f-df87-40d3-b506-5c2248b71e4b	Ropa de Trabajo	ropa-de-trabajo	Servicios profesionales de PyME especializados en Ropa de Trabajo.	icon-ropa-de-trabajo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
465182d4-cd2f-4639-8ff7-a54727dbd43d	Telas por Mayor	telas-por-mayor	Servicios profesionales de PyME especializados en Telas por Mayor.	icon-telas-por-mayor	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
03a86f92-3f4b-4615-960f-42c422c1efbb	Insumos Textiles	insumos-textiles	Servicios profesionales de PyME especializados en Insumos Textiles.	icon-insumos-textiles	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
21995730-9c25-4bfe-87c4-46a58f25d9d2	Carpintería de Obra	carpintería-de-obra	Servicios profesionales de PyME especializados en Carpintería de Obra.	icon-carpintería-de-obra	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
91265209-6ee9-4a6f-bcd3-eb76f56c41a5	Muebles de Cocina	muebles-de-cocina	Servicios profesionales de PyME especializados en Muebles de Cocina.	icon-muebles-de-cocina	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f796f692-8f74-4702-99e0-e618faa5e64d	Vestidores y Placards	vestidores-y-placards	Servicios profesionales de PyME especializados en Vestidores y Placards.	icon-vestidores-y-placards	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6625a829-3327-4ac2-ae86-a80f7b1e58ae	Aberturas de PVC	aberturas-de-pvc	Servicios profesionales de PyME especializados en Aberturas de PVC.	icon-aberturas-de-pvc	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c7eaeded-75ec-494f-8880-f7faa4633c76	Vidrios Templados	vidrios-templados	Servicios profesionales de PyME especializados en Vidrios Templados.	icon-vidrios-templados	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c205f6bd-f3af-4bec-9543-592714b2e86a	Mármoles y Granitos	mármoles-y-granitos	Servicios profesionales de PyME especializados en Mármoles y Granitos.	icon-mármoles-y-granitos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a7090be1-233e-4d57-9c67-3473357313a3	Griferías Especiales	griferías-especiales	Servicios profesionales de PyME especializados en Griferías Especiales.	icon-griferías-especiales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
21d0659f-d41e-4737-9b7e-eb7f071b8dec	Sanitarios Mayorista	sanitarios-mayorista	Servicios profesionales de PyME especializados en Sanitarios Mayorista.	icon-sanitarios-mayorista	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
21ea9cef-63d2-4a59-8a31-04bffc0c2aca	Iluminación LED	iluminación-led	Servicios profesionales de PyME especializados en Iluminación LED.	icon-iluminación-led	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d51ff4ba-499d-4f0e-842f-fa19747fa120	Electricidad del Automotor	electricidad-del-automotor	Servicios profesionales de PyME especializados en Electricidad del Automotor.	icon-electricidad-del-automotor	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f5db3add-ed3f-40e1-8079-381c8b916b0d	Baterías para Vehículos	baterías-para-vehículos	Servicios profesionales de PyME especializados en Baterías para Vehículos.	icon-baterías-para-vehículos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9c354cf5-89b9-4332-99de-5b2fa2aedfb3	Lubricentros	lubricentros	Servicios profesionales de PyME especializados en Lubricentros.	icon-lubricentros	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b6380e60-30ab-46e2-96e2-96cae1e57b65	Alineación y Balanceo	alineación-y-balanceo	Servicios profesionales de PyME especializados en Alineación y Balanceo.	icon-alineación-y-balanceo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
76c72770-b9f0-4f5d-a685-77e2031bd643	Chapa y Pintura Express	chapa-y-pintura-express	Servicios profesionales de PyME especializados en Chapa y Pintura Express.	icon-chapa-y-pintura-express	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7a0b0770-466d-48b3-b1c1-4427e091df6d	Tapicería del Automotor	tapicería-del-automotor	Servicios profesionales de PyME especializados en Tapicería del Automotor.	icon-tapicería-del-automotor	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7d2a90a6-c365-44f5-9c0c-c598c195b847	Audio y Alarmas Car	audio-y-alarmas-car	Servicios profesionales de PyME especializados en Audio y Alarmas Car.	icon-audio-y-alarmas-car	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c4ff4a51-41dd-4f39-a6b7-53618d4c6dc1	Alquiler de Autos	alquiler-de-autos	Servicios profesionales de PyME especializados en Alquiler de Autos.	icon-alquiler-de-autos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
00ac756f-88df-4715-ac2f-5ca2396ff267	Transporte de Maquinaria	transporte-de-maquinaria	Servicios profesionales de PyME especializados en Transporte de Maquinaria.	icon-transporte-de-maquinaria	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
42bb76ed-52f8-4ae8-bf4e-156b34449741	Logística de Eventos	logística-de-eventos	Servicios profesionales de PyME especializados en Logística de Eventos.	icon-logística-de-eventos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b1ac051c-b679-499a-ac87-fb37fac9381a	Mudanzas de Oficinas	mudanzas-de-oficinas	Servicios profesionales de PyME especializados en Mudanzas de Oficinas.	icon-mudanzas-de-oficinas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
baa17e88-dca1-4123-ab10-19a37b3abcff	Embalajes de Exportación	embalajes-de-exportación	Servicios profesionales de PyME especializados en Embalajes de Exportación.	icon-embalajes-de-exportación	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
315d2e95-a73b-47da-a184-8d43cd6f9c5e	Alquiler de Contenedores	alquiler-de-contenedores	Servicios profesionales de PyME especializados en Alquiler de Contenedores.	icon-alquiler-de-contenedores	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c866f6fc-281b-42ff-b078-6cdaf379d207	Depósitos Fiscales	depósitos-fiscales	Servicios profesionales de PyME especializados en Depósitos Fiscales.	icon-depósitos-fiscales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5db27770-39d7-42fc-9ce7-f6adc2dfc9e0	Fraccionamiento de Mercancía	fraccionamiento-de-mercancía	Servicios profesionales de PyME especializados en Fraccionamiento de Mercancía.	icon-fraccionamiento-de-mercancía	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c8cfe237-cbf1-4419-b3ab-610ef0fa6d24	Etiquetado Industrial	etiquetado-industrial	Servicios profesionales de PyME especializados en Etiquetado Industrial.	icon-etiquetado-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
41128b21-9d59-433e-a66b-96e6d209588b	Gestión de Inventarios	gestión-de-inventarios	Servicios profesionales de PyME especializados en Gestión de Inventarios.	icon-gestión-de-inventarios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d65f2e17-9051-4002-b701-cda5f7df6d62	Auditoría de Stock	auditoría-de-stock	Servicios profesionales de PyME especializados en Auditoría de Stock.	icon-auditoría-de-stock	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
81326376-694c-4ac1-8eab-955e56009690	Software de Logística	software-de-logística	Servicios profesionales de PyME especializados en Software de Logística.	icon-software-de-logística	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ed2fd39a-f6e6-4326-9840-0428a5ccbb8c	GPS para Flotas	gps-para-flotas	Servicios profesionales de PyME especializados en GPS para Flotas.	icon-gps-para-flotas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f4f42b05-4521-45db-88c2-9164199509ac	Telemetría	telemetría	Servicios profesionales de PyME especializados en Telemetría.	icon-telemetría	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a6d46bdf-0e0c-4d47-bde0-b677e02d972b	Asesoría en Energía	asesoría-en-energía	Servicios profesionales de PyME especializados en Asesoría en Energía.	icon-asesoría-en-energía	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7c81a916-d012-4bef-9f23-aa9389d2927b	Medición de Huella de Carbono	medición-de-huella-de-carbono	Servicios profesionales de PyME especializados en Medición de Huella de Carbono.	icon-medición-de-huella-de-carbono	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
49f4e53d-a905-43ff-a1f4-cf217a7f656b	Reciclaje de RAEE	reciclaje-de-raee	Servicios profesionales de PyME especializados en Reciclaje de RAEE.	icon-reciclaje-de-raee	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8ee8e73b-04a6-4ba3-9860-d897bbf637fa	Gestión de Pilas y Baterías	gestión-de-pilas-y-baterías	Servicios profesionales de PyME especializados en Gestión de Pilas y Baterías.	icon-gestión-de-pilas-y-baterías	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
a9e7ba86-7dfa-4348-baae-d203cffce0f3	Aceites Usados	aceites-usados	Servicios profesionales de PyME especializados en Aceites Usados.	icon-aceites-usados	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f8146c61-6152-4f0a-bd07-db0c9bafcc2e	Insumos de Seguridad	insumos-de-seguridad	Servicios profesionales de PyME especializados en Insumos de Seguridad.	icon-insumos-de-seguridad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
82e62503-70e2-4af0-b286-d003b366120c	Ropa Ignífuga	ropa-ignífuga	Servicios profesionales de PyME especializados en Ropa Ignífuga.	icon-ropa-ignífuga	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
fc491b5f-e78e-42ac-bdea-62b41719ee59	Guantes Industriales	guantes-industriales	Servicios profesionales de PyME especializados en Guantes Industriales.	icon-guantes-industriales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
79a47a86-08fb-420c-8f28-8ece1639b561	Protección Auditiva	protección-auditiva	Servicios profesionales de PyME especializados en Protección Auditiva.	icon-protección-auditiva	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6eeac049-2813-44f0-9dce-3edbae3fb3ab	Calzado Dieléctrico	calzado-dieléctrico	Servicios profesionales de PyME especializados en Calzado Dieléctrico.	icon-calzado-dieléctrico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
db5453dd-5168-49ad-a393-984ffb9cdb70	Arneses y Seguridad Altura	arneses-y-seguridad-altura	Servicios profesionales de PyME especializados en Arneses y Seguridad Altura.	icon-arneses-y-seguridad-altura	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ef210898-9221-497d-a798-0709c1ed17ba	Extintores de Incendio	extintores-de-incendio	Servicios profesionales de PyME especializados en Extintores de Incendio.	icon-extintores-de-incendio	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0764ade3-dee7-4198-9c3d-f21987fa6d5f	Señalética Industrial	señalética-industrial	Servicios profesionales de PyME especializados en Señalética Industrial.	icon-señalética-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5d1c7c24-98fc-4777-b515-48f2ceef0877	Botiquines y Primeros Auxilios	botiquines-y-primeros-auxilios	Servicios profesionales de PyME especializados en Botiquines y Primeros Auxilios.	icon-botiquines-y-primeros-auxilios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ae714828-0e40-497b-b7b2-bc9d911c07e4	Capacitación RCP	capacitación-rcp	Servicios profesionales de PyME especializados en Capacitación RCP.	icon-capacitación-rcp	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b603a3ba-05f6-4b6b-af1d-1cf644e82012	Gestión de Emergencias	gestión-de-emergencias	Servicios profesionales de PyME especializados en Gestión de Emergencias.	icon-gestión-de-emergencias	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
431e6752-f0b2-4dab-b995-37757bebc75e	Planes de Evacuación	planes-de-evacuación	Servicios profesionales de PyME especializados en Planes de Evacuación.	icon-planes-de-evacuación	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1a8041a1-09f4-497f-ac04-b4f30b9cf24b	Estudios de Impacto Ambiental	estudios-de-impacto-ambiental	Servicios profesionales de PyME especializados en Estudios de Impacto Ambiental.	icon-estudios-de-impacto-ambiental	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4e337a88-d767-4d8a-b197-b1f5f99b6b4b	Monitoreo de Aire	monitoreo-de-aire	Servicios profesionales de PyME especializados en Monitoreo de Aire.	icon-monitoreo-de-aire	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
bdeb2f74-f477-4d36-9394-65fff254a46c	Análisis de Agua	análisis-de-agua	Servicios profesionales de PyME especializados en Análisis de Agua.	icon-análisis-de-agua	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
729c265f-56ad-4f13-9fa9-f0b53c044442	Limpieza de Tanques	limpieza-de-tanques	Servicios profesionales de PyME especializados en Limpieza de Tanques.	icon-limpieza-de-tanques	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5570a79d-85b2-40da-92d9-abf5b7028bb4	Tratamiento de Madera	tratamiento-de-madera	Servicios profesionales de PyME especializados en Tratamiento de Madera.	icon-tratamiento-de-madera	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
fa1aa2b1-a031-4722-81d3-3e1bc681ef04	Control de Termitas	control-de-termitas	Servicios profesionales de PyME especializados en Control de Termitas.	icon-control-de-termitas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
70a36198-5642-424a-9522-612c60b7d919	Impermeabilización de Terrazas	impermeabilización-de-terrazas	Servicios profesionales de PyME especializados en Impermeabilización de Terrazas.	icon-impermeabilización-de-terrazas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
11b99762-8a96-4326-88f6-20a1eeac226c	Refacciones en General	refacciones-en-general	Servicios profesionales de PyME especializados en Refacciones en General.	icon-refacciones-en-general	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7fcc3715-962b-49ce-b18b-d130199dd7de	Mantenimiento de Jardines	mantenimiento-de-jardines	Servicios profesionales de PyME especializados en Mantenimiento de Jardines.	icon-mantenimiento-de-jardines	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ed51a9c3-3c94-4675-9613-cf71276a17a4	Poda en Altura	poda-en-altura	Servicios profesionales de PyME especializados en Poda en Altura.	icon-poda-en-altura	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b979b8ee-3092-4585-908d-811cd42b8829	Diseño de Huertas	diseño-de-huertas	Servicios profesionales de PyME especializados en Diseño de Huertas.	icon-diseño-de-huertas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
bdb0adce-0b60-4663-ab6b-479b0ce7939b	Huertas Hidropónicas	huertas-hidropónicas	Servicios profesionales de PyME especializados en Huertas Hidropónicas.	icon-huertas-hidropónicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1ab29834-961e-4ce6-9d28-3453482e905a	Venta de Plantas	venta-de-plantas	Servicios profesionales de PyME especializados en Venta de Plantas.	icon-venta-de-plantas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
05c8c14c-6d01-4653-8c03-285c5e6d8983	Insumos de Riego	insumos-de-riego	Servicios profesionales de PyME especializados en Insumos de Riego.	icon-insumos-de-riego	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
455e6bd4-2843-44b7-9b76-27ef4bceb0a1	Muebles de Jardín	muebles-de-jardín	Servicios profesionales de PyME especializados en Muebles de Jardín.	icon-muebles-de-jardín	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9d43f2da-f61d-4752-9fd0-cc5242884ca9	Piscina y Spa	piscina-y-spa	Servicios profesionales de PyME especializados en Piscina y Spa.	icon-piscina-y-spa	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1746f64c-9260-4026-a23c-66a964cdb40a	Saunas y Jacuzzis	saunas-y-jacuzzis	Servicios profesionales de PyME especializados en Saunas y Jacuzzis.	icon-saunas-y-jacuzzis	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
35565171-3aeb-468d-b2ae-46f2cc3e4d38	Tratamientos Térmicos	tratamientos-térmicos	Servicios profesionales de PyME especializados en Tratamientos Térmicos.	icon-tratamientos-térmicos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
14796319-00a4-4db0-862e-c6c1d6ece71e	Galvanoplastia	galvanoplastia	Servicios profesionales de PyME especializados en Galvanoplastia.	icon-galvanoplastia	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
836639b3-0f20-4e88-adf7-b3cca752223c	Pintura en Polvo	pintura-en-polvo	Servicios profesionales de PyME especializados en Pintura en Polvo.	icon-pintura-en-polvo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9e0764cf-b119-492d-9de0-28265c292554	Corte por Láser	corte-por-láser	Servicios profesionales de PyME especializados en Corte por Láser.	icon-corte-por-láser	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3ff0fef3-682f-4cbf-aad1-c383a415bdce	Corte por Plasma	corte-por-plasma	Servicios profesionales de PyME especializados en Corte por Plasma.	icon-corte-por-plasma	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ab60d2d3-ca3a-42b2-b82d-033872b81aeb	Corte por Chorro de Agua	corte-por-chorro-de-agua	Servicios profesionales de PyME especializados en Corte por Chorro de Agua.	icon-corte-por-chorro-de-agua	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d0f1345f-87b2-4669-8798-bd4e122df447	Plegado de Chapas	plegado-de-chapas	Servicios profesionales de PyME especializados en Plegado de Chapas.	icon-plegado-de-chapas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d4ee668c-0a99-40a3-967e-24c32289d747	Soldadura Especializada	soldadura-especializada	Servicios profesionales de PyME especializados en Soldadura Especializada.	icon-soldadura-especializada	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ea169f34-8bde-44cd-a1d6-9168a355816b	Mecanizado CNC	mecanizado-cnc	Servicios profesionales de PyME especializados en Mecanizado CNC.	icon-mecanizado-cnc	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
09b9e556-c739-489e-9438-d80f525ec79f	Rectificación de Motores	rectificación-de-motores	Servicios profesionales de PyME especializados en Rectificación de Motores.	icon-rectificación-de-motores	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3b46f433-4dfe-4ada-bf3a-77ba0e8168a3	Inyección de Plástico	inyección-de-plástico	Servicios profesionales de PyME especializados en Inyección de Plástico.	icon-inyección-de-plástico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d6e03eaf-9411-456f-a205-622d083b5c3f	Soplado de Botellas	soplado-de-botellas	Servicios profesionales de PyME especializados en Soplado de Botellas.	icon-soplado-de-botellas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
142450d7-f7c7-4f8f-b176-787ed2fa1919	Reciclaje de PET	reciclaje-de-pet	Servicios profesionales de PyME especializados en Reciclaje de PET.	icon-reciclaje-de-pet	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7bb3ff88-4b55-4d1d-bbbd-765121b032ee	Insumos Químicos	insumos-químicos	Servicios profesionales de PyME especializados en Insumos Químicos.	icon-insumos-químicos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
aa770092-6f5b-4e85-89e9-458a506e927d	Venta de Solventes	venta-de-solventes	Servicios profesionales de PyME especializados en Venta de Solventes.	icon-venta-de-solventes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
fd8fd9e9-b5e7-40e2-99f3-912ab044e852	Adhesivos Industriales	adhesivos-industriales	Servicios profesionales de PyME especializados en Adhesivos Industriales.	icon-adhesivos-industriales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d074e64e-cf38-4f22-968a-751c39f42479	Pinturas Arquitectónicas	pinturas-arquitectónicas	Servicios profesionales de PyME especializados en Pinturas Arquitectónicas.	icon-pinturas-arquitectónicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
801e525f-f826-43dc-99df-c08d68b18d06	Resinas Epóxicas	resinas-epóxicas	Servicios profesionales de PyME especializados en Resinas Epóxicas.	icon-resinas-epóxicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
34b216fc-f093-4a46-9e35-5de5f4cb0220	Fibras de Vidrio	fibras-de-vidrio	Servicios profesionales de PyME especializados en Fibras de Vidrio.	icon-fibras-de-vidrio	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f8a1f1c4-fb2f-4d8b-9708-4072140e58cf	Compuestos de Carbono	compuestos-de-carbono	Servicios profesionales de PyME especializados en Compuestos de Carbono.	icon-compuestos-de-carbono	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
146adaf8-b0b1-45fa-ae77-691b38d92017	Materiales Compuestos	materiales-compuestos	Servicios profesionales de PyME especializados en Materiales Compuestos.	icon-materiales-compuestos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
13b5c4c2-6cef-45c7-98b9-8ebdc043b9ec	Laboratorio de Calidad	laboratorio-de-calidad	Servicios profesionales de PyME especializados en Laboratorio de Calidad.	icon-laboratorio-de-calidad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
63b7692e-475a-4c29-a63b-de5d15abd88c	Ensayos No Destructivos	ensayos-no-destructivos	Servicios profesionales de PyME especializados en Ensayos No Destructivos.	icon-ensayos-no-destructivos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
37735056-f69c-4e7d-a58e-4bf3f1c0bc8d	Metrología Dimensional	metrología-dimensional	Servicios profesionales de PyME especializados en Metrología Dimensional.	icon-metrología-dimensional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8c94daf5-66d4-481e-84b0-4c5a2abbb6e2	Calibración de Instrumentos	calibración-de-instrumentos	Servicios profesionales de PyME especializados en Calibración de Instrumentos.	icon-calibración-de-instrumentos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9843838c-038b-4b51-8f33-5685090b3c66	Pesaje Industrial	pesaje-industrial	Servicios profesionales de PyME especializados en Pesaje Industrial.	icon-pesaje-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5b13ab8a-f6e6-4bc5-b64f-9cefa8a498a9	Básculas y Balanzas	básculas-y-balanzas	Servicios profesionales de PyME especializados en Básculas y Balanzas.	icon-básculas-y-balanzas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
e97ce283-fd8e-4fa9-8308-f6a53abbff8e	Etiquetadoras Automáticas	etiquetadoras-automáticas	Servicios profesionales de PyME especializados en Etiquetadoras Automáticas.	icon-etiquetadoras-automáticas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
dea8cdff-2195-4b10-8b40-5db4e1087b5a	Envolvedoras de Pallets	envolvedoras-de-pallets	Servicios profesionales de PyME especializados en Envolvedoras de Pallets.	icon-envolvedoras-de-pallets	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1b56ad5e-e546-402d-9f83-d8885990f03a	Cinturones Transportadores	cinturones-transportadores	Servicios profesionales de PyME especializados en Cinturones Transportadores.	icon-cinturones-transportadores	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0abf3933-0ac7-4314-a734-886cf042b65a	Elevadores de Carga	elevadores-de-carga	Servicios profesionales de PyME especializados en Elevadores de Carga.	icon-elevadores-de-carga	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c49a6169-a6a9-45c2-8f51-84b019fb5b2a	Puentes Grúa	puentes-grúa	Servicios profesionales de PyME especializados en Puentes Grúa.	icon-puentes-grúa	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
043a9679-d168-4f13-a376-4f8a4624c29c	Hidroelevadores	hidroelevadores	Servicios profesionales de PyME especializados en Hidroelevadores.	icon-hidroelevadores	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0845a44d-cbdb-4bc3-a5da-f4e8c6eb9cfe	Plataformas Tijera	plataformas-tijera	Servicios profesionales de PyME especializados en Plataformas Tijera.	icon-plataformas-tijera	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
edb38d38-1311-406d-9fa8-d9b437d27d7d	Generadores Eléctricos	generadores-eléctricos	Servicios profesionales de PyME especializados en Generadores Eléctricos.	icon-generadores-eléctricos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5720f67a-3cd7-4fdd-9542-90dfb6fb5c22	Compresores de Aire	compresores-de-aire	Servicios profesionales de PyME especializados en Compresores de Aire.	icon-compresores-de-aire	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
636d2e6d-2300-4266-840b-f9c6ad36bea9	Herramientas Neumáticas	herramientas-neumáticas	Servicios profesionales de PyME especializados en Herramientas Neumáticas.	icon-herramientas-neumáticas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6643d955-3804-4f20-b436-171014070427	Herramientas de Potencia	herramientas-de-potencia	Servicios profesionales de PyME especializados en Herramientas de Potencia.	icon-herramientas-de-potencia	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6fb12f17-f6da-4d54-818c-db00bb35f302	Soldadoras Inverter	soldadoras-inverter	Servicios profesionales de PyME especializados en Soldadoras Inverter.	icon-soldadoras-inverter	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2797f601-eea0-4586-b5c2-c02aa0d39af4	Bombas de Agua	bombas-de-agua	Servicios profesionales de PyME especializados en Bombas de Agua.	icon-bombas-de-agua	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f673ec2b-d5f9-40ad-b981-23932e308381	Válvulas Industriales	válvulas-industriales	Servicios profesionales de PyME especializados en Válvulas Industriales.	icon-válvulas-industriales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
71358c9e-8e0b-4082-92ed-5752da76d076	Tuberías Especiales	tuberías-especiales	Servicios profesionales de PyME especializados en Tuberías Especiales.	icon-tuberías-especiales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f3253f21-495a-41ac-9243-7cdf8f39dae8	Conexiones Hidráulicas	conexiones-hidráulicas	Servicios profesionales de PyME especializados en Conexiones Hidráulicas.	icon-conexiones-hidráulicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
09c7d3b0-ec0f-4aaa-817c-f72eb183bd4d	Mangueras de Alta Presión	mangueras-de-alta-presión	Servicios profesionales de PyME especializados en Mangueras de Alta Presión.	icon-mangueras-de-alta-presión	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7fd230d5-10fd-430c-aa13-c611da95e263	Sellos Mecánicos	sellos-mecánicos	Servicios profesionales de PyME especializados en Sellos Mecánicos.	icon-sellos-mecánicos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
875da46d-1de8-4e67-a34d-219f69b5520b	Rodamientos Especiales	rodamientos-especiales	Servicios profesionales de PyME especializados en Rodamientos Especiales.	icon-rodamientos-especiales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5f6c9162-1aee-4baf-a980-d42ccadf4c95	Transmisiones de Potencia	transmisiones-de-potencia	Servicios profesionales de PyME especializados en Transmisiones de Potencia.	icon-transmisiones-de-potencia	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4bc512e8-f2ce-48f2-ac3f-3a4e7df76926	Reductores de Velocidad	reductores-de-velocidad	Servicios profesionales de PyME especializados en Reductores de Velocidad.	icon-reductores-de-velocidad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
eeca37bc-0359-4f82-88f5-9326b19c0bd3	Variadores de Frecuencia	variadores-de-frecuencia	Servicios profesionales de PyME especializados en Variadores de Frecuencia.	icon-variadores-de-frecuencia	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d7277492-83a3-4203-a085-b29ca4ac7a6a	Tableros Eléctricos	tableros-eléctricos	Servicios profesionales de PyME especializados en Tableros Eléctricos.	icon-tableros-eléctricos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3d3e276d-60cf-407b-9716-033d95a43fb8	Celdas de Media Tensión	celdas-de-media-tensión	Servicios profesionales de PyME especializados en Celdas de Media Tensión.	icon-celdas-de-media-tensión	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
28265148-f455-4140-a741-95596d75d431	Transformadores	transformadores	Servicios profesionales de PyME especializados en Transformadores.	icon-transformadores	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
28fd6e74-ca3c-4b1b-8da2-28158fe61033	UPS y Estabilizadores	ups-y-estabilizadores	Servicios profesionales de PyME especializados en UPS y Estabilizadores.	icon-ups-y-estabilizadores	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
cdac5414-7d82-4a7a-ac15-35536c8c6fbf	Bancos de Capacitores	bancos-de-capacitores	Servicios profesionales de PyME especializados en Bancos de Capacitores.	icon-bancos-de-capacitores	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ab1e574b-bc2f-4cb2-9888-df3f6ef52c38	Corrección de Factor de Potencia	corrección-de-factor-de-potencia	Servicios profesionales de PyME especializados en Corrección de Factor de Potencia.	icon-corrección-de-factor-de-potencia	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
fc0f3e2a-2b04-4ad9-993e-11e05cb7af6e	Análisis de Redes	análisis-de-redes	Servicios profesionales de PyME especializados en Análisis de Redes.	icon-análisis-de-redes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
734bdf90-45ab-46b5-bfa6-ea34e76851af	Termografía Infrarroja	termografía-infrarroja	Servicios profesionales de PyME especializados en Termografía Infrarroja.	icon-termografía-infrarroja	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
eb4c797c-7b9c-4788-afed-e2a7411d2bac	Ultrasonido Industrial	ultrasonido-industrial	Servicios profesionales de PyME especializados en Ultrasonido Industrial.	icon-ultrasonido-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7020fb42-39c5-4506-9b76-88a4d87a55e5	Mantenimiento Predictivo	mantenimiento-predictivo	Servicios profesionales de PyME especializados en Mantenimiento Predictivo.	icon-mantenimiento-predictivo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0b840b32-6e2f-4fff-9b18-a375d23ca41d	Análisis de Vibraciones	análisis-de-vibraciones	Servicios profesionales de PyME especializados en Análisis de Vibraciones.	icon-análisis-de-vibraciones	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
684ba7df-8e81-4ca2-aeb9-eb896b873e9c	Alineación Láser	alineación-láser	Servicios profesionales de PyME especializados en Alineación Láser.	icon-alineación-láser	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
5698c055-49d3-4af7-a4bd-2c3a1abff08e	Balanceo Dinámico	balanceo-dinámico	Servicios profesionales de PyME especializados en Balanceo Dinámico.	icon-balanceo-dinámico	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
525fca17-5368-439e-ad29-9d840c68014b	Servicios de Lubricación	servicios-de-lubricación	Servicios profesionales de PyME especializados en Servicios de Lubricación.	icon-servicios-de-lubricación	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7f948a9c-88af-4faf-961a-e27fbed89f77	Gestión de Mantenimiento	gestión-de-mantenimiento	Servicios profesionales de PyME especializados en Gestión de Mantenimiento.	icon-gestión-de-mantenimiento	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2629bf9e-ca13-4d2d-9ac8-d35c0048063f	Software de Activos	software-de-activos	Servicios profesionales de PyME especializados en Software de Activos.	icon-software-de-activos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
49d116bf-d384-41e4-85c4-dc1ed9a3d022	Consultoría de Confiabilidad	consultoría-de-confiabilidad	Servicios profesionales de PyME especializados en Consultoría de Confiabilidad.	icon-consultoría-de-confiabilidad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
11151da9-52c8-4448-a228-380a4e7f68e8	Capacitación Técnica	capacitación-técnica	Servicios profesionales de PyME especializados en Capacitación Técnica.	icon-capacitación-técnica	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2947cf44-cd0a-4688-b547-cf4f0632c29c	Formación de Operarios	formación-de-operarios	Servicios profesionales de PyME especializados en Formación de Operarios.	icon-formación-de-operarios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
414bcc85-da35-4ec9-87e2-934ee4e0851a	Escuelas de Negocios	escuelas-de-negocios	Servicios profesionales de PyME especializados en Escuelas de Negocios.	icon-escuelas-de-negocios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0511c407-dfa9-4975-90a0-664908685d49	Entrenamiento de Ventas	entrenamiento-de-ventas	Servicios profesionales de PyME especializados en Entrenamiento de Ventas.	icon-entrenamiento-de-ventas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
87d31752-0657-49e8-a8d8-6a9d0098ab70	Team Building	team-building	Servicios profesionales de PyME especializados en Team Building.	icon-team-building	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
483c0677-ed0c-48d8-bdb1-042342bf6b87	Gestión de Talento	gestión-de-talento	Servicios profesionales de PyME especializados en Gestión de Talento.	icon-gestión-de-talento	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0bc786f2-78d7-4542-8b5a-c8ae2af4b05a	Headhunting	headhunting	Servicios profesionales de PyME especializados en Headhunting.	icon-headhunting	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6996c9fc-6503-4399-a774-7511775c927f	Evaluaciones Psicotécnicas	evaluaciones-psicotécnicas	Servicios profesionales de PyME especializados en Evaluaciones Psicotécnicas.	icon-evaluaciones-psicotécnicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8ec18995-58a1-464d-a593-85a9465a1480	Clima Organizacional	clima-organizacional	Servicios profesionales de PyME especializados en Clima Organizacional.	icon-clima-organizacional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b0aef9f8-6b72-4f2e-9c01-6dd2abf59889	Cultura Corporativa	cultura-corporativa	Servicios profesionales de PyME especializados en Cultura Corporativa.	icon-cultura-corporativa	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
de7ac765-23d4-4549-8ee8-6c5f34e10d09	Comunicación Interna	comunicación-interna	Servicios profesionales de PyME especializados en Comunicación Interna.	icon-comunicación-interna	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
35b6a7c0-2bd1-4325-925a-ca0fc46ac088	Relaciones Laborales	relaciones-laborales	Servicios profesionales de PyME especializados en Relaciones Laborales.	icon-relaciones-laborales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6bbaae6b-87c4-4b9c-bdbe-3833a5e126ad	Prevención de Conflictos	prevención-de-conflictos	Servicios profesionales de PyME especializados en Prevención de Conflictos.	icon-prevención-de-conflictos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d6067f02-b2a9-495d-9856-a2affd24854f	Mediación Empresarial	mediación-empresarial	Servicios profesionales de PyME especializados en Mediación Empresarial.	icon-mediación-empresarial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
85d0b2e9-9fcb-4668-9bfa-452bdf93e2db	Derecho Societario	derecho-societario	Servicios profesionales de PyME especializados en Derecho Societario.	icon-derecho-societario	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9723b2ef-6484-480a-bddb-b6509989d7ed	Derecho Tributario	derecho-tributario	Servicios profesionales de PyME especializados en Derecho Tributario.	icon-derecho-tributario	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b4358a67-0bd6-41da-b9b4-4fa28e9cc82d	Propiedad Industrial	propiedad-industrial	Servicios profesionales de PyME especializados en Propiedad Industrial.	icon-propiedad-industrial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9318d4df-960f-495e-a92c-369381af1471	Patentes y Marcas	patentes-y-marcas	Servicios profesionales de PyME especializados en Patentes y Marcas.	icon-patentes-y-marcas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4c18a3a0-a0fb-44ab-b968-6db0d7739f48	Derecho de Autor	derecho-de-autor	Servicios profesionales de PyME especializados en Derecho de Autor.	icon-derecho-de-autor	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3d0ef185-a0a7-43ff-8db1-5c9c8bc65cd6	Contratos Internacionales	contratos-internacionales	Servicios profesionales de PyME especializados en Contratos Internacionales.	icon-contratos-internacionales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
84167153-9edc-4dff-af3d-2e3eb6ff6bb3	Derecho Ambiental	derecho-ambiental	Servicios profesionales de PyME especializados en Derecho Ambiental.	icon-derecho-ambiental	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
84e989cc-cb57-4c90-abdc-17b6527b7a7f	Derecho Aduanero	derecho-aduanero	Servicios profesionales de PyME especializados en Derecho Aduanero.	icon-derecho-aduanero	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
89025285-a9a7-4c1a-a9d8-c7b2271e2364	Compliance	compliance	Servicios profesionales de PyME especializados en Compliance.	icon-compliance	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8b4dcb53-5f59-4c23-ba27-1a5bf4f90a03	Ética Empresarial	ética-empresarial	Servicios profesionales de PyME especializados en Ética Empresarial.	icon-ética-empresarial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d41ecb97-b5de-4ff2-86b4-b3a993d675f6	Responsabilidad Social	responsabilidad-social	Servicios profesionales de PyME especializados en Responsabilidad Social.	icon-responsabilidad-social	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7e6706ae-3cda-48c4-9d24-26d6cbabbbca	Informes de Sustentabilidad	informes-de-sustentabilidad	Servicios profesionales de PyME especializados en Informes de Sustentabilidad.	icon-informes-de-sustentabilidad	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1150858d-6266-4bab-a20c-80701b4d5fc0	Balance Social	balance-social	Servicios profesionales de PyME especializados en Balance Social.	icon-balance-social	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2c975466-887f-45aa-9537-f6a3e43d2b96	Inversión Social	inversión-social	Servicios profesionales de PyME especializados en Inversión Social.	icon-inversión-social	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
e7af2bdf-7e34-4a9d-bb41-d0d36b01840c	Voluntariado Corporativo	voluntariado-corporativo	Servicios profesionales de PyME especializados en Voluntariado Corporativo.	icon-voluntariado-corporativo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
16514843-08fb-4ff5-b105-1cd86656504b	Alianzas Estratégicas	alianzas-estratégicas	Servicios profesionales de PyME especializados en Alianzas Estratégicas.	icon-alianzas-estratégicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6ab28293-57ff-4e91-ab05-9d3d3ad7b6a9	Gestión de Fondos	gestión-de-fondos	Servicios profesionales de PyME especializados en Gestión de Fondos.	icon-gestión-de-fondos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f990c0e5-8202-4f01-948f-129f0a745748	Financiamiento PyME	financiamiento-pyme	Servicios profesionales de PyME especializados en Financiamiento PyME.	icon-financiamiento-pyme	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2093b553-7328-40e3-879d-286e2a6142d0	Leasing	leasing	Servicios profesionales de PyME especializados en Leasing.	icon-leasing	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1cb4cebc-0fea-4989-9f7d-711d98cede3a	Factoring	factoring	Servicios profesionales de PyME especializados en Factoring.	icon-factoring	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
98a82004-9c23-4e0a-b370-b6aaef562b82	Garantías Comerciales	garantías-comerciales	Servicios profesionales de PyME especializados en Garantías Comerciales.	icon-garantías-comerciales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
17afc83b-41e5-4d7d-808a-fdc28cf95886	Seguros de Crédito	seguros-de-crédito	Servicios profesionales de PyME especializados en Seguros de Crédito.	icon-seguros-de-crédito	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
df8f69ba-4927-4ebc-bfb1-7b2a61c7ab0e	Seguros Técnicos	seguros-técnicos	Servicios profesionales de PyME especializados en Seguros Técnicos.	icon-seguros-técnicos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ebdea107-ecf7-4232-9c2d-3c00437d1f36	Seguros de Flota	seguros-de-flota	Servicios profesionales de PyME especializados en Seguros de Flota.	icon-seguros-de-flota	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6526e868-a588-438a-a126-93bf7403aef2	Seguros de Mercancía	seguros-de-mercancía	Servicios profesionales de PyME especializados en Seguros de Mercancía.	icon-seguros-de-mercancía	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b918b678-23b1-426c-95cb-d6c712fec6bb	Prevención de Fraude	prevención-de-fraude	Servicios profesionales de PyME especializados en Prevención de Fraude.	icon-prevención-de-fraude	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
789ba2c7-261d-4034-b911-06055a62af66	Investigaciones Privadas	investigaciones-privadas	Servicios profesionales de PyME especializados en Investigaciones Privadas.	icon-investigaciones-privadas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
be839de2-0838-4695-aaf7-577e4ab5f225	Auditoría de Compras	auditoría-de-compras	Servicios profesionales de PyME especializados en Auditoría de Compras.	icon-auditoría-de-compras	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ecf9b134-13fd-400e-b4d9-0a954f729b0c	Optimización de Gastos	optimización-de-gastos	Servicios profesionales de PyME especializados en Optimización de Gastos.	icon-optimización-de-gastos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ae620db9-8a2b-463d-bc86-5fb909d99d21	Compras Agrupadas	compras-agrupadas	Servicios profesionales de PyME especializados en Compras Agrupadas.	icon-compras-agrupadas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f4c355de-2883-48f7-b435-e0ac9f51dfdf	Club de Empresas	club-de-empresas	Servicios profesionales de PyME especializados en Club de Empresas.	icon-club-de-empresas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
88bb9211-27d7-46a5-b33a-a810c9214ae7	Networking Profesional	networking-profesional	Servicios profesionales de PyME especializados en Networking Profesional.	icon-networking-profesional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
fbd867b2-618e-4ba5-95bd-7841faabca03	Rondas de Negocios	rondas-de-negocios	Servicios profesionales de PyME especializados en Rondas de Negocios.	icon-rondas-de-negocios	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
449bdb46-96e1-450c-a985-2f78a073f0c9	Misiones Comerciales	misiones-comerciales	Servicios profesionales de PyME especializados en Misiones Comerciales.	icon-misiones-comerciales	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
21a915fc-45da-44f3-88e4-18b66f3a065b	Ferias y Exposiciones	ferias-y-exposiciones	Servicios profesionales de PyME especializados en Ferias y Exposiciones.	icon-ferias-y-exposiciones	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b1638fe1-a15e-46ad-a557-22b7e2c5a09f	Stands y Escenografías	stands-y-escenografías	Servicios profesionales de PyME especializados en Stands y Escenografías.	icon-stands-y-escenografías	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
fef7ae0a-caae-43da-a78d-4769981d2e01	Arquitectura Efímera	arquitectura-efímera	Servicios profesionales de PyME especializados en Arquitectura Efímera.	icon-arquitectura-efímera	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
2706995a-f431-435a-9f79-1348cda7a50c	Montaje de Eventos	montaje-de-eventos	Servicios profesionales de PyME especializados en Montaje de Eventos.	icon-montaje-de-eventos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
e66f75b9-7f41-44c1-bd2a-94eb10bd5d95	Iluminación para Eventos	iluminación-para-eventos	Servicios profesionales de PyME especializados en Iluminación para Eventos.	icon-iluminación-para-eventos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
99da8791-3182-4044-877d-301d64d22065	Sonido Profesional	sonido-profesional	Servicios profesionales de PyME especializados en Sonido Profesional.	icon-sonido-profesional	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
67340c59-028e-4ac0-bbf5-69d0f5ccece0	Pantallas LED Gigantes	pantallas-led-gigantes	Servicios profesionales de PyME especializados en Pantallas LED Gigantes.	icon-pantallas-led-gigantes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
907449f9-9952-4d39-90da-df1b3163f9e2	Traducción Simultánea	traducción-simultánea	Servicios profesionales de PyME especializados en Traducción Simultánea.	icon-traducción-simultánea	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
b219bacc-1e73-47d7-add3-65445a05d401	Interpretación de Idiomas	interpretación-de-idiomas	Servicios profesionales de PyME especializados en Interpretación de Idiomas.	icon-interpretación-de-idiomas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f2b0711d-e9e7-4f02-bbd6-5e5d979afb4d	Localización de Software	localización-de-software	Servicios profesionales de PyME especializados en Localización de Software.	icon-localización-de-software	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
0ca492c7-fcef-44e6-a05a-db744df62094	Redacción de Contenidos	redacción-de-contenidos	Servicios profesionales de PyME especializados en Redacción de Contenidos.	icon-redacción-de-contenidos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3986c9bb-f90c-4677-b285-11246a13a346	Copywriting	copywriting	Servicios profesionales de PyME especializados en Copywriting.	icon-copywriting	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c4544d88-3e85-474a-b4c5-24a4c216eb7f	Ghostwriting	ghostwriting	Servicios profesionales de PyME especializados en Ghostwriting.	icon-ghostwriting	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
72981eb1-13e9-4d40-8615-ff3162cc637e	Edición de Libros	edición-de-libros	Servicios profesionales de PyME especializados en Edición de Libros.	icon-edición-de-libros	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c22f9e5f-b426-4e2e-894b-89e535a2a38c	Diseño Editorial	diseño-editorial	Servicios profesionales de PyME especializados en Diseño Editorial.	icon-diseño-editorial	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
7bd46b65-f0cf-4ceb-9db8-be23f1ecfb86	Marketing de Contenidos	marketing-de-contenidos	Servicios profesionales de PyME especializados en Marketing de Contenidos.	icon-marketing-de-contenidos	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
030f8c72-c43c-479b-ae0f-93b4d3922ad2	SEO	seo	Servicios profesionales de PyME especializados en SEO.	icon-seo	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
742b398f-1d95-4431-9831-66477cd8f16a	SEM	sem	Servicios profesionales de PyME especializados en SEM.	icon-sem	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
804605da-7921-49c1-a617-6c9404893e20	Growth Hacking	growth-hacking	Servicios profesionales de PyME especializados en Growth Hacking.	icon-growth-hacking	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
d100f112-ae04-4425-95b2-809e4705acbb	Analítica Web	analítica-web	Servicios profesionales de PyME especializados en Analítica Web.	icon-analítica-web	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
f046de07-f92a-4999-a4cb-6efbb596ba0e	Optimización de Conversión	optimización-de-conversión	Servicios profesionales de PyME especializados en Optimización de Conversión.	icon-optimización-de-conversión	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c1f28b68-a424-4f32-95b3-f465fad1dc61	Automatización de Ventas	automatización-de-ventas	Servicios profesionales de PyME especializados en Automatización de Ventas.	icon-automatización-de-ventas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
47bd349b-e217-4adc-b149-0f2f5728e975	CRM Especializados	crm-especializados	Servicios profesionales de PyME especializados en CRM Especializados.	icon-crm-especializados	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
72c6ffcc-05d1-4e01-9d6a-f39e38b2983a	ERP para PyMEs	erp-para-pymes	Servicios profesionales de PyME especializados en ERP para PyMEs.	icon-erp-para-pymes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
23de4239-dc7e-4d70-a65e-6c7ab3463489	Software de Facturación	software-de-facturación	Servicios profesionales de PyME especializados en Software de Facturación.	icon-software-de-facturación	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
ad8b053e-2a55-42f3-8226-7fbf383adb16	Puntos de Venta (POS)	puntos-de-venta-(pos)	Servicios profesionales de PyME especializados en Puntos de Venta (POS).	icon-puntos-de-venta-(pos)	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
62621077-8edf-41d7-8b7d-f67ab3fbe714	Gestión de Inventario Online	gestión-de-inventario-online	Servicios profesionales de PyME especializados en Gestión de Inventario Online.	icon-gestión-de-inventario-online	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
dbe570f0-b4ba-4bed-aeb9-ab20bd9be458	Soporte Remoto	soporte-remoto	Servicios profesionales de PyME especializados en Soporte Remoto.	icon-soporte-remoto	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4bcf8560-cb1e-45e9-8f67-f0222202747d	Mantenimiento de Servidores	mantenimiento-de-servidores	Servicios profesionales de PyME especializados en Mantenimiento de Servidores.	icon-mantenimiento-de-servidores	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
4e677715-ff72-4b1a-a124-74316294c653	Seguridad Perimetral	seguridad-perimetral	Servicios profesionales de PyME especializados en Seguridad Perimetral.	icon-seguridad-perimetral	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
8a80007b-05cd-43b3-abdc-9702fd8f5fa5	VPN para Empresas	vpn-para-empresas	Servicios profesionales de PyME especializados en VPN para Empresas.	icon-vpn-para-empresas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
1889fcc2-a1dc-4a1e-8cf2-b293a49228d0	Telefonía IP	telefonía-ip	Servicios profesionales de PyME especializados en Telefonía IP.	icon-telefonía-ip	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
6c1e7814-c4cf-46e6-92a3-4d800c773f07	Centrales Telefónicas	centrales-telefónicas	Servicios profesionales de PyME especializados en Centrales Telefónicas.	icon-centrales-telefónicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9b4a4f26-9019-4ede-a4c3-385208422d63	Internet por Fibra	internet-por-fibra	Servicios profesionales de PyME especializados en Internet por Fibra.	icon-internet-por-fibra	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
cd463f8d-7e00-4b70-bcbb-fdafcdc81a39	Radioenlaces	radioenlaces	Servicios profesionales de PyME especializados en Radioenlaces.	icon-radioenlaces	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
14c93428-c688-422b-bbb6-1c7c7b3c8ea7	WIFI Gestionado	wifi-gestionado	Servicios profesionales de PyME especializados en WIFI Gestionado.	icon-wifi-gestionado	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
e7640996-61e4-4bff-881c-4ecacb8be867	Cámaras IP	cámaras-ip	Servicios profesionales de PyME especializados en Cámaras IP.	icon-cámaras-ip	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
3f5b8a55-559e-42dc-9b57-a35336cdacfc	Control de Tiempo y Asistencia	control-de-tiempo-y-asistencia	Servicios profesionales de PyME especializados en Control de Tiempo y Asistencia.	icon-control-de-tiempo-y-asistencia	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
c54d5113-d2a6-43db-b6ed-e6a87847a4c7	Cerraduras Electrónicas	cerraduras-electrónicas	Servicios profesionales de PyME especializados en Cerraduras Electrónicas.	icon-cerraduras-electrónicas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9f7835c7-e3fe-42e7-ba9c-b976d6c82890	Domótica para Oficinas	domótica-para-oficinas	Servicios profesionales de PyME especializados en Domótica para Oficinas.	icon-domótica-para-oficinas	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
fb2a4c0b-55a1-48cc-a080-b3a3c0d64aa5	Edificios Inteligentes	edificios-inteligentes	Servicios profesionales de PyME especializados en Edificios Inteligentes.	icon-edificios-inteligentes	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
9e4421c1-dce0-4c05-938f-10c8529648d4	Gestión Energética BEMS	gestión-energética-bems	Servicios profesionales de PyME especializados en Gestión Energética BEMS.	icon-gestión-energética-bems	t	2026-01-15 00:22:10.31	2026-01-15 00:22:10.31	\N	\N
006b6988-fd2e-43b6-ada2-3372c1df5a6c	Contrucción	contruccin	\N	\N	t	2026-01-15 04:08:22.197061	2026-01-15 04:08:22.197061	\N	\N
4a849eaa-89be-4039-ae4e-f1708af62477	Test Cat	test-cat	\N	\N	t	2026-01-15 04:14:51.434513	2026-01-15 04:14:51.434513	\N	\N
7844d64e-b661-4911-ac20-754462e7916a	Construcción	construccin	\N	\N	t	2026-01-15 04:17:32.820418	2026-01-15 04:17:32.820418	\N	\N
279bf1f1-6045-4872-9aa0-77b47be9d830	Relationship Test Cat	rel-test-cat	\N	\N	t	2026-01-15 04:27:59.60895	2026-01-15 04:27:59.60895	\N	\N
6e859e81-be32-41a6-9158-cc97aa0c6a6c	Arrumacos	arrumacos	\N	\N	t	2026-01-15 04:29:10.231192	2026-01-15 04:29:10.231192	\N	\N
d25b87bd-f118-4dbc-aa04-8c4321fce899	Franquicias	franquicias		\N	t	2026-01-17 15:43:22.744622	2026-01-17 15:43:22.744622		\N
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: guiapymes_user
--

COPY public.companies (id, name, cuit, website, created_at, updated_at, active, status, labels, "categoryId", "subcategoryId") FROM stdin;
188299fe-30b9-40af-a58c-4142628b24ec	Herramientas Pergamino		https://herramientaspergamino.com/	2026-01-15 02:41:16.809933	2026-01-15 04:10:17.152969	t	Sin contactar	\N	006b6988-fd2e-43b6-ada2-3372c1df5a6c	7db78cc7-6f05-480f-9edb-6d017fd87bcd
f1fcddd5-6eba-4221-a05e-106e32683d46	Vivienda Digna		https://www.viviendadigna.org.ar/	2026-01-15 04:18:11.041283	2026-01-15 04:25:39.121103	t	sin contactar	\N	7844d64e-b661-4911-ac20-754462e7916a	7db78cc7-6f05-480f-9edb-6d017fd87bcd
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: guiapymes_user
--

COPY public.contacts (id, "firstName", "lastName", "position", created_at, updated_at, "companyId", active, status, labels) FROM stdin;
2cdae7c5-8c89-48b5-b31e-cc17122ef9c4	Roberto 	Haar	Dueño	2026-01-15 02:28:18.461071	2026-01-15 02:38:54.502745	\N	t		\N
\.


--
-- Data for Name: emails; Type: TABLE DATA; Schema: public; Owner: guiapymes_user
--

COPY public.emails (id, address, type, created_at, updated_at, "companyId", "contactId", active, status, labels) FROM stdin;
\.


--
-- Data for Name: phones; Type: TABLE DATA; Schema: public; Owner: guiapymes_user
--

COPY public.phones (id, number, type, created_at, updated_at, "companyId", "contactId", active, status, labels) FROM stdin;
9fab2778-1f72-497d-97c2-59b64257f199	+54 9 11 3298-7757	Celular	2026-01-15 02:34:16.871657	2026-01-15 02:34:16.871657	\N	2cdae7c5-8c89-48b5-b31e-cc17122ef9c4	t		\N
7f9f528f-02ec-4d04-a76b-6bca65d2500c	02477384616	Fijo	2026-01-15 02:42:42.737638	2026-01-15 02:42:42.737638	188299fe-30b9-40af-a58c-4142628b24ec	\N	t		\N
c4c69090-aee1-41d1-a507-dc81174b368c	+5492477384616	WhatsApp	2026-01-15 02:51:02.445327	2026-01-15 02:51:02.445327	188299fe-30b9-40af-a58c-4142628b24ec	\N	t		\N
\.


--
-- Data for Name: social_networks; Type: TABLE DATA; Schema: public; Owner: guiapymes_user
--

COPY public.social_networks (id, platform, url, username, created_at, updated_at, "companyId", "contactId", active, status, labels) FROM stdin;
be8c2b30-102a-4527-8f70-d2bc16368569	Facebook	https://www.facebook.com/roberto.haar?locale=es_LA	@roberto.haar	2026-01-15 02:38:42.877143	2026-01-15 02:38:42.877143	\N	2cdae7c5-8c89-48b5-b31e-cc17122ef9c4	t	\N	\N
198b416d-feae-4c61-806a-01da6d94f725	Facebook	https://www.facebook.com/herramientaspergamino	@herramientaspergamino	2026-01-15 02:45:19.364506	2026-01-15 02:45:19.364506	188299fe-30b9-40af-a58c-4142628b24ec	\N	t	\N	\N
64cd783f-7ac5-4614-bebe-cf320a7f9449	Instagram	https://www.instagram.com/herramientaspergamino	@herramientaspergamino	2026-01-15 02:48:57.277986	2026-01-15 02:48:57.277986	188299fe-30b9-40af-a58c-4142628b24ec	\N	t	\N	\N
\.


--
-- Data for Name: subcategories; Type: TABLE DATA; Schema: public; Owner: guiapymes_user
--

COPY public.subcategories (id, category_id, name, slug, description, active, created_at, updated_at, status, labels) FROM stdin;
3f83359e-ff3c-499f-970c-3867ca5465b3	5aab4855-a226-4faf-8e47-93687a17e939	Restaurantes	restaurantes	\N	t	2026-01-14 23:19:33.737694	2026-01-14 23:19:33.737694	\N	\N
b136eed3-9b52-4aa9-8ed6-9d74f791c185	6b71fd33-34d7-4145-aff5-1419ff79f58b	web	web	\N	t	2026-01-15 04:21:12.338035	2026-01-15 04:21:12.338035	\N	\N
799daa8c-6e2f-479b-8076-c00115da3c4c	6b71fd33-34d7-4145-aff5-1419ff79f58b	empresa	empresa		t	2026-01-15 04:23:02.879674	2026-01-15 04:23:02.879674	\N	\N
f4a54d07-4a26-438d-a7e4-548c3b3c313d	7844d64e-b661-4911-ac20-754462e7916a	Materiales 	materiales		t	2026-01-15 04:24:13.765849	2026-01-15 04:24:13.765849	\N	\N
7db78cc7-6f05-480f-9edb-6d017fd87bcd	7844d64e-b661-4911-ac20-754462e7916a	Oportunidades	oportunidades		t	2026-01-15 04:10:06.136206	2026-01-15 04:25:18.036151	\N	\N
14e12d1e-cb2a-4dd3-a6b2-198d160ee440	279bf1f1-6045-4872-9aa0-77b47be9d830	Rel Test Sub	rel-test-sub	\N	t	2026-01-15 04:27:59.737343	2026-01-15 04:27:59.737343	\N	\N
62c1aa87-17eb-4f56-8420-c91d12a61f19	6e859e81-be32-41a6-9158-cc97aa0c6a6c	muchos	muchos	\N	t	2026-01-15 04:29:24.55514	2026-01-15 04:29:24.55514	\N	\N
d6be412c-247d-4ae7-8ca1-69b0e24edb1f	6e859e81-be32-41a6-9158-cc97aa0c6a6c	pocos	pocos	\N	t	2026-01-15 04:29:45.999271	2026-01-15 04:29:45.999271	\N	\N
\.


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: phones PK_30d7fc09a458d7a4d9471bda554; Type: CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT "PK_30d7fc09a458d7a4d9471bda554" PRIMARY KEY (id);


--
-- Name: addresses PK_745d8f43d3af10ab8247465e450; Type: CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY (id);


--
-- Name: subcategories PK_793ef34ad0a3f86f09d4837007c; Type: CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT "PK_793ef34ad0a3f86f09d4837007c" PRIMARY KEY (id);


--
-- Name: social_networks PK_973974c10fd4f3f1625c24178cc; Type: CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.social_networks
    ADD CONSTRAINT "PK_973974c10fd4f3f1625c24178cc" PRIMARY KEY (id);


--
-- Name: emails PK_a54dcebef8d05dca7e839749571; Type: CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT "PK_a54dcebef8d05dca7e839749571" PRIMARY KEY (id);


--
-- Name: contacts PK_b99cd40cfd66a99f1571f4f72e6; Type: CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY (id);


--
-- Name: companies PK_d4bc3e82a314fa9e29f652c2c22; Type: CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY (id);


--
-- Name: subcategories UQ_290ef46936579a55f65f81f5e4c; Type: CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT "UQ_290ef46936579a55f65f81f5e4c" UNIQUE (slug);


--
-- Name: categories UQ_420d9f679d41281f282f5bc7d09; Type: CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE (slug);


--
-- Name: emails FK_43abc580d6e98a6e8eb96ffe86d; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT "FK_43abc580d6e98a6e8eb96ffe86d" FOREIGN KEY ("contactId") REFERENCES public.contacts(id) ON DELETE CASCADE;


--
-- Name: addresses FK_463b9c4294c61b044ba740c487a; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT "FK_463b9c4294c61b044ba740c487a" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: addresses FK_4b3866faeb7c87d481e073fc7cd; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT "FK_4b3866faeb7c87d481e073fc7cd" FOREIGN KEY ("contactId") REFERENCES public.contacts(id) ON DELETE CASCADE;


--
-- Name: phones FK_50c0e61a19e6a26dd8116e1e315; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT "FK_50c0e61a19e6a26dd8116e1e315" FOREIGN KEY ("contactId") REFERENCES public.contacts(id) ON DELETE CASCADE;


--
-- Name: social_networks FK_6496cf76985db0ce04b61e069f2; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.social_networks
    ADD CONSTRAINT "FK_6496cf76985db0ce04b61e069f2" FOREIGN KEY ("contactId") REFERENCES public.contacts(id) ON DELETE CASCADE;


--
-- Name: companies FK_820a589c4cd62fb5a831d9b5a58; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "FK_820a589c4cd62fb5a831d9b5a58" FOREIGN KEY ("subcategoryId") REFERENCES public.subcategories(id);


--
-- Name: social_networks FK_a6bcd5ad1749b05e821d4f67eb6; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.social_networks
    ADD CONSTRAINT "FK_a6bcd5ad1749b05e821d4f67eb6" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: emails FK_b22fe2ed9cf191021ec5626c053; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT "FK_b22fe2ed9cf191021ec5626c053" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: phones FK_b664a6476caa0ba38e1caef4b95; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT "FK_b664a6476caa0ba38e1caef4b95" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: companies FK_c728426d7af44c50be89769c2bd; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "FK_c728426d7af44c50be89769c2bd" FOREIGN KEY ("categoryId") REFERENCES public.categories(id);


--
-- Name: contacts FK_f4809f4f9ad4a220959788def42; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT "FK_f4809f4f9ad4a220959788def42" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: subcategories FK_f7b015bc580ae5179ba5a4f42ec; Type: FK CONSTRAINT; Schema: public; Owner: guiapymes_user
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT "FK_f7b015bc580ae5179ba5a4f42ec" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 0LedeVAuL4cKIhSUNdcWqLIchblurkPfc0qj0kh6KEcrx2bMxW1zqlpVb18aqdA

