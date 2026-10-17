
const cache = new Map();

export async function fetchWithCache(url) {
  if (cache.has(url)) {
    console.log("[Cache] Using cached data:", url);
    return cache.get(url);
  }

  console.log("[Cache] Fetching from API:", url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data from API");
  }

  const data = await response.json();

  cache.set(url, data);

  return data;
}

export function clearDoctorCache() {
  cache.clear();
  console.log("[Cache] Cleared");
}
