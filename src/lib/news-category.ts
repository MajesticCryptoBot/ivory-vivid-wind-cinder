export type NewsCategory =
  | "Macro"
  | "Crypto"
  | "AI"
  | "AI Infrastructure"
  | "Equities"
  | "Markets"
  | "Geopolitics";

const RULES: Array<{
  category: NewsCategory;
  terms: string[];
  weight: number;
}> = [
  {
    category: "AI Infrastructure",
    weight: 4,
    terms: [
      "ai data center", "ai data centre", "data center", "data centre",
      "gpu", "gpus", "accelerator", "accelerators", "ai chip", "ai chips",
      "semiconductor", "semiconductors", "hbm", "inference compute",
      "training compute", "compute cluster", "compute clusters", "cloud compute",
      "ai infrastructure", "ai infrastructure", "nvidia blackwell", "nvidia h100",
      "nvidia h200", "nvidia b100", "nvidia b200", "nvidia gb200", "networking",
      "power capacity", "gigawatt", "gigawatts", "data-center", "data-centre",
    ],
  },
  {
    category: "Geopolitics",
    weight: 4,
    terms: [
      "geopolit", "sanction", "sanctions", "tariff", "tariffs", "trade war",
      "embargo", "ceasefire", "conflict", "war in", "military", "missile",
      "nato", "white house", "pentagon", "european union", "eu commission",
      "china-us", "us-china", "beijing", "taiwan", "ukraine", "russia",
      "israel", "gaza", "iran", "north korea", "south korea", "election",
      "government", "president", "prime minister", "diplomatic", "diplomacy",
    ],
  },
  {
    category: "Macro",
    weight: 4,
    terms: [
      "federal reserve", "fed", "fomc", "ecb", "bank of england", "boe",
      "central bank", "interest rate", "interest rates", "rate hike", "rate cut",
      "rate cuts", "inflation", "cpi", "ppi", "pce", "core inflation", "gdp",
      "nonfarm payroll", "payrolls", "unemployment", "jobs report", "employment",
      "treasury yield", "bond yield", "sovereign debt", "fiscal policy",
      "monetary policy", "consumer price", "producer price", "recession",
      "economic growth", "economic data", "yield curve", "jackson hole",
    ],
  },
  {
    category: "AI",
    weight: 4,
    terms: [
      "artificial intelligence", " ai ", "generative ai", "genai", "machine learning",
      "large language model", "language model", "llm", "foundation model", "frontier model",
      "openai", "anthropic", "chatgpt", "claude", "gemini", "deepmind", "sutskever",
      "superintelligence", "ai model", "ai models", "ai agent", "ai agents", "robotics",
    ],
  },
  {
    category: "Equities",
    weight: 3,
    terms: [
      "stock", "stocks", "shares", "share price", "equity", "equities", "earnings",
      "quarterly results", "revenue", "eps", "ipo", "listing", "nasdaq", "nyse",
      "s&p 500", "sp500", "dow jones", "russell 2000", "buyback", "dividend",
      "analyst upgrade", "analyst downgrade", "price target", "market cap",
      "nvidia", "apple", "microsoft", "tesla", "amazon", "alphabet", "meta",
    ],
  },
  {
    category: "Crypto",
    weight: 4,
    terms: [
      "bitcoin", "btc", "ethereum", "eth", "xrp", "solana", "sol", "bnb",
      "crypto", "cryptocurrency", "cryptocurrencies", "blockchain", "defi", "web3",
      "token", "tokens", "stablecoin", "stablecoins", "altcoin", "altcoins",
      "wallet", "wallets", "on-chain", "onchain", "staking", "validator", "validators",
      "mining", "miner", "miners", "memecoin", "memecoins", "dao", "dex", "cex",
      "nft", "nfts", "airdrop", "etf", "spot etf", "treasury bitcoin", "digital asset",
      "digital assets", "zcash", "solana", "dogecoin", "cardano", "avalanche",
    ],
  },
  {
    category: "Markets",
    weight: 2,
    terms: [
      "market", "markets", "trading", "trader", "traders", "futures", "options",
      "forex", "currency", "currencies", "dollar", "euro", "yen", "commodity",
      "commodities", "gold", "silver", "oil", "crude", "copper", "volatility",
      "risk-on", "risk off", "capital flows", "fund flows", "liquidity", "rally",
      "selloff", "sell-off", "bullish", "bearish", "index", "indices",
    ],
  },
];

function containsTerm(text: string, term: string): boolean {
  if (term.length <= 4 || /[^a-z0-9 ]/i.test(term)) return text.includes(term);
  return new RegExp(`\\b${term.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\b`, "i").test(text);
}

export function classifyTelegramCategory(input: string): NewsCategory {
  const text = ` ${input.toLowerCase().replace(/[^a-z0-9$%+.#-]+/g, " ").replace(/\s+/g, " ")} `;
  const scores = new Map<NewsCategory, number>();

  for (const rule of RULES) {
    let hits = 0;
    for (const term of rule.terms) {
      if (containsTerm(text, term)) hits += 1;
    }
    if (hits) scores.set(rule.category, hits * rule.weight);
  }

  // Infrastructure is a specialised AI topic. Prefer it when the article
  // contains a clear infrastructure signal rather than classifying it as AI.
  const infrastructureScore = scores.get("AI Infrastructure") ?? 0;
  if (infrastructureScore > 0) return "AI Infrastructure";

  // Geopolitical and macro stories can mention markets/crypto incidentally;
  // their primary subject should win when there is a strong signal.
  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  if (ranked.length) return ranked[0][0];

  // Unclassified stories belong in the broad market feed rather than being
  // incorrectly labelled Crypto.
  return "Markets";
}
