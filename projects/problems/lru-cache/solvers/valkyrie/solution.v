namespace leetcode.lru_cache;

using std.collection;

# 双向链表用并行数组表示：`_prev` / `_next` 存节点下标，`-1` 表示空端。
# 头部是最近使用，尾部是最久未使用；哈希表只负责「键 → 节点下标」。
class LRUCache {
    _capacity: usize
    _slots: HashMap<i64, i64>
    _keys: ArrayList<i64>
    _values: ArrayList<i64>
    _prev: ArrayList<i64>
    _next: ArrayList<i64>
    _head: i64
    _tail: i64
}

imply LRUCache {
    micro new(capacity: usize): Self {
        let slots: HashMap<i64, i64> = HashMap::new(0)
        let keys: ArrayList<i64> = ArrayList::new(0)
        let values: ArrayList<i64> = ArrayList::new(0)
        let prev: ArrayList<i64> = ArrayList::new(0)
        let next: ArrayList<i64> = ArrayList::new(0)
        return LRUCache {
            _capacity: capacity,
            _slots: slots,
            _keys: keys,
            _values: values,
            _prev: prev,
            _next: next,
            _head: -1,
            _tail: -1,
        }
    }

    micro detach(mut self, node: i64): unit {
        let at: usize = node as usize
        let previous: i64 = self._prev⁅at⁆
        let following: i64 = self._next⁅at⁆
        if previous != -1 {
            self._next⁅(previous as usize)⁆ = following
        } else {
            self._head = following
        }
        if following != -1 {
            self._prev⁅(following as usize)⁆ = previous
        } else {
            self._tail = previous
        }
    }

    micro attach_front(mut self, node: i64): unit {
        let at: usize = node as usize
        self._prev⁅at⁆ = -1
        self._next⁅at⁆ = self._head
        if self._head != -1 {
            self._prev⁅(self._head as usize)⁆ = node
        }
        self._head = node
        if self._tail == -1 {
            self._tail = node
        }
    }

    micro get(mut self, key: i64): i64 {
        if !self._slots.contains_key(key) {
            return -1
        }
        let node: i64 = self._slots.get(key).unwrap()
        let value: i64 = self._values⁅node as usize⁆
        self.detach(node)
        self.attach_front(node)
        return value
    }

    micro put(mut self, key: i64, value: i64): unit {
        if self._slots.contains_key(key) {
            let node: i64 = self._slots.get(key).unwrap()
            self._values⁅node as usize⁆ = value
            self.detach(node)
            self.attach_front(node)
            return
        }
        if self._slots.length() >= self._capacity {
            let victim: i64 = self._tail
            let victim_key: i64 = self._keys⁅victim as usize⁆
            let dropped: Option<i64> = self._slots.remove(victim_key)
            self.detach(victim)
        }
        let node: i64 = self._keys.length() as i64
        self._keys.push(key)
        self._values.push(value)
        self._prev.push(-1)
        self._next.push(-1)
        self._slots.insert(key, node)
        self.attach_front(node)
    }
}
