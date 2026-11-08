namespace probe.union_find_weighted;

using std.collection

# 带权并查集：`offset[x]` 是 value(x) 与 value(parent[x]) 的差。
structure WeightedSet {
    parent: ArrayList<i64>
    size: ArrayList<i64>
    offset: ArrayList<i64>
}

micro weighted_new(nodes: i64) -> WeightedSet {
    let mut parent: ArrayList<i64> = ArrayList::new(nodes as usize)
    let mut size: ArrayList<i64> = ArrayList::new(nodes as usize)
    let mut offset: ArrayList<i64> = ArrayList::new(nodes as usize)
    let mut index: i64 = 0
    while index < nodes {
        parent.push(index)
        size.push(1)
        offset.push(0)
        index = index + 1
    }
    return WeightedSet { parent: parent, size: size, offset: offset }
}

# 找根并压缩：先把父节点的偏移压到根，再拼上当前节点。
micro find_root(mut set: WeightedSet, node: i64) -> i64 {
    let parent: i64 = set.parent⁅node as usize⁆
    if parent == node {
        return node
    }
    let root: i64 = find_root(set, parent)
    set.offset.set_cardinal(node as usize, set.offset⁅node as usize⁆ + set.offset⁅parent as usize⁆)
    set.parent.set_cardinal(node as usize, root)
    return root
}

# delta = value(right) - value(left)；按小树挂大树，同时保持偏移。
micro union_weighted(mut set: WeightedSet, left: i64, right: i64, delta: i64) -> bool {
    let left_root: i64 = find_root(set, left)
    let right_root: i64 = find_root(set, right)
    if left_root == right_root {
        return false
    }
    if set.size⁅left_root as usize⁆ < set.size⁅right_root as usize⁆ {
        set.parent.set_cardinal(left_root as usize, right_root)
        set.offset.set_cardinal(left_root as usize, set.offset⁅right as usize⁆ - delta - set.offset⁅left as usize⁆)
        set.size.set_cardinal(right_root as usize, set.size⁅right_root as usize⁆ + set.size⁅left_root as usize⁆)
    } else {
        set.parent.set_cardinal(right_root as usize, left_root)
        set.offset.set_cardinal(right_root as usize, delta + set.offset⁅left as usize⁆ - set.offset⁅right as usize⁆)
        set.size.set_cardinal(left_root as usize, set.size⁅left_root as usize⁆ + set.size⁅right_root as usize⁆)
    }
    return true
}

# 同集合时返回 value(left) - value(right)，否则返回 -1。
micro distance(mut set: WeightedSet, left: i64, right: i64) -> i64 {
    let left_root: i64 = find_root(set, left)
    let right_root: i64 = find_root(set, right)
    if left_root != right_root {
        return -1
    }
    return set.offset⁅left as usize⁆ - set.offset⁅right as usize⁆
}

micro component_count(mut set: WeightedSet, nodes: i64) -> i64 {
    let mut count: i64 = 0
    let mut index: i64 = 0
    while index < nodes {
        if find_root(set, index) == index {
            count = count + 1
        }
        index = index + 1
    }
    return count
}

micro largest_component(mut set: WeightedSet, nodes: i64) -> i64 {
    let mut best: i64 = 0
    let mut index: i64 = 0
    while index < nodes {
        if find_root(set, index) == index && set.size⁅index as usize⁆ > best {
            best = set.size⁅index as usize⁆
        }
        index = index + 1
    }
    return best
}

# 十节点：{0,1,2,3}、{4,5,6}、{7,8} 与孤立 9 → 4 个集合。
[export(name: "componentCount")]
micro component_count_export() -> i64 {
    let mut set: WeightedSet = weighted_new(10)
    union_weighted(set, 0, 1, 0)
    union_weighted(set, 2, 3, 0)
    union_weighted(set, 4, 5, 0)
    union_weighted(set, 5, 6, 0)
    union_weighted(set, 7, 8, 0)
    union_weighted(set, 0, 2, 0)
    return component_count(set, 10)
}

# 最大集合大小为 4。
[export(name: "largestComponentSize")]
micro largest_component_size() -> i64 {
    let mut set: WeightedSet = weighted_new(10)
    union_weighted(set, 0, 1, 0)
    union_weighted(set, 2, 3, 0)
    union_weighted(set, 4, 5, 0)
    union_weighted(set, 5, 6, 0)
    union_weighted(set, 7, 8, 0)
    union_weighted(set, 0, 2, 0)
    return largest_component(set, 10)
}

# 带权关系：value(1)-value(0)=2、value(3)-value(2)=2、value(3)-value(1)=3，
# 因此 value(2)-value(0)=3。
[export(name: "weightedDistance")]
micro weighted_distance() -> i64 {
    let mut set: WeightedSet = weighted_new(5)
    union_weighted(set, 0, 1, 2)
    union_weighted(set, 2, 3, 2)
    union_weighted(set, 1, 3, 3)
    return distance(set, 2, 0)
}
