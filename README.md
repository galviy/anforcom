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
```
    backend/
    │
    ├── index.ts
    ├── server.ts
    ├── logger.ts
    │
    ├── DB/
    │   ├── connect.ts
    │   │
    │   ├── repositories/
    │   │   ├── UserRepository.ts
    │   │   ├── TeamRepository.ts
    │   │   ├── CompetitionRepository.ts
    │   │   ├── RegistrationRepository.ts
    │   │   └── PaymentRepository.ts
    │
    ├── services/
    │   ├── AuthService.ts
    │   ├── TeamService.ts
    │   ├── RegistrationService.ts
    │   ├── PaymentService.ts
    │   └── EmailService.ts
    │
    ├── handlers/
    │   │
    │   ├── routes/
    │   │   ├── auth.ts
    │   │   ├── user.ts
    │   │   ├── team.ts
    │   │   ├── registration.ts
    │   │   ├── payment.ts
    │   │   └── admin.ts
    │   │
    │   ├── middleware/
    │   │   ├── auth.ts
    │   │   ├── admin.ts
    │   │   └── rateLimit.ts
    │   │
    │   ├── validators/
    │   │   ├── login.ts
    │   │   ├── register.ts
    │   │   ├── team.ts
    │   │   └── payment.ts
    │   │
    │   ├── router.ts
    │   └── staticHandler.ts
    │
    ├── uploads/
    │   ├── ktm/
    │   └── profile/
    │
    └── utils/
        ├── jwt.ts
        ├── hash.ts
        ├── random.ts
        └── mail.ts


## Create account
```
curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
  -X POST http://127.0.0.1:1337/api/auth/create_account \
  -H "Content-Type: application/json" \
  -d '{"username": "galvin", "password": "galvin123", "email": "galvindoser@gmail.com", "no_telp": "085892297874", "tingkat_pendidikan": 1}'
```
  

## Login
```
  curl -i -w "\n\n[INFO] Waktu Total Respons: %{time_total} detik\n" \
  -X POST http://127.0.0.1:1337/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "galvin2", "password": "galvin123"}'
```
