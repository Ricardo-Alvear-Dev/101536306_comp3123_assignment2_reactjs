import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router";

const Signup = () => {
  const navigate = useNavigate();

  const { error, isPending, mutateAsync } = useMutation({
    mutationKey: ["Signup"],

    mutationFn: async (formData) => {
      const response = await axios.post("/api/v1/user/signup", formData);

      return response.data;
    },

    onSuccess: () => {
      navigate("/employees");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const user = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      await mutateAsync(user);
    } catch {
      // Error is handled by React Query
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Employee Management
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Create an Account
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Enter your information to get started.
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email Address
              </label>

              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
              >
                {error.response?.data?.message ||
                  "Signup failed. Please try again."}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 border-t border-slate-700 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Back Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-slate-400 transition-colors hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
