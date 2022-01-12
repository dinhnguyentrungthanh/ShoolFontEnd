import { Component, OnInit } from '@angular/core';
import { Piece } from '../../interface/piece/piece';
import { TetrisQuery } from '../../state/tetris/tetris.query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tile, TileValue } from '../../interface/tile/tile';

@Component({
  selector: 't-next',
  templateUrl: './next.component.html',
  styleUrls: ['./next.component.scss']
})
export class NextComponent implements OnInit {
  next$!: Observable<Tile[][]>;
  constructor(private _tetrisQuery: TetrisQuery) {}

  ngOnInit(): void {
    this.next$ = this._tetrisQuery.next$.pipe(
      map((piece: Piece) => piece.next && piece.next.map((row: any[]) => row.map((value) => new Tile(value as TileValue))))
    ) as Observable<Tile[][]>;
  }
}
