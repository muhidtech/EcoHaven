"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import AdminHeader from "@/app/components/admin/AdminHeader";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  role: string;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password?: string;
}


export default function UsersPage() {
  const router = useRouter();
  const { isAdminLogin } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is admin after all hooks are declared
  const admin = isAdminLogin();
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    password: '',
  });
  
  // Notification state
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchUsers();
    
    // Set up polling for real-time updates every 5 seconds
    const interval = setInterval(fetchUsers, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to home if admin status changes
  useEffect(() => {
    if (!admin) {
      router.push("/");
    }
  }, [admin, router]);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    // Auto-dismiss after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle role selection change
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  // View user
  const handleViewUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setViewModalOpen(true);
    }
  };

  // Edit user
  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
      setEditModalOpen(true);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: selectedUser.id })
      });
      
      if (!response.ok) throw new Error('Failed to update user');
      
      setEditModalOpen(false);
      showNotification('success', 'User updated successfully');
      
      // Refresh the users data to ensure UI is in sync with backend
      await fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      showNotification('error', 'Failed to update user. Please try again.');
    }
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setDeleteModalOpen(true);
    }
  };

  // Handle delete confirmation
  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/users`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUser.id })
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      setDeleteModalOpen(false);
      showNotification('success', 'User deleted successfully');
      
      // Refresh the users data to ensure UI is in sync with backend
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      showNotification('error', 'Failed to delete user. Please try again.');
    }
  };

  // Add new user
  const handleAddUser = () => {
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      password: '',
    });
    setAddModalOpen(true);
  };

  // Handle add form submission
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to add user');
      
      setAddModalOpen(false);
      showNotification('success', 'User added successfully');
      
      // Refresh the users data to ensure UI is in sync with backend
      await fetchUsers();
    } catch (err) {
      console.error('Error adding user:', err);
      showNotification('error', 'Failed to add user. Please try again.');
    }
  };

  // Animation hooks
  const [tableRef, tableVisible] = useScrollAnimation({ threshold: 0.1 });
  
  // Return early with a message if user is not an admin
  if (!admin) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Unauthorized Access</h2>
          <p className="text-gray-700">You are not authorized to view this page.</p>
          <Button 
            onClick={() => router.push("/")}
            className="mt-6 bg-green-600 hover:bg-green-700"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminHeader title="User Management" />
      
      <main className="flex-1 p-6 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          {notification && (
            <Alert 
              className={`mb-4 ${
                notification.type === 'success' 
                  ? 'bg-green-50 border-green-500 text-green-700' 
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              <AlertTitle>
                {notification.type === 'success' ? 'Success' : 'Error'}
              </AlertTitle>
              <AlertDescription>{notification.message}</AlertDescription>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 h-6 w-6 p-0" 
                onClick={() => setNotification(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Alert>
          )}
          
          <div 
            ref={tableRef} 
            className={`bg-white shadow-md rounded-lg overflow-hidden transition-all duration-700 ${
              tableVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
                <Button 
                  onClick={handleAddUser}
                  className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105"
                >
                  Add New User
                </Button>
              </div>

              {isLoading ? (
                <div className="py-10 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
              ) : error ? (
                <div className="py-10 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : users.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-gray-600">No users found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto transition-all duration-500 ease-in-out">
                  <Table className="animate-fadeIn">
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => handleViewUser(user.id)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                              >
                                View
                              </Button>
                              <Button 
                                onClick={() => handleEditUser(user.id)}
                                variant="outline"
                                size="sm"
                                className="text-amber-600 border-amber-600 hover:bg-amber-50 transition-all duration-300 hover:scale-105"
                              >
                                Edit
                              </Button>
                              <Button 
                                onClick={() => handleDeleteUser(user.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-105"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* View User Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-md animate-fadeIn">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Viewing detailed information for this user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">ID:</Label>
                <div className="col-span-3">{selectedUser.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Username:</Label>
                <div className="col-span-3">{selectedUser.username}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Name:</Label>
                <div className="col-span-3">{`${selectedUser.firstName} ${selectedUser.lastName}`}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Email:</Label>
                <div className="col-span-3">{selectedUser.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Role:</Label>
                <div className="col-span-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedUser.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Created:</Label>
                <div className="col-span-3">{formatDate(selectedUser.createdAt)}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md animate-slideIn">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user information.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md animate-fadeIn">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <p className="mb-2">You are about to delete:</p>
              <p className="font-medium">{`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteSubmit}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md animate-slideIn">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
