import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroImg from "@/assets/festa-hero.jpg";
import { registrarParticipante, sortearPrato, type Participante, type Prato } from "@/lib/pratos";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arraiá 2026 — A Festa Julina mais animada do ano" },
      { name: "description", content: "Comidas típicas, quadrilha, forró e fogueira. Garanta seu ingresso para o maior arraiá do ano." },
    ],
  }),
  component: Index,
});

const EVENT_DATE = new Date("2026-07-12T19:00:00-03:00");
const EVENT_LOCATION = "Rua Riacho de Santana, nº 38, Rio de Janeiro";
const MAPS_LINK = "https://maps.app.goo.gl/m1ogDMYoCCHN52km6";
const MAPS_QUERY = encodeURIComponent(EVENT_LOCATION);

type TicketType = "individual" | "casal";
type PaymentStatus = "idle" | "pending" | "approved" | "failed";

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Bunting />
      <Hero />
      <EventInfo />
      <Countdown />
      <ComoFunciona />
      <SobreIngresso />
      <Tickets />
      <MapSection />
      <FAQ />
    </div>
  );
}


function Bunting() {
  return (
    <div className="sticky top-0 z-40 h-3 bunting shadow-md" aria-hidden />
  );
}

function Hero() {
  return (
    <header className="relative isolate overflow-hidden">
      <img
        src={heroImg}
        alt="Festa Julina com bandeirinhas e fogueira"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-32 sm:pt-32 sm:pb-40 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/30">
          🔥 12 de Julho de 2026 · Rio de Janeiro
        </span>
        <h1 className="mt-6 font-display text-5xl sm:text-7xl md:text-8xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          Arraiá <span className="text-corn">dos Amigos</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-white/90 font-body">
          Quadrilha, forró pé-de-serra, comidas típicas, fogueira e a melhor
          companhia. Vem cair no arrasta-pé com a gente! 🎶
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#ingressos" className="rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-[var(--shadow-warm)] transition hover:scale-105 hover:-translate-y-0.5">
            Garantir ingresso
          </a>
          <a href="#info" className="rounded-full bg-white/15 backdrop-blur px-8 py-4 font-bold text-white ring-1 ring-white/30 transition hover:bg-white/25">
            Ver detalhes
          </a>
        </div>
      </div>
      <Bunting />
    </header>
  );
}

