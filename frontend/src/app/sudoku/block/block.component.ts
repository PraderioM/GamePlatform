import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {
  @Output() update = new EventEmitter<number[][]>();
  @Input() block: number[][];

  constructor() { }

  ngOnInit(): void {
  }

  updateBlock(newVal: number, rowIndex: number, colIndex: number) {
    this.block[rowIndex][colIndex] = newVal;
    this.update.emit(this.block);
  }

}
