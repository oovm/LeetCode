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


class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.slots: "OrderedDict[int, int]" = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.slots:
            return -1
        self.slots.move_to_end(key)
        return self.slots[key]

    def put(self, key: int, value: int) -> None:
        if key in self.slots:
            self.slots.move_to_end(key)
        elif len(self.slots) >= self.capacity:
            self.slots.popitem(last=False)
        self.slots[key] = value
