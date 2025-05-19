'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/MockAuthContext';
import { Loader2, Search, MessageSquare, CheckCircle, Clock, Star, BarChart2, Plus } from 'lucide-react';

type FeedbackForm = {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  dueDate: string;
  submitted: boolean;
  questions: number;
  responses: number;
  status: 'open' | 'closed' | 'draft';
};

type FeedbackResponse = {
  id: string;
  formId: string;
  title: string;
  course: string;
  submittedDate: string;
  status: 'submitted' | 'pending' | 'draft';
};

export default function FeedbackPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('to-complete');
  const [loading, setLoading] = useState(true);
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
  const [myResponses, setMyResponses] = useState<FeedbackResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const isInstructor = user?.role === 'instructor';

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        // Simulated data - replace with actual API calls
        const mockFeedbackForms: FeedbackForm[] = [
          {
            id: '1',
            title: 'Course Feedback - CS101',
            course: 'Introduction to Computer Science',
            courseCode: 'CS101',
            dueDate: '2023-12-15',
            submitted: false,
            questions: 10,
            responses: 42,
            status: 'open',
          },
          {
            id: '2',
            title: 'Instructor Evaluation - Dr. Smith',
            course: 'Data Structures and Algorithms',
            courseCode: 'CS201',
            dueDate: '2023-12-10',
            submitted: true,
            questions: 8,
            responses: 35,
            status: 'open',
          },
          {
            id: '3',
            title: 'Course Feedback - MATH202',
            course: 'Discrete Mathematics',
            courseCode: 'MATH202',
            dueDate: '2023-12-05',
            submitted: false,
            questions: 12,
            responses: 28,
            status: 'open',
          },
        ];

        const mockMyResponses: FeedbackResponse[] = [
          {
            id: 'resp1',
            formId: '2',
            title: 'Instructor Evaluation - Dr. Smith',
            course: 'CS201 - Data Structures and Algorithms',
            submittedDate: '2023-12-08',
            status: 'submitted',
          },
          {
            id: 'resp2',
            formId: '3',
            title: 'Course Feedback - MATH202',
            course: 'MATH202 - Discrete Mathematics',
            submittedDate: '',
            status: 'pending',
          },
        ];

        setFeedbackForms(mockFeedbackForms);
        setMyResponses(mockMyResponses);
      } catch (error) {
        console.error('Failed to fetch feedback data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  const filteredForms = feedbackForms.filter(form => 
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingForms = filteredForms.filter(form => !form.submitted && form.status === 'open');
  const completedForms = filteredForms.filter(form => form.submitted || form.status === 'closed');
  const myPendingResponses = myResponses.filter(resp => resp.status === 'pending' || resp.status === 'draft');
  const mySubmittedResponses = myResponses.filter(resp => resp.status === 'submitted');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Feedback</h1>
          <p className="text-muted-foreground">
            {isInstructor ? 'Manage and review feedback forms' : 'Complete feedback forms for your courses'}
          </p>
        </div>
        {isInstructor && (
          <Link href="/feedback/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Form
            </Button>
          </Link>
        )}
      </div>

      <Tabs 
        defaultValue={isInstructor ? 'manage' : 'to-complete'}
        className="w-full" 
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          {isInstructor ? (
            <>
              <TabsTrigger value="manage">Manage Forms</TabsTrigger>
              <TabsTrigger value="responses">Responses</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="to-complete">To Complete</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </>
          )}
        </TabsList>

        <div className="my-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={
                isInstructor 
                  ? 'Search forms...' 
                  : activeTab === 'to-complete' 
                    ? 'Search pending feedback...' 
                    : 'Search completed feedback...'
              }
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isInstructor ? (
          // Instructor View
          <>
            <TabsContent value="manage" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">My Feedback Forms</h2>
                  <span className="text-sm text-muted-foreground">
                    {feedbackForms.length} {feedbackForms.length === 1 ? 'form' : 'forms'}
                  </span>
                </div>

                {feedbackForms.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredForms.map((form) => (
                      <Card key={form.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{form.title}</CardTitle>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              form.status === 'open' 
                                ? 'bg-green-100 text-green-800' 
                                : form.status === 'closed' 
                                  ? 'bg-gray-100 text-gray-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {form.status === 'open' ? 'Open' : form.status === 'closed' ? 'Closed' : 'Draft'}
                            </span>
                          </div>
                          <CardDescription className="line-clamp-1">
                            {form.courseCode} • {form.course}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{form.questions} questions</span>
                            </div>
                            <div className="flex items-center">
                              <BarChart2 className="h-4 w-4 mr-1" />
                              <span>{form.responses} responses</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(form.dueDate).toLocaleDateString()}
                          </p>
                          <Link href={`/feedback/forms/${form.id}`}>
                            <Button variant="outline" size="sm">
                              {form.status === 'draft' ? 'Edit' : 'View'}
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">No feedback forms yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Get started by creating your first feedback form.
                      </p>
                      <Link href="/feedback/new">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Form
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="responses" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Responses</CardTitle>
                  <CardDescription>View and manage responses to your feedback forms.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No responses yet</h3>
                    <p className="text-muted-foreground">
                      Responses to your feedback forms will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View analytics for your feedback forms.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No analytics available yet</h3>
                    <p className="text-muted-foreground">
                      Analytics will be available once you receive responses to your forms.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>Create and manage feedback form templates.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No templates yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create templates to quickly create new feedback forms.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        ) : (
          // Student View
          <>
            <TabsContent value="to-complete" className="mt-0">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Feedback to Complete</h2>
                {pendingForms.length > 0 ? (
                  <div className="grid gap-4">
                    {pendingForms.map((form) => (
                      <Card key={form.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{form.title}</CardTitle>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Due Soon
                            </span>
                          </div>
                          <CardDescription className="line-clamp-1">
                            {form.courseCode} • {form.course}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Due {new Date(form.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{form.questions} questions</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-0">
                          <Link href={`/feedback/forms/${form.id}`} className="w-full">
                            <Button className="w-full">
                              Start Feedback
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                      <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                      <p className="text-muted-foreground">
                        You don't have any pending feedback to complete right now.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Completed Feedback</h2>
                {completedForms.length > 0 ? (
                  <div className="grid gap-4">
                    {completedForms.map((form) => (
                      <Card key={form.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{form.title}</CardTitle>
                          <CardDescription className="line-clamp-1">
                            {form.courseCode} • {form.course}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                              <span>Submitted on {new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              <span>Thank you for your feedback!</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-0">
                          <Link href={`/feedback/forms/${form.id}/confirmation`}>
                            <Button variant="outline" size="sm">
                              View Submission
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">No completed feedback yet</h3>
                      <p className="text-muted-foreground">
                        Your completed feedback forms will appear here.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="drafts" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Drafts</CardTitle>
                  <CardDescription>Your in-progress feedback forms.</CardDescription>
                </CardHeader>
                <CardContent>
                  {myPendingResponses.length > 0 ? (
                    <div className="space-y-4">
                      {myPendingResponses.map((response) => (
                        <Card key={response.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{response.title}</CardTitle>
                            <CardDescription className="line-clamp-1">
                              {response.course}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between pt-0">
                            <span className="text-sm text-muted-foreground">
                              Last saved: {new Date().toLocaleDateString()}
                            </span>
                            <Link href={`/feedback/forms/${response.formId}`}>
                              <Button variant="outline" size="sm">
                                Continue
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">No drafts</h3>
                      <p className="text-muted-foreground">
                        Your in-progress feedback forms will appear here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback History</CardTitle>
                  <CardDescription>View your feedback submission history.</CardDescription>
                </CardHeader>
                <CardContent>
                  {mySubmittedResponses.length > 0 ? (
                    <div className="space-y-4">
                      {mySubmittedResponses.map((response) => (
                        <Card key={response.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{response.title}</CardTitle>
                            <CardDescription className="line-clamp-1">
                              {response.course}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between pt-0">
                            <span className="text-sm text-muted-foreground">
                              Submitted on {new Date(response.submittedDate).toLocaleDateString()}
                            </span>
                            <Link href={`/feedback/forms/${response.formId}/confirmation`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">No feedback history yet</h3>
                      <p className="text-muted-foreground">
                        Your submitted feedback will appear here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
