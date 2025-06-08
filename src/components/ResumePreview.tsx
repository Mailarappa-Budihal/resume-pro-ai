
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ResumePreviewProps {
  file: File;
}

export const ResumePreview = ({ file }: ResumePreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  useEffect(() => {
    if (pdfUrl && canvasRef && file.type.includes('pdf')) {
      renderPDF();
    } else if (file.name.endsWith('.docx')) {
      setIsLoading(false);
    }
  }, [pdfUrl, currentPage, scale, canvasRef]);

  const renderPDF = async () => {
    if (!pdfUrl || !canvasRef) return;

    setIsLoading(true);
    setError('');

    try {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      setTotalPages(pdf.numPages);

      const page = await pdf.getPage(currentPage);
      const viewport = page.getViewport({ scale });

      const context = canvasRef.getContext('2d');
      if (!context) {
        throw new Error('Could not get canvas context');
      }

      canvasRef.height = viewport.height;
      canvasRef.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
      setIsLoading(false);
    } catch (err) {
      console.error('Error rendering PDF:', err);
      setError('Failed to load PDF preview. Please ensure the file is a valid PDF.');
      setIsLoading(false);
    }
  };

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

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

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
            <Button onClick={zoomOut} size="sm" variant="outline" disabled={isLoading}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-16 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button onClick={zoomIn} size="sm" variant="outline" disabled={isLoading}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button onClick={downloadFile} size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Page Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                size="sm"
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isLoading}
                size="sm"
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}

          {/* PDF Canvas Container */}
          <div className="border-2 border-gray-200 rounded-lg overflow-auto bg-gray-50 flex justify-center min-h-[500px] relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-700 font-medium">Loading PDF preview...</p>
                  <p className="text-gray-500 text-sm">Please wait while we render your resume</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex items-center justify-center h-96 w-full">
                <div className="text-center max-w-md">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-700 mb-2">Preview Error</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                    Try Again
                  </Button>
                </div>
              </div>
            )}
            
            <canvas
              ref={setCanvasRef}
              className={`max-w-full shadow-lg bg-white ${isLoading || error ? 'hidden' : ''}`}
              style={{ 
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                borderRadius: '8px',
                margin: '20px'
              }}
            />
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
