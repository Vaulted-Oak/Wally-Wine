import React from "react";
import { useSearchParams } from "react-router";
import SearchResultPage from "~/components/search/SearchResultPage";

export default function LocaleSearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div>
      <h1 className="max-w-[1480px] w-full px-[20px] mx-auto text-[32px] uppercase font-normal tracking-[2px] my-[30px]">Search Results for "{query}"</h1>
      <SearchResultPage query={query} />
    </div>
  );
}
