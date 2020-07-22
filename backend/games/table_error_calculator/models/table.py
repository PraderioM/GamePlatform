from typing import List, Optional, Union


class Column:
    def __init__(self, title: str, number_list: List[Union[float, int]]):
        self.title = title
        self._number_list = number_list[:]

    def __len__(self) -> int:
        return len(self._number_list)

    def __str__(self) -> str:
        return self.title

    @property
    def number_list(self) -> List[Union[int, float]]:
        return self._number_list[:]

    @number_list.setter
    def number_list(self, n_list: List[Union[int, float]]):
        self._number_list = n_list[:]


class Table:
    # def __init__(self, columns: List[Column]):
    #     n_rows: Optional[int] = None
    #     for col in columns:
    #         if n_rows is None:
    #             n_rows = len(col)
    #
    #         assert len(col) == n_rows, 'All columns should have the same length.'
    #
    #     self._columns = columns[:]

    def __init__(self, cosas: int):
        self.cosas = cosas

    @classmethod
    def change_devuelve_cosas(cls, ret_val: int):
        cls.devuelve_cosas = lambda self: ret_val

    def devuelve_cosas(self):
        return self.cosas

    def get_latex_code(self) -> str:
        # todo implement.
        pass


if __name__ == '__main__':
    t1 = Table(cosas=1)
    t2 = Table(cosas=2)
    print(t1.devuelve_cosas())
    print(t1.cosas)
    print('')
    print(t2.devuelve_cosas())
    print(t2.cosas)

    Table.change_devuelve_cosas(3)
    print('\n')
    print(t1.devuelve_cosas())
    print(t1.cosas)
    print('')
    print(t2.devuelve_cosas())
    print(t2.cosas)
