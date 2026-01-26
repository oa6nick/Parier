import { Category } from "@/types";

const categoryNames: Record<string, { en: string; ru: string }> = {
  crypto: { en: "Cryptocurrency", ru: "Криптовалюты" },
  sports: { en: "Sports", ru: "Спорт" },
  politics: { en: "Politics", ru: "Политика" },
  technology: { en: "Technology", ru: "Технологии" },
  entertainment: { en: "Entertainment", ru: "Развлечения" },
  "stock-market": { en: "Stock Market", ru: "Фондовый рынок" },
  economy: { en: "Economy", ru: "Экономика" },
};

const categoryConfigs: Omit<Category, "name">[] = [
  { id: "crypto", color: "orange" },
  { id: "sports", color: "green" },
  { id: "politics", color: "blue" },
  { id: "technology", color: "purple" },
  { id: "entertainment", color: "pink" },
  { id: "stock-market", color: "blue" },
  { id: "economy", color: "yellow" },
];

export const getCategories = (locale: string = "en"): Category[] => {
  return categoryConfigs.map((config) => ({
    ...config,
    name: categoryNames[config.id]?.[locale === "ru" ? "ru" : "en"] || categoryNames[config.id]?.en || "",
  }));
};

// For backward compatibility, export default English categories
export const categories = getCategories("en");
