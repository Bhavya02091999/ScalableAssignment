'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/MockAuthContext';
import { Loader2, Search, User, BookOpen, Clock, Bookmark, BookmarkCheck } from 'lucide-react';

type Course = {
  id: string;
  title: string;
  code: string;
  description: string;
  instructor: string;
  credits: number;
  enrolled: boolean;
};

export default function CoursesPage() {
  const { user, getCourses, getStudentCourses, getInstructorCourses } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        let fetchedCourses = [];
        
        if (user.role === 'student') {
          fetchedCourses = await getStudentCourses(user.id);
        } else if (user.role === 'instructor') {
          fetchedCourses = await getInstructorCourses(user.id);
        } else {
          // Admin or other roles see all courses
          fetchedCourses = await getCourses();
        }
        
        setCourses(fetchedCourses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, getCourses, getStudentCourses, getInstructorCourses]);
  
  const toggleEnrollment = (courseId: string) => {
    setEnrolledCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };
  
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            {user?.role === 'student' 
              ? 'Browse and enroll in available courses' 
              : user?.role === 'instructor'
              ? 'View and manage your courses'
              : 'Manage all courses'}
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <Button asChild>
            <Link href="/courses/new">
              Add New Course
            </Link>
          </Button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search courses..."
          className="w-full pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourses.has(course.id);
            const isInstructor = user?.role === 'instructor' && user.name === course.instructor;
            
            return (
              <Card key={course.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      <CardDescription className="mt-1">{course.code}</CardDescription>
                    </div>
                    {isEnrolled && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Enrolled
                      </span>
                    )}
                    {isInstructor && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Teaching
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{course.instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{course.department}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Semester {course.semester}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/courses/${course.id}`}>
                      View Details
                    </Link>
                  </Button>
                  {user?.role === 'student' && (
                    <Button
                      variant={isEnrolled ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleEnrollment(course.id)}
                      className="flex items-center gap-1"
                    >
                      {isEnrolled ? (
                        <>
                          <BookmarkCheck className="h-4 w-4" />
                          <span>Enrolled</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          <span>Enroll</span>
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No courses found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery
              ? 'No courses match your search. Try a different search term.'
              : 'There are no courses available at the moment.'}
          </p>
          {user?.role === 'admin' && (
            <Button className="mt-4" asChild>
              <Link href="/courses/new">
                Add New Course
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
