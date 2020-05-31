from itertools import product
import json
from random import randint, shuffle
from typing import List

from aiohttp import web

from .utils.are_equal import are_equal
from .utils.get_lp_problem import get_lp_problem
from .utils.processing import post_process_result


async def create_sudoku(request: web.Request) -> web.Response:
    # Pre process inputs.
    block_rows = int(request.rel_url.query['block_rows'])
    block_cols = int(request.rel_url.query['block_cols'])
    digits = block_cols * block_rows

    # Get a random completed SuDoKu.
    out_table = get_random_sudoku(block_rows=block_rows, block_cols=block_cols)

    # Remove elements from SuDoKu until there are multiple solutions.
    removable_indexes = list(product(*[[i for i in range(digits)]]*2))
    while True:
        # Empty a given cell of the random sudoku.
        row_index, col_index = removable_indexes.pop(randint(0, len(removable_indexes) - 1))
        new_table = [row[:] for row in out_table]
        new_table[row_index][col_index] = -1

        # Check if the resulting table has multiple solutions.
        upper_problem = get_lp_problem(new_table, block_rows=block_rows, block_cols=block_cols)
        lower_problem = get_lp_problem(new_table, block_rows=block_rows, block_cols=block_cols, sense=1)
        upper_problem.solve()
        lower_problem.solve()

        # If so we end the loop since we have removed all possible values.
        if not are_equal(table_1=post_process_result(lp_problem=upper_problem, digits=digits),
                         table_2=post_process_result(lp_problem=lower_problem, digits=digits)):
            break
        # Otherwise we update de table by emptying the selected cell and continue emptying empty cells.
        else:
            out_table[row_index][col_index] = -1

    # Otherwise we create a new table.
    return web.Response(
        status=200,
        body=json.dumps({'table': out_table,
                         'fillStatus': 0})
    )


def get_random_sudoku(block_rows: int, block_cols: int) -> List[List[int]]:
    # Init variables.
    digits = block_cols * block_rows
    digit_list = [i+1 for i in range(digits)]
    shuffle(digit_list)

    # region initial sudoku creation.
    # First block row.
    row = digit_list[:]
    out_table: List[List[int]] = []
    for col in range(block_cols):
        out_table.append(row)
        row = row[block_cols:] + row[:block_cols]

    # Subsequent block rows.
    block_row = [row[:] for row in out_table]
    permutation = [(i + 1) % block_cols for i in range(block_cols)]
    for _ in range(block_cols - 1):
        # Permute every block rows.
        for block_col_index in range(block_rows):
            block_row = permute_sudoku_block_cols(table=block_row, block_col_index=block_col_index,
                                                  permutation=permutation)
        out_table.extend(block_row)
    # endregion

    # region SuDoKu permutation.
    cols_length_permutation = [i for i in range(block_cols)]
    rows_length_permutation = [i for i in range(block_rows)]

    # Apply block horizontal and vertical permutation.
    shuffle(rows_length_permutation)
    out_table = permute_sudoku_blocks_horizontally(table=out_table, permutation=rows_length_permutation)
    shuffle(cols_length_permutation)
    out_table = permute_sudoku_blocks_vertically(table=out_table, permutation=cols_length_permutation)

    # Apply rows permutation on every block row.
    for block_row_index in range(block_cols):
        shuffle(rows_length_permutation)
        out_table = permute_sudoku_block_rows(table=out_table, block_row_index=block_row_index,
                                              permutation=rows_length_permutation)

    # Apply columns permutation on every block column.
    for block_col_index in range(block_rows):
        shuffle(cols_length_permutation)
        out_table = permute_sudoku_block_cols(table=out_table, block_col_index=block_col_index,
                                              permutation=cols_length_permutation)

    # endregion.

    return out_table


def permute_sudoku_blocks_horizontally(table: List[List[int]], permutation: List[int]) -> List[List[int]]:
    # Setup.
    height = len(table)
    width = len(table[0])
    n_blocks = len(permutation)
    block_length = int(width / n_blocks)
    out_table = [row[:] for row in table]

    # Permutation.
    for dst_index, src_index in enumerate(permutation):
        for col in range(block_length):
            dst_col = dst_index * block_length + col
            src_col = src_index * block_length + col
            for row in range(height):
                out_table[row][dst_col] = table[row][src_col]

    return out_table


def permute_sudoku_blocks_vertically(table: List[List[int]], permutation: List[int]) -> List[List[int]]:
    # Setup.
    height = len(table)
    width = len(table[0])
    n_blocks = len(permutation)
    block_length = int(height / n_blocks)
    out_table = [row[:] for row in table]

    # Permutation.
    for dst_index, src_index in enumerate(permutation):
        for row in range(block_length):
            dst_row = dst_index * block_length + row
            src_row = src_index * block_length + row
            for col in range(width):
                out_table[dst_row][col] = table[src_row][col]

    return out_table


def permute_sudoku_block_rows(table: List[List[int]], block_row_index: int, permutation: List[int]) -> List[List[int]]:
    # Setup.
    width = len(table[0])
    block_length = len(permutation)
    out_table = [row[:] for row in table]

    # Permutation.
    for dst_index, src_index in enumerate(permutation):
        dst_row = block_row_index * block_length + dst_index
        src_row = block_row_index * block_length + src_index
        for col in range(width):
            out_table[dst_row][col] = table[src_row][col]

    return out_table


def permute_sudoku_block_cols(table: List[List[int]], block_col_index: int, permutation: List[int]) -> List[List[int]]:
    # Setup.
    height = len(table)
    block_length = len(permutation)
    out_table = [row[:] for row in table]

    # Permutation.
    for dst_index, src_index in enumerate(permutation):
        dst_col = block_col_index * block_length + dst_index
        src_col = block_col_index * block_length + src_index
        for row in range(height):
            out_table[row][dst_col] = table[row][src_col]

    return out_table
