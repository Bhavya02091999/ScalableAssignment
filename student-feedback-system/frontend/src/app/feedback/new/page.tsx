'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/MockAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Loader2, ArrowLeft } from 'lucide-react';

// Mock users data (in a real app, this would come from your backend)
const MOCK_USERS = [
  {
    id: '1',
    name: 'Dr. Smith',
    email: 'instructor@example.com',
    role: 'instructor',
    department: 'Computer Science'
  },
  // Add more mock users as needed
];

export default function NewFeedbackPage() {
  const router = useRouter();
  const { user, getStudentCourses, submitFeedback } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [selectedCourse, setSelectedCourse] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Get courses where the student is enrolled
        const enrolledCourses = await getStudentCourses(user.id);
        setCourses(enrolledCourses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, getStudentCourses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse || rating === null) {
      setError('Please select a course and provide a rating');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      const course = courses.find(c => c.id === selectedCourse);
      if (!course) {
        setError('Invalid course selected');
        return;
      }
      
      // Find the instructor for this course
      const instructor = MOCK_USERS.find(u => 
        u.role === 'instructor' && u.name === course.instructor
      );
      
      if (!instructor) {
        setError('Could not find course instructor');
        return;
      }
      
      const result = await submitFeedback({
        courseId: selectedCourse,
        instructorId: instructor.id,
        studentId: user!.id,
        rating,
        comments,
      });
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      // Redirect to feedback success page or dashboard
      router.push('/feedback/success');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to submit feedback</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Submit Course Feedback</CardTitle>
            <CardDescription>
              Help us improve by sharing your experience in this course.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="course">Select Course</Label>
                <Select 
                  value={selectedCourse} 
                  onValueChange={setSelectedCourse}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.name} ({course.instructor})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Overall Rating</Label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`p-1 rounded-full ${
                        rating && value <= rating 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                      onClick={() => setRating(value)}
                      disabled={submitting}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating ? `${rating} ${rating === 1 ? 'star' : 'stars'}` : 'Select a rating'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  placeholder="Share your thoughts about the course..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  disabled={submitting}
                  rows={5}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !selectedCourse || rating === null}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
