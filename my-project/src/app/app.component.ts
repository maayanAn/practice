import { Component, OnInit } from '@angular/core';
import { Node1 } from "src/app/node";
import { Matrix, MultiplyMatrix } from "src/app/matrix";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'my-project';
  tree: Node1;
  treeList: number[] = [];
  lcaArr:number[] = [];
  orgList: number[] = [];
  newList: string[] = [];
  array = new Array(1,2,3,-8,4,9,10);
  maxMul:number;
  answer:string = '';

  constructor(){
    this.orgList = [2,3,4,5,6];
  }
  //--------------------------------------------------------Q: max 3 numbers
  ngOnInit(){
    if (this.array.length > 2){
      this.findThreeMaxNumbers();
      this.maxSubPossitiveArray([1,2,3,-4,70]);
    }

    //Build tree
    this.tree = new Node1(1);
    this.tree.leftChild = new Node1(2);
    this.tree.rightChild = new Node1(3);
    this.tree.leftChild.leftChild = new Node1(4);
    this.tree.leftChild.rightChild = new Node1(5);
    this.tree.rightChild.leftChild = new Node1(6);
    this.tree.rightChild.rightChild = new Node1(7);

    //Check for LCA(last common ancestor)
    this.lcaArr.push(this.findLCA(4,5));
    this.lcaArr.push(this.findLCA(4,6));
    this.lcaArr.push(this.findLCA(3,4));
    this.lcaArr.push(this.findLCA(2,4));
  }

  findThreeMaxNumbers(): void {
    let negArray:number[] = [];
    let posArray:number[] = [];
    let currArray:Array<number> = [...this.array];
    this.maxMul = 1;    
    for (var index = 0; index < 3; index++) {
      let currMax: number = this.findMaxVal(currArray);
      if (currMax < 0) { 
        negArray.push(currMax);
      }else {
        posArray.push(currMax);
      }
      currArray.splice(currArray.indexOf(currMax),1);
    }
    if (posArray.length === 3){
      posArray.forEach(element => {
        this.maxMul *= element;
      });
    } else {
      this.handleNegatives(negArray, currArray, posArray);
    }
  }

  handleNegatives(negArray:number[], currArray:number[], posArray:number[]):void{
    switch(negArray.length){
      case(1):{
        var val: number = this.findMaxVal(currArray);
        this.maxMul *= posArray[0] * ((val > 0) ? val * posArray[1] : negArray[0] * val);
        break;
      }
      case(2):{
        this.maxMul *= negArray[0] * negArray[1] * posArray[0];
        break;
      }
      case(3):{
        //search for positives if possible
        var newMax = this.searchForPossitives(currArray);
        this.maxMul *= newMax * negArray[1] * ((newMax > 0) ? (negArray[0]) : negArray[2]);
        break;
      }
      default:{break;}
    }
  }
  searchForPossitives(currArray: number[]): number {
    let max = -1;
    while (max < 0 && currArray.length > 0){
      max = this.findMaxVal(currArray);
      currArray.splice(currArray.indexOf(max),1);
    }
    return max;
  }

  findMaxVal(currArray: number[]): number {
    let negNumber:boolean = false;
    let max: number = currArray[0];
    let temp:number;
    currArray.forEach(element => {
     temp = Math.abs(element);
      if (element < 0 && max < temp){
        max = temp;
        negNumber = true;
      } else if (max < element){
         max = element;
         negNumber = false;
        }
    });
    return negNumber ? max*(-1) : max;
  }
  //---------------------------------------------------------------------Q: new multiple list
  calcNewList():void {
    let preValue: number;
    let nextValue: number;
  
    for (var index = 0; index < this.orgList.length; index++) {
      preValue = (index === 0) ? this.orgList[0] : this.orgList[index - 1];
      nextValue = (index === this.orgList.length - 1) ? this.orgList[index] : this.orgList[index + 1];
      
      this.newList.push(`${preValue} * ${nextValue}`);
    }
  }
  //-------------------------------------------------------------Q: lowest common ancestor
  DFS(n: number, root:Node1): boolean {
    let wasFound: boolean = false;
    if (root !== null && root.data !== n && !wasFound) {
      this.treeList.push(root.data);
      if (root.hasLeftChild()){
        wasFound = this.DFS(n, root.leftChild);
        this.deleteLastNode(wasFound);
      }
      if (!wasFound && root.hasRightChild()){
        wasFound = this.DFS(n, root.rightChild);
        this.deleteLastNode(wasFound);
      }
    }
  
    if (root.data === n) {
      wasFound = true;
    } 
    return wasFound;
   }

   deleteLastNode(wasFound:boolean):void{
      if (!wasFound)
          this.treeList.splice((this.treeList.length - 1),1);
   }

   findLCA(n1:number, n2:number): number{
    this.treeList = []; 
    let n1List:number[] = this.DFS(n1, this.tree) ? this.treeList : [];
     if (n1List.length > 0){
      n1List.push(n1);
      this.treeList = [];
      let n2List:number[] = this.DFS(n2, this.tree)? this.treeList : [];
      if (n2List.length > 0){
        n2List.push(n2);
        for (let i=n1List.length - 1; i >= 0; i--){
          if (n2List.includes(n1List[i])){
              return n1List[i];
         }
        }
      }
     }
      return -1;
   }
  //-----------------------------------------------------Q:max sub positive Array
  maxSubPossitiveArray(A:number[]): void {
    let mylist:MultiplyMatrix = new MultiplyMatrix();
    let currlist:number[] = [];
    let currSum:number = 0;
    for(var i=0; i<A.length; i++){
        if (A[i] >= 0){
            currlist.push(A[i]);
            currSum += A[i];
        }else {
            mylist.matrix.push({list: currlist, sum: currSum});
            currlist = [];
            currSum = 0;
        }
    }

    if (currlist.length !== 0){
      mylist.matrix.push({list: currlist, sum: currSum});
    }

    let max = 0;
    let lastMaxIndex = 0;
    for (let j=0; j<mylist.matrix.length; j++){
        if (max < mylist.matrix[j].sum) {
            max = mylist.matrix[j].sum;
            lastMaxIndex = j;
        } else if (max === mylist.matrix[j].sum){
            if (mylist.matrix[j].list.length > mylist.matrix[lastMaxIndex].list.length)
                lastMaxIndex = j;
        }
    }
    this.answer = "[ ";
    mylist.matrix[lastMaxIndex].list.forEach(element => {
       this.answer+= element.toString() + ",";
    });
    this.answer = this.answer.slice(0,this.answer.length-1);
    this.answer+= " ]";      
  }
}
