/* ============================================================
   PROFESSOR DO FUTURO — Gerenciador Local de Cupons/Afiliados/Vendas
   Rode no terminal do seu PC: node gerenciar-local.js
   ============================================================ */

const SUPABASE_URL = 'https://ngkkhpvganrfctvyyvle.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5na2tocHZnYW5yZmN0dnl5dmxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODA4MzQ1NSwiZXhwIjoyMTAzNjU5NDU1fQ.fqMur7xg1v0l9ePdECAO79C7LWmhf_gKPEynnkE0fEc';
const LOG_FILE = require('path').join(__dirname, 'vendas-log.txt');
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1563360369680973844/FUv-PvFw3HQCm44oErDWzQ_4zeU1FTLfsdMfkMmQW3N_tMJNp7HlNqJYQkLAnXIqEbdT';

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

async function listarProdutos() {
  return await requisicao('GET', 'produtos?select=id,nome,preco_centavos,preco_promocional_centavos&order=nome.asc');
}

async function main() {
  console.log('🎓 Professor do Futuro — Gerenciador Local\n');

  while (true) {
    console.log('\n════════════════════════════════════════');
    console.log(' 1. Criar cupom de desconto');
    console.log(' 2. Listar cupons');
    console.log(' 3. Criar afiliado');
    console.log(' 4. Listar afiliados');
    console.log(' 5. Registrar venda (com cupom + afiliado)');
    console.log(' 6. Ver log de vendas');
    console.log(' 0. Sair');
    console.log('════════════════════════════════════════');

    const opcao = await pergunta('\nEscolha: ');

    if (opcao === '0') break;

    // -------------------------------------------------
    // 1. CRIAR CUPON
    // -------------------------------------------------
    if (opcao === '1') {
      cabecalho('CRIAR CUPON');
      const codigo = await pergunta('Código (ex: BLACK20): ');
      const tipo = await pergunta('Tipo (percentual/fixo): ');
      const valor = parseFloat(await pergunta('Valor (ex: 20 para 20% ou 5000 para R$50,00): '));
      const produtos = await listarProdutos();
      console.log('\nProdutos disponíveis:');
      produtos.forEach(function(p, i) {
        console.log('  ' + (i + 1) + '. ' + p.nome + ' — R$ ' + ((p.preco_promocional_centavos || p.preco_centavos) / 100).toFixed(2));
      });
      const idx = parseInt(await pergunta('Número do produto (ou 0 para todos): '));
      const produto_id = (idx > 0 && produtos[idx - 1]) ? produtos[idx - 1].id : null;
      const expiracao = await pergunta('Expiração (YYYY-MM-DD ou enter para ilimitado): ') || null;
      const usos_max = await pergunta('Máximo de usos (enter para ilimitado): ') || null;

      const cupom = await requisicao('POST', 'cupons', {
        codigo: codigo, tipo: tipo, valor: valor,
        produto_id: produto_id || null,
        data_expiracao: expiracao,
        usos_max: usos_max ? parseInt(usos_max) : null,
        ativo: true
      });
      console.log('\n✅ Cupom criado:', cupom.codigo);
    }

    // -------------------------------------------------
    // 2. LISTAR CUPOM
    // -------------------------------------------------
    else if (opcao === '2') {
      cabecalho('CUPOM CADASTRADOS');
      const cupons = await requisicao('GET', 'cupons?select=*,produtos(nome)&order=criado_em.desc');
      if (!cupons.length) { console.log('Nenhum cupom.'); continue; }
      cupons.forEach(function(c) {
        const prod = c.produtos ? c.produtos.nome : 'Todos';
        const tipo = c.tipo === 'percentual' ? c.valor + '%' : 'R$ ' + (c.valor / 100).toFixed(2);
        const ativo = c.ativo ? '✅' : '❌';
        console.log(ativo + ' ' + c.codigo + ' | ' + tipo + ' | ' + prod + ' | Usos: ' + c.usos_usados + '/' + (c.usos_max || '∞'));
      });
    }

    // -------------------------------------------------
    // 3. CRIAR AFILIADO
    // -------------------------------------------------
    else if (opcao === '3') {
      cabecalho('CRIAR AFILIADO');
      const nome = await pergunta('Nome: ');
      const email = await pergunta('E-mail: ');
      const codigo = await pergunta('Código de afiliado (ex: MARIA10): ');
      const comissao = parseFloat(await pergunta('Comissão % (ex: 10): '));
      const afiliado = await requisicao('POST', 'afiliados', {
        nome: nome, email: email, codigo_afiliado: codigo, comissao_percentual: comissao, ativo: true
      });
      console.log('\n✅ Afiliado criado!');
      console.log('   Link de divulgação: https://seusite.com/index.html?afiliado=' + codigo);
    }

    // -------------------------------------------------
    // 4. LISTAR AFILIADOS
    // -------------------------------------------------
    else if (opcao === '4') {
      cabecalho('AFILIADOS');
      const afiliados = await requisicao('GET', 'afiliados?select=*&order=criado_em.desc');
      if (!afiliados.length) { console.log('Nenhum afiliado.'); continue; }
      afiliados.forEach(function(a) {
        console.log(a.codigo_afiliado + ' | ' + a.nome + ' | ' + a.email + ' | Comissão: ' + a.comissao_percentual + '% | Vendas: ' + a.total_vendas + ' | Total: R$ ' + (a.total_comissao_centavos / 100).toFixed(2));
      });
    }

    // -------------------------------------------------
    // 5. REGISTRAR VENDA
    // -------------------------------------------------
    else if (opcao === '5') {
      cabecalho('REGISTRAR VENDA');
      const produtos = await listarProdutos();
      console.log('\nProdutos:');
      produtos.forEach(function(p, i) {
        console.log('  ' + (i + 1) + '. ' + p.nome + ' — R$ ' + ((p.preco_promocional_centavos || p.preco_centavos) / 100).toFixed(2));
      });
      const pIdx = parseInt(await pergunta('Produto: '));
      const produto = produtos[pIdx - 1];
      const preco = produto.preco_promocional_centavos || produto.preco_centavos;

      const cliente = await pergunta('E-mail do cliente: ');
      const cupomCod = await pergunta('Cupom (ou enter para nenhum): ') || null;
      const afiliadoCod = await pergunta('Código do afiliado (ou enter para nenhum): ') || null;

      let desconto = 0;
      let cupomInfo = null;
      if (cupomCod) {
        const cupom = await requisicao('GET', 'cupons?codigo=eq.' + cupomCod + '&select=*');
        if (cupom[0]) {
          cupomInfo = cupom[0];
          if (cupomInfo.tipo === 'percentual') {
            desconto = Math.round((preco * cupomInfo.valor) / 100);
          } else {
            desconto = cupomInfo.valor;
          }
          if (desconto > preco) desconto = preco;
        }
      }

      let comissao = 0;
      let afiliadoInfo = null;
      if (afiliadoCod) {
        const af = await requisicao('GET', 'afiliados?codigo_afiliado=eq.' + afiliadoCod + '&select=*');
        if (af[0]) {
          afiliadoInfo = af[0];
          comissao = Math.round(((preco - desconto) * afiliadoInfo.comissao_percentual) / 100);
        }
      }

      const valorFinal = preco - desconto;

      const venda = await requisicao('POST', 'vendas_afiliadas', {
        cliente_email: cliente,
        produto_id: produto.id,
        produto_nome: produto.nome,
        valor_venda_centavos: valorFinal,
        comissao_centavos: comissao,
        status: 'paga'
      });

      if (cupomInfo) {
        await requisicao('PATCH', 'cupons?id=eq.' + cupomInfo.id, { usos_usados: (cupomInfo.usos_usados || 0) + 1 });
      }

      if (afiliadoInfo) {
        await requisicao('PATCH', 'afiliados?id=eq.' + afiliadoInfo.id, {
          total_vendas: (afiliadoInfo.total_vendas || 0) + 1,
          total_comissao_centavos: ((afiliadoInfo.total_comissao_centavos || 0) + comissao)
        });
      }

      const agora = new Date().toLocaleString('pt-BR');
      const linha = '[' + agora + '] VENDA | Cliente: ' + cliente + ' | Produto: ' + produto.nome + ' | Valor: R$ ' + (valorFinal / 100).toFixed(2) + ' | Cupom: ' + (cupomCod || '—') + ' | Afiliado: ' + (afiliadoCod || '—') + ' | Comissão: R$ ' + (comissao / 100).toFixed(2) + ' | Status: paga';
      gravarLog(linha);

      await enviarDiscord('💰 **NOVA VENDA**\n👤 Cliente: ' + cliente + '\n📦 Produto: ' + produto.nome + '\n💵 Valor: R$ ' + (valorFinal / 100).toFixed(2) + '\n🎟️ Cupom: ' + (cupomCod || '—') + '\n🤝 Afiliado: ' + (afiliadoCod || '—') + '\n💸 Comissão: R$ ' + (comissao / 100).toFixed(2) + '\n📅 ' + agora);

      console.log('\n✅ Venda registrada com sucesso!');
      console.log('   Valor final: R$ ' + (valorFinal / 100).toFixed(2));
      console.log('   Desconto cupom: R$ ' + (desconto / 100).toFixed(2));
      console.log('   Comissão afiliado: R$ ' + (comissao / 100).toFixed(2));
    }

    // -------------------------------------------------
    // 6. VER LOG DE VENDAS
    // -------------------------------------------------
    else if (opcao === '6') {
      cabecalho('LOG DE VENDAS');
      if (!fs.existsSync(LOG_FILE)) {
        console.log('Nenhuma venda registrada ainda.');
        continue;
      }
      const conteudo = fs.readFileSync(LOG_FILE, 'utf8').trim();
      if (!conteudo) { console.log('Nenhuma venda registrada.'); continue; }
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
