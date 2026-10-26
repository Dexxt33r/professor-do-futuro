/* ============================================================
   PROFESSOR DO FUTURO — Gerenciador Local SIMPLIFICADO
   1 produto fixo | 1 afiliado = 1 cupom | Comissão fixa R$ 30
   Cliente digita cupom OU código do afiliado
   Rode: node gerenciar-local.js
   ============================================================ */

const SUPABASE_URL = 'https://ngkkhpvganrfctvyyvle.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5na2tocHZnYW5yZmN0dnl5dmxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODA4MzQ1NSwiZXhwIjoyMTAzNjU5NDU1fQ.fqMur7xg1v0l9ePdECAO79C7LWmhf_gKPEynnkE0fEc';
const LOG_FILE = require('path').join(__dirname, 'vendas-log.txt');
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1563360369680973844/FUv-PvFw3HQCm44oErDWzQ_4zeU1FTLfsdMfkMmQW3N_tMJNp7HlNqJYQkLAnXIqEbdT';

const PRODUTO_NOME = 'Professor do Futuro — Curso + Ferramentas';
const PRODUTO_PRECO_CENTAVOS = 19700;
const COMISSAO_FIXA_CENTAVOS = 3000;

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function pergunta(texto) {
  return new Promise((resolve) => rl.question(texto, resolve));
}

function cabecalho(titulo) {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║ ' + titulo.padEnd(38) + ' ║');
  console.log('╚════════════════════════════════════════╝\n');
}

async function requisicao(method, endpoint, body) {
  const url = SUPABASE_URL + '/rest/v1/' + endpoint;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
  const opts = { method: method, headers: headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(res.status + ': ' + JSON.stringify(data));
  return data;
}

async function enviarDiscord(mensagem) {
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: mensagem })
    });
  } catch (e) {
    console.log('(Falha ao enviar Discord: ' + e.message + ')');
  }
}

function gravarLog(linha) {
  fs.appendFileSync(LOG_FILE, linha + '\n', 'utf8');
}

async function garantirProduto() {
  let produtos = await requisicao('GET', 'produtos?select=*&nome=eq.' + encodeURIComponent(PRODUTO_NOME));
  if (produtos.length > 0) return produtos[0].id;
  const criado = await requisicao('POST', 'produtos', {
    nome: PRODUTO_NOME,
    descricao: 'Curso Professor do Futuro + Ferramentas do Laboratório',
    preco_centavos: PRODUTO_PRECO_CENTAVOS,
    ativo: true
  });
  return criado.id;
}

async function cadastrarAfiliado() {
  cabecalho('CRIAR AFILIADO');
  const nome = await pergunta('Nome: ');
  const email = await pergunta('E-mail: ');
  const codigo = await pergunta('Código do afiliado (ex: MARIA10): ');

  // Verificar se já existe cupom com este código
  let cupomExistente = null;
  try {
    const cupons = await requisicao('GET', 'cupons?select=*&codigo=eq.' + encodeURIComponent(codigo));
    if (cupons.length > 0) {
      cupomExistente = cupons[0];
    }
  } catch (e) {}

  let cupomValor;
  if (cupomExistente) {
    cupomValor = cupomExistente.valor;
    console.log('\n⚠️  Cupom "' + codigo + '" já existe. Usando cupom existente.');
    console.log('   Desconto atual: ' + cupomExistente.valor + '%');
  } else {
    // Criar o cupom primeiro
    await requisicao('POST', 'cupons', {
      codigo: codigo,
      tipo: 'percentual',
      valor: 0,
      produto_id: null,
      data_expiracao: null,
      usos_max: null,
      ativo: true
    });
    cupomValor = 0;
  }

  // Verificar se já existe afiliado com este código
  let afiliadoExistente = null;
  try {
    const afiliados = await requisicao('GET', 'afiliados?select=*&codigo_afiliado=eq.' + encodeURIComponent(codigo));
    if (afiliados.length > 0) {
      afiliadoExistente = afiliados[0];
    }
  } catch (e) {}

  if (afiliadoExistente) {
    console.log('\n⚠️  Afiliado "' + codigo + '" já existe. Atualizando dados...');
    await requisicao('PATCH', 'afiliados?id=eq.' + afiliadoExistente.id, {
      nome: nome,
      email: email,
      cupom_codigo: codigo,
      comissao_fixa_centavos: COMISSAO_FIXA_CENTAVOS,
      ativo: true
    });
    console.log('\n✅ Afiliado atualizado!');
  } else {
    // Criar o afiliado vinculado ao cupom
    await requisicao('POST', 'afiliados', {
      nome: nome,
      email: email,
      codigo_afiliado: codigo,
      cupom_codigo: codigo,
      comissao_fixa_centavos: COMISSAO_FIXA_CENTAVOS,
      ativo: true
    });
    console.log('\n✅ Afiliado cadastrado!');
  }

  console.log('   Código: ' + codigo);
  console.log('   Cupom: ' + codigo + ' (desconto: ' + cupomValor + '%)');
  console.log('   Comissão: R$ ' + (COMISSAO_FIXA_CENTAVOS / 100).toFixed(2));
  console.log('   Link: https://professor-do-futuro-brown.vercel.app/?afiliado=' + codigo);
}

