# Authentik Vietnam — Mẫu giao diện web mới (v1.3 · repo atnewlook · 10/11/2026)

Mẫu tĩnh HTML / CSS / JS thuần (không framework, không bước build) để MKT xem ý tưởng và coder PHP cắt thành template.
Định hướng: **luxury boutique nhưng có chiều sâu** — riêng tư, thoải mái, rencontres có ý nghĩa; ít chữ; không nói về giá.

```
index.html                                   Trang chủ (8 module)
blog-de-voyage-au-vietnam/index.html         Trang danh sách blog (giữ URL cũ)
visiter-le-vietnam-en-profondeur/index.html  Bài blog mẫu (template bài viết)
_partials/favicon.html · header.html · footer.html   Favicon + navbar + footer DÙNG CHUNG — chỉ sửa ở đây
favicon.ico                                  Favicon 16/32/48 (file gốc của designer) — giữ ở thư mục gốc
assets/favicon/                              icon.svg · apple-touch-icon.png (180) · icon-192/512.png · site.webmanifest
styleguide.html       Bảng màu, thang chữ Montserrat, nút, lớp phủ cinematic
assets/css/tokens.css Biến thiết kế dùng chung cho FR / EN / ES
assets/css/main.css   Giao diện các module
assets/js/main.js     Tương tác (navbar, dropdown, menu mobile, video, lọc tour, slider avis, form, nút nổi)
assets/video/         Đặt hero.mp4 (+ hero.webm) — xem LISEZ-MOI.txt
firebase.json         Cấu hình Firebase Hosting
.gitignore            Bỏ qua desktop.ini (Google Drive) khi đẩy lên GitHub
.nojekyll             Cho GitHub Pages
```

## 1. Xem thử

**Cách nhanh nhất:** giải nén → mở `index.html` bằng Chrome (ảnh tải trực tiếp từ authentikvietnam.com).

**GitHub Pages (link xem chung cho team + test trên điện thoại)**
Repo GitHub **`atnewlook`** (github.com/haianhvu-at/atnewlook, công khai) = chính thư mục **`D:\web\atnewlook`** trên máy Nhung.
⚠️ Không đặt repo trong Google Drive: Drive tự tạo `desktop.ini` trong thư mục `.git` → Git báo lỗi `bad ref refs/tags/desktop.ini`.
Bật Pages: Settings → Pages → *Deploy from a branch* → `main` / `(root)` → Save. Link: **https://haianhvu-at.github.io/atnewlook/**
Mỗi lần cập nhật: GitHub Desktop → gõ *Summary* (vd `v1.3 – đổi hero`) → **Commit to main** → **Push origin** → chờ 1–2 phút.

**Firebase Hosting — không đụng site đang chạy (authentik-vietnam.web.app)**
```bash
npm i -g firebase-tools
firebase login
cd authentik-home
firebase use --add            # chọn project authentik-vietnam
firebase hosting:channel:deploy home-v1 --expires 30d
```
Lệnh `hosting:channel:deploy` tạo một **link xem trước riêng** (`authentik-vietnam--home-v1-xxxx.web.app`), hết hạn sau 30 ngày, không ghi đè trang live.
(Chỉ dùng `firebase deploy` nếu muốn thay hẳn nội dung site.)

## 2. Các module trên trang chủ

