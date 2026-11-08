namespace probe.segment_tree;

using std.collection

# 递归线段树：节点 1 覆盖整个区间，树宽按 4n + 1 预留。
structure SegmentTree {
    values: ArrayList<i64>
    tree: ArrayList<i64>
}

micro build(mut segment: SegmentTree, node: i64, left: i64, right: i64) -> unit {
    if left == right {
        segment.tree.set_cardinal(node as usize, segment.values⁅left as usize⁆)
        return
    }
    let middle: i64 = (left + right) / 2
    build(segment, node * 2, left, middle)
    build(segment, node * 2 + 1, middle + 1, right)
    segment.tree.set_cardinal(node as usize, segment.tree⁅(node * 2) as usize⁆ + segment.tree⁅(node * 2 + 1) as usize⁆)
}

micro query_range(segment: SegmentTree, node: i64, left: i64, right: i64, from: i64, to: i64) -> i64 {
    if to < left || right < from {
        return 0
    }
    if from <= left && right <= to {
        return segment.tree⁅node as usize⁆
    }
    let middle: i64 = (left + right) / 2
    return query_range(segment, node * 2, left, middle, from, to) + query_range(segment, node * 2 + 1, middle + 1, right, from, to)
}

micro update_point(mut segment: SegmentTree, node: i64, left: i64, right: i64, position: i64, value: i64) -> unit {
    if left == right {
        segment.tree.set_cardinal(node as usize, value)
        return
    }
    let middle: i64 = (left + right) / 2
    if position <= middle {
        update_point(segment, node * 2, left, middle, position, value)
    } else {
        update_point(segment, node * 2 + 1, middle + 1, right, position, value)
    }
    segment.tree.set_cardinal(node as usize, segment.tree⁅(node * 2) as usize⁆ + segment.tree⁅(node * 2 + 1) as usize⁆)
}

micro segment_tree(values: ArrayList<i64>) -> SegmentTree {
    let count: i64 = values.length() as i64
    let mut tree: ArrayList<i64> = ArrayList::new((count * 4 + 1) as usize)
    let mut index: i64 = 0
    while index < count * 4 + 1 {
        tree.push(0)
        index = index + 1
    }
    let mut segment: SegmentTree = SegmentTree { values: values, tree: tree }
    build(segment, 1, 0, count - 1)
    return segment
}

micro sample_values() -> ArrayList<i64> {
    let mut values: ArrayList<i64> = ArrayList::new(6)
    values.push(2)
    values.push(4)
    values.push(5)
    values.push(7)
    values.push(8)
    values.push(9)
    return values
}

[export(name: "segmentRangeSum")]
micro segment_range_sum() -> i64 {
    let segment: SegmentTree = segment_tree(sample_values())
    let whole: i64 = query_range(segment, 1, 0, 5, 0, 5)
    let middle: i64 = query_range(segment, 1, 0, 5, 2, 4)
    return whole * 10 + middle
}

[export(name: "segmentPointUpdate")]
micro segment_point_update() -> i64 {
    let mut segment: SegmentTree = segment_tree(sample_values())
    update_point(segment, 1, 0, 5, 3, 10)
    return query_range(segment, 1, 0, 5, 0, 5)
}
