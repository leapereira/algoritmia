import test from 'node:test';import assert from 'node:assert/strict';import {javaDownload} from '../src/java-download.ts';
test('la descarga distingue clases completas, clases anidadas y fragmentos con imports',()=>{
 const complete='public class Aula { static int f() { return 1; } }';assert.deepEqual(javaDownload(complete),{filename:'Aula.java',source:complete});
 for(const fragment of ['static final class ABB { int valor; }','private static class Cache {}','static int suma(int a,int b) { return a+b; }']){const result=javaDownload(fragment);assert.equal(result.filename,'Solucion.java');assert.ok(result.source.startsWith('public class Solucion {'));assert.ok(result.source.includes(fragment));}
 const code=javaDownload('import java.util.List;\nstatic int longitud(List<?> a) { return a.size(); }');assert.ok(code.source.startsWith('import java.util.List;\n\npublic class Solucion'));
 assert.equal(javaDownload('// class Falsa {}\npublic class Real {String s="class Tampoco {}";}').filename,'Real.java');
});
