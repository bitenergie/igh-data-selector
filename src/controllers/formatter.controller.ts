import { WordSelectionFormatter } from "../models/formatter.model";
// https://learn.microsoft.com/en-us/office/dev/add-ins/word/search-option-guidance
export class RegexController {
  private formatter = new WordSelectionFormatter();

  async boldWordsWithColon(): Promise<void> {
    await this.formatter.formatSelection({
      pattern: "([A-z0-9äöüß\(\.\))]@):",
      matchCase: false,
      matchWholeWord: false,
      matchWildcards: true,
      format: { bold: true },
      replacement:"\n",
      insert_location: Word.InsertLocation.start

    });
  }

  async underlineNumbers(): Promise<void> {
    await this.formatter.removeParagraphs();
  }

  async customSearchReplace(
    pattern: string,
    replacement: string
  ): Promise<void> {
    await this.formatter.formatSelection({
      pattern,
      replacement,
      format: { italic: true }
    });
  }
}