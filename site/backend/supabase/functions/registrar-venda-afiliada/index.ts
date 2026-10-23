// ============================================================
// PROFESSOR DO FUTURO — Edge Function: registrar-venda-afiliada
// Registra uma venda atribuída a um afiliado e calcula a comissão.
// Pode ser chamada pelo checkout público (sem login do cliente)
// pois roda com a service_role key do servidor.
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      codigo_afiliado,
      cliente_email,
      produto_id,
      produto_nome,
      valor_venda_centavos,
    } = await req.json();

    if (!codigo_afiliado || typeof codigo_afiliado !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, erro: 'Código do afiliado é obrigatório.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!cliente_email || typeof cliente_email !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, erro: 'E-mail do cliente é obrigatório.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const valor = Number(valor_venda_centavos);
    if (!valor || valor < 0) {
      return new Response(
        JSON.stringify({ ok: false, erro: 'Valor da venda inválido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Busca afiliado ativo pelo código
    const { data: afiliado, error: errA } = await supabase
      .from('afiliados')
      .select('*, profiles(nome, email)')
      .eq('codigo_afiliado', codigo_afiliado.trim())
      .eq('ativo', true)
      .single();

    if (errA || !afiliado) {
      return new Response(
        JSON.stringify({ ok: false, erro: 'Código de afiliado inválido ou inativo.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Busca nome do produto se não enviado
    let nomeProduto = produto_nome || '';
    if (!nomeProduto && produto_id) {
      const { data: produto } = await supabase
        .from('produtos')
        .select('nome')
        .eq('id', produto_id)
        .single();
      if (produto) nomeProduto = produto.nome;
    }

    // Calcula comissão
    const comissaoPercentual = Number(afiliado.comissao_percentual ?? 10);
    const comissaoCentavos = Math.round((valor * comissaoPercentual) / 100);

    // Registra a venda
    const { data: venda, error: errV } = await supabase
      .from('vendas_afiliadas')
      .insert({
        afiliado_id: afiliado.id,
        cliente_email: cliente_email.trim().toLowerCase(),
        produto_id: produto_id || null,
        produto_nome: nomeProduto,
        valor_venda_centavos: valor,
        comissao_centavos: comissaoCentavos,
        status: 'pendente',
      })
      .select()
      .single();

    if (errV) throw errV;

    // Atualiza totais do afiliado
    await supabase
      .from('afiliados')
      .update({
        total_vendas: (afiliado.total_vendas || 0) + 1,
        total_comissao_centavos: ((afiliado.total_comissao_centavos || 0) + comissaoCentavos),
        atualizado_em: new Date().toISOString(),
      })
      .eq('id', afiliado.id);

    return new Response(
      JSON.stringify({
        ok: true,
        venda: {
          id: venda.id,
          afiliado: afiliado.codigo_afiliado,
          cliente_email: venda.cliente_email,
          produto_nome: venda.produto_nome,
          valor_venda_centavos: venda.valor_venda_centavos,
          comissao_centavos: venda.comissao_centavos,
          status: venda.status,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('registrar-venda-afiliada error:', err);
    return new Response(JSON.stringify({ ok: false, erro: 'Erro interno ao registrar venda.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
