import enum
from random import randint
from typing import List, Tuple


def first_wins_second(first_play: int, second_play: int) -> bool:
    if first_play > second_play and first_play % 2 == 1 and second_play % 2 == 1:
        first_wins = False
    elif first_play < second_play and first_play % 2 == 1 and second_play % 2 == 0:
        first_wins = False
    elif first_play > second_play and first_play % 2 == 0 and second_play % 2 == 0:
        first_wins = False
    elif first_play < second_play and first_play % 2 == 0 and second_play % 2 == 1:
        first_wins = False
    else:
        first_wins = True

    return first_wins


class VictoryCriterion(enum.Enum):
    BY_PLAY = 0
    BY_PLAYER = 1


class Player:
    NAMED_PLAYS = ('Rock', 'Paper', 'Scissors', 'Lizard', 'Spock')

    def __init__(self, name: str, is_bot: bool = False):
        self.name = name
        self.is_bot = is_bot

    def make_play(self, n_plays: int) -> int:
        if self.is_bot:
            return randint(1, n_plays)
        else:
            return self.ask_human_play(n_plays=n_plays)

    def ask_human_play(self, n_plays: int) -> int:
        # Define message for asking input.
        input_message = f'What play do you wish to make, {self.name}?'
        named_plays = self.NAMED_PLAYS
        for play_number in range(n_plays):
            play_name = f'play_{play_number + 1}' if play_number >= len(named_plays) else named_plays[play_number]
            input_message += f'\n\t{play_number + 1}) {play_name}'

        input_message += '\n'

        # Ask play until input is correct.
        while True:
            selected_play_str = input(input_message)

            # Check if input is correct.
            if not selected_play_str.isnumeric():
                print(f'Play must be an integer but got `{selected_play_str}`')
                continue

            selected_play = int(selected_play_str)
            if selected_play < 1 or selected_play > n_plays:
                print(f'{self.name}, you troll...'
                      f'Please select one of the possible options.')
                continue

            # Todo clear console. (Put a lot of spaces?).
            return selected_play


