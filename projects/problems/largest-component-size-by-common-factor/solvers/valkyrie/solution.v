namespace leetcode.largest_component_size_by_common_factor;

# 质因数分解后把共享素因子的下标并成一类，答案是最大类的大小。
micro distinct_prime_factors(value: i64) -> ArrayList<i64> {
    let mut factors: ArrayList<i64> = ArrayList::new(0)
    let mut rest: i64 = value
    let mut divisor: i64 = 2
    while divisor * divisor <= rest {
        if rest % divisor == 0 {
            factors.push(divisor)
            while rest % divisor == 0 {
                rest = rest / divisor
            }
        }
        divisor = divisor + 1
    }
    if rest > 1 {
        factors.push(rest)
    }
    return factors
}

[export(case: "camelCase")]
micro largest_component_size(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let total: i64 = count as i64
    let mut sets: DisjointSet<i64> = DisjointSet::new()
    let mut owner: HashMap<i64, i64> = HashMap::new(count)
    let mut index: i64 = 0
    while index < total {
        sets.add(index)
        index = index + 1
    }

    index = 0
    while index < total {
        let factors: ArrayList<i64> = distinct_prime_factors(nums⁅index as usize⁆)
        let mut k: usize = 0
        while k < factors.length() {
            let prime: i64 = factors⁅k⁆
            if owner.contains_key(prime) {
                sets.union(owner.get(prime).unwrap(), index)
            } else {
                owner.insert(prime, index)
            }
            k = k + 1
        }
        index = index + 1
    }

    let mut sizes: HashMap<i64, i64> = HashMap::new(count)
    index = 0
    while index < total {
        let root: i64 = sets.find_root(index)
        if sizes.contains_key(root) {
            sizes.insert(root, sizes.get(root).unwrap() + 1)
        } else {
            sizes.insert(root, 1)
        }
        index = index + 1
    }

    let mut largest: i64 = 0
    loop size in sizes.values() {
        if size > largest {
            largest = size
        }
    }
    return largest
}

class Solution {
    micro largestComponentSize(self, nums: ArrayList<i64>): i64 {
        return largest_component_size(nums)
    }
}
