import { useState } from 'react';
import { useAuth } from 'wasp/client/auth';
import { uploadFileWithProgress } from './fileUploading';

export default function FileUploadPage() {
  const { data: user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const result = await uploadFileWithProgress({
        file: file as any, // Type assertion for now
        setUploadProgressPercent: setUploadProgress,
      });

      // For now, we'll just show success without a URL since the response structure may vary
      setUploadedFileUrl('File uploaded successfully');
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-bordeaux-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-bordeaux-900 mb-4">
            Please log in to upload files
          </h1>
          <p className="text-bordeaux-700">
            You need to be authenticated to access this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-bordeaux-50">
      <div className="container-xl py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-bordeaux-900 mb-6">
            File Upload
          </h1>
          <p className="text-xl text-bordeaux-700 mb-8">
            Upload your files securely to our platform
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="border-2 border-dashed border-bordeaux-200 rounded-lg p-8 mb-6">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block text-center"
              >
                <div className="text-bordeaux-600 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-bordeaux-900 font-medium">
                  {file ? file.name : 'Click to select a file'}
                </p>
                <p className="text-bordeaux-600 text-sm mt-2">
                  PNG, JPG, PDF, DOC up to 10MB
                </p>
              </label>
            </div>

            {file && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-bordeaux-900">
                    {file.name}
                  </span>
                  <span className="text-sm text-bordeaux-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="w-full bg-bordeaux-100 rounded-full h-2">
                  <div
                    className="bg-bordeaux-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            {uploadedFileUrl && (
              <div className="mb-6 p-4 bg-green-100 text-green-600 rounded-lg">
                <p className="font-medium">Upload successful!</p>
                <a
                  href={uploadedFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline hover:text-green-800"
                >
                  View uploaded file
                </a>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-bordeaux-600 text-white py-3 px-6 rounded-lg hover:bg-bordeaux-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
