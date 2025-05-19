import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Service</h1>
          <p className="mt-2 text-gray-600">
            Manage your courses with ease
          </p>
          
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">API Endpoints</h2>
              <div className="mt-4 space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-md font-medium text-gray-900">Courses</h3>
                  <ul className="mt-2 space-y-2">
                    <li><code className="bg-gray-100 p-1 rounded">GET /api/courses</code> - List all courses</li>
                    <li><code className="bg-gray-100 p-1 rounded">GET /api/courses/:id</code> - Get course by ID</li>
                    <li><code className="bg-gray-100 p-1 rounded">POST /api/courses</code> - Create a new course</li>
                    <li><code className="bg-gray-100 p-1 rounded">PUT /api/courses/:id</code> - Update a course</li>
                    <li><code className="bg-gray-100 p-1 rounded">DELETE /api/courses/:id</code> - Delete a course</li>
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
