from typing import List

import pulp


def post_process_result(lp_problem: pulp.LpProblem, digits: int) -> List[List[int]]:
    out_table: List[List[int]] = [[-1 for _ in range(digits)] for _ in range(digits)]
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
