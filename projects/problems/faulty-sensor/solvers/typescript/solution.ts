export class Solution {
    badSensor(sensor1: number[], sensor2: number[]): number {
        const n = sensor1.length;
        let i = 0;
        while (i < n && sensor1[i] === sensor2[i]) i++;
        if (i === n) return -1;
        let j = i;
        while (j + 1 < n && sensor1[j] === sensor2[j + 1]) j++;
        const oneIsBad = j + 1 === n;
        j = i;
        while (j + 1 < n && sensor2[j] === sensor1[j + 1]) j++;
        const twoIsBad = j + 1 === n;
        if (oneIsBad && twoIsBad) return -1;
        return oneIsBad ? 1 : 2;
    }
}
