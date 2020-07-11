from typing import Dict

from .core import Play, register_play
from ..offer import Offer
from ..player import Player


@register_play(play_name='make_offer')
class MakeOffer(Play):

    def __init__(self, player: Player, offer: Offer):
        Play.__init__(self, player=player)
        self.offer = offer

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'MakeOffer':
        return MakeOffer(player=Player.from_frontend(json_data['player']),
                         offer=Offer.from_frontend(json_data['offer']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'MakeOffer':
        return MakeOffer(player=Player.from_database(json_data['player']),
                         offer=Offer.from_database(json_data['offer']))

    def can_update_game(self, game) -> bool:
        # Check previous conditions.
        Play.can_update_game(self, game)

        # Make sure there is some target player.
        if self.offer.n_target_players == 0:
            return False

        # Make sure individual making offer has materials.
        player = game.get_player_by_name(self.player.name)
        player_materials = player.materials_deck
        for material, number in self.offer.offered_deck.deck.items():
            if player_materials[material] < number:
                return False

        return True

    def update_game(self, game):
        game.offer = self.offer


@register_play(play_name='withdraw_offer')
class WithdrawOffer(Play):
    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'WithdrawOffer':
        return WithdrawOffer(player=Player.from_frontend(json_data['player']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'WithdrawOffer':
        return WithdrawOffer(player=Player.from_database(json_data['player']))

    def update_game(self, game):
        game.reset_offer()


@register_play(play_name='accept_offer')
class AcceptOffer(Play):
    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'AcceptOffer':
        return AcceptOffer(player=Player.from_frontend(json_data['player']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'AcceptOffer':
        return AcceptOffer(player=Player.from_database(json_data['player']))

    def can_update_game(self, game) -> bool:
        if game.offer is None:
            return False
        elif not game.offer.is_target_player(self.player):
            return False
        elif not game.thief_moved:
            return False
        elif game.discard_cards:
            return False
        elif game.to_build_roads > 0:
            return False
        elif not game.has_thrown_dice:
            return False

        # Make sure individual accepting offer has materials.
        player = game.get_player_by_name(self.player.name)
        player_materials = player.materials_deck
        for material, number in self.offer.requested_deck.deck.items():
            if player_materials[material] < number:
                return False

        return True

    def update_game(self, game):
        offer: Offer = game.offer
        offer_maker: Player = game.get_player_by_name(offer.offer_maker_name)
        player: Player = game.get_player_by_name(self.player.name)

        # offer maker gives materials.
        for material, number in offer.offered_deck.deck.items():
            offer_maker.update_materials(material=material, number=-number)
            player.update_materials(material=material, number=number)

        # offer maker receives materials.
        for material, number in offer.requested_deck.deck.items():
            player.update_materials(material=material, number=-number)
            offer_maker.update_materials(material=material, number=number)

        # Offer is removed.
        game.reset_offer()

    @staticmethod
    def game_pre_processing(game):
        pass


@register_play(play_name='reject_offer')
class RejectOffer(Play):
    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'RejectOffer':
        return RejectOffer(player=Player.from_frontend(json_data['player']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'RejectOffer':
        return RejectOffer(player=Player.from_database(json_data['player']))

    def can_update_game(self, game) -> bool:
        if game.offer is None:
            return False
        elif not game.offer.is_target_player(self.player):
            return False
        elif not game.thief_moved:
            return False
        elif game.discard_cards:
            return False
        elif game.to_build_roads > 0:
            return False
        elif not game.has_thrown_dice:
            return False
        else:
            return True

    def update_game(self, game):
        # Remove player.
        game.offer.remove_target_player(self.player.name)

        # Remove offer if no target players remain.
        if game.offer.n_target_players == 0:
            game.reset_offer()

    @staticmethod
    def game_pre_processing(game):
        pass


@register_play(play_name='commerce_with_bank')
class CommerceWithBank(Play):
    def __init__(self, player: Player, offer: Offer):
        Play.__init__(self, player=player)
        self.offer = offer

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'MakeOffer':
        return MakeOffer(player=Player.from_frontend(json_data['player']),
                         offer=Offer.from_frontend(json_data['offer']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'MakeOffer':
        return MakeOffer(player=Player.from_database(json_data['player']),
                         offer=Offer.from_database(json_data['offer']))

    def can_update_game(self, game) -> bool:
        # Check previous conditions.
        Play.can_update_game(self, game)

        # Commercing with bank exactly one exchange at a time is allowed. Check that only one material is requested.
        requested_material = None
        for material, number in self.offer.requested_deck.deck.items():
            if number == 0:
                continue
            elif number == 1:
                if requested_material is not None:
                    return False
                else:
                    requested_material = material
            else:
                return False
        if requested_material is None:
            return False

        # Commercing with bank exactly one exchange at a time is allowed.
        asked_material = None
        accepted_lands = set([port.land_type for port in game.get_player_ports(self.player.name)])
        for material, number in self.offer.requested_deck.deck.items():
            if number == 0:
                continue
            elif number in [2, 3, 4]:
                if asked_material is not None:
                    return False
                elif number == 2:
                    if material not in accepted_lands:
                        return False
                elif number == 3:
                    if None not in accepted_lands or material in accepted_lands:
                        return False
                else:
                    if None in accepted_lands or material in accepted_lands:
                        return False
                asked_material = material
            else:
                return False
        if asked_material is None:
            return False

        # Make sure individual making offer has materials.
        player = game.get_player_by_name(self.player.name)
        player_materials = player.materials_deck
        for material, number in self.offer.offered_deck.deck.items():
            if player_materials[material] < number:
                return False

        return True

    def update_game(self, game):
        player = game.get_player_by_name(self.player.name)

        # offer maker gives materials.
        for material, number in self.offer.offered_deck.deck.items():
            player.update_materials(material=material, number=-number)
            game.update_materials(material=material, number=number)

        # offer maker receives materials.
        for material, number in self.offer.requested_deck.deck.items():
            game.update_materials(material=material, number=-number)
            player.update_materials(material=material, number=number)
