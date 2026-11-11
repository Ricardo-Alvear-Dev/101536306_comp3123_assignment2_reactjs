import express from "express";
import {
  deleteEmployeesIdController,
  getAllEmployeeController,
  getEmployeeSearchController,
  getEmployeesIdController,
  postAllEmployeesController,
  putEmployeesIdController,
} from "../../controllers/employee/employee.controllers";

const employeeRouter = express.Router();

employeeRouter
  .route("/employees")
  .get(getAllEmployeeController)
  .post(postAllEmployeesController)
  .delete(deleteEmployeesIdController);

employeeRouter.route("/employees/search").get(getEmployeeSearchController);

employeeRouter
  .route("/employees/:eid")
  .get(getEmployeesIdController)
  .patch(putEmployeesIdController);

export default employeeRouter;
