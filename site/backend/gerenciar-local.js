/* ============================================================
   PROFESSOR DO FUTURO — Gerenciador Local SIMPLIFICADO
   1 produto fixo | Cupom % | Comissão fixa R$ 30,00 | Log + Discord
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

async function main() {
  const produtoId = await garantirProduto();
  console.log('🎓 Professor do Futuro — Gerenciador (Produto único ativo)\n');

  while (true) {
    console.log('\n════════════════════════════════════════');
    console.log(' 1. Criar cupom (desconto %)');
    console.log(' 2. Listar cupons');
    console.log(' 3. Criar afiliado (comissão fixa R$ 30)');
    console.log(' 4. Listar afiliados');
    console.log(' 5. Registrar venda');
    console.log(' 6. Ver log de vendas');
    console.log(' 0. Sair');
    console.log('═════════════════════════════════════════');

    const opcao = await pergunta('\nEscolha: ');
    if (opcao === '0') break;

    if (opcao === '1') {
      cabecalho('CRIAR CUPOM');
      const codigo = await pergunta('Código (ex: BLACK20): ');
      const percentual = parseFloat(await pergunta('Desconto % (ex: 20): '));
      const expiracao = await pergunta('Expira em (YYYY-MM-DD ou enter para nunca): ') || null;
      const usos_max = await pergunta('Máx. usos (enter para ilimitado): ') || null;

      await requisicao('POST', 'cupons', {
        codigo: codigo,
        tipo: 'percentual',
        valor: percentual,
        produto_id: produtoId,
        data_expiracao: expiracao,
        usos_max: usos_max ? parseInt(usos_max) : null,
        ativo: true
      });
      console.log('\n✅ Cupom', codigo, 'criado com', percentual, '% de desconto.');
    }

    else if (opcao === '2') {
      cabecalho('CUPOM CADASTRADOS');
      const cupons = await requisicao('GET', 'cupons?select=*&produto_id=eq.' + produtoId + '&order=criado_em.desc');
      if (!cupons.length) { console.log('Nenhum cupom.'); continue; }
      cupons.forEach(function(c) {
        const ativo = c.ativo ? '✅' : '❌';
        console.log(ativo + ' ' + c.codigo + ' | Desconto: ' + c.valor + '% | Usos: ' + c.usos_usados + '/' + (c.usos_max || '∞'));
      });
    }

    else if (opcao === '3') {
      cabecalho('CRIAR AFILIADO');
      const nome = await pergunta('Nome: ');
      const email = await pergunta('E-mail: ');
      const codigo = await pergunta('Código (ex: MARIA10): ');

      await requisicao('POST', 'afiliados', {
        nome: nome,
        email: email,
        codigo_afiliado: codigo,
        comissao_percentual: 0,
        ativo: true
      });
      console.log('\n✅ Afiliado', codigo, 'criado!');
      console.log('   Link: https://seusite.com/?afiliado=' + codigo);
      console.log('   Comissão fixa: R$ 30,00 por venda.');
    }

    else if (opcao === '4') {
      cabecalho('AFILIADOS');
      const afiliados = await requisicao('GET', 'afiliados?select=*&order=criado_em.desc');
      if (!afiliados.length) { console.log('Nenhum afiliado.'); continue; }
      afiliados.forEach(function(a) {
        console.log(a.codigo_afiliado + ' | ' + a.nome + ' | ' + a.email + ' | Vendas: ' + a.total_vendas + ' | Total comissão: R$ ' + (a.total_comissao_centavos / 100).toFixed(2));
      });
    }

    else if (opcao === '5') {
      cabecalho('REGISTRAR VENDA');
      const cliente = await pergunta('E-mail do cliente: ');
      const cupomCod = await pergunta('Cupom (ou enter para nenhum): ') || null;
      const afiliadoCod = await pergunta('Código do afiliado (ou enter para nenhum): ') || null;

      let descontoCentavos = 0;
      let cupomInfo = null;
      if (cupomCod) {
        const cupom = await requisicao('GET', 'cupons?codigo=eq.' + cupomCod + '&select=*');
        if (cupom[0]) {
          cupomInfo = cupom[0];
          descontoCentavos = Math.round((PRODUTO_PRECO_CENTAVOS * cupomInfo.valor) / 100);
          if (descontoCentavos > PRODUTO_PRECO_CENTAVOS) descontoCentavos = PRODUTO_PRECO_CENTAVOS;
        }
      }

      let comissaoCentavos = 0;
      let afiliadoInfo = null;
      if (afiliadoCod) {
        const af = await requisicao('GET', 'afiliados?codigo_afiliado=eq.' + afiliadoCod + '&select=*');
        if (af[0]) {
          afiliadoInfo = af[0];
          comissaoCentavos = COMISSAO_FIXA_CENTAVOS;
        }
      }

      const valorFinal = PRODUTO_PRECO_CENTAVOS - descontoCentavos;

      await requisicao('POST', 'vendas_afiliadas', {
        cliente_email: cliente,
        produto_id: produtoId,
        produto_nome: PRODUTO_NOME,
        valor_venda_centavos: valorFinal,
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
      const linha = '[' + agora + '] VENDA | Cliente: ' + cliente + ' | Produto: Professor do Futuro | Valor: R$ ' + (valorFinal / 100).toFixed(2) + ' | Cupom: ' + (cupomCod || '—') + ' | Afiliado: ' + (afiliadoCod || '—') + ' | Comissão: R$ ' + (comissaoCentavos / 100).toFixed(2) + ' | Status: paga';
      gravarLog(linha);

      await enviarDiscord('💰 **NOVA VENDA**\n👤 Cliente: ' + cliente + '\n📦 Produto: Professor do Futuro\n💵 Valor: R$ ' + (valorFinal / 100).toFixed(2) + '\n🎟️ Cupom: ' + (cupomCod || '—') + '\n🤝 Afiliado: ' + (afiliadoCod || '—') + '\n💸 Comissão: R$ ' + (comissaoCentavos / 100).toFixed(2) + '\n📅 ' + agora);

      console.log('\n✅ Venda registrada!');
      console.log('   Valor produto: R$ ' + (PRODUTO_PRECO_CENTAVOS / 100).toFixed(2));
      console.log('   Desconto cupom: R$ ' + (descontoCentavos / 100).toFixed(2));
      console.log('   Valor final: R$ ' + (valorFinal / 100).toFixed(2));
      console.log('   Comissão afiliado: R$ ' + (comissaoCentavos / 100).toFixed(2));
    }

    else if (opcao === '6') {
      cabecalho('LOG DE VENDAS');
      if (!fs.existsSync(LOG_FILE)) { console.log('Nenhuma venda.'); continue; }
      const conteudo = fs.readFileSync(LOG_FILE, 'utf8').trim();
      if (!conteudo) { console.log('Nenhuma venda.'); continue; }
      console.log(conteudo);
    }

    else {
      console.log('Opção inválida.');
    }
  }

  console.log('\n👋 Saindo...\n');
  rl.close();
}

main().catch(function(e) { console.error('Erro:', e.message); rl.close(); process.exit(1); });
