import { useState } from "react";
import { Link, useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  const [activeAction, setActiveAction] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [shaking, setShaking] = useState(false);

  const isValid = /^\d+$/.test(employeeId) && Number(employeeId) > 1;

  const openAction = (action) => {
    setActiveAction(activeAction === action ? null : action);
    setEmployeeId("");
    setInvalid(false);
    setShaking(false);
  };

  const triggerError = () => {
    setInvalid(true);
    setShaking(false);

    requestAnimationFrame(() => {
      setShaking(true);
    });
  };

  const handleSubmit = () => {
    if (!isValid) {
      triggerError();
      return;
    }

    if (activeAction === "find") {
      navigate(`/employees/${employeeId}`);
    } else if (activeAction === "edit") {
      navigate(`/employees/${employeeId}/edit`);
    }
  };

  const cardStyle =
    "group flex flex-col rounded-2xl border border-slate-700 " +
    "bg-slate-800 p-6 shadow-lg transition-all duration-300 " +
    "hover:-translate-y-1 hover:border-blue-400 " +
    "hover:bg-slate-700 hover:shadow-xl";

  const navigationCards = [
    {
      title: "Login",
      description: "Access your account",
      path: "/login",
      icon: "↪",
    },
    {
      title: "Sign Up",
      description: "Create a new account",
      path: "/signup",
      icon: "+",
    },
    {
      title: "Employees",
      description: "View all employees",
      path: "/employees",
      icon: "☷",
    },
    {
      title: "Add Employee",
      description: "Register a new employee",
      path: "/employees/add",
      icon: "+",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Employee Management
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>

          <p className="mt-3 text-slate-400">
            Manage your employees and account in one place.
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {navigationCards.map((card) => (
            <Link key={card.path} to={card.path} className={cardStyle}>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl text-blue-400">
                {card.icon}
              </div>

              <h2 className="text-xl font-semibold">{card.title}</h2>

              <p className="mt-2 text-sm text-slate-400">{card.description}</p>

              <span className="mt-6 text-sm font-medium text-blue-400 group-hover:text-blue-300">
                Open →
              </span>
            </Link>
          ))}

          {/* Find and Edit Cards */}
          {["find", "edit"].map((action) => (
            <div key={action} className={cardStyle}>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl text-blue-400">
                {action === "find" ? "⌕" : "✎"}
              </div>

              <h2 className="text-xl font-semibold">
                {action === "find" ? "Find Employee" : "Edit Employee"}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {action === "find"
                  ? "Search for an employee by ID"
                  : "Update employee information"}
              </p>

              {activeAction !== action ? (
                <button
                  type="button"
                  onClick={() => openAction(action)}
                  className="mt-6 self-start text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  Enter Employee ID →
                </button>
              ) : (
                <div className="mt-6 space-y-3">
                  <input
                    type="number"
                    min="2"
                    step="1"
                    value={employeeId}
                    placeholder="Enter employee ID"
                    aria-label="Employee ID"
                    aria-invalid={invalid}
                    onChange={(e) => {
                      setEmployeeId(e.target.value);
                      setInvalid(false);
                    }}
                    onBlur={() => {
                      if (employeeId && !isValid) {
                        triggerError();
                      }
                    }}
                    onAnimationEnd={() => setShaking(false)}
                    className={`w-full rounded-lg border bg-slate-900 px-4 py-3 text-white outline-none transition-colors ${
                      invalid
                        ? "border-red-500 bg-red-950/30"
                        : "border-slate-600 focus:border-blue-400"
                    } ${shaking ? "animate-shake" : ""}`}
                  />

                  {invalid && (
                    <p className="text-sm text-red-400">
                      ID must be a whole number greater than 1.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className={`w-full rounded-lg px-4 py-3 font-semibold transition-all ${
                      isValid
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "cursor-not-allowed bg-slate-700 text-slate-500 opacity-60"
                    }`}
                  >
                    {action === "find" ? "Find Employee" : "Edit Employee"}
                  </button>

                  <button
                    type="button"
                    onClick={() => openAction(action)}
                    className="w-full py-2 text-sm text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
