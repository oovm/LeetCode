function y = searchInsert(nums, target)
    lo = 1;
    hi = length(nums);
    while lo <= hi
        mid = (lo + hi - mod(lo + hi, 2)) / 2;
        if nums(mid) < target
            lo = mid + 1;
        else
            hi = mid - 1;
        end
    end
    y = lo - 1;
end
