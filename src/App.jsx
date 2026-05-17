import { supabase } from './supabase.js'
create table filamentos (id uuid default gen_random_uuid() primary key, user_id uuid references auth.users not null, marca text, material text, cor text, peso_total numeric, valor_pago numeric, consumido numeric default 0, created_at timestamp default now());

alter table filamentos enable row level security;

create policy "filamentos_policy" on filamentos using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table clientes (id uuid default gen_random_uuid() primary key, user_id uuid references auth.users not null, nome text, email text, tel text, cidade text, created_at timestamp default now());

alter table clientes enable row level security;

create policy "clientes_policy" on clientes using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table pedidos (id uuid default gen_random_uuid() primary key, user_id uuid references auth.users not null, nome text, cliente text, cliente_id uuid, preco_final numeric, custo_total numeric, lucro numeric, status text default 'pendente', obs text, data text, created_at timestamp default now());

alter table pedidos enable row level security;

create policy "pedidos_policy" on pedidos using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table configs (id uuid default gen_random_uuid() primary key, user_id uuid references auth.users not null unique, custo_hora numeric default 15, energia_kwh numeric default 0.85, margem_lucro numeric default 50, marketplace numeric default 0, cartao numeric default 0, nf numeric default 0);

alter table configs enable row level security;

create policy "configs_policy" on configs using (auth.uid() = user_id) with check (auth.uid() = user_id);
