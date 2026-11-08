namespace probe.struct_methods_imply;

# 结构体 + 自有 `imply` 方法：读、写、派生。
structure Counter {
    total: i64
    steps: i64
}

imply Counter {
    micro zero() -> Self {
        return Self { total: 0, steps: 0 }
    }

    micro add(mut self, value: i64): unit {
        self.total = self.total + value
        self.steps = self.steps + 1
    }

    micro average(self): i64 {
        if self.steps == 0 {
            return 0
        }
        return self.total / self.steps
    }
}

# 累加 3 + 4 + 5 共三步，均值 4（4 * 10 + 3 = 43）。
[export(name: "counterAverage")]
micro counter_average() -> i64 {
    let mut counter: Counter = Counter::zero()
    counter.add(3)
    counter.add(4)
    counter.add(5)
    return counter.average() * 10 + counter.steps
}

# 方法改写的字段在调用方可见：10 + 20 = 30。
[export(name: "counterMutationVisible")]
micro counter_mutation_visible() -> i64 {
    let mut counter: Counter = Counter::zero()
    counter.add(10)
    counter.add(20)
    return counter.total
}

# 嵌套结构体字段按名字读取与改写。
structure Range {
    low: i64
    high: i64
}

structure Window {
    span: Range
    label: i64
}

imply Window {
    micro width(self): i64 {
        return self.span.high - self.span.low
    }

    micro extend(mut self, delta: i64): unit {
        self.span.high = self.span.high + delta
    }
}

# 窗口 [2, 9) 宽度 7，向右扩 3 后宽度 10。
[export(name: "nestedFieldUpdate")]
micro nested_field_update() -> i64 {
    let mut window: Window = Window { span: Range { low: 2, high: 9 }, label: 1 }
    let before: i64 = window.width()
    window.extend(3)
    return before * 10 + window.width()
}
