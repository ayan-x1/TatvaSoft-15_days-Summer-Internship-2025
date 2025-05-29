-- Give a raise to an employee
UPDATE employees 
SET salary = 85000.00 
WHERE emp_id = 1;

-- Give a 10% raise to all IT department employees
UPDATE employees 
SET salary = salary * 1.1 
WHERE dept_id = 1;