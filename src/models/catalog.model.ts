import { TreeModel } from "./tree.model";
import { ProductModel } from "./product.model.service";
import { Product } from "./product.model";

export class CatalogModel {
  readonly tree: TreeModel;
  readonly products: ProductModel;
  private selectedProductId?: string;

  constructor(private readonly xml: Document) {
    this.tree = new TreeModel();
    this.products = new ProductModel(xml);

    const register = xml.getElementsByTagName("RegisterSuche")[0];

    if (!register) {
      throw new Error("RegisterSuche not found");
    }

    this.tree.loadFromRegisterSuche(register);
  }

  get selectedId(): string | undefined {
    return this.selectedProductId;
  }

  selectProduct(productId: string): Product | null {
    this.selectedProductId = productId;
    return this.products.findById(productId);
  }
}
