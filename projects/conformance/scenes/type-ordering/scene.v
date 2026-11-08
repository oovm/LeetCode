namespace probe.type_ordering;

using std.collection

structure Rank {
    key: i64
    serial: i64
}

imply Rank: std::operator::Equal {
    infix `==`(self, other: Rank): bool {
        if self.key != other.key {
            return false
        }
        return self.serial == other.serial
    }

    infix `!=`(self, other: Rank): bool {
        return !(self == other)
    }
}

# 只按 key 定序，serial 用来观察稳定排序。
imply Rank: std::operator::Comparable {
    micro compare(self, other: Self): Ordering {
        if self.key < other.key {
            return Less
        }
        if other.key < self.key {
            return Greater
        }
        return Equal
    }
}

# 结构体按 Comparable 排序。
[export(name: "sortRankChecksum")]
micro sort_rank_checksum() -> i64 {
    let mut ranks: ArrayList<Rank> = ArrayList::new(3)
    ranks.push(Rank { key: 3, serial: 0 })
    ranks.push(Rank { key: 1, serial: 1 })
    ranks.push(Rank { key: 2, serial: 2 })
    sort(ranks)
    let mut checksum: i64 = 0
    loop rank in ranks {
        checksum = checksum * 10 + rank.key
    }
    return checksum
}

# 稳定排序：key 相同元素的 serial 顺序保持不变。
[export(name: "stableSerialOrder")]
micro stable_serial_order() -> i64 {
    let mut ranks: ArrayList<Rank> = ArrayList::new(3)
    ranks.push(Rank { key: 1, serial: 0 })
    ranks.push(Rank { key: 1, serial: 1 })
    ranks.push(Rank { key: 0, serial: 2 })
    sort(ranks)
    let mut checksum: i64 = 0
    loop rank in ranks {
        checksum = checksum * 10 + rank.serial
    }
    return checksum
}
