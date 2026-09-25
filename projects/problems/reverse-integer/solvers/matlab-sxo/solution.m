function y = reverse(x)
    lo = -214748365;
    hi = 214748364;
    n = x;
    y = 0;
    while n ~= 0
        if y < lo + 1 || y > hi
            y = 0;
            return;
        end
        rem = mod(n, 10);
        if n < 0 && rem > 0
            rem = rem - 10;
        end
        y = y * 10 + rem;
        n = (n - rem) / 10;
    end
end
