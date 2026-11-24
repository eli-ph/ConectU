#!/usr/bin/env python3
"""Crea el primer administrador (solo si no existe). Sin contraseñas en argumentos o archivos."""
from pathlib import Path
from contextlib import closing
from getpass import getpass
import hashlib
import secrets
import sqlite3
import re
import os

ROOT = Path(__file__).resolve().parent.parent
DB = ROOT / Path(os.environ.get("DATABASE_PATH") or "database/backend.db")


def valido(password):
    import unicodedata
    return (8 <= len(password) <= 128 and any(ch.isupper() for ch in password)
            and any(ch.islower() for ch in password) and any(ch.isdecimal() for ch in password)
            and any(unicodedata.category(ch)[0] in ("P", "S") for ch in password))


def main():
    if not DB.is_file():
        raise SystemExit("No existe database/backend.db. Ejecuta primero preparar_db.py.")
    with closing(sqlite3.connect(DB)) as conn, conn:
        if conn.execute("SELECT 1 FROM USUARIOS WHERE rol='admin' LIMIT 1").fetchone():
            print("Ya existe un administrador. Sin cambios; el alta adicional se realiza desde el módulo protegido.")
            return
        print("Crear primer administrador de ConectU")
        nombre = input("Nombre: ").strip()
        apellidos = input("Apellidos: ").strip()
        email = input("Correo: ").strip().lower()
        if not nombre or not apellidos or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
            raise SystemExit("Nombre, apellidos o correo inválidos.")
        password = getpass("Contraseña (no se muestra): ")
        confirm = getpass("Repite la contraseña: ")
        if password != confirm or not valido(password):
            raise SystemExit("Las contraseñas no coinciden o no cumplen: 8 caracteres, mayúscula, minúscula, número y símbolo.")
        salt = secrets.token_bytes(16)
        hashed = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=16384, r=8, p=1, dklen=64)
        formatted = f"scrypt$16384$8$1${salt.hex()}${hashed.hex()}"
        conn.execute("BEGIN IMMEDIATE")
        if conn.execute("SELECT 1 FROM USUARIOS WHERE rol='admin' LIMIT 1").fetchone():
            print("Ya existe un administrador. Sin cambios.")
            return
        try:
            conn.execute("INSERT INTO USUARIOS(nombre,apellidos,email,password_hash,rol,email_verificado) VALUES(?,?,?,?,'admin',1)",
                         (nombre, apellidos, email, formatted))
        except sqlite3.IntegrityError as exc:
            raise SystemExit("Ya existe ese correo en la base. No se realizaron cambios.") from exc
        print("Administrador creado. Puedes iniciar sesión en /ingresar.")

if __name__ == "__main__":
    main()
