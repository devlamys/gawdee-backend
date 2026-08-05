# Amazon SP-API Integration Added

This backend is Express + MongoDB/Mongoose with ES Modules.

## Added files

```txt
src/models/amazonOrder.model.js
src/services/amazon.client.js
src/services/amazon.service.js
src/services/amazon.cron.js
src/controllers/amazon.controller.js
src/routes/amazon.routes.js
```

## Modified files

```txt
package.json
config.env
src/models/product.model.js
src/routes/index.routes.js
src/index.js
```

## Install new packages

```bash
npm install aws4 qs
```

## Fill these values in config.env

```env
AMAZON_CRON_ENABLED=false
AMAZON_LWA_CLIENT_ID=
AMAZON_LWA_CLIENT_SECRET=
AMAZON_REFRESH_TOKEN=
AMAZON_AWS_ACCESS_KEY_ID=
AMAZON_AWS_SECRET_ACCESS_KEY=
AMAZON_AWS_SESSION_TOKEN=
AMAZON_SELLER_ID=
AMAZON_MARKETPLACE_ID=A21TJRUUN4KGV
AMAZON_REGION=eu-west-1
AMAZON_SP_API_HOST=sellingpartnerapi-eu.amazon.com
AMAZON_SP_API_BASE_URL=https://sellingpartnerapi-eu.amazon.com
AMAZON_DEFAULT_PRODUCT_TYPE=PRODUCT
```

## API endpoints

Base URL:

```txt
/api/v2/admin/amazon
```

### Test connection

```http
GET /api/v2/admin/amazon/test
```

### Sync Amazon orders into MongoDB

```http
POST /api/v2/admin/amazon/orders/sync?days=7
```

### Get synced Amazon orders from MongoDB

```http
GET /api/v2/admin/amazon/orders?page=1&limit=20
```

### Save Amazon details in product

```http
POST /api/v2/admin/amazon/products/:productId/ready
Content-Type: application/json

{
  "sellerSku": "YOUR-SKU",
  "asin": "",
  "productType": "PRODUCT",
  "syncEnabled": true
}
```

### Update product inventory on Amazon

```http
POST /api/v2/admin/amazon/products/:productId/inventory
```

### Update product price on Amazon

```http
POST /api/v2/admin/amazon/products/:productId/price
```

## Important note

Product creation/listing is category-specific in Amazon. First complete:

1. Test connection
2. Order sync
3. Inventory sync
4. Price sync
5. Then product listing creation with category-specific Product Type Definitions
