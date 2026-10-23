// ============================================================
// PROFESSOR DO FUTURO — Edge Function: validar-cupom
// Valida um cupom de desconto e retorna o valor do desconto.
// Chamada pelo frontend com Authorization: Bearer <access_token>.
// ============================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Trata preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { codigo, produto_id } = await req.json();
    if (!codigo || typeof codigo !== 'string') {
      return new Response(JSON.stringify({ ok: false, erro: 'Código do cupom é obrigatório.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    // Busca o cupom (ignora ativo aqui para dar mensagem clara)
    const { data: cupom, error } = await supabase
      .from('cupons')
      .select('*, produtos(nome, preco_centavos, preco_promocional_centavos)')
      .eq('codigo', codigo.trim())
      .single();

    if (error || !cupom) {
      return new Response(JSON.stringify({ ok: false, erro: 'Cupom não encontrado.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Regras de validação
    const agora = new Date();
    if (!cupom.ativo) {
      return new Response(JSON.stringify({ ok: false, erro: 'Este cupom está desativado.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (cupom.data_expiracao && new Date(cupom.data_expiracao) < agora) {
      return new Response(JSON.stringify({ ok: false, erro: 'Este cupom expirou.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (cupom.usos_max && cupom.usos_usados >= cupom.usos_max) {
      return new Response(JSON.stringify({ ok: false, erro: 'Este cupom esgotou seus usos.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    // Se o cupom é para um produto específico, exige correspondência
    if (cupom.produto_id && produto_id && cupom.produto_id !== produto_id) {
      return new Response(JSON.stringify({ ok: false, erro: 'Este cupom não se aplica a este produto.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determina o preço base do produto
    const produto = (cupom as any).produtos;
    let precoBaseCentavos = 0;
    if (produto) {
      precoBaseCentavos = produto.preco_promocional_centavos ?? produto.preco_centavos ?? 0;
    }

    let descontoCentavos = 0;
    if (cupom.tipo === 'percentual') {
      descontoCentavos = Math.round((precoBaseCentavos * Number(cupom.valor)) / 100);
    } else {
      // fixo: valor já está em centavos
      descontoCentavos = Math.round(Number(cupom.valor));
    }
    if (descontoCentavos > precoBaseCentavos) descontoCentavos = precoBaseCentavos;

    const precoFinal = Math.max(precoBaseCentavos - descontoCentavos, 0);

    return new Response(
      JSON.stringify({
        ok: true,
        cupom: {
          codigo: cupom.codigo,
          tipo: cupom.tipo,
          valor: cupom.valor,
          desconto_centavos: descontoCentavos,
          preco_base_centavos: precoBaseCentavos,
          preco_final_centavos: precoFinal,
        },
        produto: produto
          ? { id: produto.id, nome: produto.nome }
          : null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('validar-cupom error:', err);
    return new Response(JSON.stringify({ ok: false, erro: 'Erro interno ao validar cupom.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
