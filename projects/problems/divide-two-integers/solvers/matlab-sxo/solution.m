function y = divide(dividend, divisor)
    neg = (dividend < 0 && divisor > 0) || (dividend > 0 && divisor < 0);
    if dividend < 0
        a = -dividend;
    else
        a = dividend;
    end
    if divisor < 0
        b = -divisor;
    else
        b = divisor;
    end
    q = 0;
    while a >= b
        t = b;
        k = 1;
        while a >= t + t
            t = t + t;
            k = k + k;
        end
        a = a - t;
        q = q + k;
    end
    if neg
        q = -q;
    end
    if q > 2147483647
        q = 2147483647;
    end
    if q < -2147483648
        q = -2147483648;
    end
    y = q;
end
