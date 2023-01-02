const runtimeConfig = useRuntimeConfig();
const { CF_ACCOUNT_ID, CF_API_TOKEN } = runtimeConfig;
console.assert(CF_ACCOUNT_ID && CF_API_TOKEN, 'CF_ACCOUNT_ID and CF_API must be set in .env file');


const SAMPLE = {
  "result": { "id": "2cdc28f0-017a-49c4-9ed7-87056c83901", "uploadURL": "https://upload.imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901" }, "result_info": null, "success": true, "errors": [], "messages": []
};


/**
 * see https://developers.cloudflare.com/images/cloudflare-images/upload-images/direct-creator-upload/
 */
export default defineEventHandler(async (event) => {
  const body = new FormData();
  body.append('requireSignedURLs', 'false');
  //data.append('expiry', .../*defaults to Now+30minutes*/);

  const res = await $fetch<typeof SAMPLE>(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v2/direct_upload`, {
    method: 'POST',
    headers: {
      // NOTE: must NOT set 'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${CF_API_TOKEN}`,
    },
    body,
  });

  if (!res.success) {
    throw new Error(JSON.stringify(res));
  }
  return { url: res.result.uploadURL };
});
