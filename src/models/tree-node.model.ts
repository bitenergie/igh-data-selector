export class TreeNode {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly level: number,
    public readonly value?: string, // e.g. productId
    public readonly children: TreeNode[] = []
  ) {}

  get isLeaf(): boolean {
    return this.children.length === 0;
  }
}
