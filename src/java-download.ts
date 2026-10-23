export function javaDownload(code:string):{filename:string;source:string}{
 const clean=code.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,' ');
 const tokens=clean.match(/[\p{L}_$][\p{L}\p{N}_$]*|[{};]/gu)||[];
 let depth=0,prefix:string[]=[];
 for(let i=0;i<tokens.length;i++){
  const token=tokens[i];
  if(token==='{'){depth++;prefix=[];continue;}if(token==='}'){depth--;prefix=[];continue;}if(token===';'){prefix=[];continue;}
  if(depth===0&&['class','interface','enum','record'].includes(token)){
   const name=tokens[i+1];
   if(name&&!prefix.some(modifier=>['static','private','protected'].includes(modifier)))return {filename:name+'.java',source:code};
   break;
  }
  if(depth===0)prefix.push(token);
 }
 const imports:string[]=[];
 const body=code.replace(/^\s*((?:package|import)\s+[^;\n]+;)[ \t]*/gm,(_,statement:string)=>{imports.push(statement);return '';}).trim();
 return {filename:'Solucion.java',source:(imports.length?imports.join('\n')+'\n\n':'')+'public class Solucion {\n'+body.split('\n').map(line=>'    '+line).join('\n')+'\n}\n'};
}
