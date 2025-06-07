
import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractResumeData } from '@/services/aiService';

interface ResumeUploadProps {
  onResumeProcessed: (data: any) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const ResumeUpload = ({ onResumeProcessed, isProcessing, setIsProcessing }: ResumeUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionStep, setExtractionStep] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
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
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processResume = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setExtractionStep('Uploading file...');
    
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setExtractionStep('Extracting text from document...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setExtractionStep('Analyzing with AI...');
      const extractedData = await extractResumeData(uploadedFile);

      setExtractionStep('Saving to profile...');
      await new Promise(resolve => setTimeout(resolve, 500));

      onResumeProcessed(extractedData);
      
      toast({
        title: "Resume Processed Successfully!",
        description: "Your profile has been updated with the extracted information.",
      });

    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setExtractionStep('');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <Card className={`transition-all duration-200 ${isDragOver ? 'border-blue-500 bg-blue-50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Resume Upload & AI Processing
        </CardTitle>
        <CardDescription>
          Upload your resume to automatically extract and organize your professional information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isDragOver ? 'Drop your resume here' : 'Upload Your Resume'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your file or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PDF, DOCX (Max 10MB)
            </p>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              <Button disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">{uploadedFile.name}</p>
                  <p className="text-sm text-green-700">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={isProcessing}
                className="text-green-700 hover:text-green-900"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="font-medium text-blue-900">Processing Resume</span>
                </div>
                {extractionStep && (
                  <p className="text-sm text-blue-700">{extractionStep}</p>
                )}
                <div className="text-xs text-blue-600">
                  This may take 30-60 seconds depending on your resume complexity
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isProcessing && (
              <div className="flex gap-3">
                <Button
                  onClick={processResume}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Loader2 className="w-4 h-4 mr-2" />
                  Extract Data with AI
                </Button>
                <Button variant="outline" onClick={removeFile}>
                  Replace File
                </Button>
              </div>
            )}
          </div>
        )}

        {/* AI Processing Info */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2">AI-Powered Extraction</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Extracts contact information and professional summary</li>
            <li>• Identifies work experience, education, and projects</li>
            <li>• Categorizes technical and soft skills</li>
            <li>• Structures data for portfolio and resume optimization</li>
            <li>• Maintains data privacy and security</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
