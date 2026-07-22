# Etsy OpenAPI v3 Reference

This document contains all endpoints and their detailed response structures directly from the official Etsy v3 OpenAPI specification.

## `GET /v3/application/buyer-taxonomy/nodes`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the full hierarchy tree of buyer taxonomy nodes.

### Response Structure
Object {
  - **count** (integer): The number of results.
  - **results** (array): The list of requested resources.
}

---

## `GET /v3/application/buyer-taxonomy/nodes/{taxonomy_id}/properties`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a list of product properties, with applicable scales and values, supported for a specific buyer taxonomy ID.

### Parameters
- `taxonomy_id` (path): The unique numeric ID of an Etsy taxonomy node, which is a metadata category for listings organized into the seller taxonomy hierarchy tree. For example, the "shoes" taxonomy node (ID: 1429, level: 1) is higher in the hierarchy than "girls' shoes" (ID: 1440, level: 2). The taxonomy nodes assigned to a listing support access to specific standardized product scales and properties. For example, listings assigned the taxonomy nodes "shoes" or "girls' shoes" support access to the "EU" shoe size scale with its associated property names and IDs for EU shoe sizes, such as property `value_id`:"1394", and `name`:"38".

### Response Structure
Object {
  - **count** (integer): The number of results.
  - **results** (array): The list of requested resources.
}

---

## `POST /v3/application/shops/{shop_id}/listings`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Creates a physical draft [listing](/documentation/reference#tag/ShopListing) product in a shop on the Etsy channel.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **listing_id** (integer): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
  - **user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) posting the listing.
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **title** (string): The listing's title string. When creating or updating a listing, valid title strings contain only letters, numbers, punctuation marks, mathematical symbols, whitespace characters, ™, ©, and ®. (regex: /[^\p{L}\p{Nd}\p{P}\p{Sm}\p{Zs}™©®]/u) You can only use the %, :, & and + characters once each.
  - **description** (string): A description string of the product for sale in the listing.
  - **rich_description** (string): The seller-authored HTML rich-text description of the product when the listing uses rich text; null for plain-text listings. The plain-text `description` field is always populated. This value is HTML and consumers MUST sanitize it before rendering it in any HTML context.
  - **state** (string): When _updating_ a listing, this value can be either `active` or `inactive`. Note: Setting a `draft` listing to `active` will also publish the listing on etsy.com and requires that the listing have an image set. Setting a `sold_out` listing to active will update the quantity to 1 and renew the listing on etsy.com.
  - **creation_timestamp** (integer): The listing's creation time, in epoch seconds.
  - **created_timestamp** (integer): The listing's creation time, in epoch seconds.
  - **ending_timestamp** (integer): The listing's expiration time, in epoch seconds.
  - **original_creation_timestamp** (integer): The listing's creation time, in epoch seconds.
  - **last_modified_timestamp** (integer): The time of the last update to the listing, in epoch seconds.
  - **updated_timestamp** (integer): The time of the last update to the listing, in epoch seconds.
  - **state_timestamp** (integer): The date and time of the last state change of this listing.
  - **quantity** (integer): The positive non-zero number of products available for purchase in the listing. Note: The listing quantity is the sum of available offering quantities. You can request the quantities for individual offerings from the ListingInventory resource using the [getListingInventory](/documentation/reference#operation/getListingInventory) endpoint.
  - **shop_section_id** (integer): The numeric ID of a section in a specific Etsy shop.
  - **featured_rank** (integer): The positive non-zero numeric position in the featured listings of the shop, with rank 1 listings appearing in the left-most position in featured listing on a shop's home page.
  - **url** (string): The full URL to the listing's page on Etsy.
  - **num_favorers** (integer): The number of users who marked this Listing a favorite.
  - **non_taxable** (boolean): When true, applicable [shop](/documentation/reference#tag/Shop) tax rates do not apply to this listing at checkout.
  - **is_taxable** (boolean): When true, applicable [shop](/documentation/reference#tag/Shop) tax rates apply to this listing at checkout.
  - **is_customizable** (boolean): When true, a buyer may contact the seller for a customized order. The default value is true when a shop accepts custom orders. Does not apply to shops that do not accept custom orders.
  - **is_personalizable** (boolean): When true, this listing is personalizable. The default value is false.
  - **listing_type** (string): An enumerated type string that indicates whether the listing is physical or a digital download.
  - **tags** (array): A comma-separated list of tag strings for the listing. When creating or updating a listing, valid tag strings contain only letters, numbers, whitespace characters, -, ', ™, ©, and ®. (regex: /[^\p{L}\p{Nd}\p{Zs}\-'™©®]/u) Default value is null.
  - **materials** (array): A list of material strings for materials used in the product. Valid materials strings contain only letters, numbers, and whitespace characters. (regex: /[^\p{L}\p{Nd}\p{Zs}]/u) Default value is null.
  - **shipping_profile_id** (integer): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.
  - **return_policy_id** (integer): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).
  - **processing_min** (integer): The minimum number of days required to process this listing. Default value is null.
  - **processing_max** (integer): The maximum number of days required to process this listing. Default value is null.
  - **who_made** (string): An enumerated string indicating who made the product. Helps buyers locate the listing under the Handmade heading. Requires 'is_supply' and 'when_made'.
  - **when_made** (string): An enumerated string for the era in which the maker made the product in this listing. Helps buyers locate the listing under the Vintage heading. Requires 'is_supply' and 'who_made'.
  - **is_supply** (boolean): When true, tags the listing as a supply product, else indicates that it's a finished product. Helps buyers locate the listing under the Supplies heading. Requires 'who_made' and 'when_made'.
  - **item_weight** (number): The numeric weight of the product measured in units set in 'item_weight_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_weight_unit** (string): A string defining the units used to measure the weight of the product. Default value is null.
  - **item_length** (number): The numeric length of the product measured in units set in 'item_dimensions_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_width** (number): The numeric width of the product measured in units set in 'item_dimensions_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_height** (number): The numeric length of the product measured in units set in 'item_dimensions_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_dimensions_unit** (string): A string defining the units used to measure the dimensions of the product. Default value is null.
  - **is_private** (boolean): When true, this is a private listing intended for a specific buyer and hidden from shop view.
  - **style** (array): An array of style strings for this listing, each of which is free-form text string such as "Formal", or "Steampunk". When creating or updating a listing, the listing may have up to two styles. Valid style strings contain only letters, numbers, and whitespace characters. (regex: /[^\p{L}\p{Nd}\p{Zs}]/u) Each style string is limited to 45 characters. Default value is null.
  - **file_data** (string): A string describing the files attached to a digital listing.
  - **has_variations** (boolean): When true, the listing has variations.
  - **should_auto_renew** (boolean): When true, renews a listing for four months upon expiration.
  - **language** (string): The IETF language tag for the default language of the listing. Ex: `de`, `en`, `es`, `fr`, `it`, `ja`, `nl`, `pl`, `pt`, `ru`.
  - **price** (any): The positive non-zero price of the product. (Sold product listings are private) Note: The price is the minimum possible price. The [`getListingInventory`](/documentation/reference/#operation/getListingInventory) method requests exact prices for available offerings.
  - **converted_price** (any): The listing price converted to the currency requested via the currency parameter. Only present when the currency parameter is provided. Null if the conversion rate is unavailable.
  - **taxonomy_id** (integer): The numerical taxonomy ID of the listing. See [SellerTaxonomy](/documentation/reference#tag/SellerTaxonomy) and [BuyerTaxonomy](/documentation/reference#tag/BuyerTaxonomy) for more information.
  - **readiness_state_id** (integer): The numeric ID of the [processing profile](/documentation/reference#operation/getShopReadinessStateDefinition) associated with the listing. Returned only when the listing is `active` and of type `physical`, and the endpoint is either shop-scoped (path contains `shop_id`) or a single-listing request such as `getListing`. For every other case this field can be null.
  - **suggested_title** (string): A title string suggested by Etsy. Only available for a user's own listings, when allow_suggested_title param is present, and when a shop's language setting is English. Not all listings will have suggestions.
}

---

## `GET /v3/application/shops/{shop_id}/listings`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Endpoint to list Listings that belong to a Shop. Listings can be filtered using the 'state' param.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `state` (query): When _updating_ a listing, this value can be either `active` or `inactive`. Note: Setting a `draft` listing to `active` will also publish the listing on etsy.com and requires that the listing have an image set. Setting a `sold_out` listing to active will update the quantity to 1 and renew the listing on etsy.com.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.
- `sort_on` (query): The value to sort a search result of listings on. NOTES: a) `sort_on` only works when combined with one of the search options (keywords, region, etc.). b) when using `score` the returned results will always be in _descending_ order, regardless of the `sort_order` parameter.
- `sort_order` (query): The ascending(up) or descending(down) order to sort listings by. NOTE: sort_order only works when combined with one of the search options (keywords, region, etc.).
- `includes` (query): An enumerated string that attaches a valid association. Acceptable inputs are 'Shipping', 'Shop', 'Images', 'User', 'Translations', 'Videos', 'Inventory' and 'Personalization'.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **count** (integer): The number of ShopListing resources found.
  - **results** (array): The ShopListing resources found.
}

---

## `DELETE /v3/application/listings/{listing_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Open API V3 endpoint to delete a ShopListing. A ShopListing can be deleted only if the state is one of the following:  SOLD_OUT, DRAFT, EXPIRED, INACTIVE, ACTIVE and is_available or ACTIVE and has seller flags:  SUPRESSED (frozen), VACATION, CUSTOM_SHOPS (pattern), SELL_ON_FACEBOOK

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

## `GET /v3/application/listings/{listing_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a listing record by listing ID.

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `includes` (query): An enumerated string that attaches a valid association. Acceptable inputs are 'Shop', 'Images', 'User', 'Translations', 'Videos', 'Personalization' and 'BuyerPrice'.
- `language` (query): The IETF language tag for the language of this translation. Ex: `de`, `en`, `es`, `fr`, `it`, `ja`, `nl`, `pl`, `pt`.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.
- `allow_suggested_title` (query): This parameter will include in the response a suggested title for the listing, if one is available. Since suggestions are only available to the listing's owner, client must submit an oauth_access_token scoped to the owner of the listing.

