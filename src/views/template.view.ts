import { TemplateModel } from "../models/template.model";

export class TemplateViewer {
  constructor(private readonly model: TemplateModel) {}

  async copyStylesHeader(): Promise<void> {
    await this.model.withHiddenDocument(async (doc, context) => {
      context.document.insertFileFromBase64(this.model.base64Document!, Word.InsertLocation.end, {
        importTheme: true,
        importStyles: true,
        importParagraphSpacing: false,
        importPageColor: false,
        importChangeTrackingMode: false,
        importCustomProperties: false,
        importCustomXmlParts: false,
        importDifferentOddEvenPages: false,
      });
      await context.sync();
    });
  }

  async applyFullTemplate(): Promise<void> {
    await this.copyStylesHeader();
    this.model.base64Document = undefined;
  }

  async applyDefaultTemplate(): Promise<void> {
    await this.model.loadFromPath("assets/template.docx");
    await this.copyStylesHeader();
    this.model.base64Document = undefined;
  }
}
