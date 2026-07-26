# Etsy Open API v3 — Tüm Endpointler ve Döndürdükleri Tüm Sonuçlar (Türkçe Referans)

> Kaynak: `https://www.etsy.com/openapi/generated/oas/3.0.0.json` ve `https://developers.etsy.com/documentation/reference`
> Base URL: `https://openapi.etsy.com`

---

## İÇİNDEKİLER

1. Listing Management (Ürün/Liste Yönetimi)
2. Shop Management (Mağaza Yönetimi)
3. Shipping Management (Kargo Yönetimi)
4. Shop Policy Management (İade Politikası)
5. Receipt Management (Sipariş/Makbuz Yönetimi)
6. Payment Management (Ödeme ve Muhasebe)
7. Review Management (Değerlendirmeler)
8. User Management (Kullanıcı Yönetimi)
9. Taxonomy (Kategori Ağaçları)
10. Other (Diğer / Ping)

---

## 1. LISTING MANAGEMENT (Ürün / Liste Yönetimi)

### 1.1 ShopListing (Ana Ürün Kaydı)

| Method | Endpoint | Açıklama |
|---|---|---|
| POST | `/v3/application/shops/{shop_id}/listings` | Yeni taslak (draft) fiziksel ürün oluşturur |
| GET | `/v3/application/shops/{shop_id}/listings` | Mağazadaki ürünleri listeler (state filtreli) |
| GET | `/v3/application/listings/{listing_id}` | Tek bir ürünü ID ile getirir |
| PATCH | `/v3/application/shops/{shop_id}/listings/{listing_id}` | Ürünü günceller |
| DELETE | `/v3/application/listings/{listing_id}` | Ürünü siler |
| GET | `/v3/application/listings/active` | Etsy genelinde tüm aktif ürünleri arar (marketplace search) |
| GET | `/v3/application/shops/{shop_id}/listings/active` | Mağazadaki aktif ürünleri listeler |
| GET | `/v3/application/listings/{listing_id}/listing-summary` | Ürün özetini getirir |
| GET | `/v3/application/listings/{listing_id}/return-policy` | Ürüne bağlı iade politikasını getirir |
| GET | `/v3/application/shops/{shop_id}/listings/{listing_id}` | Mağaza kapsamlı ürün getirir |
| GET | `/v3/application/shops/{shop_id}/receipts/{receipt_id}/listings` | Bir siparişe (receipt) ait ürünleri getirir |
| GET | `/v3/application/listings/batch` | Birden çok listing_id ile toplu ürün getirir |
| PUT | `/v3/application/shops/{shop_id}/listings/{listing_id}/product` | Ürüne özellik/property atar |

**"ShopListing" nesnesinin döndürdüğü tüm alanlar:**

- `listing_id`: Ürünün benzersiz numeric ID'si
- `user_id`: Ürünün sahibi olan Etsy kullanıcı ID'si
- `shop_id`: Ürünün ait olduğu mağaza ID'si
- `title`: Ürün başlığı
- `description`: Ürün açıklaması
- `state`: Durum: active, inactive, draft, expired, sold_out
- `creation_timestamp` / `created_timestamp`: Oluşturulma zamanı (unix)
- `ending_timestamp`: Yayın süresinin bittiği zaman
- `original_creation_timestamp`: İlk yayınlanma zamanı
- `last_modified_timestamp`: Son güncelleme zamanı
- `state_timestamp`: Durumun değiştiği zaman
- `quantity`: Toplam stok adedi
- `shop_section_id`: Mağaza bölümü (kategori sekmesi) ID'si
- `featured_rank`: Öne çıkan sıralama değeri
- `url`: Ürünün Etsy.com üzerindeki linki
- `num_favorers`: Favorilere eklenme sayısı
- `non_taxable`: Vergiden muaf mı
- `is_taxable`: Vergiye tabi mi
- `is_customizable`: Kişiselleştirilebilir/özel sipariş alınabilir mi
- `is_personalizable`: (Deprecated) kişiye özel yazı eklenebilir mi
- `personalization_is_required`: (Deprecated) kişiselleştirme zorunlu mu
- `personalization_char_count_max`: (Deprecated) kişiselleştirme maksimum karakter sayısı
- `personalization_instructions`: (Deprecated) kişiselleştirme talimatı
- `listing_type`: physical / download / both
- `tags`: Etiketler (array)
- `materials`: Kullanılan materyaller (array)
- `shipping_profile_id`: Kargo profili ID'si
- `return_policy_id`: İade politikası ID'si
- `processing_min` / `processing_max`: Min/maks hazırlanma süresi (gün)
- `who_made`: i_did / someone_else / collective
- `when_made`: Üretim dönemi (enum)
- `is_supply`: Malzeme/supply ürünü mü
- `item_weight`, `item_length`, `item_width`, `item_height`: Ürün boyut/ağırlık değerleri
- `item_weight_unit`, `item_dimensions_unit`: Ölçü birimleri
- `taxonomy_id`: Etsy kategori (taxonomy) ID'si
- `production_partner_ids`: Üretim ortağı ID listesi
- `skus`: Satıcının kendi SKU kodları (array)
- `views`: Görüntülenme sayısı
- `price` (Money nesnesi): `amount`, `divisor`, `currency_code`
- `style` / `styles`: Stil etiketleri
- `file_data`: Dijital dosya bilgisi (varsa)
- `has_variations`: Varyasyonu var mı
- `should_auto_renew`: Süre bitince otomatik yenilenir mi
- `language`: Listing dili
- `is_vintage`: Vintage mi
- `has_images`: Görsel var mı
- `is_private`: Gizli mi
- `is_available`: Satın alınabilir mi
- `is_free_shipping_eligible`: Ücretsiz kargo uygunluğu
- `is_digital`: Dijital ürün mü
- `readiness_state_id`: Processing profile / hazırlık durumu ID'si
- `buyer_price`: Alıcı para biriminde fiyat

