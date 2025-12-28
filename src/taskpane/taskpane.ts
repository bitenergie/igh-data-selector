/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

import { CatalogModel } from "../models/catalog.model";
import { AppController } from "../controllers/app.controller";

const treeContainer = document.getElementById("treeview")!;
const productContainer = document.getElementById("product-details")!;
const controller = new AppController(treeContainer, productContainer);

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    const fileInput = document.getElementById("inputFile") as HTMLInputElement;
    fileInput.onchange = () => {
      mvc_reader();
    };

    /* start of template controller */
    tryCatch(() =>
      controller.bindTemplateInput(document.getElementById("template-file") as HTMLInputElement)
    );

    tryCatch(() =>
      document
        .getElementById("apply-template-default")!
        .addEventListener("click", () => controller.applyTemplateDefault())
    );

    /* Bkp2 style */
    tryCatch(() =>
      controller.applyStyleBkp2(document.getElementById("apply-bkp2-style") as HTMLInputElement)
    );
    tryCatch(() =>
      controller.addBkpGroup(
        document.getElementById("insert-bkp-group") as HTMLInputElement,
        document.getElementById("insert-bkp-group-select") as HTMLSelectElement
      )
    );
  }
});

function mvc_reader(): void {
  const fileInput = document.getElementById("inputFile") as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (!file) {
    console.log("Please select an XML file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = (event: ProgressEvent<FileReader>) => {
    const xml = new DOMParser().parseFromString(reader.result as string, "application/xml");

    const model = new CatalogModel(xml);
    controller.setModel(model);

    document
      .getElementById("add-to-word")!
      .addEventListener("click", () => controller.onAddToWord());
  };

  reader.readAsText(file);
}

/** Default helper for invoking an action and handling errors. */
async function tryCatch(callback) {
  try {
    await callback();
  } catch (error) {
    // Note: In a production add-in, you'd want to notify the user through your add-in's UI.
    console.error(error);
  }
}