| # | Module | Ghi chú |
|---|--------|---------|
| 1 | Navbar | Trái: Accueil · Circuits (Inspirations / Petite communauté) · Blog — Giữa: logo trắng — Phải: FR/EN/ES · téléphone · nút devis. Trong suốt trên video, cuộn → nền tối mờ + thu gọn, cuộn xuống ẩn / cuộn lên hiện. Mobile: burger → menu toàn màn hình. |
| 2 | Hero | Clip toàn màn hình (`assets/video/hero.mp4`). Chưa có clip → ảnh poster + zoom chậm. Nút « Regarder le film » mở YouTube (nocookie) trong popup. Dải điểm Tripadvisor/Google/Trustpilot. |
| 3 | Giới thiệu | 1 tiêu đề + 1 đoạn + 2 ảnh chồng + 3 trụ cột (Privé · Dans le confort · Porteur de sens). |
| 4 | Media « Instants » | Mosaic 6 ảnh, lớp phủ cinematic tối, 1 ô phim → YouTube. Mobile: vuốt ngang. |
| 5 | Circuits | Thẻ dọc 4:5, không giá: loại (Circuit privé / Petit groupe), số ngày, vùng, tên. Lọc Tous / Circuits privés / Petits groupes. Thẻ cuối = CTA sur mesure. |
| 6 | Avis | Nền xanh rừng tối, quầng sáng xanh. 3 điểm số (relevé 14/10/2026) + slider trích dẫn khách thật lấy từ authentikvietnam.com. |
| 7 | Form devis | Ngắn, không hỏi ngân sách: tên, email, tel/WhatsApp, kiểu khách, tháng, thời lượng, façon de voyager, message, consent RGPD, honeypot. Gửi xong → khung cảm ơn. |
| 8 | Footer | Logo + tagline, newsletter, 4 cột (Aide / Nos voyages / Authentik / Coordonnées), legal, social, năm tự động. |
| + | Nút nổi | WhatsApp (luôn hiện) + back-to-top (hiện sau 1 màn hình, có vòng tiến độ đọc). |

**Blog (v1.3)**

| Trang | Nội dung |
|-------|----------|
| Danh sách `/blog-de-voyage-au-vietnam/` | Hero gọn (breadcrumb + H1 + 1 dòng) · bài nổi bật « À la une » · lọc Thème + Destination (không tải lại trang, URL `?theme=…&dest=…` chia sẻ được) · thẻ bài 3:2 (chủ đề · vùng · tiêu đề) · trạng thái « không có bài ». Mobile: thẻ dạng hàng gọn ảnh trái + chữ phải, chip lọc vuốt ngang. |
| Bài viết `/visiter-le-vietnam-en-profondeur/` | Breadcrumb · chủ đề · H1 · chapeau · tác giả + ngày cập nhật + thời gian đọc · ảnh lớn 16:9 · mục lục (desktop dính cột phải, tô mục đang đọc; mobile thu gọn đầu bài) · CTA tour giữa bài · trích dẫn khách thật · CTA devis + WhatsApp cuối bài · 3 bài liên quan. Schema BlogPosting + BreadcrumbList. |

## 3. Design system (chi tiết trong `styleguide.html`)

- **Màu:** ưu tiên xanh logo `#0EA048` → nền xanh rừng tối `#0B1712 … #1D4430`; **nút chính xanh đậm `#0D6B3C`** (hover `#118A4C`, trên nền tối có viền xanh sáng). Không dùng nâu/đỏ cho nút (tránh giống đối thủ); nâu logo chỉ còn là lớp phủ ấm cho ảnh. Trung tính ấm ivory `#F7F3EC` / paper `#EFE8DC`. Chữ nhấn trên nền tối: sand `#D8B48E`.
- **Font:** chỉ Montserrat. H1 200 · H2 300 + từ nhấn nghiêng · H3 400 · nhãn/eyebrow/nút 600 chữ HOA giãn chữ · body 400 16px · lead 300.
- **Ảnh:** class `.cine` = giảm bão hoà + phủ nâu (multiply) + gradient tối + vignette.
- Góc 2px, khoảng cách bội số 8, tôn trọng `prefers-reduced-motion`.

## 4. Ghi chú cho coder (port sang PHP)

