from typing import List


def are_equal(table_1: List[List[int]], table_2: List[List[int]]) -> bool:
    rows_1 = len(table_1)
    rows_2 = len(table_2)
    if rows_1 != rows_2:
        return False

    cols_1 = len(table_1)
    cols_2 = len(table_2)
    if cols_1 != cols_2:
        return False

    for row_1, row_2 in zip(table_1, table_2):
        for val_1, val_2 in zip(row_1, row_2):
            if val_1 != val_2:
                return False

    return True