function EventInfo() {
  const items = [
    { icon: "📅", label: "Data", value: "12 de Julho, 2026" },
    { icon: "⏰", label: "Horário", value: "A partir das 19h00" },
    { icon: "📍", label: "Local", value: "Rua Riacho de Santana, 38 — Rio de Janeiro" },
  ];
  return (
    <section id="info" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)] ring-1 ring-border transition hover:-translate-y-1">
            <div className="text-4xl">{it.icon}</div>
            <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{it.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{it.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function Countdown() {
  const { d, h, m, s } = useCountdown(EVENT_DATE);
  const cells = [
    { label: "Dias", value: d },
    { label: "Horas", value: h },
    { label: "Min", value: m },
    { label: "Seg", value: s },
  ];
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-3xl p-1" style={{ background: "var(--gradient-warm)" }}>
        <div className="rounded-[calc(1.5rem-0.25rem)] bg-background/95 backdrop-blur p-8 sm:p-12 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-black">Contagem regressiva</h2>
          <p className="mt-2 text-muted-foreground">Falta pouco pro arrasta-pé começar!</p>
          <div className="mt-8 grid grid-cols-4 gap-3 sm:gap-6">
            {cells.map((c) => (
              <div key={c.label} className="rounded-2xl bg-card p-4 sm:p-6 shadow-[var(--shadow-card)] ring-1 ring-border">
                <div className="font-display text-4xl sm:text-6xl font-black tabular-nums text-primary">
                  {String(c.value).padStart(2, "0")}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Tickets() {
  const [openType, setOpenType] = useState<TicketType | null>(null);
  const tickets = [
    { type: "individual" as const, title: "Individual", price: "R$ 75,00", desc: "Acesso completo à festa, área de shows e brincadeiras.", emoji: "🎟️" },
    { type: "casal" as const, title: "Casal", price: "R$ 100,00", desc: "Dois acessos com desconto especial e brinde surpresa.", emoji: "💞" },
  ];
  return (
    <section id="ingressos" className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Ingressos</p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl font-black">Garanta o seu lugar 🎪</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Escolha a modalidade e reserve agora. Vagas limitadas!</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {tickets.map((t) => (
          <TicketCard key={t.type} {...t} onBuy={() => setOpenType(t.type)} />
        ))}
      </div>
      {openType && <PurchaseModal ticketType={openType} onClose={() => setOpenType(null)} />}
    </section>
  );
}

function TicketCard({ title, price, desc, emoji, onBuy }: {
  title: string; price: string; desc: string; emoji: string; onBuy: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-card p-8 shadow-[var(--shadow-card)] ring-1 ring-border transition hover:-translate-y-2 hover:shadow-[var(--shadow-warm)]">
      <div className="absolute -right-6 -top-6 text-8xl opacity-10 transition group-hover:scale-110 group-hover:opacity-20">{emoji}</div>
      <div className="relative">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">{title}</p>
        <p className="mt-4 font-display text-5xl font-black text-primary">{price}</p>
        <p className="mt-3 text-muted-foreground">{desc}</p>
        <button
          onClick={onBuy}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
        >
          Comprar
        </button>
      </div>
    </div>
  );
}

function PurchaseModal({ ticketType, onClose }: { ticketType: TicketType; onClose: () => void }) {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "" });
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [groupLink, setGroupLink] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [prato, setPrato] = useState<Prato | null>(null);
  const [participante, setParticipante] = useState<Participante | null>(null);

  const valor = ticketType === "individual" ? 75 : 100;

  const valid = useMemo(() =>
    form.nome.trim().length >= 3 &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.telefone.replace(/\D/g, "").length >= 10,
    [form]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setStatus("pending");
    setErrorMsg(null);
    // Chamada preparada para API real de pagamento (o backend fará a verificação).
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tipo: ticketType, valor }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setPaymentId(data.id ?? data.paymentId ?? null);
      }
    } catch { /* backend opcional — segue com fluxo simulado */ }
  }

  // Confirmação de pagamento: consulta API se houver id; caso contrário simula aprovação.
  useEffect(() => {
    if (status !== "pending") return;
    let cancelled = false;

    if (!paymentId) {
      const t = setTimeout(() => { if (!cancelled) setStatus("approved"); }, 2000);
      return () => { cancelled = true; clearTimeout(t); };
    }

    const poll = async () => {
      try {
        const res = await fetch(`/api/status?id=${encodeURIComponent(paymentId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data.status === "approved" || data.approved === true) setStatus("approved");
      } catch { /* ignore */ }
    };
    const id = setInterval(poll, 3000);
    poll();
    return () => { cancelled = true; clearInterval(id); };
  }, [status, paymentId]);

  // Ao aprovar: sorteia prato, registra o participante e busca link do grupo.
  useEffect(() => {
    if (status !== "approved" || participante) return;
    const sorteado = sortearPrato();
    setPrato(sorteado);
    const p = registrarParticipante({
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      tipo: ticketType,
      valor,
      prato: sorteado,
    });
    setParticipante(p);

    (async () => {
      try {
        const res = await fetch(`/api/group${paymentId ? `?id=${encodeURIComponent(paymentId)}` : ""}`);
        if (!res.ok) return;
        const data = await res.json();
        setGroupLink(data.link ?? data.url ?? null);
      } catch { /* ignore */ }
    })();
  }, [status, participante, form, ticketType, valor, paymentId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-card p-6 sm:p-8 shadow-2xl ring-1 ring-border animate-in zoom-in-95 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
        >✕</button>

        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          Ingresso {ticketType === "individual" ? "Individual" : "Casal"}
        </p>
        <h3 className="mt-1 font-display text-3xl font-black">
          {status === "approved" ? "Tudo certo!" : "Seus dados"}
        </h3>

        {status === "approved" && prato && participante ? (
          <div className="mt-6 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.55_0.15_145)] px-5 py-2.5 font-bold text-white">
              ✅ Pagamento aprovado
            </div>
            <p className="text-muted-foreground">
              Obrigado por participar da nossa Festa Julina, <span className="font-semibold text-foreground">{participante.nome.split(" ")[0]}</span>!
            </p>

            <div className="rounded-2xl p-1" style={{ background: "var(--gradient-warm)" }}>
              <div className="rounded-[calc(1rem-0.25rem)] bg-background p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Seu prato sorteado é</p>
                <p className="mt-2 text-3xl">🎁</p>
                <p className="font-display text-2xl font-black text-primary">{prato.nome}</p>
                <p className="mt-1 text-xs text-muted-foreground capitalize">({prato.categoria})</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Não esqueça de levá-lo no dia da festa. Sua contribuição é muito importante para que todos possam aproveitar uma festa completa. 🎉
            </p>

            <div className="rounded-xl bg-muted/50 p-3 text-left text-xs text-muted-foreground">
              <p><span className="font-semibold text-foreground">Ingresso:</span> {ticketType === "individual" ? "Individual" : "Casal"}</p>
              <p><span className="font-semibold text-foreground">Valor:</span> R$ {valor},00</p>
            </div>

            <a
              href={groupLink ?? "#"}
              onClick={(e) => { if (!groupLink) e.preventDefault(); }}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-bold text-white shadow-lg transition ${groupLink ? "bg-[oklch(0.6_0.18_150)] hover:brightness-110" : "bg-muted-foreground/60 cursor-wait"}`}
            >
              💬 {groupLink ? "Entrar no Grupo do WhatsApp" : "Carregando link do grupo…"}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Nome completo" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} placeholder="Maria da Silva" />
            <Field label="Telefone" value={form.telefone} onChange={(v) => setForm({ ...form, telefone: v })} placeholder="(11) 99999-9999" type="tel" />
            <Field label="E-mail" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="voce@email.com" type="email" />

            {status === "pending" && (
              <p className="text-sm text-muted-foreground text-center">⏳ Aguardando confirmação do pagamento…</p>
            )}
            {status === "failed" && errorMsg && (
              <p className="text-sm text-destructive text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={!valid || status === "pending"}
              className="w-full rounded-full bg-primary px-6 py-4 font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "pending" ? "Processando…" : `Pagar R$ ${valor},00`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function ComoFunciona() {
  const passos = [
    { n: 1, t: "Escolha seu ingresso", d: "Individual ou Casal — o que fizer mais sentido para você.", icon: "🎟️" },
    { n: 2, t: "Realize o pagamento", d: "Rápido, seguro e 100% online.", icon: "💳" },
    { n: 3, t: "Receba um prato sorteado", d: "O sistema sorteia automaticamente um prato típico para você levar.", icon: "🍽️" },
    { n: 4, t: "Entre no grupo do WhatsApp", d: "Acompanhe as novidades e combinados da festa.", icon: "💬" },
    { n: 5, t: "Venha aproveitar!", d: "Quadrilha, forró, comidas típicas e muito xamego. 🔥", icon: "🎉" },
  ];
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Como funciona?</p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl font-black">É simples como pé-de-moleque 🥜</h2>
      </div>
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {passos.map((p) => (
          <li key={p.n} className="relative rounded-2xl bg-card p-6 shadow-[var(--shadow-card)] ring-1 ring-border transition hover:-translate-y-1">
            <div className="absolute -top-3 left-6 grid h-8 w-8 place-items-center rounded-full bg-primary font-display text-sm font-black text-primary-foreground shadow">
              {p.n}
            </div>
            <div className="mt-2 text-3xl">{p.icon}</div>
            <p className="mt-3 font-display text-lg font-bold">{p.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SobreIngresso() {
  const custos = [
    { i: "🥤", t: "Bebidas" },
    { i: "🥤", t: "Copos descartáveis" },
    { i: "🍽️", t: "Pratos e talheres" },
    { i: "🧻", t: "Guardanapos" },
    { i: "🎏", t: "Decoração" },
    { i: "🏠", t: "Aluguel do salão" },
  ];
  return (
    <section id="ingresso-info" className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-3xl bg-card p-8 sm:p-12 shadow-[var(--shadow-card)] ring-1 ring-border">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Sobre o ingresso</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black">
              Todo mundo entra <span className="text-primary">e todo mundo contribui</span> 🤝
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              O valor do ingresso é destinado à organização da festa, incluindo bebidas,
              descartáveis, decoração e demais despesas do evento. Além do ingresso,
              <span className="font-semibold text-foreground"> cada participante deverá contribuir levando um prato típico</span>,
              que será <span className="font-semibold text-foreground">sorteado automaticamente pelo sistema</span> após
              a confirmação do pagamento.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">O ingresso cobre</p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {custos.map((c) => (
                <li key={c.t} className="flex items-center gap-3 rounded-xl bg-muted/40 p-3 ring-1 ring-border">
                  <span className="text-xl">{c.i}</span>
                  <span className="text-sm font-semibold">{c.t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}



function MapSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Localização</p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl font-black">Como chegar 🗺️</h2>
        <p className="mt-3 text-muted-foreground">{EVENT_LOCATION}</p>
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl ring-1 ring-border shadow-[var(--shadow-card)]">
        <iframe
          title="Mapa do local"
          src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
          className="h-[420px] w-full border-0"
          loading="lazy"
        />
      </div>
      <div className="mt-4 text-center">
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-md transition hover:bg-primary/90"
        >
          📍 Abrir localização exata no Google Maps
        </a>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Posso levar crianças?", a: "Sim! A festa é para toda a família. Menores de 12 anos não pagam ingresso." },
    { q: "Terá comidas típicas?", a: "Claro! Pé-de-moleque, canjica, quentão, milho, pipoca, maçã do amor e muito mais." },
    { q: "Como funciona o ingresso Casal?", a: "Um único ingresso dá acesso a duas pessoas com um brinde surpresa na entrada." },
    { q: "É permitido levar comida ou bebida?", a: "Não. Contamos com barracas típicas e bar próprio no local." },
    { q: "Como recebo a confirmação?", a: "Após o pagamento aprovado você receberá o link do grupo de WhatsApp para novidades." },
  ];
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">FAQ</p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl font-black">Perguntas frequentes</h2>
      </div>
      <div className="mt-10 space-y-3">
        {items.map((it, i) => (
          <details
            key={i}
            className="group rounded-2xl bg-card p-5 ring-1 ring-border transition hover:shadow-[var(--shadow-card)] open:shadow-[var(--shadow-card)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold">
              {it.q}
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

