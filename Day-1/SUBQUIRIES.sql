-- Find employees earning more than the average salary
SELECT first_name, last_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Find departments with high-salary employees
SELECT dept_name
FROM departments
WHERE dept_id IN (
    SELECT dept_id 
    FROM employees 
    WHERE salary > 80000
);