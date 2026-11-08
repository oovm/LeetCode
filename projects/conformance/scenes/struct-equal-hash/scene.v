namespace probe.struct_equal_hash;

using std.collection

structure Point {
    x: i64
    y: i64
}

# 自定义相等：两个坐标都相同才算相等。
imply Point: std::operator::Equal {
    infix `==`(self, other: Point): bool {
        if self.x != other.x {
            return false
        }
        return self.y == other.y
    }

    infix `!=`(self, other: Point): bool {
        return !(self == other)
    }
}

# 自定义哈希：与相等口径一致，相等对象必须得到同一哈希。
imply Point: std::collection::Hash {
    micro hash(self) -> usize {
        return (self.x * 31 + self.y) as usize
    }
}

[export(name: "pointMapLookup")]
micro point_map_lookup() -> i64 {
    let mut scores: HashMap<Point, i64> = HashMap::new(8)
    scores.insert(Point { x: 1, y: 2 }, 10)
    scores.insert(Point { x: 1, y: 3 }, 20)
    scores.insert(Point { x: 2, y: 2 }, 30)
    let found: Option<i64> = scores.get(Point { x: 1, y: 2 })
    return found.unwrap_or(-1)
}

# 相等键覆盖写：第二次插入返回旧值，查询得到新值。
[export(name: "pointMapReplace")]
micro point_map_replace() -> i64 {
    let mut scores: HashMap<Point, i64> = HashMap::new(4)
    scores.insert(Point { x: 1, y: 2 }, 10)
    let previous: Option<i64> = scores.insert(Point { x: 1, y: 2 }, 11)
    let found: Option<i64> = scores.get(Point { x: 1, y: 2 })
    return previous.unwrap_or(-1) * 10 + found.unwrap_or(-1)
}

# 集合按自定义相等去重：四个插入里有一个重复，长度应为 3。
[export(name: "pointSetSize")]
micro point_set_size() -> i64 {
    let mut seen: HashSet<Point> = HashSet::new(8)
    seen.insert(Point { x: 1, y: 2 })
    seen.insert(Point { x: 1, y: 2 })
    seen.insert(Point { x: 2, y: 2 })
    seen.insert(Point { x: 3, y: 2 })
    return seen.length() as i64
}

[export(name: "pointSetContains")]
micro point_set_contains() -> i64 {
    let mut seen: HashSet<Point> = HashSet::new(8)
    seen.insert(Point { x: 1, y: 2 })
    let known: bool = seen.contains(Point { x: 1, y: 2 })
    let missing: bool = seen.contains(Point { x: 1, y: 3 })
    if known && !missing {
        return 1
    }
    return 0
}
