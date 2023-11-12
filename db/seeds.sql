INSERT INTO department (name)
VALUES  ("Pharmacy"),
        ("Medicine"),
        ("Digital Health"),
        ("IT");
       
INSERT INTO role (title, salary, department_id)
VALUES  ("Pharmacist", 95000, 1),
        ("Senior Pharmacist", 120000, 1),
        ("Gen Med Intern", 80000, 2),
        ("Geen Med Registrar", 150000, 2),
        ("Gen Med Consultant", 250000, 2),
        ("DHT Apps Support", 110000, 3),
        ("DHT Clinical Analyst", 115000, 3),
        ("DHT Ops Manager", 125000, 3),
        ("IT Service Desk Officer", 70000, 4),
        ("IT Service Desk Team Lead", 85000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
        ("Euna", "Pham", 2, null),
        ("Leng", "Cam", 1, 1),
        ("TestDB", "GM Consultant", 5, null),
        ("TestDB", "GM Registrar", 4, 3),
        ("TestDB", "GM Intern", 3, 4),
        ("TestDB", "DHT Ops Manager", 8, null),      
        ("TestDB", "DHT Support", 6, 6),
        ("TestDB", "DHT Clin Analyst", 7, 6),
        ("TestDB", "IT Service Desk Team Lead", 10, null),
        ("TestDB", "IT Service Desk Officer", 9, 9);
        
