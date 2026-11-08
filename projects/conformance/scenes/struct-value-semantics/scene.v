namespace probe.struct_value_semantics;

structure Point {
    x: i64
    y: i64
}

# 语义探针：`let mut b = a` 后改写 b，观察 a 是否同步变化。
# 实测结果见 scene.json 的期望值与备注，语义未冻结，只记录不判定。
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
