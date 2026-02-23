# Cloudinary Cloud Name Nasıl Bulunur?

## 1. Dashboard’a gir

1. Tarayıcıda aç: **https://console.cloudinary.com**
2. Giriş yap (Cloudinary hesabınla).

## 2. Cloud name’i bul

1. Sol menüden **Home** (veya **Dashboard**) tıkla.
2. Sayfanın **üst kısmında** **“Product Environment”** bölümüne bak.
3. Orada **“Cloud name”** yazan bir kutu var; yanında **kopyala** ikonu olabilir.
4. Bu değer genelde **küçük harf + rakam** (örn. `dxyz123`, `abc12xyz`). **Bunu kopyala.**

(Eski arayüzde: **Account Details** altında da yazar.)

## 3. .env dosyasına yaz

1. Projede **backend** klasörünü aç.
2. **.env** dosyasını aç (yoksa .env.example’ı kopyala, .env yap).
3. Şu satırı bul ve **tırnak içine kopyaladığın cloud name’i** yaz:

```env
CLOUDINARY_CLOUD_NAME=buraya_kopyaladigin_cloud_name
```

Örnek (cloud name `dxyz123` ise):

```env
CLOUDINARY_CLOUD_NAME=dxyz123
```

4. **API Key** ve **API Secret** zaten dolu olmalı. Kontrol et:

```env
CLOUDINARY_API_KEY=141517184618531
CLOUDINARY_API_SECRET=3Yx4NJKRShdX-S1gMZNndFBWqT8
```

5. Dosyayı kaydet.

## 4. Backend’i yeniden başlat

Backend’i durdurup tekrar çalıştır (Ctrl+C, sonra `npm run dev`). Artık admin panelden ürün eklerken seçtiğin görseller Cloudinary’ye yüklenecek.

---

**Özet:** Cloud name = Dashboard’da “Product Environment” altındaki değer. **Key Name "Root" değil!**
