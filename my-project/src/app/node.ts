export class Node1{
  data: number;
  leftChild: Node1;
  rightChild: Node1;

  constructor(number:number){
    this.data = number;
    this.leftChild = null;
    this.rightChild = null;
  }

  hasLeftChild(): boolean{
    return this.leftChild !== null;
  }

  hasRightChild(): boolean{
    return this.rightChild !== null;
  }
}