---

### 1.2 ShopListing File (Dijital Dosyalar)

- `GET /v3/application/shops/{shop_id}/listings/{listing_id}/files/{listing_file_id}`
- `GET /v3/application/shops/{shop_id}/listings/{listing_id}/files`
- `POST /v3/application/shops/{shop_id}/listings/{listing_id}/files`
- `DELETE /v3/application/shops/{shop_id}/listings/{listing_id}/files/{listing_file_id}`

**Dönen alanlar:** `listing_file_id`, `listing_id`, `rank`, `filename`, `filesize`, `size_bytes`, `created_timestamp`, `type`, `product_id`, `file_id`, `alt_text`

---

### 1.3 ShopListing Image (Ürün Görselleri)

- `GET /v3/application/listings/{listing_id}/images/{listing_image_id}`
- `GET /v3/application/listings/{listing_id}/images`
- `POST /v3/application/shops/{shop_id}/listings/{listing_id}/images`
- `DELETE /v3/application/shops/{shop_id}/listings/{listing_id}/images/{listing_image_id}`

**Dönen alanlar:** `listing_id`, `listing_image_id`, `hex_code`, `red`, `green`, `blue`, `hue`, `saturation`, `brightness`, `is_black_and_white`, `creation_tsz`, `rank`, `url_75x75`, `url_170x135`, `url_570xN`, `url_fullxfull`, `full_height`, `full_width`, `alt_text`

---

### 1.4 ShopListing Video

- `GET /v3/application/listings/{listing_id}/videos`
- `GET /v3/application/listings/{listing_id}/videos/{video_id}`
- `PUT /v3/application/shops/{shop_id}/listings/{listing_id}/videos`
- `DELETE /v3/application/shops/{shop_id}/listings/{listing_id}/videos/{video_id}`

**Dönen alanlar:** `video_id`, `height`, `width`, `thumbnail_url`, `video_url`, `video_state`, `listing_ids`

---

### 1.5 ShopListing Inventory (Stok, Varyasyon, Fiyat)

- `GET /v3/application/listings/{listing_id}/inventory`
- `PUT /v3/application/listings/{listing_id}/inventory`

**Dönen alanlar:** `listing_id`, `products` (product_id, sku, is_deleted, offerings, property_values), `price_on_property`, `quantity_on_property`, `sku_on_property`

---

### 1.6 ShopListing Translation

- `GET /v3/application/shops/{shop_id}/listings/{listing_id}/translations/{language}`
- `POST /v3/application/shops/{shop_id}/listings/{listing_id}/translations`
- `PUT /v3/application/shops/{shop_id}/listings/{listing_id}/translations/{language}`

**Dönen alanlar:** `listing_id`, `language`, `title`, `description`, `tags`

---

### 1.7 ShopListing Personalization

- `GET /v3/application/listings/{listing_id}/personalization`
- `PUT /v3/application/shops/{shop_id}/listings/{listing_id}/personalization`

---

## 2. SHOP MANAGEMENT (Mağaza Yönetimi)

- `GET /v3/application/shops/{shop_id}`
- `GET /v3/application/shops?shop_name=`
- `GET /v3/application/users/{user_id}/shops`
- `PUT /v3/application/shops/{shop_id}`

