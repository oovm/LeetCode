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


class MyHashSet:
    def __init__(self):
        self.items: Set[int] = set()

    def add(self, key: int) -> None:
        self.items.add(key)

    def remove(self, key: int) -> None:
        self.items.discard(key)

    def contains(self, key: int) -> bool:
        return key in self.items
