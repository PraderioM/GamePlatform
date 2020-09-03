import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../services/models';
import {StateService} from '../../services/state.service';
import {Steal} from '../../services/plays/steal';

@Component({
  selector: 'app-steal-player',
  templateUrl: './steal-player.component.html',
  styleUrls: ['./steal-player.component.css']
})
export class StealPlayerComponent implements OnInit {
  @Input() toStealPlayers: Player[];
  @Input() token: string;
  @Input() gameId: string;

  constructor(private stateService: StateService) { }

  async stealPlayer(player: Player): Promise<void> {
    await this.stateService.stealPlayer(this.token, new Steal(player), this.gameId);
  }

  ngOnInit(): void {
  }

}
