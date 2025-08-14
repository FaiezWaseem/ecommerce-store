'use client';
import React, { useState, useEffect } from "react";
import AdminNav from "@/components/navbar/admin-nav"
import DataTable  from "@/components/data-table"
import {
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Select,
    SelectItem,
    Switch,
    useDisclosure,
  } from "@nextui-org/react";
import {VerticalDotsIcon} from "@/components/data-table/VerticalDotsIcon";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'MANAGEMENT' | 'CUSTOMER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
    reviews: number;
  };
}

interface UserFormData {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'MANAGEMENT' | 'CUSTOMER';
  isActive: boolean;
}

const INITIAL_VISIBLE_COLUMNS = ["id", "name", 'role', 'email', "status", "createdAt", "actions"];

const statusColorMap = {
    true: "success",
    false: "danger",
  };

  const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "NAME", uid: "name", sortable: true},
    {name: "EMAIL", uid: "email", sortable: true},
    {name: "ROLE", uid: "role", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "CREATED", uid: "createdAt", sortable: true},
    {name: "ACTIONS", uid: "actions"},
  ];

  const roleOptions = [
    { key: "CUSTOMER", label: "Customer" },
    { key: "MANAGEMENT", label: "Management" },
    { key: "SUPER_ADMIN", label: "Super Admin" },
  ];

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'CUSTOMER',
        isActive: true,
    });
    const [isEditing, setIsEditing] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users?limit=100');
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    // Create or update user
    const handleSaveUser = async () => {
        try {
            const url = isEditing ? `/api/users/${selectedUser?.id}` : '/api/users';
            const method = isEditing ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(`User ${isEditing ? 'updated' : 'created'} successfully`);
                fetchUsers();
                onClose();
                resetForm();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to save user');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('Error saving user');
        }
    };

    // Delete user
    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(`/api/users/${selectedUser.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('User deleted successfully');
                fetchUsers();
                onDeleteClose();
                setSelectedUser(null);
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error deleting user');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phone: '',
            role: 'CUSTOMER',
            isActive: true,
        });
        setSelectedUser(null);
        setIsEditing(false);
    };

    // Open edit modal
    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            role: user.role,
            isActive: user.isActive,
        });
        setIsEditing(true);
        onOpen();
    };

    // Open create modal
    const handleCreate = () => {
        resetForm();
        onOpen();
    };

    // Open delete modal
    const handleDelete = (user: User) => {
        setSelectedUser(user);
        onDeleteOpen();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const renderCell = (user: any, columnKey: string) => {
        const cellValue = user[columnKey as keyof User];
        switch (columnKey) {
          case "name":
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
            return (
              <User
                avatarProps={{radius: "lg", name: fullName.charAt(0)}}
                description={user.email}
                name={fullName}
              >
                {user.email}
              </User>
            );
          case "role":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-small capitalize">{cellValue?.toString() || 'N/A'}</p>
                <p className="text-bold text-tiny capitalize text-default-400">
                  {user._count ? `${user._count.orders} orders` : ''}
                </p>
              </div>
            );
          case "status":
             const color: any = 
               statusColorMap[user.isActive.toString() as keyof typeof statusColorMap] || 'secondary';
            return (
              <Chip className="capitalize" color={color} size="sm" variant="flat">
                {user.isActive ? 'Active' : 'Inactive'}
              </Chip>
            );
          case "createdAt":
            return new Date(user.createdAt).toLocaleDateString();
          case "actions":
            return (
              <div className="relative flex justify-end items-center gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <VerticalDotsIcon className="text-default-300" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="edit" onPress={() => handleEdit(user)}>Edit</DropdownItem>
                    <DropdownItem 
                      key="delete" 
                      className="text-danger" 
                      color="danger"
                      onPress={() => handleDelete(user)}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            );
          default:
            return cellValue?.toString() || 'N/A';
        }
      }

    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen">
            <AdminNav active="Users" />
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-black dark:text-white">Users</h1>
                        <p className="text-sm text-gray-500 mt-3">Manage system users</p>
                    </div>
                    <Button color="primary" onPress={handleCreate}>
                        Create User
                    </Button>
                </div>
                <hr className="mt-3" />
            </div>
            <div className="flex-1 space-y-4 p-2 lg:p-8 pt-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading users...</div>
                    </div>
                ) : (
                    <DataTable 
                        data={users}
                        INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                        renderCell={renderCell}
                        columns={columns}
                        searchKey="email"
                    />
                )}
            </div>

            {/* Create/Edit User Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalContent>
                    <ModalHeader>
                        {isEditing ? 'Edit User' : 'Create New User'}
                    </ModalHeader>
                    <ModalBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                isRequired
                            />
                            {!isEditing && (
                                <Input
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    isRequired
                                />
                            )}
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            />
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                            <Input
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                            <Select
                                label="Role"
                                selectedKeys={[formData.role]}
                                onSelectionChange={(keys) => {
                                    const role = Array.from(keys)[0] as 'SUPER_ADMIN' | 'MANAGEMENT' | 'CUSTOMER';
                                    setFormData({...formData, role});
                                }}
                            >
                                {roleOptions.map((role) => (
                                    <SelectItem key={role.key} value={role.key}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="mt-4">
                            <Switch
                                isSelected={formData.isActive}
                                onValueChange={(value) => setFormData({...formData, isActive: value})}
                            >
                                Active User
                            </Switch>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleSaveUser}>
                            {isEditing ? 'Update' : 'Create'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalContent>
                    <ModalHeader>Confirm Delete</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete user <strong>{selectedUser?.email}</strong>?</p>
                        <p className="text-sm text-gray-500 mt-2">
                            This action cannot be undone and will remove all associated data.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onDeleteClose}>
                            Cancel
                        </Button>
                        <Button color="danger" onPress={handleDeleteUser}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}