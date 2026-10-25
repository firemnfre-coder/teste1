"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const categories = [
  "Todas",
  "Medicamentos",
  "Higiene Pessoal",
  "Beleza",
  "Vitaminas e Suplementos",
  "Bebê e Infantil",
  "Saúde e Bem-estar",
];

const demoProducts = [
  { id: "demo-1", nome: "Paracetamol 750mg", descricao: "Analgésico e antitérmico", preco: 12.9, estoque: 20, categoria: "Medicamentos", imagem: "", ativo: true },
  { id: "demo-2", nome: "Álcool em Gel 70%", descricao: "Higienização para o dia a dia", preco: 8.5, estoque: 15, categoria: "Higiene Pessoal", imagem: "", ativo: true },
  { id: "demo-3", nome: "Vitamina C", descricao: "Suplemento alimentar", preco: 19.9, estoque: 10, categoria: "Vitaminas e Suplementos", imagem: "", ativo: true },
  { id: "demo-4", nome: "Sabonete", descricao: "Limpeza suave para a pele", preco: 4.99, estoque: 25, categoria: "Beleza", imagem: "", ativo: true },
  { id: "demo-5", nome: "Termômetro digital", descricao: "Para acompanhar a temperatura", preco: 24.9, estoque: 8, categoria: "Saúde e Bem-estar", imagem: "", ativo: true },
  { id: "demo-6", nome: "Lenços umedecidos", descricao: "Praticidade para o cuidado infantil", preco: 11.5, estoque: 12, categoria: "Bebê e Infantil", imagem: "", ativo: true },
];

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Home() {
  const [products, setProducts] = useState(demoProducts);
  const [category, setCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [notice, setNotice] = useState("");
  const [source, setSource] = useState("demo");

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    let alive = true;
    async function loadProducts() {
      try {
        const supabase = createClient(url, key);
        const { data, error } = await supabase
          .from("products")
.select("id,name,description,price,stock,category,image_url,active,created_at")
.eq("active", true)
.order("created_at", { ascending: false });
        if (error) throw error;
        if (alive && Array.isArray(data) && data.length > 0) {
          setProducts(data);
          setSource("supabase");
        } else if (alive && Array.isArray(data) && data.length === 0) {
          setProducts([]);
          setSource("supabase");
        }
      } catch (error) {
        console.error("Não foi possível carregar os produtos do Supabase:", error);
        if (alive) setNotice("Estamos exibindo produtos de demonstração. O catálogo online ainda não foi conectado.");
      }
    }
    loadProducts();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("pt-BR");
    return products.filter((p) => {
      const matchesCategory = category === "Todas" || p.categoria === category;
      const matchesSearch = !q || `${p.nome || ""} ${p.descricao || ""} ${p.categoria || ""}`.toLocaleLowerCase("pt-BR").includes(q);
      return matchesCategory && matchesSearch && p.ativo !== false;
    });
  }, [products, category, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantidade, 0);
  const total = cart.reduce((sum, item) => sum + Number(item.preco || 0) * item.quantidade, 0);

  function addToCart(product) {
    if (Number(product.estoque || 0) <= 0) {
      setNotice("Este produto está sem estoque no momento.");
      return;
    }
    setCart((current) => {
      const found = current.find((item) => String(item.id) === String(product.id));
      if (found) {
        if (found.quantidade >= Number(product.estoque || 0)) {
          setNotice("Você já adicionou todo o estoque disponível deste produto.");
          return current;
        }
        return current.map((item) => String(item.id) === String(product.id) ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...current, { ...product, quantidade: 1 }];
    });
    setNotice(`${product.nome} adicionado ao carrinho.`);
  }

  function changeQuantity(id, delta) {
    setCart((current) => current
      .map((item) => String(item.id) === String(id) ? { ...item, quantidade: Math.max(0, Math.min(Number(item.estoque || 0), item.quantidade + delta)) } : item)
      .filter((item) => item.quantidade > 0));
  }

  return (
    <main>
      <div className="topbar">Entrega no bairro • Consulte disponibilidade e condições</div>
      <header className="header">
        <a className="brand" href="#" aria-label="Drogaria Paulinho Farma início">
          <span className="brand-cross">✚</span>
          <span><strong>DROGARIA</strong><b>PAULINHO FARMA</b><small>A mais popular do bairro</small></span>
        </a>
        <div className="header-tag">Qualidade tem nome!</div>
        <a className="cart-link" href="#carrinho">🛒 Carrinho <span>{cartCount}</span></a>
      </header>

      <section className="promo-banner" aria-label="Banner promocional Paulinho Farma">
        <img src="/paulinho-farma-banner.png" alt="Paulinho Farma — entrega rápida, ofertas especiais e cuidado para sua família" />
      </section>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">CUIDADO PERTO DE VOCÊ</span>
          <h1>Sua saúde e bem-estar <em>em primeiro lugar.</em></h1>
          <p>Encontre itens de cuidado diário e consulte nosso catálogo de produtos.</p>
          <a className="primary-btn" href="#produtos">Ver produtos <span>→</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-circle"></div>
          <div className="medical-card"><span className="large-cross">✚</span><strong>PAULINHO<br/>FARMA</strong><small>QUALIDADE TEM NOME</small></div>
          <div className="art-pill pill-one"></div><div className="art-pill pill-two"></div>
        </div>
      </section>

      <section className="benefits">
        <div><span>✚</span><p><strong>Cuidado de confiança</strong><small>Atendimento próximo de você</small></p></div>
        <div><span>♡</span><p><strong>Bem-estar diário</strong><small>Produtos para sua rotina</small></p></div>
        <div><span>✓</span><p><strong>Catálogo atualizado</strong><small>Consulte produtos disponíveis</small></p></div>
      </section>

      <section className="catalog" id="produtos">
        <div className="section-heading">
          <div><span className="eyebrow">NOSSO CATÁLOGO</span><h2>Produtos em destaque</h2><p>Pesquise e escolha os itens que procura.</p></div>
          <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produto..." aria-label="Buscar produto"/></label>
        </div>
        <div className="categories" aria-label="Categorias">
          {categories.map((item) => <button key={item} className={category === item ? "category active" : "category"} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Fechar aviso">×</button></div>}
        {source === "demo" && <p className="demo-note">Catálogo de demonstração — conecte o Supabase para mostrar seus produtos reais.</p>}
        <div className="product-grid">
          {filtered.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                {product.imagem ? <img src={product.imagem} alt={product.nome} /> : <div className="product-placeholder"><span>✚</span><small>PAULINHO FARMA</small></div>}
                {Number(product.estoque || 0) <= 0 && <span className="out-stock">Indisponível</span>}
              </div>
              <div className="product-info">
                <span className="product-category">{product.categoria || "Cuidados"}</span>
                <h3>{product.nome}</h3>
                <p>{product.descricao || "Consulte informações na loja."}</p>
                <div className="product-bottom"><strong>{money(product.preco)}</strong><button disabled={Number(product.estoque || 0) <= 0} onClick={() => addToCart(product)} aria-label={`Adicionar ${product.nome} ao carrinho`}>+</button></div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty"><span>⌕</span><h3>Nenhum produto encontrado</h3><p>Tente outra busca ou escolha uma categoria diferente.</p><button onClick={() => { setSearch(""); setCategory("Todas"); }}>Limpar filtros</button></div>}
      </section>

      <section className="cart-section" id="carrinho">
        <div className="cart-heading"><div><span className="eyebrow">SEUS ITENS</span><h2>Seu carrinho</h2></div><span className="cart-count">{cartCount} {cartCount === 1 ? "item" : "itens"}</span></div>
        {cart.length === 0 ? <div className="cart-empty">Seu carrinho está vazio. Adicione produtos do catálogo acima.</div> : <>
          <div className="cart-items">
            {cart.map((item) => <div className="cart-item" key={item.id}><div className="mini-product">✚</div><div className="cart-item-name"><strong>{item.nome}</strong><small>{money(item.preco)} cada</small></div><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Diminuir quantidade">−</button><span>{item.quantidade}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar quantidade">+</button></div><strong className="line-total">{money(Number(item.preco || 0) * item.quantidade)}</strong></div>)}
          </div>
          <div className="cart-total"><span>Total estimado</span><strong>{money(total)}</strong></div>
          <p className="checkout-note">Esta versão é demonstrativa: o pedido ainda não é enviado à farmácia e não processa pagamentos.</p>
        </>}
      </section>

      <footer className="footer"><div className="footer-brand"><span className="brand-cross">✚</span><strong>DROGARIA PAULINHO FARMA</strong></div><p>A mais popular do bairro — Qualidade tem nome!</p><small>Consulte a loja sobre disponibilidade, entrega e orientações de uso.</small><small className="copyright">© {new Date().getFullYear()} Drogaria Paulinho Farma</small></footer>
    </main>
  );
}
