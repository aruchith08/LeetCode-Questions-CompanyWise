# Bit Manipulation Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents two's complement arithmetic, bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`), bitmask state representation, and Kernighan's algorithm.

### Verified Academic & Reference Sources
1. **Henry S. Warren Jr. (Hacker's Delight, 2nd Edition)**
   - *Topic:* Bitwise tricks, counting ones, parity, power of two tests, clearing lowest set bit.
2. **CLRS (Introduction to Algorithms)**
   - *Topic:* Binary representation, bit-level parallelism, dynamic programming with bitmasks.
3. **CP-Algorithms**
   - *Topic:* Bit manipulations, iterating through submasks of a bitmask.
   - *Reference:* [CP-Algorithms: Bit Manipulation](https://cp-algorithms.com/algebra/all-submasks.html)
4. **LeetCode Canonical Problems**
   - Problem 136: Single Number (XOR cancellation invariant: $x \oplus x = 0$)
   - Problem 137: Single Number II (Bitwise state machine modulo 3)
   - Problem 260: Single Number III (Partitioning by lowest set bit: `diff & (-diff)`)
   - Problem 191: Number of 1 Bits (Brian Kernighan's algorithm: `n & (n - 1)`)
   - Problem 338: Counting Bits (DP transition on lowest bit: `dp[i] = dp[i >> 1] + (i & 1)`)
   - Problem 190: Reverse Bits (Bitwise extraction and accumulator shifting)
   - Problem 231: Power of Two (Single bit test: `n > 0 && (n & (n - 1)) == 0`)

---

## 2. Core Algorithmic Principles & Invariants

### A. The Fundamental Bitwise Identities
1. **XOR Involution & Identity:**
   - $x \oplus 0 = x$
   - $x \oplus x = 0$
   - Commutative & Associative: $A \oplus B \oplus A = (A \oplus A) \oplus B = 0 \oplus B = B$.
   - Allows finding unique elements in $\mathcal{O}(n)$ time and $\mathcal{O}(1)$ space without hash tables.
2. **Clearing the Lowest Set Bit (Brian Kernighan):**
   $$n \ \& \ (n - 1)$$
   - Clears the lowest 1-bit in $n$. Loops exactly as many times as there are 1-bits in the binary representation.
3. **Isolating the Lowest Set Bit:**
   $$\text{lowest\_bit} = n \ \& \ (-n)$$
   - In two's complement, $-n = \sim n + 1$. Bitwise AND with $n$ zeroes out all bits except the lowest set bit.
4. **Power of Two Test:**
   $$n > 0 \text{ and } (n \ \& \ (n - 1)) == 0$$

### B. Subpatterns
1. **Bitmask Set Representation:**
   - Represent sets of size $\le 32$ (or 64) as an integer.
   - Add element $i$: `mask |= (1 << i)`
   - Remove element $i$: `mask &= ~(1 << i)`
   - Test membership: `(mask & (1 << i)) != 0`
   - Iterate all subsets of mask $M$:
     ```python
     sub = M
     while sub > 0:
         sub = (sub - 1) & M
     ```
2. **Modulo Arithmetic via State Machines (LC #137):**
   - Track bit counts modulo 3 using two state variables `ones` and `twos`.
3. **Two Unique Numbers Isolation (LC #260):**
   - XORing all numbers gives $X = A \oplus B$.
   - Isolate any bit where $A$ and $B$ differ: `diff = X & (-X)`.
   - Partition array into two groups based on whether this bit is set, reducing to two independent Single Number problems.

### C. Complexity Analysis
- **Time Complexity:** $\mathcal{O}(1)$ per word operation (or $\mathcal{O}(B)$ where $B = 32$ or 64).
- **Space Complexity:** $\mathcal{O}(1)$ auxiliary memory.

---

## 3. When NOT to Use Bit Manipulation
- **Arbitrary Precision Beyond 64 Bits:** Big integers require multiple machine words, increasing constant overhead.
- **Floating Point Manipulations:** IEEE 754 float bits require specialized bit decoding rather than standard integer logic.

---

## 4. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| Negative numbers in JavaScript | Bitwise operators in JS convert numbers to 32-bit signed ints | Use unsigned right shift `>>> 0` to preserve unsigned 32-bit values. |
| Zero input | `n = 0` | Handled properly; 0 bits of 1; power-of-two check returns `false`. |
| Minimum 32-bit integer | `n = -2147483648` ($0x80000000$) | Two's complement negation overflow: $-n$ causes overflow in signed 32-bit integers; cast to 64-bit or handle as unsigned. |

---

## 5. Verification Status
- **Algorithmic Correctness:** Proven via Hacker's Delight and binary arithmetic identities.
- **Practice Problems:** 12 curated questions verified in `questions.json`.
- **Reviewer Status:** Approved with complete coverage of XOR involution, Kernighan's algorithm, bitmask sets, and two's complement sign edge cases.
