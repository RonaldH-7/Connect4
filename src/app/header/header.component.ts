import { Component, OnInit } from '@angular/core';
import { ScoreboardService } from '../scoreboard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public scoreBoard: ScoreboardService) { }

  ngOnInit(): void {
  }

}
