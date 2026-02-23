# KairaMarkt – Nasıl Çalıştırılır

Backend **5001** portunda çalışıyor (5000 çakışması yok).

---

## Tek seferlik kurulum (zaten yaptıysan atla)

```bash
cd backend
npm install --legacy-peer-deps
npm run seed:admin
```

```bash
cd frontend
npm install
```

---

## Her seferinde çalıştırma

### 1. Backend (bir terminal)

```bash
cd C:\Users\kdivrik.BALPARMAK\Desktop\okuproje\backend
npm run dev
```

Göreceğin çıktı:
- `MongoDB bağlı: ...`
- `Server http://localhost:5001 portunda çalışıyor`

### 2. Frontend (ikinci terminal)

```bash
cd C:\Users\kdivrik.BALPARMAK\Desktop\okuproje\frontend
npm run dev
```

Tarayıcıda aç: **http://localhost:5173**

---

## Admin giriş

- **E-posta:** admin@kairamarkt.com  
- **Şifre:** admin123  

Giriş yap → sağ üstten **Admin** veya **http://localhost:5173/admin**

---

## Sorun çıkarsa

- **"address already in use"** → 5001 de doluysa `backend\.env` içinde `PORT=5002` yap; frontend `vite.config.js` içinde proxy target’ı `http://localhost:5002` yap.
- **Backend hiç açılmıyor** → Aynı klasörde iki kez `npm run dev` çalıştırma; bir önceki terminali kapat.
