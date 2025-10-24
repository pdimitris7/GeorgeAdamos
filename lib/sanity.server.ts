// lib/sanity.server.ts
import "server-only";

// Αν ΤΩΡΑ χρησιμοποιείς τα queries σου στο lib/sanity.ts,
// τότε κράτα αυτή τη γραμμή:
export * from "./sanity";

// Αν ήδη έχεις κάνει split σε lib/sanity.base.ts,
// ΤΟΤΕ χρησιμοποίησε αυτό αντί για το παραπάνω:
// export * from "./sanity.base";
