namespace probe.mutual_recursion;

# Hofstadter Female / Male 序列：两个函数互相调用，构成互递归。
micro female(n: i64) -> i64 {
    if n == 0 {
        return 1
    }
    return n - male(female(n - 1))
}

micro male(n: i64) -> i64 {
    if n == 0 {
        return 0
    }
    return n - female(male(n - 1))
}

[export(name: "hofstadterTenCode")]
micro hofstadter_ten_code() -> i64 {
    return female(10) * 10 + male(10)
}

[export(name: "hofstadterSevenCode")]
micro hofstadter_seven_code() -> i64 {
    return male(7) * 10 + female(7)
}
