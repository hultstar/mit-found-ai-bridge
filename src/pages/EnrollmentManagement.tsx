
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { BadgeCheck, Search, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { showToast } from "@/components/Toast";
import { mockEnrollments, Enrollment } from "@/data/mockEnrollments";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const EnrollmentManagement = () => {
  // State for enrollment data
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for the new enrollment form
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEnrollment, setNewEnrollment] = useState({
    studentName: "",
    enrollmentNumber: "",
    department: "",
    year: 1
  });
  
  // State for deletion confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<string | null>(null);
  
  // Filter enrollments based on search query
  const filteredEnrollments = enrollments.filter(enrollment => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      enrollment.studentName.toLowerCase().includes(searchTerm) ||
      enrollment.enrollmentNumber.toLowerCase().includes(searchTerm) ||
      enrollment.department.toLowerCase().includes(searchTerm)
    );
  });
  
  // Handle input changes for new enrollment
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEnrollment({
      ...newEnrollment,
      [name]: value
    });
  };
  
  // Handle department selection
  const handleDepartmentChange = (value: string) => {
    setNewEnrollment({
      ...newEnrollment,
      department: value
    });
  };
  
  // Handle year selection
  const handleYearChange = (value: string) => {
    setNewEnrollment({
      ...newEnrollment,
      year: parseInt(value)
    });
  };
  
  // Add new enrollment
  const handleAddEnrollment = () => {
    // Validate form
    if (!newEnrollment.studentName || !newEnrollment.enrollmentNumber || !newEnrollment.department) {
      showToast({
        type: "error",
        title: "Missing Information",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    // Check if enrollment number already exists
    if (enrollments.some(e => e.enrollmentNumber === newEnrollment.enrollmentNumber)) {
      showToast({
        type: "error",
        title: "Duplicate Enrollment",
        description: "This enrollment number already exists."
      });
      return;
    }
    
    // Create new enrollment
    const newEnrollmentEntry: Enrollment = {
      id: `enrl-${Date.now()}`,
      studentName: newEnrollment.studentName,
      enrollmentNumber: newEnrollment.enrollmentNumber,
      department: newEnrollment.department,
      year: newEnrollment.year,
      isUsed: false
    };
    
    // Add to enrollments array
    setEnrollments([...enrollments, newEnrollmentEntry]);
    
    // Reset form and close dialog
    setNewEnrollment({
      studentName: "",
      enrollmentNumber: "",
      department: "",
      year: 1
    });
    setIsAddDialogOpen(false);
    
    showToast({
      type: "success",
      title: "Enrollment Added",
      description: "New enrollment has been added successfully."
    });
  };
  
  // Handle deletion
  const confirmDelete = (id: string) => {
    setEnrollmentToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const deleteEnrollment = () => {
    if (!enrollmentToDelete) return;
    
    const updatedEnrollments = enrollments.filter(e => e.id !== enrollmentToDelete);
    setEnrollments(updatedEnrollments);
    setIsDeleteDialogOpen(false);
    setEnrollmentToDelete(null);
    
    showToast({
      type: "success",
      title: "Enrollment Deleted",
      description: "The enrollment has been deleted successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Enrollment Management</h1>
          <p className="text-gray-500">Manage student enrollment numbers for verification</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-mit-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Enrollment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Enrollment</DialogTitle>
              <DialogDescription>
                Enter the details for the new student enrollment
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  name="studentName"
                  value={newEnrollment.studentName}
                  onChange={handleInputChange}
                  placeholder="Enter student full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                <Input
                  id="enrollmentNumber"
                  name="enrollmentNumber"
                  value={newEnrollment.enrollmentNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. MIT2023001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={handleDepartmentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Study Year</Label>
                <Select onValueChange={handleYearChange} defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-mit-red hover:bg-red-700" onClick={handleAddEnrollment}>
                Add Enrollment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Student Enrollments</CardTitle>
          <CardDescription>
            These enrollment numbers are used for student verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search enrollments..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-shrink-0 gap-2">
              <Button variant="outline">
                Export CSV
              </Button>
              <Button variant="outline">
                Import CSV
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enrollment Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.length > 0 ? (
                  filteredEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">{enrollment.enrollmentNumber}</TableCell>
                      <TableCell>{enrollment.studentName}</TableCell>
                      <TableCell>{enrollment.department}</TableCell>
                      <TableCell>Year {enrollment.year}</TableCell>
                      <TableCell>
                        <Badge className={enrollment.isUsed ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                          {enrollment.isUsed ? "Registered" : "Available"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon" className="text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600"
                            onClick={() => confirmDelete(enrollment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      No enrollments found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredEnrollments.length} of {enrollments.length} enrollments
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this enrollment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteEnrollment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnrollmentManagement;
