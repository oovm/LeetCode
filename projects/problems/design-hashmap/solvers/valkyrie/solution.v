namespace leetcode.design_hashmap;

using std.collection;

# 映射本体是类内唯一的可变状态；写入、读取、删除共享同一份存储。
class MyHashMap {
    _items: HashMap<i64, i64>
}

imply MyHashMap {
    [export(name: "MyHashMap")]
    micro new(): Self {
        let items: HashMap<i64, i64> = HashMap::new(0)
        return MyHashMap { _items: items }
    }

    [export]
    micro put(mut self, key: i64, value: i64): unit {
        let previous: Option<i64> = self._items.insert(key, value)
    }

    [export]
    micro get(self, key: i64): i64 {
        if !self._items.contains_key(key) {
            return -1
        }
        return self._items.get(key).unwrap()
    }

    [export]
    micro remove(mut self, key: i64): unit {
        let removed: Option<i64> = self._items.remove(key)
    }
}
