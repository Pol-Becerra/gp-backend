import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import PQueue from 'p-queue';
import dotenv from 'dotenv';

dotenv.config();

// Crear cliente Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);