### Response Structure
Object {
  - **listing_id** (integer): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
  - **user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) posting the listing.
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **title** (string): The listing's title string. When creating or updating a listing, valid title strings contain only letters, numbers, punctuation marks, mathematical symbols, whitespace characters, ™, ©, and ®. (regex: /[^\p{L}\p{Nd}\p{P}\p{Sm}\p{Zs}™©®]/u) You can only use the %, :, & and + characters once each.
  - **description** (string): A description string of the product for sale in the listing.
  - **rich_description** (string): The seller-authored HTML rich-text description of the product when the listing uses rich text; null for plain-text listings. The plain-text `description` field is always populated. This value is HTML and consumers MUST sanitize it before rendering it in any HTML context.
  - **state** (string): When _updating_ a listing, this value can be either `active` or `inactive`. Note: Setting a `draft` listing to `active` will also publish the listing on etsy.com and requires that the listing have an image set. Setting a `sold_out` listing to active will update the quantity to 1 and renew the listing on etsy.com.
  - **creation_timestamp** (integer): The listing's creation time, in epoch seconds.
  - **created_timestamp** (integer): The listing's creation time, in epoch seconds.
  - **ending_timestamp** (integer): The listing's expiration time, in epoch seconds.
  - **original_creation_timestamp** (integer): The listing's creation time, in epoch seconds.
  - **last_modified_timestamp** (integer): The time of the last update to the listing, in epoch seconds.
  - **updated_timestamp** (integer): The time of the last update to the listing, in epoch seconds.
  - **state_timestamp** (integer): The date and time of the last state change of this listing.
  - **quantity** (integer): The positive non-zero number of products available for purchase in the listing. Note: The listing quantity is the sum of available offering quantities. You can request the quantities for individual offerings from the ListingInventory resource using the [getListingInventory](/documentation/reference#operation/getListingInventory) endpoint.
  - **shop_section_id** (integer): The numeric ID of a section in a specific Etsy shop.
  - **featured_rank** (integer): The positive non-zero numeric position in the featured listings of the shop, with rank 1 listings appearing in the left-most position in featured listing on a shop's home page.
  - **url** (string): The full URL to the listing's page on Etsy.
  - **num_favorers** (integer): The number of users who marked this Listing a favorite.
  - **non_taxable** (boolean): When true, applicable [shop](/documentation/reference#tag/Shop) tax rates do not apply to this listing at checkout.
  - **is_taxable** (boolean): When true, applicable [shop](/documentation/reference#tag/Shop) tax rates apply to this listing at checkout.
  - **is_customizable** (boolean): When true, a buyer may contact the seller for a customized order. The default value is true when a shop accepts custom orders. Does not apply to shops that do not accept custom orders.
  - **is_personalizable** (boolean): When true, this listing is personalizable. The default value is false.
  - **listing_type** (string): An enumerated type string that indicates whether the listing is physical or a digital download.
  - **tags** (array): A comma-separated list of tag strings for the listing. When creating or updating a listing, valid tag strings contain only letters, numbers, whitespace characters, -, ', ™, ©, and ®. (regex: /[^\p{L}\p{Nd}\p{Zs}\-'™©®]/u) Default value is null.
  - **materials** (array): A list of material strings for materials used in the product. Valid materials strings contain only letters, numbers, and whitespace characters. (regex: /[^\p{L}\p{Nd}\p{Zs}]/u) Default value is null.
  - **shipping_profile_id** (integer): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.
  - **return_policy_id** (integer): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).
  - **processing_min** (integer): The minimum number of days required to process this listing. Default value is null.
  - **processing_max** (integer): The maximum number of days required to process this listing. Default value is null.
  - **who_made** (string): An enumerated string indicating who made the product. Helps buyers locate the listing under the Handmade heading. Requires 'is_supply' and 'when_made'.
  - **when_made** (string): An enumerated string for the era in which the maker made the product in this listing. Helps buyers locate the listing under the Vintage heading. Requires 'is_supply' and 'who_made'.
  - **is_supply** (boolean): When true, tags the listing as a supply product, else indicates that it's a finished product. Helps buyers locate the listing under the Supplies heading. Requires 'who_made' and 'when_made'.
  - **item_weight** (number): The numeric weight of the product measured in units set in 'item_weight_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_weight_unit** (string): A string defining the units used to measure the weight of the product. Default value is null.
  - **item_length** (number): The numeric length of the product measured in units set in 'item_dimensions_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_width** (number): The numeric width of the product measured in units set in 'item_dimensions_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_height** (number): The numeric length of the product measured in units set in 'item_dimensions_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_dimensions_unit** (string): A string defining the units used to measure the dimensions of the product. Default value is null.
  - **is_private** (boolean): When true, this is a private listing intended for a specific buyer and hidden from shop view.
  - **style** (array): An array of style strings for this listing, each of which is free-form text string such as "Formal", or "Steampunk". When creating or updating a listing, the listing may have up to two styles. Valid style strings contain only letters, numbers, and whitespace characters. (regex: /[^\p{L}\p{Nd}\p{Zs}]/u) Each style string is limited to 45 characters. Default value is null.
  - **file_data** (string): A string describing the files attached to a digital listing.
  - **has_variations** (boolean): When true, the listing has variations.
  - **should_auto_renew** (boolean): When true, renews a listing for four months upon expiration.
  - **language** (string): The IETF language tag for the default language of the listing. Ex: `de`, `en`, `es`, `fr`, `it`, `ja`, `nl`, `pl`, `pt`, `ru`.
  - **price** (any): The positive non-zero price of the product. (Sold product listings are private) Note: The price is the minimum possible price. The [`getListingInventory`](/documentation/reference/#operation/getListingInventory) method requests exact prices for available offerings.
  - **converted_price** (any): The listing price converted to the currency requested via the currency parameter. Only present when the currency parameter is provided. Null if the conversion rate is unavailable.
  - **taxonomy_id** (integer): The numerical taxonomy ID of the listing. See [SellerTaxonomy](/documentation/reference#tag/SellerTaxonomy) and [BuyerTaxonomy](/documentation/reference#tag/BuyerTaxonomy) for more information.
  - **readiness_state_id** (integer): The numeric ID of the [processing profile](/documentation/reference#operation/getShopReadinessStateDefinition) associated with the listing. Returned only when the listing is `active` and of type `physical`, and the endpoint is either shop-scoped (path contains `shop_id`) or a single-listing request such as `getListing`. For every other case this field can be null.
  - **suggested_title** (string): A title string suggested by Etsy. Only available for a user's own listings, when allow_suggested_title param is present, and when a shop's language setting is English. Not all listings will have suggestions.
  - **shipping_profile** (any): An array of data representing the shipping profile resource.
  - **user** (any): Represents a single user of the site
  - **shop** (any): A shop created by an Etsy user.
  - **images** (array): Represents a list of listing image resources, each of which contains the reference URLs and metadata for an image
  - **videos** (array): The single video associated with a listing.
  - **inventory** (any): An enumerated string that attaches a valid association. Default value is null.
  - **production_partners** (array): Represents a list of production partners for a shop.
  - **skus** (array): A list of SKU strings for the listing. SKUs will only appear if the requesting user owns the shop and a valid matching OAuth 2 token is provided. When requested without the token it will be an empty array.
  - **translations** (any): A map of translations for the listing. Default value is a map of all supported languages keyed to null.
  - **views** (integer): The number of times the listing has been viewed. This value is tabulated once per day and **only for active listings**, so the value is not real-time. If `0`, the listing has either not been viewed, not yet tabulated, was not active during the last tabulation or there was an error fetching the value. If a value is expected, call `getListing` to confirm the value.
  - **personalization** (any): 
  - **buyer_price** (any): The buyer-facing price for a listing, including VAT, inclusive shipping (UK), and active promotions. Requires buyer_country parameter. Shows base_price, shipping_cost, original_price (display price), and discounted_price if a promotion is active. Currently only supported on the /listings/batch endpoint.
}

---

## `DELETE /v3/application/shops/{shop_id}/listings/{listing_id}/files/{listing_file_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Deletes a file from a specific listing. When you delete the final file for a digital listing, the listing converts into a physical listing. The response to a delete request returns a list of the remaining file records associated with the given listing.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `listing_file_id` (path): The unique numeric ID of a file associated with a digital listing.

## `GET /v3/application/shops/{shop_id}/listings/{listing_id}/files/{listing_file_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a single file associated with the given digital listing. Requesting a file from a physical listing returns an empty result.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `listing_file_id` (path): The unique numeric ID of a file associated with a digital listing.

### Response Structure
Object {
  - **listing_file_id** (integer): The unique numeric ID of a file associated with a digital listing.
  - **listing_id** (integer): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
  - **rank** (integer): The numeric index of the display order position of this file in the listing, starting at 1.
  - **filename** (string): The file name string for a file associated with a digital listing.
  - **filesize** (string): A human-readable format size string for the size of a file.
  - **size_bytes** (integer): A number indicating the size of a file, measured in bytes.
  - **filetype** (string): A type string indicating a file's MIME type.
  - **create_timestamp** (integer): The unique numeric ID of a file associated with a digital listing.
  - **created_timestamp** (integer): The unique numeric ID of a file associated with a digital listing.
}

---

## `GET /v3/application/shops/{shop_id}/listings/{listing_id}/files`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves all the files associated with the given digital listing. Requesting files from a physical listing returns an empty result.

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **count** (integer): The number of ShopListingFiles being returned..
  - **results** (array): An array of ShopListingFile resources.
}

---

## `POST /v3/application/shops/{shop_id}/listings/{listing_id}/files`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Uploads a new file for a digital listing, or associates an existing file with a specific listing. You must either provide the `listing_file_id` of an existing file, or the name and binary file data for a file to upload. Associating an existing file to a physical listing converts the physical listing into a digital listing, which removes all shipping costs and any product and inventory variations.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

### Response Structure
Object {
  - **listing_file_id** (integer): The unique numeric ID of a file associated with a digital listing.
  - **listing_id** (integer): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
  - **rank** (integer): The numeric index of the display order position of this file in the listing, starting at 1.
  - **filename** (string): The file name string for a file associated with a digital listing.
  - **filesize** (string): A human-readable format size string for the size of a file.
  - **size_bytes** (integer): A number indicating the size of a file, measured in bytes.
  - **filetype** (string): A type string indicating a file's MIME type.
  - **create_timestamp** (integer): The unique numeric ID of a file associated with a digital listing.
  - **created_timestamp** (integer): The unique numeric ID of a file associated with a digital listing.
}

---

## `GET /v3/application/listings/active`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

A list of all active listings on Etsy paginated by their creation date. Without sort_order listings will be returned newest-first by default.

### Parameters
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.
- `keywords` (query): Search term or phrase that must appear in all results.
- `sort_on` (query): The value to sort a search result of listings on. NOTES: a) `sort_on` only works when combined with one of the search options (keywords, region, etc.). b) when using `score` the returned results will always be in _descending_ order, regardless of the `sort_order` parameter.
- `sort_order` (query): The ascending(up) or descending(down) order to sort listings by. NOTE: sort_order only works when combined with one of the search options (keywords, region, etc.).
- `min_price` (query): The minimum price of listings to be returned by a search result.
- `max_price` (query): The maximum price of listings to be returned by a search result.
- `taxonomy_id` (query): The numerical taxonomy ID of the listing. See [SellerTaxonomy](/documentation/reference#tag/SellerTaxonomy) and [BuyerTaxonomy](/documentation/reference#tag/BuyerTaxonomy) for more information.
- `shop_location` (query): Filters by shop location. If location cannot be parsed, Etsy responds with an error.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.
- `is_safe` (query): When true, filters out mature/adult content from search results.
- `currency` (query): The ISO 4217 alphabetic currency code (e.g., EUR, MXN) for price conversion. If provided, the listing price will be converted to this currency.
- `buyer_country` (query): The ISO 3166-1 alpha-2 country code (e.g., DE, MX). Filters results to listings that ship to this country.

### Response Structure
Object {
  - **count** (integer): The number of ShopListing resources found.
  - **results** (array): The ShopListing resources found.
}

---

## `GET /v3/application/shops/{shop_id}/listings/active`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a list of all active listings on Etsy in a specific shop, paginated by listing creation date.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `limit` (query): The maximum number of results to return.
- `sort_on` (query): The value to sort a search result of listings on. NOTES: a) `sort_on` only works when combined with one of the search options (keywords, region, etc.). b) when using `score` the returned results will always be in _descending_ order, regardless of the `sort_order` parameter.
- `sort_order` (query): The ascending(up) or descending(down) order to sort listings by. NOTE: sort_order only works when combined with one of the search options (keywords, region, etc.).
- `offset` (query): The number of records to skip before selecting the first result.
- `keywords` (query): Search term or phrase that must appear in all results.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **count** (integer): The number of ShopListing resources found.
  - **results** (array): The ShopListing resources found.
}

---

## `DELETE /v3/application/shops/{shop_id}/listings/{listing_id}/images/{listing_image_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Open API V3 endpoint to delete a listing image. A copy of the file remains on our servers, and so a deleted image may be re-associated with the listing without re-uploading the original image; see uploadListingImage.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `listing_image_id` (path): The numeric ID of the primary [listing image](/documentation/reference#tag/ShopListing-Image) for this transaction.

