import topics from "@/data/tu-tuong.json";
import quotes from "@/data/quotes.json";
import audit from "@/data/citation-audit.json";
import sources from "@/data/nguon.json";
import game from "@/data/trot-choi.json";
import knowledge from "@/data/kien-thuc-nen.json";
import roadmap from "@/data/lo-trinh.json";

export type Topic = (typeof topics)[number];
export type TopicQuote = Topic["quotes"][number];
export type GalleryQuote = (typeof quotes)[number];
export type AuditEntry = (typeof audit)[number];
export type SourceLibrary = typeof sources;
export type GameItem = (typeof game)["items"][number];
export type GameData = typeof game;
export type KnowledgeCard = (typeof knowledge)[number];
export type RoadmapDay = (typeof roadmap)[number];
