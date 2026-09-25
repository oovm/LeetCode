function y = isPalindrome(x)
    if x < 0 || (x ~= 0 && mod(x, 10) == 0)
        y = false;
        return;
    end
    rev = 0;
    n = x;
    while n > rev
        rev = rev * 10 + mod(n, 10);
        n = (n - mod(n, 10)) / 10;
    end
    y = (n == rev) || (n == (rev - mod(rev, 10)) / 10);
end
