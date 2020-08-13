from copy import deepcopy
import json
from random import choice, shuffle
from typing import Dict, List, Optional, Set, Union

import asyncpg

from backend.games.common.models.game import Game as BaseGame
from .development_deck import DevelopmentDeck, DevelopmentType
from .land import Land, LandType
from .materials_deck import MaterialsDeck
from .offer import Offer
from .play import Play, PlayKnight, BuildRoad, BuildSettlement, BuildCity, MoveThief
from .player import Player
from .board import BOARD, EXTENDED_BOARD, Board
from .port import Port


class Game(BaseGame):

    def __init__(self, current_player_index: int,
                 turn_index: int,
                 play_list: List[Play],
                 player_list: List[Player],
                 id_: Optional[str],
                 development_deck: Optional[DevelopmentDeck] = None,
                 materials_deck: Optional[MaterialsDeck] = None,
                 land_list: Optional[List[Land]] = None,
                 knight_player: Optional[Player] = None,
                 long_road_player: Optional[Player] = None,
                 offer: Optional[Offer] = None,
                 discard_cards: bool = False,
                 thief_moved: bool = True,
                 to_build_roads: int = 0,
                 extended: bool = False,
                 last_dice_result: int = 7):
        BaseGame.__init__(self, current_player_index=current_player_index, player_list=player_list,
                          play_list=play_list, id_=id_)
        self.turn_index = turn_index
        self._discard_cards = discard_cards
        self.last_dice_result = last_dice_result
        self.thief_moved = thief_moved
        self.to_build_roads = to_build_roads
        self._development_deck = self.get_empty_development_deck() if development_deck is None else development_deck
        self._materials_deck = self.get_empty_materials_deck() if materials_deck is None else materials_deck
        self._land_list = self.get_random_land_list() if land_list is None else land_list[:]
        self.offer = offer
        self._extended = extended
        self._knight_player = knight_player
        self._long_road_player = long_road_player

    # region frontend conversion.1
    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Game':
        raise NotImplementedError('from fronted is not implemented.')

    def to_frontend(self, db: Optional[asyncpg.Connection] = None,
                    description: str = 'successfully obtained game.') -> Dict:
        return {
            'currentPlayer': self.current_player_index,
            'turn': self.turn_index,
            'players': [player.to_frontend(points=self.get_player_score(player, compute_victory_points=False))
                        for player in self.player_list],
            'plays': [play.to_frontend() for play in self.play_list],
            'developmentDeck': self._development_deck.to_json(),
            'materialsDeck': self._materials_deck.to_json(),
            'landList': [land.to_json() for land in self._land_list],
            'offer': None if self.offer is None else self.offer.to_frontend(),
            'id': None if self.id is None else str(self.id),
            'extended': self._extended,
            'knightPlayer': None if self._knight_player is None else self._knight_player.to_frontend(),
            'longRoadPlayer': None if self._long_road_player is None else self._long_road_player.to_frontend(),
            'discardCards': self.discard_cards,
            'thiefMoved': self.thief_moved,
            'toBuildRoads': self.to_build_roads,
            'lastDiceResult': self.last_dice_result,
            'description': description,
        }

    def to_display(self) -> Dict:
        return {
            'gameId': None if self.id is None else str(self.id),
            'nPlayers': self.n_players,
            'nBots': self.n_bots,
            'currentPlayers': self.n_current,
            'extended': self._extended,
        }

    # region database conversion.
    @classmethod
    def from_database(cls, json_data: Dict) -> 'Game':
        players_list = [Player.from_database(json_data=player_data) for player_data in json.loads(json_data['players'])]
        play_list = [Play.from_database(json_data=player_data,
                                        all_players=players_list) for player_data in json.loads(json_data['plays'])]
        return Game(
            current_player_index=json_data['current_player_index'],
            turn_index=json_data['turn_index'],
            play_list=play_list,
            player_list=players_list,
            id_=json_data['id'],
            development_deck=DevelopmentDeck.from_json(json.loads(json_data['development_deck'])),
            materials_deck=MaterialsDeck.from_json(json.loads(json_data['materials_deck'])),
            land_list=[Land.from_json(land_data) for land_data in json.loads(json_data['land_list'])],
            offer=None if json_data['offer'] is None else Offer.from_database(json_data=json.loads(json_data['offer']),
                                                                              all_players=players_list),
            extended=json_data['extended'],
            knight_player=None if json_data['knight_player'] is None else Player.from_database(
                json_data=json.loads(json_data['knight_player'])
            ),
            long_road_player=None if json_data['long_road_player'] is None else Player.from_database(
                json_data=json.loads(json_data['long_road_player'])
            ),
            discard_cards=json_data['discard_cards'],
            thief_moved=json_data['thief_moved'],
            to_build_roads=json_data['to_build_roads'],
            last_dice_result=json_data['last_dice_result'],
        )

    def to_database(self) -> Dict[str, Union[str, int, bool, Dict]]:
        return {
            **BaseGame.to_database(self),
            **{
                'development_deck': self._development_deck.to_json(),
                'materials_deck': self._materials_deck.to_json(),
                'land_list': [land.to_json() for land in self._land_list],
                'offer': None if self.offer is None else self.offer.to_database(),
                'knight_player': None if self._knight_player is None else self._knight_player.to_frontend(),
                'long_road_player': None if self._long_road_player is None else self._long_road_player.to_frontend(),
                'turn_index': self.turn_index,
                'discard_cards': self.discard_cards,
                'thief_moved': self.thief_moved,
                'to_build_roads': self.to_build_roads,
                'last_dice_result': self.last_dice_result,
                'extended': self._extended,
            },
        }

    # endregion

    # region overwritten methods.
    def add_new_player_name(self, name: str):
        # Cannot add twice the same player.
        for player in self.player_list:
            if player.name == name:
                return

        if self.n_missing > 0:
            player_list = self.player_list[:]
            # Make player position random.
            shuffle(player_list)
            for player in player_list:
                if player.name is None and not player.is_bot:
                    player.name = name
                    break

    def add_play(self, play: Optional[Play]):
        if play is None:
            return
        if play.player.name in [player.name for player in self.player_list]:
            self.process_play(play)

    # endregion.

    # region play processing.
    def process_play(self, play: Play):
        is_setup = self.is_setup_round
        if (play.can_update_game(self) and is_setup) or (play.can_update_game_setup_round(self) and not is_setup):
            play.game_pre_processing(self)
            play.update_game(self)

    def reset_offer(self):
        self.offer = None

    def is_current_player(self, player: Player) -> bool:
        return self.player_list[self.current_player_index].name == player.name
    # endregion.

    # region materials.
    def give_materials(self, dice_number: int):
        thief_land_index = self.thief_land_index
        for land_index, (number, land_type) in enumerate(zip(self.board.number_list, self._land_list)):
            if land_index == thief_land_index:
                continue

            if number == dice_number:
                # Give one material at every settlement and two at every city.
                for play in self.play_list:
                    if not isinstance(play, BuildSettlement) and not isinstance(play, BuildCity):
                        continue
                    elif isinstance(play, BuildSettlement):
                        n_materials = 1
                    else:
                        n_materials = 2

                    # If land is not the specified one skip the rest.
                    if land_index not in play.position:
                        continue

                    # Update player materials.
                    for player in self.player_list:
                        if player.name == play.player.name:
                            player.update_materials(material=land_type, numer=n_materials)
                            self._materials_deck.update(material=land_type, number=-n_materials)

    def monopolize_materials(self, player_name: str, material: LandType):
        total_material_number = 0
        for player in self.player_list:
            player: Player = player
            player_material_number = player.materials_deck[material]
            total_material_number += player_material_number
            player.update_materials(material=material, number=-player_material_number)

        player = self.get_player_by_name(name=player_name)
        player.update_materials(material=material, number=total_material_number)

    def update_materials(self, material: LandType, number: int):
        self._materials_deck.update(material=material, number=number)
    # endregion.

    # region development.
    def remaining_development_cards(self) -> int:
        return self._development_deck.n_cards

    def update_development(self, development_card: DevelopmentType, number: int):
        self._development_deck.update(development_card=development_card, number=number)

    def pick_random_development_card(self, player: Player):
        development_card = self._development_deck.get_random_card()

        # If there is no card to return me return None
        if development_card is None:
            raise ValueError('No remaining development cards.')

        # Update number of cards for player and in deck.
        player.update_new_development(development_card=development_card, number=1)
        self.update_development(development_card=development_card, number=-1)
    # endregion.

    def move_thief(self, move_thief: MoveThief):
        # Get all previous thief moves and remove them. There should be at most one.
        previous_thief_moves = [play_index for play_index, play in enumerate(self.play_list)
                                if isinstance(play, MoveThief)]
        if len(previous_thief_moves) > 1:
            raise ValueError('More than one thief position registered.')

        # Remove previous thief movements. There should be at most one of them.
        for play_index in previous_thief_moves:
            self.play_list.pop(play_index)

        # Add last thief move.
        self.play_list.add(move_thief)
        self.thief_moved = True

    # region game resolution.
    @property
    def has_ended(self) -> bool:
        for player in self.player_list:
            if self.get_player_score(player, compute_victory_points=True) >= self.board.win_points:
                return True
        return False

    def get_player_score(self, player: Player, compute_victory_points: bool = True) -> int:
        # Compute play related points (development cards, settlements and cities).
        out_points = 0
        for play in self.play_list:
            if play.player.name == player.name:
                out_points += play.play_points

        # Get player victory points.
        if compute_victory_points:
            out_points += player.n_point

        # Compute knights points.
        knight_points = self._get_player_card_points(per_player_scores=self.get_per_player_knights(), player=player,
                                                     awarded_player=self._knight_player,
                                                     score_threshold=self.board.min_knights,
                                                     max_points=self.board.knights_points)
        if knight_points != 0:
            self._knight_player = Player(name=player.name, color=player.color)
        out_points += knight_points

        # Compute long road points.
        long_road_points = self._get_player_card_points(per_player_scores=self.get_per_player_longest_road(),
                                                        player=player,
                                                        awarded_player=self._long_road_player,
                                                        score_threshold=self.board.min_long_road,
                                                        max_points=self.board.long_road_points)
        if long_road_points != 0:
            self._long_road_player = Player(name=player.name, color=player.color)
        out_points += long_road_points

        return out_points

    def get_per_player_knights(self) -> Dict[str, int]:
        per_player_knights: Dict[str, int] = {player.name: 0 for player in self.player_list}
        for play in self.play_list:
            if isinstance(play, PlayKnight):
                per_player_knights[play.player.name] += 1
        return per_player_knights

    def get_per_player_longest_road(self) -> Dict[str, int]:
        return {player.name: len(self.get_player_longest_road(player)) for player in self.player_list}

    def get_player_longest_road(self, player: Player) -> List[Set[int]]:
        # Get all road building plays related to player.
        road_building_play_list = [play for play in self.play_list if
                                   isinstance(play, BuildRoad) and play.player.name == player.name]
        post_building_play_list = [play for play in self.player_list if
                                   isinstance(play, BuildSettlement) or isinstance(play, BuildCity)]
        all_roads = self._get_all_road_combinations(
            built_roads=[play.position for play in road_building_play_list],
            other_player_built_posts=[play.position for play in post_building_play_list
                                      if play.player.name != player.name]
        )

        # Get the longest road.
        if len(all_roads) == 0:
            return []
        else:
            return sorted(all_roads, key=lambda x: len(x))[-1]

    # endregion.

    # region initialization methods.
    def get_random_land_list(self, seed: Optional[float] = None) -> List[Land]:
        land_type_list = [LandType.Wood for _ in range(self.board.n_wood)]
        land_type_list += [LandType.Wheat for _ in range(self.board.n_wheat)]
        land_type_list += [LandType.Sheep for _ in range(self.board.n_sheep)]
        land_type_list += [LandType.Brick for _ in range(self.board.n_brick)]
        land_type_list += [LandType.Stone for _ in range(self.board.n_stone)]
        land_type_list += [LandType.Desert for _ in range(self.board.n_desert)]
        shuffle(land_type_list, random=seed)

        start_index = choice(self.board.start_positions)
        return [Land(land_type=land_type, number=number + start_index)
                for land_type, number in zip(land_type_list, self.board.number_list)]

    def get_empty_development_deck(self) -> DevelopmentDeck:
        return DevelopmentDeck(
            cards_dict={
                DevelopmentType.KNIGHT: self.board.n_knight,
                DevelopmentType.MONOPOLY: self.board.n_monopoly,
                DevelopmentType.RESOURCES: self.board.n_materials,
                DevelopmentType.ROADS: self.board.n_roads,
                DevelopmentType.POINT: self.board.n_point
            }
        )

    @staticmethod
    def get_empty_materials_deck() -> MaterialsDeck:
        return MaterialsDeck()

    # endregion.

    def end_turn(self):
        # end turn for every player.
        for player in self.player_list:
            player.end_turn()

        # reset offer to None.
        self.reset_offer()

        # Reset thief moved.
        self.thief_moved = True

        # Reset number of roads to build.
        self.to_build_roads = 0

        # Reset cards discarding.
        self.discard_cards = False

        # Update turn index.
        self.turn_index += 1

        # Update current player index.
        n_players = len(self.player_list)
        if n_players < self.turn_index < 2 * n_players:
            self.current_player_index -= 1
        elif n_players != self.turn_index:
            self.current_player_index += 1
        self.current_player_index = self.current_player_index % len(self.player_list)

    def get_player_by_name(self, name: str) -> Optional[Player]:
        for player in self.player_list:
            if player.name == name:
                return player
        return None

    # region distance methods.
    def get_segments(self) -> List[Set[int]]:
        found_segments: List[Set[int]] = []
        for intersection in self.board.intersections:
            pos_1, pos_2, pos_3 = [pos for pos in intersection]
            neighbour_segments = [(pos_1, pos_2), (pos_2, pos_3), (pos_3, pos_1)]
            for pos_1, pos_2 in neighbour_segments:
                if pos_1 >= 0 or pos_2 >= 0:
                    continue
                new_segment = {pos_1, pos_2}
                if new_segment not in found_segments:
                    found_segments.append(new_segment)

        return found_segments

    @staticmethod
    def get_neighbour_segments(intersection: Set[int]) -> List[Set[int]]:
        assert len(intersection) == 3
        pos_1, pos_2, pos_3 = [pos for pos in intersection]
        neighbour_segments = [(pos_1, pos_2), (pos_2, pos_3), (pos_3, pos_1)]
        return [{pos_1, pos_2} for pos_1, pos_2 in neighbour_segments if pos_1 >= 0 or pos_2 >= 0]

    def get_neighbour_intersections(self, segment: Set[int]) -> List[Set[int]]:
        assert len(segment) == 2
        pos_1, pos_2 = [pos for pos in segment]
        return [intersection for intersection in self.board.intersections
                if pos_1 in intersection and pos_2 in intersection]

    def intersection_distance(self, intersection_1: Set[int], intersection_2: Set[int]) -> int:
        explored_intersections: List[Set[int]] = []
        distance = 0
        frontier_intersections: List[Set[int]] = [intersection_1]

        while len(frontier_intersections) == 0:
            if intersection_2 in frontier_intersections:
                return distance

            # Frontier segments.
            explored_intersections.extend(frontier_intersections)
            frontier_segments = []
            for intersection in frontier_intersections:
                for segment in self.get_neighbour_segments(intersection):
                    if segment not in frontier_segments:
                        frontier_segments.append(segment)

            # Frontier intersections.
            frontier_intersections = []
            for segment in frontier_segments:
                for intersection in self.get_neighbour_intersections(segment=segment):
                    if intersection not in explored_intersections and intersection not in frontier_intersections:
                        frontier_intersections.append(intersection)

            distance += 1

        return distance

    # endregion.

    # region ports.
    def get_player_ports(self, player_name: str):
        all_ports = self.board.ports
        player_plays = [play for play in self.play_list if play.player.name == player_name]
        player_settlements = [play for play in player_plays
                              if isinstance(play, BuildSettlement) or isinstance(play, BuildCity)]
        player_ports: List[Port] = []
        for port in all_ports:
            for play in player_settlements:
                if play.position == port.intersections:
                    player_ports.append(port)
                    break

        return player_ports

    # endregion.

    # region properties.
    @property
    def board(self) -> Board:
        if self._extended:
            return deepcopy(EXTENDED_BOARD)
        else:
            return deepcopy(BOARD)

    @property
    def discard_cards(self) -> bool:
        if not self._discard_cards:
            return False

        for player in self.player_list:
            if not player.cards_discarded:
                return True

        self._discard_cards = False
        return False

    @discard_cards.setter
    def discard_cards(self, discard: bool):
        self._discard_cards = discard

    @property
    def thief_land_index(self) -> int:
        for play in self.play_list:
            if isinstance(play, MoveThief):
                return play.dst_index

        return sorted([index for index in self.desert_land_indexes])[0]

    @property
    def desert_land_indexes(self) -> Set[int]:
        indexes: Set[int] = set([])
        for land_index, land_type in enumerate(self._land_list):
            if land_type == LandType.Desert:
                indexes.add(land_index)

        return indexes

    @property
    def is_setup_round(self) -> bool:
        # Update current player index.
        n_players = len(self.player_list)
        return self.turn_index < 2 * n_players

    @property
    def is_second_setup_round(self) -> bool:
        # Update current player index.
        n_players = len(self.player_list)
        return n_players <= self.turn_index < 2 * n_players

    @property
    def has_thrown_dice(self) -> bool:
        current_player: Player = self.player_list[self.current_player_index]
        return current_player.dice_thrown

    @property
    def extended(self) -> bool:
        return self._extended

    # endregion

    @staticmethod
    def _get_player_card_points(per_player_scores: Dict[str, int], player: Player,
                                awarded_player: Optional[Player],
                                score_threshold: int, max_points: int) -> int:
        max_score = max([score for score in per_player_scores.values()])
        if per_player_scores[player.name] >= score_threshold:
            if awarded_player is None:
                return max_points
            elif awarded_player.name == player.name:
                if per_player_scores[player.name] >= max_score:
                    return max_points
            elif per_player_scores[player.name] > max_score:
                return max_points
        return 0

    def _get_all_road_combinations(self, built_roads: List[Set[int]],
                                   other_player_built_posts: List[Set[int]],
                                   previous_road_combination: Optional[List[Set[int]]] = None) -> List[List[Set[int]]]:
        road_combinations: List[List[Set[int]]] = []
        if previous_road_combination is None:
            previous_road_combination = []
            neighbour_roads = built_roads[:]
        else:
            last_road = previous_road_combination[-1]
            neighbour_intersections = self.get_neighbour_intersections(segment=last_road)
            neighbour_roads = []
            for intersection in neighbour_intersections:
                if intersection in other_player_built_posts:
                    continue
                for segment in self.get_neighbour_segments(intersection=intersection):
                    if segment in built_roads and segment not in previous_road_combination:
                        neighbour_roads.append(segment)

        # If we cannot further extend previous road we stop here.
        if len(neighbour_roads) == 0:
            if len(previous_road_combination) != 0:
                road_combinations.append(previous_road_combination[:])

        # Apply function recursively.
        for road in neighbour_roads:
            new_previous_road_combination = previous_road_combination[:] + [road]
            new_combinations = self._get_all_road_combinations(built_roads=built_roads,
                                                               other_player_built_posts=other_player_built_posts,
                                                               previous_road_combination=new_previous_road_combination)
            road_combinations.extend(new_combinations)

        return road_combinations
