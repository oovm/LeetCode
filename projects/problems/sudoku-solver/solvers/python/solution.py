import heapq
import itertools
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
    def solveSudoku(self, board: List[List[str]]) -> None:
        # 最少候选优先的回溯：与逐格顺序 DFS 同语义，保证硬实例可终止。
        row = [[False] * 9 for _ in range(9)]
        col = [[False] * 9 for _ in range(9)]
        block = [[[False] * 9 for _ in range(3)] for _ in range(3)]
        empties = []
        for i in range(9):
            for j in range(9):
                if board[i][j] == '.':
                    empties.append((i, j))
                else:
                    v = int(board[i][j]) - 1
                    row[i][v] = col[j][v] = block[i // 3][j // 3][v] = True

        def dfs() -> bool:
            best = None
            best_opts: list[int] | None = None
            for i, j in empties:
                if board[i][j] != '.':
                    continue
                opts = [
                    v
                    for v in range(9)
                    if not (row[i][v] or col[j][v] or block[i // 3][j // 3][v])
                ]
                if not opts:
                    return False
                if best_opts is None or len(opts) < len(best_opts):
                    best, best_opts = (i, j), opts
                    if len(opts) == 1:
                        break
            if best is None:
                return True
            i, j = best
            for v in best_opts:
                row[i][v] = col[j][v] = block[i // 3][j // 3][v] = True
                board[i][j] = str(v + 1)
                if dfs():
                    return True
                row[i][v] = col[j][v] = block[i // 3][j // 3][v] = False
                board[i][j] = '.'
            return False

        dfs()