class Game:

    def __init__(self, players: List[Player], n_plays: int = 3,
                 victory_criterion: VictoryCriterion = VictoryCriterion.BY_PLAY):
        assert n_plays % 2 == 1, 'Number of plays must be odd.'
        assert n_plays >= 3, f'Number of plays must be at least 3 but got {n_plays}'
        assert len(players) >= 2, f'Number of players must be at least 2 but got {len(players)}'
        assert isinstance(victory_criterion, VictoryCriterion)
        self._players = players[:]
        self.n_plays = n_plays
        self._victory_criterion = victory_criterion

    @classmethod
    def from_cli_inputs(cls) -> 'Game':
        human_players = cls.ask_human_players()
        bots = cls.ask_bot_players(n_human_players=len(human_players))
        n_plays = cls.ask_n_plays()
        victory_criterion = cls.ask_victory_criterion()
        return Game(players=human_players + bots, n_plays=n_plays, victory_criterion=victory_criterion)

    def play(self):
        round = 0
        while len(self._players) > 1:
            round += 1
            print(f'[ROUND {str(round)}]')
            winner_players = self.play_round()
            self._players = winner_players

        print(f'The winner is {self._players[0].name}')

    def play_round(self) -> List[Player]:
        play_list = [(player, player.make_play(n_plays=self.n_plays)) for player in self._players]
        return self._get_winner_players(play_list)

    @staticmethod
    def ask_human_players() -> List[Player]:
        return Game._ask_players(min_players=0, is_bot=False)

    @staticmethod
    def ask_bot_players(n_human_players: int) -> List[Player]:
        min_players = max(0, 2 - n_human_players)
        return Game._ask_players(min_players=min_players, is_bot=True)

    @staticmethod
    def ask_n_plays() -> int:
        while True:
            n_plays_str = input(f"Please insert number of plays:\t")

            # Check if input is valid. If not, repeat question.
            if not n_plays_str.isnumeric():
                print(f"`{n_plays_str} is not a valid number of players.")
                continue

            # Check if number of plays is an odd number, greater than or equal to 3.
            n_plays = int(n_plays_str)

            if n_plays % 2 == 0:
                print(f'Number of plays must be odd but got {n_plays}')
                continue
            elif n_plays < 3:
                print(f'Number of plays must be at least 3 but got {n_plays}')
                continue

            return n_plays

    @staticmethod
    def ask_victory_criterion() -> VictoryCriterion:
        input_message = 'What victory criterion do you wish to use?'
        for criterion in VictoryCriterion:
            input_message += f'\n\t{criterion.value}) {criterion.name.lower().replace("_", " ")}'

        input_message += '\n'

        while True:
            selected = input(input_message)

            for criterion in VictoryCriterion:
                if str(criterion.value) == selected or criterion.name == selected.upper().replace(' ', '_'):
                    return criterion

            print(f'Cannot recognize criterion `{selected}`. Please repeat the desired victory criterion.')

    @property
    def players(self) -> List[Player]:
        return self._players[:]

    def _get_winner_players(self, play_list: List[Tuple[Player, int]]) -> List[Player]:
        if self.victory_criterion == VictoryCriterion.BY_PLAY:
            return self._get_winner_players_by_play(play_list=play_list)
        elif self.victory_criterion == VictoryCriterion.BY_PLAYER:
            return self._get_winner_players_by_players(play_list=play_list)
        else:
            raise NotImplementedError(f'Winners selection for victory criterion {self.victory_criterion} '
                                      f'is not yet implemented.')

    def _get_winner_players_by_play(self, play_list: List[Tuple[Player, int]]) -> List[Player]:
        scores = []
        set_of_plays = set()
        # Creating a set of plays, with no repeated plays.
        for i, (player_1, play_1) in enumerate(play_list):
            set_of_plays.add(play_1)
        iterable_set_of_plays = list(set_of_plays)
        # Comparing each player's play to the set of non repeated plays.
        for i,(player_1, play_1) in enumerate(play_list):
            score = 0
            for j in iterable_set_of_plays:
                if play_1 == j:
                    continue
                elif first_wins_second(play_1, j):
                    score += 1
                elif first_wins_second(j, play_1):
                    score -= 1
            scores.append(score)
        # Take highest score.
        max_score = max(scores)
        # Take players which have max_score.
        return [player for (player, _), score in zip(play_list, scores) if score == max_score]

    def _get_winner_players_by_players(self, play_list: List[Tuple[Player, int]]) -> List[Player]:
        scores = []
        for i, (player_1, play_1) in enumerate(play_list):
            score = 0
            for j, (player_2, play_2) in enumerate(play_list):
                if i == j:
                    continue
                elif play_1 == play_2:
                    continue
                elif first_wins_second(play_1, play_2):
                    score += 1
                elif first_wins_second(play_2, play_1):
                    score -= 1
            scores.append(score)
        # Take highest score
        max_score = max(scores)
        # Take players which have max_score
        return [player for (player, _), score in zip(play_list, scores) if score == max_score]

    @staticmethod
    def _ask_players(min_players: int, is_bot: bool, min_automatic: int = 10) -> List[Player]:
        player_type = 'bot' if is_bot else 'human'
        player_list = []

        # Check if input is valid. If not, repeat question.
        while True:
            n_players_str = input(f"Please insert number of {player_type} players:\t")
            if not n_players_str.isnumeric():
                print(f"'{n_players_str}' is not a valid number of players.")
                continue
            elif int(n_players_str) < min_players:
                print(f"At least {min_players} players are needed.")
                continue
            elif n_players_str.isnumeric() and int(n_players_str) >= min_players:
                break

        # Parse string.
        n_players = int(n_players_str)

        # Give an option of automatic naming if number of players is greater than a fixed value.
        name_automatically = False
        if n_players >= min_automatic:
            while True:
                answer = input(f"Do you wish for the {player_type} players to be named automatically?: [Y/n]\t")
                if answer.lower() in ('', 'y', 'yes'):
                    name_automatically = True
                    break
                elif answer.lower() in ('n', 'no'):
                    name_automatically = False
                    break
                else:
                    print(f"I do not understand the answer `{answer}` please answer with `yes` or `no`.")
                    continue

        # Fill player list (humans).
        while len(player_list) < n_players:
            default_name = f'{player_type}_{len(player_list) + 1}'

            # If automatic naming mode is enabled we automatically name the players and continue.
            if name_automatically:
                player_list.append(Player(name=default_name, is_bot=is_bot))
                continue

            # Ask name. Use default if necessary.
            name = input(f"Please provide name for {player_type} player {len(player_list) + 1}: "
                         f"[{default_name}]\n\t")

            if name == '':
                name = default_name

            # Check for name repetition.
            already_exists = False
            for player in player_list:
                if player.name == name:
                    already_exists = True
                    break
            if already_exists:
                print(f'Name {name} has already been used. Try a different name.')
                continue

            # If name is new, create a new player from it.
            player = Player(name=name, is_bot=is_bot)
            player_list.append(player)

        return player_list

    @property
    def victory_criterion(self) -> VictoryCriterion:
        return self._victory_criterion


if __name__ == '__main__':
    game = Game.from_cli_inputs()
    game.play()
