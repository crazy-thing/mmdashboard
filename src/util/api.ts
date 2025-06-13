import { ModpackType } from "../types/Modpack";

export const getAllModpacks = async (baseUrl: string) => {
  try {
    const res = await fetch(baseUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch all modpacks: ${res.status}`);
    }
    const data = await res.json();
    return data as ModpackType[];
  } catch (error) {
    console.error("Error fetching all modpacks:", error);
    throw error;
  }
};

export const createTemplateModpack = async (apiUrl: string, apiToken: string) => {
  const response = await fetch(`${apiUrl}/template`, {
    method: 'POST',
    headers: {
      'x-api-key': apiToken,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to create modpack template');
  }

  const data = await response.json();
  return data.modpack;
};

export const deleteModpack = async (
  modpackId: string,
  baseUrl: string,
  apiKey: string
) => {
  try {
    const res = await fetch(`${baseUrl}/${modpackId}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete modpack with ID: ${modpackId}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error deleting modpack:', error);
    throw error;
  }
};

export const uploadFile = async (
  file: File,
  apiUrl: string,
  apiKey: string,
  filename?: string
): Promise<string> => {
  const formData = new FormData();
  formData.append(filename as string, file);

  const res = await fetch(`${apiUrl}/upload`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload file');
  }

  const data = await res.json();
  return data.filename;
};

export const uploadZip = async (
  zipFile: File,
  apiUrl: string,
  apiKey: string
): Promise<string> => {
  const formData = new FormData();
  formData.append('zip', zipFile);

  const res = await fetch(`${apiUrl}/upload-zip`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload zip file');
  }

  const data = await res.json();
  return data.filename;
};

export const uploadZipChunk = async (
  apiUrl: string,
  apiKey: string,
  chunk: Blob,
  fileName: string,
  chunkIndex: number,
  totalChunks: number
) => {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('fileName', fileName);
  formData.append('chunkIndex', chunkIndex.toString());
  formData.append('totalChunks', totalChunks.toString());

  const response = await fetch(`${apiUrl}/upload-zip`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload chunk ${chunkIndex}`);
  }
};

export const editModpack = async (
  modpackId: string,
  updatedFields: any,
  baseUrl: string,
  apiKey: string
) => {
    console.log('Editing modpack:', modpackId, updatedFields);
  try {
    const res = await fetch(`${baseUrl}/${modpackId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
      throw new Error(`Failed updating modpack: ${res.statusText}`);
    }

    const data = await res.json();
    return { response: data, updatedModpack: data.modpack };
  } catch (error) {
    console.error('Error updating modpack:', error);
    throw error;
  }
};
