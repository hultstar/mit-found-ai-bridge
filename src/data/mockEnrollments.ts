
export interface Enrollment {
  id: string;
  enrollmentNumber: string;
  studentName: string;
  department: string;
  year: number;
  isUsed: boolean;
}

export const mockEnrollments: Enrollment[] = [
  {
    id: "enrl-001",
    enrollmentNumber: "MIT2022001",
    studentName: "Rahul Sharma",
    department: "Computer Science",
    year: 2,
    isUsed: false
  },
  {
    id: "enrl-002",
    enrollmentNumber: "MIT2022002",
    studentName: "Priya Patel",
    department: "Information Technology",
    year: 2,
    isUsed: false
  },
  {
    id: "enrl-003",
    enrollmentNumber: "MIT2021023",
    studentName: "Amit Kumar",
    department: "Mechanical Engineering",
    year: 3,
    isUsed: false
  },
  {
    id: "enrl-004",
    enrollmentNumber: "MIT2021045",
    studentName: "Sneha Gupta",
    department: "Electronics",
    year: 3,
    isUsed: false
  },
  {
    id: "enrl-005",
    enrollmentNumber: "MIT2020067",
    studentName: "Vijay Singh",
    department: "Computer Science",
    year: 4,
    isUsed: false
  },
  {
    id: "enrl-006",
    enrollmentNumber: "MIT2023012",
    studentName: "Neha Verma",
    department: "Information Technology",
    year: 1,
    isUsed: false
  },
  {
    id: "enrl-007",
    enrollmentNumber: "MIT2023098",
    studentName: "Ravi Desai",
    department: "Data Science",
    year: 1,
    isUsed: false
  },
  {
    id: "enrl-008",
    enrollmentNumber: "MIT2020103",
    studentName: "Sunil Rao",
    department: "Artificial Intelligence",
    year: 4,
    isUsed: false
  },
  {
    id: "enrl-009",
    enrollmentNumber: "MIT2022134",
    studentName: "Ananya Reddy",
    department: "Computer Science",
    year: 2,
    isUsed: false
  },
  {
    id: "enrl-010",
    enrollmentNumber: "MIT2021087",
    studentName: "Karan Malhotra",
    department: "Robotics",
    year: 3,
    isUsed: false
  }
];
