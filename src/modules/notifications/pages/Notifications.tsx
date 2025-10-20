export default function Notifications() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Notifications
          </h1>
          <p className="text-gray-600 mb-8">
            Stay updated with your activity and important updates
          </p>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No notifications yet
            </h2>
            <p className="text-gray-600">
              You'll see notifications about messages, bookings, and updates here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
