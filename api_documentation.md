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

{"success":true,"data":[{"id":12,"nama_lengkap":"Galvin Shala","asal_instansi":"Universitas Diponegoro","nomor_induk":"24060124140162","data_image":"beb688de-a4e0-41cc-a8ea-ea6841663aff.jpg"},{"id":13,"nama_lengkap":"Galvin Shala","asal_instansi":"Universitas Diponegoro","nomor_induk":"24060124140162","data_image":"4f530414-018d-4eee-b824-fe8cf4c31e85.jpg"},{"id":14,"nama_lengkap":"Galvin Shala","asal_instansi":"Universitas Diponegoro","nomor_induk":"24060124140162","data_image":"ec260abb-7a80-4d9d-aaf6-2ebc48b3fce5.jpg"}]}

[INFO] Waktu Total Respons: 0.004338 detik
```

# delete team

```curl
curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
      -X POST http://127.0.0.1:1337/api/teams/delete_team \
      -H "Content-Type: application/json" \
      -H "Cookie: session=valid_session" \
      -d '{"tim_id": 123}'
```

Response berhasil

```nginx
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Thu, 02 Jul 2026 07:30:43 GMT
Content-Length: 16

{"success":true}

[INFO] Waktu Total Respons: 0.012674 detik
```


# delete user didalam tim

```curl
curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
-X POST http://127.0.0.1:1337/api/teams/delete_user_team \
-H "Content-Type: application/json" \
-H "Cookie: session=valid_session" \
-d '{"tim_id": 409,"user_id": 3}'
```

Response berhasil


```nginx
HTTP/1.1 404 Not Found
Content-Type: application/json;charset=utf-8
Date: Thu, 02 Jul 2026 08:53:51 GMT
Content-Length: 16

{"success":true}

[INFO] Waktu Total Respons: 0.010545 detik
```

# view ktm tiap user

```curl
curl -X GET http://127.0.0.1:1337/api/teams/view_ktm?id=4f530414-018d-4eee-b824-fe8cf4c31e85.jpg \
-H "Cookie: session=active_session"
```

Response berhasil

file dati data_ktm

# Add user team

```curl
curl -X POST http://127.0.0.1:1337/api/teams/add_user_team \
-H "Cookie: session=active_session" \
-F "nama_lengkap=Galvin Shala" \
-F "asal_instansi=Universitas Diponegoro" \
-F "tim_id=409" \
-F "nomor_induk=24060124140162" \
-F "data_photo=@$HOME/Downloads/file.jpg;type=image/jpeg"
                                                                   
```

Response berhasil
```nginx
{
  "success": true,
  "message": "Uploaded namafoto.jpg with size of 2.3456",
  "nama_file": "a1b2c3d4-uuid.jpg"
}
```

# reset password verification


```curl
curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
-X POST http://127.0.0.1:1337/api/auth/reset_password \
-H "Content-Type: application/json" \
-d '{"email": "galvindoser@gmail.com"}'
```

```nginx
Response
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Mon, 13 Jul 2026 13:39:53 GMT
Content-Length: 108

{"success":true,"error":"If an account with that email address exists, we have sent a password reset link."}

[INFO] Waktu Total Respons: 0.006958 detik
```

# Reset password

```curl
curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
-X POST http://127.0.0.1:1337/api/auth/reset_confirmation?token=FYinXyMm1Gzzf5UqwCVB-jNvvgoxbPyvxZlJ9rU6HdVm46u9KRa7yXaWfZPVlBDerDx7F3er \
-H "Content-Type: application/json" \
-d '{"new_password1": "bjorka","new_password2": "bjorka"}'
```

Response berhasil

```nginx
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Mon, 13 Jul 2026 13:40:35 GMT
Content-Length: 66

{"success":true,"message":"Password has been reset successfully."}

[INFO] Waktu Total Respons: 0.093443 detik
```