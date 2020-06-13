import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScoreboardService {
  numWinsPlayer1: number = 0;
  numWinsPlayer2: number = 0;

  constructor() { }
}