async function listarAfiliados() {
  cabecalho('AFILIADOS E CUPONS');
  const afiliados = await requisicao('GET', 'afiliados?select=*&order=criado_em.desc');
  if (!afiliados.length) { console.log('Nenhum afiliado.'); return; }
  afiliados.forEach(function(a) {
    console.log(a.codigo_afiliado + ' | ' + a.nome + ' | ' + a.email + ' | Cupom: ' + a.cupom_codigo + ' | Comissão: R$ ' + (a.comissao_fixa_centavos / 100).toFixed(2) + ' | Vendas: ' + a.total_vendas);
  });
}

async function registrarVenda(produtoId) {
  cabecalho('REGISTRAR VENDA');
  const cliente = await pergunta('E-mail do cliente: ');
  const codigo = await pergunta('Cupom OU código do afiliado: ');

  let descontoCentavos = 0;
  let cupomInfo = null;
  let afiliadoInfo = null;

  // Tenta buscar como cupom
  if (codigo) {
    const cupom = await requisicao('GET', 'cupons?select=*&codigo=eq.' + codigo);
    if (cupom[0]) {
      cupomInfo = cupom[0];
      descontoCentavos = Math.round((PRODUTO_PRECO_CENTAVOS * cupomInfo.valor) / 100);
      if (descontoCentavos > PRODUTO_PRECO_CENTAVOS) descontoCentavos = PRODUTO_PRECO_CENTAVOS;
      // Busca afiliado pelo cupom_codigo
      const af = await requisicao('GET', 'afiliados?select=*&cupom_codigo=eq.' + codigo);
      if (af[0]) afiliadoInfo = af[0];
    }
  }

  // Se não encontrou por cupom, tentar por código de afiliado
  if (!afiliadoInfo && codigo) {
    const af = await requisicao('GET', 'afiliados?select=*&codigo_afiliado=eq.' + codigo);
    if (af[0]) {
      afiliadoInfo = af[0];
      // Busca o cupom vinculado
      const c = await requisicao('GET', 'cupons?select=*&codigo=eq.' + af[0].cupom_codigo);
      if (c[0]) {
        cupomInfo = c[0];
        descontoCentavos = Math.round((PRODUTO_PRECO_CENTAVOS * c[0].valor) / 100);
        if (descontoCentavos > PRODUTO_PRECO_CENTAVOS) descontoCentavos = PRODUTO_PRECO_CENTAVOS;
      }
    }
  }

  let comissaoCentavos = afiliadoInfo ? COMISSAO_FIXA_CENTAVOS : 0;
  const valorFinal = PRODUTO_PRECO_CENTAVOS - descontoCentavos;

  await requisicao('POST', 'vendas_afiliadas', {
    cliente_email: cliente,
    produto_id: produtoId,
    produto_nome: PRODUTO_NOME,
    valor_venda_centavos: PRODUTO_PRECO_CENTAVOS,
    desconto_centavos: descontoCentavos,
    comissao_centavos: comissaoCentavos,
    status: 'paga'
  });

  if (cupomInfo) {
    await requisicao('PATCH', 'cupons?id=eq.' + cupomInfo.id, { usos_usados: (cupomInfo.usos_usados || 0) + 1 });
  }
  if (afiliadoInfo) {
    await requisicao('PATCH', 'afiliados?id=eq.' + afiliadoInfo.id, {
      total_vendas: (afiliadoInfo.total_vendas || 0) + 1,
      total_comissao_centavos: ((afiliadoInfo.total_comissao_centavos || 0) + comissaoCentavos)
    });
  }

  const agora = new Date().toLocaleString('pt-BR');
  const linha = '[' + agora + '] VENDA | Cliente: ' + cliente + ' | Produto: Professor do Futuro | Valor: R$ ' + (valorFinal / 100).toFixed(2) + ' | Cupom: ' + (cupomInfo ? cupomInfo.codigo : codigo) + ' | Afiliado: ' + (afiliadoInfo ? afiliadoInfo.codigo_afiliado : '—') + ' | Comissão: R$ ' + (comissaoCentavos / 100).toFixed(2) + ' | Status: paga';
  gravarLog(linha);

  await enviarDiscord('💰 **NOVA VENDA**\n👤 Cliente: ' + cliente + '\n📦 Produto: Professor do Futuro\n💵 Valor: R$ ' + (valorFinal / 100).toFixed(2) + '\n🎟️ Cupom: ' + (cupomInfo ? cupomInfo.codigo : codigo) + '\n🤝 Afiliado: ' + (afiliadoInfo ? afiliadoInfo.codigo_afiliado : '—') + '\n💸 Comissão: R$ ' + (comissaoCentavos / 100).toFixed(2) + '\n📅 ' + agora);

  console.log('\n✅ Venda registrada!');
  console.log('   Valor produto: R$ ' + (PRODUTO_PRECO_CENTAVOS / 100).toFixed(2));
  console.log('   Desconto cupom: R$ ' + (descontoCentavos / 100).toFixed(2));
  console.log('   Valor final: R$ ' + (valorFinal / 100).toFixed(2));
  console.log('   Comissão afiliado: R$ ' + (comissaoCentavos / 100).toFixed(2));
}

