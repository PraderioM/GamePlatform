import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription, PlayedCard, ChosenCard} from '../services/models';
import {GameResolution} from '../../services/models';
import {StateService} from '../services/state.service';
import {DescribeCard} from '../services/plays/describe.card';
import {ChooseCard} from '../services/plays/choose.card';
import {PlayCard} from '../services/plays/play.card';
import {EndTurn} from '../services/plays/end.turn';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css', '../../services/common.styles.css']
})
export class BoardComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() token: string;
  @Input() name: string;
  @Input() description: GameDescription;

  interval;
  gameResolution: GameResolution;
  isPlaying = true;
  link = 'https://www.libellud.com/wp-content/uploads/2019/06/DIXIT_ODYSSEY_RULES_EN-1.pdf';
  updateInterval = 500;

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.updateGame();
  }

  async updateGame() {
    // const description = await this.stateService.getGameUpdate(this.token, this.description.id);
    //
    // if (!(description === undefined || description == null) && description.id != null) {
    //   this.description = description;
    //
    //   if (this.hasGameEnded()) {
    //     await this.endGame();
    //     return;
    //   }
    // }
    // setTimeout(this.updateGame.bind(this), this.updateInterval);
  }

  async describeCard(play: DescribeCard) {
    await this.stateService.describeCard(this.token, play, this.description.id);
  }

  async playCard(play: PlayCard) {
    await this.stateService.playCard(this.token, play, this.description.id);
  }

  async chooseCard(play: ChooseCard) {
    await this.stateService.chooseCard(this.token, play, this.description.id);
  }

  async endGame() {
    clearInterval(this.interval);
    this.gameResolution = await this.stateService.endGame(this.token, this.description.id);
    this.isPlaying = false;
  }

  onBackToMenu() {
    clearInterval(this.interval);
    this.backToMenu.emit();
  }

  gameStarted() {
    if (this.description.playerList === undefined || this.description.playerList === null) {
      return  false;
    } else {
      for (const player of this.description.playerList) {
        if (player.name === null || player.name === undefined) {
          return false;
          }
        }
      }
    return true;
  }

  allPlayersChosen(): boolean {
    for (const player of this.description.playerList) {
      if (this.description.getCurrentPlayer().name === player.name) {
        continue;
      }

      if (player.chosenCardId == null) {
        return false;
      }
    }
    return true;
  }

  allPlayersPlayed(): boolean {
    for (const player of this.description.playerList) {
      if (player.playedCardId == null) {
        return false;
      }
    }
    return true;
  }

  async onTurnEnd() {
    await this.stateService.endTurn(this.token, new EndTurn(), this.description.id);
  }

  getAllPlayedCards(): PlayedCard[] {
    const playedCards: PlayedCard[] = [];
    for (const player of this.description.playerList) {
      if (player.playedCardId != null) {
        playedCards.push(new PlayedCard(player.name, player.playedCardId));
      }
    }
    return playedCards;
  }

  getAllChosenCards() {
    const chosenCards: ChosenCard[] = [];
    for (const player of this.description.playerList) {
      if (player.chosenCardId != null) {
        chosenCards.push(new ChosenCard(player.name, player.chosenCardId));
      }
    }
    return chosenCards;
  }

  getDeck(): number[] {
    for (const player of this.description.playerList) {
      if (player.name === this.name) {
        return player.deck;
      }
    }
    return [];
  }

  hasChosenCard() {
    for (const player of this.description.playerList) {
      if (player.name === this.name) {
        return player.chosenCardId != null;
      }
    }
    return false;
  }

  hasPlayedCard() {
    for (const player of this.description.playerList) {
      if (player.name === this.name) {
        return player.playedCardId != null;
      }
    }
    return false;
  }
}
