import { Bet } from "@/types";
import { getCategories } from "./categories";
import { betsData } from "./bets";
import { betsTranslations } from "./betsTranslations";
import { getCreatedBetsData, getCreatedTranslations } from "./createdBetsStore";

type BetData = Omit<Bet, "title" | "shortDescription" | "fullDescription" | "outcome" | "category"> & {
  categoryId: string;
};

export async function getBets(locale: string = "en"): Promise<Bet[]> {
  const categories = getCategories(locale);
  const lang = locale === "ru" ? "ru" : "en";

  const staticBets = betsData.map((bet) => {
    const translation = betsTranslations[bet.id]?.[lang];
    const category = categories.find((cat) => cat.id === bet.categoryId) || categories[0];

    return {
      ...bet,
      title: translation?.title || "",
      shortDescription: translation?.shortDescription || "",
      fullDescription: translation?.fullDescription || "",
      outcome: translation?.outcome || "",
      category,
    } as Bet;
  });

  const createdBetsData = await getCreatedBetsData();
  const createdTrans = await getCreatedTranslations();
  const createdBetsList = createdBetsData.map((bet) => {
    const translation = createdTrans[bet.id]?.[lang];
    const category = categories.find((cat) => cat.id === bet.categoryId) || categories[0];

    return {
      ...bet,
      title: translation?.title || "",
      shortDescription: translation?.shortDescription || "",
      fullDescription: translation?.fullDescription || "",
      outcome: translation?.outcome || "",
      category,
    } as Bet;
  });

  return [...createdBetsList, ...staticBets];
}

export async function getBetById(id: string, locale: string = "en"): Promise<Bet | undefined> {
  const bets = await getBets(locale);
  return bets.find((b) => b.id === id);
}