## `GET /v3/application/listings/{listing_id}/images/{listing_image_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the references and metadata for a listing image with a specific image ID.

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `listing_image_id` (path): The numeric ID of the primary [listing image](/documentation/reference#tag/ShopListing-Image) for this transaction.

### Response Structure
Object {
  - **listing_id** (integer): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
  - **listing_image_id** (integer): The numeric ID of the primary [listing image](/documentation/reference#tag/ShopListing-Image) for this transaction.
  - **hex_code** (string): The webhex string for the image's average color, in webhex notation.
  - **red** (integer): The numeric red value equal to the image's average red value, from 0-255 (RGB color).
  - **green** (integer): The numeric red value equal to the image's average red value, from 0-255 (RGB color).
  - **blue** (integer): The numeric red value equal to the image's average red value, from 0-255 (RGB color).
  - **hue** (integer): The numeric hue equal to the image's average hue, from 0-360 (HSV color).
  - **saturation** (integer): The numeric saturation equal to the image's average saturation, from 0-100 (HSV color).
  - **brightness** (integer): The numeric brightness equal to the image's average brightness, from 0-100 (HSV color).
  - **is_black_and_white** (boolean): When true, the image is in black & white.
  - **creation_tsz** (integer): The listing image's creation time, in epoch seconds.
  - **created_timestamp** (integer): The listing image's creation time, in epoch seconds.
  - **rank** (integer): The positive non-zero numeric position in the images displayed in a listing, with rank 1 images appearing in the left-most position in a listing.
  - **url_75x75** (string): The url string for a 75x75 pixel thumbnail of the image.
  - **url_170x135** (string): The url string for a 170x135 pixel thumbnail of the image.
  - **url_570xN** (string): The url string for a thumbnail of the image, no more than 570 pixels wide with variable height.
  - **url_fullxfull** (string): The url string for the full-size image, up to 3000 pixels in each dimension.
  - **full_height** (integer): The numeric height, measured in pixels, of the full-sized image referenced in url_fullxfull.
  - **full_width** (integer): The numeric width, measured in pixels, of the full-sized image referenced in url_fullxfull.
  - **alt_text** (string): Alt text for the listing image. Max length 500 characters.
}

---

## `GET /v3/application/listings/{listing_id}/images`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves all listing image resources for a listing with a specific listing ID.

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

### Response Structure
Object {
  - **count** (integer): The number of results.
  - **results** (array): The list of requested resources.
}

---

## `POST /v3/application/shops/{shop_id}/listings/{listing_id}/images`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Uploads or assigns an image to a listing identified by a shop ID with a listing ID. To upload a new image, set the image file as the value for the `image` parameter. You can assign a previously deleted image to a listing using the deleted image's image ID in the `listing_image_id` parameter. When a request contains both `image` and `listing_image_id` parameter values, the endpoint uploads the image in the `image` parameter only. Note: When uploading a new image, data such as colors and size may return as null values due to asynchronous processing of the image. Use getListingImage endpoint to fetch these values.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

### Response Structure
Object {
  - **listing_id** (integer): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
  - **listing_image_id** (integer): The numeric ID of the primary [listing image](/documentation/reference#tag/ShopListing-Image) for this transaction.
  - **hex_code** (string): The webhex string for the image's average color, in webhex notation.
  - **red** (integer): The numeric red value equal to the image's average red value, from 0-255 (RGB color).
  - **green** (integer): The numeric red value equal to the image's average red value, from 0-255 (RGB color).
  - **blue** (integer): The numeric red value equal to the image's average red value, from 0-255 (RGB color).
  - **hue** (integer): The numeric hue equal to the image's average hue, from 0-360 (HSV color).
  - **saturation** (integer): The numeric saturation equal to the image's average saturation, from 0-100 (HSV color).
  - **brightness** (integer): The numeric brightness equal to the image's average brightness, from 0-100 (HSV color).
  - **is_black_and_white** (boolean): When true, the image is in black & white.
  - **creation_tsz** (integer): The listing image's creation time, in epoch seconds.
  - **created_timestamp** (integer): The listing image's creation time, in epoch seconds.
  - **rank** (integer): The positive non-zero numeric position in the images displayed in a listing, with rank 1 images appearing in the left-most position in a listing.
  - **url_75x75** (string): The url string for a 75x75 pixel thumbnail of the image.
  - **url_170x135** (string): The url string for a 170x135 pixel thumbnail of the image.
  - **url_570xN** (string): The url string for a thumbnail of the image, no more than 570 pixels wide with variable height.
  - **url_fullxfull** (string): The url string for the full-size image, up to 3000 pixels in each dimension.
  - **full_height** (integer): The numeric height, measured in pixels, of the full-sized image referenced in url_fullxfull.
  - **full_width** (integer): The numeric width, measured in pixels, of the full-sized image referenced in url_fullxfull.
  - **alt_text** (string): Alt text for the listing image. Max length 500 characters.
}

---

## `GET /v3/application/listings/{listing_id}/inventory`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the inventory record for a listing. Listings you did not edit using the Etsy.com inventory tools have no inventory records. This endpoint returns SKU data if you are the owner of the inventory records being fetched.

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `show_deleted` (query): A boolean value for inventory whether to include deleted products and their offerings. Default value is false.
- `includes` (query): An enumerated string that attaches a valid association. Default value is null.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **products** (array): A JSON array of products available in a listing, even if only one product. All field names in the JSON blobs are lowercase.
  - **price_on_property** (array): An array of unique [listing property](/documentation/reference#operation/getListingInventory) ID integers for the properties that change product prices, if any. For example, if you charge specific prices for different sized products in the same listing, then this array contains the property ID for size.
  - **quantity_on_property** (array): An array of unique [listing property](/documentation/reference#operation/getListingInventory) ID integers for the properties that change the quantity of the products, if any. For example, if you stock specific quantities of different colored products in the same listing, then this array contains the property ID for color.
  - **sku_on_property** (array): An array of unique [listing property](/documentation/reference#operation/getListingInventory) ID integers for the properties that change the product SKU, if any. For example, if you use specific skus for different colored products in the same listing, then this array contains the property ID for color.
  - **readiness_state_on_property** (array): An array of unique [listing property](/documentation/reference#operation/getListingInventory) ID integers for the properties that change processing profile, if any. For example, if you need specific processing profiles for different colored products in the same listing, then this array contains the property ID for color.
  - **listing** (any): An enumerated string that attaches a valid association. Default value is null.
}

---

## `PUT /v3/application/listings/{listing_id}/inventory`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates the inventory for a listing identified by a listing ID. The update fails if the supplied values for product sku, offering quantity, price, and/or processing profile are incompatible with values in `*_on_property` fields. When setting a price, assign a float equal to amount divided by divisor as specified in the Money resource.

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.
- `max_variations_supported` (query): Coming soon: This parameter determines whether a third variation can be added to or updated for a listing. It accepts values of 2 or 3, where 3 enables third-variation support.

### Response Structure
Object {
  - **products** (array): A JSON array of products available in a listing, even if only one product. All field names in the JSON blobs are lowercase.
  - **price_on_property** (array): An array of unique [listing property](/documentation/reference#operation/getListingInventory) ID integers for the properties that change product prices, if any. For example, if you charge specific prices for different sized products in the same listing, then this array contains the property ID for size.
  - **quantity_on_property** (array): An array of unique [listing property](/documentation/reference#operation/getListingInventory) ID integers for the properties that change the quantity of the products, if any. For example, if you stock specific quantities of different colored products in the same listing, then this array contains the property ID for color.
  - **sku_on_property** (array): An array of unique [listing property](/documentation/reference#operation/getListingInventory) ID integers for the properties that change the product SKU, if any. For example, if you use specific skus for different colored products in the same listing, then this array contains the property ID for color.
  - **readiness_state_on_property** (array): An array of unique [listing property](/documentation/reference#operation/getListingInventory) ID integers for the properties that change processing profile, if any. For example, if you need specific processing profiles for different colored products in the same listing, then this array contains the property ID for color.
}

---

## `GET /v3/application/listings/batch/inventory`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the inventory record for each listing referenced by listing ID. Requires the listings_r OAuth scope. Limit 100 listing IDs per request.

### Parameters
- `listing_ids` (query): The list of numeric IDS for the listings in a specific Etsy shop.

### Response Structure
Object {
  - **count** (integer): The number of ShopListing resources found.
  - **results** (array): The ShopListing resources found.
}

---

## `GET /v3/application/listings/{listing_id}/inventory/products/{product_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Open API V3 endpoint to retrieve a ListingProduct by ID.

### Parameters
- `listing_id` (path): The listing to return a ListingProduct for.
- `product_id` (path): The numeric ID for a specific [product](/documentation/reference#tag/ShopListing-Product) purchased from a listing.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **product_id** (integer): The numeric ID for a specific [product](/documentation/reference#tag/ShopListing-Product) purchased from a listing.
  - **sku** (string): The SKU string for the product
  - **is_deleted** (boolean): When true, someone deleted this product.
  - **offerings** (array): A list of product offering entries for this product.
  - **property_values** (array): A list of property value entries for this product. Note: parenthesis characters (`(` and `)`) are not allowed.
}

---

## `GET /v3/application/listings/{listing_id}/products/{product_id}/offerings/{product_offering_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Get an Offering for a Listing

### Parameters
- `listing_id` (path): 
- `product_id` (path): 
- `product_offering_id` (path): 
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **offering_id** (integer): The ID for the ProductOffering
  - **quantity** (integer): The quantity the ProductOffering
  - **is_enabled** (boolean): Whether or not the offering can be shown to buyers.
  - **is_deleted** (boolean): Whether or not the offering has been deleted.
  - **price** (any): Price data for this ProductOffering
  - **readiness_state_id** (integer): Processing Profile for this ProductOffering
}

---

## `GET /v3/application/listings/batch`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Allows to query multiple listing ids at once. Limit 100 ids maximum per query.

### Parameters
- `listing_ids` (query): The list of numeric IDS for the listings in a specific Etsy shop.
- `includes` (query): An enumerated string that attaches a valid association. Acceptable inputs are 'Shop', 'Images', 'User', 'Translations', 'Videos', 'Personalization' and 'BuyerPrice'.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.
- `currency` (query): The ISO 4217 alphabetic currency code (e.g., EUR, MXN) for price conversion. If provided, the listing price will be converted to this currency.
- `buyer_country` (query): The ISO 3166-1 alpha-2 country code (e.g., GB, DE). Used for buyer-facing price calculations (VAT, inclusive shipping). Does not filter listings.

### Response Structure
Object {
  - **count** (integer): The number of ShopListing resources found.
  - **results** (array): The ShopListing resources found.
}

---

## `GET /v3/application/shops/{shop_id}/listings/featured`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves Listings associated to a Shop that are featured.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **count** (integer): The number of ShopListing resources found.
  - **results** (array): The ShopListing resources found.
}

---

## `DELETE /v3/application/shops/{shop_id}/listings/{listing_id}/personalization`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Deletes personalization for a listing.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

## `POST /v3/application/shops/{shop_id}/listings/{listing_id}/personalization`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Creates or updates personalization settings for a listing, allowing the seller to collect personalization from the buyer. This endpoint will fully replace any existing personalization on the listing.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `supports_multiple_personalization_questions` (query): This query parameter indicates that the caller supports up to 5 personalization questions and the following question types: 'text_input', 'dropdown', 'unlabeled_upload', 'labeled_upload'. Sending this param without updating your application can lead to inadvertently deleting seller-entered data.

### Response Structure
Object {
  - **personalization_questions** (array): 
}

---

## `GET /v3/application/listings/{listing_id}/personalization`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a listing's personalization questions by listing ID.

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

### Response Structure
Object {
  - **personalization_questions** (array): 
}

---

## `DELETE /v3/application/shops/{shop_id}/listings/{listing_id}/properties/{property_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Deletes a property for a Listing.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `property_id` (path): The unique ID of an Etsy [listing property](/documentation/reference#operation/getListingProperties).

## `PUT /v3/application/shops/{shop_id}/listings/{listing_id}/properties/{property_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates or populates the properties list defining product offerings for a listing. Each offering requires both a `value` and a `value_id` that are valid for a `scale_id` assigned to the listing or that you assign to the listing with this request.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `property_id` (path): The unique ID of an Etsy [listing property](/documentation/reference#operation/getListingProperties).

### Response Structure
Object {
  - **property_id** (integer): The numeric ID of the Property.
  - **property_name** (string): The name of the Property.
  - **scale_id** (integer): The numeric ID of the scale (if any).
  - **scale_name** (string): The label used to describe the chosen scale (if any).
  - **value_ids** (array): The numeric IDs of the Property values
  - **values** (array): The Property values
}

---

## `GET /v3/application/listings/{listing_id}/properties/{property_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationTertiary wt-mr-xs-2"> Feedback only </span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Give feedback</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">Development for this endpoint is in progress. It will only return a 501 response.</p></div>

Retrieves a listing's property

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `property_id` (path): The unique ID of an Etsy [listing property](/documentation/reference#operation/getListingProperties).

### Response Structure
Object {
  - **property_id** (integer): The numeric ID of the Property.
  - **property_name** (string): The name of the Property.
  - **scale_id** (integer): The numeric ID of the scale (if any).
  - **scale_name** (string): The label used to describe the chosen scale (if any).
  - **value_ids** (array): The numeric IDs of the Property values
  - **values** (array): The Property values
}

---

## `GET /v3/application/shops/{shop_id}/listings/{listing_id}/properties`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Get a listing's properties

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

### Response Structure
Object {
  - **count** (integer): 
  - **results** (array): 
}

---

## `GET /v3/application/listings/batch/shipping`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the shipping profile for each listing referenced by listing ID. Requires the shops_r OAuth scope. Limit 100 listing IDs per request.

### Parameters
- `listing_ids` (query): The list of numeric IDS for the listings in a specific Etsy shop.

### Response Structure
Object {
  - **count** (integer): The number of ShopListing resources found.
  - **results** (array): The ShopListing resources found.
}

---

## `GET /v3/application/shops/{shop_id}/listings/{listing_id}/transactions`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the list of transactions associated with a listing.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.
- `legacy` (query): This parameter needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **count** (integer): The number of ShopReceiptTransaction resources found.
  - **results** (array): The ShopReceiptTransaction resources found.
}

---

## `POST /v3/application/shops/{shop_id}/listings/{listing_id}/translations/{language}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Creates a ListingTranslation by listing_id and language

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `language` (path): The IETF language tag for the language of this translation. Ex: `de`, `en`, `es`, `fr`, `it`, `ja`, `nl`, `pl`, `pt`.

### Response Structure
Object {
  - **listing_id** (integer): The numeric ID for the Listing.
  - **language** (string): The IETF language tag (e.g. 'fr') for the language of this translation.
  - **title** (string): The title of the Listing of this Translation.
  - **description** (string): The description of the Listing of this Translation.
  - **tags** (array): The tags of the Listing of this Translation.
}

---

## `GET /v3/application/shops/{shop_id}/listings/{listing_id}/translations/{language}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Get a Translation for a Listing in the given language

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `language` (path): The IETF language tag for the language of this translation. Ex: `de`, `en`, `es`, `fr`, `it`, `ja`, `nl`, `pl`, `pt`.

### Response Structure
Object {
  - **listing_id** (integer): The numeric ID for the Listing.
  - **language** (string): The IETF language tag (e.g. 'fr') for the language of this translation.
  - **title** (string): The title of the Listing of this Translation.
  - **description** (string): The description of the Listing of this Translation.
  - **tags** (array): The tags of the Listing of this Translation.
}

---

## `PUT /v3/application/shops/{shop_id}/listings/{listing_id}/translations/{language}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates a ListingTranslation by listing_id and language

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `language` (path): The IETF language tag for the language of this translation. Ex: `de`, `en`, `es`, `fr`, `it`, `ja`, `nl`, `pl`, `pt`.

### Response Structure
Object {
  - **listing_id** (integer): The numeric ID for the Listing.
  - **language** (string): The IETF language tag (e.g. 'fr') for the language of this translation.
  - **title** (string): The title of the Listing of this Translation.
  - **description** (string): The description of the Listing of this Translation.
  - **tags** (array): The tags of the Listing of this Translation.
}

---

## `PATCH /v3/application/shops/{shop_id}/listings/{listing_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates a listing, identified by a listing ID, for a specific shop identified by a shop ID. Note that this is a PATCH method type. When activating, or manually renewing a physical listing, the shipping profile referenced by the `shipping_profile_id`, and all of its fields, along with its entries and upgrades must be complete and valid. If the shipping profile is not complete and valid, we will throw an exception with an error message that guides the request sender to update whatever data is bad.   Digital listings that are not made to order must have a file upload associated with it to be activated. While the listing is a draft, shipping profile and file upload are not required in any case.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **listing_id** (integer): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
  - **user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) posting the listing.
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **title** (string): The listing's title string. When creating or updating a listing, valid title strings contain only letters, numbers, punctuation marks, mathematical symbols, whitespace characters, ™, ©, and ®. (regex: /[^\p{L}\p{Nd}\p{P}\p{Sm}\p{Zs}™©®]/u) You can only use the %, :, & and + characters once each.
  - **description** (string): A description string of the product for sale in the listing.
  - **rich_description** (string): The seller-authored HTML rich-text description of the product when the listing uses rich text; null for plain-text listings. The plain-text `description` field is always populated. This value is HTML and consumers MUST sanitize it before rendering it in any HTML context.
  - **state** (string): When _updating_ a listing, this value can be either `active` or `inactive`. Note: Setting a `draft` listing to `active` will also publish the listing on etsy.com and requires that the listing have an image set. Setting a `sold_out` listing to active will update the quantity to 1 and renew the listing on etsy.com.
  - **creation_timestamp** (integer): The listing's creation time, in epoch seconds.
  - **created_timestamp** (integer): The listing's creation time, in epoch seconds.
  - **ending_timestamp** (integer): The listing's expiration time, in epoch seconds.
  - **original_creation_timestamp** (integer): The listing's creation time, in epoch seconds.
  - **last_modified_timestamp** (integer): The time of the last update to the listing, in epoch seconds.
  - **updated_timestamp** (integer): The time of the last update to the listing, in epoch seconds.
  - **state_timestamp** (integer): The date and time of the last state change of this listing.
  - **quantity** (integer): The positive non-zero number of products available for purchase in the listing. Note: The listing quantity is the sum of available offering quantities. You can request the quantities for individual offerings from the ListingInventory resource using the [getListingInventory](/documentation/reference#operation/getListingInventory) endpoint.
  - **shop_section_id** (integer): The numeric ID of a section in a specific Etsy shop.
  - **featured_rank** (integer): The positive non-zero numeric position in the featured listings of the shop, with rank 1 listings appearing in the left-most position in featured listing on a shop's home page.
  - **url** (string): The full URL to the listing's page on Etsy.
  - **num_favorers** (integer): The number of users who marked this Listing a favorite.
  - **non_taxable** (boolean): When true, applicable [shop](/documentation/reference#tag/Shop) tax rates do not apply to this listing at checkout.
  - **is_taxable** (boolean): When true, applicable [shop](/documentation/reference#tag/Shop) tax rates apply to this listing at checkout.
  - **is_customizable** (boolean): When true, a buyer may contact the seller for a customized order. The default value is true when a shop accepts custom orders. Does not apply to shops that do not accept custom orders.
  - **is_personalizable** (boolean): When true, this listing is personalizable. The default value is false.
  - **listing_type** (string): An enumerated type string that indicates whether the listing is physical or a digital download.
  - **tags** (array): A comma-separated list of tag strings for the listing. When creating or updating a listing, valid tag strings contain only letters, numbers, whitespace characters, -, ', ™, ©, and ®. (regex: /[^\p{L}\p{Nd}\p{Zs}\-'™©®]/u) Default value is null.
  - **materials** (array): A list of material strings for materials used in the product. Valid materials strings contain only letters, numbers, and whitespace characters. (regex: /[^\p{L}\p{Nd}\p{Zs}]/u) Default value is null.
  - **shipping_profile_id** (integer): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.
  - **return_policy_id** (integer): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).
  - **processing_min** (integer): The minimum number of days required to process this listing. Default value is null.
  - **processing_max** (integer): The maximum number of days required to process this listing. Default value is null.
  - **who_made** (string): An enumerated string indicating who made the product. Helps buyers locate the listing under the Handmade heading. Requires 'is_supply' and 'when_made'.
  - **when_made** (string): An enumerated string for the era in which the maker made the product in this listing. Helps buyers locate the listing under the Vintage heading. Requires 'is_supply' and 'who_made'.
  - **is_supply** (boolean): When true, tags the listing as a supply product, else indicates that it's a finished product. Helps buyers locate the listing under the Supplies heading. Requires 'who_made' and 'when_made'.
  - **item_weight** (number): The numeric weight of the product measured in units set in 'item_weight_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_weight_unit** (string): A string defining the units used to measure the weight of the product. Default value is null.
  - **item_length** (number): The numeric length of the product measured in units set in 'item_dimensions_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_width** (number): The numeric width of the product measured in units set in 'item_dimensions_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_height** (number): The numeric length of the product measured in units set in 'item_dimensions_unit'. Default value is null. If set, the value must be greater than 0.
  - **item_dimensions_unit** (string): A string defining the units used to measure the dimensions of the product. Default value is null.
  - **is_private** (boolean): When true, this is a private listing intended for a specific buyer and hidden from shop view.
  - **style** (array): An array of style strings for this listing, each of which is free-form text string such as "Formal", or "Steampunk". When creating or updating a listing, the listing may have up to two styles. Valid style strings contain only letters, numbers, and whitespace characters. (regex: /[^\p{L}\p{Nd}\p{Zs}]/u) Each style string is limited to 45 characters. Default value is null.
  - **file_data** (string): A string describing the files attached to a digital listing.
  - **has_variations** (boolean): When true, the listing has variations.
  - **should_auto_renew** (boolean): When true, renews a listing for four months upon expiration.
  - **language** (string): The IETF language tag for the default language of the listing. Ex: `de`, `en`, `es`, `fr`, `it`, `ja`, `nl`, `pl`, `pt`, `ru`.
  - **price** (any): The positive non-zero price of the product. (Sold product listings are private) Note: The price is the minimum possible price. The [`getListingInventory`](/documentation/reference/#operation/getListingInventory) method requests exact prices for available offerings.
  - **converted_price** (any): The listing price converted to the currency requested via the currency parameter. Only present when the currency parameter is provided. Null if the conversion rate is unavailable.
  - **taxonomy_id** (integer): The numerical taxonomy ID of the listing. See [SellerTaxonomy](/documentation/reference#tag/SellerTaxonomy) and [BuyerTaxonomy](/documentation/reference#tag/BuyerTaxonomy) for more information.
  - **readiness_state_id** (integer): The numeric ID of the [processing profile](/documentation/reference#operation/getShopReadinessStateDefinition) associated with the listing. Returned only when the listing is `active` and of type `physical`, and the endpoint is either shop-scoped (path contains `shop_id`) or a single-listing request such as `getListing`. For every other case this field can be null.
  - **suggested_title** (string): A title string suggested by Etsy. Only available for a user's own listings, when allow_suggested_title param is present, and when a shop's language setting is English. Not all listings will have suggestions.
}

---

## `GET /v3/application/shops/{shop_id}/listings/{listing_id}/variation-images`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Gets all variation images on a listing.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

### Response Structure
Object {
  - **count** (integer): 
  - **results** (array): 
}

---

## `POST /v3/application/shops/{shop_id}/listings/{listing_id}/variation-images`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Creates variation images on a listing. `variation_images` is an array with inputs for the `property_id`, `value_id`, and `image_id` fields. `image_ids` are associated with a `ListingImage` on the listing associated with the provided `listing_id`. `property_id` and `value_id` pairs are associated with a `ListingProduct` on the listing associated with the provided `listing_id`. `variation_images` should not contain any duplicates. `variation_images` does not contain more than one `property_id` as variation images can only be associated on one property. The update overwrites all existing variation images on a listing, so if your request is successful, the variation images on the listing will be exactly those you specify. 

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

### Response Structure
Object {
  - **count** (integer): 
  - **results** (array): 
}

---

## `DELETE /v3/application/shops/{shop_id}/listings/{listing_id}/videos/{video_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Open API V3 endpoint to delete a listing video. A copy of the video remains on our servers, and so a deleted video may be re-associated with the listing without re-uploading the original video; see uploadListingVideo.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `video_id` (path): The unique ID of a video associated with a listing.

## `GET /v3/application/listings/{listing_id}/videos/{video_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a single video associated with the given listing. Requesting a video from a listing returns an empty result.

### Parameters
- `video_id` (path): The unique ID of a video associated with a listing.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

### Response Structure
Object {
  - **video_id** (integer): The unique ID of a video associated with a listing.
  - **height** (integer): The video height dimension in pixels.
  - **width** (integer): The video width dimension in pixels.
  - **thumbnail_url** (string): The url of the video thumbnail.
  - **video_url** (string): The url of the video file.
  - **video_state** (string): The current state of a given video. Value is one of `active`, `inactive`, `deleted` or `flagged`.
}

---

## `GET /v3/application/listings/{listing_id}/videos`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves all listing video resources for a listing with a specific listing ID.

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

### Response Structure
Object {
  - **count** (integer): The number of results.
  - **results** (array): The list of requested resources.
}

---

## `POST /v3/application/shops/{shop_id}/listings/{listing_id}/videos`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Uploads a new video for a listing, or associates an existing video with a specific listing. You must either provide the `video_id` of an existing video, or the name and binary file data for a video to upload. If providing a `video_id`, the video must already be associated with the same shop as the listing, but it does not need to be currently associated with the listing. 

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.

### Response Structure
Object {
  - **video_id** (integer): The unique ID of a video associated with a listing.
  - **height** (integer): The video height dimension in pixels.
  - **width** (integer): The video width dimension in pixels.
  - **thumbnail_url** (string): The url of the video thumbnail.
  - **video_url** (string): The url of the video file.
  - **video_state** (string): The current state of a given video. Value is one of `active`, `inactive`, `deleted` or `flagged`.
}

---

## `GET /v3/application/shops/{shop_id}/payment-account/ledger-entries/{ledger_entry_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Get a single Shop Payment Account Ledger's Entry

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `ledger_entry_id` (path): The unique ID of the shop owner ledger entry.

### Response Structure
Object {
  - **entry_id** (integer): The ledger entry's numeric ID.
  - **ledger_id** (integer): The ledger's numeric ID.
  - **sequence_number** (integer): The sequence allows ledger entries to be sorted chronologically. The higher the sequence, the more recent the entry.
  - **amount** (integer): The amount of money credited to the ledger.
  - **currency** (string): The currency of the entry on the ledger.
  - **description** (string): Details what kind of ledger entry this is: a payment, refund, reversal of a failed refund, disbursement, returned disbursement, recoupment, miscellaneous credit, miscellaneous debit, or bill payment.
  - **balance** (integer): The amount of money in the shop's ledger the moment after this entry was applied.
  - **create_date** (integer): The date and time the ledger entry was created in Epoch seconds.
  - **created_timestamp** (integer): The date and time the ledger entry was created in Epoch seconds.
  - **ledger_type** (string): The original reference type for the ledger entry.
  - **reference_type** (string): The object type the ledger entry refers to.
  - **reference_id** (string): The object id the ledger entry refers to.
  - **parent_entry_id** (integer): The parent ledger entry ID used to match related entries (e.g., vat_seller_services to originating seller fees).
  - **payment_adjustments** (array): List of refund objects on an Etsy Payments transaction. All monetary amounts are in USD pennies unless otherwise specified.
}

---

## `GET /v3/application/shops/{shop_id}/payment-account/ledger-entries`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Get a Shop Payment Account Ledger's Entries

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `min_created` (query): The earliest unix timestamp for when a record was created.
- `max_created` (query): The latest unix timestamp for when a record was created.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.

### Response Structure
Object {
  - **count** (integer): The number of PaymentAccountLedgerEntry resources found.
  - **results** (array): The PaymentAccountLedgerEntry resources found.
}

---

## `GET /v3/application/shops/{shop_id}/payment-account/ledger-entries/payments`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Get a Payment from a PaymentAccount Ledger Entry ID, if applicable

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `ledger_entry_ids` (query): 

### Response Structure
Object {
  - **count** (integer): The number of payments in the response.
  - **results** (array): A list of payments.
}

---

## `GET /v3/application/shops/{shop_id}/receipts/{receipt_id}/payments`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a payment from a specific receipt, identified by `receipt_id`, from a specific shop, identified by `shop_id`

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `receipt_id` (path): The numeric ID for the [receipt](/documentation/reference#tag/Shop-Receipt) associated to this transaction.

### Response Structure
Object {
  - **count** (integer): The number of payments in the response.
  - **results** (array): A list of payments.
}

---

## `GET /v3/application/shops/{shop_id}/payments`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a list of payments from a shop identified by `shop_id`. You can also filter results using a list of payment IDs.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `payment_ids` (query): A comma-separated array of Payment IDs numbers.

### Response Structure
Object {
  - **count** (integer): The number of payments in the response.
  - **results** (array): A list of payments.
}

---

## `GET /v3/application/openapi-ping`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Check to confirm connectivity to the Etsy API with an application

### Response Structure
Object {
  - **application_id** (integer): The authenticated application's ID
}

---

## `GET /v3/application/shops/{shop_id}/receipts/{receipt_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a receipt, identified by a receipt id, from an Etsy shop. **NOTE** Access to ShopReceipt's first_line, second_line, city, state, zip, country_iso and formatted_address is contingent in some regions to a preferred partnership status with Etsy

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `receipt_id` (path): The numeric ID for the [receipt](/documentation/reference#tag/Shop-Receipt) associated to this transaction.
- `legacy` (query): This parameter needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **receipt_id** (integer): The numeric ID for the [receipt](/documentation/reference#tag/Shop-Receipt) associated to this transaction.
  - **receipt_type** (integer): The numeric value for the Etsy channel that serviced the purchase: 0 or 5 for Etsy.com, 1 for a Pattern shop.
  - **seller_user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) (seller) fulfilling the purchase.
  - **seller_email** (string): The email address string for the seller of the listing.
  - **buyer_user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) making the purchase.
  - **buyer_email** (string): The email address string for the buyer of the listing. It will be null if access hasn't been granted. Access is case-by-case and subject to approval.
  - **name** (string): The name string for the recipient in the shipping address.
  - **first_line** (string): The first address line string for the recipient in the shipping address.
  - **second_line** (string): The optional second address line string for the recipient in the shipping address.
  - **city** (string): The city string for the recipient in the shipping address.
  - **state** (string): The state string for the recipient in the shipping address.
  - **zip** (string): The zip code string (not necessarily a number) for the recipient in the shipping address.
  - **status** (string): The current order status string. One of: `paid`, `completed`, `open`, `payment processing` or `canceled`.
  - **formatted_address** (string): The formatted shipping address string for the recipient in the shipping address.
  - **country_iso** (string): The ISO-3166 alpha-2 country code string for the recipient in the shipping address.
  - **payment_method** (string): The payment method string identifying purchaser's payment method, which must be one of: 'cc' (credit card), 'paypal', 'check', 'mo' (money order), 'bt' (bank transfer), 'other', 'ideal', 'sofort', 'apple_pay', 'google', 'android_pay', 'google_pay', 'klarna', 'k_pay_in_4' (klarna), 'k_pay_in_3' (klarna), or 'k_financing' (klarna).
  - **payment_email** (string): The email address string for the email address to which to send payment confirmation
  - **message_from_seller** (string): An optional message string from the seller.
  - **message_from_buyer** (string): An optional message string from the buyer.
  - **message_from_payment** (string): The machine-generated acknowledgement string from the payment system.
  - **is_paid** (boolean): When true, buyer paid for this purchase.
  - **is_shipped** (boolean): When true, seller shipped the products.
  - **create_timestamp** (integer): The receipt's creation time, in epoch seconds.
  - **created_timestamp** (integer): The receipt's creation time, in epoch seconds.
  - **update_timestamp** (integer): The time of the last update to the receipt, in epoch seconds.
  - **updated_timestamp** (integer): The time of the last update to the receipt, in epoch seconds.
  - **is_gift** (boolean): When true, the buyer indicated this purchase is a gift.
  - **gift_message** (string): A gift message string the buyer requests delivered with the product.
  - **gift_sender** (string): The name of the person who sent the gift.
  - **grandtotal** (any): A number equal to the total_price minus the coupon discount plus tax and shipping costs.
  - **subtotal** (any): A number equal to the total_price minus coupon discounts. Does not include tax or shipping costs.
  - **total_price** (any): A number equal to the sum of the individual listings' (price * quantity). Does not include tax or shipping costs.
  - **total_shipping_cost** (any): A number equal to the total shipping cost of the receipt.
  - **total_tax_cost** (any): The total sales tax of the receipt.
  - **total_vat_cost** (any): A number equal to the total value-added tax (VAT) of the receipt.
  - **discount_amt** (any): The numeric total discounted price for the receipt when using a discount (percent or fixed) coupon. Free shipping coupons are not included in this discount amount.
  - **gift_wrap_price** (any): The numeric price of gift wrap for this receipt.
  - **shipments** (array): A list of shipment statements for this receipt.
  - **transactions** (array): Array of transactions for the receipt.
  - **refunds** (array): Refunds for a given receipt.
}

---

## `PUT /v3/application/shops/{shop_id}/receipts/{receipt_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates the status of a receipt, identified by a receipt id, from an Etsy shop. **NOTE** Access to ShopReceipt's first_line, second_line, city, state, zip, country_iso and formatted_address is contingent in some regions to a preferred partnership status with Etsy

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `receipt_id` (path): The numeric ID for the [receipt](/documentation/reference#tag/Shop-Receipt) associated to this transaction.
- `legacy` (query): This parameter needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **receipt_id** (integer): The numeric ID for the [receipt](/documentation/reference#tag/Shop-Receipt) associated to this transaction.
  - **receipt_type** (integer): The numeric value for the Etsy channel that serviced the purchase: 0 or 5 for Etsy.com, 1 for a Pattern shop.
  - **seller_user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) (seller) fulfilling the purchase.
  - **seller_email** (string): The email address string for the seller of the listing.
  - **buyer_user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) making the purchase.
  - **buyer_email** (string): The email address string for the buyer of the listing. It will be null if access hasn't been granted. Access is case-by-case and subject to approval.
  - **name** (string): The name string for the recipient in the shipping address.
  - **first_line** (string): The first address line string for the recipient in the shipping address.
  - **second_line** (string): The optional second address line string for the recipient in the shipping address.
  - **city** (string): The city string for the recipient in the shipping address.
  - **state** (string): The state string for the recipient in the shipping address.
  - **zip** (string): The zip code string (not necessarily a number) for the recipient in the shipping address.
  - **status** (string): The current order status string. One of: `paid`, `completed`, `open`, `payment processing` or `canceled`.
  - **formatted_address** (string): The formatted shipping address string for the recipient in the shipping address.
  - **country_iso** (string): The ISO-3166 alpha-2 country code string for the recipient in the shipping address.
  - **payment_method** (string): The payment method string identifying purchaser's payment method, which must be one of: 'cc' (credit card), 'paypal', 'check', 'mo' (money order), 'bt' (bank transfer), 'other', 'ideal', 'sofort', 'apple_pay', 'google', 'android_pay', 'google_pay', 'klarna', 'k_pay_in_4' (klarna), 'k_pay_in_3' (klarna), or 'k_financing' (klarna).
  - **payment_email** (string): The email address string for the email address to which to send payment confirmation
  - **message_from_seller** (string): An optional message string from the seller.
  - **message_from_buyer** (string): An optional message string from the buyer.
  - **message_from_payment** (string): The machine-generated acknowledgement string from the payment system.
  - **is_paid** (boolean): When true, buyer paid for this purchase.
  - **is_shipped** (boolean): When true, seller shipped the products.
  - **create_timestamp** (integer): The receipt's creation time, in epoch seconds.
  - **created_timestamp** (integer): The receipt's creation time, in epoch seconds.
  - **update_timestamp** (integer): The time of the last update to the receipt, in epoch seconds.
  - **updated_timestamp** (integer): The time of the last update to the receipt, in epoch seconds.
  - **is_gift** (boolean): When true, the buyer indicated this purchase is a gift.
  - **gift_message** (string): A gift message string the buyer requests delivered with the product.
  - **gift_sender** (string): The name of the person who sent the gift.
  - **grandtotal** (any): A number equal to the total_price minus the coupon discount plus tax and shipping costs.
  - **subtotal** (any): A number equal to the total_price minus coupon discounts. Does not include tax or shipping costs.
  - **total_price** (any): A number equal to the sum of the individual listings' (price * quantity). Does not include tax or shipping costs.
  - **total_shipping_cost** (any): A number equal to the total shipping cost of the receipt.
  - **total_tax_cost** (any): The total sales tax of the receipt.
  - **total_vat_cost** (any): A number equal to the total value-added tax (VAT) of the receipt.
  - **discount_amt** (any): The numeric total discounted price for the receipt when using a discount (percent or fixed) coupon. Free shipping coupons are not included in this discount amount.
  - **gift_wrap_price** (any): The numeric price of gift wrap for this receipt.
  - **shipments** (array): A list of shipment statements for this receipt.
  - **transactions** (array): Array of transactions for the receipt.
  - **refunds** (array): Refunds for a given receipt.
}

---

## `GET /v3/application/shops/{shop_id}/receipts`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Requests the Shop Receipts from a specific Shop, unfiltered or filtered by receipt id range or offset, date, paid, and/or shipped purchases. **NOTE** Access to ShopReceipt's first_line, second_line, city, state, zip, country_iso and formatted_address is contingent in some regions to a preferred partnership status with Etsy

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `min_created` (query): The earliest unix timestamp for when a record was created.
- `max_created` (query): The latest unix timestamp for when a record was created.
- `min_last_modified` (query): The earliest unix timestamp for when a record last changed.
- `max_last_modified` (query): The latest unix timestamp for when a record last changed.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.
- `sort_on` (query): The value to sort a search result of listings on.
- `sort_order` (query): The ascending(up) or descending(down) order to sort receipts by.
- `was_paid` (query): When `true`, returns receipts where the seller has received payment for the receipt. When `false`, returns receipts where payment has not been received.
- `was_shipped` (query): When `true`, returns receipts where the seller shipped the product(s) in this receipt. When `false`, returns receipts where shipment has not been set.
- `was_delivered` (query): When `true`, returns receipts that have been marked as delivered. When `false`, returns receipts where shipment has not been marked as delivered.
- `was_canceled` (query): When `true`, the endpoint will only return the canceled receipts. When `false`, the endpoint will only return non-canceled receipts.
- `legacy` (query): This parameter needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **count** (integer): The number of Shop Receipts found.
  - **results** (array): List of Shop Receipt resources found, with all Shop Receipt fields for each resource.
}

---

## `GET /v3/application/shops/{shop_id}/receipts/{receipt_id}/listings`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Gets all listings associated with a receipt.

### Parameters
- `receipt_id` (path): The numeric ID for the [receipt](/documentation/reference#tag/Shop-Receipt) associated to this transaction.
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **count** (integer): The number of ShopListing resources found.
  - **results** (array): The ShopListing resources found.
}

---

## `POST /v3/application/shops/{shop_id}/receipts/{receipt_id}/tracking`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Submits tracking information for a Shop Receipt, which creates a Shop Receipt Shipment entry for the given receipt_id. Each time you successfully submit tracking info, Etsy sends a notification email to the buyer User. When send_bcc is true, Etsy sends shipping notifications to the seller as well. When tracking_code and carrier_name aren't sent, the receipt is marked as shipped only. If the carrier is not supported, you may use `other` as the carrier name so you can provide the tracking code. **NOTES** When shipping within the United States AND the order is over $10 _or_ when shipping to India, tracking code and carrier name ARE required. Access to ShopReceipt's first_line, second_line, city, state, zip, country_iso and formatted_address is contingent in some regions to a preferred partnership status with Etsy

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `receipt_id` (path): The receipt to submit tracking for.
- `legacy` (query): This parameter needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **receipt_id** (integer): The numeric ID for the [receipt](/documentation/reference#tag/Shop-Receipt) associated to this transaction.
  - **receipt_type** (integer): The numeric value for the Etsy channel that serviced the purchase: 0 or 5 for Etsy.com, 1 for a Pattern shop.
  - **seller_user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) (seller) fulfilling the purchase.
  - **seller_email** (string): The email address string for the seller of the listing.
  - **buyer_user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) making the purchase.
  - **buyer_email** (string): The email address string for the buyer of the listing. It will be null if access hasn't been granted. Access is case-by-case and subject to approval.
  - **name** (string): The name string for the recipient in the shipping address.
  - **first_line** (string): The first address line string for the recipient in the shipping address.
  - **second_line** (string): The optional second address line string for the recipient in the shipping address.
  - **city** (string): The city string for the recipient in the shipping address.
  - **state** (string): The state string for the recipient in the shipping address.
  - **zip** (string): The zip code string (not necessarily a number) for the recipient in the shipping address.
  - **status** (string): The current order status string. One of: `paid`, `completed`, `open`, `payment processing` or `canceled`.
  - **formatted_address** (string): The formatted shipping address string for the recipient in the shipping address.
  - **country_iso** (string): The ISO-3166 alpha-2 country code string for the recipient in the shipping address.
  - **payment_method** (string): The payment method string identifying purchaser's payment method, which must be one of: 'cc' (credit card), 'paypal', 'check', 'mo' (money order), 'bt' (bank transfer), 'other', 'ideal', 'sofort', 'apple_pay', 'google', 'android_pay', 'google_pay', 'klarna', 'k_pay_in_4' (klarna), 'k_pay_in_3' (klarna), or 'k_financing' (klarna).
  - **payment_email** (string): The email address string for the email address to which to send payment confirmation
  - **message_from_seller** (string): An optional message string from the seller.
  - **message_from_buyer** (string): An optional message string from the buyer.
  - **message_from_payment** (string): The machine-generated acknowledgement string from the payment system.
  - **is_paid** (boolean): When true, buyer paid for this purchase.
  - **is_shipped** (boolean): When true, seller shipped the products.
  - **create_timestamp** (integer): The receipt's creation time, in epoch seconds.
  - **created_timestamp** (integer): The receipt's creation time, in epoch seconds.
  - **update_timestamp** (integer): The time of the last update to the receipt, in epoch seconds.
  - **updated_timestamp** (integer): The time of the last update to the receipt, in epoch seconds.
  - **is_gift** (boolean): When true, the buyer indicated this purchase is a gift.
  - **gift_message** (string): A gift message string the buyer requests delivered with the product.
  - **gift_sender** (string): The name of the person who sent the gift.
  - **grandtotal** (any): A number equal to the total_price minus the coupon discount plus tax and shipping costs.
  - **subtotal** (any): A number equal to the total_price minus coupon discounts. Does not include tax or shipping costs.
  - **total_price** (any): A number equal to the sum of the individual listings' (price * quantity). Does not include tax or shipping costs.
  - **total_shipping_cost** (any): A number equal to the total shipping cost of the receipt.
  - **total_tax_cost** (any): The total sales tax of the receipt.
  - **total_vat_cost** (any): A number equal to the total value-added tax (VAT) of the receipt.
  - **discount_amt** (any): The numeric total discounted price for the receipt when using a discount (percent or fixed) coupon. Free shipping coupons are not included in this discount amount.
  - **gift_wrap_price** (any): The numeric price of gift wrap for this receipt.
  - **shipments** (array): A list of shipment statements for this receipt.
  - **transactions** (array): Array of transactions for the receipt.
  - **refunds** (array): Refunds for a given receipt.
}

---

## `GET /v3/application/shops/{shop_id}/receipts/{receipt_id}/transactions`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the list of transactions associated with a specific receipt.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `receipt_id` (path): The numeric ID for the [receipt](/documentation/reference#tag/Shop-Receipt) associated to this transaction.
- `legacy` (query): This parameter needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **count** (integer): The number of ShopReceiptTransaction resources found.
  - **results** (array): The ShopReceiptTransaction resources found.
}

---

## `GET /v3/application/listings/{listing_id}/reviews`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Open API V3 to retrieve the reviews for a listing given its ID.

### Parameters
- `listing_id` (path): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.
- `min_created` (query): The earliest unix timestamp for when a record was created.
- `max_created` (query): The latest unix timestamp for when a record was created.

### Response Structure
Object {
  - **count** (integer): The number of TransactionReview resources found.
  - **results** (array): The TransactionReview resources found.
}

---

## `GET /v3/application/shops/{shop_id}/reviews`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Open API V3 to retrieve the reviews from a shop given its ID.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.
- `min_created` (query): The earliest unix timestamp for when a record was created.
- `max_created` (query): The latest unix timestamp for when a record was created.

### Response Structure
Object {
  - **count** (integer): The number of TransactionReview resources found.
  - **results** (array): The TransactionReview resources found.
}

---

## `GET /v3/application/seller-taxonomy/nodes`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the full hierarchy tree of seller taxonomy nodes.

### Response Structure
Object {
  - **count** (integer): The number of results.
  - **results** (array): The list of requested resources.
}

---

## `GET /v3/application/seller-taxonomy/nodes/{taxonomy_id}/properties`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a list of product properties, with applicable scales and values, supported for a specific seller taxonomy ID.

### Parameters
- `taxonomy_id` (path): The unique numeric ID of an Etsy taxonomy node, which is a metadata category for listings organized into the seller taxonomy hierarchy tree. For example, the "shoes" taxonomy node (ID: 1429, level: 1) is higher in the hierarchy than "girls' shoes" (ID: 1440, level: 2). The taxonomy nodes assigned to a listing support access to specific standardized product scales and properties. For example, listings assigned the taxonomy nodes "shoes" or "girls' shoes" support access to the "EU" shoe size scale with its associated property names and IDs for EU shoe sizes, such as property `value_id`:"1394", and `name`:"38".

### Response Structure
Object {
  - **count** (integer): The number of results.
  - **results** (array): The list of requested resources.
}

---

## `GET /v3/application/shipping-carriers`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a list of available shipping carriers and the mail classes associated with them for a given country

### Parameters
- `origin_country_iso` (query): The ISO code of the country from which the listing ships.

### Response Structure
Object {
  - **count** (integer): 
  - **results** (array): 
}

---

## `GET /v3/application/shops/{shop_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the shop identified by a specific shop ID.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **user_id** (integer): The numeric user ID of the [user](/documentation/reference#tag/User) who owns this shop.
  - **shop_name** (string): The shop's name string.
  - **create_date** (integer): The date and time this shop was created, in epoch seconds.
  - **created_timestamp** (integer): The date and time this shop was created, in epoch seconds.
  - **title** (string): A brief heading string for the shop's main page.
  - **announcement** (string): An announcement string to buyers that displays on the shop's homepage.
  - **currency_code** (string): The ISO (alphabetic) code for the shop's currency. The shop displays all prices in this currency by default.
  - **is_vacation** (boolean): When true, this shop is not accepting purchases.
  - **vacation_message** (string): The shop's message string displayed when `is_vacation` is true.
  - **sale_message** (string): A message string sent to users who complete a purchase from this shop.
  - **digital_sale_message** (string): A message string sent to users who purchase a digital item from this shop.
  - **update_date** (integer): The date and time of the last update to the shop, in epoch seconds.
  - **updated_timestamp** (integer): The date and time of the last update to the shop, in epoch seconds.
  - **listing_active_count** (integer): The number of active listings in the shop.
  - **digital_listing_count** (integer): The number of digital listings in the shop.
  - **login_name** (string): The shop owner's login name string.
  - **accepts_custom_requests** (boolean): When true, the shop accepts customization requests.
  - **policy_welcome** (string): The shop's policy welcome string (may be blank).
  - **policy_payment** (string): The shop's payment policy string (may be blank).
  - **policy_shipping** (string): The shop's shipping policy string (may be blank).
  - **policy_refunds** (string): The shop's refund policy string (may be blank).
  - **policy_additional** (string): The shop's additional policies string (may be blank).
  - **policy_seller_info** (string): The shop's seller information string (may be blank).
  - **policy_update_date** (integer): The date and time of the last update to the shop's policies, in epoch seconds.
  - **policy_has_private_receipt_info** (boolean): When true, EU receipts display private info.
  - **has_unstructured_policies** (boolean): When true, the shop displays additional unstructured policy fields.
  - **policy_privacy** (string): The shop's privacy policy string (may be blank).
  - **vacation_autoreply** (string): The shop's automatic reply string displayed in new conversations when `is_vacation` is true.
  - **url** (string): The URL string for this shop.
  - **image_url_760x100** (string): The URL string for this shop's banner image.
  - **num_favorers** (integer): The number of users who marked this shop a favorite.
  - **languages** (array): A list of language strings for the shop's enrolled languages where the default shop language is the first element in the array.
  - **icon_url_fullxfull** (string): The URL string for this shop's icon image.
  - **is_using_structured_policies** (boolean): When true, the shop accepted using structured policies.
  - **has_onboarded_structured_policies** (boolean): When true, the shop accepted OR declined after viewing structured policies onboarding.
  - **include_dispute_form_link** (boolean): When true, this shop's policies include a link to an EU online dispute form.
  - **is_direct_checkout_onboarded** (boolean): (**DEPRECATED: Replaced by _is_etsy_payments_onboarded_.) When true, the shop has onboarded onto Etsy Payments.
  - **is_etsy_payments_onboarded** (boolean): When true, the shop has onboarded onto Etsy Payments.
  - **is_calculated_eligible** (boolean): When true, the shop is eligible for calculated shipping profiles. (Only available in the US and Canada)
  - **is_opted_in_to_buyer_promise** (boolean): When true, the shop opted in to buyer promise.
  - **is_shop_us_based** (boolean): When true, the shop is based in the US.
  - **transaction_sold_count** (integer): The total number of sales ([transactions](/documentation/reference#tag/Shop-Receipt-Transactions)) for this shop.
  - **shipping_from_country_iso** (string): The country ISO the shop is shipping from.
  - **shop_location_country_iso** (string): The country ISO where the shop is located.
  - **review_count** (integer): Number of reviews of shop listings in the past year.
  - **review_average** (number): Average rating based on reviews of shop listings in the past year.
}

---

## `PUT /v3/application/shops/{shop_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates a shop. Assumes that all string parameters are provided in the shop's primary language. Please note that the policy_additional field should only be set for shops located in the EU. Passing a value for this field for shops outside of the EU, will result in an error.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **user_id** (integer): The numeric user ID of the [user](/documentation/reference#tag/User) who owns this shop.
  - **shop_name** (string): The shop's name string.
  - **create_date** (integer): The date and time this shop was created, in epoch seconds.
  - **created_timestamp** (integer): The date and time this shop was created, in epoch seconds.
  - **title** (string): A brief heading string for the shop's main page.
  - **announcement** (string): An announcement string to buyers that displays on the shop's homepage.
  - **currency_code** (string): The ISO (alphabetic) code for the shop's currency. The shop displays all prices in this currency by default.
  - **is_vacation** (boolean): When true, this shop is not accepting purchases.
  - **vacation_message** (string): The shop's message string displayed when `is_vacation` is true.
  - **sale_message** (string): A message string sent to users who complete a purchase from this shop.
  - **digital_sale_message** (string): A message string sent to users who purchase a digital item from this shop.
  - **update_date** (integer): The date and time of the last update to the shop, in epoch seconds.
  - **updated_timestamp** (integer): The date and time of the last update to the shop, in epoch seconds.
  - **listing_active_count** (integer): The number of active listings in the shop.
  - **digital_listing_count** (integer): The number of digital listings in the shop.
  - **login_name** (string): The shop owner's login name string.
  - **accepts_custom_requests** (boolean): When true, the shop accepts customization requests.
  - **policy_welcome** (string): The shop's policy welcome string (may be blank).
  - **policy_payment** (string): The shop's payment policy string (may be blank).
  - **policy_shipping** (string): The shop's shipping policy string (may be blank).
  - **policy_refunds** (string): The shop's refund policy string (may be blank).
  - **policy_additional** (string): The shop's additional policies string (may be blank).
  - **policy_seller_info** (string): The shop's seller information string (may be blank).
  - **policy_update_date** (integer): The date and time of the last update to the shop's policies, in epoch seconds.
  - **policy_has_private_receipt_info** (boolean): When true, EU receipts display private info.
  - **has_unstructured_policies** (boolean): When true, the shop displays additional unstructured policy fields.
  - **policy_privacy** (string): The shop's privacy policy string (may be blank).
  - **vacation_autoreply** (string): The shop's automatic reply string displayed in new conversations when `is_vacation` is true.
  - **url** (string): The URL string for this shop.
  - **image_url_760x100** (string): The URL string for this shop's banner image.
  - **num_favorers** (integer): The number of users who marked this shop a favorite.
  - **languages** (array): A list of language strings for the shop's enrolled languages where the default shop language is the first element in the array.
  - **icon_url_fullxfull** (string): The URL string for this shop's icon image.
  - **is_using_structured_policies** (boolean): When true, the shop accepted using structured policies.
  - **has_onboarded_structured_policies** (boolean): When true, the shop accepted OR declined after viewing structured policies onboarding.
  - **include_dispute_form_link** (boolean): When true, this shop's policies include a link to an EU online dispute form.
  - **is_direct_checkout_onboarded** (boolean): (**DEPRECATED: Replaced by _is_etsy_payments_onboarded_.) When true, the shop has onboarded onto Etsy Payments.
  - **is_etsy_payments_onboarded** (boolean): When true, the shop has onboarded onto Etsy Payments.
  - **is_calculated_eligible** (boolean): When true, the shop is eligible for calculated shipping profiles. (Only available in the US and Canada)
  - **is_opted_in_to_buyer_promise** (boolean): When true, the shop opted in to buyer promise.
  - **is_shop_us_based** (boolean): When true, the shop is based in the US.
  - **transaction_sold_count** (integer): The total number of sales ([transactions](/documentation/reference#tag/Shop-Receipt-Transactions)) for this shop.
  - **shipping_from_country_iso** (string): The country ISO the shop is shipping from.
  - **shop_location_country_iso** (string): The country ISO where the shop is located.
  - **review_count** (integer): Number of reviews of shop listings in the past year.
  - **review_average** (number): Average rating based on reviews of shop listings in the past year.
}

---

## `GET /v3/application/users/{user_id}/shops`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the shop identified by the shop owner's user ID.

### Parameters
- `user_id` (path): The numeric user ID of the [user](/documentation/reference#tag/User) who owns this shop.

### Response Structure
Object {
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **user_id** (integer): The numeric user ID of the [user](/documentation/reference#tag/User) who owns this shop.
  - **shop_name** (string): The shop's name string.
  - **create_date** (integer): The date and time this shop was created, in epoch seconds.
  - **created_timestamp** (integer): The date and time this shop was created, in epoch seconds.
  - **title** (string): A brief heading string for the shop's main page.
  - **announcement** (string): An announcement string to buyers that displays on the shop's homepage.
  - **currency_code** (string): The ISO (alphabetic) code for the shop's currency. The shop displays all prices in this currency by default.
  - **is_vacation** (boolean): When true, this shop is not accepting purchases.
  - **vacation_message** (string): The shop's message string displayed when `is_vacation` is true.
  - **sale_message** (string): A message string sent to users who complete a purchase from this shop.
  - **digital_sale_message** (string): A message string sent to users who purchase a digital item from this shop.
  - **update_date** (integer): The date and time of the last update to the shop, in epoch seconds.
  - **updated_timestamp** (integer): The date and time of the last update to the shop, in epoch seconds.
  - **listing_active_count** (integer): The number of active listings in the shop.
  - **digital_listing_count** (integer): The number of digital listings in the shop.
  - **login_name** (string): The shop owner's login name string.
  - **accepts_custom_requests** (boolean): When true, the shop accepts customization requests.
  - **policy_welcome** (string): The shop's policy welcome string (may be blank).
  - **policy_payment** (string): The shop's payment policy string (may be blank).
  - **policy_shipping** (string): The shop's shipping policy string (may be blank).
  - **policy_refunds** (string): The shop's refund policy string (may be blank).
  - **policy_additional** (string): The shop's additional policies string (may be blank).
  - **policy_seller_info** (string): The shop's seller information string (may be blank).
  - **policy_update_date** (integer): The date and time of the last update to the shop's policies, in epoch seconds.
  - **policy_has_private_receipt_info** (boolean): When true, EU receipts display private info.
  - **has_unstructured_policies** (boolean): When true, the shop displays additional unstructured policy fields.
  - **policy_privacy** (string): The shop's privacy policy string (may be blank).
  - **vacation_autoreply** (string): The shop's automatic reply string displayed in new conversations when `is_vacation` is true.
  - **url** (string): The URL string for this shop.
  - **image_url_760x100** (string): The URL string for this shop's banner image.
  - **num_favorers** (integer): The number of users who marked this shop a favorite.
  - **languages** (array): A list of language strings for the shop's enrolled languages where the default shop language is the first element in the array.
  - **icon_url_fullxfull** (string): The URL string for this shop's icon image.
  - **is_using_structured_policies** (boolean): When true, the shop accepted using structured policies.
  - **has_onboarded_structured_policies** (boolean): When true, the shop accepted OR declined after viewing structured policies onboarding.
  - **include_dispute_form_link** (boolean): When true, this shop's policies include a link to an EU online dispute form.
  - **is_direct_checkout_onboarded** (boolean): (**DEPRECATED: Replaced by _is_etsy_payments_onboarded_.) When true, the shop has onboarded onto Etsy Payments.
  - **is_etsy_payments_onboarded** (boolean): When true, the shop has onboarded onto Etsy Payments.
  - **is_calculated_eligible** (boolean): When true, the shop is eligible for calculated shipping profiles. (Only available in the US and Canada)
  - **is_opted_in_to_buyer_promise** (boolean): When true, the shop opted in to buyer promise.
  - **is_shop_us_based** (boolean): When true, the shop is based in the US.
  - **transaction_sold_count** (integer): The total number of sales ([transactions](/documentation/reference#tag/Shop-Receipt-Transactions)) for this shop.
  - **shipping_from_country_iso** (string): The country ISO the shop is shipping from.
  - **shop_location_country_iso** (string): The country ISO where the shop is located.
  - **review_count** (integer): Number of reviews of shop listings in the past year.
  - **review_average** (number): Average rating based on reviews of shop listings in the past year.
}

---

## `GET /v3/application/shops/{shop_id}/holiday-preferences`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a list of holidays that are available to a shop to set a preference for. Currently only supported in the US and CA

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Array of Object {
    - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
    - **holiday_id** (integer): The unique id that maps to the holiday a country observes. See the [Fulfillment Tutorial docs](https://developer.etsy.com/documentation/tutorials/fulfillment/#country-holidays) for more info
    - **country_iso** (string): The country ISO where the shop is located.
    - **is_working** (boolean): A boolean value for whether the shop will process orders on a particular holiday.
    - **holiday_name** (string): The name of the holiday that a country observes.
  }

---

## `PUT /v3/application/shops/{shop_id}/holiday-preferences/{holiday_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates the preference for whether the seller will process orders or not on the holiday. Currently only supported in the US and CA

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `holiday_id` (path): The unique id that maps to the holiday a country observes. See the [Fulfillment Tutorial docs](https://developer.etsy.com/documentation/tutorials/fulfillment/#country-holidays) for more info

### Response Structure
Object {
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **holiday_id** (integer): The unique id that maps to the holiday a country observes. See the [Fulfillment Tutorial docs](https://developer.etsy.com/documentation/tutorials/fulfillment/#country-holidays) for more info
  - **country_iso** (string): The country ISO where the shop is located.
  - **is_working** (boolean): A boolean value for whether the shop will process orders on a particular holiday.
  - **holiday_name** (string): The name of the holiday that a country observes.
}

---

## `GET /v3/application/shops`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Open API V3 endpoint for searching shops by name. Note: We make every effort to ensure that frozen or removed shops are not included in the search results. However, rarely, due to timing issues, they may appear.

### Parameters
- `shop_name` (query): The shop's name string.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.

### Response Structure
Object {
  - **count** (integer): The total number of Shops
  - **results** (array): The Shop resources.
}

---

## `POST /v3/application/shops/{shop_id}/policies/return/consolidate`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Consolidates Return Policies by moving all listings from a source return policy to a destination return policy, and deleting the source return policy. This is commonly used in the event that a user attempts to update a Return Policy such that its data is a duplicate of some other Return Policy, which is prevented.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **return_policy_id** (integer): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **accepts_returns** (boolean): return_policy_accepts_returns
  - **accepts_exchanges** (boolean): return_policy_accepts_exchanges
  - **return_deadline** (integer): The deadline for the Return Policy, measured in days. The value must be one of the following: [7, 14, 21, 30, 45, 60, 90].
}

---

## `POST /v3/application/shops/{shop_id}/policies/return`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Creates a new Return Policy. Note: if either accepts_returns or accepts_exchanges is true, then a return_deadline is required.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **return_policy_id** (integer): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **accepts_returns** (boolean): return_policy_accepts_returns
  - **accepts_exchanges** (boolean): return_policy_accepts_exchanges
  - **return_deadline** (integer): The deadline for the Return Policy, measured in days. The value must be one of the following: [7, 14, 21, 30, 45, 60, 90].
}

---

## `GET /v3/application/shops/{shop_id}/policies/return`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Returns a shop's list of existing Return Policies

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **count** (integer): 
  - **results** (array): 
}

---

## `DELETE /v3/application/shops/{shop_id}/policies/return/{return_policy_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Deletes an existing Return Policy. Deletion is only allowed for policies which have no associated listings – move them to another policy before attempting deletion.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `return_policy_id` (path): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).

## `GET /v3/application/shops/{shop_id}/policies/return/{return_policy_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves an existing Return Policy.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `return_policy_id` (path): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).

### Response Structure
Object {
  - **return_policy_id** (integer): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **accepts_returns** (boolean): return_policy_accepts_returns
  - **accepts_exchanges** (boolean): return_policy_accepts_exchanges
  - **return_deadline** (integer): The deadline for the Return Policy, measured in days. The value must be one of the following: [7, 14, 21, 30, 45, 60, 90].
}

---

## `PUT /v3/application/shops/{shop_id}/policies/return/{return_policy_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates an existing Return Policy. Note: if either accepts_returns or accepts_exchanges is true, then a return_deadline is required.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `return_policy_id` (path): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).

### Response Structure
Object {
  - **return_policy_id** (integer): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **accepts_returns** (boolean): return_policy_accepts_returns
  - **accepts_exchanges** (boolean): return_policy_accepts_exchanges
  - **return_deadline** (integer): The deadline for the Return Policy, measured in days. The value must be one of the following: [7, 14, 21, 30, 45, 60, 90].
}

---

## `GET /v3/application/shops/{shop_id}/policies/return/{return_policy_id}/listings`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Gets all listings associated with a Return Policy.

### Parameters
- `return_policy_id` (path): The numeric ID of the [Return Policy](/documentation/reference#operation/getShopReturnPolicies).
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **count** (integer): The number of ShopListing resources found.
  - **results** (array): The ShopListing resources found.
}

---

## `GET /v3/application/shops/{shop_id}/production-partners`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a list of production partners available in the specific Etsy shop identified by its shop ID.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **count** (integer): The number of results.
  - **results** (array): The list of requested resources.
}

---

## `POST /v3/application/shops/{shop_id}/readiness-state-definitions`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Creates a new ReadinessStateDefinition. If an existing definition matches the input values, this endpoint will throw a Conflict error, please refer to the Content-Location header to obtain the get endpoint url for the values of the existing definition. Does not affect the product offering-readiness states definition relationship.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **readiness_state_id** (integer): The numeric ID of the [processing profile](/documentation/reference#operation/getShopReadinessStateDefinition) associated with the listing. Returned only when the listing is `active` and of type `physical`, and the endpoint is either shop-scoped (path contains `shop_id`) or a single-listing request such as `getListing`. For every other case this field can be null.
  - **readiness_state** (string): The readiness state of a product: \"1\" means \"ready_to_ship\", and \"2\" means \"made_to_order\"
  - **min_processing_days** (integer): The minimum number of days for processing a specific product.
  - **max_processing_days** (integer): The maximum number of days for processing a specific product.
  - **processing_days_display_label** (string): Translated display label string for processing days, for example "3 - 5 days".
}

---

## `GET /v3/application/shops/{shop_id}/readiness-state-definitions`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a list of ProcessingProfiles available in the specific Etsy shop identified by its shop ID.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.

### Response Structure
Object {
  - **count** (integer): 
  - **results** (array): 
}

---

## `DELETE /v3/application/shops/{shop_id}/readiness-state-definitions/{readiness_state_definition_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Deletes a ReadinessStateDefinition by given readiness state definition ID. If there any active offerings linked to the definition, this endpoint will throw a Bad Request error. If you want to delete a ReadinessStateDefinition that is linked to active offerings, you must link the offerings to a different readiness state definition.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `readiness_state_definition_id` (path): The numeric ID of the [processing profile](/documentation/reference#operation/getShopReadinessStateDefinition) associated with the listing. Returned only when the listing is `active` and of type `physical`, and the endpoint is either shop-scoped (path contains `shop_id`) or a single-listing request such as `getListing`. For every other case this field can be null.

## `GET /v3/application/shops/{shop_id}/readiness-state-definitions/{readiness_state_definition_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a ProcessingProfile referenced by readiness state definition ID.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `readiness_state_definition_id` (path): The numeric ID of the [processing profile](/documentation/reference#operation/getShopReadinessStateDefinition) associated with the listing. Returned only when the listing is `active` and of type `physical`, and the endpoint is either shop-scoped (path contains `shop_id`) or a single-listing request such as `getListing`. For every other case this field can be null.

### Response Structure
Object {
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **readiness_state_id** (integer): The numeric ID of the [processing profile](/documentation/reference#operation/getShopReadinessStateDefinition) associated with the listing. Returned only when the listing is `active` and of type `physical`, and the endpoint is either shop-scoped (path contains `shop_id`) or a single-listing request such as `getListing`. For every other case this field can be null.
  - **readiness_state** (string): The readiness state of a product: \"1\" means \"ready_to_ship\", and \"2\" means \"made_to_order\"
  - **min_processing_days** (integer): The minimum number of days for processing a specific product.
  - **max_processing_days** (integer): The maximum number of days for processing a specific product.
  - **processing_days_display_label** (string): Translated display label string for processing days, for example "3 - 5 days".
}

---

## `PUT /v3/application/shops/{shop_id}/readiness-state-definitions/{readiness_state_definition_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates an existing ReadinessStateDefinition. If an existing definition matches the input values, this endpoint will throw a Conflict error, please refer to the Content-Location header to obtain the get endpoint url for the values of the existing definition. Does not affect the product offering-readiness states definition relationship.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `readiness_state_definition_id` (path): The numeric ID of the [processing profile](/documentation/reference#operation/getShopReadinessStateDefinition) associated with the listing. Returned only when the listing is `active` and of type `physical`, and the endpoint is either shop-scoped (path contains `shop_id`) or a single-listing request such as `getListing`. For every other case this field can be null.

### Response Structure
Object {
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
  - **readiness_state_id** (integer): The numeric ID of the [processing profile](/documentation/reference#operation/getShopReadinessStateDefinition) associated with the listing. Returned only when the listing is `active` and of type `physical`, and the endpoint is either shop-scoped (path contains `shop_id`) or a single-listing request such as `getListing`. For every other case this field can be null.
  - **readiness_state** (string): The readiness state of a product: \"1\" means \"ready_to_ship\", and \"2\" means \"made_to_order\"
  - **min_processing_days** (integer): The minimum number of days for processing a specific product.
  - **max_processing_days** (integer): The maximum number of days for processing a specific product.
  - **processing_days_display_label** (string): Translated display label string for processing days, for example "3 - 5 days".
}

---

## `POST /v3/application/shops/{shop_id}/sections`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Creates a new section in a specific shop.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **shop_section_id** (integer): The numeric ID of a section in a specific Etsy shop.
  - **title** (string): The title string for a shop section.
  - **rank** (integer): The positive non-zero numeric position of this section in the section display order for a shop, with rank 1 sections appearing first.
  - **user_id** (integer): The numeric ID of the [user](/documentation/reference#tag/User) who owns this shop section.
  - **active_listing_count** (integer): The number of active listings in one section of a specific Etsy shop.
}

---

## `GET /v3/application/shops/{shop_id}/sections`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the list of shop sections in a specific shop identified by shop ID.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **count** (integer): The number of results.
  - **results** (array): The list of requested resources.
}

---

## `DELETE /v3/application/shops/{shop_id}/sections/{shop_section_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Deletes a section in a specific shop given a valid shop_section_id.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shop_section_id` (path): The numeric ID of a section in a specific Etsy shop.

## `GET /v3/application/shops/{shop_id}/sections/{shop_section_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a shop section, referenced by section ID and shop ID.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shop_section_id` (path): The numeric ID of a section in a specific Etsy shop.

### Response Structure
Object {
  - **shop_section_id** (integer): The numeric ID of a section in a specific Etsy shop.
  - **title** (string): The title string for a shop section.
  - **rank** (integer): The positive non-zero numeric position of this section in the section display order for a shop, with rank 1 sections appearing first.
  - **user_id** (integer): The numeric ID of the [user](/documentation/reference#tag/User) who owns this shop section.
  - **active_listing_count** (integer): The number of active listings in one section of a specific Etsy shop.
}

---

## `PUT /v3/application/shops/{shop_id}/sections/{shop_section_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates a section in a specific shop given a valid shop_section_id.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shop_section_id` (path): The numeric ID of a section in a specific Etsy shop.

### Response Structure
Object {
  - **shop_section_id** (integer): The numeric ID of a section in a specific Etsy shop.
  - **title** (string): The title string for a shop section.
  - **rank** (integer): The positive non-zero numeric position of this section in the section display order for a shop, with rank 1 sections appearing first.
  - **user_id** (integer): The numeric ID of the [user](/documentation/reference#tag/User) who owns this shop section.
  - **active_listing_count** (integer): The number of active listings in one section of a specific Etsy shop.
}

---

## `GET /v3/application/shops/{shop_id}/shop-sections/listings`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves all the listings from the section of a specific shop.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shop_section_ids` (query): A list of numeric IDS for all sections in a specific Etsy shop.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.
- `sort_on` (query): The value to sort a search result of listings on. NOTES: a) `sort_on` only works when combined with one of the search options (keywords, region, etc.). b) when using `score` the returned results will always be in _descending_ order, regardless of the `sort_order` parameter.
- `sort_order` (query): The ascending(up) or descending(down) order to sort listings by. NOTE: sort_order only works when combined with one of the search options (keywords, region, etc.).
- `legacy` (query): This parameter is needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **count** (integer): The number of ShopListing resources found.
  - **results** (array): The ShopListing resources found.
}

---

## `POST /v3/application/shops/{shop_id}/shipping-profiles`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Creates a new ShippingProfile. You can pass a country iso code or a region when creating a ShippingProfile, but not both. Only one is required. You must pass either a shipping_carrier_id AND mail_class, or both min and max_delivery_days.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **shipping_profile_id** (integer): The numeric ID of the shipping profile.
  - **title** (string): The name string of this shipping profile.
  - **user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) who owns the shipping profile.
  - **origin_country_iso** (string): The ISO code of the country from which the listing ships.
  - **is_deleted** (boolean): When true, someone deleted this shipping profile.
  - **shipping_profile_destinations** (array): A list of [shipping profile destinations](/documentation/reference/#operation/createShopShippingProfileDestination) available for this shipping profile.
  - **shipping_profile_upgrades** (array): A list of [shipping profile upgrades](/documentation/reference/#operation/createShopShippingProfileUpgrade) available for this shipping profile.
  - **origin_postal_code** (string): The postal code string (not necessarily a number) for the location from which the listing ships. Required if the `origin_country_iso` supports postal codes. See the [Fulfillment Tutorial docs](https://developer.etsy.com/documentation/tutorials/fulfillment/#countries-requiring-postal-codes) for more info
  - **profile_type** (string): 
  - **domestic_handling_fee** (number): The domestic handling fee added to buyer's shipping total - only available for calculated shipping profiles.
  - **international_handling_fee** (number): The international handling fee added to buyer's shipping total - only available for calculated shipping profiles.
}

---

## `GET /v3/application/shops/{shop_id}/shipping-profiles`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a list of shipping profiles available in the specific Etsy shop identified by its shop ID.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.

### Response Structure
Object {
  - **count** (integer): 
  - **results** (array): 
}

---

## `DELETE /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Deletes a ShippingProfile by given id.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.

## `GET /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a Shipping Profile referenced by shipping profile ID.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.

### Response Structure
Object {
  - **shipping_profile_id** (integer): The numeric ID of the shipping profile.
  - **title** (string): The name string of this shipping profile.
  - **user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) who owns the shipping profile.
  - **origin_country_iso** (string): The ISO code of the country from which the listing ships.
  - **is_deleted** (boolean): When true, someone deleted this shipping profile.
  - **shipping_profile_destinations** (array): A list of [shipping profile destinations](/documentation/reference/#operation/createShopShippingProfileDestination) available for this shipping profile.
  - **shipping_profile_upgrades** (array): A list of [shipping profile upgrades](/documentation/reference/#operation/createShopShippingProfileUpgrade) available for this shipping profile.
  - **origin_postal_code** (string): The postal code string (not necessarily a number) for the location from which the listing ships. Required if the `origin_country_iso` supports postal codes. See the [Fulfillment Tutorial docs](https://developer.etsy.com/documentation/tutorials/fulfillment/#countries-requiring-postal-codes) for more info
  - **profile_type** (string): 
  - **domestic_handling_fee** (number): The domestic handling fee added to buyer's shipping total - only available for calculated shipping profiles.
  - **international_handling_fee** (number): The international handling fee added to buyer's shipping total - only available for calculated shipping profiles.
}

---

## `PUT /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Changes the settings in a shipping profile. You can pass a country iso code or a region when updating a ShippingProfile, but not both. Only one is required. You must pass either a shipping_carrier_id AND mail_class, or both min and max_delivery_days.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.

### Response Structure
Object {
  - **shipping_profile_id** (integer): The numeric ID of the shipping profile.
  - **title** (string): The name string of this shipping profile.
  - **user_id** (integer): The numeric ID for the [user](/documentation/reference#tag/User) who owns the shipping profile.
  - **origin_country_iso** (string): The ISO code of the country from which the listing ships.
  - **is_deleted** (boolean): When true, someone deleted this shipping profile.
  - **shipping_profile_destinations** (array): A list of [shipping profile destinations](/documentation/reference/#operation/createShopShippingProfileDestination) available for this shipping profile.
  - **shipping_profile_upgrades** (array): A list of [shipping profile upgrades](/documentation/reference/#operation/createShopShippingProfileUpgrade) available for this shipping profile.
  - **origin_postal_code** (string): The postal code string (not necessarily a number) for the location from which the listing ships. Required if the `origin_country_iso` supports postal codes. See the [Fulfillment Tutorial docs](https://developer.etsy.com/documentation/tutorials/fulfillment/#countries-requiring-postal-codes) for more info
  - **profile_type** (string): 
  - **domestic_handling_fee** (number): The domestic handling fee added to buyer's shipping total - only available for calculated shipping profiles.
  - **international_handling_fee** (number): The international handling fee added to buyer's shipping total - only available for calculated shipping profiles.
}

---

## `POST /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/destinations`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Creates a new shipping destination, which sets the shipping cost, carrier, and class for a destination in a [shipping profile](/documentation/reference/#tag/Shop-ShippingProfile). createShopShippingProfileDestination assigns costs using the currency of the associated shop. Set the destination using either `destination_country_iso` or `destination_region`; `destination_country_iso` and `destination_region` are mutually exclusive — set one or the other. Setting both triggers error 400. If the request sets neither `destination_country_iso` nor `destination_region`, the default destination is "everywhere". You must also either assign both a `shipping_carrier_id` AND `mail_class` or both `min_delivery_days` AND `max_delivery_days`.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.

### Response Structure
Object {
  - **shipping_profile_destination_id** (integer): The numeric ID of the shipping profile destination in the [shipping profile](/documentation/reference#tag/Shop-ShippingProfile) associated with the listing.
  - **shipping_profile_id** (integer): The numeric ID of the shipping profile.
  - **origin_country_iso** (string): The ISO code of the country from which the listing ships.
  - **destination_country_iso** (string): The ISO code of the country to which the listing ships. If null, request sets destination to destination_region. Required if destination_region is null or not provided.
  - **destination_region** (string): The code of the region to which the listing ships. A region represents a set of countries. Supported regions are Europe Union and Non-Europe Union (countries in Europe not in EU). If `none`, request sets destination to destination_country_iso. Required if destination_country_iso is null or not provided.
  - **primary_cost** (any): The cost of shipping to this country/region alone, measured in the store's default currency.
  - **secondary_cost** (any): The cost of shipping to this country/region with another item, measured in the store's default currency.
  - **shipping_carrier_id** (integer): The unique ID of a supported shipping carrier, which is used to calculate an Estimated Delivery Date. **Required with `mail_class`** if `min_delivery_days` and `max_delivery_days` are null.
  - **mail_class** (string): The unique ID string of a shipping carrier's mail class, which is used to calculate an estimated delivery date. **Required with `shipping_carrier_id`** if `min_delivery_days` and `max_delivery_days` are null.
  - **min_delivery_days** (integer): The minimum number of business days a buyer can expect to wait to receive their purchased item once it has shipped. **Required with `max_delivery_days`** if `mail_class` is null.
  - **max_delivery_days** (integer): The maximum number of business days a buyer can expect to wait to receive their purchased item once it has shipped. **Required with `min_delivery_days`** if `mail_class` is null.
}

---

## `GET /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/destinations`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a list of shipping destination objects associated with a shipping profile.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.

### Response Structure
Object {
  - **count** (integer): The number of results.
  - **results** (array): The list of requested resources.
}

---

## `DELETE /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/destinations/{shipping_profile_destination_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Deletes a shipping destination and removes the destination option from every listing that uses the associated shipping profile. A shipping profile requires at least one shipping destination, so this endpoint cannot delete the final shipping destination for any shipping profile. To delete the final shipping destination from a shipping profile, you must [delete the entire shipping profile](/documentation/reference/#operation/deleteShopShippingProfile).

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.
- `shipping_profile_destination_id` (path): The numeric ID of the shipping profile destination in the [shipping profile](/documentation/reference#tag/Shop-ShippingProfile) associated with the listing.

## `PUT /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/destinations/{shipping_profile_destination_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates an existing shipping destination, which can set or reassign the shipping cost, carrier, and class for a destination.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.
- `shipping_profile_destination_id` (path): The numeric ID of the shipping profile destination in the [shipping profile](/documentation/reference#tag/Shop-ShippingProfile) associated with the listing.

### Response Structure
Object {
  - **shipping_profile_destination_id** (integer): The numeric ID of the shipping profile destination in the [shipping profile](/documentation/reference#tag/Shop-ShippingProfile) associated with the listing.
  - **shipping_profile_id** (integer): The numeric ID of the shipping profile.
  - **origin_country_iso** (string): The ISO code of the country from which the listing ships.
  - **destination_country_iso** (string): The ISO code of the country to which the listing ships. If null, request sets destination to destination_region. Required if destination_region is null or not provided.
  - **destination_region** (string): The code of the region to which the listing ships. A region represents a set of countries. Supported regions are Europe Union and Non-Europe Union (countries in Europe not in EU). If `none`, request sets destination to destination_country_iso. Required if destination_country_iso is null or not provided.
  - **primary_cost** (any): The cost of shipping to this country/region alone, measured in the store's default currency.
  - **secondary_cost** (any): The cost of shipping to this country/region with another item, measured in the store's default currency.
  - **shipping_carrier_id** (integer): The unique ID of a supported shipping carrier, which is used to calculate an Estimated Delivery Date. **Required with `mail_class`** if `min_delivery_days` and `max_delivery_days` are null.
  - **mail_class** (string): The unique ID string of a shipping carrier's mail class, which is used to calculate an estimated delivery date. **Required with `shipping_carrier_id`** if `min_delivery_days` and `max_delivery_days` are null.
  - **min_delivery_days** (integer): The minimum number of business days a buyer can expect to wait to receive their purchased item once it has shipped. **Required with `max_delivery_days`** if `mail_class` is null.
  - **max_delivery_days** (integer): The maximum number of business days a buyer can expect to wait to receive their purchased item once it has shipped. **Required with `min_delivery_days`** if `mail_class` is null.
}

---

## `POST /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/upgrades`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Creates a new shipping profile upgrade, which can establish a price for a shipping option, such as an alternate carrier or faster delivery.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.

### Response Structure
Object {
  - **shipping_profile_id** (integer): The numeric ID of the base shipping profile.
  - **upgrade_id** (integer): The numeric ID that is associated with a shipping upgrade
  - **upgrade_name** (string): Name for the shipping upgrade shown to shoppers at checkout, e.g. USPS Priority.
  - **type** (integer): The type of the shipping upgrade. Domestic (0) or international (1).
  - **rank** (integer): The positive non-zero numeric position in the images displayed in a listing, with rank 1 images appearing in the left-most position in a listing.
  - **language** (string): The IETF language tag for the language of the shipping profile. Ex: `de`, `en`, `es`, `fr`, `it`, `ja`, `nl`, `pl`, `pt`
  - **price** (any): Additional cost of adding the shipping upgrade.
  - **secondary_price** (any): Additional cost of adding the shipping upgrade for each additional item.
  - **shipping_carrier_id** (integer): The unique ID of a supported shipping carrier, which is used to calculate an Estimated Delivery Date. **Required with `mail_class`** if `min_delivery_days` and `max_delivery_days` are null.
  - **mail_class** (string): The unique ID string of a shipping carrier's mail class, which is used to calculate an estimated delivery date. **Required with `shipping_carrier_id`** if `min_delivery_days` and `max_delivery_days` are null.
  - **min_delivery_days** (integer): The minimum number of business days a buyer can expect to wait to receive their purchased item once it has shipped. **Required with `max_delivery_days`** if `mail_class` is null.
  - **max_delivery_days** (integer): The maximum number of business days a buyer can expect to wait to receive their purchased item once it has shipped. **Required with `min_delivery_days`** if `mail_class` is null.
}

---

## `GET /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/upgrades`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the list of shipping profile upgrades assigned to a specific shipping profile.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.

### Response Structure
Object {
  - **count** (integer): The number of results.
  - **results** (array): The list of requested resources.
}

---

## `DELETE /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/upgrades/{upgrade_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Deletes a shipping profile upgrade and removes the upgrade option from every listing that uses the associated shipping profile.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the shipping profile.
- `upgrade_id` (path): The numeric ID that is associated with a shipping upgrade

## `PUT /v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/upgrades/{upgrade_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Updates a shipping profile upgrade and updates any listings that use the shipping profile.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `shipping_profile_id` (path): The numeric ID of the [shipping profile](/documentation/reference#operation/getShopShippingProfile) associated with the listing. Required when listing type is `physical`.
- `upgrade_id` (path): The numeric ID that is associated with a shipping upgrade

### Response Structure
Object {
  - **shipping_profile_id** (integer): The numeric ID of the base shipping profile.
  - **upgrade_id** (integer): The numeric ID that is associated with a shipping upgrade
  - **upgrade_name** (string): Name for the shipping upgrade shown to shoppers at checkout, e.g. USPS Priority.
  - **type** (integer): The type of the shipping upgrade. Domestic (0) or international (1).
  - **rank** (integer): The positive non-zero numeric position in the images displayed in a listing, with rank 1 images appearing in the left-most position in a listing.
  - **language** (string): The IETF language tag for the language of the shipping profile. Ex: `de`, `en`, `es`, `fr`, `it`, `ja`, `nl`, `pl`, `pt`
  - **price** (any): Additional cost of adding the shipping upgrade.
  - **secondary_price** (any): Additional cost of adding the shipping upgrade for each additional item.
  - **shipping_carrier_id** (integer): The unique ID of a supported shipping carrier, which is used to calculate an Estimated Delivery Date. **Required with `mail_class`** if `min_delivery_days` and `max_delivery_days` are null.
  - **mail_class** (string): The unique ID string of a shipping carrier's mail class, which is used to calculate an estimated delivery date. **Required with `shipping_carrier_id`** if `min_delivery_days` and `max_delivery_days` are null.
  - **min_delivery_days** (integer): The minimum number of business days a buyer can expect to wait to receive their purchased item once it has shipped. **Required with `max_delivery_days`** if `mail_class` is null.
  - **max_delivery_days** (integer): The maximum number of business days a buyer can expect to wait to receive their purchased item once it has shipped. **Required with `min_delivery_days`** if `mail_class` is null.
}

---

## `POST /v3/application/scopes`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Check the scopes of the provided token

### Response Structure
Object {
}

---

## `GET /v3/application/shops/{shop_id}/transactions/{transaction_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a transaction by transaction ID.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `transaction_id` (path): The unique numeric ID for a transaction.

### Response Structure
Object {
  - **transaction_id** (integer): The unique numeric ID for a transaction.
  - **title** (string): The title string of the [listing](/documentation/reference#tag/ShopListing) purchased in this transaction.
  - **description** (string): The description string of the [listing](/documentation/reference#tag/ShopListing) purchased in this transaction.
  - **seller_user_id** (integer): The numeric user ID for the seller in this transaction.
  - **buyer_user_id** (integer): The numeric user ID for the buyer in this transaction.
  - **create_timestamp** (integer): The transaction's creation date and time, in epoch seconds.
  - **created_timestamp** (integer): The transaction's creation date and time, in epoch seconds.
  - **paid_timestamp** (integer): The transaction's paid date and time, in epoch seconds.
  - **shipped_timestamp** (integer): The transaction's shipping date and time, in epoch seconds.
  - **quantity** (integer): The numeric quantity of products purchased in this transaction.
  - **listing_image_id** (integer): The numeric ID of the primary [listing image](/documentation/reference#tag/ShopListing-Image) for this transaction.
  - **receipt_id** (integer): The numeric ID for the [receipt](/documentation/reference#tag/Shop-Receipt) associated to this transaction.
  - **is_digital** (boolean): When true, the transaction recorded the purchase of a digital listing.
  - **file_data** (string): A string describing the files purchased in this transaction.
  - **listing_id** (integer): The numeric ID for the [listing](/documentation/reference#tag/ShopListing) associated to this transaction.
  - **transaction_type** (string): The type string for the transaction, usually "listing".
  - **product_id** (integer): The numeric ID for a specific [product](/documentation/reference#tag/ShopListing-Product) purchased from a listing.
  - **sku** (string): The SKU string for the product
  - **price** (any): A money object representing the price recorded the transaction.
  - **shipping_cost** (any): A money object representing the shipping cost for this transaction.
  - **variations** (array): Array of variations and personalizations the buyer chose.
  - **product_data** (array): A list of property value entries for this product. Note: parenthesis characters (`(` and `)`) are not allowed.
  - **shipping_profile_id** (integer): The ID of the shipping profile selected for this listing.
  - **min_processing_days** (integer): The minimum number of days for processing the listing.
  - **max_processing_days** (integer): The maximum number of days for processing the listing.
  - **shipping_method** (string): Name of the selected shipping method.
  - **shipping_upgrade** (string): The name of the shipping upgrade selected for this listing. Default value is null.
  - **expected_ship_date** (integer): The date & time of the expected ship date, in epoch seconds.
  - **buyer_coupon** (number): The amount of the buyer coupon that was discounted in the shop's currency.
  - **shop_coupon** (number): The amount of the shop coupon that was discounted in the shop's currency.
}

---

## `GET /v3/application/shops/{shop_id}/transactions`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves the list of transactions associated with a shop.

### Parameters
- `shop_id` (path): The unique positive non-zero numeric ID for an Etsy Shop.
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.
- `legacy` (query): This parameter needed to enable new parameters and response values related to processing profiles.

### Response Structure
Object {
  - **count** (integer): The number of ShopReceiptTransaction resources found.
  - **results** (array): The ShopReceiptTransaction resources found.
}

---

## `DELETE /v3/application/user/addresses/{user_address_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Open API V3 endpoint to delete a UserAddress for a User.

### Parameters
- `user_address_id` (path): The numeric ID of the user's address.

## `GET /v3/application/user/addresses/{user_address_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Open API V3 endpoint to retrieve a UserAddress for a User.

### Parameters
- `user_address_id` (path): The numeric ID of the user's address.

### Response Structure
Object {
  - **user_address_id** (integer): The numeric ID of the user's address.
  - **user_id** (integer): The user's numeric ID.
  - **name** (string): The user's name for this address.
  - **first_line** (string): The first line of the user's address.
  - **second_line** (string): The second line of the user's address.
  - **city** (string): The city field of the user's address.
  - **state** (string): The state field of the user's address.
  - **zip** (string): The zip code field of the user's address.
  - **iso_country_code** (string): The ISO code of the country in this address.
  - **country_name** (string): The name of the user's country.
  - **is_default_shipping_address** (boolean): Is this the user's default shipping address.
}

---

## `GET /v3/application/user/addresses`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Open API V3 endpoint to retrieve UserAddresses for a User.

### Parameters
- `limit` (query): The maximum number of results to return.
- `offset` (query): The number of records to skip before selecting the first result.

### Response Structure
Object {
  - **count** (integer): The number of UserAddress records being returned.
  - **results** (array): An array of UserAddress resources.
}

---

## `GET /v3/application/users/{user_id}`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Retrieves a user profile based on a unique user ID.                 Access is limited to profiles of the authenticated user                 or linked buyers. For the primary_email field, specific                 app-based permissions are required and granted case-by-case.

### Parameters
- `user_id` (path): 

### Response Structure
Object {
  - **user_id** (integer): The numeric ID of a user. This number is also a valid shop ID for the user's shop.
  - **primary_email** (string): An email address string for the user's primary email address. Access to this field is granted on a case by case basis for third-party integrations that require full access
  - **first_name** (string): The user's first name.
  - **last_name** (string): The user's last name.
  - **image_url_75x75** (string): The user's avatar URL.
}

---

## `GET /v3/application/users/me`
**Summary:** 

**Description:** <div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><span class="wt-badge wt-badge--notificationPrimary wt-bg-slime-tint wt-mr-xs-2">General Release</span><a class="wt-text-link" href="https://github.com/etsy/open-api/discussions" target="_blank" rel="noopener noreferrer">Report bug</a></div><div class="wt-display-flex-xs wt-align-items-center wt-mt-xs-2 wt-mb-xs-3"><p class="wt-text-body-01 banner-text">This endpoint is ready for production use.</p></div>

Returns basic info for the user making the request.

### Response Structure
Object {
  - **user_id** (integer): The numeric ID of a user. This number is also a valid shop ID for the user's shop.
  - **shop_id** (integer): The unique positive non-zero numeric ID for an Etsy Shop.
}

---

