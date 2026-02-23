# KairaMarkt – E-Ticaret Uygulaması

MediaMarkt tarzı teknoloji e-ticaret projesi. React (Vite) + Node.js (Express) + MongoDB.

## Gereksinimler

- Node.js 18+
- MongoDB (yerel veya Atlas)
- (Opsiyonel) Cloudinary hesabı – ürün görselleri için

## Kurulum

### 1. Backend

```bash
cd backend
cp .env.example .env
# .env içinde MONGODB_URI, JWT_SECRET vb. düzenle
npm install
npm run seed:admin   # İlk admin: admin@kairamarkt.com / admin123 (veya ADMIN_EMAIL, ADMIN_PASSWORD)
npm run dev
```

Backend varsayılan olarak http://localhost:5000 üzerinde çalışır.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend http://localhost:5173 üzerinde çalışır ve API isteklerini proxy ile backend’e yollar.

### 3. Ortam Değişkenleri (backend .env)

| Değişken | Açıklama |
|----------|----------|
| PORT | Sunucu portu (varsayılan 5000) |
| MONGODB_URI | MongoDB bağlantı adresi |
| JWT_SECRET | JWT imza anahtarı |
| JWT_EXPIRE | Token süresi (örn. 7d) |
| JWT_REMEMBER_EXPIRE | “Beni hatırla” token süresi (örn. 30d) |
| CLOUDINARY_* | Cloudinary cloud name, api key, api secret (görsel yükleme için) |
| FRONTEND_URL | Frontend kök URL (CORS için) |

Cloudinary tanımlı değilse ürün görselleri yüklenmez; admin panelde ürün eklerken görsel URL’leri body üzerinden kullanılabilir.

---

## Deployment Önerileri

### MongoDB Atlas

1. https://cloud.mongodb.com üzerinde hesap açın.
2. Yeni cluster oluşturun (örn. M0 free tier).
3. Database Access → Add user (kullanıcı adı/şifre).
4. Network Access → Add IP Address → “Allow access from anywhere” (0.0.0.0/0) veya sadece sunucu IP’nizi ekleyin.
5. Cluster’a tıklayıp “Connect” → “Connect your application” → connection string’i kopyalayın.
6. Connection string’de `<password>` kısmını kullanıcı şifresi ile değiştirin.
7. Bu URI’yi production backend’inizin `MONGODB_URI` ortam değişkeni olarak kullanın.

### Backend (Render / Railway / Fly.io)

- **Render:** New → Web Service → repo’yu bağlayın, root’u `backend` yapın veya `npm install && npm start` komutunu backend klasöründe çalıştırın. Environment variables’a `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` ekleyin.
- **Railway / Fly.io:** Benzer şekilde backend’i deploy edin, `PORT` ve diğer env’leri tanımlayın.

### Frontend (Vercel / Netlify)

- **Vercel:** Repo’yu bağlayın, root’u `frontend` yapın, build: `npm run build`, output: `dist`. Environment variable: `VITE_API_URL` veya production API URL’inizi build zamanında kullanacak şekilde ayarlayın (ör. `https://your-backend.onrender.com`).
- Vite’ta API istekleri `/api` ile yapılıyorsa production’da proxy yoktur; `api.js` baseURL’i `import.meta.env.VITE_API_URL || ''` gibi bir değişkene çekip production’da tam backend URL’i verin.

### Güvenlik

- Production’da `JWT_SECRET` güçlü ve rastgele olsun.
- `FRONTEND_URL` sadece kullandığınız frontend domain’i olsun.
- MongoDB Atlas’ta IP kısıtlamasını mümkünse sadece backend sunucu IP’sine indirin.

---

## Proje Yapısı

```
backend/
  src/
    config/       # db, cloudinary
    controllers/
    middlewares/  # auth, errorHandler, upload
    models/
    routes/
    utils/        # jwt, seedAdmin
  server.js

frontend/
  src/
    components/
    context/      # Auth, Cart, Theme
    hooks/
    layouts/
    pages/
    services/     # api, auth, product, order, admin...
  main.jsx, App.jsx
```

---

## Özellikler

- Kullanıcı: kayıt, giriş, JWT, “beni hatırla”, profil ve şifre güncelleme.
- Ürünler: listeleme, arama, kategori/marka/fiyat/puan filtreleri, sıralama, detay, yorum ve puan.
- Sepet: localStorage, KDV, kupon (kampanya) desteği.
- Sipariş: simülasyon ödeme, sipariş oluşturma, sipariş listesi ve detay.
- Admin: dashboard, ürün CRUD, stok, kullanıcı rolü, sipariş durumu, yorum silme, kampanya CRUD, loglar.
- UI: Tailwind, dark mode, toast, skeleton loading, responsive.

İlk giriş için admin: `admin@kairamarkt.com` / `admin123` (seed sonrası; şifreyi production’da mutlaka değiştirin). Render deploy adımları için `DEPLOY.md` dosyasına bakın.
