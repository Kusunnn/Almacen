-- Migración: add_google_auth
-- Ejecutar en: Supabase → SQL Editor

-- 1. Hacer la columna contrasena opcional (nullable)
--    para soportar usuarios registrados con Google
ALTER TABLE public.usuarios
  ALTER COLUMN contrasena DROP NOT NULL;

-- 2. Agregar columna google_id para vincular cuentas de Google
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
