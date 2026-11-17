import { BrowserRouter, Link, Route, Routes } from "react-router";

const Home = () => {
  return (
    <div>
      <BrowserRouter>
        <nav>
          <Link to={"/login"}>Login</Link>
          <Link to={"/signup"}>Signup</Link>
          <Link to={"/employees"}>Employee List</Link>
          <Link to={"/employees/add"}>Add Employee</Link>
          <Link to={"/employees/:id"}>View employees details</Link>
          <Link to={"/employees/:id/edit"}>Update employee</Link>
        </nav>
      </BrowserRouter>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/add" element={<AddEmployees />} />
        <Route path="/employees/:id" element={<FindEmployee />} />
        <Route path="/employees/:id/edit" element={<EditEmployee />} />
      </Routes>
    </div>
  );
};

export default Home;
