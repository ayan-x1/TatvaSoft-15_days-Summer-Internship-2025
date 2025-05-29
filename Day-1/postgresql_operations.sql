-- Create a sample database
CREATE DATABASE company_db;

-- Connect to the database
\c company_db;

-- Create tables
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL,
    location VARCHAR(100)
);

CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    salary DECIMAL(10,2),
    dept_id INTEGER REFERENCES departments(dept_id),
    hire_date DATE
);

-- INSERT operations
-- Insert data into departments
INSERT INTO departments (dept_name, location) VALUES
    ('IT', 'Bangalore'),
    ('HR', 'Mumbai'),
    ('Finance', 'Gujarat'),
    ('Marketing', 'Delhi');

-- Insert data into employees
INSERT INTO employees (first_name, last_name, email, salary, dept_id, hire_date) VALUES
    ('Ayan', 'pathan', 'ayanpathan1@gmail.com', 75000.00, 1, '2023-01-15'),
    ('Arsh', 'vohra', 'arshvohra12@gmail.com', 82000.00, 2, '2023-02-20'),
    ('Jainish', 'Patel', 'jd123@gmail.com', 68000.00, 1, '2023-03-10'),
    ('Karan', 'Bhatt', 'karanbhatt1234@gmail.com', 90000.00, 3, '2023-04-05');

-- SELECT operations
-- Basic SELECT
SELECT * FROM employees;

-- SELECT with WHERE clause
SELECT first_name, last_name, salary 
FROM employees 
WHERE salary > 80000;

-- SELECT with JOIN
SELECT e.first_name, e.last_name, d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id;

-- UPDATE operations
-- Update single record
UPDATE employees 
SET salary = 85000.00 
WHERE emp_id = 1;

-- Update multiple records
UPDATE employees 
SET salary = salary * 1.1 
WHERE dept_id = 1;

-- DELETE operations
-- Delete single record
DELETE FROM employees 
WHERE emp_id = 4;

-- Delete multiple records
DELETE FROM employees 
WHERE dept_id = 2;

-- Subqueries examples
-- Subquery in WHERE clause
SELECT first_name, last_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Subquery in FROM clause
SELECT dept_name, avg_salary
FROM (
    SELECT d.dept_name, AVG(e.salary) as avg_salary
    FROM departments d
    JOIN employees e ON d.dept_id = e.dept_id
    GROUP BY d.dept_name
) AS dept_stats
WHERE avg_salary > 75000;

-- Subquery in SELECT clause
SELECT 
    first_name,
    last_name,
    salary,
    (SELECT AVG(salary) FROM employees) as company_avg_salary
FROM employees;

-- Subquery with IN operator
SELECT dept_name
FROM departments
WHERE dept_id IN (
    SELECT dept_id 
    FROM employees 
    WHERE salary > 80000
);

-- Subquery with EXISTS
SELECT dept_name
FROM departments d
WHERE EXISTS (
    SELECT 1 
    FROM employees e 
    WHERE e.dept_id = d.dept_id 
    AND e.salary > 80000
);

-- Clean up (optional)
-- DROP TABLE employees;
-- DROP TABLE departments;
-- DROP DATABASE company_db; 