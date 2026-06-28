# anforcom

# install bun

1. Arch Linux
```bash
sudo pacman -S bun
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun --watch --hot backend/index.ts
```

This project was created using `bun init` in bun v1.3.11. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.


# Backend to do


## Create account
```curl
curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
  -X POST http://127.0.0.1:1337/api/auth/create_account \
  -H "Content-Type: application/json" \
  -d '{"username": "galvin", "password": "galvin123", "email": "galvindoser@gmail.com", "no_telp": "085892297874", "tingkat_pendidikan": 1}'
```
  

## Login
```curl
  curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
  -X POST http://127.0.0.1:1337/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "galvin2", "password": "galvin123"}'
```

## Mengambil informasi untuk show di frontend

```curl
  curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
  -X GET http://127.0.0.1:1337/api/user/me \
  -H "Cookie: session=valid session"
```
