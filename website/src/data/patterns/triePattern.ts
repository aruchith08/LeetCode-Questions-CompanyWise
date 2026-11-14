import type { PatternLearningContent } from '../../types/patterns';

export const TRIE_PATTERN: PatternLearningContent = {
  slug: 'trie-prefix-tree',
  title: 'Tries (Prefix Trees)',
  level: 'Intermediate',
  category: 'Trees & Strings',
  prerequisites: ['Binary Trees', 'Tree DFS', 'Hash Tables & Character Indices'],
  companiesTop: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Uber'],

  // Module 1: Intro
  introTitle: 'What is a Trie (Prefix Tree)?',
  introDescription: [
    'A Trie (pronounced "try" or "tree", from reTRIEval) is an m-ary tree data structure where each node represents a character along a string path.',
    'Unlike standard hash tables which only check full string equality, a Trie organizes keys by their common prefixes. Insertion, full-word lookup, and prefix queries (startsWith) all execute in strictly O(L) time, where L is the length of the query string — completely independent of how many millions of words exist in the dictionary.',
  ],
  motivatingProblem: {
    title: 'Implement Trie (Prefix Tree) (LeetCode #208)',
    description: 'Implement a Trie with insert, search, and startsWith methods for rapid string lookups.',
    naiveApproach: 'Storing words in a list requires O(N * L) time to scan for prefixes. Storing words in a hash set achieves O(L) exact search, but startsWith(prefix) still requires iterating through every word in O(N * L) time.',
    optimalApproach: 'Traverse root-to-leaf paths through child pointer arrays. Both search and startsWith run in O(L) operations with zero linear scans.',
  },
  applicabilityInvariant: 'A Trie is optimal whenever multiple operations require prefix filtering, autocomplete matching, dictionary word searches on 2D character grids, or bitwise XOR maximization.',

  // Module 2: Recognition
  signals: [
    'Autocomplete or typeahead suggestions based on user keystrokes',
    'Frequent startsWith(prefix) query patterns',
    'Finding valid dictionary words on a 2D Boggle or character matrix (Word Search II)',
    'Finding maximum XOR of two numbers in an array (Bitwise Binary Trie)',
  ],
  antiSignals: [
    'Only exact string equality lookups needed with zero prefix queries (use a Hash Set for lower memory overhead)',
    'Large arbitrary Unicode character alphabets without sparse child maps (may cause high memory overhead; consider Ternary Search Trees or Radix Trees)',
  ],

  // Module 3: Core Technique
  coreTechniqueTitle: 'The Shared Prefix Pointer Invariant',
  coreTechniqueDescription: 'Each TrieNode contains an array or dictionary of child pointers (size 26 for lowercase English) and a boolean isEnd flag indicating whether a complete word terminates at this node.',
  coreTechniqueSteps: [
    {
      title: 'Step 1: Insertion (insert)',
      description: 'Start at root. For each character c in the word, calculate index c - "a". If child does not exist, instantiate a new TrieNode. Advance current pointer. Mark isEnd = true on the last node.',
    },
    {
      title: 'Step 2: Exact Search (search)',
      description: 'Traverse down matching characters. If any character child pointer is null, return false. If all characters match, return current.isEnd (must be a word boundary).',
    },
    {
      title: 'Step 3: Prefix Search (startsWith)',
      description: 'Traverse down matching characters. If any character child pointer is null, return false. If all characters match, return true immediately (regardless of isEnd).',
    },
  ],
  loopInvariant: 'At any TrieNode reached at depth d, the path from the root spells the exact d-length prefix shared by all words in that subtree.',

  // Module 4: Variations
  variations: [
    {
      id: 'wildcard-search',
      title: 'Wildcard Search with DFS',
      description: 'Search pattern contains "." which can match any character.',
      exampleProblem: 'LeetCode #211: Design Add and Search Words',
      keyIdea: 'When encountering ".", branch into all non-null children with DFS backtracking.',
    },
    {
      id: 'grid-trie-dfs',
      title: 'Grid Trie DFS (Boggle)',
      description: 'Find all dictionary words on an M x N character board.',
      exampleProblem: 'LeetCode #212: Word Search II',
      keyIdea: 'Traverse the 2D grid once while stepping along the Trie. Prune Trie nodes upon discovery to prevent duplicate paths.',
    },
    {
      id: 'binary-trie',
      title: 'Bitwise Binary Trie',
      description: 'Insert 32-bit binary representations to maximize XOR pairs.',
      exampleProblem: 'LeetCode #421: Maximum XOR of Two Numbers',
      keyIdea: 'For each bit, greedily choose the opposite bit branch (1 - bit) if available to maximize XOR.',
    },
  ],

  // Module 5: Code Templates
  pythonTemplate: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                curr.children[ch] = TrieNode()
            curr = curr.children[ch]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return curr.is_end

    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for ch in prefix:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return True`,

  tsTemplate: `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd: boolean = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let curr = this.root;
    for (const ch of word) {
      if (!curr.children.has(ch)) {
        curr.children.set(ch, new TrieNode());
      }
      curr = curr.children.get(ch)!;
    }
    curr.isEnd = true;
  }

  search(word: string): boolean {
    let curr = this.root;
    for (const ch of word) {
      if (!curr.children.has(ch)) return false;
      curr = curr.children.get(ch)!;
    }
    return curr.isEnd;
  }

  startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const ch of prefix) {
      if (!curr.children.has(ch)) return false;
      curr = curr.children.get(ch)!;
    }
    return true;
  }
}`,

  pythonExample: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                curr.children[ch] = TrieNode()
            curr = curr.children[ch]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return curr.is_end

    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for ch in prefix:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return True`,

  tsExample: `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd: boolean = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let curr = this.root;
    for (const ch of word) {
      if (!curr.children.has(ch)) {
        curr.children.set(ch, new TrieNode());
      }
      curr = curr.children.get(ch)!;
    }
    curr.isEnd = true;
  }

  search(word: string): boolean {
    let curr = this.root;
    for (const ch of word) {
      if (!curr.children.has(ch)) return false;
      curr = curr.children.get(ch)!;
    }
    return curr.isEnd;
  }

  startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const ch of prefix) {
      if (!curr.children.has(ch)) return false;
      curr = curr.children.get(ch)!;
    }
    return true;
  }
}`,

  pythonBrute: `class NaiveTrie:
    def __init__(self):
        self.words = set()

    def insert(self, word: str) -> None:
        self.words.add(word)

    def search(self, word: str) -> bool:
        return word in self.words

    def startsWith(self, prefix: str) -> bool:
        return any(w.startswith(prefix) for w in self.words)`,

  tsBrute: `class NaiveTrie {
  words = new Set<string>();

  insert(word: string): void {
    this.words.add(word);
  }

  search(word: string): boolean {
    return this.words.has(word);
  }

  startsWith(prefix: string): boolean {
    for (const w of this.words) {
      if (w.startsWith(prefix)) return true;
    }
    return false;
  }
}`,

  bruteComplexity: {
    time: 'O(N * L) for startsWith',
    space: 'O(N * L)',
    notes: 'Checking prefixes requires iterating over every word in the dictionary.',
  },
  bruteExplanation: 'Storing words in a set achieves O(L) exact lookup, but prefix queries require scanning all N words, degrading to O(N * L) per query.',

  exampleProblemTitle: 'Implement Trie (Prefix Tree) (LeetCode #208)',
  exampleProblemDescription: 'Implement Trie with insert, search, and startsWith methods in optimal O(L) time per call.',
  codeExplanation: [
    'Each TrieNode holds child references and a boolean isEnd.',
    'insert(word): Iterates through each character in word. If a child branch is missing, it is created. The final node has isEnd set to true.',
    'search(word): Follows character pointers. If a pointer is missing, returns false. At the end of the word, returns isEnd to verify it is not just a prefix.',
    'startsWith(prefix): Follows character pointers. If all characters are present in the Trie, returns true immediately without needing isEnd.',
  ],
  complexity: {
    time: 'O(L) per operation',
    space: 'O(TOTAL_CHARS)',
    notes: 'L is word length. Query time is strictly independent of dictionary word count N.',
  },
  pitfalls: [
    'Forgetting to check isEnd in search(), which mistakenly matches prefixes as complete words.',
    'Over-allocating memory for sparse alphabets; use a hash map for child pointers when alphabet is large.',
    'Not resetting current node pointer between queries.',
  ],

  // Module 6: Visualizer
  visualizerTitle: 'Trie Prefix Tree Visualizer',
  visualizerSubtitle: 'Watch character branches sprout and observe prefix sharing in action.',

  // Module 7: Practice Questions
  mappings: [
    { questionId: 208, primaryPattern: 'trie-prefix-tree', subpattern: 'trie-design', subpatternLabel: 'Implement Trie', learningOrder: 1, reviewStatus: 'verified' },
    { questionId: 211, primaryPattern: 'trie-prefix-tree', subpattern: 'wildcard-search', subpatternLabel: 'Word Dictionary Search', learningOrder: 2, reviewStatus: 'verified' },
    { questionId: 648, primaryPattern: 'trie-prefix-tree', subpattern: 'prefix-replacement', subpatternLabel: 'Replace Words', learningOrder: 3, reviewStatus: 'verified' },
    { questionId: 677, primaryPattern: 'trie-prefix-tree', subpattern: 'prefix-sum-pairs', subpatternLabel: 'Map Sum Pairs', learningOrder: 4, reviewStatus: 'verified' },
    { questionId: 212, primaryPattern: 'trie-prefix-tree', subpattern: 'grid-trie-dfs', subpatternLabel: 'Word Search II', learningOrder: 5, reviewStatus: 'verified' },
    { questionId: 720, primaryPattern: 'trie-prefix-tree', subpattern: 'trie-design', subpatternLabel: 'Longest Word in Dictionary', learningOrder: 6, reviewStatus: 'verified' },
    { questionId: 1032, primaryPattern: 'trie-prefix-tree', subpattern: 'trie-design', subpatternLabel: 'Stream of Characters', learningOrder: 7, reviewStatus: 'verified' },
    { questionId: 14, primaryPattern: 'trie-prefix-tree', subpattern: 'trie-design', subpatternLabel: 'Longest Common Prefix', learningOrder: 8, reviewStatus: 'verified' },
    { questionId: 421, primaryPattern: 'trie-prefix-tree', subpattern: 'binary-trie', subpatternLabel: 'Maximum XOR Pair', learningOrder: 9, reviewStatus: 'verified' },
    { questionId: 2416, primaryPattern: 'trie-prefix-tree', subpattern: 'prefix-sum-pairs', subpatternLabel: 'Prefix Scores Sum', learningOrder: 10, reviewStatus: 'verified' },
  ],
  subpatternTabs: [
    { id: 'trie-design', label: 'Trie Design' },
    { id: 'wildcard-search', label: 'Wildcard Search' },
    { id: 'prefix-replacement', label: 'Prefix Replacement' },
    { id: 'prefix-sum-pairs', label: 'Map Sum Pairs' },
    { id: 'grid-trie-dfs', label: 'Grid Trie DFS' },
    { id: 'binary-trie', label: 'Binary Trie' },
  ],

  // Module 8: Quiz
  quiz: [
    {
      id: 'trie-q1',
      question: 'What is the time complexity of searching for a word of length L in a Trie containing N words?',
      options: [
        { id: 'a', text: 'O(N * L)' },
        { id: 'b', text: 'O(L)' },
        { id: 'c', text: 'O(log N)' },
        { id: 'd', text: 'O(N)' },
      ],
      correctOptionId: 'b',
      explanation: 'Trie traversal steps through exactly L character pointers. The execution time is strictly O(L) and does not depend on the dictionary size N.',
    },
    {
      id: 'trie-q2',
      question: 'Why does startsWith("app") return true even if only the word "apple" was inserted into the Trie?',
      options: [
        { id: 'a', text: 'Because startsWith ignores character order' },
        { id: 'b', text: 'Because the prefix path "a" -> "p" -> "p" exists, and startsWith does not require isEnd = true' },
        { id: 'c', text: 'Because "app" has length <= "apple"' },
        { id: 'd', text: 'Because Trie automatically adds all subwords' },
      ],
      correctOptionId: 'b',
      explanation: 'startsWith only checks that the path of characters exists from the root. Only search() checks the isEnd flag.',
    },
    {
      id: 'trie-q3',
      question: 'In LeetCode #212 (Word Search II), why is a Trie superior to searching for each dictionary word individually with DFS?',
      options: [
        { id: 'a', text: 'Tries sort the letters alphabetically' },
        { id: 'b', text: 'Exploring the 2D grid once guided by the Trie shares search paths across words with common prefixes and prunes non-existent prefixes early' },
        { id: 'c', text: 'Tries do not require visited tracking' },
        { id: 'd', text: 'Tries compress the 2D grid into 1D' },
      ],
      correctOptionId: 'b',
      explanation: 'If no dictionary word begins with "zq", the grid DFS immediately prunes that branch instead of searching millions of dead paths.',
    },
    {
      id: 'trie-q4',
      question: 'What is a major trade-off of a Trie compared to a standard Hash Set?',
      options: [
        { id: 'a', text: 'Tries cannot store strings longer than 32 characters' },
        { id: 'b', text: 'Tries use significantly more memory per node for child pointer references' },
        { id: 'c', text: 'Tries have O(N²) worst-case insertion time' },
        { id: 'd', text: 'Tries cannot detect duplicate words' },
      ],
      correctOptionId: 'b',
      explanation: 'Each TrieNode requires child pointer references. With large sparse alphabets, memory overhead is higher than a compact hash set.',
    },
  ],
};
