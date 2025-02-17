import { z } from "zod";
export function generateRandomString(
  baseChars: string = "atoz",
  length: number = 8,
): string {
  const charSets: Record<string, string> = {
    atoz: "abcdefghijklmnopqrstuvwxyz",
    AtoZ: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    alphanumeric:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  };

  // Use provided character set or fallback to default
  const chars: string = charSets[baseChars] || baseChars;

  let result: string = "";
  while (result.length < length) {
    // Generate a random index within the valid character set
    const randomIndex = Math.floor(Math.random() * chars.length);
    // Append the character at the random index to the result string
    result += chars[randomIndex];
  }

  return result;
}

export const formSchema = z.object({
  longUrl: z.string().url({
    message: "Please enter a valid URL",
  }),
  topic: z.string().optional(),
  customAlias: z.string().optional(),
});

export type formType = z.infer<typeof formSchema>;
