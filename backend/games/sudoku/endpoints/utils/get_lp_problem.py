from typing import List

import pulp


def get_lp_problem(table: List[List[int]], block_rows: int, block_cols: int,
                   name='SuDoKu_solving', sense: int = 0) -> pulp.LpProblem:
    lp_sudoku_problem = pulp.LpProblem(name=name, sense=pulp.LpMaximize)
    lp_variables = get_lp_variables(table=table, digits=block_rows * block_cols)
    objective_func = get_objective_function(lp_variables=lp_variables, sense=sense)
    lp_sudoku_problem += objective_func, 'Z'  # Objective function.
    return add_lp_constraints(lp_problem=lp_sudoku_problem,
                              lp_variables=lp_variables,
                              block_rows=block_rows,
                              block_cols=block_cols)


def get_lp_variables(table: List[List[int]], digits: int) -> List[pulp.LpVariable]:
    variable_list: List[pulp.LpVariable] = []
    for row in range(digits):
        for col in range(digits):
            for number in range(digits):
                val = table[row][col]
                lower_bound = 1 if val == number + 1 else 0
                upper_bound = max(lower_bound, 1 if val == -1 else 0)
                new_variable = pulp.LpVariable(name=f'row_{row}_col_{col}_number_{number + 1}',
                                               lowBound=lower_bound, upBound=upper_bound,
                                               cat=pulp.const.LpInteger)
                variable_list.append(new_variable)

    return variable_list


def add_lp_constraints(lp_problem: pulp.LpProblem,
                       lp_variables: List[pulp.LpVariable],
                       block_rows: int, block_cols: int) -> pulp.LpProblem:
    digits = block_rows * block_cols
    # Add constraints for every digit.
    for number in range(digits):
        # Row and column constraints.
        for index in range(digits):
            # Row constraints.
            row_vars = [lp_variables[number + digits * (i + digits * index)] for i in range(digits)]
            lp_problem += sum(row_vars) == 1

            # Column constraints.
            col_vars = [lp_variables[number + digits * (index + digits * i)] for i in range(digits)]
            lp_problem += sum(col_vars) == 1

        # Block constraints.
        for block_row_index in range(block_cols):
            for block_col_index in range(block_rows):
                # Get constraints for specific block.
                block_vars: List[pulp.LpVariable] = []
                for block_row in range(block_rows):
                    row_index = block_row_index * block_rows + block_row
                    for block_col in range(block_cols):
                        col_index = block_col_index * block_cols + block_col
                        block_vars.append(lp_variables[number + digits * (col_index + digits * row_index)])

                lp_problem += sum(block_vars) == 1

    # Add constraints for filling SuDoKu.
    for row in range(digits):
        for col in range(digits):
            cell_vars = [lp_variables[i + digits * (col + digits * row)] for i in range(digits)]
            lp_problem += sum(cell_vars) == 1

    return lp_problem


def get_objective_function(lp_variables: List[pulp.LpVariable], sense: int = 0):
    lp_variables = lp_variables[:]
    if sense != 0:
        lp_variables.reverse()

    out_val = 0
    increasing_val = 1
    for var in lp_variables:
        out_val += increasing_val * var
        increasing_val += 2
    return out_val
