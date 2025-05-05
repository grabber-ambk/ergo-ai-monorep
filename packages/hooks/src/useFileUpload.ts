// packages/hooks/src/useFileUpload.ts
import { useState } from 'react';
// Atualizar a importação para usar o pacote i18n em vez de @/lib/i18n/client
import { useTranslation, useLocale } from '@ergo-ai/i18n';

interface FileUploadResult {
    success: boolean;
    data?: any;
    error?: string;
}

export function useFileUpload() {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [result, setResult] = useState<FileUploadResult | null>(null);

    const resetUpload = () => {
        setFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        setResult(null);
    };

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setResult(null);
    };

    const uploadAndAnalyze = async (): Promise<FileUploadResult> => {
        if (!file) {
            return { success: false, error: 'No file selected' };
        }

        try {
            setIsUploading(true);
            setUploadProgress(0);

            // Create form data
            const formData = new FormData();
            formData.append('file', file);

            // Create upload request with progress monitoring
            const xhr = new XMLHttpRequest();

            // Set up progress monitoring
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(progress);
                }
            });

            // Create promise to handle async XHR
            const uploadPromise = new Promise<FileUploadResult>((resolve, reject) => {
                xhr.open('POST', '/api/analyze-contract');
                xhr.setRequestHeader('x-locale', locale);

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const data = JSON.parse(xhr.responseText);
                        resolve({ success: true, data });
                    } else {
                        let errorMessage = 'Upload failed';
                        try {
                            const errorResponse = JSON.parse(xhr.responseText);
                            errorMessage = errorResponse.error || errorMessage;
                        } catch (e) {
                            // If parsing fails, use default error message
                        }
                        reject(new Error(errorMessage));
                    }
                };

                xhr.onerror = () => {
                    reject(new Error('Network error'));
                };

                xhr.send(formData);
            });

            // Wait for upload to complete
            const uploadResult = await uploadPromise;

            // Set the result
            setResult(uploadResult);
            return uploadResult;
        } catch (error) {
            const errorResult = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
            setResult(errorResult);
            return errorResult;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        file,
        isUploading,
        uploadProgress,
        result,
        handleFileSelect,
        uploadAndAnalyze,
        resetUpload,
    };
}
