/* Template Model */
export class TemplateModel {
  public base64Document?: string;

  async loadFromFileInput(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0];
    if (!file) throw new Error("No template file selected");

    this.base64Document = await this.readFileAsBase64(file);
  }

  async loadFromPath(path: string): Promise<void> {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    this.base64Document = this.arrayBufferToBase64(buffer);
  }

  hasTemplate(): boolean {
    return !!this.base64Document;
  }

  async withHiddenDocument<T>(
    callback: (doc: Word.DocumentCreated, context: Word.RequestContext) => Promise<T>
  ): Promise<T> {
    if (!this.base64Document) {
      throw new Error("Template not loaded");
    }

    if (!Office.context.requirements.isSetSupported("WordApiHiddenDocument", "1.3")) {
      throw new Error("WordApiHiddenDocument 1.3 not supported");
    }

    return Word.run(async (context) => {
      const doc = context.application.createDocument(this.base64Document);
      await context.sync();
      return callback(doc, context);
    });
  }

  /* -----------------------------
     Helpers
  ------------------------------ */

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000; // prevents call stack overflow

    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return btoa(binary);
  }
}

export class TextManager {
  /**
   * Inserts text using a paragraph style
   */
  async insertStyledText(
    text: string,
    styleName: string,
    location: Word.InsertLocation.after | Word.InsertLocation.before = Word.InsertLocation.after
  ): Promise<void> {
    await Word.run(async (context) => {
      const paragraph = context.document.getSelection().insertParagraph(text, location);

      paragraph.style = styleName;
      await context.sync();
    });
  }

  async insertStructuredJson(
    //data: Promise<any>,
    rootKey: string
  ): Promise<void> {
    await Word.run(async (context) => {
      const selection = context.document.getSelection();

      await context.sync();

      /* -----------------------------
         Insert content
      ------------------------------ */
      let data: any = {};
      try {
        const response = await fetch("assets/BKP.json");
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        data = await response.json();
      } catch (error) {
        console.error(error.message);
      }

      const rootObject = data[rootKey];
      if (!rootObject) {
        console.error(`Root key '${rootKey}' not found in JSON data.`);
      }

      for (const level1Key of Object.keys(rootObject)) {
        let para = selection
          .getRange(Word.RangeLocation.after)
          .insertParagraph(level1Key, Word.InsertLocation.after);
        para.style = "BKP 2 Übersicht";

        const level2Object = rootObject[level1Key];

        for (const level2Key of Object.keys(level2Object)) {
          para = selection
            .getRange(Word.RangeLocation.after)
            .insertParagraph(level2Key, Word.InsertLocation.after);
          para.style = "BKP 3 Übersicht";

          const items = level2Object[level2Key];

          if (Array.isArray(items)) {
            for (const item of items) {
              para = selection
                .getRange(Word.RangeLocation.after)
                .insertParagraph(`${item}`, Word.InsertLocation.after);
              para.style = "BKP Materialauszug Text";
            }
            selection
              .getRange(Word.RangeLocation.after)
              .insertParagraph("", Word.InsertLocation.after);
          }

          para = selection
            .getRange(Word.RangeLocation.after)
            .insertParagraph(level2Key + "\t\tTotal\t\t", Word.InsertLocation.after);
          para.style = "BKP 3 Übersicht";

          selection
            .getRange(Word.RangeLocation.after)
            .insertBreak(Word.BreakType.page, Word.InsertLocation.after);
        }
        // total cost
        para = selection
          .getRange(Word.RangeLocation.after)
          .insertParagraph(level1Key + " Kostenzusammenstellung", Word.InsertLocation.after);
        para.style = "BKP 2 Übersicht";

        // Zusammenstellung Kosten
        for (const level2Key of Object.keys(level2Object)) {
          selection
            .getRange(Word.RangeLocation.after)
            .insertParagraph(level2Key + "\t\tTotal\t\t", Word.InsertLocation.after).style =
            "BKP 3 Übersicht";
        }
        para = selection
          .getRange(Word.RangeLocation.after)
          .insertParagraph(level1Key + "\t\tTotal\t\t", Word.InsertLocation.after);
        para.style = "BKP 2 Übersicht";
      }
      selection
        .getRange(Word.RangeLocation.after)
        .insertBreak(Word.BreakType.page, Word.InsertLocation.after);

      await context.sync();
    });
  }
}
