#!/usr/bin/env python3
"""Instalador SQLite repetible. Detener Next.js y los workers antes de migrar."""
import argparse
from contextlib import closing
from datetime import datetime
from pathlib import Path
import os
import re
import sqlite3
import sys
import tempfile

ROOT = Path(__file__).resolve().parent.parent
DDL = ROOT / 'database/scripts/ddl.sql'
MIGRATIONS = ROOT / 'database/migrations'
SEED_FILES = sorted((ROOT / 'database/seeds').glob('[0-9][0-9][0-9]_*.sql'))
DEFAULT_DB = ROOT / 'database/backend.db'
OFFER_COLUMNS = {'creditos_minimos', 'horas_requeridas', 'clave_programa'}
ADMIN_COLUMNS = {
 'USUARIOS': {'eliminado_en':'TEXT'},
 'CATALOGO_FACULTADES': {'activo':'INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1))','clave':'TEXT','sede':'TEXT'},
 'CATALOGO_CARRERAS': {'activo':'INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1))','clave':'TEXT'},
 'CATALOGO_EJES_ACCION': {'activo':'INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1))','descripcion':'TEXT'},
 'CATALOGO_HABILIDADES': {'activo':'INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1))','categoria':'TEXT','sinonimos':'TEXT'},
}
CATALOGS = ('CATALOGO_FACULTADES','CATALOGO_CARRERAS','CATALOGO_HABILIDADES','CATALOGO_EJES_ACCION','CATALOGO_PLANES','CATALOGO_PROMOCION','ESTATUS_COMPRA')

def columns(db, table):
    return {r[1] for r in db.execute(f'PRAGMA table_info("{table}")')}

def objects(db):
    return {(t,n) for t,n in db.execute('SELECT type,name FROM sqlite_master')}

def sql_for(number):
    matches = list(MIGRATIONS.glob(f'{number:03d}_*.sql'))
    if len(matches) != 1:
        raise RuntimeError(f'Se esperaba exactamente una migración {number:03d}.')
    return matches[0].read_text(encoding='utf-8')

def expected_objects(number):
    return {(kind.lower().replace('unique ',''),name) for kind,name in re.findall(r'CREATE\s+(TABLE|(?:UNIQUE\s+)?INDEX|TRIGGER)\s+IF\s+NOT\s+EXISTS\s+(\w+)',sql_for(number),re.I)}

def ready(db, number):
    if number == 9:
        return db.execute("PRAGMA user_version").fetchone()[0] >= 9
    if number == 1:
        for table,word in [('EMPRESAS','suspendida'),('OFERTAS','internship')]:
            r=db.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name=?",(table,)).fetchone()
            if not r or "'"+word+"'" not in r[0]:return False
        return True
    if number == 4:
        return OFFER_COLUMNS <= columns(db,'OFERTAS')
    if number == 7 and not {'evento_id','url'} <= columns(db,'NOTIFICACIONES'):
        return False
    if number == 8 and any(not set(required)<=columns(db,t) for t,required in ADMIN_COLUMNS.items()):
        return False
    return expected_objects(number) <= objects(db)

def integrity(db):
    if db.execute('PRAGMA integrity_check').fetchone()[0]!='ok' or db.execute('PRAGMA foreign_key_check').fetchone():
        raise RuntimeError('La base no pasó las comprobaciones de integridad o claves foráneas.')

def apply_sql(db, sql):
    # Ejecutar DDL y validar antes del commit; la separación respeta triggers.
    db.execute('BEGIN IMMEDIATE')
    try:
        statement=''
        for line in sql.splitlines(keepends=True):
            statement+=line
            if sqlite3.complete_statement(statement):
                db.execute(statement)
                statement=''
        if statement.strip() and any(s.strip() and not s.lstrip().startswith('--') for s in statement.splitlines()):
            raise RuntimeError('SQL incompleto.')
        integrity(db)
        db.commit()
    except Exception:
        db.rollback()
        raise

def apply_migration(db, number):
    if ready(db,number):return False
    sql=sql_for(number)
    if number==1:
        # 001 reconstruye tablas: nunca ejecutarla sobre un esquema posterior.
        if OFFER_COLUMNS & columns(db,'OFERTAS') or any(("table",t) in objects(db) for t in ('EVENTOS_DOMINIO','CHECKOUT_INTENTOS','ADMIN_ACCIONES')):
            raise RuntimeError('Migración 001 incompatible con columnas/tablas posteriores; no se reconstruirán tablas automáticamente.')
        db.executescript(sql)
        integrity(db)
    else:
        prefix=[]
        if number==4:
            sql='\n'.join(line for line in sql.splitlines() if any(line.startswith('ALTER TABLE OFERTAS ADD COLUMN '+col+' ') for col in OFFER_COLUMNS-columns(db,'OFERTAS')))
        if number==7:
            for col,definition in {'evento_id':'INTEGER REFERENCES EVENTOS_DOMINIO(id)','url':'TEXT'}.items():
                if col not in columns(db,'NOTIFICACIONES'):prefix.append(f'ALTER TABLE NOTIFICACIONES ADD COLUMN {col} {definition};')
        if number==8:
            for table,defs in ADMIN_COLUMNS.items():
                present=columns(db,table)
                if not present:raise RuntimeError(f'Falta tabla {table}')
                for col,definition in defs.items():
                    if col not in present:prefix.append(f'ALTER TABLE {table} ADD COLUMN {col} {definition};')
        apply_sql(db,'\n'.join(prefix)+'\n'+sql)
    if not ready(db,number):raise RuntimeError(f'Migración {number:03d} incompleta.')
    return True

