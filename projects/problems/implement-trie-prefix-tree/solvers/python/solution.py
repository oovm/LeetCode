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


class Trie:
    def __init__(self):
        self.children: List[Dict[str, int]] = [{}]
        self.ends: List[bool] = [False]

    def insert(self, word: str) -> None:
        node = 0
        for ch in word:
            if ch not in self.children[node]:
                self.children[node][ch] = len(self.children)
                self.children.append({})
                self.ends.append(False)
            node = self.children[node][ch]
        self.ends[node] = True

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node != -1 and self.ends[node]

    def startsWith(self, prefix: str) -> bool:
        return self._walk(prefix) != -1

    def _walk(self, word: str) -> int:
        node = 0
        for ch in word:
            if ch not in self.children[node]:
                return -1
            node = self.children[node][ch]
        return node
