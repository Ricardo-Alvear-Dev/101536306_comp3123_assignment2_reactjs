import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

const Employees = () => {
  const {
    data: employees = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["getEmployees"],

    queryFn: async () => {
      const response = await axios.get("/api/v1/emp/employees");

      console.log("Employees:", response.data);

      return response.data;
    },
  });

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <p className="text-slate-400">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-slate-800 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-400">
            Failed to Load Employees
          </h2>

          <p className="mt-3 text-slate-400">
            {error.response?.data?.message ||
              "Something went wrong. Please try again."}
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-500"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  console.log("Employees:", employees);
  console.log("Is Array:", Array.isArray(employees));

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-400">
              Employee Management
            </p>

            <h1 className="text-4xl font-bold">Employees</h1>

            <p className="mt-3 text-slate-400">
              View and manage your employee records.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/"
              className="rounded-lg border border-slate-600 px-5 py-3 font-medium text-slate-200 transition-colors hover:bg-slate-800"
            >
              Dashboard
            </Link>

            <Link
              to="/employees/add"
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors hover:bg-blue-500"
            >
              + Add Employee
            </Link>
          </div>
        </header>

        {/* Employee Count */}
        <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800 p-6">
          <p className="text-sm font-medium text-slate-400">Total Employees</p>

          <p className="mt-2 text-4xl font-bold">{employees.length}</p>
        </div>

        {/* Employee Cards */}
        {employees.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-12 text-center">
            <h2 className="text-xl font-semibold">No Employees Found</h2>

            <p className="mt-3 text-slate-400">
              Start by adding your first employee.
            </p>

            <Link
              to="/employees/add"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
            >
              Add Employee
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {employees.map((employee) => (
              <div
                key={employee._id}
                className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl"
              >
                {/* Profile Section */}
                <div className="flex flex-col items-center border-b border-slate-700 bg-slate-800/80 px-6 py-8 text-center">
                  {/* Profile Picture */}
                  {employee.profile_picture ? (
                    <img
                      src={employee.profile_picture}
                      alt={`${employee.first_name} ${employee.last_name}`}
                      className="mb-4 h-24 w-24 rounded-full border-4 border-blue-500/30 object-cover shadow-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-500/30 bg-blue-500/10 text-3xl font-bold text-blue-400">
                      {employee.first_name?.[0]}
                      {employee.last_name?.[0]}
                    </div>
                  )}

                  <h2 className="text-xl font-bold">
                    {employee.first_name} {employee.last_name}
                  </h2>

                  <p className="mt-2 text-sm text-blue-400">
                    {employee.position}
                  </p>
                </div>

                {/* Employee Information */}
                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-200">
                      {employee.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Department
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      {employee.department}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Salary
                    </p>
                    <p className="mt-1 text-sm font-semibold text-green-400">
                      {employee.salary != null
                        ? `$${Number(employee.salary).toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Date Joined
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      {employee.date_of_joining
                        ? new Date(
                            employee.date_of_joining,
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 border-t border-slate-700 p-6">
                  <Link
                    to={`/employees/${employee._id}`}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                  >
                    View
                  </Link>

                  <Link
                    to={`/employees/${employee._id}/edit`}
                    className="flex-1 rounded-lg border border-slate-600 px-4 py-3 text-center text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
