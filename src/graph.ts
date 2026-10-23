export type Edge={from:string;to:string;weight:number};
export type Graph={vertices:string[];edges:Edge[];directed:boolean};
export type GraphAlgorithm='bfs'|'dfs'|'dijkstra'|'bellman'|'prim'|'kruskal'|'topological';
export type GraphStep={message:string;active:string[];visited:string[];distances:Record<string,number>;selected:Edge[];path:string[]};
export function graphTrace(graph:Graph,algorithm:GraphAlgorithm,source:string,target?:string):GraphStep[]{
 if(!graph.vertices.includes(source))throw new Error('El origen debe ser un vértice del grafo.');
 if(graph.edges.some(e=>!graph.vertices.includes(e.from)||!graph.vertices.includes(e.to)||!Number.isFinite(e.weight)))throw new Error('Hay una arista inválida.');
 const adj=new Map(graph.vertices.map(v=>[v,[] as {to:string;weight:number}[]]));
 for(const edge of graph.edges){adj.get(edge.from)!.push({to:edge.to,weight:edge.weight});if(!graph.directed)adj.get(edge.to)!.push({to:edge.from,weight:edge.weight});}
 const trace:GraphStep[]=[],visited:string[]=[],distances:Record<string,number>=Object.fromEntries(graph.vertices.map(v=>[v,Infinity])),previous:Record<string,string>={},selected:Edge[]=[];
 distances[source]=0;
 const push=(message:string,active:string[]=[],path:string[]=[])=>trace.push({message,active:[...active],visited:[...visited],distances:{...distances},selected:selected.map(e=>({...e})),path:[...path]});
 push(`Estado inicial. Origen: ${source}.`);
 if(algorithm==='bfs'||algorithm==='dfs'){
  const pending=[source],seen=new Set([source]);
  while(pending.length){const v=algorithm==='bfs'?pending.shift()!:pending.pop()!;visited.push(v);push(`Visitar ${v}. ${algorithm==='bfs'?'Cola FIFO':'Pila LIFO'}: ${pending.join(', ')||'vacía'}.`,[v]);
   const neighbors=algorithm==='dfs'?[...adj.get(v)!].reverse():adj.get(v)!;
   for(const edge of neighbors)if(!seen.has(edge.to)){seen.add(edge.to);pending.push(edge.to);distances[edge.to]=distances[v]+1;previous[edge.to]=v;push(`Descubrir ${edge.to} desde ${v}.`,[v,edge.to]);}
  }
 }else if(algorithm==='dijkstra'){
  if(graph.edges.some(e=>e.weight<0))throw new Error('Dijkstra requiere pesos no negativos. Usa Bellman-Ford para pesos negativos.');
  const settled=new Set<string>();
  while(settled.size<graph.vertices.length){let v:string|undefined;for(const candidate of graph.vertices)if(!settled.has(candidate)&&Number.isFinite(distances[candidate])&&(!v||distances[candidate]<distances[v]))v=candidate;if(!v)break;
   settled.add(v);visited.push(v);push(`Fijar ${v} con distancia ${distances[v]}.`,[v]);
   for(const edge of adj.get(v)!)if(!settled.has(edge.to)&&distances[v]+edge.weight<distances[edge.to]){distances[edge.to]=distances[v]+edge.weight;previous[edge.to]=v;push(`Relajar ${v} → ${edge.to}: distancia ${distances[edge.to]}.`,[v,edge.to]);}
  }
 }else if(algorithm==='bellman'){
  const edges=graph.directed?graph.edges:graph.edges.flatMap(e=>[e,{from:e.to,to:e.from,weight:e.weight}]);
  for(let pass=1;pass<graph.vertices.length;pass++){let changed=false;for(const edge of edges)if(Number.isFinite(distances[edge.from])&&distances[edge.from]+edge.weight<distances[edge.to]){distances[edge.to]=distances[edge.from]+edge.weight;previous[edge.to]=edge.from;changed=true;push(`Pasada ${pass}: relajar ${edge.from} → ${edge.to}, distancia ${distances[edge.to]}.`,[edge.from,edge.to]);}if(!changed)break;}
  if(edges.some(e=>Number.isFinite(distances[e.from])&&distances[e.from]+e.weight<distances[e.to]))throw new Error('Existe un ciclo negativo alcanzable: no hay caminos mínimos finitos para sus descendientes.');
  visited.push(...graph.vertices.filter(v=>Number.isFinite(distances[v])));
 }else if(algorithm==='topological'){
  if(!graph.directed)throw new Error('El orden topológico requiere un grafo dirigido acíclico.');
  const indegree=Object.fromEntries(graph.vertices.map(v=>[v,0]));for(const edge of graph.edges)indegree[edge.to]++;
  const queue=graph.vertices.filter(v=>indegree[v]===0);while(queue.length){const v=queue.shift()!;visited.push(v);push(`Extraer ${v}, con grado de entrada cero.`,[v]);for(const e of adj.get(v)!)if(--indegree[e.to]===0)queue.push(e.to);}
  if(visited.length<graph.vertices.length)throw new Error('Hay un ciclo dirigido: no existe orden topológico.');
 }else{
  if(graph.directed)throw new Error('Prim y Kruskal requieren un grafo no dirigido.');
  if(algorithm==='kruskal'){
   const parent=new Map(graph.vertices.map(v=>[v,v]));const find=(v:string):string=>{while(parent.get(v)!==v){parent.set(v,parent.get(parent.get(v)!)!);v=parent.get(v)!;}return v;};
   for(const edge of [...graph.edges].sort((a,b)=>a.weight-b.weight)){const a=find(edge.from),b=find(edge.to);if(a===b){push(`Descartar ${edge.from}—${edge.to}: cerraría un ciclo.`,[edge.from,edge.to]);continue;}parent.set(a,b);selected.push(edge);for(const v of [edge.from,edge.to])if(!visited.includes(v))visited.push(v);push(`Aceptar ${edge.from}—${edge.to}, peso ${edge.weight}.`,[edge.from,edge.to]);}
  }else{
   const seen=new Set<string>();for(const root of [source,...graph.vertices.filter(v=>v!==source)]){if(seen.has(root))continue;seen.add(root);visited.push(root);push(`Comenzar componente en ${root}.`,[root]);while(true){let best:Edge|undefined;for(const edge of graph.edges){const crosses=seen.has(edge.from)!==seen.has(edge.to);if(crosses&&(!best||edge.weight<best.weight))best=edge;}if(!best)break;selected.push(best);const next=seen.has(best.from)?best.to:best.from;seen.add(next);visited.push(next);push(`Agregar ${best.from}—${best.to}, peso ${best.weight}.`,[best.from,best.to]);}}
  }
  const weight=selected.reduce((sum,e)=>sum+e.weight,0);push(`${selected.length===graph.vertices.length-1?'Árbol':'Bosque'} de expansión mínima: peso total ${weight}.`);return trace;
 }
 let path:string[]=[];if(target&&Number.isFinite(distances[target])&&algorithm!=='topological'){const seen=new Set<string>();let v:string|undefined=target;while(v!==undefined&&!seen.has(v)){seen.add(v);path.unshift(v);if(v===source)break;v=previous[v];}if(path[0]!==source)path=[];}
 push(algorithm==='topological'?`Orden topológico: ${visited.join(' → ')}.`:algorithm==='dfs'?`DFS completo. Orden: ${visited.join(' → ')}. Las distancias representan el árbol de descubrimiento, no caminos mínimos.`:`Recorrido completo.${target?path.length?` Camino a ${target}: ${path.join(' → ')}; distancia ${distances[target]}.`:` ${target} no es alcanzable.`:''}`,[],path);
 return trace;
}
