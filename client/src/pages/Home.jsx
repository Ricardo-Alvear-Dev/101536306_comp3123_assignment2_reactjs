import { Link } from "react-router";

const Home = () => {
  return (
    <div>
      <form action="">
        <h3>Insert a id to find a employee</h3>
        <input type="number" name="id" id="id" placeholder="Employee id" />
        <button type="submit">Submit</button>
      </form>

      <nav>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/employees">Employee List</Link>
        <Link to="/employees/add">Add Employee</Link>
      </nav>
    </div>
  );
};

export default Home;