**Dönen alanlar:** `shop_id`, `user_id`, `shop_name`, `create_date`, `title`, `announcement`, `currency_code`, `is_vacation`, `vacation_message`, `sale_message`, `digital_sale_message`, `update_date`, `listing_active_count`, `digital_listing_count`, `login_name`, `accepts_custom_requests`, `policy_welcome`, `policy_payment`, `policy_shipping`, `policy_refunds`, `policy_additional`, `policy_seller_info`, `policy_privacy`, `vacation_autoreply`, `url`, `image_url_760x100`, `num_favorers`, `languages`, `icon_url_fullxfull`, `transaction_sold_count`, `shipping_from_country_iso`, `shop_location_country_iso`, `review_count`, `review_average`

---

## 3. SHIPPING MANAGEMENT (Kargo Yönetimi)

- `GET /v3/application/shops/{shop_id}/shipping-profiles`
- `GET /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}`

**Dönen alanlar:** `shipping_profile_id`, `title`, `user_id`, `min_processing_days`, `max_processing_days`, `processing_days_display_label`, `origin_country_iso`, `origin_postal_code`, `profile_type`, `domestic_handling_fee`, `international_handling_fee`, `shipping_profile_destinations`, `shipping_profile_upgrades`

---

## 4. SHOP POLICY MANAGEMENT

- `GET /v3/application/shops/{shop_id}/policies/return`
- `GET /v3/application/shops/{shop_id}/policies/return/{return_policy_id}`

---

## 5. RECEIPT MANAGEMENT (Sipariş / Makbuz Yönetimi)

- `GET /v3/application/shops/{shop_id}/receipts`
- `GET /v3/application/shops/{shop_id}/receipts/{receipt_id}`
- `GET /v3/application/shops/{shop_id}/receipts/{receipt_id}/transactions`
- `GET /v3/application/shops/{shop_id}/transactions`

**Dönen alanlar:**
- `receipts`: `receipt_id`, `receipt_type`, `seller_user_id`, `buyer_user_id`, `name`, `first_line`, `second_line`, `city`, `state`, `zip`, `country_iso`, `status`, `formatted_address`, `create_timestamp`, `is_paid`, `is_shipped`, `is_gift`, `gift_message`, `grandtotal`, `subtotal`, `total_price`, `total_shipping_cost`, `total_tax_cost`, `total_vat_cost`, `discount_amt`, `gift_wrap_price`, `shipments`, `transactions`, `refunds`, `message_from_buyer`, `message_from_seller`
- `transactions`: `transaction_id`, `title`, `description`, `seller_user_id`, `buyer_user_id`, `create_timestamp`, `paid_timestamp`, `shipped_timestamp`, `quantity`, `listing_image_id`, `receipt_id`, `is_digital`, `listing_id`, `sku`, `product_id`, `price`, `shipping_cost`, `variations`

---

## 6. PAYMENT MANAGEMENT (Ödeme ve Muhasebe)

- `GET /v3/application/shops/{shop_id}/payment-account/ledger-entries`
- `GET /v3/application/shops/{shop_id}/payment-account/ledger-entries/payments`

**Dönen alanlar:**
- `LedgerEntry`: `entry_id`, `ledger_id`, `sequence_number`, `amount`, `currency`, `description`, `balance`, `create_date`, `ledger_type`, `reference_type`, `reference_id`
- `Payment`: `payment_id`, `buyer_user_id`, `shop_id`, `receipt_id`, `amount_gross`, `amount_fees`, `amount_net`, `posted_gross`, `posted_fees`, `adjusted_gross`, `adjusted_fees`, `currency`, `status`

---

## 7. REVIEW MANAGEMENT (Değerlendirmeler)

- `GET /v3/application/shops/{shop_id}/reviews`
- `GET /v3/application/listings/{listing_id}/reviews`

**Dönen alanlar:** `shop_id`, `listing_id`, `transaction_id`, `buyer_user_id`, `rating`, `review`, `language`, `image_url_fullxfull`, `create_timestamp`

---

## 8. USER MANAGEMENT (Kullanıcı Yönetimi)

- `GET /v3/application/users/{user_id}`
- `GET /v3/application/users/me`
- `GET /v3/application/user/addresses`

---

## 9. TAXONOMY (Kategori Ağaçları)

- `GET /v3/application/seller-taxonomy/nodes`
- `GET /v3/application/seller-taxonomy/nodes/{taxonomy_id}/properties`
- `GET /v3/application/buyer-taxonomy/nodes`
- `GET /v3/application/buyer-taxonomy/nodes/{taxonomy_id}/properties`

---

## 10. OTHER

- `GET /v3/application/openapi-ping`