def seed_catalogs(db):
    if len(SEED_FILES)!=4:raise RuntimeError('Se esperaban cuatro seeds.')
    before=db.total_changes
    apply_sql(db,'\n'.join(f.read_text(encoding='utf-8') for f in SEED_FILES))
    return db.total_changes-before

def check(db):
    db.execute('PRAGMA foreign_keys=ON')
    integrity(db)
    missing=[n for n in range(1,10) if not ready(db,n)]
    if missing:raise RuntimeError('Migraciones pendientes: '+', '.join(f'{n:03d}' for n in missing))
    must={'trg_suscripcion_fijar_cupos','trg_promocion_incluida_consumir','trg_compra_no_cobrar_incluida','trg_promocion_identidad_fija','trg_promocion_incluida_no_extender'}
    if not {('trigger',n) for n in must}<=objects(db):raise RuntimeError('Faltan triggers comerciales.')
    return sum(t=='table' and not n.startswith('sqlite_') for t,n in objects(db))

def print_catalogs(db):
    for t in CATALOGS:print(f'  {t}: {db.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]}')

def backup(db,path):
    dst=path.with_name(path.name+'.bak_'+datetime.now().strftime('%Y%m%d_%H%M%S_%f'))
    with closing(sqlite3.connect(dst)) as target:db.backup(target)
    print('Respaldo:',dst)
    return dst

def connect(path,readonly=False):
    db=sqlite3.connect(path.resolve().as_uri()+'?mode=ro',uri=True,isolation_level=None) if readonly else sqlite3.connect(path,isolation_level=None)
    db.execute('PRAGMA busy_timeout=5000');db.execute('PRAGMA foreign_keys=ON')
    return db

def prepare(db_path,check_only,seed_existing=False):
    db_path=Path(db_path)
    if check_only:
        if not db_path.is_file():raise FileNotFoundError(db_path)
        with closing(connect(db_path,True)) as db:
            print(f'OK: {check(db)} tablas; integridad y FK OK');print_catalogs(db)
        return
    db_path.parent.mkdir(parents=True,exist_ok=True)
    existed=db_path.is_file() and db_path.stat().st_size>0
    if not existed:
        # Construir en un archivo temporal contiguo; publicar solo después de validar.
        # Así un fallo de instalación no deja una base parcialmente inicializada.
        fd, filename=tempfile.mkstemp(prefix='.conectu_instalacion_',suffix='.db',dir=db_path.parent)
        os.close(fd); tmp=Path(filename)
        try:
            with closing(connect(tmp)) as db:
                db.executescript(DDL.read_text(encoding='utf8'))
                for n in range(1,10):
                    if apply_migration(db,n):print(f'Migración {n:03d} aplicada.')
                print(f'Seeds: {seed_catalogs(db)} registros nuevos.')
                count=check(db)
                print(f'Listo: {count} tablas; integridad y FK OK');print_catalogs(db)
            if db_path.exists() and db_path.stat().st_size>0:
                raise RuntimeError('Se creó otra base durante la instalación. No se reemplazará.')
            os.replace(tmp,db_path)
        finally:
            tmp.unlink(missing_ok=True)
        return
    with closing(connect(db_path)) as db:
        integrity(db)
        if ('table','USUARIOS') not in objects(db):raise RuntimeError('No es una base ConectU compatible.')
        pending=[n for n in range(1,10) if not ready(db,n)]
        # Para una base existente, no reinsertar nombres que un administrador renombró.
        # --seed-existing es una acción explícita para completar un catálogo incompleto.
        need_seed=not existed
        if existed and seed_existing:
            with closing(sqlite3.connect(':memory:',isolation_level=None)) as trial:
                db.backup(trial);trial.execute('PRAGMA foreign_keys=ON')
                for n in pending:apply_migration(trial,n)
                need_seed=seed_catalogs(trial)>0
        if existed and (pending or need_seed):backup(db,db_path)
        for n in pending:
            if apply_migration(db,n):print(f'Migración {n:03d} aplicada.')
        if need_seed:print(f'Seeds: {seed_catalogs(db)} registros nuevos.')
        elif existed:print('Catálogos existentes conservados.')
        if existed and not pending and not need_seed:print('Sin cambios; no se generó respaldo.')
        print(f'Listo: {check(db)} tablas; integridad y FK OK');print_catalogs(db)

def migration_cli(number):
    p=argparse.ArgumentParser(description=f'Migración {number:03d} repetible')
    p.add_argument('--database',type=Path,default=Path(os.environ.get('DATABASE_PATH') or DEFAULT_DB));p.add_argument('--check',action='store_true');a=p.parse_args()
    path=(ROOT/a.database).resolve()
    if not path.is_file():p.error(f'No existe {path}')
    with closing(connect(path,a.check)) as db:
        integrity(db)
        if ready(db,number):print(f'OK: migración {number:03d} ya instalada. Sin cambios ni respaldo.');return
        if a.check:raise SystemExit(f'Falta migración {number:03d}.')
        prior=[n for n in range(1,number) if not ready(db,n)]
        if prior:raise SystemExit(f'Migraciones anteriores pendientes: {prior}. Ejecuta preparar_db.py.')
        backup(db,path);apply_migration(db,number);print(f'OK: migración {number:03d} aplicada.')

def main():
    p=argparse.ArgumentParser();p.add_argument('--database',type=Path,default=Path(os.environ.get('DATABASE_PATH') or DEFAULT_DB));p.add_argument('--check',action='store_true');p.add_argument('--seed-existing',action='store_true');a=p.parse_args()
    try:prepare((ROOT/a.database).resolve(),a.check,a.seed_existing)
    except Exception as exc:print(f'ERROR: {exc}',file=sys.stderr);sys.exit(1)
if __name__=='__main__':main()
