namespace probe.dp_interval_knapsack;

using std.collection

micro min_of(a: i64, b: i64) -> i64 {
    if a < b {
        return a
    }
    return b
}

micro max_of(a: i64, b: i64) -> i64 {
    if a > b {
        return a
    }
    return b
}

# 区间 DP：矩阵链最小乘法次数，二维表压进一维。
micro matrix_chain(dimensions: ArrayList<i64>) -> i64 {
    let count: i64 = dimensions.length() as i64 - 1
    let stride: i64 = count + 1
    let size: usize = ((count + 1) * stride) as usize
    let mut table: ArrayList<i64> = ArrayList::new(size)
    let mut filled: i64 = 0
    while filled < (count + 1) * stride {
        table.push(0)
        filled = filled + 1
    }
    let mut span: i64 = 2
    while span <= count {
        let mut left: i64 = 1
        while left <= count - span + 1 {
            let right: i64 = left + span - 1
            table.set_cardinal((left * stride + right) as usize, 1000000000)
            let mut split: i64 = left
            while split < right {
                let cost: i64 = table⁅(left * stride + split) as usize⁆ + table⁅((split + 1) * stride + right) as usize⁆ + dimensions⁅(left - 1) as usize⁆ * dimensions⁅split as usize⁆ * dimensions⁅right as usize⁆
                let best: i64 = min_of(table⁅(left * stride + right) as usize⁆, cost)
                table.set_cardinal((left * stride + right) as usize, best)
                split = split + 1
            }
            left = left + 1
        }
        span = span + 1
    }
    return table⁅(1 * stride + count) as usize⁆
}

# 0/1 背包：容量倒序，保证每件物品只用一次。
micro knapsack_01(weights: ArrayList<i64>, values: ArrayList<i64>, capacity: i64) -> i64 {
    let mut best: ArrayList<i64> = ArrayList::new((capacity + 1) as usize)
    let mut index: i64 = 0
    while index <= capacity {
        best.push(0)
        index = index + 1
    }
    let mut item: i64 = 0
    while item < weights.length() as i64 {
        let weight: i64 = weights⁅item as usize⁆
        let value: i64 = values⁅item as usize⁆
        let mut room: i64 = capacity
        while room >= weight {
            let candidate: i64 = best⁅(room - weight) as usize⁆ + value
            best.set_cardinal(room as usize, max_of(best⁅room as usize⁆, candidate))
            room = room - 1
        }
        item = item + 1
    }
    return best⁅capacity as usize⁆
}

# 完全背包：容量正序，允许同一件物品重复取。
micro knapsack_unbounded(weights: ArrayList<i64>, values: ArrayList<i64>, capacity: i64) -> i64 {
    let mut best: ArrayList<i64> = ArrayList::new((capacity + 1) as usize)
    let mut room: i64 = 0
    while room <= capacity {
        best.push(0)
        room = room + 1
    }
    room = 0
    while room <= capacity {
        let mut item: i64 = 0
        while item < weights.length() as i64 {
            let weight: i64 = weights⁅item as usize⁆
            if weight <= room {
                let candidate: i64 = best⁅(room - weight) as usize⁆ + values⁅item as usize⁆
                best.set_cardinal(room as usize, max_of(best⁅room as usize⁆, candidate))
            }
            item = item + 1
        }
        room = room + 1
    }
    return best⁅capacity as usize⁆
}

# 维度 10,20,30,40：先合并前两个再乘第三个，最小 18000。
[export(name: "matrixChainCost")]
micro matrix_chain_cost() -> i64 {
    let mut dimensions: ArrayList<i64> = ArrayList::new(4)
    dimensions.push(10)
    dimensions.push(20)
    dimensions.push(30)
    dimensions.push(40)
    return matrix_chain(dimensions)
}

# 重量 2/3、价值 3/5、容量 4：0/1 只能取价值 5 的单件。
[export(name: "knapsack01Best")]
micro knapsack_01_best() -> i64 {
    let mut weights: ArrayList<i64> = ArrayList::new(2)
    weights.push(2)
    weights.push(3)
    let mut values: ArrayList<i64> = ArrayList::new(2)
    values.push(3)
    values.push(5)
    return knapsack_01(weights, values, 4)
}

# 同一组物品允许重复：容量 4 时取两件重量 2，得 6。
[export(name: "knapsackUnboundedBest")]
micro knapsack_unbounded_best() -> i64 {
    let mut weights: ArrayList<i64> = ArrayList::new(2)
    weights.push(2)
    weights.push(3)
    let mut values: ArrayList<i64> = ArrayList::new(2)
    values.push(3)
    values.push(5)
    return knapsack_unbounded(weights, values, 4)
}
