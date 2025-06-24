export interface MoviePreference {
  TITLE: string;
  RATING: number;
  MANRATING: number;
  FEMALERATING: number;
  MANPER: number;
  FEMALEPER: number;
  MANGR: number;
  WOMANGR: number;
  PREFER: "man" | "woman";
}

export const fetchIntroduce = async (): Promise<MoviePreference[]> => {
  const response = await fetch("https://localhost:4000/introduce", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch introduce data");
  }

  return response.json();
};
