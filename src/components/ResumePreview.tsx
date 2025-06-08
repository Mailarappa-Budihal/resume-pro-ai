
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ZoomIn, ZoomOut } from 'lucide-react';
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
    if (pdfUrl && canvasRef) {
      renderPDF();
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
      if (!context) return;

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
      setError('Failed to load PDF preview');
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

  if (file.type.includes('docx')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              DOCX preview is not available. The document will be processed when you click "Extract Data with AI".
            </p>
            <Button onClick={downloadFile} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resume Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={zoomOut} size="sm" variant="outline">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-16 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button onClick={zoomIn} size="sm" variant="outline">
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
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                size="sm"
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                size="sm"
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}

          {/* PDF Canvas */}
          <div className="border rounded-lg overflow-auto max-h-96 bg-gray-50 flex justify-center">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading preview...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}
            <canvas
              ref={setCanvasRef}
              className={`max-w-full ${isLoading || error ? 'hidden' : ''}`}
              style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
