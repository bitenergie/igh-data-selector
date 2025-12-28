import { Product } from "./product.model";

export class ProductModel {
  private readonly baseUrl?: string;

  constructor(private readonly xml: Document) {
    // Resolve base URL once
    this.baseUrl = xml.getElementsByTagName("LinkURL")[0]?.textContent?.trim();
  }

  findById(productId: string): Product | null {
    const produkte = this.xml.getElementsByTagName("Produkte")[0];
    if (!produkte) return null;

    const artikel = Array.from(produkte.getElementsByTagName("Artikel")).find(
      (a) => a.getAttribute("ArtNr") === productId
    );

    if (!artikel) return null;

    return new Product(
      productId,
      getText(artikel, "TKurz"),
      getText(artikel, "TLang"),
      getText(artikel, "ArtStat"),
      getText(artikel, "ArtHer"),
      parseQuantity(artikel),
      parsePrice(artikel),
      this.resolveImageUrl(artikel)
    );
  }

  private resolveImageUrl(artikel: Element): string | undefined {
    const nameNode = artikel.querySelector('LinkAdr > Name[Ext^="jp"]'); // look for starts with text for jp

    const relativePath = nameNode?.textContent?.trim();
    if (!relativePath || !this.baseUrl) return undefined;

    return this.baseUrl.endsWith("/")
      ? this.baseUrl + relativePath
      : `${this.baseUrl}/${relativePath}`;
  }
}

/* helpers */

function getText(parent: Element, tag: string): string | undefined {
  return parent.getElementsByTagName(tag)[0]?.textContent?.trim();
}

function parseQuantity(el: Element) {
  const m = el.getElementsByTagName("Menge")[0];
  if (!m) return undefined;
  return {
    value: Number(m.textContent ?? 0),
    iso: m.getAttribute("ISO") ?? undefined,
    unit: m.getAttribute("Einh") ?? undefined,
  };
}

function parsePrice(el: Element) {
  const p = el.querySelector("PreisEig > Pr");
  if (!p) return undefined;
  return {
    type: p.getAttribute("Typ") ?? undefined,
    value: Number(p.getAttribute("Preis") ?? 0),
  };
}
