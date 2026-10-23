/** Fisher–Yates option order; saved answers continue to use canonical question indices. */
export function optionOrder(length:number,random:()=>number=Math.random):number[]{
 if(!Number.isInteger(length)||length<0)throw new Error('La cantidad de opciones debe ser un entero no negativo.');
 const order=Array.from({length},(_,i)=>i);
 for(let i=length-1;i>0;i--){const r=random();if(!Number.isFinite(r)||r<0||r>=1)throw new Error('La fuente aleatoria debe devolver un valor en [0, 1).');const j=Math.floor(r*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 return order;
}
