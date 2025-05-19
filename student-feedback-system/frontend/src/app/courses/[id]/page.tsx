'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowLeft, Calendar, Users, BookOpen, FileText, MessageSquare, BarChart2 } from 'lucide-react';

type Course = {
  id: string;
  title: string;
  code: string;
  description: string;
  instructor: string;
  credits: number;
  enrolled: boolean;
  schedule: string;
  location: string;
  prerequisites: string[];
  syllabus: string[];
};

type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
};

type Assignment = {
  id: string;
  title: string;
  dueDate: string;
  points: number;
  submitted: boolean;
  grade?: number;
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Simulated data - replace with actual API calls
        const mockCourse: Course = {
          id: id as string,
          title: 'Introduction to Computer Science',
          code: 'CS101',
          description: 'This course introduces students to the fundamental concepts of computer science and programming. Topics include problem solving, algorithm design, and programming principles using a high-level language.',
          instructor: 'Dr. Smith',
          credits: 4,
          enrolled: true,
          schedule: 'Mon/Wed/Fri 10:00 AM - 11:30 AM',
          location: 'Science Building, Room 101',
          prerequisites: ['None'],
          syllabus: [
            'Week 1: Introduction to Programming',
            'Week 2: Variables and Data Types',
            'Week 3: Control Structures',
            'Week 4: Functions and Modules',
            'Week 5: Object-Oriented Programming',
            'Week 6: Basic Data Structures',
            'Week 7: Algorithm Analysis',
            'Week 8: Midterm Exam',
            'Week 9: File I/O and Exception Handling',
            'Week 10: Introduction to Web Development',
            'Week 11: Databases and SQL',
            'Week 12: Software Development Lifecycle',
            'Week 13: Version Control with Git',
            'Week 14: Final Project Work',
            'Week 15: Final Project Presentations',
          ],
        };

        const mockAnnouncements: Announcement[] = [
          {
            id: '1',
            title: 'Welcome to CS101!',
            content: 'Welcome everyone to Introduction to Computer Science! Please check the syllabus and course materials on the course page.',
            date: '2023-09-01',
            author: 'Dr. Smith',
          },
          {
            id: '2',
            title: 'First Assignment Posted',
            content: 'The first programming assignment has been posted. It is due next Friday at 11:59 PM.',
            date: '2023-09-03',
            author: 'Dr. Smith',
          },
        ];

        const mockAssignments: Assignment[] = [
          {
            id: '1',
            title: 'Assignment 1: Hello World',
            dueDate: '2023-09-15',
            points: 100,
            submitted: true,
            grade: 95,
          },
          {
            id: '2',
            title: 'Assignment 2: Calculator',
            dueDate: '2023-09-29',
            points: 100,
            submitted: false,
          },
        ];

        setCourse(mockCourse);
        setAnnouncements(mockAnnouncements);
        setAssignments(mockAssignments);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleEnroll = async () => {
    try {
      // TODO: Implement enrollment logic
      if (course) {
        setCourse({ ...course, enrolled: true });
      }
    } catch (error) {
      console.error('Failed to enroll in course:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <p className="text-muted-foreground mb-4">The requested course could not be found.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4 px-0" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.code} • {course.credits} credits</p>
          </div>
          {!course.enrolled ? (
            <Button onClick={handleEnroll}>Enroll in Course</Button>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Enrolled
            </span>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{course.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  {announcements.length > 0 ? (
                    <div className="space-y-4">
                      {announcements.slice(0, 3).map((announcement) => (
                        <div key={announcement.id} className="border-b pb-4 last:border-0 last:pb-0 last:mb-0">
                          <h3 className="font-medium">{announcement.title}</h3>
                          <p className="text-sm text-muted-foreground">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Posted by {announcement.author} on {new Date(announcement.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {announcements.length > 3 && (
                        <Button variant="ghost" className="mt-2" onClick={() => setActiveTab('announcements')}>
                          View all announcements
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No announcements yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Instructor</p>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Schedule</p>
                      <p className="text-sm text-muted-foreground">{course.schedule}</p>
                      <p className="text-sm text-muted-foreground">{course.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Credits</p>
                      <p className="text-sm text-muted-foreground">{course.credits} credit hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.filter(a => !a.submitted).length > 0 ? (
                    <div className="space-y-4">
                      {assignments
                        .filter(a => !a.submitted)
                        .slice(0, 3)
                        .map((assignment) => (
                          <div key={assignment.id} className="border-b pb-3 last:border-0 last:pb-0 last:mb-0">
                            <h3 className="font-medium text-sm">{assignment.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      {assignments.filter(a => !a.submitted).length > 3 && (
                        <Button variant="ghost" className="mt-2" onClick={() => setActiveTab('assignments')}>
                          View all assignments
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No upcoming assignments.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Important updates and announcements from your instructor.</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length > 0 ? (
                <div className="space-y-6">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-b pb-6 last:border-0 last:pb-0 last:mb-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(announcement.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-muted-foreground mt-2">{announcement.content}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Posted by {announcement.author}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No announcements yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Check back later for updates from your instructor.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>View and submit your course assignments.</CardDescription>
            </CardHeader>
            <CardContent>
              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div 
                      key={assignment.id} 
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{assignment.points} points</p>
                          {assignment.submitted ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {assignment.grade !== undefined ? `Graded: ${assignment.grade}/${assignment.points}` : 'Submitted'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Not Submitted
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        {!assignment.submitted ? (
                          <Button variant="outline" size="sm">
                            Submit Assignment
                          </Button>
                        ) : assignment.grade === undefined ? (
                          <p className="text-sm text-muted-foreground">
                            Your submission is being graded.
                          </p>
                        ) : null}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No assignments yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Your instructor hasn't posted any assignments yet. Check back later.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syllabus" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Syllabus</CardTitle>
              <CardDescription>Weekly topics and course schedule.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Course Description</h3>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Prerequisites</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Course Schedule</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Week
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Topic
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {course.syllabus.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-muted/5' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted-foreground">
                              Week {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {item}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Grading Policy</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Grading will be based on the following components:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Assignments: 40%</li>
                      <li>Quizzes: 20%</li>
                      <li>Midterm Exam: 15%</li>
                      <li>Final Exam: 25%</li>
                    </ul>
                    <p className="pt-2">
                      <span className="font-medium">Grading Scale:</span> A (90-100), B (80-89), C (70-79), D (60-69), F (below 60)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
