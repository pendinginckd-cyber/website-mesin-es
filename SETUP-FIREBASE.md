# PANDUAN SETUP FIREBASE - MESIN ES KRISTAL WEB

## 1. BUAT FIREBASE PROJECT

1. Buka https://console.firebase.google.com/
2. Klik **Add project**
3. Nama project: `mesin-es-kristal-web`
4. (Opsional) Google Analytics: bisa disable untuk sekarang
5. Klik **Create project**
6. Tunggu sampai selesai, klik **Continue**

---

## 2. DAPATKAN FIREBASE CONFIG

1. Di Firebase Console, klik ikon **⚙️ Settings** → **Project settings**
2. Scroll ke bawah ke bagian **Your apps**
3. Klik ikon **Web** (`</>`)
4. App nickname: `mesin-es-kristal-web`
5. (Opsional) Setup Firebase Hosting: bisa skip untuk sekarang
6. Klik **Register app**
7. **Copy semua config** yang muncul:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "mesin-es-kristal-web.firebaseapp.com",
     projectId: "mesin-es-kristal-web",
     storageBucket: "mesin-es-kristal-web.firebasestorage.app",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
8. Paste ke file `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mesin-es-kristal-web.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=mesin-es-kristal-web
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mesin-es-kristal-web.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

---

## 3. SETUP FIREBASE AUTHENTICATION

1. Di Firebase Console, klik **Build** → **Authentication**
2. Klik **Get started**
3. Di tab **Sign-in method**, klik **Email/Password**
4. Toggle **Enable** → Klik **Save**

### Buat Admin User Pertama

1. Di tab **Users**, klik **Add user**
2. Email: `adminhvac@gmail.com`
3. Password: (buat password yang kuat, minimal 6 karakter)
4. Klik **Add user**
5. **Copy UID** user yang baru dibuat (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

## 4. SETUP FIRESTORE DATABASE

1. Di Firebase Console, klik **Build** → **Firestore Database**
2. Klik **Create database**
3. Pilih **Start in production mode** (kita sudah punya rules)
4. Location: pilih `asia-southeast2` (Jakarta) atau `us-central1`
5. Klik **Create**

### Buat Document Admin di Firestore

1. Setelah database dibuat, klik **Start collection**
2. Collection ID: `admins`
3. Document ID: **Paste UID** dari user yang dibuat di Authentication
4. Fields:
   ```
   email (string): adminhvac@gmail.com
   displayName (string): Admin HVAC
   role (string): superadmin
   createdAt (timestamp): (klik tombol "now")
   ```
5. Klik **Save**

---

## 5. SETUP FIREBASE STORAGE

1. Di Firebase Console, klik **Build** → **Storage**
2. Klik **Get started**
3. Pilih **Start in production mode** (kita sudah punya rules)
4. Location: sama dengan Firestore
5. Klik **Done**

### Upload Firestore Rules

1. Di Firebase Console, klik **Build** → **Firestore Database**
2. Klik tab **Rules**
3. Copy isi file `firestore.rules` dari project ini
4. Paste ke Rules editor
5. Klik **Publish**

### Upload Storage Rules

1. Di Firebase Console, klik **Build** → **Storage**
2. Klik tab **Rules**
3. Copy isi file `storage.rules` dari project ini
4. Paste ke Rules editor
5. Klik **Publish**

---

## 6. SETUP FIREBASE CLI (Opsional - untuk deploy)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init project (di folder project)
firebase init

# Pilih:
# - Hosting: Configure files for Firebase Hosting
# - Firestore: Deploy rules
# - Storage: Deploy rules

# Pilih project: mesin-es-kristal-web

# Deploy
firebase deploy
```

---

## 7. TEST LOGIN

1. Jalankan development server: `npm run dev`
2. Buka `http://localhost:3000/admin/login`
3. Login dengan:
   - Email: `adminhvac@gmail.com`
   - Password: (password yang dibuat di langkah 3)
4. Jika berhasil → redirect ke `/admin`
5. Jika gagal → cek console untuk error

---

## 8. TAMBAH ADMIN BARU (Opsional)

Jika ingin tambah admin lain:

1. Buat user baru di **Authentication** → **Add user**
2. Copy UID user baru
3. Buat document di collection `admins` dengan Document ID = UID
4. Isi fields: `email`, `displayName`, `role`, `createdAt`

---

## 9. TROUBLESHOOTING

### Error: "Firebase: Error (auth/invalid-api-key)"
- Pastikan `.env.local` sudah diisi dengan config yang benar
- Restart dev server setelah edit `.env.local`

### Error: "Anda tidak memiliki akses admin"
- Pastikan user sudah dibuat di Authentication
- Pastikan document admin sudah ada di Firestore collection `admins`
- Pastikan UID di Firestore sama dengan UID di Authentication

### Error: "Missing or insufficient permissions"
- Pastikan Firestore rules sudah di-publish
- Pastikan Storage rules sudah di-publish

### Login berhasil tapi redirect ke /admin/login lagi
- Cek console browser untuk error
- Pastikan collection `admins` ada document dengan UID yang benar
- Cek network tab untuk Firestore query

---

## 10. CHECKLIST SETUP

- [ ] Firebase project `mesin-es-kristal-web` dibuat
- [ ] Firebase config didapat dan dipaste ke `.env.local`
- [ ] Authentication diaktifkan (Email/Password)
- [ ] User admin `adminhvac@gmail.com` dibuat di Authentication
- [ ] UID admin dicopy
- [ ] Firestore database dibuat (production mode)
- [ ] Collection `admins` dibuat dengan document admin
- [ ] Storage diaktifkan (production mode)
- [ ] Firestore rules di-publish
- [ ] Storage rules di-publish
- [ ] Test login berhasil
- [ ] `.env.local` tidak ter-commit ke git (sudah di `.gitignore`)
