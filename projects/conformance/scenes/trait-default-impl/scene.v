namespace probe.trait_default_impl;

# trait 的必实现成员 + 默认体成员；默认体里调用同 trait 的其它成员。
trait Scorer {
    micro base(self): i64

    micro bonus(self): i64 {
        return 1
    }

    micro total(self): i64 {
        return self.base() + self.bonus()
    }
}

structure Simple {
    value: i64
}

imply Simple: Scorer {
    micro base(self): i64 {
        return self.value
    }
}

structure Weighted {
    value: i64
    weight: i64
}

imply Weighted: Scorer {
    micro base(self): i64 {
        return self.value * self.weight
    }

    micro bonus(self): i64 {
        return self.weight
    }
}

[export(name: "simpleTotal")]
micro simple_total() -> i64 {
    let sample: Simple = Simple { value: 20 }
    return sample.total()
}

[export(name: "weightedTotal")]
micro weighted_total() -> i64 {
    let sample: Weighted = Weighted { value: 5, weight: 3 }
    return sample.total()
}
