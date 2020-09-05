from typing import List, Set, Tuple

CHANGE_ROW_SPEED = 1
CHANGE_COL_IN_ROW_SPEED = 2
CHANGE_COL_BETWEEN_ROWS_SPEED = 1


def start_position_generator(lower_width: int, lower_height: int, upper_height: int) -> List[int]:
    upper_width = lower_width + lower_height - upper_height

    start_positions = [0]
    for side_length in [lower_width, lower_height, upper_height, upper_width, upper_height]:
        last_position = start_positions[-1]
        start_positions.append(last_position + side_length - 1)

    return start_positions


def intersections_generator(lower_width: int, lower_height: int, upper_height: int) -> List[Set[int]]:
    internal_land_position_list = get_internal_land_position_list(lower_width, lower_height, upper_height)
    external_land_position_list = get_external_land_position_list(lower_width, lower_height, upper_height)
    land_position_list = internal_land_position_list + external_land_position_list

    # Get all pairs of three lands close to each other.
    intersections: List[Set[int]] = []
    for land_position_1 in land_position_list:
        # Iterate over all neighbours of the land.
        neighbours_1 = get_neighbours(land_position_1, land_position_list)

        for land_position_2 in neighbours_1:
            # for each of these neighbours get all of its neighbours and keep only those satisfying
            # that are also neighbours of the first land.
            neighbours_2 = get_neighbours(land_position_2, land_position_list)

            for land_position_3 in neighbours_2:
                # Keep only triplets of neighbours.
                if land_position_3 in neighbours_1:
                    new_intersection = {land_position_1[-1], land_position_2[-1], land_position_3[-1]}
                    if new_intersection not in intersections:
                        intersections.append(new_intersection)

    return intersections


def get_internal_land_position_list(lower_width: int,
                                    lower_height: int,
                                    upper_height: int) -> List[Tuple[int, int, int]]:
    upper_width = get_upper_width(lower_width, lower_height, upper_height)

    land_position_list: List[Tuple[int, int, int]] = []
    x, y, index, side = 0, 0, 0, 0

    while not is_position_in_list((x, y), land_position_list):
        land_position_list.append((x, y, index))

        # For first round positioning is directed.
        if index < lower_width - 1:
            side = 0
        elif index < lower_width + lower_height - 2:
            side = 1
        elif index < lower_width + lower_height + upper_height - 3:
            side = 2
        elif index < lower_width + lower_height + upper_height + upper_width - 4:
            side = 3
        elif index < lower_width + lower_height + upper_height + upper_width + upper_height - 5:
            side = 4
        elif index < lower_width + lower_height + upper_height + upper_width + upper_height + lower_height - 7:
            side = 5

        new_x, new_y = move_on_side((x, y), side)
        side_changes = 0
        while is_position_in_list((new_x, new_y), land_position_list) and side_changes < 6:
            side_changes += 1
            side = update_side(side)
            new_x, new_y = move_on_side((x, y), side)

        x, y = new_x, new_y
        index += 1

    return land_position_list


def get_external_land_position_list(lower_width: int,
                                    lower_height: int,
                                    upper_height: int) -> List[Tuple[int, int, int]]:
    upper_width = get_upper_width(lower_width, lower_height, upper_height)

    land_position_list: List[Tuple[int, int, int]] = []
    x, y = -CHANGE_COL_IN_ROW_SPEED, 0

    for index in range(2 * lower_height + 2 * upper_height + upper_width + lower_width):
        land_position_list.append((x, y, -index - 1))
        # Update current land according to current side.
        if index < lower_height - 1:
            x, y = move_on_side((x, y), 2)
        elif index < lower_height - 1 + upper_height:
            x, y = move_on_side((x, y), 1)
        elif index < lower_height - 1 + upper_height + upper_width:
            x, y = move_on_side((x, y), 0)
        elif index < lower_height - 1 + upper_height + upper_width + upper_height:
            x, y = move_on_side((x, y), 5)
        elif index < lower_height - 1 + upper_height + upper_width + upper_height + lower_height:
            x, y = move_on_side((x, y), 4)
        else:
            x, y = move_on_side((x, y), 3)

    return land_position_list


def get_upper_width(lower_width: int, lower_height: int, upper_height: int) -> int:
    return lower_width + lower_height - upper_height


def get_neighbours(land_position: Tuple[int, int, int],
                   land_position_list: List[Tuple[int, int, int]]) -> List[Tuple[int, int, int]]:
    x, y, _ = land_position

    neighbours: List[Tuple[int, int, int]] = []
    for neighbour in land_position_list:
        neighbour_x, neighbour_y, _ = neighbour
        if abs(neighbour_x - x) == CHANGE_COL_IN_ROW_SPEED and neighbour_y == y:
            neighbours.append(neighbour)
        elif abs(neighbour_x - x) == CHANGE_COL_BETWEEN_ROWS_SPEED and abs(neighbour_y - y) == CHANGE_ROW_SPEED:
            neighbours.append(neighbour)

    return neighbours


def is_position_in_list(position: Tuple[int, int], land_position_list: List[Tuple[int, int, int]]) -> bool:
    x, y = position
    for existing_x, existing_y, _ in land_position_list:
        if x == existing_x and y == existing_y:
            return True

    return False


def move_on_side(position: Tuple[int, int], side: int) -> Tuple[int, int]:
    side = side % 6
    x, y = position

    if side == 0:
        return x + CHANGE_COL_IN_ROW_SPEED, y
    elif side == 1:
        return x + CHANGE_COL_BETWEEN_ROWS_SPEED, y + CHANGE_ROW_SPEED
    elif side == 2:
        return x - CHANGE_COL_BETWEEN_ROWS_SPEED, y + CHANGE_ROW_SPEED
    elif side == 3:
        return x - CHANGE_COL_IN_ROW_SPEED, y
    elif side == 4:
        return x - CHANGE_COL_BETWEEN_ROWS_SPEED, y - CHANGE_ROW_SPEED
    else:
        return x + CHANGE_COL_BETWEEN_ROWS_SPEED, y - CHANGE_ROW_SPEED


def update_side(side: int) -> int:
    return (side + 1) % 6
