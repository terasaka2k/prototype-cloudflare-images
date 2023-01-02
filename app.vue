<template>
  <div class="m-4">
    <!-- https://tailwindcss.com/docs/hover-focus-and-other-states#file-input-buttons -->
    <div class="flex items-center space-x-6">
      <div class="shrink-0">
        <img class="h-16 w-16 object-cover rounded-full" :src="imageUrl" alt="Current profile photo" />
      </div>
      <label class="block">
        <input @click="refreshUploadUrl" @change="startUpload" type="file" name="file" accept="image/*" class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    " />
      </label>
    </div>
    <div class="mt-10">
      <code class="block bg-slate-100 m-4 whitespace-pre-line font-mono text-xs">{{ imageUrl }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
const { public: { CF_IMAGE_DELIVERY_URL_BASE } } = useRuntimeConfig();
console.assert(CF_IMAGE_DELIVERY_URL_BASE, 'CF_IMAGE_DELIVERY_URL_BASE is missing.');

// Profile image
const imageUrl = ref("https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80");

function makeProfileImageUrl(imageId: string) {
  const variant = 'profile';
  return `${CF_IMAGE_DELIVERY_URL_BASE}/${imageId}/${variant}`;
}


// User input
const userFile = ref<File | null>(null);

// Uploader
const { data: uploader, refresh: refreshUploadUrl } = await useFetch('/api/images/upload-url', { method: 'GET', immediate: false });

const uploaderUrl = computed(() => uploader.value?.url);
const uploadingData = computed(() => {
  const file = userFile.value;
  if (!file) {
    return null;
  }

  const unnamedFile = cloneAsUnnamed(file);

  const body = new FormData();
  body.append('file', unnamedFile);
  return body;
});

// Upload
watch(uploadingData, async (body) => {
  const uploaderUrl = uploader.value?.url;
  if (!uploaderUrl) {
    throw new Error('Upload url is not yet available. seems timeout occurred.');
  }

  if (!body) {
    return;
  }

  const res = await $fetch<typeof SAMPLE_RES>(uploaderUrl, {
    method: 'POST',
    body,
  });

  console.assert(res.success);
  console.assert(res.result.variants.length > 0);
  const imageId = res.result.id;

  imageUrl.value = makeProfileImageUrl(imageId);
});


/*************************************/

function cloneAsUnnamed(file: File) {
  const hint = (new Date).toISOString();
  const suffix = file.name.substring(file.name.lastIndexOf('.')); // e.g. img.png -> '.png'

  return new File([file], /*hide filename*/`profile-image:date=${hint}` + suffix, { type: file.type });
}

async function startUpload(event: Event) {
  const elem = (event.target as HTMLInputElement)

  if (elem.files?.length) {
    const file = elem.files[0];
    userFile.value = file;
  }
}


const SAMPLE_RES = {
  "result": {
    "id": "6b7112d1-165e-4b8d-528e-728389b93900",
    "filename": "profile-image:date=2023-01-02T18:02:08.951Z.jpg",
    "uploaded": "2023-01-02T18:02:05.065Z",
    "requireSignedURLs": false,
    "variants": [
      "https://imagedelivery.net/Te5DKOKLSg46XNmpq00GDA/6b7112d1-165e-4b8d-528e-728389b93900/profile",
      "https://imagedelivery.net/Te5DKOKLSg46XNmpq00GDA/6b7112d1-165e-4b8d-528e-728389b93900/public"
    ]
  },
  "success": true,
  "errors": [],
  "messages": []
};
</script>
