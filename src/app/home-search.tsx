"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const cuisineTags = ["American", "Japanese", "Italian", "Mexican", "Thai", "Indian"];

export function HomeSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        router.push(`/?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [router]
  );

  return (
    <>
      {/* Search */}
      <div className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl">
        <div className="flex flex-1 items-center gap-2 pl-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search restaurants or cuisines..."
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(searchQuery);
            }}
          />
        </div>
        <Button size="lg" className="rounded-xl px-6" onClick={() => handleSearch(searchQuery)}>
          Search
        </Button>
      </div>

      {/* Quick cuisine tags */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {cuisineTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setSearchQuery(tag);
              handleSearch(tag);
            }}
            className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            {tag}
          </button>
        ))}
      </div>
    </>
  );
}
