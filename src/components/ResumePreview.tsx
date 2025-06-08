
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, AlertCircle, ExternalLink } from 'lucide-react';

interface ResumePreviewProps {
  file: File;
}

export const ResumePreview = ({ file }: ResumePreviewProps) => {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setIsLoading(false);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const downloadFile = () => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openInNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  if (file.name.endsWith('.docx')) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <FileText className="w-5 h-5" />
            DOCX Document Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">{file.name}</h3>
            <p className="text-blue-700 mb-6 max-w-md mx-auto">
              DOCX files cannot be previewed in the browser. Click "Extract Data with AI" to process the document and extract your professional information.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={downloadFile} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            PDF Resume Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={openInNewTab} size="sm" variant="outline">
              <ExternalLink className="w-4 h-4 mr-1" />
              Open in New Tab
            </Button>
            <Button onClick={downloadFile} size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* PDF Viewer */}
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 min-h-[600px] relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-700 font-medium">Loading PDF preview...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex items-center justify-center h-96 w-full">
                <div className="text-center max-w-md">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-700 mb-2">Preview Error</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={openInNewTab} variant="outline" size="sm">
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
            
            {fileUrl && !isLoading && !error && (
              <iframe
                src={fileUrl}
                className="w-full h-[600px]"
                title="PDF Preview"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setError('Unable to preview PDF in browser. Please download or open in a new tab.');
                  setIsLoading(false);
                }}
              />
            )}
          </div>

          {/* File Info */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">{file.name}</p>
                <p className="text-sm text-blue-700">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700">Ready for AI processing</p>
              <p className="text-xs text-blue-600">Click "Extract Data with AI" to continue</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
