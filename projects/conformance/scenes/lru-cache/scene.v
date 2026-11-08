namespace probe.lru_cache;

using std.collection

# 哈希表存槽位，四个并行数组当双向链表：prev / next 用 -1 作哨兵。
structure LruCache {
    capacity: i64
    slots: HashMap<i64, i64>
    keys: ArrayList<i64>
    values: ArrayList<i64>
    previous: ArrayList<i64>
    following: ArrayList<i64>
    head: i64
    tail: i64
}

micro empty_cache(capacity: i64) -> LruCache {
    let slots: HashMap<i64, i64> = HashMap::new(capacity as usize)
    let keys: ArrayList<i64> = ArrayList::new(4)
    let values: ArrayList<i64> = ArrayList::new(4)
    let previous: ArrayList<i64> = ArrayList::new(4)
    let following: ArrayList<i64> = ArrayList::new(4)
    return LruCache {
        capacity: capacity,
        slots: slots,
        keys: keys,
        values: values,
        previous: previous,
        following: following,
        head: -1,
        tail: -1
    }
}

micro unlink(mut cache: LruCache, index: i64) -> unit {
    let before: i64 = cache.previous⁅index as usize⁆
    let after: i64 = cache.following⁅index as usize⁆
    if before == -1 {
        cache.head = after
    } else {
        cache.following.set_cardinal(before as usize, after)
    }
    if after == -1 {
        cache.tail = before
    } else {
        cache.previous.set_cardinal(after as usize, before)
    }
}

micro link_front(mut cache: LruCache, index: i64) -> unit {
    cache.previous.set_cardinal(index as usize, -1)
    cache.following.set_cardinal(index as usize, cache.head)
    if cache.head != -1 {
        cache.previous.set_cardinal(cache.head as usize, index)
    }
    cache.head = index
    if cache.tail == -1 {
        cache.tail = index
    }
}

micro get(mut cache: LruCache, key: i64) -> i64 {
    let slot: Option<i64> = cache.slots.get(key)
    let index: i64 = slot.unwrap_or(-1)
    if index == -1 {
        return -1
    }
    unlink(cache, index)
    link_front(cache, index)
    return cache.values⁅index as usize⁆
}

micro put(mut cache: LruCache, key: i64, value: i64) -> unit {
    let slot: Option<i64> = cache.slots.get(key)
    let existing: i64 = slot.unwrap_or(-1)
    if existing != -1 {
        cache.values.set_cardinal(existing as usize, value)
        unlink(cache, existing)
        link_front(cache, existing)
        return
    }
    if cache.keys.length() as i64 == cache.capacity {
        let victim: i64 = cache.tail
        let victim_key: i64 = cache.keys⁅victim as usize⁆
        unlink(cache, victim)
        cache.slots.remove(victim_key)
    }
    let index: i64 = cache.keys.length() as i64
    cache.keys.push(key)
    cache.values.push(value)
    cache.previous.push(-1)
    cache.following.push(-1)
    cache.slots.insert(key, index)
    link_front(cache, index)
}

[export(name: "lruEvicted")]
micro lru_evicted() -> i64 {
    let mut cache: LruCache = empty_cache(2)
    put(cache, 1, 1)
    put(cache, 2, 2)
    get(cache, 1)
    put(cache, 3, 3)
    return get(cache, 2)
}

[export(name: "lruSurvivors")]
micro lru_survivors() -> i64 {
    let mut cache: LruCache = empty_cache(2)
    put(cache, 1, 1)
    put(cache, 2, 2)
    get(cache, 1)
    put(cache, 3, 3)
    return get(cache, 3) * 10 + get(cache, 1)
}