- Mỗi `<section>` trong `index.html` = 1 partial PHP (đã đánh số bằng comment). `tokens.css` dùng chung 3 site; chỉ thay text theo ngôn ngữ.
- Navbar + footer: `_partials/header.html` và `_partials/footer.html` → `include` PHP. Trong mẫu tĩnh, `{{root}}` = đường dẫn về gốc, `{{home}}` = link trang chủ; link nội bộ ghi rõ `index.html` để mở được cả khi xem file trên máy. URL thật: `/blog-de-voyage-au-vietnam`, `/<slug-bài>` (giữ như site cũ). Mục menu đang mở có `aria-current="page"` (theo `body data-page`).
- Blog: chủ đề / vùng của mỗi bài là thuộc tính `data-theme` / `data-dest` trên thẻ → lấy từ admin. Thời gian đọc = số chữ ÷ 200. Thẻ bài cần thêm « ngày cập nhật » thật từ admin (BL01) — site cũ đang hiện ngày tự sinh nên mẫu chưa hiện.
- Cắt ảnh: `.img-cover` nhận biến `--focus` (vd `style="--focus: 50% 22%"`) = điểm giữ khi ảnh bị cắt khung → admin nên có trường « điểm lấy nét ».
- Form: điền `FORM_ENDPOINT` trong `main.js` hoặc đổi sang `action` PHP; thêm CSRF + captcha ẩn (Turnstile / reCAPTCHA v3); lưu kèm trang nguồn, ngôn ngữ, UTM.
- Thẻ tour: lấy từ admin (cờ `featured`), không có trường giá.
- Avis: số liệu nên lấy tự động (widget/API) hoặc cập nhật định kỳ; trích dẫn từ trang `/avis-client`.
- Ảnh: đang hotlink để demo → khi làm thật dùng WebP local + `srcset` + `loading="lazy"`; logo dùng bản trắng (logo_authentik_white).
- Hiệu năng: video ≤ 6 Mo, `preload="metadata"`; YouTube chỉ tải khi bấm.

## 5. Điểm cần MKT chốt

- [ ] H1 hero (đề xuất: « Le Vietnam, *en profondeur.* ») — D10
- [ ] Clip hero 15–25 s
- [ ] Hiển thị giá: mẫu này **không** có giá theo định hướng mới → cập nhật D02 trong sheet
- [ ] Font: mẫu dùng **Montserrat duy nhất** → cập nhật D11 (sheet ghi 2 font)
- [ ] Menu gọn (Accueil · Circuits · Blog) thay cho menu kiểu Atalante → cập nhật D03 ; mục Guide/À propos chuyển xuống footer
- [ ] Tên mục « Petite communauté » (hay « Petits groupes ») cho dropdown Circuits
- [ ] Số giấy phép lữ hành quốc tế, địa chỉ văn phòng Saïgon (footer)
- [ ] Danh sách 5–6 tour nổi bật + ảnh dọc chất lượng cao
- [ ] Tên tour trên site cũ « Grand boucle du Nord-Ouest » → nên sửa thành « Grande boucle… »
- [ ] Blog: duyệt nội dung bài mẫu « Visiter le Vietnam en profondeur » (tiếng Pháp, các câu về dịch vụ) ; tên + ảnh tác giả thật (E-E-A-T) thay cho « l’équipe Authentik Vietnam »
- [ ] Blog: danh sách chủ đề (Inspiration · Rencontres & culture · Nature & paysages · Cuisine · Conseils pratiques) và gán chủ đề / vùng cho từng bài cũ
- [ ] Blog: bài ghim « À la une » ; ảnh thật cho các vị trí blog-thumb / article / inline (anh_webp.py)

## 6. Quy trình lưu & cập nhật

- Trên máy (`D:\web`, ngoài Google Drive): **`atnewlook`** = bản mới nhất, cũng là repo GitHub `atnewlook` và thư mục upload hosting · **`atnewlook-backup`** = bản ngay trước lần sửa gần nhất (nằm ngoài repo, có `BACKUP-INFO.txt`).
- Mỗi lần sửa: chốt nội dung trong chat → Claude chép final sang backup → ghi bản mới vào final → Nhung Commit + Push trong GitHub Desktop (kiểm tra *Current repository* = atnewlook).
- Favicon / navbar / footer: chỉ sửa `_partials/favicon.html`, `_partials/header.html`, `_partials/footer.html` → Claude chạy `D:\web\tools\sync_partials.py` để chép sang mọi trang (khối giữa `<!-- @partial … -->` và `<!-- @/partial … -->` trong mỗi trang được ghi đè tự động). Favicon: nguồn ở `D:\web\anh-goc\favicon` (designer); icon điện thoại = logo trên nền ivory #F7F3EC.
- Mỗi lần sửa CSS/JS: tăng số `?v=` ở mọi trang HTML — `sync_partials.py D:\web\atnewlook --v 1.4` làm việc này cho tất cả trang một lúc.
- **Trước khi đưa lên domain thật:** xoá thẻ `<meta name="robots" content="noindex, nofollow">` ở mọi trang HTML.
