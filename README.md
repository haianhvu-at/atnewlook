# Authentik Vietnam — Mẫu giao diện web mới (v1.6 · repo atnewlook · 13/11/2026)

Mẫu tĩnh HTML / CSS / JS thuần (không framework, không bước build) để MKT xem ý tưởng và coder PHP cắt thành template.
Định hướng: **luxury boutique nhưng có chiều sâu** — riêng tư, thoải mái, rencontres có ý nghĩa; ít chữ; không nói về giá.

```
index.html                                   Trang chủ (8 module)
blog-de-voyage-au-vietnam/index.html         Trang danh sách blog (giữ URL cũ)
visiter-le-vietnam-en-profondeur/index.html  Bài blog mẫu (template bài viết)
petit-groupe/circuit-vietnam-petit-groupe/index.html  Trang chuyển hướng URL cũ → voyage-au-vietnam/?type=groupe
detail-du-circuit/vietnam-en-profondeur-du-grand-nord-au-mekong-2027/index.html   Trang circuit mẫu (fiche voyage, giữ URL cũ)
voyage-au-vietnam/index.html                 Trang tổng hợp circuit (59 voyage, lọc; giữ URL cũ /voyage-au-vietnam)
nous-contacter/index.html                    Trang contact (URL mới — site cũ không có trang contact)
assets/img/<vị-trí>/<tên-ảnh>.webp            Ảnh WebP local theo vị trí (banner, banner-mobile, og, galerie, circuit, team…)
_partials/favicon.html · header.html · footer.html   Favicon + navbar + footer DÙNG CHUNG — chỉ sửa ở đây
favicon.ico                                  Favicon 16/32/48 (file gốc của designer) — giữ ở thư mục gốc
assets/favicon/                              icon.svg · apple-touch-icon.png (180) · icon-192/512.png · site.webmanifest
styleguide.html       Bảng màu, thang chữ Montserrat, nút, lớp phủ cinematic
assets/css/tokens.css Biến thiết kế dùng chung cho FR / EN / ES
assets/css/main.css   Giao diện các module
assets/js/main.js     Tương tác (navbar, dropdown, menu mobile, video, lọc tour, slider avis, form + điền sẵn, nút nổi, trang circuit: tab dính, lịch trình, lightbox, thanh CTA mobile)
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

**Trang circuit (v1.4)** — mẫu: « Vietnam en profondeur : du Grand Nord au Mékong (2027) », nội dung + ảnh lấy từ trang cũ ngày 11/11/2026, không giá.

| Khối | Nội dung |
|------|----------|
| Hero | Ảnh người thật (chợ Hà Giang) `<picture>` banner / banner-mobile · breadcrumb · « Petit groupe · 19 jours · 2027 » · H1 · dòng từ khóa lộ trình · nút devis + « Voir les 17 photos » (lightbox) |
| Tab dính (TD03) | Le voyage · Itinéraire · Hébergements · Inclus · Départs · Bon à savoir · Avis — tô mục đang xem, mobile cuộn ngang; nút devis bên phải (desktop) |
| Le voyage (TD02, TD01) | 1 tiêu đề + 2 dòng + 5 điểm chính · nút film YouTube · fiche clé (Départ garanti, durée, voyage, guide, départs, nuits, repas) + devis / WhatsApp có sẵn tên tour · mosaic 1 + 4 ảnh → lightbox 17 ảnh |
| Itinéraire (TD05, TD06) | Bản đồ (có Hoàng Sa, Trường Sa; desktop dính cột trái, mobile hàng gọn) · 19 ngày dạng `<details>` chia 6 chặng: tiêu đề + 1 dòng + nhãn (repas, nuit, marche/vélo, bateau…); xổ xuống = chữ gốc trang cũ + 1 ảnh + hébergement · « Tout déplier » · link thẳng `#jour-05` |
| Hébergements (TD08) | 13 nơi ở gộp theo chặng: nuits · lieu · tên + loại phòng (« ou similaire ») |
| Inclus (TD07) | 2 cột Inclus / Non inclus, icon ✓ / ✗ dạng nét (SVG) |
| Départs 2027 (PG01) | 11 ngày đi → về, không giá; nút « Demander » mở form devis trang chủ đã điền sẵn tour + tháng + petit groupe + thời lượng (`?circuit=…&depart=…&type=…&duree=…#devis`) |
| Bon à savoir (TD10) | 13 mục accordion, chữ gốc trang cũ |
| Avis | 3 trích dẫn khách thật (mục « Nos clients parlent de nous » của trang cũ) + điểm Tripadvisor / Google / Trustpilot |
| Vous aimerez aussi (TD13) | 3 thẻ circuit chuẩn (dùng chung trang chủ), ảnh vị trí `circuit` |
| Thanh CTA mobile (TD04) | ≤ 1024px: thanh cố định cuối màn hình (devis + WhatsApp), hiện sau hero, ẩn ở CTA cuối trang |

