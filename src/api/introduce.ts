export const fetchIntroduce = async () => {
  const response = await fetch("/introduce", {
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
