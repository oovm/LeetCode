namespace leetcode.lfu_cache;

using std.collection;

# 频次桶：`_heads` / `_tails` 记录每个频次桶的头尾节点下标，桶内是一条
# 并行数组表示的双向链表（头部最近使用，尾部桶内最久未使用）。
# `_min_freq` 只在桶被摘空时递增，因此淘汰时无需全表扫描。
class LFUCache {
    _capacity: usize
    _slots: HashMap<i64, i64>
    _keys: ArrayList<i64>
    _values: ArrayList<i64>
    _freqs: ArrayList<i64>
    _prev: ArrayList<i64>
    _next: ArrayList<i64>
    _heads: HashMap<i64, i64>
    _tails: HashMap<i64, i64>
    _min_freq: i64
}

imply LFUCache {
    [export(name: "LFUCache")]
    micro new(capacity: usize): Self {
        let slots: HashMap<i64, i64> = HashMap::new(0)
        let keys: ArrayList<i64> = ArrayList::new(0)
        let values: ArrayList<i64> = ArrayList::new(0)
        let freqs: ArrayList<i64> = ArrayList::new(0)
        let prev: ArrayList<i64> = ArrayList::new(0)
        let next: ArrayList<i64> = ArrayList::new(0)
        let heads: HashMap<i64, i64> = HashMap::new(0)
        let tails: HashMap<i64, i64> = HashMap::new(0)
        return LFUCache {
            _capacity: capacity,
            _slots: slots,
            _keys: keys,
            _values: values,
            _freqs: freqs,
            _prev: prev,
            _next: next,
            _heads: heads,
            _tails: tails,
            _min_freq: 0,
        }
    }

    # 从所在频次桶摘下节点，并维护桶的头尾索引。
    micro unlink(mut self, node: i64): unit {
        let at: usize = node as usize
        let freq: i64 = self._freqs⁅at⁆
        let previous: i64 = self._prev⁅at⁆
        let following: i64 = self._next⁅at⁆
        if previous != -1 {
            self._next⁅(previous as usize)⁆ = following
        } else if following != -1 {
            let replaced_head: Option<i64> = self._heads.insert(freq, following)
        } else {
            let dropped_head: Option<i64> = self._heads.remove(freq)
        }
        if following != -1 {
            self._prev⁅(following as usize)⁆ = previous
        } else if previous != -1 {
            let replaced_tail: Option<i64> = self._tails.insert(freq, previous)
        } else {
            let dropped_tail: Option<i64> = self._tails.remove(freq)
        }
        self._prev⁅at⁆ = -1
        self._next⁅at⁆ = -1
    }

    # 把节点接到指定频次桶的头部。
    micro push_front(mut self, node: i64, freq: i64): unit {
        let at: usize = node as usize
        self._freqs⁅at⁆ = freq
        self._prev⁅at⁆ = -1
        if self._heads.contains_key(freq) {
            let head_node: i64 = self._heads.get(freq).unwrap()
            self._next⁅at⁆ = head_node
            self._prev⁅(head_node as usize)⁆ = node
            let replaced_head: Option<i64> = self._heads.insert(freq, node)
        } else {
            self._next⁅at⁆ = -1
            let created_head: Option<i64> = self._heads.insert(freq, node)
            let created_tail: Option<i64> = self._tails.insert(freq, node)
        }
    }

    [export]
    micro get(mut self, key: i64): i64 {
        if !self._slots.contains_key(key) {
            return -1
        }
        let node: i64 = self._slots.get(key).unwrap()
        let at: usize = node as usize
        let value: i64 = self._values⁅at⁆
        let freq: i64 = self._freqs⁅at⁆
        self.unlink(node)
        self.push_front(node, freq + 1)
        if !self._heads.contains_key(freq) && self._min_freq == freq {
            self._min_freq = freq + 1
        }
        return value
    }

    [export]
    micro put(mut self, key: i64, value: i64): unit {
        if self._capacity == 0 {
            return
        }
        if self._slots.contains_key(key) {
            let node: i64 = self._slots.get(key).unwrap()
            let at: usize = node as usize
            self._values⁅at⁆ = value
            let freq: i64 = self._freqs⁅at⁆
            self.unlink(node)
            self.push_front(node, freq + 1)
            if !self._heads.contains_key(freq) && self._min_freq == freq {
                self._min_freq = freq + 1
            }
            return
        }
        if self._slots.length() >= self._capacity {
            let victim: i64 = self._tails.get(self._min_freq).unwrap()
            let victim_key: i64 = self._keys⁅victim as usize⁆
            let dropped: Option<i64> = self._slots.remove(victim_key)
            self.unlink(victim)
        }
        let node: i64 = self._keys.length() as i64
        self._keys.push(key)
        self._values.push(value)
        self._freqs.push(1)
        self._prev.push(-1)
        self._next.push(-1)
        let inserted: Option<i64> = self._slots.insert(key, node)
        self.push_front(node, 1)
        self._min_freq = 1
    }
}
