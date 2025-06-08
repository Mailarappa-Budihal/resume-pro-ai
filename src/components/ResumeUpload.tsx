
import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, Loader2, X, Sparkles, Eye, AlertTriangle } from 'lucide-react';
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

  const validateFile = (file: File): boolean => {
    console.log('Validating file:', file.name, file.type, file.size);
    
    // Check file type
    const isValidType = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.docx');
    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or DOCX file only.",
        variant: "destructive",
      });
      return false;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: `File size is ${(file.size / 1024 / 1024).toFixed(2)}MB. Please upload a file smaller than 10MB.`,
        variant: "destructive",
      });
      return false;
    }

    // Check if file is empty
    if (file.size === 0) {
      toast({
        title: "Empty File",
        description: "The selected file appears to be empty. Please choose a valid resume file.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) {
      return;
    }

    console.log('File selected successfully:', file.name);
    setUploadedFile(file);
    setUploadProgress(100);
    setShowPreview(true);
    
    toast({
      title: "✅ File Uploaded Successfully!",
      description: `${file.name} is ready for AI processing. You can preview it below.`,
    });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      console.log('File dropped:', file.name);
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
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log('File input changed:', file.name);
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const processResume = async () => {
    if (!uploadedFile) {
      toast({
        title: "No File Selected",
        description: "Please upload a resume file first.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting resume processing for:', uploadedFile.name);
    setIsProcessing(true);
    setExtractionProgress(0);
    
    try {
      // Step 1: File Validation
      setExtractionStep('Validating file format and content...');
      setExtractionProgress(10);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Text Extraction
      setExtractionStep('Extracting text from your resume...');
      setExtractionProgress(25);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: AI Analysis
      setExtractionStep('Analyzing content with advanced AI...');
      setExtractionProgress(50);
      
      // Actually extract the data
      const extractedData = await extractResumeData(uploadedFile);
      console.log('Successfully extracted data:', extractedData);

      // Step 4: Data Structuring
      setExtractionStep('Structuring professional information...');
      setExtractionProgress(80);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 5: Saving Profile
      setExtractionStep('Saving to your profile...');
      setExtractionProgress(95);
      await new Promise(resolve => setTimeout(resolve, 300));

      setExtractionProgress(100);
      setExtractionStep('✅ Complete! Profile data extracted successfully.');

      // Pass data to parent component
      onResumeProcessed(extractedData);
      
      toast({
        title: "🎉 Resume Processed Successfully!",
        description: "Your professional information has been extracted and saved to your profile.",
      });

    } catch (error) {
      console.error('Resume processing error:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "There was an error processing your resume. Please try again.",
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
    
    toast({
      title: "File Removed",
      description: "You can now upload a new resume file.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className={`transition-all duration-300 ${
        isDragOver ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg' : ''
      } ${isProcessing ? 'border-purple-300 bg-purple-50' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            AI-Powered Resume Analysis
          </CardTitle>
          <CardDescription>
            Upload your resume in PDF or DOCX format to automatically extract and organize your professional information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                ${isDragOver 
                  ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-inner' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className={`transition-all duration-300 ${isDragOver ? 'scale-110' : ''}`}>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isDragOver ? 'Drop your resume here!' : 'Upload Your Resume'}
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your file or click to browse
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    PDF & DOCX supported
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Max 10MB
                  </span>
                </div>
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
                    <Upload className="w-5 h-5 mr-2" />
                    Choose Resume File
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900 text-lg">{uploadedFile.name}</p>
                    <p className="text-sm text-green-700">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • 
                      {uploadedFile.type.includes('pdf') ? ' PDF Document' : ' DOCX Document'} • 
                      Ready for AI processing
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
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
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
                <div className="space-y-4 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 text-lg">AI Processing Your Resume</h3>
                      <p className="text-sm text-purple-700">Extracting and analyzing your professional information</p>
                    </div>
                  </div>
                  
                  {extractionStep && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-800 font-medium">{extractionStep}</span>
                        <span className="text-purple-600 font-bold">{extractionProgress}%</span>
                      </div>
                      <Progress value={extractionProgress} className="h-3 bg-purple-100" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-100 p-3 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing time varies based on document complexity (30-90 seconds typical)</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isProcessing && (
                <div className="flex gap-3">
                  <Button
                    onClick={processResume}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 text-lg py-6"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Extract Data with AI
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={removeFile}
                    className="hover:bg-gray-50 transition-colors"
                    size="lg"
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
