import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Student Feedback System',
  description: 'User dashboard for the Student Feedback System',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
