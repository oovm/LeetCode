namespace probe.union_find;

using std.collection

# 并查集：父指针 + 按深度合并 + 路径压缩，连通分量个数随合并递减。
structure DisjointSet {
    parent: ArrayList<i64>
    depth: ArrayList<i64>
    components: i64
}

micro disjoint_set(size: i64) -> DisjointSet {
    let mut parent: ArrayList<i64> = ArrayList::new(size as usize)
    let mut depth: ArrayList<i64> = ArrayList::new(size as usize)
    let mut index: i64 = 0
    while index < size {
        parent.push(index)
        depth.push(0)
        index = index + 1
    }
    return DisjointSet { parent: parent, depth: depth, components: size }
}

# 先找根，再走第二遍把整条路径压到根上。
micro find_root(mut set: DisjointSet, node: i64) -> i64 {
    let mut root: i64 = node
    while set.parent⁅root as usize⁆ != root {
        root = set.parent⁅root as usize⁆
    }
    let mut cursor: i64 = node
    while set.parent⁅cursor as usize⁆ != root {
        let following: i64 = set.parent⁅cursor as usize⁆
        set.parent.set_cardinal(cursor as usize, root)
        cursor = following
    }
    return root
}

micro unite_nodes(mut set: DisjointSet, left: i64, right: i64) -> bool {
    let left_root: i64 = find_root(set, left)
    let right_root: i64 = find_root(set, right)
    if left_root == right_root {
        return false
    }
    let left_depth: i64 = set.depth⁅left_root as usize⁆
    let right_depth: i64 = set.depth⁅right_root as usize⁆
    if left_depth < right_depth {
        set.parent.set_cardinal(left_root as usize, right_root)
    } else {
        set.parent.set_cardinal(right_root as usize, left_root)
        if left_depth == right_depth {
            set.depth.set_cardinal(left_root as usize, left_depth + 1)
        }
    }
    set.components = set.components - 1
    return true
}

# 六个节点合并成两条链后剩余的分量数。
[export(name: "unionFindComponents")]
micro union_find_components() -> i64 {
    let mut set: DisjointSet = disjoint_set(6)
    unite_nodes(set, 0, 1)
    unite_nodes(set, 1, 2)
    unite_nodes(set, 2, 3)
    unite_nodes(set, 4, 5)
    return set.components
}

# 刻意构造 2 -> 3 -> 1 的父链，验证 `find_root` 之后 2 与 3 都直接挂到根 1。
[export(name: "unionFindCompressed")]
micro union_find_compressed() -> i64 {
    let mut set: DisjointSet = disjoint_set(4)
    unite_nodes(set, 1, 0)
    unite_nodes(set, 3, 2)
    unite_nodes(set, 1, 3)
    let root: i64 = find_root(set, 2)
    return root * 10 + set.parent⁅2 as usize⁆ * 10 + set.parent⁅3 as usize⁆
}
