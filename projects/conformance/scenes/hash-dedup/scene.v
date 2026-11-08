namespace probe.hash_dedup;

using std.collection

# 自定义键：按 (a, b) 字典序比较，按坐标组合哈希。
structure Key {
    a: i64
    b: i64
}

imply Key: std::operator::Equal {
    infix `==`(self, other: Key): bool {
        if self.a != other.a {
            return false
        }
        return self.b == other.b
    }

    infix `!=`(self, other: Key): bool {
        return !(self == other)
    }
}

imply Key: std::collection::Hash {
    micro hash(self) -> usize {
        return ((self.a * 31 + self.b) as usize)
    }
}

micro compare_key(left: Key, right: Key) -> i32 {
    if left.a < right.a {
        return -1
    }
    if right.a < left.a {
        return 1
    }
    if left.b < right.b {
        return -1
    }
    if right.b < left.b {
        return 1
    }
    return 0
}

# 手写分桶去重：哈希定位桶，桶内用自定义相等判重。
structure Registry {
    buckets: ArrayList<ArrayList<Key>>
    unique: i64
}

micro registry_new(bucket_count: i64) -> Registry {
    let mut buckets: ArrayList<ArrayList<Key>> = ArrayList::new(bucket_count as usize)
    let mut index: i64 = 0
    while index < bucket_count {
        let mut row: ArrayList<Key> = ArrayList::new(2)
        buckets.push(row)
        index = index + 1
    }
    return Registry { buckets: buckets, unique: 0 }
}

micro bucket_slot(key: Key, bucket_count: i64) -> usize {
    return ((key.hash() as i64).bit_and(bucket_count - 1)) as usize
}

micro register(mut registry: Registry, key: Key, bucket_count: i64) -> bool {
    let slot: usize = bucket_slot(key, bucket_count)
    let mut present: bool = false
    loop existing in registry.buckets⁅slot⁆ {
        if existing == key {
            present = true
        }
    }
    if present {
        return false
    }
    registry.buckets⁅slot⁆.push(key)
    registry.unique = registry.unique + 1
    return true
}

micro registry_contains(registry: Registry, key: Key, bucket_count: i64) -> bool {
    let slot: usize = bucket_slot(key, bucket_count)
    let mut present: bool = false
    loop existing in registry.buckets⁅slot⁆ {
        if existing == key {
            present = true
        }
    }
    return present
}

micro sample_keys() -> ArrayList<Key> {
    let mut keys: ArrayList<Key> = ArrayList::new(5)
    keys.push(Key { a: 3, b: 2 })
    keys.push(Key { a: 1, b: 3 })
    keys.push(Key { a: 1, b: 2 })
    keys.push(Key { a: 2, b: 2 })
    keys.push(Key { a: 1, b: 2 })
    return keys
}

# 五个键里 (1,2) 重复一次，去重后 4 个。
[export(name: "bucketUniqueCount")]
micro bucket_unique_count() -> i64 {
    let mut registry: Registry = registry_new(8)
    register(registry, Key { a: 1, b: 2 }, 8)
    register(registry, Key { a: 1, b: 2 }, 8)
    register(registry, Key { a: 2, b: 2 }, 8)
    register(registry, Key { a: 3, b: 2 }, 8)
    register(registry, Key { a: 1, b: 3 }, 8)
    return registry.unique
}

# 命中的 (1,2) 与未命中的 (9,9) 必须区分。
[export(name: "bucketLookup")]
micro bucket_lookup() -> i64 {
    let mut registry: Registry = registry_new(8)
    register(registry, Key { a: 1, b: 2 }, 8)
    register(registry, Key { a: 2, b: 2 }, 8)
    let hit: bool = registry_contains(registry, Key { a: 1, b: 2 }, 8)
    let missing: bool = registry_contains(registry, Key { a: 9, b: 9 }, 8)
    if hit && !missing {
        return 1
    }
    return 0
}

# 排序后相邻去重：唯一键数应为 4。
[export(name: "sortedUniqueCount")]
micro sorted_unique_count() -> i64 {
    let mut keys: ArrayList<Key> = sample_keys()
    quick_sort(keys, compare_key)
    let mut unique: i64 = 0
    let mut index: i64 = 0
    while index < keys.length() as i64 {
        let mut fresh: bool = false
        if index == 0 {
            fresh = true
        } else if !(keys⁅index as usize⁆ == keys⁅(index - 1) as usize⁆) {
            fresh = true
        }
        if fresh {
            unique = unique + 1
        }
        index = index + 1
    }
    return unique
}

# 唯一键按 a*10+b 求和：12 + 13 + 22 + 32 = 79。
[export(name: "sortedUniqueChecksum")]
micro sorted_unique_checksum() -> i64 {
    let mut keys: ArrayList<Key> = sample_keys()
    quick_sort(keys, compare_key)
    let mut total: i64 = 0
    let mut index: i64 = 0
    while index < keys.length() as i64 {
        let mut fresh: bool = false
        if index == 0 {
            fresh = true
        } else if !(keys⁅index as usize⁆ == keys⁅(index - 1) as usize⁆) {
            fresh = true
        }
        if fresh {
            total = total + keys⁅index as usize⁆.a * 10 + keys⁅index as usize⁆.b
        }
        index = index + 1
    }
    return total
}
