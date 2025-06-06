
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { MessageSquare, Send, Bot, User, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InterviewSimulator = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [numQuestions, setNumQuestions] = useState('5');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [messages, setMessages] = useState<Array<{type: 'bot' | 'user', content: string}>>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { toast } = useToast();

  const mockQuestions = [
    "Tell me about yourself and your background in software development.",
    "What interests you most about this software engineer position at our company?",
    "Describe a challenging technical problem you've solved recently. Walk me through your approach.",
    "How do you stay current with new technologies and industry trends?",
    "Tell me about a time when you had to work with a difficult team member. How did you handle it?"
  ];

  const handleStartInterview = () => {
    if (!jobTitle.trim()) {
      toast({
        title: "Job Title Required",
        description: "Please enter a job title to start the interview simulation.",
        variant: "destructive",
      });
      return;
    }

    setIsStarted(true);
    setMessages([
      {
        type: 'bot',
        content: `Welcome to your interview simulation for the ${jobTitle} position${company ? ` at ${company}` : ''}! I'll be conducting a ${interviewType} interview with ${numQuestions} questions. Let's begin with the first question:`
      },
      {
        type: 'bot',
        content: mockQuestions[0]
      }
    ]);

    toast({
      title: "Interview Started!",
      description: "Good luck! Take your time to provide thoughtful answers.",
    });
  };

  const handleSendAnswer = () => {
    if (!currentAnswer.trim()) return;

    const newMessages = [...messages, { type: 'user' as const, content: currentAnswer }];
    
    // Simulate AI feedback
    const feedback = `Thank you for your answer. I can see you have good experience in software development. Your approach to problem-solving shows analytical thinking. For future interviews, consider adding more specific examples or metrics to strengthen your responses.`;
    
    if (currentQuestion < parseInt(numQuestions) - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      newMessages.push(
        { type: 'bot', content: feedback },
        { type: 'bot', content: `Great! Let's move to the next question: ${mockQuestions[nextQuestionIndex] || 'What questions do you have for me about the role or company?'}` }
      );
      setCurrentQuestion(nextQuestionIndex);
    } else {
      newMessages.push(
        { type: 'bot', content: feedback },
        { type: 'bot', content: 'That completes our interview simulation! Overall, you demonstrated strong communication skills and relevant experience. Consider practicing with specific examples and metrics to make your answers even more impactful. Good luck with your actual interviews!' }
      );
    }

    setMessages(newMessages);
    setCurrentAnswer('');
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Interview Simulator
            </h1>
            <p className="text-gray-600">Practice with AI-powered mock interviews</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {!isStarted ? (
          <>
            {/* Interview Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Interview Configuration</CardTitle>
                <CardDescription>
                  Set up your mock interview parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job-title">Job Title *</Label>
                    <Input
                      id="job-title"
                      placeholder="e.g., Software Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      placeholder="e.g., Google, Microsoft"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="num-questions">Number of Questions</Label>
                    <Select value={numQuestions} onValueChange={setNumQuestions}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 questions</SelectItem>
                        <SelectItem value="5">5 questions</SelectItem>
                        <SelectItem value="8">8 questions</SelectItem>
                        <SelectItem value="10">10 questions</SelectItem>
                        <SelectItem value="15">15 questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience-level">Experience Level</Label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="lead">Lead/Principal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="interview-type">Interview Type</Label>
                    <Select value={interviewType} onValueChange={setInterviewType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="system-design">System Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="w-full md:w-48">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleStartInterview}
                  disabled={!jobTitle.trim()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4" />
                  Start Interview
                </Button>
              </CardContent>
            </Card>

            {/* Interview Tips */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">Interview Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-green-800 space-y-2 text-sm">
                  <li>• Speak out loud even though you're typing - practice your verbal communication</li>
                  <li>• Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
                  <li>• Be specific with examples and include metrics when possible</li>
                  <li>• Take your time to think before answering</li>
                  <li>• Ask clarifying questions if needed</li>
                  <li>• Show enthusiasm and genuine interest in the role</li>
                </ul>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Interview Chat Interface */}
            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Mock Interview in Progress
                </CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} of {numQuestions} • {jobTitle} Interview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'bot' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {message.type === 'bot' ? (
                            <Bot className="w-4 h-4 text-blue-600" />
                          ) : (
                            <User className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.type === 'bot' 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-gray-100 border border-gray-200'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Answer Input */}
                {currentQuestion < parseInt(numQuestions) && (
                  <div className="space-y-3 border-t pt-4">
                    <Label htmlFor="answer">Your Answer</Label>
                    <Textarea
                      id="answer"
                      placeholder="Type your answer here..."
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Take your time and provide detailed, specific examples
                      </p>
                      <Button 
                        onClick={handleSendAnswer}
                        disabled={!currentAnswer.trim()}
                        className="flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Answer
                      </Button>
                    </div>
                  </div>
                )}

                {currentQuestion >= parseInt(numQuestions) && (
                  <div className="text-center pt-4 border-t">
                    <Button 
                      onClick={() => {
                        setIsStarted(false);
                        setMessages([]);
                        setCurrentQuestion(0);
                        setCurrentAnswer('');
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Start New Interview
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulator;
