'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/MockAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Users, BookOpen, BarChart2, Settings, UserPlus, BookPlus, FileText, MessageSquare, ShieldAlert } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
};

type Course = {
  id: string;
  title: string;
  code: string;
  instructor: string;
  students: number;
  status: 'active' | 'archived' | 'draft';
};

type Feedback = {
  id: string;
  title: string;
  course: string;
  responses: number;
  status: 'open' | 'closed' | 'draft';
  endDate: string;
};

type Stats = {
  totalUsers: number;
  totalCourses: number;
  activeFeedbacks: number;
  responseRate: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    activeFeedbacks: 0,
    responseRate: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin, if not redirect to dashboard
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulated data - replace with actual API calls
        const mockStats: Stats = {
          totalUsers: 1245,
          totalCourses: 87,
          activeFeedbacks: 23,
          responseRate: 68,
        };

        const mockUsers: User[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'instructor',
            status: 'active',
            lastActive: '2023-11-15T14:30:00Z',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'student',
            status: 'active',
            lastActive: '2023-11-16T09:15:00Z',
          },
          {
            id: '3',
            name: 'Robert Johnson',
            email: 'robert.j@example.com',
            role: 'admin',
            status: 'active',
            lastActive: '2023-11-16T10:45:00Z',
          },
        ];

        const mockCourses: Course[] = [
          {
            id: '1',
            title: 'Introduction to Computer Science',
            code: 'CS101',
            instructor: 'Dr. Smith',
            students: 45,
            status: 'active',
          },
          {
            id: '2',
            title: 'Data Structures and Algorithms',
            code: 'CS201',
            instructor: 'Dr. Johnson',
            students: 32,
            status: 'active',
          },
          {
            id: '3',
            title: 'Database Systems',
            code: 'CS301',
            instructor: 'Dr. Williams',
            students: 28,
            status: 'archived',
          },
        ];

        const mockFeedbacks: Feedback[] = [
          {
            id: '1',
            title: 'End of Semester Feedback',
            course: 'CS101 - Introduction to Computer Science',
            responses: 38,
            status: 'open',
            endDate: '2023-12-15',
          },
          {
            id: '2',
            title: 'Instructor Evaluation - Dr. Johnson',
            course: 'CS201 - Data Structures and Algorithms',
            responses: 25,
            status: 'open',
            endDate: '2023-12-10',
          },
          {
            id: '3',
            title: 'Course Feedback - Fall 2023',
            course: 'CS301 - Database Systems',
            responses: 0,
            status: 'draft',
            endDate: '2023-12-20',
          },
        ];

        setStats(mockStats);
        setUsers(mockUsers);
        setCourses(mockCourses);
        setFeedbacks(mockFeedbacks);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeedbacks = feedbacks.filter(feedback => 
    feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, courses, and system settings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <div className="my-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={
                activeTab === 'overview' ? 'Search...' :
                activeTab === 'users' ? 'Search users...' :
                activeTab === 'courses' ? 'Search courses...' :
                'Search feedback...'
              }
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Courses
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Feedbacks
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeFeedbacks}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.responseRate}% response rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    System Status
                  </CardTitle>
                  <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Operational</div>
                  <p className="text-xs text-muted-foreground">
                    All systems normal
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>
                    {users.length} users found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="ml-auto">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.role === 'instructor' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/users" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Users
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Courses</CardTitle>
                  <CardDescription>
                    {courses.length} courses found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.slice(0, 5).map((course) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.code} • {course.instructor}</p>
                        </div>
                        <div className="ml-auto">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            course.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : course.status === 'archived' 
                                ? 'bg-gray-100 text-gray-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/courses" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Courses
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </div>
                <Link href="/admin/users/new">
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {filteredUsers.length > 0 ? (
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle font-medium">{user.name}</td>
                            <td className="p-4 align-middle">{user.email}</td>
                            <td className="p-4 align-middle">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : user.role === 'instructor' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : user.status === 'suspended' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">
                              <Button variant="ghost" size="sm" className="h-8">
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No users found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Courses</CardTitle>
                  <CardDescription>
                    Manage all courses in the system
                  </CardDescription>
                </div>
                <Link href="/admin/courses/new">
                  <Button>
                    <BookPlus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCourses.length > 0 ? (
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Course</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Instructor</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Students</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredCourses.map((course) => (
                          <tr key={course.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">
                              <div className="font-medium">{course.title}</div>
                              <div className="text-sm text-muted-foreground">{course.code}</div>
                            </td>
                            <td className="p-4 align-middle">{course.instructor}</td>
                            <td className="p-4 align-middle">{course.students} students</td>
                            <td className="p-4 align-middle">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                course.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : course.status === 'archived' 
                                    ? 'bg-gray-100 text-gray-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">
                              <Button variant="ghost" size="sm" className="h-8">
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No courses found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Feedback</CardTitle>
                  <CardDescription>
                    Manage all feedback forms and responses
                  </CardDescription>
                </div>
                <Link href="/admin/feedback/new">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    New Form
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {filteredFeedbacks.length > 0 ? (
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Course</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Responses</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredFeedbacks.map((feedback) => (
                          <tr key={feedback.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle font-medium">{feedback.title}</td>
                            <td className="p-4 align-middle">{feedback.course}</td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center">
                                <BarChart2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{feedback.responses} responses</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                feedback.status === 'open' 
                                  ? 'bg-green-100 text-green-800' 
                                  : feedback.status === 'closed' 
                                    ? 'bg-gray-100 text-gray-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">
                              <Button variant="ghost" size="sm" className="h-8">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No feedback forms found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
