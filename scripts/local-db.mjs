import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
export function database(path=':memory:'){
 const sqlite=new DatabaseSync(path);sqlite.exec('PRAGMA journal_mode=WAL');
 for(const file of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort()){
  sqlite.exec('CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY)');
  if(!sqlite.prepare('SELECT name FROM local_migrations WHERE name=?').get(file)){sqlite.exec(fs.readFileSync('drizzle/'+file,'utf8'));sqlite.prepare('INSERT INTO local_migrations (name) VALUES (?)').run(file);}
 }
 return {
  close:()=>sqlite.close(),
  prepare(sql) {
   return {bind(...values) {
    return {
     async first(){return sqlite.prepare(sql).get(...values)||null;},
     async run(){const r=sqlite.prepare(sql).run(...values);return {meta:{changes:Number(r.changes)}};},
     async all(){return {results:sqlite.prepare(sql).all(...values)};},
    };
   }};
  },
 };
}
