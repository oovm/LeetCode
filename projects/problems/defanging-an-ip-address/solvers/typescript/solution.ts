export class Solution {
    defangIPaddr(address: string): string {
        return address.split(".").join("[.]");
    }
}
