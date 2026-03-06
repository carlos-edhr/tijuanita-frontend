import type { Language } from "@/context/LanguageProvider";

export interface CardData {
  title: string;
  description: string;
  buttonText: string;
  color: string;
  image: string;
  url: string | null;
  delay: number;
}

export interface BilingualField {
  es: string;
  en: string;
}

export interface CMSCardContent {
  card1_title?: BilingualField | null;
  card1_description?: BilingualField | null;
  card1_button_text?: BilingualField | null;
  card1_image?: string | null;
  card1_color?: string;
  card1_url?: BilingualField | null;
  card2_title?: BilingualField | null;
  card2_description?: BilingualField | null;
  card2_button_text?: BilingualField | null;
  card2_image?: string | null;
  card2_color?: string;
  card2_url?: BilingualField | null;
  card3_title?: BilingualField | null;
  card3_description?: BilingualField | null;
  card3_button_text?: BilingualField | null;
  card3_image?: string | null;
  card3_color?: string;
  card3_url?: BilingualField | null;
}

type GetLocalizedValue = <T extends Record<string, unknown>>(field: T | null | undefined) => string;

export const buildCardData = (
  content: CMSCardContent | null | undefined,
  defaults: CardData[],
  language: Language,
  getLocalizedValue: GetLocalizedValue
): CardData[] => {
  const cardContents = [
    {
      title: content?.card1_title,
      description: content?.card1_description,
      buttonText: content?.card1_button_text,
      color: content?.card1_color,
      image: content?.card1_image,
      url: content?.card1_url,
    },
    {
      title: content?.card2_title,
      description: content?.card2_description,
      buttonText: content?.card2_button_text,
      color: content?.card2_color,
      image: content?.card2_image,
      url: content?.card2_url,
    },
    {
      title: content?.card3_title,
      description: content?.card3_description,
      buttonText: content?.card3_button_text,
      color: content?.card3_color,
      image: content?.card3_image,
      url: content?.card3_url,
    },
  ];

  return cardContents.map((cardContent, index) => {
    const defaultCard = defaults[index] || { title: '', description: '', buttonText: '', color: '#FF6B6B', image: '', url: null };
    
    return {
      title: getLocalizedValue(cardContent.title) || defaultCard.title,
      description: getLocalizedValue(cardContent.description) || defaultCard.description,
      buttonText: getLocalizedValue(cardContent.buttonText) || defaultCard.buttonText,
      color: cardContent.color || defaultCard.color,
      image: cardContent.image || defaultCard.image,
      url: getLocalizedValue(cardContent.url) || defaultCard.url,
      delay: 0.1 * (index + 1),
    };
  });
};
