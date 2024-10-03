import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionModel } from 'src/app/models/questionModel';
import { DataHandlingService } from 'src/app/services/data-handling.service';

@Component({
  selector: 'app-highlighter',
  templateUrl: './highlighter.component.html',
  styleUrls: ['./highlighter.component.scss']
})
export class HighlighterComponent {

  //inital data
  formData: QuestionModel = {
    question: '',
    textPhrase: '',
    selectedOption: '',
    selectedIndex: []
  };

  wordsList: string[][] = []; // Array of arrays to hold lines of words
  // selectedIndexes: Set<number> = new Set(); // Store selected word indexes
  selections : Array<[[number, number], [number, number]]> = [];
  isSelecting: boolean = false;
  startIndex:string = '';
  endIndex:string = '';


  constructor(private dataHandler: DataHandlingService) {
    //data handler
    this.dataHandler = dataHandler;
  }

  ngOnInit() {
    //subscribing to data handlers data
    this.dataHandler.currentDataObservable.subscribe(data => {
      this.formData = { ...data };
      this.wordsList = this.getWords(this.formData.textPhrase);
      console.log(this.wordsList)

    });
  }
  getWords(text: string): string[][] {
    if (text === '') return []
    return text.trim().split('\n').map(line => line.trim().split(/\s+/).filter(word => word.length > 0));
  }


  startSelection(event:MouseEvent):void{
    event.preventDefault();
    this.isSelecting = true;
    let target : HTMLElement = event.target as HTMLElement;
    this.startIndex = target.id;
    this.endIndex = target.id;
  }

  updateSelection(event:MouseEvent):void{
    event.preventDefault();
    if(!this.isSelecting){return}
    let target : HTMLElement = event.target as HTMLElement;
    this.endIndex = target.id;
  }

  endSelection(event:MouseEvent):void{
    event.preventDefault();
    if(!this.isSelecting){
      return;
    }
    this.isSelecting = false;
    console.log("end")
    this.saveSelection();
  }
  compareIndices(indexA: [number, number], indexB: [number, number]): number {
    const [lineA, wordA] = indexA;
    const [lineB, wordB] = indexB;

    // Compare line indices
    if (lineA < lineB) {
        return -1; // indexA comes first
    } else if (lineA > lineB) {
        return 1; // indexB comes first
    } else {
        // Line indices are equal, compare word indices
        if (wordA < wordB) {
            return -1; // indexA comes first
        } else if (wordA > wordB) {
            return 1; // indexB comes first
        } else {
            return 0; // both indices are equal
        }
    }
}

showSelection(){

}

  saveSelection() {
    // Convert string IDs to numerical indices
    const start = this.getLineAndWordIndex(this.startIndex);
    const end = this.getLineAndWordIndex(this.endIndex);

    let value = this.compareIndices(start,end);

    if(value===-1){
      this.selections.push([start,end])
    }
    else{
      this.selections.push([end,start]);
    }

    console.log(this.selections);

    this.showSelection()

  }

getLineAndWordIndex(input: string): [number, number] {
    const parts = input.split('_'); // Split the string by '_'
    const lineIndex = parseInt(parts[0], 10); // Convert the first part to a number
    const wordIndex = parseInt(parts[1], 10); // Convert the second part to a number
    return [lineIndex, wordIndex]; // Return as a tuple
  }


}
