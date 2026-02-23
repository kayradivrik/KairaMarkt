# Cloudinary – KairaMarkt

## Cloud name nerede?

- **Key Name "Root"** = Sadece API anahtarının etiketi, **cloud name değil**.
- **Cloud name** = Dashboard’a giriş yaptığında **ana sayfada** (üstte veya Dashboard özetinde) yazan isim. Genelde küçük harf + rakam (örn. `dxyz123` veya `my-shop`).

## .env nasıl doldurulur?

1. [cloudinary.com](https://cloudinary.com) → **Dashboard**.
2. Ana sayfada **“Cloud name”** veya **“Product name”** kutusuna bak → bu değeri kopyala.
3. **Settings** (veya **API Keys**) → **API Key** ve **API Secret** değerlerini kopyala.
4. `backend/.env` içine yaz:

```env
CLOUDINARY_CLOUD_NAME=buraya_dashboarddaki_cloud_name
CLOUDINARY_API_KEY=api_key_degerin
CLOUDINARY_API_SECRET=api_secret_degerin
```

**Önemli:** `CLOUDINARY_CLOUD_NAME` alanına **Key Name (Root) yazma**. Sadece Dashboard’daki **Cloud name** değerini yaz.

Cloud name’i bulamıyorsan: Dashboard URL’ine bak, bazen şöyle olur:  
`https://console.cloudinary.com/console/c-XXXXXXXX` → bazen buradaki kısım da cloud bilgisi olur. Ya da sol menüden **Settings** → **Product environment** / **Cloud name** satırına bak.
