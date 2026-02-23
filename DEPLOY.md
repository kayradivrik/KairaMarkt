# KairaMarkt – Render’a Deploy

## Deploy öncesi kontrol listesi

- [ ] Proje lokal çalışıyor: `backend` (port 5001) + `frontend` (npm run dev)
- [ ] MongoDB Atlas hesabı var, cluster oluşturuldu
- [ ] Atlas’ta **Network Access** → **Add IP** → **Allow Access from Anywhere** (0.0.0.0/0)
- [ ] Atlas’ta **Database Access** → kullanıcı + şifre; connection string kopyalandı
- [ ] GitHub/GitLab’a repo push edildi (Render bu repoyu kullanacak)

---

## 1. Backend (Web Service)

1. [Render](https://render.com) → **Dashboard** → **New** → **Web Service**
2. Repo’yu bağla (GitHub/GitLab), branch seç.
3. Ayarlar:
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install --legacy-peer-deps`
   - **Start Command:** `npm start`
4. **Environment Variables** ekle:

| Key | Value |
|-----|--------|
| NODE_ENV | production |
| MONGODB_URI | `mongodb+srv://<user>:<pass>@cluster...` (Atlas connection string) |
| JWT_SECRET | Güçlü rastgele string (örn. 32+ karakter) |
| FRONTEND_URL | Önce placeholder yaz, frontend deploy sonrası güncelle (örn. https://kairamarkt.onrender.com) |
| CLOUDINARY_CLOUD_NAME | (opsiyonel) |
| CLOUDINARY_API_KEY | (opsiyonel) |
| CLOUDINARY_API_SECRET | (opsiyonel) |

5. **Create Web Service** → Backend URL’i kopyala (örn. `https://kairamarkt-api.onrender.com`).

---

## 2. Frontend (Static Site)

1. Render → **New** → **Static Site**
2. Aynı repo’yu seç.
3. Ayarlar:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. **Environment Variables** ekle:

| Key | Value |
|-----|--------|
| VITE_API_URL | Backend URL (1. adımda kopyaladığın, **https ile**, sonunda / yok; örn. https://kairamarkt-api.onrender.com) |

5. **Create Static Site** → Deploy bitsin, frontend URL’i kopyala (örn. https://kairamarkt.onrender.com).

---

## 3. Son ayarlar

1. **Backend** → **Environment** → **FRONTEND_URL** değerini frontend’in gerçek URL’i ile güncelle (CORS için zorunlu).
2. **İlk admin kullanıcı:** Backend **Shell** (Render’da Service → Shell) açıp:
   ```bash
   npm run seed:admin
   ```
   Veya `backend/.env` örneğindeki gibi **ADMIN_EMAIL** ve **ADMIN_PASSWORD** environment variable ekleyip aynı komutu çalıştır.

---

## Deploy sırası (özet)

1. Backend’i deploy et → URL’i al.
2. Frontend’i deploy et → **VITE_API_URL** = backend URL.
3. Backend’de **FRONTEND_URL** = frontend URL yap.
4. Backend Shell’de `npm run seed:admin` çalıştır.

---

## Notlar

- Backend free tier’da ~15 dk hareketsizlikten sonra uyur; ilk istek 30–60 sn sürebilir (frontend’te 503 otomatik bir kez tekrar deniyor).
- MongoDB Atlas’ta **0.0.0.0/0** açık olmalı (Render IP’leri sabit değil).
- **JWT_SECRET** production’da mutlaka güçlü ve rastgele olsun.
- Render’da **Health Check Path** (opsiyonel): backend için `/api/health` kullanılabilir; route yoksa boş bırak.

**Geliştirme – Port 5001 dolu (EADDRINUSE):** Önce `netstat -ano | findstr :5001` ile PID’i bulun, sonra `taskkill /F /PID <PID>` ile kapatın. Veya backend’i çalıştırdığınız terminali kapatıp yeniden açın.
