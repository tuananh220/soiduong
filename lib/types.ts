import topics from "@/data/tu-tuong.json";
import quotes from "@/data/quotes.json";
import audit from "@/data/citation-audit.json";
import sources from "@/data/nguon.json";

export type Topic = (typeof topics)[number];
export type TopicQuote = Topic["quotes"][number];
export type GalleryQuote = (typeof quotes)[number];
export type AuditEntry = (typeof audit)[number];
export type SourceLibrary = typeof sources;
