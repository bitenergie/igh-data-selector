import { CatalogModel } from "../models/catalog.model";
import { TreeView } from "../views/tree.view";
import { ProductView } from "../views/product.view";
import { ProductWordView } from "../views/product-word.view";
import { Product } from "../models/product.model";

import { TemplateModel, TextManager } from "../models/template.model";
import { TemplateViewer } from "../views/template.view";

export class AppController {
  private treeView: TreeView;
  private productView: ProductView;
  private wordView: ProductWordView = new ProductWordView();
  private templateModel = new TemplateModel();
  private templateViewer = new TemplateViewer(this.templateModel);
  private textManager = new TextManager();

  private model?: CatalogModel;

  constructor(treeContainer: HTMLElement, productContainer: HTMLElement) {
    this.treeView = new TreeView(treeContainer);
    this.productView = new ProductView(productContainer);
  }

  public setModel(model: CatalogModel): void {
    this.model = model;
    this.init();
  }

  addBkpGroup(input: HTMLInputElement, bkp: HTMLSelectElement): void {
    try {
      input.addEventListener("click", async () => {
        await this.textManager.insertStructuredJson(bkp.value);
      });
    } catch (error) {
      console.error("Error inserting BKP group:", error);
    }
  }

  applyStyleBkp2(input: HTMLInputElement): void {
    input.addEventListener("click", async () => {
      await this.textManager.insertStyledText(
        "Name:\tValue\tRight aligned",
        "BKP Materialauszug Kostenzusammenstellung"
      );
    });
  }

  bindTemplateInput(input: HTMLInputElement): void {
    input.addEventListener("change", async () => {
      await this.templateModel.loadFromFileInput(input);
      if (!this.templateModel.hasTemplate()) {
        console.log("Default template not loaded");
        return;
      }
      await this.templateViewer.applyFullTemplate();
    });
  }

  async applyTemplateDefault(): Promise<void> {
    await this.templateModel.loadFromPath("assets/template.docx");
    if (!this.templateModel.hasTemplate()) {
      console.log("Default template not loaded");
      return;
    }

    await this.templateViewer.applyDefaultTemplate();
  }

  public onAddToWord(): void {
    const product: Product = this.model.selectProduct(this.model.selectedId!);
    this.wordView.insert(product);
  }

  private init(): void {
    // Render tree
    this.treeView.render(this.model.tree.getNodes(), (productId) =>
      this.onTreeLeafClick(productId)
    );
  }

  private onTreeLeafClick(productId: string): void {
    const product = this.model.selectProduct(productId);
    this.productView.render(product);
  }
}
