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
    def stringCount(self, n: int) -> int:
        # 迭代 DP：状态 (l, e, t) 三个特殊字符的已出现计数，避免 n 大时递归超限。
        mod = 10**9 + 7
        dp = [[[0] * 2 for _ in range(3)] for _ in range(2)]
        dp[0][0][0] = 1
        for _ in range(n):
            nxt = [[[0] * 2 for _ in range(3)] for _ in range(2)]
            for l in range(2):
                for e in range(3):
                    for t in range(2):
                        ways = dp[l][e][t]
                        if not ways:
                            continue
                        nxt[l][e][t] = (nxt[l][e][t] + ways * 23) % mod
                        nxt[1][e][t] = (nxt[1][e][t] + ways) % mod
                        nxt[l][min(2, e + 1)][t] = (nxt[l][min(2, e + 1)][t] + ways) % mod
                        nxt[l][e][1] = (nxt[l][e][1] + ways) % mod
            dp = nxt
        return dp[1][2][1]
