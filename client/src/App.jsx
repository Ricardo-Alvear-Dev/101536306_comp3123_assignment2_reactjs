import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import AddEmployees from "./pages/AddEmployees";
import EditEmployees from "./pages/EditEmployees";
import Employees from "./pages/Employees";
import FindEmployees from "./pages/FindEmployees";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [id, setId] = useState();

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/add" element={<AddEmployees />} />
          <Route path={`/employees/${id}`} element={<FindEmployees />} />
          <Route path={`/employees/:id/edit`} element={<EditEmployees />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