**Trang tổng hợp circuit (v1.5)** — `/voyage-au-vietnam/`, nhịp tham khảo exoticvoyages.com/vietnam-tours (khác trang blog: không phải danh sách bài, mà là trang « điểm đến » có 1 tour nổi bật + lưới thẻ dày). 59 voyage thật lấy ngày 11/11/2026: 53 circuit privé (trang cũ /voyage-au-vietnam, 6 trang) + 6 petit groupe 2027. Không giá.

| Khối | Nội dung |
|------|----------|
| Hero | Ảnh người thật (chợ phiên, phụ nữ H’Mông) · breadcrumb · « Inspirations · 59 voyages » · H1 « Voyages au Vietnam, à votre rythme » · 1 dòng · nút devis + « Voir les voyages » · điểm Tripadvisor / Google / Trustpilot |
| 3 étapes | Vos envies · Votre itinéraire · Votre voyage — 1 dòng mỗi bước |
| Coup de cœur | Vietnam en profondeur : du Grand Nord au Mékong (petit groupe, 19 j — Nhung chọn 11/11; admin: cờ `featured`): ảnh trái, nhãn (Petit groupe · 19 jours · Départ garanti), tên, lộ trình, từ khóa, nút « Découvrir le voyage » + « Départs 2027 » (→ #departs của trang tour) |
| Tous nos voyages (LS01–LS05, LS07) | Tab Tous / Circuits privés / Petits groupes · lọc Destination (Vietnam, Laos, Cambodge, Combinés) · Envie (Première découverte, Vietnam authentique, Peuples du Nord, Randonnée, Mer & plages — theo catégorie của site cũ) · Durée (≤ 7 j, 8–14 j, ≥ 15 j) · đếm « X voyages » · « Effacer les filtres » · URL `?type=&dest=&envie=&duree=` · thẻ circuit chuẩn 4:5, 4 cột (tablette 3, mobile 2 cột gọn) · 12 thẻ đầu + « Afficher plus » (+12) · dải CTA sur mesure luôn sau thẻ thứ 8 · trạng thái 0 kết quả. Mobile: bộ lọc gọn sau nút « Filtrer » (có số lọc đang bật). |
| Avis | 3 trích dẫn khách thật (giống trang chủ) + điểm 3 nền tảng |

Menu « Circuits » (navbar + menu mobile + footer) từ v1.5: Inspirations → `/voyage-au-vietnam/?type=prive` (ảnh thẻ menu = `circuit/nguoi-dao-hai-che.webp`, ảnh gốc IMG_8702 của Nhung), Petite communauté → `/voyage-au-vietnam/?type=groupe` (đến từ menu thì tự cuộn tới danh sách).

URL cũ `/petit-groupe/circuit-vietnam-petit-groupe` → **chuyển sang** `/voyage-au-vietnam/?type=groupe` (quyết định 11/11/2026): bản thử có trang chuyển hướng `petit-groupe/circuit-vietnam-petit-groupe/index.html` (meta refresh + JS, noindex, canonical) · Firebase Hosting: rule 301 trong `firebase.json` · **Production PHP: coder đặt 301 phía máy chủ**, vd Apache `.htaccess`:
```apache
RewriteEngine On
RewriteRule ^petit-groupe/circuit-vietnam-petit-groupe/?$ /voyage-au-vietnam?type=groupe [R=301,L]
```

Link mẫu theo Envie (chia sẻ được): `/voyage-au-vietnam/?envie=decouverte` · `?envie=authentique` · `?envie=ethnies` · `?envie=trek` · `?envie=balneaire` · kết hợp `?type=groupe&envie=ethnies`.

**Trang contact (v1.6)** — `/nous-contacter/` (URL mới, 13/11/2026), theo maquette gửi Nhung 13/11; giờ, giấy phép, ảnh văn phòng do Nhung cung cấp.

| Khối | Nội dung |
|------|----------|
| Hero | Ảnh người thật (người Dao hái chè — ảnh gốc IMG_8702, `banner` / `banner-mobile` / `og` `nguoi-dao-hai-che`) · breadcrumb · H1 « Parlons de *votre voyage* » · « Une équipe francophone, à Hanoï et à Saïgon. Réponse sous 24 h. » · giờ Hà Nội chạy thật (JS, Asia/Ho_Chi_Minh) + chênh lệch với Paris. Mobile: ẩn eyebrow, hero cao hơn để chữ không đè mặt người. |
| Canaux | Devis gratuit (nút xanh → form devis trang chủ) · WhatsApp +84 912 121 091 (đường dây của M. Dinh, ảnh nhỏ) · Téléphone +84 24 39 27 00 99 (8 h – 18 h, giờ VN) · E-mail info@. Desktop 4 cột ngăn bằng đường kẻ; mobile: devis = khối tối, 3 kênh = hàng chạm được. |
| Message + conseillers | Form ngắn trên nền sáng (`.form--light`): Nom*, E-mail*, Téléphone/WhatsApp, Sujet, Message*, consent RGPD, honeypot → khung cảm ơn. **Chưa nối xử lý**: coder điền `CONTACT_ENDPOINT` trong `main.js` + lưu database sau khi triển khai. Cột phải: 6 conseillers ảnh thật (vị trí `team`: Victor, Thao, Michel, Sophie, Thu Ha, Nhi) + « Toute l’équipe ». Mobile: vuốt ngang. |
| Bureaux | Hanoï (siège, 62 Yên Phụ, Ba Đình) · Saïgon (antenne Sud, 57 Lê Thị Hồng Gấm, Bến Thành) · 8 h – 18 h · Itinéraire (Google Maps) · ảnh thật của Nhung (`galerie/hanoi-van-phong-authentik`, `galerie/saigon-an-pho-cung-khach`, khung 11:5) · dòng pháp lý: Licence n° 01-611/2014/TCDL-GPLHQT. |

Schema: ContactPage + TravelAgency (2 địa chỉ, téléphone, WhatsApp) + BreadcrumbList. Footer (mọi trang) từ v1.6: link « Nous contacter » → trang này, thêm địa chỉ Saïgon, điền số giấy phép. Thông báo lỗi form (`.field__err`) nằm ngoài luồng → hiện/ẩn lỗi không làm form nhảy (sửa chung cả form devis).

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
- Form: điền `FORM_ENDPOINT` (devis) và `CONTACT_ENDPOINT` (trang contact) trong `main.js` hoặc đổi sang `action` PHP; thêm CSRF + captcha ẩn (Turnstile / reCAPTCHA v3); lưu kèm trang nguồn, ngôn ngữ, UTM.
- Thẻ tour: lấy từ admin (cờ `featured`), không có trường giá.
- Avis: số liệu nên lấy tự động (widget/API) hoặc cập nhật định kỳ; trích dẫn từ trang `/avis-client`.
- Ảnh: trang chủ / blog còn hotlink để demo; trang circuit đã dùng WebP local theo vị trí (`assets/img/<vị-trí>/`). Khi làm thật: WebP local + `loading="lazy"`; logo dùng bản trắng (logo_authentik_white).
- Trang tổng hợp: thẻ mang `data-type` (prive|groupe) · `data-dest` (vn|la|kh|combine) · `data-envie` (nhiều giá trị, cách nhau dấu cách) · `data-days` → lấy từ admin (catégorie site cũ: Vietnam première découverte = decouverte, Vietnam authentique = authentique, Rencontre des ethnies du Nord = ethnies, Trekking et Randonnée = trek, Séjours balnéaires = balneaire, Combiné multi-pays = combine). URL cũ `/petit-groupe/circuit-vietnam-petit-groupe` → redirect 301 sang `/voyage-au-vietnam?type=groupe` (hoặc giữ trang cũ, chốt với SEO).
- Trang circuit: mỗi ngày = 1 bản ghi admin (tiêu đề, tóm tắt 1 dòng, nội dung, repas, hébergement, ảnh, nhãn hoạt động); hébergements gộp tự động từ các ngày; départs = bảng ngày (không giá); link devis truyền `circuit`, `depart`, `type`, `duree`.
- Hiệu năng: video ≤ 6 Mo, `preload="metadata"`; YouTube chỉ tải khi bấm.

## 5. Điểm cần MKT chốt

- [ ] H1 hero (đề xuất: « Le Vietnam, *en profondeur.* ») — D10
- [ ] Clip hero 15–25 s
- [ ] Hiển thị giá: mẫu này **không** có giá theo định hướng mới → cập nhật D02 trong sheet
- [ ] Font: mẫu dùng **Montserrat duy nhất** → cập nhật D11 (sheet ghi 2 font)
- [ ] Menu gọn (Accueil · Circuits · Blog) thay cho menu kiểu Atalante → cập nhật D03 ; mục Guide/À propos chuyển xuống footer
- [ ] Tên mục « Petite communauté » (hay « Petits groupes ») cho dropdown Circuits
- [x] Số giấy phép (01-611/2014/TCDL-GPLHQT) + địa chỉ văn phòng Saïgon (footer) — Nhung xác nhận 13/11/2026
- [ ] Trang contact: ngày làm việc trong tuần (hiện chỉ ghi 8 h – 18 h) ; ảnh Saïgon bản lớn hơn nếu có (ảnh hiện tại cắt từ collage 810 px)
- [ ] Danh sách 5–6 tour nổi bật + ảnh dọc chất lượng cao
- [ ] Tên tour trên site cũ « Grand boucle du Nord-Ouest » → nên sửa thành « Grande boucle… »
- [ ] Blog: duyệt nội dung bài mẫu « Visiter le Vietnam en profondeur » (tiếng Pháp, các câu về dịch vụ) ; tên + ảnh tác giả thật (E-E-A-T) thay cho « l’équipe Authentik Vietnam »
- [ ] Blog: danh sách chủ đề (Inspiration · Rencontres & culture · Nature & paysages · Cuisine · Conseils pratiques) và gán chủ đề / vùng cho từng bài cũ
- [ ] Blog: bài ghim « À la une » ; ảnh thật cho các vị trí blog-thumb / article / inline (anh_webp.py)
- [ ] Tổng hợp circuit: ảnh thẻ tour privé hiện là ảnh site cũ 740×442 (thẻ chỉ còn ~354×442, hơi mờ trên màn hình nét) → cần ảnh dọc chất lượng cao, có người ; duyệt « Envie » MẪU của 6 petit groupe (Vietnam en profondeur = authentique + ethnies · Grand Tour du Nord = ethnies · Vietnam authentique = authentique + decouverte · Essence = decouverte · Sentiers cachés = ethnies + trek · Meilleur du Nord = decouverte) ; rà tên tour (vd « Le Long du Côte du Tonkin… », « Cambodge : Flores et Faune ») và lộ trình không dấu — TD16 (Content kiểm tra sau)
- [ ] Circuit: xác nhận « Départ garanti » cho 11 ngày 2027 ; trích dẫn avis gắn đúng tour này (hiện lấy avis petit groupe chung) ; ảnh có người cho Ba Bể / Huế / Saigon (đang là phong cảnh) ; Content rà chữ lịch trình (giờ « 8:00 : », tên địa danh có dấu / không dấu) — TD16

## 6. Quy trình lưu & cập nhật

- Trên máy (`D:\web`, ngoài Google Drive): **`atnewlook`** = bản mới nhất, cũng là repo GitHub `atnewlook` và thư mục upload hosting · **`atnewlook-backup`** = bản ngay trước lần sửa gần nhất (nằm ngoài repo, có `BACKUP-INFO.txt`).
- Mỗi lần sửa: chốt nội dung trong chat → Claude chép final sang backup → ghi bản mới vào final → Nhung Commit + Push trong GitHub Desktop (kiểm tra *Current repository* = atnewlook).
- Favicon / navbar / footer: chỉ sửa `_partials/favicon.html`, `_partials/header.html`, `_partials/footer.html` → Claude chạy `D:\web\tools\sync_partials.py` để chép sang mọi trang (khối giữa `<!-- @partial … -->` và `<!-- @/partial … -->` trong mỗi trang được ghi đè tự động). Favicon: nguồn ở `D:\web\anh-goc\favicon` (designer); icon điện thoại = logo trên nền ivory #F7F3EC.
- Mỗi lần sửa CSS/JS: tăng số `?v=` ở mọi trang HTML — `sync_partials.py D:\web\atnewlook --v 1.4` làm việc này cho tất cả trang một lúc.
- **Trước khi đưa lên domain thật:** xoá thẻ `<meta name="robots" content="noindex, nofollow">` ở mọi trang HTML.
