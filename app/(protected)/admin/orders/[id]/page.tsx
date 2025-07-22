'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminNav from '@/components/navbar/admin-nav';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from '@nextui-org/react';
import { ArrowLeft, Printer, Save } from 'lucide-react';
import AddProductModal from '@/components/admin/AddProductModal';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: { url: string }[];
  };
}

interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  address1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  alternatePhone?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  trackingNumber?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}

const statusOptions = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const statusColorMap = {
  PENDING: 'warning',
  PROCESSING: 'primary',
  SHIPPED: 'secondary',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [editedTrackingNumber, setEditedTrackingNumber] = useState('');
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState({ firstName: '', lastName: '', email: '' });
  const [editedAddress, setEditedAddress] = useState({
    firstName: '', lastName: '', address: '', city: '', state: '', zipCode: '', country: '', phone: '', alternatePhone: ''
  });
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setEditedStatus(data.order.status);
        setEditedTrackingNumber(data.order.trackingNumber || '');
        setEditedCustomer({
          firstName: data.order.user.firstName,
          lastName: data.order.user.lastName,
          email: data.order.user.email
        });
        setEditedAddress({
          firstName: data.order.shippingAddress.firstName,
          lastName: data.order.shippingAddress.lastName,
          address: data.order.shippingAddress.address,
          city: data.order.shippingAddress.city,
          state: data.order.shippingAddress.state,
          zipCode: data.order.shippingAddress.zipCode,
          country: data.order.shippingAddress.country,
          phone: data.order.shippingAddress.phone,
          alternatePhone: data.order.shippingAddress.alternatePhone || ''
        });
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!order) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editedStatus,
          trackingNumber: editedTrackingNumber,
          customerDetails: isEditingCustomer ? editedCustomer : undefined,
          shippingAddress: isEditingAddress ? editedAddress : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setIsEditingCustomer(false);
        setIsEditingAddress(false);
        alert('Order updated successfully!');
      } else {
        alert('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProduct = async (productId: string, quantity: number, customPrice?: number) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/admin/orders/${order.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          customPrice,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        alert('Product added successfully!');
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!order) return;
    
    if (!confirm('Are you sure you want to remove this item from the order?')) {
      return;
    }

    try {
      setRemoving(itemId);
      const response = await fetch(`/api/admin/orders/${order.id}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        alert('Item removed successfully!');
      } else {
        alert('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };



  const handlePrintOrder = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 min-h-screen">
        <AdminNav active="Orders" />
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white dark:bg-slate-900 min-h-screen">
        <AdminNav active="Orders" />
        <div className="p-4">
          <div className="text-center text-red-500">{error || 'Order not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen print:bg-white">
      <div className="print:hidden">
        <AdminNav active="Orders" />
      </div>
      
      <div className="p-4 print:p-8 container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 print:hidden">
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="light"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-md lg:text-3xl font-bold text-black dark:text-white">
                Order {order.orderNumber}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              color="primary"
              startContent={<Printer className="h-4 w-4" />}
              onClick={handlePrintOrder}
            >
              Print Order
            </Button>
            <Button
              color="primary"
              startContent={<Save className="h-4 w-4" />}
              onClick={handleSaveChanges}
              isLoading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block mb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-lg">Order #{order.orderNumber}</p>
            <p className="text-sm text-gray-600">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status & Tracking */}
          <Card className="print:shadow-none print:border bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Status</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="print:hidden">
                <Select
                  label="Status"
                  selectedKeys={[editedStatus]}
                  onSelectionChange={(keys) => setEditedStatus(Array.from(keys)[0] as string)}
                >
                  {statusOptions.map((status) => (
                    <SelectItem key={status.key} value={status.key}>
                      {status.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="hidden print:block">
                <p className="font-medium text-gray-900 dark:text-white">Status:</p>
                <Chip
                  //@ts-ignore
                  color={statusColorMap[order.status]}
                  variant="flat"
                  className="capitalize"
                >
                  {order.status.toLowerCase()}
                </Chip>
              </div>
              
              <div className="print:hidden">
                <Input
                  label="Tracking Number"
                  value={editedTrackingNumber}
                  onChange={(e) => setEditedTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>
              <div className="hidden print:block">
                <p className="font-medium text-gray-900 dark:text-white">Tracking Number:</p>
                <p className="text-gray-700 dark:text-gray-300">{order.trackingNumber || 'Not assigned'}</p>
              </div>
            </CardBody>
          </Card>

          {/* Customer Information */}
          <Card className="print:shadow-none print:border bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h3>
              <Button
                size="sm"
                variant="light"
                className="print:hidden"
                onClick={() => setIsEditingCustomer(!isEditingCustomer)}
              >
                {isEditingCustomer ? 'Cancel' : 'Edit'}
              </Button>
            </CardHeader>
            <CardBody className="space-y-2">
              {isEditingCustomer ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="First Name"
                      value={editedCustomer.firstName}
                      onChange={(e) => setEditedCustomer({...editedCustomer, firstName: e.target.value})}
                    />
                    <Input
                      label="Last Name"
                      value={editedCustomer.lastName}
                      onChange={(e) => setEditedCustomer({...editedCustomer, lastName: e.target.value})}
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={editedCustomer.email}
                    onChange={(e) => setEditedCustomer({...editedCustomer, email: e.target.value})}
                  />
                </div>
              ) : (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.user.firstName} {order.user.lastName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{order.user.email}</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Order Summary */}
          <Card className="print:shadow-none print:border bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Summary</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <div className="flex justify-between text-gray-900 dark:text-white">
                <span>Items:</span>
                <span>{order.items.length}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>Rs {order.totalAmount}</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Shipping Address */}
        <Card className="mt-6 print:shadow-none print:border bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Address</h3>
            <Button
              size="sm"
              variant="light"
              className="print:hidden"
              onClick={() => setIsEditingAddress(!isEditingAddress)}
            >
              {isEditingAddress ? 'Cancel' : 'Edit'}
            </Button>
          </CardHeader>
          <CardBody>
            {isEditingAddress ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="First Name"
                    value={editedAddress.firstName}
                    onChange={(e) => setEditedAddress({...editedAddress, firstName: e.target.value})}
                  />
                  <Input
                    label="Last Name"
                    value={editedAddress.lastName}
                    onChange={(e) => setEditedAddress({...editedAddress, lastName: e.target.value})}
                  />
                </div>
                <Input
                  label="Address"
                  value={editedAddress.address}
                  onChange={(e) => setEditedAddress({...editedAddress, address: e.target.value})}
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    label="City"
                    value={editedAddress.city}
                    onChange={(e) => setEditedAddress({...editedAddress, city: e.target.value})}
                  />
                  <Input
                    label="State"
                    value={editedAddress.state}
                    onChange={(e) => setEditedAddress({...editedAddress, state: e.target.value})}
                  />
                  <Input
                    label="Zip Code"
                    value={editedAddress.zipCode}
                    onChange={(e) => setEditedAddress({...editedAddress, zipCode: e.target.value})}
                  />
                </div>
                <Input
                  label="Country"
                  value={editedAddress.country}
                  onChange={(e) => setEditedAddress({...editedAddress, country: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Phone"
                    value={editedAddress.phone}
                    onChange={(e) => setEditedAddress({...editedAddress, phone: e.target.value})}
                  />
                  <Input
                    label="Alternate Phone"
                    value={editedAddress.alternatePhone}
                    onChange={(e) => setEditedAddress({...editedAddress, alternatePhone: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{order.shippingAddress.address}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{order.shippingAddress.country}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Phone:</strong> {order.shippingAddress.phone}</p>
                  {order.shippingAddress.alternatePhone && (
                    <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Alternate Phone:</strong> {order.shippingAddress.alternatePhone}</p>
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Order Items */}
        <Card className="mt-6 print:shadow-none print:border bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Items</h3>
            <Button
              size="sm"
              color="primary"
              className="print:hidden"
              onClick={() => setIsAddProductModalOpen(true)}
            >
              Add Product
            </Button>
          </CardHeader>
          <CardBody>

            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg print:border-gray-300 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <Image
                    src={item.product.images[0]?.url || '/placeholder.svg'}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.product.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Price: Rs {item.price} each</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="font-bold text-gray-900 dark:text-white">Rs {(item.price * item.quantity)}</p>
                    <Button 
                      size="sm" 
                      color="danger" 
                      variant="flat" 
                      className="print:hidden"
                      isLoading={removing === item.id}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
          onAddProduct={handleAddProduct}
        />
      </div>
    </div>
  );
}