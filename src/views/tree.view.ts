import { TreeNode } from "../models/tree-node.model";

export class TreeView {
  constructor(private readonly container: HTMLElement) {}

  render(nodes: readonly TreeNode[], onLeafClick: (productId: string) => void): void {
    this.container.innerHTML = "";
    this.container.appendChild(this.createList(nodes, onLeafClick));
  }

  private createList(
    nodes: readonly TreeNode[],
    onLeafClick: (productId: string) => void
  ): HTMLUListElement {
    const ul: HTMLUListElement = document.createElement("ul");
    ul.className = "list-group";

    nodes.forEach((node) => {
      const li: HTMLLIElement = document.createElement("li");
      li.className = "list-group-item border-0 p-1";

      const row = document.createElement("div");
      row.className = "d-flex align-items-center";

      if (!node.isLeaf) {
        const toggle = document.createElement("button");
        toggle.className = "btn btn-sm btn-outline-secondary me-1";
        toggle.textContent = "+";

        toggle.onclick = () => {
          childList.classList.toggle("d-none");
          toggle.textContent = childList.classList.contains("d-none") ? "+" : "–";
        };

        row.appendChild(toggle);
      } else if (node.value) {
        row.classList.add("tree-leaf");
        row.style.cursor = "pointer";

        row.onclick = () => onLeafClick(node.value!);
      }

      const label = document.createElement("span");
      label.textContent = node.label;
      row.appendChild(label);

      li.appendChild(row);

      const childList = this.createList(node.children, onLeafClick);
      if (node.children.length > 0) {
        childList.classList.add("ms-1", "d-none");
        li.appendChild(childList);
      }

      ul.appendChild(li);
    });

    return ul;
  }
}
