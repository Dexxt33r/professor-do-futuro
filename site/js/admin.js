/* ============================================================
   PROFESSOR DO FUTURO — admin.js
   Painel do Dono — Gerencia produtos, cupons, afiliados e vendas
   ============================================================ */

(function() {
  'use strict';

  const SUPABASE_URL = 'https://ngkkhpvganrfctvyyvle.supabase.co';
  const SUPABASE_ANON = 'sb_publishable_esHmq85Hujm6BZM538L1Cg_igZMdFa_';

  let sb = null;
  let currentTab = 'dashboard';

  window.AdminApp = {
    init: async function() {
      if (!window.supabase || !window.supabase.createClient) {
        console.error('Supabase SDK não carregado');
        return;
      }

      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

      const { data: { user } } = await sb.auth.getUser();
      if (!user) {
        window.location.href = 'login.html';
        return;
      }

      const { data: profile } = await sb
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        alert('Acesso restrito ao dono do site (admin).');
        window.location.href = 'index.html';
        return;
      }

      this.bindTabs();
      this.bindLogout();
      this.loadDashboard();
    },

    bindTabs: function() {
      document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          this.openTab(tab);
        });
      });
    },

    bindLogout: function() {
      const btn = document.getElementById('btnLogout');
      if (btn) {
        btn.addEventListener('click', async () => {
          await sb.auth.signOut();
          window.location.replace('index.html');
        });
      }
    },

    openTab: function(tab) {
      currentTab = tab;

      document.querySelectorAll('.nav-item').forEach(btn => {
    async loadDashboard() {
      const [produtos, cupons, afiliados, vendas] = await Promise.all([
        sb.from('produtos').select('id'),
        sb.from('cupons').select('id'),
        sb.from('afiliados').select('id'),
        sb.from('vendas_afiliadas').select('valor_venda_centavos, comissao_centavos')
      ]);

      document.getElementById('stat-produtos').textContent = (produtos.data || []).length;
      document.getElementById('stat-cupons').textContent = (cupons.data || []).length;
      document.getElementById('stat-afiliados').textContent = (afiliados.data || []).length;
      document.getElementById('stat-vendas').textContent = (vendas.data || []).length;

      const totalComissao = (vendas.data || []).reduce((s, v) => s + (v.comissao_centavos || 0), 0);
      const totalFaturamento = (vendas.data || []).reduce((s, v) => s + (v.valor_venda_centavos || 0), 0);

      document.getElementById('stat-comissoes').textContent = 'R$ ' + (totalComissao / 100).toFixed(2);
      document.getElementById('stat-faturamento').textContent = 'R$ ' + (totalFaturamento / 100).toFixed(2);
    },

        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tab) {
          btn.classList.add('active');
    async loadProdutos() {
      const { data: produtos } = await sb.from('produtos').select('*').order('criado_em', { ascending: false });
      const tbody = document.getElementById('corpo-produtos');
      tbody.innerHTML = '';

      (produtos || []).forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${p.nome}</strong></td>
          <td>R$ ${(p.preco_centavos / 100).toFixed(2)}</td>
          <td>R$ ${(p.preco_promocional_centavos || 0).toFixed(2)}</td>
          <td><span class="badge ${p.ativo ? 'ativo' : 'inativo'}">${p.ativo ? 'Ativo' : 'Inativo'}</span></td>
          <td>
            <button class="btn btn-sm btn-ok" onclick="AdminApp.editarProduto('${p.id}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="AdminApp.excluirProduto('${p.id}')">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    },

        }
      });

    async loadCupons() {
      const { data: cupons } = await sb.from('cupons').select('*').order('criado_em', { ascending: false });
      const tbody = document.getElementById('corpo-cupons');
      tbody.innerHTML = '';

      (cupons || []).forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${c.codigo}</strong></td>
          <td>${c.tipo === 'percentual' ? c.valor + '%' : 'R$ ' + (c.valor / 100).toFixed(2)}</td>
          <td>${c.produto_id ? 'Específico' : 'Todos'}</td>
          <td>${c.usos_usados || 0}</td>
          <td>${c.data_expiracao ? new Date(c.data_expiracao).toLocaleDateString() : '—'}</td>
          <td><span class="badge ${c.ativo ? 'ativo' : 'inativo'}">${c.ativo ? 'Ativo' : 'Inativo'}</span></td>
          <td>
            <button class="btn btn-sm btn-ok" onclick="AdminApp.editarCupom('${c.id}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="AdminApp.excluirCupom('${c.id}')">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    },

      document.querySelectorAll('.admin-tab').forEach(sec => {
    async loadAfiliados() {
      const { data: afiliados } = await sb.from('afiliados').select('*').order('criado_em', { ascending: false });
      const tbody = document.getElementById('corpo-afiliados');
      tbody.innerHTML = '';

      (afiliados || []).forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${a.nome}</strong></td>
          <td>${a.email}</td>
          <td>${a.codigo_afiliado}</td>
          <td>R$ ${(a.comissao_fixa_centavos / 100).toFixed(2)}</td>
          <td>${a.total_vendas}</td>
          <td>R$ ${(a.total_comissao_centavos / 100).toFixed(2)}</td>
          <td><span class="badge ${a.ativo ? 'ativo' : 'inativo'}">${a.ativo ? 'Ativo' : 'Inativo'}</span></td>
          <td>
            <button class="btn btn-sm btn-ok" onclick="AdminApp.editarAfiliado('${a.id}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="AdminApp.excluirAfiliado('${a.id}')">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    },
    async loadVendas() {
      const { data: vendas } = await sb.from('vendas_afiliadas').select('*').order('criado_em', { ascending: false });
      const tbody = document.getElementById('corpo-vendas');
      tbody.innerHTML = '';

      (vendas || []).forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${v.cliente_email}</td>
          <td>${v.produto_nome}</td>
          <td>R$ ${(v.valor_venda_centavos / 100).toFixed(2)}</td>
          <td>R$ ${(v.comissao_centavos / 100).toFixed(2)}</td>
          <td><span class="badge ${v.status}">${v.status}</span></td>
          <td>${new Date(v.criado_em).toLocaleDateString('pt-BR')}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  };

        sec.classList.remove('active');
      });
      const sec = document.getElementById('tab-' + tab);
      if (sec) sec.classList.add('active');

      if (tab === 'dashboard') this.loadDashboard();
      else if (tab === 'produtos') this.loadProdutos();
      else if (tab === 'cupons') this.loadCupons();
      else if (tab === 'afiliados') this.loadAfiliados();
      else if (tab === 'vendas') this.loadVendas();
    },