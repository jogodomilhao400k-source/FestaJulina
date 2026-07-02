import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { lerParticipantes, type Participante } from "@/lib/pratos";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Arraiá dos Amigos" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [lista, setLista] = useState<Participante[]>([]);

  useEffect(() => {
    setLista(lerParticipantes());
    const onStorage = () => setLista(lerParticipantes());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const stats = useMemo(() => {
    const doces = lista.filter((p) => p.prato.categoria === "doce").length;
    const salgados = lista.filter((p) => p.prato.categoria === "salgado").length;
    const total = lista.reduce((acc, p) => acc + p.valor, 0);
    return { doces, salgados, total, participantes: lista.length };
  }, [lista]);

  const pratosSorteados = useMemo(
    () => lista.map((p) => p.prato.nome).sort((a, b) => a.localeCompare(b)),
    [lista],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Painel administrativo</p>
            <h1 className="font-display text-2xl font-black">Arraiá dos Amigos</h1>
          </div>
          <Link to="/" className="rounded-full bg-muted px-4 py-2 text-sm font-semibold hover:bg-muted/80">
            ← Voltar ao site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Participantes" value={stats.participantes} icon="👥" />
          <StatCard label="Doces" value={stats.doces} icon="🍮" />
          <StatCard label="Salgados" value={stats.salgados} icon="🥟" />
          <StatCard label="Arrecadado" value={`R$ ${stats.total},00`} icon="💰" />
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-black">Participantes</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <Th>Nome</Th>
                  <Th>Ingresso</Th>
                  <Th>Status</Th>
                  <Th>Prato sorteado</Th>
                  <Th>Data</Th>
                </tr>
              </thead>
              <tbody>
                {lista.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Ainda não há participantes cadastrados.
                    </td>
                  </tr>
                ) : (
                  lista.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <Td>
                        <div className="font-semibold">{p.nome}</div>
                        <div className="text-xs text-muted-foreground">{p.email}</div>
                      </Td>
                      <Td className="capitalize">{p.tipo}</Td>
                      <Td>
                        <span className="rounded-full bg-[oklch(0.55_0.15_145)]/15 px-2.5 py-1 text-xs font-bold text-[oklch(0.4_0.15_145)]">
                          ✅ Aprovado
                        </span>
                      </Td>
                      <Td>
                        <span className="font-semibold">{p.prato.nome}</span>
                        <span className="ml-2 text-xs text-muted-foreground capitalize">({p.prato.categoria})</span>
                      </Td>
                      <Td className="text-muted-foreground">
                        {new Date(p.criadoEm).toLocaleString("pt-BR")}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-black">Pratos já sorteados</h2>
          {pratosSorteados.length === 0 ? (
            <p className="mt-3 text-muted-foreground">Nenhum prato sorteado ainda.</p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {pratosSorteados.map((nome, i) => (
                <li key={i} className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  {nome}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)] ring-1 ring-border">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-black text-primary">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
