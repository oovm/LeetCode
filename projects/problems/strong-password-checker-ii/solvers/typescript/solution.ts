export class Solution {
    strongPasswordCheckerII(password: string): boolean {
        return (
            password.length >= 8 &&
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /\d/.test(password) &&
            /[!@#$%^&*()\-+]/.test(password) &&
            !/(.)\1/.test(password)
        );
    }
}
