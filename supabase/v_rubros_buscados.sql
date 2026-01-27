create or replace view public.v_rubros_buscados as
select distinct rubro_buscado
from "data-google-maps"
where rubro_buscado is not null
order by rubro_buscado;