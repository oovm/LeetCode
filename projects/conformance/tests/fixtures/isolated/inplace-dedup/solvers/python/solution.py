class Solution:
    def dedup(self, nums: list[int]) -> int:
        k = 0
        for value in list(nums):
            if k == 0 or value != nums[k - 1]:
                nums[k] = value
                k += 1
        return k