async function listarCupons() {
  cabecalho('CUPOM CADASTRADOS');
  const cupons = await requisicao('GET', 'cupons?select=*&order=criado_em.desc');
  if (!cupons.length) { console.log('Nenhum cupom.'); return; }
  cupons.forEach(function(c) {
    const ativo = c.ativo ? '✅' : '❌';
    console.log(ativo + ' ' + c.codigo + ' | Desconto: ' + c.valor + '% | Usos: ' + c.usos_usados + '/' + (c.usos_max || '∞'));
  });
}

async function main() {
  const produtoId = await garantirProduto();
  console.log('🎓 Professor do Futuro — Gerenciador Local\n');

  while (true) {
    console.log('\n════════════════════════════════════════');
    console.log(' 1. Criar afiliado (gera cupom automaticamente)');
    console.log(' 2. Listar afiliados e cupons');
    console.log(' 3. Registrar venda (digite cupom OU código do afiliado)');
    console.log(' 4. Ver log de vendas');
    console.log(' 0. Sair');
    console.log('═════════════════════════════════════════');

    const opcao = await pergunta('\nEscolha: ');
    if (opcao === '0') break;

    if (opcao === '1') {
      await cadastrarAfiliado();
    } else if (opcao === '2') {
      await listarAfiliados();
    } else if (opcao === '3') {
      await registrarVenda(produtoId);
    } else if (opcao === '4') {
      cabecalho('LOG DE VENDAS');
      if (!fs.existsSync(LOG_FILE)) { console.log('Nenhuma venda.'); continue; }
      const conteudo = fs.readFileSync(LOG_FILE, 'utf8').trim();
      if (!conteudo) { console.log('Nenhuma venda.'); continue; }
      console.log(conteudo);
    } else {
      console.log('Opção inválida.');
    }
  }

  console.log('\n👋 Saindo...\n');
  rl.close();
}

main().catch(function(e) { console.error('Erro:', e.message); rl.close(); process.exit(1); });
