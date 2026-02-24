# Render’a deploy rehberi

## 1. Backend (Web Service)

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables (Render → Environment):**
  - `NODE_ENV` = `production`
  - `MONGODB_URI` = MongoDB Atlas connection string (örn. `mongodb+srv://user:pass@cluster.mongodb.net/okumarket`)
  - `JWT_SECRET` = güçlü rastgele string
  - `JWT_EXPIRE` = `7d` (isteğe bağlı)
  - `JWT_REMEMBER_EXPIRE` = `30d` (isteğe bağlı)
  - `FRONTEND_URL` = Frontend’in canlı adresi (örn. `https://okuproje.onrender.com`) — **CORS için zorunlu**
  - Cloudinary kullanıyorsan: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **PORT:** Render otomatik atar, `server.js` zaten `process.env.PORT` kullanıyor.

Backend’i deploy ettikten sonra oluşan URL’i kopyala (örn. `https://okuproje-api.onrender.com`).

---

## 2. Frontend (Static Site)

- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Environment Variables (build sırasında kullanılır):**
  - `VITE_API_URL` = Backend’in canlı URL’i, **sonunda slash olmadan** (örn. `https://okuproje-api.onrender.com`)

Frontend’i deploy etmeden önce Render’da bu environment variable’ı ekle; build sırasında Vite buna göre API adresini gömerek canlıda doğru backend’e istek atar.

---

## 3. Kontrol listesi

- [ ] Backend’de `FRONTEND_URL` = frontend’in Render URL’i (https ile)
- [ ] Frontend’de `VITE_API_URL` = backend’in Render URL’i (https, sonunda / yok)
- [ ] MongoDB Atlas’ta IP kısıtı yoksa `0.0.0.0/0` veya Render IP’leri açık
- [ ] JWT_SECRET production’da güçlü ve gizli

---

## 4. Notlar

- **Cold start:** Render free tier’da backend 15 dk hareketsiz kalınca uyur; ilk istek 30–60 sn sürebilir, sonrası normal.
- **Cookie / CORS:** Backend’deki `FRONTEND_URL` ile frontend adresi aynı olmalı; böylece cookie’ler (giriş vb.) sorunsuz çalışır.
- Logo/yükleme için Cloudinary kullanıyorsan ilgili env’leri backend’e eklemeyi unutma.
