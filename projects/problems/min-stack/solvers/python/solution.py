import random
import functools
import collections
import string
import math
import datetime

from typing import *
from functools import *
from collections import *
from itertools import *
from heapq import *
from bisect import *
from string import *
from operator import *
from math import *

inf = float('inf')


class MinStack:
    def __init__(self):
        self.values: List[int] = []
        self.minimums: List[int] = []

    def push(self, value: int) -> None:
        current = value if not self.minimums else min(value, self.minimums[-1])
        self.values.append(value)
        self.minimums.append(current)

    def pop(self) -> None:
        self.values.pop()
        self.minimums.pop()

    def top(self) -> int:
        return self.values[-1]

    def getMin(self) -> int:
        return self.minimums[-1]
