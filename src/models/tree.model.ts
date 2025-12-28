import { TreeNode } from "./tree-node.model";

export class TreeModel {
  private idCounter = 0;
  private rootNodes: TreeNode[] = [];

  loadFromRegisterSuche(register: Element): void {
    this.idCounter = 0;
    this.rootNodes = this.parse(register, 0);
  }

  getNodes(): readonly TreeNode[] {
    return this.rootNodes;
  }

  private parse(element: Element, level: number): TreeNode[] {
    const nodes: TreeNode[] = [];

    for (const child of Array.from(element.children)) {
      const isProductLeaf = /Nr$/.test(child.tagName);

      const label = child.getAttribute("Txt") ?? child.getAttribute("Name") ?? child.tagName;

      const value = isProductLeaf ? child.textContent?.trim() : undefined;

      nodes.push(
        new TreeNode(`node-${this.idCounter++}`, label, level, value, this.parse(child, level + 1))
      );
    }

    return nodes;
  }
}
