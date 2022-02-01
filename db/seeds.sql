INSERT INTO department (department_name) VALUES ("Sales");
INSERT INTO department (department_name) VALUES ("Engineering");
INSERT INTO department (department_name) VALUES ("Finance");
INSERT INTO department (department_name) VALUES ("Legal");


INSERT INTO role (title, salary, department_id) VALUES (
    "Salesperson", "80000", "1"
);

INSERT INTO role (title, salary, department_id) VALUES (
    "Lead Engineer", "150000", "2"
);

INSERT INTO role (title, salary, department_id) VALUES (
    "Software Enginer", "250000", "2"
);

INSERT INTO role (title, salary, department_id) VALUES (
    "Account Manager", "160000", "3"
);

INSERT INTO role (title, salary, department_id) VALUES (
    "Accountant", "125000", "3"
);

INSERT INTO role (title, salary, department_id) VALUES (
    "Legal Team Lead",    "250000",    "4"
);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (
    "Mike",    "Chan",    "1",    "1"
);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (
    "Ashley",    "Rodriguez",    "2",    "1"
);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (
    "Kevin",    "Tupik",    "2",    "1"
);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (
    "Hunal",    "Sinh",    "3",    "1"
);
