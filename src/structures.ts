export type TreeNode = { key: number; left: TreeNode | null; right: TreeNode | null; height: number };
export type TreeEvent = { message: string; tree: TreeNode | null };
export const treeHeight = (node: TreeNode | null): number => node?.height ?? 0;
export const treeBalance = (node: TreeNode | null): number => node ? treeHeight(node.left) - treeHeight(node.right) : 0;
export const cloneTree = (node: TreeNode | null): TreeNode | null => node ? { ...node, left: cloneTree(node.left), right: cloneTree(node.right) } : null;
function update(node: TreeNode) { node.height = 1 + Math.max(treeHeight(node.left), treeHeight(node.right)); return node; }
function rotateRight(node: TreeNode): TreeNode { const root = node.left!; node.left = root.right; root.right = node; update(node); return update(root); }
function rotateLeft(node: TreeNode): TreeNode { const root = node.right!; node.right = root.left; root.left = node; update(node); return update(root); }
export function treeValues(node: TreeNode | null, order: 'in'|'pre'|'post' = 'in'): number[] {
 if(!node)return []; const left=treeValues(node.left,order),right=treeValues(node.right,order);
 return order==='pre'?[node.key,...left,...right]:order==='post'?[...left,...right,node.key]:[...left,node.key,...right];
}
export function editTree(original: TreeNode | null, key: number, action: 'insert'|'delete', balanced=true): { tree: TreeNode|null; events: string[] } {
 if(!Number.isSafeInteger(key))throw new Error('La clave debe ser un entero seguro.');
 const events:string[]=[];
 function rebalance(node:TreeNode):TreeNode {
  update(node); if(!balanced)return node;
  if(treeBalance(node)>1){if(treeBalance(node.left)<0){events.push(`Rotación izquierda en ${node.left!.key} (caso LR).`);node.left=rotateLeft(node.left!);}events.push(`Rotación derecha en ${node.key}.`);return rotateRight(node);}
  if(treeBalance(node)<-1){if(treeBalance(node.right)>0){events.push(`Rotación derecha en ${node.right!.key} (caso RL).`);node.right=rotateRight(node.right!);}events.push(`Rotación izquierda en ${node.key}.`);return rotateLeft(node);}
  return node;
 }
 function insert(node:TreeNode|null):TreeNode {
  if(!node){events.push(`Se crea la hoja ${key}.`);return {key,left:null,right:null,height:1};}
  if(key<node.key)node.left=insert(node.left);else if(key>node.key)node.right=insert(node.right);else events.push(`La clave ${key} ya existe; se conserva una sola copia.`);
  return rebalance(node);
 }
 function remove(node:TreeNode|null,value:number):TreeNode|null {
  if(!node){events.push(`No existe la clave ${value}.`);return null;}
  if(value<node.key)node.left=remove(node.left,value);else if(value>node.key)node.right=remove(node.right,value);else{
   events.push(`Se elimina ${value}.`);if(!node.left)return node.right;if(!node.right)return node.left;
   let next=node.right;while(next.left)next=next.left;events.push(`Su sucesor inorden ${next.key} ocupa la posición.`);node.key=next.key;node.right=remove(node.right,next.key);
  }
  return rebalance(node);
 }
 const copy=cloneTree(original);return {tree:action==='insert'?insert(copy):remove(copy,key),events};
}
export function treeSearch(root:TreeNode|null,key:number):number[]{const path:number[]=[];while(root){path.push(root.key);if(root.key===key)break;root=key<root.key?root.left:root.right;}return path;}
export function heapInsert(original:readonly number[],value:number):number[]{const heap=[...original,value];let i=heap.length-1;while(i>0){const p=Math.floor((i-1)/2);if(heap[p]<=heap[i])break;[heap[p],heap[i]]=[heap[i],heap[p]];i=p;}return heap;}
export function heapExtract(original:readonly number[]):{heap:number[];value:number|undefined}{const heap=[...original],value=heap[0],last=heap.pop();if(heap.length){heap[0]=last!;let i=0;while(true){let next=i;for(const child of [2*i+1,2*i+2])if(child<heap.length&&heap[child]<heap[next])next=child;if(next===i)break;[heap[i],heap[next]]=[heap[next],heap[i]];i=next;}}return {heap,value};}
export type ListNode={value:number;next:ListNode|null};
export class LinkedList {
 head:ListNode|null=null;
 values(){const values:number[]=[];for(let n=this.head;n;n=n.next)values.push(n.value);return values;}
 insert(index:number,value:number){const size=this.values().length;if(!Number.isInteger(index)||index<0||index>size)throw new Error(`Índice válido de inserción: 0–${size}.`);if(index===0){this.head={value,next:this.head};return;}let prev=this.head!;for(let i=1;i<index;i++)prev=prev.next!;prev.next={value,next:prev.next};}
 remove(index:number){const size=this.values().length;if(!Number.isInteger(index)||index<0||index>=size)throw new Error('El índice debe señalar un nodo existente.');if(index===0){const value=this.head!.value;this.head=this.head!.next;return value;}let prev=this.head!;for(let i=1;i<index;i++)prev=prev.next!;const value=prev.next!.value;prev.next=prev.next!.next;return value;}
 reverse(){let prev:ListNode|null=null,current=this.head;while(current){const next:ListNode|null=current.next;current.next=prev;prev=current;current=next;}this.head=prev;}
}
const deleted=Symbol('deleted');
export class LinearHashTable {
 slots:({key:string;value:string}|typeof deleted|null)[]=Array(8).fill(null);
 size=0; lastProbes:number[]=[];
 hash(key:string){let hash=0;for(const char of key)hash=(hash*31+char.codePointAt(0)!)>>>0;return hash%this.slots.length;}
 locate(key:string){const start=this.hash(key);this.lastProbes=[];for(let i=0;i<this.slots.length;i++){const index=(start+i)%this.slots.length;this.lastProbes.push(index);const slot=this.slots[index];if(slot===null)return -1;if(slot!==deleted&&slot.key===key)return index;}return -1;}
 get(key:string){const index=this.locate(key);return index<0?undefined:(this.slots[index] as {key:string;value:string}).value;}
 put(key:string,value:string){if(!key)throw new Error('La clave no puede estar vacía.');let index=this.locate(key);if(index>=0){this.slots[index]={key,value};return;}if((this.size+1)/this.slots.length>.7){const old=this.entries();this.slots=Array(this.slots.length*2).fill(null);this.size=0;for(const item of old)this.put(item.key,item.value);}
 const start=this.hash(key);this.lastProbes=[];for(let i=0;i<this.slots.length;i++){index=(start+i)%this.slots.length;this.lastProbes.push(index);if(this.slots[index]===null||this.slots[index]===deleted){this.slots[index]={key,value};this.size++;return;}}throw new Error('La tabla está llena.');}
 remove(key:string){const index=this.locate(key);if(index<0)return false;this.slots[index]=deleted;this.size--;return true;}
 entries(){return this.slots.filter((slot):slot is {key:string;value:string}=>slot!==null&&slot!==deleted);}
 snapshot(){return this.slots.map(slot=>slot===deleted?{state:'deleted' as const}:slot===null?{state:'empty' as const}:{state:'value' as const,...slot});}
}
export type TrieNode={end:boolean;children:Map<string,TrieNode>};
export class Trie {
 root:TrieNode={end:false,children:new Map()};
 insert(word:string){let node=this.root;for(const char of word){if(!node.children.has(char))node.children.set(char,{end:false,children:new Map()});node=node.children.get(char)!;}node.end=true;}
 has(word:string){let node=this.root;for(const char of word){const next=node.children.get(char);if(!next)return false;node=next;}return node.end;}
 words(prefix=''){let node=this.root;for(const char of prefix){const next=node.children.get(char);if(!next)return [];node=next;}const result:string[]=[];function visit(n:TrieNode,text:string){if(n.end)result.push(text);for(const [char,child]of [...n.children].sort())visit(child,text+char);}visit(node,prefix);return result;}
 remove(word:string){function visit(node:TrieNode,i:number):boolean{if(i===word.length){if(!node.end)return false;node.end=false;}else{const next=node.children.get(word[i]);if(!next||!visit(next,i+1))return false;if(!next.end&&!next.children.size)node.children.delete(word[i]);}return true;}return visit(this.root,0);}
}
export class LruCache {
 entries=new Map<string,string>();
 capacity:number;
 constructor(capacity=3){if(!Number.isInteger(capacity)||capacity<1)throw new Error("La capacidad debe ser un entero positivo.");this.capacity=capacity;}
 get(key:string){const value=this.entries.get(key);if(value!==undefined){this.entries.delete(key);this.entries.set(key,value);}return value;}
 put(key:string,value:string){this.entries.delete(key);this.entries.set(key,value);let evicted:string|undefined;if(this.entries.size>this.capacity){evicted=this.entries.keys().next().value;this.entries.delete(evicted!);}return evicted;}
}
