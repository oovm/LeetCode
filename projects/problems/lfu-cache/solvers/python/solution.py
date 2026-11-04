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


class LFUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.values: Dict[int, int] = {}
        self.freqs: Dict[int, int] = {}
        self.buckets: Dict[int, "OrderedDict[int, int]"] = {}
        self.min_freq = 0

    def get(self, key: int) -> int:
        if key not in self.values:
            return -1
        self._move(key, self.freqs[key] + 1)
        return self.values[key]

    def put(self, key: int, value: int) -> None:
        if self.capacity == 0:
            return
        if key in self.values:
            self.values[key] = value
            self._move(key, self.freqs[key] + 1)
            return
        if len(self.values) >= self.capacity:
            bucket = self.buckets[self.min_freq]
            victim = next(iter(bucket))
            del bucket[victim]
            if not bucket:
                del self.buckets[self.min_freq]
            del self.values[victim]
            del self.freqs[victim]
        self.values[key] = value
        self.freqs[key] = 1
        self._bucket_of(1)[key] = value
        self.min_freq = 1

    def _bucket_of(self, freq: int) -> "OrderedDict[int, int]":
        bucket = self.buckets.get(freq)
        if bucket is None:
            bucket = OrderedDict()
            self.buckets[freq] = bucket
        return bucket

    def _move(self, key: int, target: int) -> None:
        current = self.freqs[key]
        bucket = self.buckets[current]
        del bucket[key]
        if not bucket:
            del self.buckets[current]
            if self.min_freq == current:
                self.min_freq = target
        self.freqs[key] = target
        self._bucket_of(target)[key] = self.values[key]
