# ShopStyle - Premium Fashion Store

ShopStyle adalah website e-commerce fashion modern dan responsif berbasis HTML, CSS, dan JavaScript (tanpa framework). Fokus pada pengalaman belanja premium dengan fitur interaktif dan tampilan elegan.

## Fitur Utama

- 🛍️ **Modern UI/UX Design**
  - Responsive di semua perangkat
  - Clean, elegan, dan animasi halus
  - Komponen navbar & footer modular

- 🛒 **Shopping Features**
  - Grid produk dinamis dari data JS
  - **Filter produk** berdasarkan kategori & subkategori (dropdown interaktif)
  - Badge label produk: New, Best Seller, Sale, Limited
  - Rating bintang pada produk
  - Add to cart & cart sidebar
  - Checkout sederhana

- 🗂️ **Categories Page**
  - Daftar kategori fashion (Women, Men, Accessories, Footwear)
  - **Preview produk unggulan** per kategori (otomatis dari data produk)
  - Tombol "Explore Collection" langsung filter ke halaman produk

- 🎨 **Styling**
  - CSS Grid & Flexbox
  - Card, shadow, gradient, dan efek hover modern
  - Kompatibel mobile & desktop

## Struktur Project

```
├── assets/          # Gambar & aset statis
├── components/      # Komponen UI reusable
│   ├── navbar/     # Navbar
│   └── footer/     # Footer
├── pages/          # Halaman utama & tambahan
│   ├── products.html   # Halaman produk
│   ├── categories.html # Halaman kategori
├── scripts/        # File JavaScript
│   ├── product.js  # Data & logic produk
│   ├── cart.js     # Logic cart
├── styles/         # CSS
│   ├── main.css
│   ├── navbar.css
│   ├── cart.css
│   ├── footer.css
│   ├── products.css
│   └── categories.css
└── index.html      # Landing page
```

## Struktur Data Produk (Contoh)
```js
{
  id: 1,
  name: "Elegant Floral Dress",
  price: 750000,
  image: "url_gambar",
  category: "Women's Fashion",
  subcategory: "Dresses",
  rating: 4.7,
  isNew: true,
  label: ["New", "Best Seller"],
  stock: "Ready",
  colors: ["Red", "Blue", "White"]
}
```

## Cara Menjalankan

1. **Clone repo:**
   ```bash
   git clone [repository-url]
   cd ShopStyle
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Jalankan server (auto-reload):**
   ```bash
   npm run dev
   # atau
   node server.js
   ```
4. **Buka di browser:**
   - `http://localhost:3000/`

## Tips Penggunaan
- **Filter produk:**
  - Bisa langsung filter via dropdown di halaman produk
  - Atau klik kategori di halaman kategori, otomatis filter via query string, contoh:
    - `products.html?category=Men's%20Fashion`
- **Tambah produk:**
  - Edit/extend array `products` di `scripts/product.js`
- **Preview produk kategori:**
  - Otomatis tampil 3 produk unggulan per kategori

## Kontribusi
Pull request & saran sangat diterima!

## Lisensi
MIT License

## Kontak
Buka issue di repo untuk pertanyaan/saran..