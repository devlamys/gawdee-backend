import axios from "axios";
import aws4 from "aws4";
import qs from "qs";

let cachedAccessToken = null;
let tokenExpiryTime = 0;

export const getAmazonAccessToken = async () => {
  if (cachedAccessToken && Date.now() < tokenExpiryTime) {
    return cachedAccessToken;
  }

  const tokenUrl = "https://api.amazon.com/auth/o2/token";

  const body = qs.stringify({
    grant_type: "refresh_token",
    refresh_token: process.env.AMAZON_REFRESH_TOKEN,
    client_id: process.env.AMAZON_LWA_CLIENT_ID,
    client_secret: process.env.AMAZON_LWA_CLIENT_SECRET,
  });

  const response = await axios.post(tokenUrl, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  cachedAccessToken = response.data.access_token;
  tokenExpiryTime = Date.now() + (Number(response.data.expires_in || 3600) - 300) * 1000;

  return cachedAccessToken;
};

const buildQueryString = (query = {}) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else {
      params.append(key, value);
    }
  });

  return params.toString();
};

export const amazonRequest = async ({ method = "GET", path, query = {}, body = null }) => {
  const accessToken = await getAmazonAccessToken();

  const host = process.env.AMAZON_SP_API_HOST || "sellingpartnerapi-eu.amazon.com";
  const baseUrl = process.env.AMAZON_SP_API_BASE_URL || `https://${host}`;
  const region = process.env.AMAZON_REGION || "eu-west-1";

  const queryString = buildQueryString(query);
  const fullPath = queryString ? `${path}?${queryString}` : path;
  const bodyString = body ? JSON.stringify(body) : undefined;

  const requestOptions = {
    host,
    path: fullPath,
    method,
    service: "execute-api",
    region,
    headers: {
      host,
      "x-amz-access-token": accessToken,
      "content-type": "application/json",
    },
    body: bodyString,
  };

  aws4.sign(requestOptions, {
    accessKeyId: process.env.AMAZON_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AMAZON_AWS_SESSION_TOKEN || undefined,
  });

  const response = await axios({
    method,
    url: `${baseUrl}${fullPath}`,
    headers: requestOptions.headers,
    data: bodyString,
    timeout: 30000,
  });

  return response.data;
};
