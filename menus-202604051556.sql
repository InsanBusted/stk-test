--
-- PostgreSQL database dump
--

\restrict ISwPlpVYiy4arHySSff8vjW05T8o8f5YmbgxGDKLLN17f0kRKO7CjeLj2q8dO7s

-- Dumped from database version 17.9 (Debian 17.9-1.pgdg13+1)
-- Dumped by pg_dump version 17.6

-- Started on 2026-04-05 15:56:51

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16400)
-- Name: Menu; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Menu" (
    id text NOT NULL,
    name text NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Menu" OWNER TO root;

--
-- TOC entry 217 (class 1259 OID 16391)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO root;

--
-- TOC entry 3432 (class 0 OID 16400)
-- Dependencies: 218
-- Data for Name: Menu; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Menu" (id, name, "parentId", "createdAt", "updatedAt", "order") FROM stdin;
3368952e-760b-491b-bf6d-83e91a967d2b	System Management	\N	2026-04-04 20:45:46.633	2026-04-04 20:45:46.633	0
67f09e56-cfc3-4ba8-9eb3-82c2d0d05c97	System Management	3368952e-760b-491b-bf6d-83e91a967d2b	2026-04-05 01:37:11.983	2026-04-05 01:37:11.983	0
e516a24f-32ad-477e-98f8-1f62dcad4774	Systems	67f09e56-cfc3-4ba8-9eb3-82c2d0d05c97	2026-04-05 01:37:36.628	2026-04-05 01:37:36.628	0
fe91cf13-2b64-4e14-8a1f-7c8b3ad20617	System Code	e516a24f-32ad-477e-98f8-1f62dcad4774	2026-04-05 01:37:58.372	2026-04-05 01:37:58.372	0
e9be3cf6-fd75-498e-8579-39c3e09c5515	Users dan Groups	67f09e56-cfc3-4ba8-9eb3-82c2d0d05c97	2026-04-05 01:39:34.146	2026-04-05 01:39:34.146	0
59af7850-1d00-4ca5-aa78-71d4245d212f	Users	e9be3cf6-fd75-498e-8579-39c3e09c5515	2026-04-05 01:40:27.687	2026-04-05 01:40:27.687	0
a55ab230-bf28-442c-b1ec-2d9f224d59d1	Groups	e9be3cf6-fd75-498e-8579-39c3e09c5515	2026-04-05 01:40:41.156	2026-04-05 01:40:41.156	0
8d7c2a7a-12cb-4de9-8da0-a87fd0fdff25	Properties	67f09e56-cfc3-4ba8-9eb3-82c2d0d05c97	2026-04-05 05:19:51.306	2026-04-05 05:19:51.306	3
8b43cb80-88ae-4b90-9dfc-190e204861a3	Api List	e516a24f-32ad-477e-98f8-1f62dcad4774	2026-04-05 06:00:25.061	2026-04-05 06:00:25.061	5
5989cc1e-936d-4e95-b1df-05d8efd9d1c0	Api Edit	e9be3cf6-fd75-498e-8579-39c3e09c5515	2026-04-05 06:00:52.767	2026-04-05 07:02:36.72	2
e7e722a3-029f-403d-9cc3-c41967e896d7	Code Registration 2	fe91cf13-2b64-4e14-8a1f-7c8b3ad20617	2026-04-05 01:38:14.283	2026-04-05 07:03:17.284	0
74b7f861-bcc6-439d-846a-e140250a558a	properties	8d7c2a7a-12cb-4de9-8da0-a87fd0fdff25	2026-04-05 05:15:14.831	2026-04-05 07:05:12.539	0
624b1168-451a-4b97-9206-4b5d1e8c7cbf	Api Registration	8b43cb80-88ae-4b90-9dfc-190e204861a3	2026-04-05 06:00:41.462	2026-04-05 07:25:01.739	1
\.


--
-- TOC entry 3431 (class 0 OID 16391)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2e095347-e59b-4d4c-8979-394494c32ad2	b33a9bec474d9c9faeb7b8b796753397230e31373fca09925d5a38488234f05a	2026-04-04 19:10:40.770049+00	20260404191040_init_and_add_model_menu	\N	\N	2026-04-04 19:10:40.749563+00	1
e0e9fd4d-0191-4e0c-bc46-0979896906bb	777820e5c33527e7a282f1c62019fc44dc04b90254bf4b4ae3412e2955049e17	2026-04-05 01:45:03.240498+00	20260405014503_add_order_in_table_menu	\N	\N	2026-04-05 01:45:03.214317+00	1
\.


--
-- TOC entry 3284 (class 2606 OID 16407)
-- Name: Menu Menu_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Menu"
    ADD CONSTRAINT "Menu_pkey" PRIMARY KEY (id);


--
-- TOC entry 3282 (class 2606 OID 16399)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3285 (class 2606 OID 16408)
-- Name: Menu Menu_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Menu"
    ADD CONSTRAINT "Menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Menu"(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2026-04-05 15:56:51

--
-- PostgreSQL database dump complete
--

\unrestrict ISwPlpVYiy4arHySSff8vjW05T8o8f5YmbgxGDKLLN17f0kRKO7CjeLj2q8dO7s

