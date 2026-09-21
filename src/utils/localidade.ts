const nomesOficiais: Record<string, string> = {
  ALECRIM: "Alecrim",
  "AREIA PRETA": "Areia Preta",
  "BARRO VERMELHO": "Barro Vermelho",
  "BOM PASTOR": "Bom Pastor",
  CANDELARIA: "Candelária",
  "CAPIM MACIO": "Capim Macio",
  "CIDADE ALTA": "Cidade Alta",
  "CIDADE DA ESPERANCA": "Cidade da Esperança",
  "CIDADE NOVA": "Cidade Nova",
  "DIX SEPT ROSADO": "Dix-Sept Rosado",
  "FELIPE CAMARAO": "Filipe Camarão",
  GUARAPES: "Guarapes",
  IGAPO: "Igapó",
  "JARDIM PROGRESSO": "Jardim Progresso",
  "LAGOA AZUL": "Lagoa Azul",
  "LAGOA NOVA": "Lagoa Nova",
  "LAGOA SECA": "Lagoa Seca",
  "MAE LUIZA": "Mãe Luíza",
  "MORRO BRANCO": "Morro Branco",
  NEOPOLIS: "Neópolis",
  NORDESTE: "Nordeste",
  "NOSSA SENHORA DA APRESENTACAO": "Nossa Senhora da Apresentação",
  "NOSSA SENHORA DE NAZARE": "Nossa Senhora de Nazaré",
  "NOVA DESCOBERTA": "Nova Descoberta",
  PAJUCARA: "Pajuçara",
  "PARQUE DAS COLINAS": "Parque das Colinas",
  PETROPOLIS: "Petrópolis",
  PITIMBU: "Pitim\u0062\u00fa",
  PLANALTO: "Planalto",
  "PONTA NEGRA": "Ponta Negra",
  POTENGI: "Potengi",
  "PRAIA DO MEIO": "Praia do Meio",
  QUINTAS: "Quintas",
  REDINHA: "Redinha",
  RIBEIRA: "Ribeira",
  ROCAS: "Rocas",
  SALINAS: "Salinas",
  "SANTOS REIS": "Santos Reis",
  TIROL: "Tirol",
};

function limparLocalidade(value: string): string {
  return value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\d/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const regrasLocalidade: Array<[RegExp, string]> = [
  [/APRESENT|NSA/, "NOSSA SENHORA DA APRESENTACAO"],
  [/NAZARE/, "NOSSA SENHORA DE NAZARE"],
  [/ALECR|AECRIM|ALEGRIM|ALENGRIM|ALERIM|ALCRIM|ALENCRIM/, "ALECRIM"],
  [/AREA PRETA/, "AREIA PRETA"],
  [/CIDADE DA E/, "CIDADE DA ESPERANCA"],
  [/PET|PEPRO|P[T]?ROPOL/, "PETROPOLIS"],
  [/DIX.*SEPT|DIA SEPT|DIX DEPT|DIX SEP|DIX SERT|DIX SERPT/, "DIX SEPT ROSADO"],
  [/NEOP|NOEPO|NEOPO|NEO P/, "NEOPOLIS"],
  [/GUARAP/, "GUARAPES"],
  [/IGAP/, "IGAPO"],
  [/MAE LUIZA/, "MAE LUIZA"],
  [/FELIPE CAMAR|FILIPE CAMAR/, "FELIPE CAMARAO"],
  [/NOVA DESC|NOVA DECO|NOVA DESO|NOVA DESCOR/, "NOVA DESCOBERTA"],
  [/PAJUC|PACUC|PACUJ|PAJAC|PAJC|PAJUAC|PAJUA|PAJUR/, "PAJUCARA"],
  [/LAGOA AZ/, "LAGOA AZUL"],
  [/NOR.*DESTE|NODESTE|NOSDESTE|NOREDESTE/, "NORDESTE"],
  [/BARRO VERM|BAIRRO VERM/, "BARRO VERMELHO"],
  [/SANTO.*REI/, "SANTOS REIS"],
  [/QUIT|QIU|QUNT/, "QUINTAS"],
  [/PRAI.*MEIO|PRIA.*MEIO|PRAIO.*MEIO/, "PRAIA DO MEIO"],
  [/POT|POTE|POTR|PONTENG/, "POTENGI"],
  [/PONTA.*NEG|PONTANEGRA|PONSTA NEG/, "PONTA NEGRA"],
  [/PIT|PINT/, "PITIMBU"],
];

export function normalizarLocalidade(value: string): string {
  const texto = limparLocalidade(value);
  const regra = regrasLocalidade.find(([pattern]) => pattern.test(texto));
  const chave = regra?.[1] ?? texto;
  return (nomesOficiais[chave] ?? value.trim().replace(/\s+/g, " ")).toLocaleUpperCase("pt-BR");
}

export function slugLocalidade(value: string): string {
  return normalizarLocalidade(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
