import { Component, OnInit } from '@angular/core';
import { FilledTile } from '../../interface/tile/filled-tile';

@Component({
  selector: 't-screen-decoration',
  templateUrl: './screen-decoration.component.html',
  styleUrls: ['./screen-decoration.component.scss']
})
export class ScreenDecorationComponent implements OnInit {
  title = 'Mini Game';
  filled = new FilledTile();
  constructor() {}

  ngOnInit(): void {}
}
