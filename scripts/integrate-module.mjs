import { readFile, writeFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
for (const argument of process.argv.slice(2)) {
  const id=Number(argument);
  if(!Number.isInteger(id)||id<2||id>16)throw new Error('Indica módulos entre 2 y 16.');
  const padded=String(id).padStart(2,'0'),name=`module${padded}`,file=`src/data/${name}.ts`;
  await access(file);
  const path='src/data/course.ts';let registry=await readFile(path,'utf8');
  const registered=registry.includes(`import { ${name} }`);
  let tracked=false;try{execFileSync('git',['ls-files','--error-unmatch',file],{stdio:'ignore'});tracked=true;}catch{}
  if(registered&&tracked){console.log(`El módulo ${id} ya está integrado.`);continue;}
  if(!registered)registry=registry.replace('export const moduleContents:',`import { ${name} } from './${name}.js';\n\nexport const moduleContents:`).replace('\n];',`\n  ${name},\n];`);
  await writeFile(path,registry);
  try {const output=execFileSync('npm',['test'],{encoding:'utf8'});const summary=output.split('\n').filter(line=>/ℹ (tests|pass|fail)/.test(line)).join(' · ');console.log(`Módulo ${id}: ${summary}`);}catch(error){process.stderr.write(error.stdout||'');process.stderr.write(error.stderr||'');process.exit(1);}
  const syllabus=await import(new URL('../dist/data/curriculum.js',import.meta.url));
  const title=syllabus.modules.find(module=>module.id===id).title;
  execFileSync('git',['add',file,path],{stdio:'inherit'});
  execFileSync('git',['commit','-m',`feat: desarrollar módulo ${id} · ${title}`],{stdio:'inherit'});
  execFileSync('git',['push','origin','main'],{stdio:'inherit'});
}
