import { Component, OnInit } from '@angular/core';
import { ScoreboardService } from '../scoreboard.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  player1Next: boolean = true;
  winner: boolean = false;
  prevRow: number;
  prevCol: number;
  canUndo: boolean = false;

  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ]

  constructor(private scoreBoard: ScoreboardService) { }

  ngOnInit(): void {
    // this.board = Array(6).fill(Array(7).fill(0));
  }

  newGame() {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ]
    this.player1Next = true;
    this.winner = false;
    this.canUndo = false;
  }

  undo() {
    if ((!this.canUndo) || (this.winner)) {
      return;
    }

    this.board[this.prevRow].splice(this.prevCol, 1, 0);
    this.player1Next = !this.player1Next;
    this.canUndo = false;
  }

  // Adds a 1 or 2 to the given coordinate depending on which player
  // Swaps the next player variable
  makeMove(col: number) {
    // Will prevent clicking if there is a winner
    if (this.winner) {
      return;
    }

    let row = this.getAvailableRow(col);
    if (row == -1) {
      return;
    }
    this.board[row].splice(col, 1, this.player1Next ? 1: 2);
    this.player1Next = !this.player1Next;

    this.canUndo = true;
    this.prevCol = col;
    this.prevRow = row;

    this.checkWinner(row, col);
  }

  onMouseOver(col: number) {
    if (window.innerWidth > 500) {
      // Will prevent clicking if there is a winner
      if (this.winner) {
        return;
      }

      let row = this.getAvailableRow(col);
      if (row == -1) {
        return;
      }
      this.board[row].splice(col, 1, this.player1Next ? 3: 4);
    }
  }

  onMouseLeave(col: number) {
    if (window.innerWidth > 500) {
      let row = this.getAvailableRow(col);
      if (row == -1) {
        return;
      }
      this.board[row].splice(col, 1, 0);
    }
  }

  get currentPlayer() {
    return this.player1Next ? 1 : 2;
  }

  getAvailableRow(col: number, row = 0) {
    let emptyTiles = [0, 3, 4]

    // If top row is not empty, return -1
    if (!emptyTiles.includes(this.board[0][col])) {
      return -1;
    }
    // If available row is the last row, return 5
    if (row+1 == 6) {
      return 5;
    }
    // If the next row is not empty, return current row
    if (!emptyTiles.includes(this.board[row+1][col])) {
      return row;
    }
    // If next row is empty, recursively call this function
    if (emptyTiles.includes(this.board[row+1][col])) {
      return this.getAvailableRow(col, row+1);
    }
  }

  get previousPlayer() {
    return this.player1Next ? 2 : 1;
  }

  checkWinner(row: number, col: number) {
    if (this.checkHorizontal(row, col) || this.checkVertical(row, col) || this.checkDiagonalRight(row, col) || this.checkDiagonalLeft(row, col)) {
      this.previousPlayer == 1 ? this.scoreBoard.numWinsPlayer1++ : this.scoreBoard.numWinsPlayer2++;
      this.winner = true;
    }
  }

  checkHorizontal(rowStart: number, colStart: number) {
    let player = this.previousPlayer;
    let count = 1;

    // Checks the number of matching pieces to the left
    let row = rowStart;
    let col = colStart;
    while ((this.board[row][col-1] != undefined) && (this.board[row][col-1] == player)) {
      count++;
      col--;
    }

    // Checks the number of matching pieces to the right
    row = rowStart;
    col = colStart;
    while ((this.board[row][col+1] != undefined) && (this.board[row][col+1] == player)) {
      count++;
      col++;
    }

    if (count >= 4) {
      return true;
    }

    return false;
  }

  checkVertical(row: number, col: number) {
    let player = this.previousPlayer;
    let count = 1;

    while ((this.board[row+1] != undefined) && (this.board[row+1][col] == player)) {
      count++;
      row++;
    }

    if (count >= 4) {
      return true;
    }

    return false;
  }

  checkDiagonalRight(rowStart: number, colStart: number) {
    let player = this.previousPlayer;
    let count = 1;

    let row = rowStart;
    let col = colStart;
    while ((row-1 >= 0) && (col+1 <= 6) && (this.board[row-1][col+1] == player)) {
      count++;
      row--;
      col++;
    }

    row = rowStart;
    col = colStart;
    while ((row+1 <= 5) && (col-1 >= 0) && (this.board[row+1][col-1] == player)) {
      count++;
      row++;
      col--;
    }

    if (count >= 4) {
      return true;
    }

    return false;
  }

  checkDiagonalLeft(rowStart: number, colStart: number) {
    let player = this.previousPlayer;
    let count = 1;

    let row = rowStart;
    let col = colStart;
    while ((row-1 >= 0) && (col-1 >= 0) && (this.board[row-1][col-1] == player)) {
      count++;
      row--;
      col--;
    }

    row = rowStart;
    col = colStart;
    while ((row+1 <= 5) && (col+1 <= 6) && (this.board[row+1][col+1] == player)) {
      count++;
      row++;
      col++;
    }

    if (count >= 4) {
      return true;
    }

    return false;
  }

}
