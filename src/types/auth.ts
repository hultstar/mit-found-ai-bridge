
export interface User {
  id: string;
  email: string;
  name: string;
  enrollmentNumber: string;
  isVerified: boolean;
  role: "student" | "admin";
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, enrollmentNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkEnrollment: (enrollmentNumber: string) => Promise<boolean>;
}
