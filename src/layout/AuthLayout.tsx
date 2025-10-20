import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-4 lg:py-12 bg-blue-600">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-white">
            <h2 className="text-3xl font-bold tracking-tight">
              Verbaac Connect
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Your gateway to student housing, roommates, and marketplace opportunities.
            </p>
          </div>
          <div className="mt-10">
            <img
              className="w-full rounded-lg shadow-lg"
              src="/api/placeholder/400/300"
              alt="Students collaborating"
            />
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <div className="lg:hidden">
              <h2 className="text-2xl font-bold text-blue-600">
                Verbaac Connect
              </h2>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
