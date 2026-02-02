export const studentData = [
  // Original Data (Updated with some striped belts)
  { id: 1, name: 'Daniel LaRusso', rank: 'Black', dob: '01/01/2007', phone: '555-1234', instructors: 'Sensei Miyagi', age: 17, status: 'Active', dojo: 'Miyagi-Do' },
  { id: 2, name: 'Johnny Lawrence', rank: 'Black', dob: '02/02/1972', phone: '555-5678', instructors: 'Sensei Cobra Kai', age: 52, status: 'Inactive', dojo: 'Cobra Kai' },
  { id: 3, name: 'Miguel Diaz', rank: 'Brown Stripe 2', dob: '03/03/2008', phone: '555-9012', instructors: 'Sensei Diaz', age: 16, status: 'Active', dojo: 'Eagle Fang' }, // Updated
  { id: 4, name: 'Samantha LaRusso', rank: 'Brown Stripe 1', dob: '04/04/2008', phone: '555-3456', instructors: '', age: 16, status: 'Active', dojo: 'Miyagi-Do' }, // Updated
  { id: 5, name: 'Eli Moskowitz', rank: 'Green Stripe', dob: '05/05/2008', phone: '555-7890', instructors: 'Sensei Moskowitz', age: 16, status: 'Active', dojo: 'Eagle Fang' }, // Updated
  { id: 6, name: 'Robby Keene', rank: 'Black', dob: '02/04/2008', phone: '555-4422', instructors: 'Sensei Keene', age: 16, status: 'Active', dojo: 'Miyagi-Do' },
  { id: 7, name: 'Tory Nichols', rank: 'Brown Stripe 2', dob: '07/07/2007', phone: '555-2345', instructors: 'Sensei Nichols', age: 17, status: 'Active', dojo: 'Cobra Kai' }, // Updated
  { id: 8, name: 'Demetri Alexopoulos', rank: 'Green Stripe', dob: '08/08/2008', phone: '555-6789', instructors: 'Sensei Alexopoulos', age: 16, status: 'Inactive', dojo: 'Miyagi-Do' }, // Updated

  // New Data (IDs 9-50) (Mixed with new striped ranks)
  { id: 9, name: 'Kyler Park', rank: 'Purple', dob: '09/12/2007', phone: '555-1122', instructors: 'Sensei Park', age: 17, status: 'Active', dojo: 'Cobra Kai' },
  { id: 10, name: 'Aisha Robinson', rank: 'Green', dob: '04/15/2008', phone: '555-3344', instructors: 'Sensei Robinson', age: 16, status: 'Inactive', dojo: 'Eagle Fang' },
  { id: 11, name: 'Bert', rank: 'Yellow Stripe', dob: '06/20/2010', phone: '555-5566', instructors: '', age: 14, status: 'Active', dojo: 'Eagle Fang' }, // Updated
  { id: 12, name: 'Nate', rank: 'Yellow Stripe', dob: '08/11/2010', phone: '555-7788', instructors: 'Sensei Nate', age: 14, status: 'Active', dojo: 'Miyagi-Do' }, // Updated
  { id: 13, name: 'Chris', rank: 'Green', dob: '01/30/2007', phone: '555-9900', instructors: 'Sensei Chris', age: 17, status: 'Active', dojo: 'Miyagi-Do' },
  { id: 14, name: 'Mitch', rank: 'Green Stripe', dob: '03/14/2007', phone: '555-2211', instructors: 'Sensei Mitch', age: 17, status: 'Active', dojo: 'Eagle Fang' }, // Updated
  { id: 15, name: 'Kenny Payne', rank: 'Brown Stripe 1', dob: '11/05/2009', phone: '555-4433', instructors: 'Sensei Payne', age: 15, status: 'Active', dojo: 'Cobra Kai' }, // Updated
  { id: 16, name: 'Anthony LaRusso', rank: 'White', dob: '12/25/2009', phone: '555-6655', instructors: '', age: 15, status: 'Active', dojo: 'Miyagi-Do' },
  { id: 17, name: 'Piper Elswith', rank: 'Green Stripe', dob: '07/19/2007', phone: '555-8877', instructors: 'Sensei Elswith', age: 17, status: 'Inactive', dojo: 'Cobra Kai' }, // Updated
  { id: 18, name: 'Devon Lee', rank: 'Brown', dob: '05/22/2009', phone: '555-0099', instructors: 'Sensei Lee', age: 15, status: 'Active', dojo: 'Eagle Fang' },
  { id: 19, name: 'Stingray', rank: 'White', dob: '04/01/1985', phone: '555-1010', instructors: 'Sensei Stingray', age: 39, status: 'Inactive', dojo: 'Cobra Kai' },
  { id: 20, name: 'Shawn Payne', rank: 'Unranked', dob: '09/09/2006', phone: '555-2020', age: 18, status: 'Inactive', dojo: 'None' },
  { id: 21, name: 'Xander Stone', rank: 'Black', dob: '02/14/2006', phone: '555-3030', age: 18, status: 'Active', dojo: 'Topanga Karate' },
  { id: 22, name: 'Sarah Miller', rank: 'White', dob: '03/15/2012', phone: '555-4141', instructors: 'Sensei Miller', age: 12, status: 'Active', dojo: 'Miyagi-Do' },
  { id: 23, name: 'James Smith', rank: 'Yellow', dob: '06/10/2011', phone: '555-5252', instructors: 'Sensei Smith', age: 13, status: 'Active', dojo: 'Cobra Kai' },
  { id: 24, name: 'Emily Davis', rank: 'Green Stripe', dob: '11/11/2008', phone: '555-6363', instructors: 'Sensei Davis', age: 16, status: 'Active', dojo: 'Eagle Fang' }, // Updated
  { id: 25, name: 'Michael Brown', rank: 'Brown Stripe 1', dob: '01/05/2007', phone: '555-7474', instructors: 'Sensei Brown', age: 17, status: 'Inactive', dojo: 'Miyagi-Do' }, // Updated
  { id: 26, name: 'Jessica Wilson', rank: 'White', dob: '09/20/2013', phone: '555-8585', instructors: 'Sensei Wilson', age: 11, status: 'Active', dojo: 'Cobra Kai' },
  { id: 27, name: 'David Martinez', rank: 'Black', dob: '12/12/2005', phone: '555-9696', instructors: 'Sensei Martinez', age: 19, status: 'Active', dojo: 'Eagle Fang' },
  { id: 28, name: 'Sophia Anderson', rank: 'Yellow Stripe', dob: '04/04/2010', phone: '555-0707', instructors: 'Sensei Anderson', age: 14, status: 'Active', dojo: 'Miyagi-Do' }, // Updated
  { id: 29, name: 'Daniel Thomas', rank: 'Orange', dob: '08/08/2009', phone: '555-1818', instructors: 'Sensei Thomas', age: 15, status: 'Active', dojo: 'Cobra Kai' },
  { id: 30, name: 'Olivia Taylor', rank: 'Green', dob: '02/28/2008', phone: '555-2929', instructors: 'Sensei Taylor', age: 16, status: 'Inactive', dojo: 'Eagle Fang' },
  { id: 31, name: 'Lucas Moore', rank: 'Blue', dob: '10/10/2007', phone: '555-3030', instructors: 'Sensei Moore', age: 17, status: 'Active', dojo: 'Miyagi-Do' },
  { id: 32, name: 'Ava Jackson', rank: 'Brown Stripe 2', dob: '05/05/2006', phone: '555-4141', instructors: 'Sensei Jackson', age: 18, status: 'Active', dojo: 'Cobra Kai' }, // Updated
  { id: 33, name: 'Ethan White', rank: 'White', dob: '01/01/2014', phone: '555-5252', instructors: 'Sensei White', age: 10, status: 'Active', dojo: 'Eagle Fang' },
  { id: 34, name: 'Mia Harris', rank: 'Purple', dob: '07/07/2009', phone: '555-6363', instructors: 'Sensei Harris', age: 15, status: 'Active', dojo: 'Miyagi-Do' },
  { id: 35, name: 'Alexander Martin', rank: 'Black', dob: '03/03/2005', phone: '555-7474', instructors: 'Sensei Martin', age: 19, status: 'Inactive', dojo: 'Cobra Kai' },
  { id: 36, name: 'Charlotte Thompson', rank: 'Yellow Stripe', dob: '11/15/2011', phone: '555-8585', instructors: 'Sensei Thompson', age: 13, status: 'Active', dojo: 'Eagle Fang' }, // Updated
  { id: 37, name: 'Benjamin Garcia', rank: 'Green Stripe', dob: '09/09/2008', phone: '555-9696', instructors: 'Sensei Garcia', age: 16, status: 'Active', dojo: 'Miyagi-Do' }, // Updated
  { id: 38, name: 'Amelia Martinez', rank: 'Brown Stripe 1', dob: '04/20/2007', phone: '555-0707', instructors: 'Sensei Martinez', age: 17, status: 'Active', dojo: 'Cobra Kai' }, // Updated
  { id: 39, name: 'William Robinson', rank: 'Orange', dob: '12/12/2010', phone: '555-1818', instructors: 'Sensei Robinson', age: 14, status: 'Active', dojo: 'Eagle Fang' },
  { id: 40, name: 'Harper Clark', rank: 'White', dob: '06/06/2013', phone: '555-2929', instructors: 'Sensei Clark', age: 11, status: 'Inactive', dojo: 'Miyagi-Do' },
  { id: 41, name: 'James Rodriguez', rank: 'Blue', dob: '02/02/2009', phone: '555-3030', instructors: 'Sensei Rodriguez', age: 15, status: 'Active', dojo: 'Cobra Kai' },
  { id: 42, name: 'Evelyn Lewis', rank: 'Green Stripe', dob: '10/10/2008', phone: '555-4141', instructors: 'Sensei Lewis', age: 16, status: 'Active', dojo: 'Eagle Fang' }, // Updated
  { id: 43, name: 'Logan Walker', rank: 'Brown Stripe 2', dob: '08/08/2006', phone: '555-5252', instructors: 'Sensei Walker', age: 18, status: 'Active', dojo: 'Miyagi-Do' }, // Updated
  { id: 44, name: 'Abigail Hall', rank: 'Black', dob: '01/01/2005', phone: '555-6363', instructors: 'Sensei Hall', age: 19, status: 'Inactive', dojo: 'Cobra Kai' },
  { id: 45, name: 'Jack Allen', rank: 'Yellow Stripe', dob: '05/15/2012', phone: '555-7474', instructors: 'Sensei Allen', age: 12, status: 'Active', dojo: 'Eagle Fang' }, // Updated
  { id: 46, name: 'Ella Young', rank: 'Purple', dob: '11/11/2009', phone: '555-8585', instructors: 'Sensei Young', age: 15, status: 'Active', dojo: 'Miyagi-Do' },
  { id: 47, name: 'Henry Hernandez', rank: 'White', dob: '03/20/2014', phone: '555-9696', instructors: 'Sensei Hernandez', age: 10, status: 'Active', dojo: 'Cobra Kai' },
  { id: 48, name: 'Sofia King', rank: 'Orange', dob: '07/07/2010', phone: '555-0707', instructors: 'Sensei King', age: 14, status: 'Active', dojo: 'Eagle Fang' },
  { id: 49, name: 'Jackson Wright', rank: 'Green Stripe', dob: '09/09/2008', phone: '555-1818', instructors: 'Sensei Wright', age: 16, status: 'Inactive', dojo: 'Miyagi-Do' }, // Updated
  { id: 50, name: 'Avery Scott', rank: 'Brown Stripe 1', dob: '04/04/2007', phone: '555-2929', instructors: 'Sensei Scott', age: 17, status: 'Active', dojo: 'Cobra Kai' }, // Updated
];