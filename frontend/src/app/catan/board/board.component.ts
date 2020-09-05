import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription, MaterialsDeck, Offer} from '../services/models';
import {GameResolution} from '../../services/models';
import {StateService} from '../services/state.service';
import {MoveThiefPlay} from '../services/plays/move.thief';
import {BuildCity, BuildRoad, BuildSettlement} from '../services/plays/build';
import {ThrowDicePlay} from '../services/plays/throw.dice';
import {BuyDevelopment, PlayKnight, PlayMonopoly, PlayResources, PlayRoads} from '../services/plays/development';
import {EndTurnPlay} from '../services/plays/end.turn';
import {AcceptOffer, CommerceWithBank, MakeOffer, RejectOffer, WithdrawOffer} from '../services/plays/commerce';
import {DiscardPlay} from '../services/plays/discard';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() token: string;
  @Input() name: string;
  @Input() description: GameDescription;

  interval;
  gameResolution: GameResolution;
  isPlaying = true;
  buildingElement?: string = null;

  constructor(private stateService: StateService) { }

  resetVariables() {
    this.buildingElement = null;
  }

  ngOnInit() {
    this.interval = setInterval(() => {
      this.updateGame();
    }, 500);
  }

  async updateGame() {
    this.description = new GameDescription(this.description.players, this.description.plays, this.description.currentPlayer,
                                           this.description.turn, this.description.developmentDeck, this.description.materialsDeck,
                                           this.description.landList, this.description.extended, this.description.description,
                                           this.description.thiefPosition, this.description.toStealPlayers, this.description.knightPlayer,
                                           this.description.longRoadPlayer, this.description.discardCards, this.description.thiefMoved,
                                           this.description.toBuildRoads, this.description.lastDiceResult, this.description.hasEnded,
                                           this.description.offer, this.description.id);
    const description = await this.stateService.findGame(this.token, this.description.id);
    if (description.id != null) {
      this.description = description;
      if (description.hasEnded) {
        await this.endGame();
      }
    }
  }

  async onClickLand(landNumber: number) {
    this.resetVariables();
    if (!this.description.thiefMoved && this.description.getCurrentPlayer().name === this.name) {
      await this.stateService.moveThief(this.token, new MoveThiefPlay(landNumber), this.description.id);
    }
  }

  async onClickSegment(position: number[]) {
    if (this.description.turn < 2 * this.description.players.length && this.isCurrentPlayer()) {
      await this.stateService.makeBuildPlay(this.token,
        new BuildRoad(this.description.getCurrentPlayer().color, position),
        this.description.id);
    } else if ((this.description.toBuildRoads > 0 || this.buildingElement === 'road') && this.isCurrentPlayer()) {
      await this.stateService.makeBuildPlay(this.token,
        new BuildRoad(this.description.getCurrentPlayer().color, position),
        this.description.id);
    }
    this.resetVariables();
  }

  async onClickIntersection(position: number[]) {
    if (this.description.turn < 2 * this.description.players.length && this.isCurrentPlayer()) {
      await this.stateService.makeBuildPlay(this.token,
        new BuildSettlement(this.description.getCurrentPlayer().color, position),
        this.description.id);
    } else if (this.buildingElement === 'settlement' && this.isCurrentPlayer()) {
      await this.stateService.makeBuildPlay(this.token,
        new BuildSettlement(this.description.getCurrentPlayer().color, position),
        this.description.id);
    } else if (this.buildingElement === 'city' && this.isCurrentPlayer()) {
      await this.stateService.makeBuildPlay(this.token,
        new BuildCity(this.description.getCurrentPlayer().color, position),
        this.description.id);
    }
    this.resetVariables();
  }

  async buyDevelopment() {
    this.resetVariables();
    if (this.isCurrentPlayer() && this.description.getCurrentPlayer().diceThrown) {
      await this.stateService.buyDevelopment(this.token, new BuyDevelopment(), this.description.id);
    }
  }

  async throwDice() {
    this.resetVariables();
    if (this.isCurrentPlayer() && !this.description.getCurrentPlayer().diceThrown) {
      await this.stateService.throwDice(this.token, new ThrowDicePlay(), this.description.id);
    }
  }

  async makeOffer(offer: Offer) {
    this.resetVariables();
    await  this.stateService.makeOffer(this.token, new MakeOffer(offer), this.description.id);
  }
  async commerceWithBank(offer: Offer) {
    this.resetVariables();
    await  this.stateService.makeOffer(this.token, new CommerceWithBank(offer), this.description.id);
  }
  async acceptOffer() {
    this.resetVariables();
    await  this.stateService.acceptOffer(this.token, new AcceptOffer(), this.description.id);
  }
  async rejectOffer() {
    this.resetVariables();
    await  this.stateService.rejectOffer(this.token, new RejectOffer(), this.description.id);
  }
  async withdrawOffer() {
    this.resetVariables();
    await  this.stateService.withdrawOffer(this.token, new WithdrawOffer(), this.description.id);
  }

  async discardCards(discardedMaterials: MaterialsDeck) {
    this.resetVariables();
    await  this.stateService.discardPlay(this.token, new DiscardPlay(discardedMaterials), this.description.id);
  }

  async endTurn() {
    this.resetVariables();
    if (this.isCurrentPlayer() && this.description.getCurrentPlayer().diceThrown) {
      await this.stateService.endTurn(this.token, new EndTurnPlay(), this.description.id);
    }
  }


  async onPlayKnight(play: PlayKnight) {
    this.resetVariables();
    if (this.isCurrentPlayer()) {
      await this.stateService.playKnight(this.token, play, this.description.id);
    }
  }

  async onPlayMonopoly(play: PlayMonopoly) {
    this.resetVariables();
    if (this.isCurrentPlayer()) {
      await this.stateService.playMonopoly(this.token, play, this.description.id);
    }
  }

  async onPlayResources(play: PlayResources) {
    this.resetVariables();
    if (this.isCurrentPlayer()) {
      await this.stateService.playResources(this.token, play, this.description.id);
    }
  }

  async onPlayRoads(play: PlayRoads) {
    this.resetVariables();
    if (this.isCurrentPlayer()) {
      await this.stateService.playRoads(this.token, play, this.description.id);
    }
  }

  async endGame() {
    clearInterval(this.interval);
    this.gameResolution = await this.stateService.endGame(this.token, this.description.id);
    this.isPlaying = false;
  }

  updateBuildingElement(newBuildingElement: string) {
    this.resetVariables();
    if (this.isCurrentPlayer()) {
      this.buildingElement = newBuildingElement;
    }
  }

  onBackToMenu() {
    clearInterval(this.interval);
    this.backToMenu.emit();
  }

  isCurrentPlayer() {
    return this.description.getCurrentPlayer().name === this.name;
  }

  getDiceClass() {
    const isSetupTurn = this.description.turn < 2 * this.description.players.length;
    return {
      dice: true,
      'non-thrown-dice': this.isCurrentPlayer() && !this.description.getCurrentPlayer().diceThrown && !isSetupTurn,
    };
  }
}
