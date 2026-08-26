export async function safeFirestore<T>(
  fn: () => Promise<T>,
  fallback: T,
  retries = 2,
  timeoutMs = 7000
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("firestore-timeout")), timeoutMs)
        ),
      ]);
    } catch (error) {
      if (attempt === retries) {
        console.error("[safeFirestore] failed after retries:", error);
        return fallback;
      }
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  return fallback;
}
