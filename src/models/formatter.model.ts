export interface SearchFormatOptions {
  pattern: string;
  matchWholeWord?: boolean;
  matchCase?: boolean;
  matchWildcards?: boolean;
  replacement?: string;
  insert_location?: Word.InsertLocation;
  format?: Partial<Word.Font>;
}

export class WordSelectionFormatter {
  async formatSelection(options: SearchFormatOptions): Promise<void> {
    await Word.run(async (context) => {
      const sel = context.document.getSelection();
      sel.load("text");
      await context.sync();

      if (!sel.text) {
        return;
      }

      // Build SearchOptions
      const searchOptions = Word.SearchOptions.newObject(context);
      searchOptions.matchCase = !!options.matchCase;
      searchOptions.matchWholeWord = !!options.matchWholeWord;
      searchOptions.matchWildcards = !!options.matchWildcards;

      // Perform search on selection
      const results = sel.search(options.pattern, searchOptions);
      results.load("items");

      await context.sync();

      // No matches → exit
      if (!results.items.length) {
        return;
      }

      // Iterate matches
      for (const range of results.items) {
        // If replacement provided → replace text
        if (options.replacement !== undefined) {
          if (options.insert_location) {
            range.insertText(options.replacement, options.insert_location);
          } else {
            range.insertText(options.replacement, Word.InsertLocation.replace);
          }
        }

        // Apply formatting
        if (options.format) {
          Object.assign(range.font, options.format);
        }
      }

      await context.sync();
    });
  }

  async removeParagraphs() {
    // Does a basic text search and highlights matches in the document.
    await Word.run(async (context) => {
      const results: Word.RangeCollection = context.document.getSelection().search("^p");
      results.load("length");
      results.load("paragraphs");

      await context.sync();
      let txt = "";
      // Let's traverse the search results and highlight matches.

      for (let i = 0; i < results.items.length; i++) {
        txt += results.items[i].paragraphs.items[0].text.replace(/\n/g, "") + " ";
        results.items[i].paragraphs.items[0].clear();
        await context.sync();
        console.log(`${txt}`);
      }
      results.items[results.items.length - 1].paragraphs.items[0].insertText(`${txt}`, "Replace");

      await context.sync();
    });
  }
}
