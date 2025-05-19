'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/MockAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Lock, Calendar, GraduationCap, Pencil, Save, X } from 'lucide-react';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  studentId?: string;
  department?: string;
  joinDate: string;
  avatarUrl?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (user) {
      // Simulate fetching user profile data
      const fetchProfile = async () => {
        try {
          // Simulated API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mock user profile data
          const mockProfile: UserProfile = {
            id: user.id,
            name: user.name || 'John Doe',
            email: user.email || 'john.doe@example.com',
            role: user.role as 'student' | 'instructor' | 'admin',
            studentId: user.role === 'student' ? 'B1234567' : undefined,
            department: user.role === 'student' ? 'Computer Science' : 'Computer Science Department',
            joinDate: '2023-09-01',
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`,
          };
          
          setFormData(mockProfile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the user profile in the auth context
      if (formData.name) {
        await updateProfile({ name: formData.name });
      }
      
      setIsEditing(false);
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Card */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="items-center text-center">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {formData.avatarUrl ? (
                    <img 
                      src={formData.avatarUrl} 
                      alt={formData.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardTitle className="mt-4">{formData.name}</CardTitle>
              <CardDescription className="capitalize">
                {formData.role}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{formData.email}</span>
              </div>
              {formData.studentId && (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{formData.studentId}</span>
                </div>
              )}
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{formData.department}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  Member since {new Date(formData.joinDate || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile Information</CardTitle>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form data
                        if (user) {
                          setFormData({
                            ...formData,
                            name: user.name || '',
                          });
                        }
                      }}
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSubmit}
                      disabled={!formData.name?.trim()}
                    >
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <div className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                        {formData.name}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                      {formData.email}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Contact admin to change your email
                    </p>
                  </div>
                  {formData.studentId && (
                    <div className="space-y-2">
                      <Label>Student ID</Label>
                      <div className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                        {formData.studentId}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="text-sm py-2 px-3 border rounded-md bg-muted/50 capitalize">
                      {formData.role}
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!formData.name?.trim()}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    placeholder="Enter current password" 
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    placeholder="Enter new password" 
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm new password" 
                    disabled
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  disabled
                >
                  Update Password
                </Button>
                <p className="text-sm text-muted-foreground">
                  Password management is not available in demo mode.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
