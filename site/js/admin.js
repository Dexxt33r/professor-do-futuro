/* PROFESSOR DO FUTURO — admin.js */
(function(){
  'use strict';
  var SUPABASE_URL = 'https://ngkkhpvganrfctvyyvle.supabase.co';
  var SUPABASE_ANON = 'sb_publishable_esHmq85Hujm6BZM538L1Cg_igZMdFa_';
  var sb = null;
  var app = {
    currentTab: 'dashboard',
    produtos: [],
    cupons: [],
    afiliados: [],
    vendas: [],
    init: function(){
      if(!window.supabase || !window.supabase.createClient){ console.error('Supabase SDK não carregado'); return; }
      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      this._bindTabs(); this._bindLogout(); this._bindForms();
      this.openTab('dashboard');
    },
    openTab: function(tab){
      document.querySelectorAll('.admin-section').forEach(function(el){ el.classList.remove('active'); });
      document.querySelectorAll('.admin-sidebar .nav-link').forEach(function(el){ el.classList.remove('active'); });
      var sec = document.getElementById('tab-' + tab);
      var btn = document.querySelector('[data-tab="' + tab + '"]');
      if(sec){ sec.classList.add('active'); }
      if(btn){ btn.classList.add('active'); }
      if(tab === 'dashboard'){ this.loadDashboard(); }
      else if(tab === 'produtos'){ this.loadProdutos(); }
      else if(tab === 'cupons'){ this.loadCupons(); this._carregarProdutosSelect(); }
      else if(tab === 'afiliados'){ this.loadAfiliados(); }
      else if(tab === 'vendas'){ this.loadVendas(); }
    },
    _bindTabs: function(){
      var self = this;
      document.querySelectorAll('.admin-sidebar .nav-link').forEach(function(btn){
        btn.addEventListener('click', function(){
          self.openTab(btn.getAttribute('data-tab'));
        });
      });
    },
    _bindLogout: function(){
      var btn = document.getElementById('adminBtnLogout');
      if(btn){ btn.addEventListener('click', function(e){ e.preventDefault(); Auth.logout().then(function(){ window.location.replace('login.html'); }); }); }
      Auth.getUser().then(function(user){
        var area = document.getElementById('adminUserName');
        var roleEl = document.getElementById('adminUserRole');
        if(area){ area.textContent = (user && user.name) ? user.name : (user && user.email) ? user.email : 'Usuário'; }
        if(roleEl){ roleEl.textContent = 'ADMIN'; }
        if(!user){ window.location.replace('login.html'); return; }
        var DONO_EMAIL = 'klzinnmta202010@gmail.com';
        var isDonoPorEmail = (user.email && user.email.toLowerCase() === DONO_EMAIL.toLowerCase());
        if(!isDonoPorEmail){
          alert('Acesso restrito ao dono do site (admin).');
          window.location.replace('index.html');
        }
      });
    },
    _bindForms: function(){
      var formP = document.getElementById('formProduto');
      if(formP){ formP.addEventListener('submit', function(e){ e.preventDefault(); app.salvarProduto(); }); }
      var formC = document.getElementById('formCupom');
      if(formC){ formC.addEventListener('submit', function(e){ e.preventDefault(); app.salvarCupom(); }); }
      var formA = document.getElementById('formAfiliado');
      if(formA){ formA.addEventListener('submit', function(e){ e.preventDefault(); app.salvarAfiliado(); }); }
    },
    _showFlash: function(id, tipo, msg){
      var el = document.getElementById(id);
      if(!el) return;
      el.textContent = msg; el.className = 'flash ' + tipo;
      setTimeout(function(){ el.style.display = 'none'; }, 5000);
    },
    _moeda: function(cents){ var v = (cents || 0) / 100; return 'R$ ' + v.toFixed(2).replace('.', ','); },
    _hideForms: function(){
      document.getElementById('produtoFormCard').style.display = 'none';
      document.getElementById('cupomFormCard').style.display = 'none';
      document.getElementById('afiliadoFormCard').style.display = 'none';
    },
    loadDashboard: function(){
      var self = this;
      Promise.all([
        sb.from('produtos').select('id, nome, ativo'),
        sb.from('cupons').select('id, codigo, ativo, usos_usados, usos_max'),
        sb.from('afiliados').select('id, total_vendas, total_comissao_centavos'),
        sb.from('vendas_afiliadas').select('*').order('criado_em', { ascending: false }).limit(5)
      ]).then(function(results){
        var rProdutos = results[0], rCupons = results[1], rAfiliados = results[2], rVendas = results[3];
        var nProdutos = (rProdutos.data || []).length;
        var nCupons = (rCupons.data || []).length;
        var nAfiliados = (rAfiliados.data || []).length;
        var totalComissao = (rAfiliados.data || []).reduce(function(s, a){ return s + (a.total_comissao_centavos || 0); }, 0);
        var stats = document.getElementById('dashboardStats');
        stats.innerHTML =
          '<div class="admin-stat"><div class="v">' + nProdutos + '</div><div class="l">Produtos</div></div>' +
          '<div class="admin-stat"><div class="v">' + nCupons + '</div><div class="l">Cupons</div></div>' +
          '<div class="admin-stat"><div class="v">' + nAfiliados + '</div><div class="l">Afiliados</div></div>' +
          '<div class="admin-stat"><div class="v">' + self._moeda(totalComissao) + '</div><div class="l">Total em comissões</div></div>';
        var lista = document.getElementById('dashboardVendas');
        var vendas = rVendas.data || [];
        if(!vendas.length){
          lista.innerHTML = '<div class="empty"><span class="ic">📭</span>Sem vendas registradas ainda.</div>';
          return;
        }
        var html = '<table class="admin-table"><thead><tr><th>Cliente</th><th>Afiliado</th><th>Produto</th><th>Valor</th><th>Status</th></tr></thead><tbody>';
        vendas.forEach(function(v){
          html += '<tr><td>' + (v.cliente_email || '') + '</td><td>' + (v.afiliado_codigo || '') + '</td><td>' + (v.produto_nome || '-') + '</td><td>' + self._moeda(v.valor_venda_centavos) + '</td><td><span class="badge ' + v.status + '">' + v.status + '</span></td></tr>';
        });
        html += '</tbody></table>';
        lista.innerHTML = html;
      }).catch(function(err){ console.error('Dashboard error:', err); });
    },
    loadProdutos: function(){
      var self = this;
      sb.from('produtos').select('*').order('criado_em', { ascending: false }).then(function(res){
        self.produtos = res.data || [];
        self.renderProdutos();
      }).catch(function(err){ console.error('Load produtos error:', err); });
    },
    renderProdutos: function(){
      var lista = document.getElementById('produtosLista');
      if(!app.produtos.length){ lista.innerHTML = '<div class="empty"><span class="ic">📦</span>Nenhum produto cadastrado.</div>'; return; }
      var html = '<table class="admin-table"><thead><tr><th>Nome</th><th>Preço</th><th>Promo</th><th>Ativo</th><th>Ações</th></tr></thead><tbody>';
      app.produtos.forEach(function(p){
        html += '<tr>' +
          '<td><strong>' + (p.nome || '-') + '</strong><br><small style="color:var(--text-muted)">' + (p.descricao || '') + '</small></td>' +
          '<td>' + app._moeda(p.preco_centavos) + '</td>' +
          '<td>' + (p.preco_promocional_centavos ? app._moeda(p.preco_promocional_centavos) : '—') + '</td>' +
          '<td><span class="badge ' + (p.ativo ? 'ativo' : 'inativo') + '">' + (p.ativo ? 'Ativo' : 'Inativo') + '</span></td>' +
          '<td>' +
          '<button class="btn btn-sm btn-ok" onclick="app.editarProduto(\'' + p.id + '\')">Editar</button> ' +
          '<button class="btn btn-sm btn-danger" onclick="app.excluirProduto(\'' + p.id + '\')">Excluir</button>' +
          '</td></tr>';
      });
      html += '</tbody></table>';
      lista.innerHTML = html;
    },
    editarProduto: function(id){
      this._hideForms();
      var card = document.getElementById('produtoFormCard');
      card.style.display = 'block';
      document.getElementById('produtoFormTitulo').textContent = id ? 'Editar produto' : 'Cadastrar produto';
      document.getElementById('btnExcluirProduto').style.display = id ? 'inline-block' : 'none';
      if(!id){
        document.getElementById('formProduto').reset();
        document.getElementById('produtoId').value = '';
        document.getElementById('produtoAtivo').checked = true;
        return;
      }
      var p = app.produtos.find(function(x){ return x.id === id; });
      if(!p) return;
      document.getElementById('produtoId').value = p.id;
      document.getElementById('produtoNome').value = p.nome || '';
      document.getElementById('produtoDescricao').value = p.descricao || '';
      document.getElementById('produtoPreco').value = (p.preco_centavos || 0) / 100;
      document.getElementById('produtoPrecoPromo').value = p.preco_promocional_centavos ? (p.preco_promocional_centavos / 100) : '';
      document.getElementById('produtoUrl').value = p.url_compra || '';
      document.getElementById('produtoAtivo').checked = p.ativo !== false;
      card.scrollIntoView({ behavior: 'smooth' });
    },
    cancelarProduto: function(){
      this._hideForms();
      document.getElementById('formProduto').reset();
      document.getElementById('produtoId').value = '';
    },
    salvarProduto: function(){
      var id = document.getElementById('produtoId').value;
      var nome = document.getElementById('produtoNome').value.trim();
      var descricao = document.getElementById('produtoDescricao').value.trim();
      var preco = parseInt(document.getElementById('produtoPreco').value) || 0;
      var promo = document.getElementById('produtoPrecoPromo').value;
      var url = document.getElementById('produtoUrl').value.trim();
      var ativo = document.getElementById('produtoAtivo').checked;
      if(!nome){ this._showFlash('produtoFlash', 'err', 'Informe o nome do produto.'); return; }
      var payload = { nome: nome, descricao: descricao, preco_centavos: preco, url_compra: url, ativo: ativo, atualizado_em: new Date().toISOString() };
      if(promo){ payload.preco_promocional_centavos = parseInt(promo) || null; } else { payload.preco_promocional_centavos = null; }
      var promise = id ? sb.from('produtos').update(payload).eq('id', id) : sb.from('produtos').insert(payload);
      var self = this;
      promise.then(function(res){
        if(res.error) throw res.error;
        self.cancelarProduto();
        self.loadProdutos();
      }).catch(function(err){ console.error('Salvar produto error:', err); self._showFlash('produtoFlash', 'err', 'Erro ao salvar produto.'); });
    },
    excluirProduto: function(id){
      var self = this;
      if(!confirm('Excluir este produto?')) return;
      sb.from('produtos').delete().eq('id', id).then(function(res){
        if(res.error) throw res.error;
        self.loadProdutos();
      }).catch(function(err){ console.error('Excluir produto error:', err); self._showFlash('produtoFlash', 'err', 'Erro ao excluir produto.'); });
    },

  };
  window.AdminApp = app;

      if(!window.supabase || !window.supabase.createClient){ console.error('Supabase SDK não carregado'); return; }
      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      this._bindTabs(); this._bindLogout(); this._bindForms();
      this.openTab('dashboard');
    },
    openTab: function(tab){
      app.currentTab = tab;
      document.querySelectorAll('.admin-section').forEach(function(el){ el.classList.remove('active'); });
      document.querySelectorAll('.admin-sidebar .nav-link').forEach(function(el){ el.classList.remove('active'); });
      var sec = document.getElementById('tab-' + tab);
      var btn = document.querySelector('[data-tab="' + tab + '"]');
      if(sec){ sec.classList.add('active'); }
      if(btn){ btn.classList.add('active'); }
      if(tab === 'dashboard'){ this.loadDashboard(); }
      else if(tab === 'produtos'){ this.loadProdutos(); }
      else if(tab === 'cupons'){ this.loadCupons(); this._carregarProdutosSelect(); }
      else if(tab === 'afiliados'){ this.loadAfiliados(); }
      else if(tab === 'vendas'){ this.loadVendas(); }
    },
    _bindTabs: function(){
      document.querySelectorAll('.admin-sidebar .nav-link').forEach(function(btn){
        btn.addEventListener('click', function(){
          app.openTab(btn.getAttribute('data-tab'));
        });
      });
    },
    _bindLogout: function(){
      var btn = document.getElementById('adminBtnLogout');
      if(btn){ btn.addEventListener('click', function(e){ e.preventDefault(); Auth.logout().then(function(){ window.location.replace('login.html'); }); }); }
      Auth.getUser().then(function(user){
        var area = document.getElementById('adminUserName');
        var roleEl = document.getElementById('adminUserRole');
        if(area){ area.textContent = (user && user.name) ? user.name : (user && user.email) ? user.email : 'Usuário'; }
        if(roleEl){ roleEl.textContent = 'ADMIN'; }
        if(!user){ window.location.replace('login.html'); return; }
        // Libera acesso pelo e-mail do dono (não depende da tabela profiles)
        var DONO_EMAIL = 'klzinnmta202010@gmail.com';
        var isDonoPorEmail = (user.email && user.email.toLowerCase() === DONO_EMAIL.toLowerCase());
        if(!isDonoPorEmail){
          alert('Acesso restrito ao dono do site (admin).');
          window.location.replace('index.html');
        }
      });
    },
    _bindForms: function(){
      var formP = document.getElementById('formProduto');
      if(formP){ formP.addEventListener('submit', function(e){ e.preventDefault(); app.salvarProduto(); }); }
      var formC = document.getElementById('formCupom');
      if(formC){ formC.addEventListener('submit', function(e){ e.preventDefault(); app.salvarCupom(); }); }
      var formA = document.getElementById('formAfiliado');
      if(formA){ formA.addEventListener('submit', function(e){ e.preventDefault(); app.salvarAfiliado(); }); }
    },
    _showFlash: function(id, tipo, msg){
      var el = document.getElementById(id);
      if(!el) return;
      el.textContent = msg; el.className = 'flash ' + tipo;
      setTimeout(function(){ el.style.display = 'none'; }, 5000);
    },
    _moeda: function(cents){ var v = (cents || 0) / 100; return 'R$ ' + v.toFixed(2).replace('.', ','); },
    _hideForms: function(){
      document.getElementById('produtoFormCard').style.display = 'none';
      document.getElementById('cupomFormCard').style.display = 'none';
      document.getElementById('afiliadoFormCard').style.display = 'none';
    },
    loadDashboard: function(){
      Promise.all([
        sb.from('produtos').select('id, nome, ativo'),
        sb.from('cupons').select('id, codigo, ativo, usos_usados, usos_max'),
        sb.from('afiliados').select('id, total_vendas, total_comissao_centavos'),
        sb.from('vendas_afiliadas').select('*').order('criado_em', { ascending: false }).limit(5)
      ]).then(function(results){
        var rProdutos = results[0], rCupons = results[1], rAfiliados = results[2], rVendas = results[3];
        var nProdutos = (rProdutos.data || []).length;
        var nCupons = (rCupons.data || []).length;
        var nAfiliados = (rAfiliados.data || []).length;
        var totalComissao = (rAfiliados.data || []).reduce(function(s, a){ return s + (a.total_comissao_centavos || 0); }, 0);
        var stats = document.getElementById('dashboardStats');
        stats.innerHTML =
          '<div class="admin-stat"><div class="v">' + nProdutos + '</div><div class="l">Produtos</div></div>' +
          '<div class="admin-stat"><div class="v">' + nCupons + '</div><div class="l">Cupons</div></div>' +
          '<div class="admin-stat"><div class="v">' + nAfiliados + '</div><div class="l">Afiliados</div></div>' +
          '<div class="admin-stat"><div class="v">' + this._moeda(totalComissao) + '</div><div class="l">Total em comissões</div></div>';
        var lista = document.getElementById('dashboardVendas');
        var vendas = rVendas.data || [];
        if(!vendas.length){
          lista.innerHTML = '<div class="empty"><span class="ic">📭</span>Sem vendas registradas ainda.</div>';
          return;
        }
        var html = '<table class="admin-table"><thead><tr><th>Cliente</th><th>Afiliado</th><th>Produto</th><th>Valor</th><th>Status</th></tr></thead><tbody>';
        vendas.forEach(function(v){
          html += '<tr><td>' + (v.cliente_email || '') + '</td><td>' + (v.afiliado_codigo || '') + '</td><td>' + (v.produto_nome || '-') + '</td><td>' + app._moeda(v.valor_venda_centavos) + '</td><td><span class="badge ' + v.status + '">' + v.status + '</span></td></tr>';
        });
        html += '</tbody></table>';
        lista.innerHTML = html;
      }).catch(function(err){ console.error('Dashboard error:', err); app._showFlash('dashboardFlash', 'err', 'Erro ao carregar dashboard.'); });
    },
    loadProdutos: function(){
      sb.from('produtos').select('*').order('criado_em', { ascending: false }).then(function(res){
        app.produtos = res.data || [];
        app.renderProdutos();
      }).catch(function(err){ console.error('Load produtos error:', err); });
    },
    renderProdutos: function(){
      var lista = document.getElementById('produtosLista');
      if(!app.produtos.length){ lista.innerHTML = '<div class="empty"><span class="ic">📦</span>Nenhum produto cadastrado.</div>'; return; }
      var html = '<table class="admin-table"><thead><tr><th>Nome</th><th>Preço</th><th>Promo</th><th>Ativo</th><th>Ações</th></tr></thead><tbody>';
      app.produtos.forEach(function(p){
        html += '<tr>' +
          '<td><strong>' + (p.nome || '-') + '</strong><br><small style="color:var(--text-muted)">' + (p.descricao || '') + '</small></td>' +
          '<td>' + app._moeda(p.preco_centavos) + '</td>' +
          '<td>' + (p.preco_promocional_centavos ? app._moeda(p.preco_promocional_centavos) : '—') + '</td>' +
          '<td><span class="badge ' + (p.ativo ? 'ativo' : 'inativo') + '">' + (p.ativo ? 'Ativo' : 'Inativo') + '</span></td>' +
          '<td>' +
          '<button class="btn btn-sm btn-ok" onclick="app.editarProduto(\'' + p.id + '\')">Editar</button> ' +
          '<button class="btn btn-sm btn-danger" onclick="app.excluirProduto(\'' + p.id + '\')">Excluir</button>' +
          '</td></tr>';
      });
      html += '</tbody></table>';
      lista.innerHTML = html;
    },
    editarProduto: function(id){
      app._hideForms();
      var card = document.getElementById('produtoFormCard');
      card.style.display = 'block';
      document.getElementById('produtoFormTitulo').textContent = id ? 'Editar produto' : 'Cadastrar produto';
      document.getElementById('btnExcluirProduto').style.display = id ? 'inline-block' : 'none';
      if(!id){
        document.getElementById('formProduto').reset();
        document.getElementById('produtoId').value = '';
        document.getElementById('produtoAtivo').checked = true;
        return;
      }
      var p = app.produtos.find(function(x){ return x.id === id; });
      if(!p) return;
      document.getElementById('produtoId').value = p.id;
      document.getElementById('produtoNome').value = p.nome || '';
      document.getElementById('produtoDescricao').value = p.descricao || '';
      document.getElementById('produtoPreco').value = (p.preco_centavos || 0) / 100;
      document.getElementById('produtoPrecoPromo').value = p.preco_promocional_centavos ? (p.preco_promocional_centavos / 100) : '';
      document.getElementById('produtoUrl').value = p.url_compra || '';
      document.getElementById('produtoAtivo').checked = p.ativo !== false;
      card.scrollIntoView({ behavior: 'smooth' });
    },
    cancelarProduto: function(){
      app._hideForms();
      document.getElementById('formProduto').reset();
      document.getElementById('produtoId').value = '';
    },
    salvarProduto: function(){
      var id = document.getElementById('produtoId').value;
      var nome = document.getElementById('produtoNome').value.trim();
      var descricao = document.getElementById('produtoDescricao').value.trim();
      var preco = parseInt(document.getElementById('produtoPreco').value) || 0;
      var promo = document.getElementById('produtoPrecoPromo').value;
      var url = document.getElementById('produtoUrl').value.trim();
      var ativo = document.getElementById('produtoAtivo').checked;
      if(!nome){ app._showFlash('produtoFlash', 'err', 'Informe o nome do produto.'); return; }
      var payload = { nome: nome, descricao: descricao, preco_centavos: preco, url_compra: url, ativo: ativo, atualizado_em: new Date().toISOString() };
      if(promo){ payload.preco_promocional_centavos = parseInt(promo) || null; } else { payload.preco_promocional_centavos = null; }
      var promise = id ? sb.from('produtos').update(payload).eq('id', id) : sb.from('produtos').insert(payload);
      promise.then(function(res){
        if(res.error) throw res.error;
        app.cancelarProduto();
        app.loadProdutos();
      }).catch(function(err){ console.error('Salvar produto error:', err); app._showFlash('produtoFlash', 'err', 'Erro ao salvar produto.'); });
    },
    excluirProduto: function(id){
      if(!confirm('Excluir este produto?')) return;
      sb.from('produtos').delete().eq('id', id).then(function(res){
        if(res.error) throw res.error;
        app.loadProdutos();
      }).catch(function(err){ console.error('Excluir produto error:', err); app._showFlash('produtoFlash', 'err', 'Erro ao excluir produto.'); });
    },

    loadCupons: function(){
      sb.from('cupons').select('*, produtos(nome)').order('criado_em', { ascending: false }).then(function(res){
        app.cupons = res.data || [];
        app.renderCupons();
      }).catch(function(err){ console.error('Load cupons error:', err); });
    },
    _carregarProdutosSelect: function(){
      var select = document.getElementById('cupomProduto');
      if(!select) return;
      var html = '<option value="">Todos os produtos</option>';
      app.produtos.forEach(function(p){ html += '<option value="' + p.id + '">' + (p.nome || '-') + '</option>'; });
      select.innerHTML = html;
    },
    renderCupons: function(){
      var lista = document.getElementById('cuponsLista');
      if(!app.cupons.length){ lista.innerHTML = '<div class="empty"><span class="ic">🎟️</span>Nenhum cupom cadastrado.</div>'; return; }
      var html = '<table class="admin-table"><thead><tr><th>Código</th><th>Tipo</th><th>Valor</th><th>Produto</th><th>Usos</th><th>Ativo</th><th>Ações</th></tr></thead><tbody>';
      app.cupons.forEach(function(c){
        var expirou = c.data_expiracao && new Date(c.data_expiracao) < new Date();
        var esgotou = c.usos_max && c.usos_usados >= c.usos_max;
        var ativo = c.ativo && !expirou && !esgotou;
        html += '<tr>' +
          '<td><strong>' + (c.codigo || '-') + '</strong></td>' +
          '<td>' + (c.tipo === 'percentual' ? 'Percentual' : 'Fixo') + '</td>' +
          '<td>' + (c.tipo === 'percentual' ? (c.valor + '%') : app._moeda(c.valor * 100)) + '</td>' +
          '<td>' + ((c.produtos && c.produtos.nome) || 'Todos') + '</td>' +
          '<td>' + c.usos_usados + (c.usos_max ? '/' + c.usos_max : '') + '</td>' +
          '<td><span class="badge ' + (ativo ? 'ativo' : 'inativo') + '">' + (ativo ? 'Ativo' : 'Inativo') + '</span></td>' +
          '<td>' +
          '<button class="btn btn-sm btn-ok" onclick="app.editarCupom(\'' + c.id + '\')">Editar</button> ' +
          '<button class="btn btn-sm btn-danger" onclick="app.excluirCupom(\'' + c.id + '\')">Excluir</button>' +
          '</td></tr>';
      });
      html += '</tbody></table>';
      lista.innerHTML = html;
    },
    editarCupom: function(id){
      app._hideForms();
      var card = document.getElementById('cupomFormCard');
      card.style.display = 'block';
      document.getElementById('cupomFormTitulo').textContent = id ? 'Editar cupom' : 'Criar cupom';
      document.getElementById('btnExcluirCupom').style.display = id ? 'inline-block' : 'none';
      if(!id){
        document.getElementById('formCupom').reset();
        document.getElementById('cupomId').value = '';
        document.getElementById('cupomTipo').value = 'percentual';
        document.getElementById('cupomAtivo').checked = true;
        return;
      }
      var c = app.cupons.find(function(x){ return x.id === id; });
      if(!c) return;
      document.getElementById('cupomId').value = c.id;
      document.getElementById('cupomCodigo').value = c.codigo || '';
      document.getElementById('cupomTipo').value = c.tipo || 'percentual';
      document.getElementById('cupomValor').value = c.valor || '';
      document.getElementById('cupomProduto').value = c.produto_id || '';
      document.getElementById('cupomExpiracao').value = c.data_expiracao ? c.data_expiracao.slice(0, 16) : '';
      document.getElementById('cupomUsosMax').value = c.usos_max || '';
      document.getElementById('cupomAtivo').checked = c.ativo !== false;
      card.scrollIntoView({ behavior: 'smooth' });
    },
    cancelarCupom: function(){
      app._hideForms();
      document.getElementById('formCupom').reset();
      document.getElementById('cupomId').value = '';
    },
    salvarCupom: function(){
      var id = document.getElementById('cupomId').value;
      var codigo = document.getElementById('cupomCodigo').value.trim();
      var tipo = document.getElementById('cupomTipo').value;
      var valor = parseFloat(document.getElementById('cupomValor').value) || 0;
      var produto_id = document.getElementById('cupomProduto').value || null;
      var expiracao = document.getElementById('cupomExpiracao').value || null;
      var usos_max = document.getElementById('cupomUsosMax').value || null;
      var ativo = document.getElementById('cupomAtivo').checked;
      if(!codigo){ app._showFlash('cupomFlash', 'err', 'Informe o código do cupom.'); return; }
      if(valor <= 0){ app._showFlash('cupomFlash', 'err', 'Informe um valor válido.'); return; }
      var payload = { codigo: codigo, tipo: tipo, valor: valor, produto_id: produto_id, data_expiracao: expiracao, usos_max: usos_max ? parseInt(usos_max) : null, ativo: ativo, atualizado_em: new Date().toISOString() };
      var promise = id ? sb.from('cupons').update(payload).eq('id', id) : sb.from('cupons').insert(payload);
      promise.then(function(res){
        if(res.error) throw res.error;
        app.cancelarCupom();
        app.loadCupons();
      }).catch(function(err){ console.error('Salvar cupom error:', err); app._showFlash('cupomFlash', 'err', 'Erro ao salvar cupom.'); });
    },
    excluirCupom: function(id){
      if(!confirm('Excluir este cupom?')) return;
      sb.from('cupons').delete().eq('id', id).then(function(res){
        if(res.error) throw res.error;
        app.loadCupons();
      }).catch(function(err){ console.error('Excluir cupom error:', err); app._showFlash('cupomFlash', 'err', 'Erro ao excluir cupom.'); });
    },

    loadAfiliados: function(){
      sb.from('afiliados').select('*, profiles(nome, email)').order('criado_em', { ascending: false }).then(function(res){
        app.afiliados = res.data || [];
        app.renderAfiliados();
      }).catch(function(err){ console.error('Load afiliados error:', err); });
    },
    renderAfiliados: function(){
      var lista = document.getElementById('afiliadosLista');
      if(!app.afiliados.length){ lista.innerHTML = '<div class="empty"><span class="ic">🤝</span>Nenhum afiliado cadastrado.</div>'; return; }
      var html = '<table class="admin-table"><thead><tr><th>Nome</th><th>E-mail</th><th>Código</th><th>Comissão</th><th>Vendas</th><th>Total comissão</th><th>Ativo</th><th>Ações</th></tr></thead><tbody>';
      app.afiliados.forEach(function(a){
        var prof = a.profiles || {};
        html += '<tr>' +
          '<td><strong>' + (prof.nome || '-') + '</strong></td>' +
          '<td>' + (prof.email || '-') + '</td>' +
          '<td>' + (a.codigo_afiliado || '-') + '</td>' +
          '<td>' + (a.comissao_percentual || 0) + '%</td>' +
          '<td>' + (a.total_vendas || 0) + '</td>' +
          '<td>' + app._moeda(a.total_comissao_centavos || 0) + '</td>' +
          '<td><span class="badge ' + (a.ativo ? 'ativo' : 'inativo') + '">' + (a.ativo ? 'Ativo' : 'Inativo') + '</span></td>' +
          '<td>' +
          '<button class="btn btn-sm btn-ok" onclick="app.editarAfiliado(\'' + a.id + '\')">Editar</button> ' +
          '<button class="btn btn-sm btn-danger" onclick="app.excluirAfiliado(\'' + a.id + '\')">Excluir</button>' +
          '</td></tr>';
      });
      html += '</tbody></table>';
      lista.innerHTML = html;
    },
    editarAfiliado: function(id){
      app._hideForms();
      var card = document.getElementById('afiliadoFormCard');
      card.style.display = 'block';
      document.getElementById('afiliadoFormTitulo').textContent = id ? 'Editar afiliado' : 'Cadastrar afiliado';
      document.getElementById('btnExcluirAfiliado').style.display = id ? 'inline-block' : 'none';
      if(!id){
        document.getElementById('formAfiliado').reset();
        document.getElementById('afiliadoId').value = '';
        document.getElementById('afiliadoProfileId').value = '';
        document.getElementById('afiliadoAtivo').checked = true;
        document.getElementById('afiliadoComissao').value = '10';
        return;
      }
      var a = app.afiliados.find(function(x){ return x.id === id; });
      if(!a) return;
      var prof = a.profiles || {};
      document.getElementById('afiliadoId').value = a.id;
      document.getElementById('afiliadoProfileId').value = a.profile_id;
      document.getElementById('afiliadoNome').value = prof.nome || '';
      document.getElementById('afiliadoEmail').value = prof.email || '';
      document.getElementById('afiliadoCodigo').value = a.codigo_afiliado || '';
      document.getElementById('afiliadoComissao').value = a.comissao_percentual || 10;
      document.getElementById('afiliadoAtivo').checked = a.ativo !== false;
      card.scrollIntoView({ behavior: 'smooth' });
    },
    cancelarAfiliado: function(){
      app._hideForms();
      document.getElementById('formAfiliado').reset();
      document.getElementById('afiliadoId').value = '';
      document.getElementById('afiliadoProfileId').value = '';
    },
    salvarAfiliado: function(){
      var id = document.getElementById('afiliadoId').value;
      var profileId = document.getElementById('afiliadoProfileId').value;
      var nome = document.getElementById('afiliadoNome').value.trim();
      var email = document.getElementById('afiliadoEmail').value.trim();
      var codigo = document.getElementById('afiliadoCodigo').value.trim();
      var comissao = parseFloat(document.getElementById('afiliadoComissao').value) || 10;
      var ativo = document.getElementById('afiliadoAtivo').checked;
      if(!nome || !email || !codigo){ app._showFlash('afiliadoFlash', 'err', 'Preencha nome, e-mail e código.'); return; }
      if(!profileId){
        sb.from('profiles').select('id').eq('email', email).single().then(function(res){
          if(res.error || !res.data){
            app._showFlash('afiliadoFlash', 'err', 'Usuário com este e-mail não existe no sistema.');
            return;
          }
          app._salvarAfiliadoDados(res.data.id, nome, codigo, comissao, ativo);
        }).catch(function(){
          app._showFlash('afiliadoFlash', 'err', 'Usuário com este e-mail não encontrado.');
        });
      } else {
        app._salvarAfiliadoDados(profileId, nome, codigo, comissao, ativo);
      }
    },
    _salvarAfiliadoDados: function(profileId, nome, codigo, comissao, ativo){
      var id = document.getElementById('afiliadoId').value;
      var payload = { profile_id: profileId, codigo_afiliado: codigo, comissao_percentual: comissao, ativo: ativo, atualizado_em: new Date().toISOString() };
      var promise = id ? sb.from('afiliados').update(payload).eq('id', id) : sb.from('afiliados').insert(payload);
      promise.then(function(res){
        if(res.error) throw res.error;
        if(!id){
          sb.from('profiles').update({ role: 'afiliado' }).eq('id', profileId).then(function(){});
        }
        app.cancelarAfiliado();
        app.loadAfiliados();
      }).catch(function(err){ console.error('Salvar afiliado error:', err); app._showFlash('afiliadoFlash', 'err', 'Erro ao salvar afiliado.'); });
    },
    excluirAfiliado: function(id){
      if(!confirm('Excluir este afiliado?')) return;
      sb.from('afiliados').delete().eq('id', id).then(function(res){
        if(res.error) throw res.error;
        app.loadAfiliados();
      }).catch(function(err){ console.error('Excluir afiliado error:', err); app._showFlash('afiliadoFlash', 'err', 'Erro ao excluir afiliado.'); });
    },

    loadVendas: function(){
      sb.from('vendas_afiliadas').select('*, afiliados(codigo_afiliado)').order('criado_em', { ascending: false }).then(function(res){
        app.vendas = res.data || [];
        app.renderVendas();
      }).catch(function(err){ console.error('Load vendas error:', err); });
    },
    renderVendas: function(){
      var lista = document.getElementById('vendasLista');
      if(!app.vendas.length){ lista.innerHTML = '<div class="empty"><span class="ic">📭</span>Nenhuma venda registrada.</div>'; return; }
      var html = '<table class="admin-table"><thead><tr><th>Cliente</th><th>Afiliado</th><th>Produto</th><th>Valor</th><th>Comissão</th><th>Status</th><th>Data</th></tr></thead><tbody>';
      app.vendas.forEach(function(v){
        html += '<tr>' +
          '<td>' + (v.cliente_email || '-') + '</td>' +
          '<td>' + ((v.afiliados && v.afiliados.codigo_afiliado) || '-') + '</td>' +
          '<td>' + (v.produto_nome || '-') + '</td>' +
          '<td>' + app._moeda(v.valor_venda_centavos) + '</td>' +
          '<td>' + app._moeda(v.comissao_centavos) + '</td>' +
          '<td><span class="badge ' + v.status + '">' + v.status + '</span></td>' +
          '<td>' + (v.criado_em ? new Date(v.criado_em).toLocaleString('pt-BR') : '-') + '</td>' +
          '</tr>';
      });
      html += '</tbody></table>';
      lista.innerHTML = html;
    }
  };
  window.AdminApp = app;
})();

