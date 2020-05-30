import json
from math import sqrt
from typing import List

from aiohttp import web
import pulp


async def solve_sudoku(request: web.Request) -> web.Response:
    # Pre process table.
    request_table = '[' + request.rel_url.query['table'] + ']'
    table = json.loads(request_table)
    table = post_process_table(table=table)
    digits = 9

    # Instantiate linear programming problem.
    lp_sudoku_problem = pulp.LpProblem('SuDoKu solving', pulp.LpMaximize)
    lp_variables = get_sudoku_lp_variables(table=table, digits=digits)
    lp_sudoku_problem += sum(lp_variables), 'Z'  # Objective function.
    lp_sudoku_problem = add_lp_constraints(lp_problem=lp_sudoku_problem,
                                           lp_variables=lp_variables,
                                           digits=digits)

    # Actual solving.
    lp_sudoku_problem.solve()

    # If solution is not possible we return no table and the corresponding status.
    solution_status = pulp.LpStatus[lp_sudoku_problem.status]
    fill_status = 0
    if solution_status == 'Infeasible':
        fill_status = 1
    elif solution_status == 'Unbounded':
        fill_status = -1

    if fill_status != 0:
        return web.Response(
            status=200,
            body=json.dumps({'table': None, 'fillStatus': fill_status})
        )

    # Otherwise we create a new table.

    return web.Response(
        status=200,
        body=json.dumps({'table': post_process_result(lp_problem=lp_sudoku_problem, digits=digits),
                         'fillStatus': fill_status})
    )


def get_sudoku_lp_variables(table: List[List[int]], digits: int) -> List[pulp.LpVariable]:
    variable_list: List[pulp.LpVariable] = []
    for row in range(digits):
        for col in range(digits):
            for number in range(digits):
                val = table[row][col]
                lower_bound = 1 if val == number + 1 else 0
                upper_bound = max(lower_bound, 1 if val == -1 else 0)
                new_variable = pulp.LpVariable(name=f'row_{row}_col_{col}_number_{number+1}',
                                               lowBound=lower_bound, upBound=upper_bound,
                                               cat=pulp.const.LpInteger)
                variable_list.append(new_variable)

    return variable_list


def add_lp_constraints(lp_problem: pulp.LpProblem,
                       lp_variables: List[pulp.LpVariable],
                       digits: int) -> pulp.LpProblem:
    block_dim = int(sqrt(digits))
    # Add constraints for every digit.
    for number in range(digits):
        # Row and column constraints.
        for index in range(digits):
            # Row constraints.
            row_vars = [lp_variables[number + digits * (i + digits * index)] for i in range(digits)]
            var_sum = sum(row_vars)
            lp_problem += var_sum <= 1
            lp_problem += var_sum >= 1

            # Column constraints.
            col_vars = [lp_variables[number + digits * (index + digits * i)] for i in range(digits)]
            var_sum = sum(col_vars)
            lp_problem += var_sum <= 1
            lp_problem += var_sum >= 1

        # Block constraints.
        for block_row in range(block_dim):
            for block_col in range(block_dim):
                # Get constraints for specific block.
                block_vars: List[pulp.LpVariable] = []
                for row in range(block_dim):
                    row_index = block_row * block_dim + row
                    for col in range(block_dim):
                        col_index = block_col*block_dim + col
                        block_vars.append(lp_variables[number + digits * (col_index + digits * row_index)])

                var_sum = sum(block_vars)
                lp_problem += var_sum <= 1
                lp_problem += var_sum >= 1

    return lp_problem


def post_process_table(table: List[int]) -> List[List[int]]:
    n = 9
    return [table[n * i: n * (i + 1)] for i in range(n)]


def post_process_result(lp_problem: pulp.LpProblem, digits: int) -> List[List[int]]:
    out_table: List[List[int]] = [[-1]*digits]*digits
    variables = lp_problem.variables()
    for row_index in range(digits):
        for col_index in range(digits):
            for number in range(digits):
                variable = variables[number + digits * (col_index + digits * row_index)]
                if variable.varValue == 1:
                    out_table[row_index][col_index] = number + 1
                    # There is no need of looking for other values.
                    break
    return out_table
