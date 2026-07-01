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
- endpoint  /emails
  - [ ] send_otp_email

  - [ ] verify/token (activate account)
  
  
- tambah endpoint /teams

  a. [x] create_team (buat team)

  b. [x] show_team (show isi team)

  c. [x] show_member_team (show isi member team, parameter tim_id ?) 

  d. [ ] delete_team

  e. [ ] delete_user_team

  f. [ ] add_member_team (parameter nama_lengkap,asal_instansi_tim_id,nomor_induk,kartu tanda pelajar/mahasiswa)

![Database ERD](database.png)


## Create account
```nginx
curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
-X POST http://127.0.0.1:1337/api/auth/create_account \
-H "Content-Type: application/json" \
-d '{"username": "galvintest", "password": "galvin123", "email": "galvindoserr@gmail.com", "no_tlp": "0848992297874", "tingkat_pendidikan": 1}'
```

tingkat_pendidikan 1 = mahasiswa
tingkat_pendidikan 2 = sma/sederajat

Response dari Server

```nginx
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Sun, 28 Jun 2026 08:39:23 GMT
Content-Length: 93

{"success":true,"message":"Successfully created galvintest please relogin to get session_id"}

[INFO] Waktu Total Respons: 0.099673 detik
```

## Login
```curl
 curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
 -X POST http://127.0.0.1:1337/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"username": "galvintest", "password": "galvin123"}'
```

response dari server

```nginx
HTTP/1.1 200 OK
set-cookie: session=2aA9dEHvjblIeSZhKbTTnOwbuufZIgeqy6TQGj2LDc1w6pStytZRbd7A1kG5dORH_auBr5BJCKImhlTEAzmnu7hJeOJ2oBIN_kjOVAc5Ju_NAWUor-B97tEzaEtbQlQJiFIP5eJ8tZzZG4C85uPSGRXDooHOlHnJLCFs68qzDcg4ilZVk1Rd3tYdrb4gQhBeUUWmBvoPNmm7Nn_Gqgjir_wWSQdUcP3upgs; HttpOnly; Path=/; Max-Age=86400
Content-Type: application/json;charset=utf-8
Date: Sun, 28 Jun 2026 08:40:53 GMT
Content-Length: 16

{"success":true}

[INFO] Waktu Total Respons: 0.094432 detik
```

## Mengambil informasi untuk show di frontend

```curl
  curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
  -X GET http://127.0.0.1:1337/api/user/me \
  -H "Cookie: session=valid_session"
```

Response dari server

```nginx
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Sun, 28 Jun 2026 08:42:33 GMT
Content-Length: 101

{"username":"galvintest","email":"galvindoserr@gmail.com","no_tlp":"0848992297874","pendidikan_id":1}

[INFO] Waktu Total Respons: 0.001074 detik
```

## Register team

```curl
curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
-X POST http://127.0.0.1:1337/api/teams/create_team \
-H "Content-Type: application/json" \
-H "Cookie: session=valid_session" \
-d '{"team_name": "Jangan lupa join arkavidia","lomba_id":2}'
```

Response

Gagal

```nginx
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=utf-8
Date: Tue, 30 Jun 2026 07:32:57 GMT
Content-Length: 138

{"success":false,"error":"Saat ini kamu terdaftar sebagai Kategori (Sarjana),lomba tersebut hanya tersedia untuk kategori SMA/Sederajat!"}

[INFO] Waktu Total Respons: 0.001249 detik
```

```nginx
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Tue, 30 Jun 2026 07:33:18 GMT
Content-Length: 171

{"error":true,"message":"Kamu sudah punya tim, untuk saat ini hanya tersedia 1 perlombaan untuk kategori sarjana, maka kamu tidak diizinkan untuk membuat tim baru lagi!."}

[INFO] Waktu Total Respons: 0.004125 detik
```


# Show isi team

```curl
curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
-X GET http://127.0.0.1:1337/api/teams/show_team \
-H "Cookie: session=valid_session"
```
Response berhasil

```nginx
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Wed, 01 Jul 2026 14:33:42 GMT
Content-Length: 76

{"success":true,"data":[{"id":408,"nama_tim":"Jangan lupa join arkavidia"}]}

[INFO] Waktu Total Respons: 0.009535 detik
```

# Show member team


```curl
curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
-X POST http://127.0.0.1:1337/api/teams/show_member_teams \
-H "Content-Type: application/json" \
-H "Cookie: session=valid_session" \
-d '{"tim_id": id_team}'

```

Response berhasil
```
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Wed, 01 Jul 2026 14:35:30 GMT
Content-Length: 115

{"success":true,"data":[{"id":1,"nama_lengkap":"Galvin S","asal_instansi":"UNDIP","nomor_induk":"24060124140162"}]}

[INFO] Waktu Total Respons: 0.004338 detik
```
