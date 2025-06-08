
import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, Loader2, X, Sparkles, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractResumeData } from '@/services/aiService';
import { ResumePreview } from './ResumePreview';

interface ResumeUploadProps {
  onResumeProcessed: (data: any) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const ResumeUpload = ({ onResumeProcessed, isProcessing, setIsProcessing }: ResumeUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionStep, setExtractionStep] = useState<string>('');
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    console.log('File selected:', file.name, file.type, file.size);
    
    if (!file.type.includes('pdf') && !file.name.endsWith('.docx')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setUploadProgress(100);
    
    toast({
      title: "File Uploaded Successfully",
      description: `${file.name} is ready for AI processing.`,
    });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('File dropped:', file);
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File input changed:', file);
      handleFileSelect(file);
    }
  };

  const processResume = async () => {
    if (!uploadedFile) {
      console.error('No file uploaded');
      return;
    }

    console.log('Starting resume processing...');
    setIsProcessing(true);
    setExtractionProgress(0);
    
    try {
      // Step 1: File Validation
      setExtractionStep('Validating file format and content...');
      setExtractionProgress(10);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Text Extraction
      setExtractionStep('Extracting text from document...');
      setExtractionProgress(25);
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Step 3: AI Analysis
      setExtractionStep('Analyzing content with advanced AI...');
      setExtractionProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Data Structuring
      setExtractionStep('Structuring professional information...');
      setExtractionProgress(75);
      
      const extractedData = await extractResumeData(uploadedFile);
      console.log('Extracted data:', extractedData);

      // Step 5: Saving Profile
      setExtractionStep('Saving to your profile...');
      setExtractionProgress(90);
      await new Promise(resolve => setTimeout(resolve, 500));

      setExtractionProgress(100);
      setExtractionStep('Complete! Profile data extracted successfully.');

      onResumeProcessed(extractedData);
      
      toast({
        title: "🎉 Resume Processed Successfully!",
        description: "Your profile has been updated with extracted information. Review the data below.",
      });

    } catch (error) {
      console.error('Resume processing error:', error);
      toast({
        title: "Processing Failed",
        description: "There was an error processing your resume. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setExtractionStep('');
      setExtractionProgress(0);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setExtractionProgress(0);
    setExtractionStep('');
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <Card className={`transition-all duration-300 ${isDragOver ? 'border-blue-500 bg-blue-50 scale-[1.02]' : ''} ${isProcessing ? 'border-purple-300' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Professional Resume Analysis
          </CardTitle>
          <CardDescription>
            Upload your resume to extract and organize your professional information using advanced AI technology
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                ${isDragOver 
                  ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className={`transition-all duration-300 ${isDragOver ? 'scale-110' : ''}`}>
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isDragOver ? 'Drop your resume here' : 'Upload Your Resume'}
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your file or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Supported formats: PDF, DOCX • Maximum size: 10MB
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isProcessing}
                  />
                  <Button 
                    disabled={isProcessing} 
                    className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                    size="lg"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">{uploadedFile.name}</p>
                    <p className="text-sm text-green-700">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for processing
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-green-700 hover:text-green-900 hover:bg-green-100"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {showPreview ? 'Hide' : 'Preview'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={isProcessing}
                    className="text-green-700 hover:text-green-900 hover:bg-green-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <div className="space-y-4 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div>
                      <span className="font-semibold text-purple-900">AI Processing in Progress</span>
                      <p className="text-sm text-purple-700">Extracting and analyzing your professional data</p>
                    </div>
                  </div>
                  
                  {extractionStep && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-800">{extractionStep}</span>
                        <span className="text-purple-600 font-medium">{extractionProgress}%</span>
                      </div>
                      <Progress value={extractionProgress} className="h-3" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-purple-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processing typically takes 30-90 seconds depending on resume complexity
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isProcessing && (
                <div className="flex gap-3">
                  <Button
                    onClick={processResume}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200"
                    size="lg"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Extract Data with AI
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={removeFile}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    Replace File
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resume Preview */}
      {uploadedFile && showPreview && (
        <ResumePreview file={uploadedFile} />
      )}
    </div>
  );
};
