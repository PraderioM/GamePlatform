import json
from typing import List

from aiohttp import web
import pulp

from backend.games.sudoku.endpoints.utils.are_equal import are_equal
from backend.games.sudoku.endpoints.utils.get_lp_problem import get_lp_problem
from backend.games.sudoku.endpoints.utils.processing import post_process_result


async def solve_sudoku(request: web.Request) -> web.Response:
    # Pre process table.
    request_table = '[' + request.rel_url.query['table'] + ']'
    table = json.loads(request_table)
    block_rows = int(request.rel_url.query['block_rows'])
    block_cols = int(request.rel_url.query['block_cols'])
    table = reshape_table(table=table, block_rows=block_rows, block_cols=block_cols)

    # Instantiate linear programming problem.
    lp_sudoku_problem = get_lp_problem(table=table, block_rows=block_rows, block_cols=block_cols)

    # Actual solving.
    lp_sudoku_problem.solve()

    # If solution is not possible we return no table and the corresponding status.
    solution_status = pulp.LpStatus[lp_sudoku_problem.status]
    if solution_status != 'Optimal':
        return web.Response(
            status=200,
            body=json.dumps({'table': None, 'fillStatus': 1})
        )

    # Get obtained optimal solution.
    out_table = post_process_result(lp_problem=lp_sudoku_problem, digits=block_rows * block_cols)

    # Check now if multiple solutions exist for the specified sudoku by minimizing instead of maximizing
    # the objective function.
    aux_lp_sudoku_problem = get_lp_problem(table=table, block_rows=block_rows, block_cols=block_cols,
                                           name='Aux SuDoKu solving', sense=pulp.LpMinimize)
    aux_lp_sudoku_problem.solve()
    aux_table = post_process_result(lp_problem=aux_lp_sudoku_problem, digits=block_rows * block_cols)
    if not are_equal(table_1=out_table, table_2=aux_table):
        return web.Response(
            status=200,
            body=json.dumps({'table': None, 'fillStatus': -1})
        )

    # Otherwise we create a new table.
    return web.Response(
        status=200,
        body=json.dumps({'table': out_table,
                         'fillStatus': 0})
    )


def reshape_table(table: List[int], block_rows: int, block_cols: int) -> List[List[int]]:
    digits = block_rows * block_cols
    return [table[digits * i: digits * (i + 1)] for i in range(digits)]
