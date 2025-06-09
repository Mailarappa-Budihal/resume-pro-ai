
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Download, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PortfolioPreviewProps {
  portfolioData: {
    html: string;
    css: string;
    previewUrl: string;
  };
  onClose: () => void;
  onDownload: () => void;
}

export const PortfolioPreview = ({ portfolioData, onClose, onDownload }: PortfolioPreviewProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup the blob URL when component unmounts
      if (portfolioData.previewUrl) {
        URL.revokeObjectURL(portfolioData.previewUrl);
      }
    };
  }, [portfolioData.previewUrl]);

  const openInNewTab = () => {
    window.open(portfolioData.previewUrl, '_blank');
  };

  const PreviewContent = () => (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="ml-3 text-sm text-gray-600 font-mono">Portfolio Preview</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openInNewTab}
            className="flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1"
          >
            <Maximize2 className="w-4 h-4" />
            Fullscreen
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onDownload}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading portfolio preview...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={portfolioData.previewUrl}
          className="w-full h-[600px]"
          title="Portfolio Preview"
          onLoad={() => setIframeLoaded(true)}
          style={{ 
            border: 'none',
            opacity: iframeLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>

      {/* Preview Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Portfolio Preview Ready</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• This is a live preview of your generated portfolio website</li>
              <li>• The portfolio is fully responsive and optimized for all devices</li>
              <li>• Click "Download" to get the complete HTML/CSS package</li>
              <li>• You can host this portfolio on any web hosting service</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <ExternalLink className="w-5 h-5" />
              Portfolio Preview
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-blue-700 hover:bg-blue-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PreviewContent />
        </CardContent>
      </Card>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-7xl w-full h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Portfolio Preview - Fullscreen
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <iframe
              src={portfolioData.previewUrl}
              className="w-full h-full border border-gray-200 rounded-lg"
              title="Portfolio Preview Fullscreen"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
