SELECT *
FROM department
INNER JOIN role ON department.id = role.department_id
INNER JOIN employee on role.id = employee.role_id;