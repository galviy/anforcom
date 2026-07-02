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
  - [x] create_team (buat team)
  - [x] show_team (show isi team)
  - [x] show_member_team (show isi member team, parameter tim_id ?) 
  - [x] delete_team
  - [x] delete_user_team
  - [ ] add_member_team (parameter nama_lengkap,asal_instansi_tim_id,nomor_induk,kartu tanda pelajar/mahasiswa)

![Database ERD](database.png)

API Documentation [Dokumentasi API](api_documentation.md) 



