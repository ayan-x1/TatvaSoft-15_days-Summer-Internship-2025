-- View all employees
SELECT * FROM employees;

-- View all departments
SELECT * FROM departments;

-- Find employees with salary greater than 80000
SELECT first_name, last_name, salary 
FROM employees 
WHERE salary > 80000;