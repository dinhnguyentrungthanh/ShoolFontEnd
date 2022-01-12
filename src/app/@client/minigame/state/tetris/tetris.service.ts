/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable } from '@angular/core';
import { PieceFactory } from '../../factory/piece-factory';
import { CallBack } from '../../interface/callback';
import { GameState } from '../../interface/game-state';
import { Piece } from '../../interface/piece/piece';
import { EmptyTile } from '../../interface/tile/empty-tile';
import { FilledTile } from '../../interface/tile/filled-tile';
import { Tile } from '../../interface/tile/tile';
import { MatrixUtil } from '../../interface/utils/matrix';
import { Subscription, timer } from 'rxjs';
import { SoundManagerService } from '../../services/sound-manager.service';
import { TetrisQuery } from './tetris.query';
import { createInitialState, TetrisStore } from './tetris.store';
import { Speed } from '../../interface/speed';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class TetrisService {
  _gameInterval!: Subscription;

  constructor(
    private _store: TetrisStore,
    private _query: TetrisQuery,
    private _soundManager: SoundManagerService,
    private _pieceFactory: PieceFactory
  ) {}

  private get _locked(): boolean {
    return this._query.locked;
  }

  private get _current() {
    return this._query.current;
  }

  private get _next() {
    return this._query.next;
  }

  private get _matrix() {
    return this._query.matrix;
  }

  start() {
    if (!this._current) {
      this._setCurrentPiece(this._next);
      this._setNext();
    }
    const { initLine, initSpeed } = this._query.raw;
    this._store.update({
      points: 0,
      gameState: GameState.Started,
      matrix: MatrixUtil.getStartBoard(initLine),
      speed: initSpeed
    });
    this._unsubscribe();
    this.auto(MatrixUtil.getSpeedDelay(initSpeed));
    this._setLocked(false);
  }

  auto(delay: number) {
    this._gameInterval = timer(0, delay).subscribe(() => {
      this._update();
    });
  }

  resume() {
    if (!this._query.isPause) {
      return;
    }
    const { speed } = this._query.raw;
    this._store.update({
      locked: false,
      gameState: GameState.Started
    });
    this.auto(MatrixUtil.getSpeedDelay(speed));
  }

  pause() {
    if (!this._query.isPlaying) {
      return;
    }
    this._store.update({
      locked: true,
      gameState: GameState.Paused
    });
    this._unsubscribe();
  }

  reset() {
    const { sound } = this._query.raw;
    this._store.update({
      ...createInitialState(this._pieceFactory),
      sound
    });
  }

  moveLeft() {
    if (this._locked) {
      return;
    }
    this._clearPiece();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this._current && this._setCurrentPiece(this._current.store());
    this._current && this._setCurrentPiece(this._current.moveLeft());
    if (this._isCollidesLeft) {
      this._current && this._setCurrentPiece(this._current.revert());
    }
    this._drawPiece();
  }

  moveRight() {
    if (this._locked) {
      return;
    }
    this._clearPiece();
    this._current && this._setCurrentPiece(this._current.store());
    this._current && this._setCurrentPiece(this._current.moveRight());
    if (this._isCollidesRight) {
      this._current && this._setCurrentPiece(this._current.revert());
    }
    this._drawPiece();
  }

  rotate() {
    if (this._locked) {
      return;
    }

    this._clearPiece();
    this._current && this._setCurrentPiece(this._current.store());
    this._current && this._setCurrentPiece(this._current.rotate());
    while (this._isCollidesRight) {
      this._current && this._setCurrentPiece(this._current.moveLeft());
      if (this._isCollidesLeft) {
        this._current && this._setCurrentPiece(this._current.revert());
        break;
      }
    }
    this._drawPiece();
  }

  moveDown() {
    this._update();
  }

  drop() {
    if (this._locked) {
      return;
    }
    while (!this._isCollidesBottom) {
      this._clearPiece();
      this._current && this._setCurrentPiece(this._current.store());
      this._current && this._setCurrentPiece(this._current.moveDown());
    }
    this._current && this._setCurrentPiece(this._current.revert());
    this._drawPiece();
  }

  setSound() {
    const sound = this._query.raw.sound;
    this._store.update({
      sound: !sound
    });
  }

  decreaseLevel() {
    const { initSpeed } = this._query.raw;
    const newSpeed = (initSpeed - 1 < 1 ? 6 : initSpeed - 1) as Speed;
    this._store.update({
      initSpeed: newSpeed
    });
  }

  increaseLevel() {
    const { initSpeed } = this._query.raw;
    const newSpeed = (initSpeed + 1 > 6 ? 1 : initSpeed + 1) as Speed;
    this._store.update({
      initSpeed: newSpeed
    });
  }

  increaseStartLine() {
    const { initLine } = this._query.raw;
    const startLine = initLine + 1 > 10 ? 1 : initLine + 1;
    this._store.update({
      initLine: startLine
    });
  }

  decreaseStartLine() {
    const { initLine } = this._query.raw;
    const startLine = initLine - 1 < 1 ? 10 : initLine - 1;
    this._store.update({
      initLine: startLine
    });
  }

  private _update() {
    if (this._locked) {
      return;
    }
    this._setLocked(true);
    this._current && this._setCurrentPiece(this._current.revert());
    this._clearPiece();
    this._current && this._setCurrentPiece(this._current.store());
    this._current && this._setCurrentPiece(this._current.moveDown());

    if (this._isCollidesBottom) {
      this._current && this._setCurrentPiece(this._current.revert());
      this._markAsSolid();
      this._drawPiece();
      this._clearFullLines();
      this._setCurrentPiece(this._next);
      this._setNext();
      if (this._isGameOver) {
        this._onGameOver();
        return;
      }
    }

    this._drawPiece();
    this._setLocked(false);
  }

  private _clearFullLines() {
    let numberOfClearedLines = 0;
    const newMatrix = [...this._matrix];
    for (let row = MatrixUtil.Height - 1; row >= 0; row--) {
      const pos = row * MatrixUtil.Width;
      const fullRowTiles = newMatrix.slice(pos, pos + MatrixUtil.Width);
      const isFullRow = fullRowTiles.every((x) => x.isSolid);
      if (isFullRow) {
        numberOfClearedLines++;
        const topPortion = this._matrix.slice(0, row * MatrixUtil.Width);
        newMatrix.splice(0, ++row * MatrixUtil.Width, ...MatrixUtil.EmptyRow.concat(topPortion));
        this._setMatrix(newMatrix);
      }
    }
    this._setPointsAndSpeed(numberOfClearedLines);
  }

  private get _isGameOver() {
    this._current && this._setCurrentPiece(this._current.store());
    this._current && this._setCurrentPiece(this._current.moveDown());
    if (this._isCollidesBottom) {
      return true;
    }
    this._current && this._setCurrentPiece(this._current.revert());
    return false;
  }

  private _onGameOver() {
    this.pause();
    this._soundManager.gameOver();
    const { points, max, sound } = this._query.raw;
    const maxPoint = Math.max(points, max);
    LocalStorageService.setMaxPoint(maxPoint);
    this._store.update({
      ...createInitialState(this._pieceFactory),
      max: maxPoint,
      gameState: GameState.Over,
      sound
    });
  }

  private get _isCollidesBottom(): boolean {
    if (this._current && this._current.bottomRow >= MatrixUtil.Height) {
      return true;
    }
    return this._collides();
  }

  private get _isCollidesLeft(): boolean {
    if (this._current && this._current.leftCol < 0) {
      return true;
    }
    return this._collides();
  }

  private get _isCollidesRight(): boolean {
    if (this._current && this._current.rightCol as number >= MatrixUtil.Width) {
      return true;
    }
    return this._collides();
  }

  private _collides(): boolean {
    return (this._current as Piece).positionOnGrid.some((pos: number) => {
      if (this._matrix[pos].isSolid) {
        return true;
      }
      return false;
    });
  }

  private _drawPiece() {
    this._current && this._setCurrentPiece(this._current.clearStore());
    this._loopThroughPiecePosition((position) => {
      const isSolid = this._matrix[position].isSolid;
      this._updateMatrix(position, new FilledTile(isSolid));
    });
  }

  private _markAsSolid() {
    this._loopThroughPiecePosition((position) => {
      this._updateMatrix(position, new FilledTile(true));
    });
  }

  private _clearPiece() {
    this._loopThroughPiecePosition((position) => {
      this._updateMatrix(position, new EmptyTile());
    });
  }

  private _loopThroughPiecePosition(callback: CallBack<number>) {
    this._current && this._current.positionOnGrid.forEach((position: number) => {
      callback(position);
    });
  }

  private _setPointsAndSpeed(numberOfClearedLines: number) {
    if (!numberOfClearedLines) {
      return;
    }
    this._soundManager.clear();
    const { points, clearedLines, speed, initSpeed } = this._query.raw;
    const newLines = clearedLines + numberOfClearedLines;
    const newPoints = this._getPoints(numberOfClearedLines, points);
    const newSpeed = this._getSpeed(newLines, initSpeed);

    this._store.update({
      points: newPoints,
      clearedLines: newLines,
      speed: newSpeed
    });

    if (newSpeed !== speed) {
      this._unsubscribe();
      this.auto(MatrixUtil.getSpeedDelay(newSpeed));
    }
  }

  private _getSpeed(totalLines: number, initSpeed: number): Speed {
    const addedSpeed = Math.floor(totalLines / MatrixUtil.Height);
    let newSpeed = (initSpeed + addedSpeed) as Speed;
    newSpeed = newSpeed > 6 ? 6 : newSpeed;
    return newSpeed;
  }

  private _getPoints(numberOfClearedLines: number, points: number): number {
    const addedPoints = MatrixUtil.Points[numberOfClearedLines - 1];
    const newPoints = points + addedPoints;
    return newPoints > MatrixUtil.MaxPoint ? MatrixUtil.MaxPoint : newPoints;
  }

  private _updateMatrix(pos: number, tile: Tile) {
    const newMatrix = [...this._matrix];
    newMatrix[pos] = tile;
    this._setMatrix(newMatrix);
  }

  private _setNext() {
    this._store.update({
      next: this._pieceFactory.getRandomPiece()
    });
  }

  private _setCurrentPiece(piece: Piece) {
    this._store.update({
      current: piece
    });
  }

  private _setMatrix(matrix: Tile[]) {
    this._store.update({
      matrix
    });
  }

  private _setLocked(locked: boolean) {
    this._store.update({
      locked
    });
  }

  private _unsubscribe() {
    if (this._gameInterval) {
      this._gameInterval.unsubscribe();
    }
  }
}
