export type TableStep={table:number[][];active:[number,number]|null;message:string;result?:string};
export function lcsTrace(a:string,b:string):TableStep[]{
 const ac=[...a],bc=[...b];
 if(ac.length>12||bc.length>12)throw new Error('Usa cadenas de hasta 12 caracteres.');
 const table=Array.from({length:ac.length+1},()=>Array(bc.length+1).fill(0) as number[]),trace:TableStep[]=[];
 const push=(message:string,active:[number,number]|null,result?:string)=>trace.push({table:table.map(row=>[...row]),active,message,result});
 push('Una cadena vacía tiene LCS de longitud cero con cualquier cadena.',null);
 for(let i=1;i<=ac.length;i++)for(let j=1;j<=bc.length;j++){const equal=ac[i-1]===bc[j-1];table[i][j]=equal?table[i-1][j-1]+1:Math.max(table[i-1][j],table[i][j-1]);push(equal?`${ac[i-1]} = ${bc[j-1]}: sumar 1 a la diagonal (${table[i][j]}).`:`Caracteres diferentes: máximo de arriba e izquierda (${table[i][j]}).`,[i,j]);}
 let i=ac.length,j=bc.length,word='';while(i>0&&j>0){if(ac[i-1]===bc[j-1]){word=ac[i-1]+word;i--;j--;}else if(table[i-1][j]>=table[i][j-1])i--;else j--;}
 push(`Longitud ${table[ac.length][bc.length]}. Una subsecuencia común más larga: «${word}».`,null,word);return trace;
}
export type QueenStep={queens:number[];row:number;column:number;message:string;solution?:boolean};
export function queensTrace(n:number):QueenStep[]{
 if(!Number.isInteger(n)||n<1||n>6)throw new Error('El tablero admite de 1 a 6 reinas.');
 const queens:number[]=[],trace:QueenStep[]=[];const push=(row:number,column:number,message:string,solution?:boolean)=>{if(trace.length<5000)trace.push({queens:[...queens],row,column,message,solution});};
 push(0,-1,'Comenzamos sin reinas. Cada nivel elige una columna para una fila.');
 function place(row:number):boolean{if(row===n){push(row,-1,'Encontramos una solución: ninguna pareja comparte columna ni diagonal.',true);return true;}for(let column=0;column<n;column++){const conflict=queens.some((c,r)=>c===column||Math.abs(c-column)===row-r);push(row,column,`Probar fila ${row}, columna ${column}: ${conflict?'conflicto, podar esta rama.':'posición segura.'}`);if(conflict)continue;queens.push(column);push(row,column,'Colocar reina y explorar la siguiente fila.');if(place(row+1))return true;queens.pop();push(row,column,'La rama no completó una solución: retirar reina y probar otra columna.');}return false;}
 if(!place(0))push(0,-1,`No existe solución para ${n} reinas.`,false);return trace;
}
export type Interval={start:number;end:number};
export function scheduleTrace(intervals:Interval[]){if(intervals.some(i=>!Number.isFinite(i.start)||!Number.isFinite(i.end)||i.start>=i.end))throw new Error('Cada intervalo necesita inicio menor que fin.');const sorted=intervals.map((value,id)=>({...value,id})).sort((a,b)=>a.end-b.end||a.start-b.start);const chosen:number[]=[],trace:{chosen:number[];active:number;message:string}[]=[];let end=-Infinity;for(const interval of sorted){const accepted=interval.start>=end;if(accepted){chosen.push(interval.id);end=interval.end;}trace.push({chosen:[...chosen],active:interval.id,message:`[${interval.start}, ${interval.end}): ${accepted?'aceptar; deja disponible el tiempo desde '+end:'rechazar; se superpone con la última actividad elegida'}.`});}return trace;}
