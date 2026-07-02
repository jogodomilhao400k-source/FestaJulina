export type Categoria = "doce" | "salgado";
export type Prato = { nome: string; categoria: Categoria };

export const DOCES: string[] = [
  "Canjica", "Arroz-doce", "Curau", "Cocada", "Paçoca", "Pé de moleque",
  "Bolo de milho", "Bolo de fubá", "Bolo de aipim", "Bolo de cenoura",
  "Bolo de chocolate", "Bolo de coco", "Maçã do amor", "Doce de abóbora",
  "Pudim", "Brigadeiro", "Beijinho", "Cuscuz doce",
];

export const SALGADOS: string[] = [
  "Cachorro-quente", "Mini cachorro-quente", "Empadão", "Empadas", "Esfirras",
  "Pastéis", "Mini pizzas", "Pão de queijo", "Torta de frango", "Torta de carne",
  "Quiche", "Sanduíches naturais", "Enroladinhos de salsicha", "Mini hambúrguer",
  "Salgados variados", "Pipoca salgada", "Milho cozido", "Cuscuz salgado",
];

export const TODOS_PRATOS: Prato[] = [
  ...DOCES.map((nome) => ({ nome, categoria: "doce" as const })),
  ...SALGADOS.map((nome) => ({ nome, categoria: "salgado" as const })),
];

export type Participante = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: "individual" | "casal";
  valor: number;
  prato: Prato;
  status: "aprovado";
  criadoEm: string;
};

const STORAGE_KEY = "arraia_participantes_v1";

export function lerParticipantes(): Participante[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Participante[]) : [];
  } catch {
    return [];
  }
}

function salvarParticipantes(lista: Participante[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

/** Sorteia um prato evitando repetição enquanto houver disponíveis. Reinicia quando esgota. */
export function sortearPrato(): Prato {
  const existentes = lerParticipantes();
  const usados = new Set(existentes.map((p) => p.prato.nome));
  let disponiveis = TODOS_PRATOS.filter((p) => !usados.has(p.nome));
  if (disponiveis.length === 0) disponiveis = TODOS_PRATOS;
  const escolhido = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  return escolhido;
}

export function registrarParticipante(
  input: Omit<Participante, "id" | "status" | "criadoEm" | "prato"> & { prato: Prato },
): Participante {
  const novo: Participante = {
    ...input,
    id: crypto.randomUUID(),
    status: "aprovado",
    criadoEm: new Date().toISOString(),
  };
  const lista = lerParticipantes();
  lista.push(novo);
  salvarParticipantes(lista);
  return novo;
}
