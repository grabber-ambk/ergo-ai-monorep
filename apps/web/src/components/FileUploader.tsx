// apps/web/src/components/FileUploader.tsx
'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, FileCheck, RefreshCw, X } from 'lucide-react';
import { useTranslation } from '@ergo-ai/i18n/src/client';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
    selectedFile: File | null;
    onRemoveFile?: () => void;
    accept?: string;
    maxSizeMB?: number;
}

export function FileUploader({
                                 onFileSelect,
                                 isProcessing,
                                 selectedFile,
                                 onRemoveFile,
                                 accept = '.pdf',
                                 maxSizeMB = 10,
                             }: FileUploaderProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndProcessFile(e.target.files[0]);
        }
    };

    const validateAndProcessFile = (file: File) => {
        setError(null);

        // Check file type
        const fileType = file.name.split('.').pop()?.toLowerCase();
        const acceptedTypes = accept.split(',').map(type =>
            type.trim().replace('.', '').toLowerCase()
        );

        if (fileType && !acceptedTypes.includes(fileType)) {
            setError(`Apenas arquivos ${accept} são aceitos`);
            return;
        }

        // Check file size
        if (file.size > maxSizeBytes) {
            setError(`O arquivo excede o limite de ${maxSizeMB}MB`);
            return;
        }

        // Pass the file to parent component
        onFileSelect(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndProcessFile(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onRemoveFile?.();
    };

    return (
        <div className="w-full">
            <div
                className={`w-full h-64 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : ''} 
          ${isProcessing ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}
          ${error ? 'border-red-400 bg-red-50' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isProcessing ? (
                    <div className="flex flex-col items-center">
                        <RefreshCw size={56} className="text-blue-500 mb-4 animate-spin" />
                        <p className="text-gray-800 font-medium text-xl">{t('processingFile')}</p>
                        {selectedFile && (
                            <p className="text-gray-500 mt-2">
                                {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                            </p>
                        )}
                    </div>
                ) : selectedFile ? (
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <FileCheck size={56} className="text-green-500 mb-4" />
                            {!isProcessing && (
                                <button
                                    onClick={handleRemoveFile}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <p className="text-gray-800 font-semibold text-xl">{selectedFile.name}</p>
                        <p className="text-gray-500 text-lg mt-2">{Math.round(selectedFile.size / 1024)} KB</p>
                    </div>
                ) : (
                    <>
                        <Upload size={56} className="text-blue-400 mb-4" />
                        <p className="text-gray-600 text-center mb-6 text-lg">
                            {t('dragDrop')}{' '}
                            <label className="text-blue-500 font-medium cursor-pointer hover:text-blue-700 transition-colors">
                                {t('browse')}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept={accept}
                                />
                            </label>
                        </p>
                        <p className="text-sm text-gray-500">{accept.toUpperCase()} (max. {maxSizeMB}MB)</p>
                    </>
                )}

                {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            </div>
        </div>
    );
}
