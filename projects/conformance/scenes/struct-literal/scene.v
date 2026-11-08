namespace probe.struct_literal;

structure Point {
    x: i64
    y: i64
}

# 具名字段的结构体字面量。
[export(name: "constructPoint")]
micro construct_point() -> i64 {
    let point: Point = Point { x: 2, y: 3 }
    return point.x * 10 + point.y
}
