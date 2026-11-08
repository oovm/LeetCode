namespace probe.trait_required_call;

# 对照：trait 只有必实现成员，不含默认体。
trait Scorer {
    micro base(self): i64
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
}

[export(name: "simpleBase")]
micro simple_base() -> i64 {
    let sample: Simple = Simple { value: 20 }
    return sample.base()
}

[export(name: "weightedBase")]
micro weighted_base() -> i64 {
    let sample: Weighted = Weighted { value: 5, weight: 3 }
    return sample.base()
}
