namespace leetcode.design_hashset;

using std.collection;

# 集合本体是类内唯一的可变状态；三个方法共享同一份存储。
class MyHashSet {
    _items: HashSet<i64>
}

imply MyHashSet {
    micro new(): Self {
        let items: HashSet<i64> = HashSet::new()
        return MyHashSet { _items: items }
    }

    micro add(mut self, key: i64): unit {
        let inserted: bool = self._items.insert(key)
    }

    micro remove(mut self, key: i64): unit {
        let removed: bool = self._items.remove(key)
    }

    micro contains(self, key: i64): bool {
        return self._items.contains(key)
    }
}
