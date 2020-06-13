import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  player1Next: boolean = true;
  winner: boolean = false;

  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ]

  constructor() { }

  ngOnInit(): void {
    // this.board = Array(6).fill(Array(7).fill(0));
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

    this.checkWinner(row, col);
  }

  onMouseOver(col: number) {
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

  onMouseLeave(col: number) {
    let row = this.getAvailableRow(col);
    if (row == -1) {
      return;
    }
    this.board[row].splice(col, 1, 0);
  }

  get currentPlayer() {
    return this.player1Next ? 1 : 2;
  }

  // Test for ghost row
  getAvailableRow(col: number, row = 0) {
    // If top row is not empty, return -1
    if ((this.board[0][col] != 0) && (this.board[0][col] != 3) && (this.board[0][col] != 4)) {
      return -1;
    }
    // If available row is the last row, return 5
    if (row+1 == 6) {
      return 5;
    }
    // If the next row is not empty, return current row
    if ((this.board[row+1][col] != 0) && (this.board[row+1][col] != 3) && (this.board[row+1][col] != 4)) {
      return row;
    }
    // If next row is empty, recursively call this function
    if ((this.board[row+1][col] == 0) || (this.board[row+1][col] == 3) || (this.board[row+1][col] == 4)) {
      return this.getAvailableRow(col, row+1);
    }
  }

  get previousPlayer() {
    return this.player1Next ? 2 : 1;
  }

  checkWinner(row: number, col: number) {
    if (this.checkHorizontal(row, col) || this.checkVertical(row, col) || this.checkDiagonalRight(row, col) || this.checkDiagonalLeft(row, col)) {
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
