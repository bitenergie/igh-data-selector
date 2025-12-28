import { Product } from "../models/product.model";

export class ProductView {
  constructor(private readonly container: HTMLElement) {}

  render(product: Product | null): void {
    this.container.innerHTML = "";

    if (!product) {
      this.container.innerHTML = `
        <div class="alert alert-warning">
          Produkt nicht gefunden
        </div>
      `;
      return;
    }

    const card = document.createElement("div");
    card.className = "card";
    card.style.border = "none";

    card.innerHTML = `
      ${
        product.imageUrl
          ? `
        <img
          src="${product.imageUrl}"
          id="${product.imageUrl}"
          class="card-img-top"
          alt="${product.shortText ?? "Produktbild"}"
          style="max-height: 300px; object-fit: contain;"
        />
      `
          : ""
      }

      <div class="card-body">
        <h5 class="card-title">${product.shortText ?? "Produkt"}</h5>
        <h6 class="card-subtitle mb-2 text-muted">
          Artikel-Nr: ${product.artNr}
        </h6>

        <p class="card-text">${product.longText ?? ""}</p>

        <ul class="list-unstyled mb-0">
          ${
            product.quantity
              ? `
            <li>
              <strong>Menge:</strong>
              ${product.quantity.value} ${product.quantity.unit ?? ""}
            </li>`
              : ""
          }
          ${
            product.price
              ? `
            <li>
              <strong>Preis:</strong>
              CHF ${product.price.value}
            </li>`
              : ""
          }
        </ul>
      </div>
    `;

    this.container.appendChild(card);
  }
}
