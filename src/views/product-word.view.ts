import { Product } from "../models/product.model";

/* global Word */

export class ProductWordView {
  //private positionCounter = 1;

  async insert(product: Product | null): Promise<void> {
    if (!product) return;

    await Word.run(async (context: Word.RequestContext) => {
      const selection: Word.Range = context.document.getSelection();

      const style: Word.Style = context.document.getStyles().getByNameOrNullObject("BKP Materialauszug Text");
      style.load();
      await context.sync();

      if (style.isNullObject) {
        selection.insertText(`Please load a template first!\n`, Word.InsertLocation.start).font.color = "red";
        console.warn(
          `There's an existing style with the name "BKP Materialauszug Text"! Please load a template.`
        );
        return;
      }
      /* Title (Position) */
      // selection.insertText(`Pos. ${this.positionCounter++}\n`, Word.InsertLocation.end);

      let sel = selection.insertText(`${product.shortText ?? ""}\n\n`, Word.InsertLocation.end);
      sel.style = "BKP Materialauszug Text";
      sel.font.bold = true;

      /* Article Number */
      sel = selection.insertText(`Artikel-Nr.: ${product.artNr}\n`, Word.InsertLocation.end);
      sel.style = "BKP Materialauszug Text";
      sel.font.italic = true;

      if (product.longText) {
        // sel = selection.insertText(
        //   formatTextToMarkdown(product.longText) + "\n",
        //   Word.InsertLocation.end
        // );
        sel = selection.insertText(product.longText + "\n\n", Word.InsertLocation.end)
        sel.style = "BKP Materialauszug Text";
      }

      if (product.quantity) {
        selection.insertText(
          `\tMenge:\t${product.quantity.value} ${product.quantity.unit ?? ""}\t\t\n`,
          Word.InsertLocation.end
        ).style = "BKP Materialauszug Kostenzusammenstellung";
      }

      //if (product.price) {
      //  const price = product.price.value ?? 0;
      //  selection.insertText(`Einzelpreis: CHF ${price.toFixed(2)}\n`, Word.InsertLocation.end);
      //
      //  // if (product.quantity) {
      //  //   selection.insertText(
      //  //     `Gesamtpreis: CHF ${(price * product.quantity.value).toFixed(2)}\n`,
      //  //     Word.InsertLocation.end
      //  //   );
      //  // }
      //}

      selection.insertText("\n", Word.InsertLocation.end);

      //await context.sync();
    });
  }
}

function formatTextToMarkdown(text: string): string {
  // Step 1: Remove line breaks and normalize spaces

  // Step 2: Identify lists (assuming lines starting with numbers or specific patterns are list items)
  let txt = text.replace(/-\n/g, "$`");
  let lines = text.split("\n");
  let markdownOutput = "";

  for (const line of lines) {
    // Trim whitespace
    const trimmedLine = line.trim();

    // Check if the line starts a list item (e.g., "1 Volumenstromregler")
    if (/^\d+\s/.test(trimmedLine)) {
      // Convert to markdown list format
      markdownOutput += `- ${trimmedLine}\n`;
    } else if (trimmedLine) {
      // Add regular text
      markdownOutput += `${trimmedLine} `;
    }
  }

  return markdownOutput.trim();
}
