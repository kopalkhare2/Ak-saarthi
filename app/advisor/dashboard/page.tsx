export default function AdvisorDashboard() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500 mb-2">
          Welcome, Advisor 👋
        </h1>

        <p className="text-gray-600 mb-8">
          Here's your AK Saarthi dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Total Clients</h2>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Policies</h2>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Premiums Due</h2>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Appointments</h2>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>
      </div>
    </main>
  );
}