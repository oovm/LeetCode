namespace probe.memoized_dp;

using std.collection

# 递归 DP + `HashMap` 记忆化：命中缓存直接返回，未命中计算后写回。
micro fib(mut memo: HashMap<i64, i64>, n: i64) -> i64 {
    if n <= 1 {
        return n
    }
    let cached: Option<i64> = memo.get(n)
    if cached.is_some() {
        return cached.unwrap()
    }
    let value: i64 = fib(memo, n - 1) + fib(memo, n - 2)
    memo.insert(n, value)
    return value
}

# 网格路径：二维状态压成单键 `row * 64 + column` 存进同一个 Map。
micro grid_paths(mut memo: HashMap<i64, i64>, row: i64, column: i64) -> i64 {
    if row == 0 || column == 0 {
        return 1
    }
    let key: i64 = row * 64 + column
    let cached: Option<i64> = memo.get(key)
    if cached.is_some() {
        return cached.unwrap()
    }
    let value: i64 = grid_paths(memo, row - 1, column) + grid_paths(memo, row, column - 1)
    memo.insert(key, value)
    return value
}

[export(name: "memoizedFibonacci")]
micro memoized_fibonacci() -> i64 {
    let mut memo: HashMap<i64, i64> = HashMap::new(64)
    return fib(memo, 60)
}

[export(name: "memoizedGridPaths")]
micro memoized_grid_paths() -> i64 {
    let mut memo: HashMap<i64, i64> = HashMap::new(512)
    return grid_paths(memo, 19, 19)
}
