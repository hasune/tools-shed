import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WordCounter from "@/components/tools/WordCounter";

export const metadata: Metadata = {
  title: "Word & Character Counter",
  description: "Count words, characters, sentences, paragraphs, and estimate reading time. Free online text counter.",
  keywords: ["word counter", "character counter", "text counter", "word count tool", "reading time"],
};

export default function WordCounterPage() {
  return (
    <ToolLayout
      toolName="Word & Character Counter"
      toolSlug="word-counter"
      categoryName="Text Tools"
      categorySlug="text"
      description="Count words, characters, sentences, paragraphs, and estimate reading time. Updates live as you type."
    >
      <WordCounter />
    </ToolLayout>
  );
}
