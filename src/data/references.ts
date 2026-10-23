export type AcademicReference={title:string;url:string};
const introductory:AcademicReference={title:'MIT OpenCourseWare · 6.006: apuntes de algoritmos y estructuras de datos',url:'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2008/pages/lecture-notes/'};
const design:AcademicReference={title:'MIT OpenCourseWare · 6.046: diseño, amortización, Greedy y complejidad',url:'https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/lecture-notes/'};
const tries:AcademicReference={title:'Princeton · Algorithms, 4th Edition: Tries',url:'https://algs4.cs.princeton.edu/52trie/'};
const backtracking:AcademicReference={title:'Stanford · CS106B: backtracking, N reinas y Sudoku',url:'https://see.stanford.edu/Course/CS106B/149'};
const lru:AcademicReference={title:'Oracle · LinkedHashMap: orden por acceso y cachés LRU',url:'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/LinkedHashMap.html'};
export function referencesForModule(id:number):AcademicReference[]{
 if(id===9)return [tries,introductory];
 if(id===14)return [backtracking];
 if(id===15)return [design,lru];
 if(id===12||id===16)return [design];
 if(id===2)return [introductory,design];
 return [introductory];
}
