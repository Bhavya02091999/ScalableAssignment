export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Feedback Service</h1>
          <p className="mt-2 text-gray-600">
            Submit and manage course feedback
          </p>
          
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">API Endpoints</h2>
              <div className="mt-4 space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-md font-medium text-gray-900">Feedback</h3>
                  <ul className="mt-2 space-y-2">
                    <li><code className="bg-gray-100 p-1 rounded">GET /api/feedback</code> - List all feedback (filterable by courseId)</li>
                    <li><code className="bg-gray-100 p-1 rounded">GET /api/feedback/:id</code> - Get feedback by ID</li>
                    <li><code className="bg-gray-100 p-1 rounded">POST /api/feedback</code> - Submit new feedback</li>
                    <li><code className="bg-gray-100 p-1 rounded">PUT /api/feedback/:id</code> - Update feedback</li>
                    <li><code className="bg-gray-100 p-1 rounded">DELETE /api/feedback/:id</code> - Delete feedback</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900">Analytics</h3>
                  <ul className="mt-2 space-y-2">
                    <li><code className="bg-gray-100 p-1 rounded">GET /api/analytics/course/:courseId</code> - Get analytics for a course</li>
                    <li><code className="bg-gray-100 p-1 rounded">GET /api/analytics/instructor/:instructorId</code> - Get analytics for an instructor</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
