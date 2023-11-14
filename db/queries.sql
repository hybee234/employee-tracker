SELECT *
FROM department
INNER JOIN role ON department.id = role.department_id
INNER JOIN employee on role.id = employee.role_id;


   SELECT
        department.name as Department_name,
        role.title as Role,
        role.salary as Salary,
        FROM role,
        JOIN department ON role.department_id = department.id;
        -- ORDER BY department.name;
    


SELECT 
d.name AS Department_Name,
r.title AS Role_Title,
r.salary AS Role_Salary
FROM role r
JOIN department d ON r.department_id = d.id
ORDER BY d.name;


SELECT 
    d.name AS Department_Name,
    r.title AS Role_Title,
    e1.first_name AS First_name,
    e1.last_name AS Last_name,
    r.salary AS Role_Salary,
    e2.first_name AS Manager_First_Name,
    e2.last_name AS Manager_Last_Name
    FROM employee e1
    JOIN role r ON e1.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee e2 ON e1.manager_id = e2.id    
    ORDER BY d.name, r.salary DESC;