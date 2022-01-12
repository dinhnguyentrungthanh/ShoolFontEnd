import { MinigameComponent } from './minigame.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { ErrorHandler, NgModule } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { CommonModule } from '@angular/common';
import { AngularTetrisComponent } from './containers/angular-tetris/angular-tetris.component';

import { ButtonComponent } from './components/button/button.component';
import { ScreenDecorationComponent } from './components/screen-decoration/screen-decoration.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { NumberComponent } from './components/number/number.component';
import { ClockComponent } from './components/clock/clock.component';
import { PauseComponent } from './components/pause/pause.component';
import { SoundComponent } from './components/sound/sound.component';
import { NextComponent } from './components/next/next.component';
import { PointComponent } from './components/point/point.component';
import { LevelComponent } from './components/level/level.component';
import { StartLineComponent } from './components/start-line/start-line.component';
import { LogoComponent } from './components/logo/logo.component';
import { TwitterButtonComponent } from './components/twitter-button/twitter-button.component';
import { TileComponent } from './components/tile/tile.component';
import { GithubComponent } from './components/github/github.component';
import { MinigameRoutingModule } from './minigame-routing.module';



@NgModule({
  declarations: [
    MinigameComponent,
    AngularTetrisComponent,
    KeyboardComponent,
    ButtonComponent,
    ScreenDecorationComponent,
    MatrixComponent,
    NumberComponent,
    ClockComponent,
    SoundComponent,
    PauseComponent,
    PointComponent,
    NextComponent,
    LevelComponent,
    StartLineComponent,
    TileComponent,
    LogoComponent,
    GithubComponent,
    TwitterButtonComponent,
    MinigameComponent
  ],
  imports: [
    CommonModule,
    MinigameRoutingModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    }
  ],
  exports: [
    AngularTetrisComponent
  ]
})
export class MinigameModule { }
