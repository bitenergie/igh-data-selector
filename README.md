# IGH Data Selector

> A lightweight Office Add-in (task pane) for browsing IGH product catalogs and inserting product content into Word documents using templates.

## Key Features

- Upload and parse catalog XML files.
- Browse catalogs via a tree view and view product details.
- Apply Word templates and insert product content or BKP groups.
- Theme toggle (dark/light/auto) and responsive UI.

## Repo Structure

- `manifest.xml` — Office Add-in manifest.
- `package.json` — build and dev scripts.
- `webpack.config.js` — bundling configuration.
- `src/taskpane/taskpane.html` — main taskpane UI. See [src/taskpane/taskpane.html](src/taskpane/taskpane.html)
- `src/taskpane/taskpane.ts` — frontend logic for the task pane (UI event wiring).
- `src/views/` — view components for products and templates.
- `src/models/` — data models and services for catalogs and products.
- `src/controllers/` — data/view controller for catalogs, products and templates.

## Requirements

- Node.js (16+ recommended) and `npm`.
- Office for the web or Office Desktop (Word/Excel) for sideloading/testing the add-in.

## Setup (Development)

1. Install dependencies:

```bash
npm install
```

2. Start the dev server (hot-reload UI):

```bash
npm run dev-server
```

3. Build for development (bundles files into the extension package):

```bash
npm run build:dev
```

## Run / Debug (Examples)

You can use the provided npm scripts and the available VS Code tasks to launch and debug the add-in for desktop Office apps. Example commands:

```bash
# Start and sideload the add-in for Excel Desktop
npm run start -- desktop --app excel

# Start and sideload the add-in for Word Desktop
npm run start -- desktop --app word

# Production build
npm run build
```

Alternatively, from the workspace tasks use the listed tasks such as `Build (Development)` or the `Debug: Word Desktop` task.

## Usage

1. Open the task pane in the Office host (Word/Excel) after sideloading the add-in.
2. Use the **Upload** control to select a catalog XML file.
3. Browse the catalog in the left tree view and select a product to view details on the right.
4. Use the **+** button or setup controls to insert products, BKP groups, or apply templates to the Word document.

## Important Files to Inspect

- [src/taskpane/taskpane.html](src/taskpane/taskpane.html) — UI markup and scripts for theme toggling and layout.
- [src/views/product.view.ts](src/views/product.view.ts) — product rendering logic.
- [src/models/product.model.service.ts](src/models/product.model.service.ts) — catalog parsing/service logic.

## Contributing

- Fork the repo, create a feature branch, and open a pull request with a clear description.
- Keep changes focused and add tests where appropriate.

## License

This project uses the MIT license (see project root or LICENSE if present).

---

If you'd like, I can also run the dev server or add a short CONTRIBUTING.md and a basic example catalog to `test/` for manual testing.
# Build Word add-ins using Office Add-ins Development Kit

Word add-ins are integrations built by third parties into Word by using [Word JavaScript API](https://learn.microsoft.com/en-us/office/dev/add-ins/reference/overview/word-add-ins-reference-overview) and [Office Platform capabilities](https://learn.microsoft.com/en-us/office/dev/add-ins/overview/office-add-ins).

## How to run this project

### Prerequisites

- Node.js (the latest LTS version). Visit the [Node.js site](https://nodejs.org/) to download and install the right version for your operating system. To verify that you've already installed these tools, run the commands `node -v` and `npm -v` in your terminal.
- Office connected to a Microsoft 365 subscription. You might qualify for a Microsoft 365 E5 developer subscription through the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program), see [FAQ](https://learn.microsoft.com/office/developer-program/microsoft-365-developer-program-faq#who-qualifies-for-a-microsoft-365-e5-developer-subscription-) for details. Alternatively, you can [sign up for a 1-month free trial](https://www.microsoft.com/microsoft-365/try?rtc=1) or [purchase a Microsoft 365 plan](https://www.microsoft.com/microsoft-365/buy/compare-all-microsoft-365-products).

### Run the add-in using Office Add-ins Development Kit extension

1. **Open the Office Add-ins Development Kit**
    
    In the **Activity Bar**, select the **Office Add-ins Development Kit** icon to open the extension.

1. **Preview Your Office Add-in (F5)**

    Select **Preview Your Office Add-in(F5)** to launch the add-in and debug the code. In the Quick Pick menu, select the option **Word Desktop (Edge Chromium)**.

    The extension then checks that the prerequisites are met before debugging starts. Check the terminal for detailed information if there are issues with your environment. After this process, the Word desktop application launches and sideloads the add-in.

1. **Stop Previewing Your Office Add-in**

    Once you are finished testing and debugging the add-in, select **Stop Previewing Your Office Add-in**. This closes the web server and removes the add-in from the registry and cache.

## Use the add-in project

The add-in project that you've created contains code for a basic task pane add-in.

## Explore the add-in code

To explore an Office add-in project, you can start with the key files listed below.

- The `./manifest.xml` file in the root directory of the project defines the settings and capabilities of the add-in.  <br>You can check whether your manifest file is valid by selecting **Validate Manifest File** option from the Office Add-ins Development Kit.
- The `./src/taskpane/taskpane.html` file contains the HTML markup for the task pane.
- The `./src/taskpane/taskpane.css` file contains the CSS that's applied to content in the task pane.
- The `./src/taskpane/taskpane.ts` file contains the Office JavaScript API code that facilitates interaction between the task pane and the Word application.

## Troubleshooting

If you have problems running the add-in, take these steps.

- Close any open instances of Word.
- Close the previous web server started for the add-in with the **Stop Previewing Your Office Add-in** Office Add-ins Development Kit extension option.

If you still have problems, see [troubleshoot development errors](https://learn.microsoft.com//office/dev/add-ins/testing/troubleshoot-development-errors) or [create a GitHub issue](https://aka.ms/officedevkitnewissue) and we'll help you.  

For information on running the add-in on Word on the web, see [Sideload Office Add-ins to Office on the web](https://learn.microsoft.com/office/dev/add-ins/testing/sideload-office-add-ins-for-testing).

For information on debugging on older versions of Office, see [Debug add-ins using developer tools in Microsoft Edge Legacy](https://learn.microsoft.com/office/dev/add-ins/testing/debug-add-ins-using-devtools-edge-legacy).

## Make code changes

All the information about Office Add-ins is found in our [official documentation](https://learn.microsoft.com/office/dev/add-ins/overview/office-add-ins). You can also explore more samples in the Office Add-ins Development Kit. Select **View Samples** to see more samples of real-world scenarios.

If you edit the manifest as part of your changes, use the **Validate Manifest File** option in the Office Add-ins Development Kit. This shows you errors in the manifest syntax.

## Engage with the team

Did you experience any problems? [Create an issue](https://aka.ms/officedevkitnewissue) and we'll help you out.

Want to learn more about new features and best practices for the Office platform? [Join the Microsoft Office Add-ins community call](https://learn.microsoft.com/office/dev/add-ins/overview/office-add-ins-community-call).

## Copyright

Copyright (c) 2024 Microsoft Corporation. All rights reserved.

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**