namespace probe.struct_value_semantics;

structure Point {
    x: i64
    y: i64
}

# 值语义：`let mut b = a` 是逐字段拷贝，改写 b 不影响 a；
# `mut` 形参仍是调用方共享的接收者（见下方 helperMutationVisible）。
[export(name: "assignmentSharing")]
micro assignment_sharing() -> i64 {
    let a: Point = Point { x: 1, y: 2 }
    let mut b: Point = a
    b.x = 9
    return a.x * 10 + b.x
}

# 既有用法确认：`mut` 形参上的字段改写对调用方可见
# （`scenes/union-find`、`scenes/segment-tree` 都依赖这一条）。
micro shift_x(mut point: Point, delta: i64): unit {
    point.x = point.x + delta
}

[export(name: "helperMutationVisible")]
micro helper_mutation_visible() -> i64 {
    let mut origin: Point = Point { x: 4, y: 0 }
    shift_x(origin, 5)
    shift_x(origin, 3)
    return origin.x
}
