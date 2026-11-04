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

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def list_node(values: list):
    if not values:
        return None
    head = ListNode(values[0])
    p = head
    for val in values[1:]:
        node = ListNode(val)
        p.next = node
        p = node
    return head

def is_same_list(p1, p2):
    if p1 is None and p2 is None:
        return True
    if not p1 or not p2:
        return False
    return p1.val == p2.val and is_same_list(p1.next, p2.next)

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def tree_node(values: list):
    if not values:
        return None
    root = TreeNode(values[0])
    i = 1
    queue = deque()
    queue.append(root)
    while queue:
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def is_same_tree(p, q):
    if not p and not q:
        return True
    elif not p or not q:
        return False
    elif p.val != q.val:
        return False
    else:
        return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)

class Solution:
    def checkRecord(self, n: int) -> int:
        # 迭代版 DP：状态 (是否已用 A, 结尾连续 L 数)，避免 n 大时递归超限。
        mod = 10**9 + 7
        dp = [[0] * 3 for _ in range(2)]
        dp[0][0] = 1
        for _ in range(n):
            nxt = [[0] * 3 for _ in range(2)]
            for used_a in range(2):
                for late in range(3):
                    ways = dp[used_a][late]
                    if not ways:
                        continue
                    nxt[used_a][0] = (nxt[used_a][0] + ways) % mod
                    if used_a == 0:
                        nxt[1][0] = (nxt[1][0] + ways) % mod
                    if late < 2:
                        nxt[used_a][late + 1] = (nxt[used_a][late + 1] + ways) % mod
            dp = nxt
        return sum(sum(row) for row in dp) % mod
