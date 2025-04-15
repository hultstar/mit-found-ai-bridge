
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContextType, User } from "@/types/auth";
import { showToast } from "@/components/Toast";
import { mockEnrollments } from "@/data/mockEnrollments";

// Mock user storage
const USERS_STORAGE_KEY = "mitlostfound_users";
const CURRENT_USER_KEY = "mitlostfound_current_user";

// Default context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  checkEnrollment: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Get users from storage
  const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  };

  // Save users to storage
  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  // Check if enrollment number exists in admin's list
  const checkEnrollment = async (enrollmentNumber: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = mockEnrollments.some(enrollment => 
          enrollment.enrollmentNumber === enrollmentNumber && !enrollment.isUsed
        );
        resolve(isValid);
      }, 1000);
    });
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API request
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const foundUser = users.find(u => u.email === email);
        
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
          showToast({
            type: "success",
            title: "Login Successful",
            description: `Welcome back, ${foundUser.name}!`
          });
          resolve(true);
        } else if (email === "admin@mit.edu" && password) {
          // Default admin account
          const adminUser: User = {
            id: "admin-1",
            email: "admin@mit.edu",
            name: "Admin",
            enrollmentNumber: "ADMIN001",
            isVerified: true,
            role: "admin"
          };
          setUser(adminUser);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
          showToast({
            type: "success",
            title: "Admin Login Successful",
            description: "Welcome back, Admin!"
          });
          resolve(true);
        } else {
          showToast({
            type: "error",
            title: "Login Failed",
            description: "Invalid email or password"
          });
          resolve(false);
        }
        setIsLoading(false);
      }, 1000);
    });
  };

  // Signup function
  const signup = async (
    name: string, 
    email: string, 
    enrollmentNumber: string, 
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // First check if enrollment number is valid
    const isEnrollmentValid = await checkEnrollment(enrollmentNumber);
    
    if (!isEnrollmentValid) {
      showToast({
        type: "error",
        title: "Signup Failed",
        description: "Invalid enrollment number or already registered"
      });
      setIsLoading(false);
      return false;
    }
    
    // Check if user already exists
    const users = getUsers();
    if (users.some(user => user.email === email)) {
      showToast({
        type: "error",
        title: "Signup Failed",
        description: "Email already registered"
      });
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      enrollmentNumber,
      isVerified: false, // Requires admin verification
      role: "student"
    };
    
    // Save user
    saveUsers([...users, newUser]);
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    // Mark enrollment as used (would be done by admin in real app)
    // This is just for the prototype
    
    showToast({
      type: "success",
      title: "Signup Successful",
      description: "Your account has been created successfully!"
    });
    
    setIsLoading(false);
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    showToast({
      type: "info",
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        signup, 
        logout,
        checkEnrollment
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
