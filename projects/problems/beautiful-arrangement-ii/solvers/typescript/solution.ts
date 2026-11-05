export class Solution {
    constructArray(n: number, k: number): number[] {
        const result: number[] = [1];
        let low = 2;
        let high = n;
        let appended = 0;
        let takeHigh = true;
        let lastHigh = false;
        while (appended < k - 1) {
            if (takeHigh) {
                result.push(high);
                high--;
                lastHigh = true;
            } else {
                result.push(low);
                low++;
                lastHigh = false;
            }
            appended++;
            takeHigh = !takeHigh;
        }
        if (appended > 0 && lastHigh) {
            for (let value = high; value >= low; value--) {
                result.push(value);
            }
        } else {
            for (let value = low; value <= high; value++) {
                result.push(value);
            }
        }
        return result;
    }
}
