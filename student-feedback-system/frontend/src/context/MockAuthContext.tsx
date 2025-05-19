'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'student' | 'instructor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  department?: string;
  semester?: number;
  courses?: string[];
}

interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  department: string;
  semester: number;
  description: string;
}

interface Feedback {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  instructorId: string;
  instructorName: string;
  rating: number;
  comments: string;
  date: string;
}

interface AuthContextType {
  // Authentication
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  
  // Course methods
  getCourses: () => Promise<Course[]>;
  getCourseById: (id: string) => Promise<Course | undefined>;
  getStudentCourses: (studentId: string) => Promise<Course[]>;
  getInstructorCourses: (instructorId: string) => Promise<Course[]>;
  
  // Feedback methods
  submitFeedback: (feedback: Omit<Feedback, 'id' | 'date' | 'studentName' | 'courseName' | 'instructorName'>) => Promise<{ error?: string }>;
  getFeedbackByStudent: (studentId: string) => Promise<Feedback[]>;
  getFeedbackForInstructor: (instructorId: string) => Promise<Feedback[]>;
  getFeedbackForCourse: (courseId: string) => Promise<Feedback[]>;
}

// Mock users data
const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    email: 'student@example.com',
    name: 'John Student',
    role: 'student',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    department: 'Computer Science',
    semester: 6,
  },
  {
    id: '2',
    email: 'instructor@example.com',
    name: 'Dr. Smith',
    role: 'instructor',
    avatar_url: 'https://i.pravatar.cc/150?img=2',
    department: 'Computer Science',
    courses: ['CS101', 'CS201'],
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    email: 'student2@example.com',
    name: 'Jane Doe',
    role: 'student',
    avatar_url: 'https://i.pravatar.cc/150?img=4',
    department: 'Electrical Engineering',
    semester: 4,
  },
  {
    id: '5',
    email: 'prof.johnson@example.com',
    name: 'Prof. Johnson',
    role: 'instructor',
    avatar_url: 'https://i.pravatar.cc/150?img=5',
    department: 'Mathematics',
    courses: ['MATH101', 'MATH202'],
  },
];

// Mock courses data
const MOCK_COURSES = [
  {
    id: 'c1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Smith',
    department: 'Computer Science',
    semester: 1,
    description: 'Fundamentals of computer science and programming',
  },
  {
    id: 'c2',
    code: 'CS201',
    name: 'Data Structures',
    instructor: 'Dr. Smith',
    department: 'Computer Science',
    semester: 3,
    description: 'Advanced data structures and algorithms',
  },
  {
    id: 'c3',
    code: 'MATH101',
    name: 'Calculus I',
    instructor: 'Prof. Johnson',
    department: 'Mathematics',
    semester: 1,
    description: 'Introduction to differential and integral calculus',
  },
  {
    id: 'c4',
    code: 'MATH202',
    name: 'Linear Algebra',
    instructor: 'Prof. Johnson',
    department: 'Mathematics',
    semester: 3,
    description: 'Vector spaces, linear transformations, and matrices',
  },
  {
    id: 'c5',
    code: 'EE101',
    name: 'Introduction to Electrical Engineering',
    instructor: 'Dr. Lee',
    department: 'Electrical Engineering',
    semester: 2,
    description: 'Fundamentals of electrical circuits and systems',
  },
];

// Mock feedback data
const MOCK_FEEDBACK = [
  {
    id: 'f1',
    courseId: 'c1',
    courseName: 'CS101',
    studentId: '1',
    studentName: 'John Student',
    instructorId: '2',
    instructorName: 'Dr. Smith',
    rating: 4,
    comments: 'Great course, learned a lot!',
    date: '2023-05-10',
  },
  {
    id: 'f2',
    courseId: 'c3',
    courseName: 'MATH101',
    studentId: '1',
    studentName: 'John Student',
    instructorId: '5',
    instructorName: 'Prof. Johnson',
    rating: 5,
    comments: 'Excellent explanations and engaging lectures.',
    date: '2023-05-15',
  },
];

// Password for all mock users
const MOCK_PASSWORD = 'password123';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Mock data state
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [feedback, setFeedback] = useState<Feedback[]>(MOCK_FEEDBACK);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password !== MOCK_PASSWORD) {
      return { error: 'Invalid credentials' };
    }

    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (!foundUser) {
      return { error: 'User not found' };
    }


    setUser(foundUser);
    localStorage.setItem('mockUser', JSON.stringify(foundUser));
    return {};
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole = 'student') => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      return { error: 'User already exists' };
    }
    
    // In a real app, we would create a new user here
    // For demo, we'll just sign in with the first user
    return signIn('student@example.com', MOCK_PASSWORD);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('mockUser');
    router.push('/auth/login');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'Not authenticated' };
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    
    return {};
  };
  
  // Course methods
  const getCourses = async (): Promise<Course[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...courses];
  };
  
  const getCourseById = async (id: string): Promise<Course | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return courses.find(course => course.id === id);
  };
  
  const getStudentCourses = async (studentId: string): Promise<Course[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // In a real app, this would filter courses based on student's department and semester
    return courses.filter(course => course.semester <= 6); // Example: show courses up to 6th semester
  };
  
  const getInstructorCourses = async (instructorId: string): Promise<Course[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const instructor = MOCK_USERS.find(u => u.id === instructorId);
    if (!instructor) return [];
    
    return courses.filter(course => 
      course.instructor === instructor.name
    );
  };
  
  // Feedback methods
  const submitFeedback = async (
    feedbackData: Omit<Feedback, 'id' | 'date' | 'studentName' | 'courseName' | 'instructorName'>
  ): Promise<{ error?: string }> => {
    if (!user) return { error: 'Not authenticated' };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const course = courses.find(c => c.id === feedbackData.courseId);
    const instructor = MOCK_USERS.find(u => u.id === feedbackData.instructorId);
    
    if (!course || !instructor) {
      return { error: 'Invalid course or instructor' };
    }
    
    const newFeedback: Feedback = {
      ...feedbackData,
      id: `f${feedback.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      studentName: user.name,
      courseName: course.name,
      instructorName: instructor.name,
    };
    
    setFeedback(prev => [...prev, newFeedback]);
    return {};
  };
  
  const getFeedbackByStudent = async (studentId: string): Promise<Feedback[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return feedback.filter(fb => fb.studentId === studentId);
  };
  
  const getFeedbackForInstructor = async (instructorId: string): Promise<Feedback[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return feedback.filter(fb => fb.instructorId === instructorId);
  };
  
  const getFeedbackForCourse = async (courseId: string): Promise<Feedback[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return feedback.filter(fb => fb.courseId === courseId);
  };

  const value = {
    // Auth state
    user,
    loading,
    isAuthenticated: !!user,
    
    // Auth methods
    signIn,
    signUp,
    signOut,
    updateProfile,
    
    // Course methods
    getCourses,
    getCourseById,
    getStudentCourses,
    getInstructorCourses,
    
    // Feedback methods
    submitFeedback,
    getFeedbackByStudent,
    getFeedbackForInstructor,
    getFeedbackForCourse,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
