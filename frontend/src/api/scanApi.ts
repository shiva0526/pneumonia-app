// frontend/src/api/scanApi.ts
import apiClient from './apiClient';

// 1. Move the interface here from Upload.tsx
export interface PredictionResult {
  prediction: string;
  confidence: number;
}

// 2. Create a dedicated function for the API call
export const analyzeImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // 3. Use the apiClient, and only provide the path
    const response = await apiClient.post<PredictionResult>(
      '/scan/predict', // <-- Notice, no more full URL!
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    // 4. Return the data directly
    return response.data;
  } catch (error) {
    console.error("Error in analyzeImageApi:", error);
    // 5. Re-throw the error so the component can catch it
    throw error;
  }
};