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


class MyHashMap:
    def __init__(self):
        self.items: Dict[int, int] = {}

    def put(self, key: int, value: int) -> None:
        self.items[key] = value

    def get(self, key: int) -> int:
        return self.items.get(key, -1)

    def remove(self, key: int) -> None:
        self.items.pop(key, None)
