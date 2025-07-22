'use client';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
  Image,
  Spinner,
  Chip,
} from '@nextui-org/react';
import { Search, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  regularPrice: number;
  salePrice?: number;
  sku?: string;
  stockStatus: string;
  images: { url: string; alt?: string }[];
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productId: string, quantity: number, customPrice?: number) => void;
}

export default function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [useCustomPrice, setUseCustomPrice] = useState(false);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/search?search=${encodeURIComponent(query)}&limit=20&status=ACTIVE`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleProductSelect = (product: Product) => {
    console.log(product)
    setSelectedProduct(product);
    setCustomPrice(product.salePrice || product.regularPrice);
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const finalPrice = useCustomPrice ? customPrice : undefined;
    onAddProduct(selectedProduct.id, quantity, finalPrice);

    // Reset form
    setSelectedProduct(null);
    setQuantity(1);
    setCustomPrice(0);
    setUseCustomPrice(false);
    setSearchQuery('');
    setProducts([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setCustomPrice(0);
    setUseCustomPrice(false);
    setSearchQuery('');
    setProducts([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Add Product to Order</h3>
          <p className="text-sm text-gray-500">Search and select a product to add to this order</p>
        </ModalHeader>
        <ModalBody>
          {/* Search Input */}
          <Input
            placeholder="Search products by name, description, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search className="h-4 w-4 text-gray-400" />}
            className="mb-4"
          />

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          )}

          {/* Search Results */}
          {!loading && searchQuery && products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found for {searchQuery}
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`transition-all ${selectedProduct?.id === product.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  <CardBody className="p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.images && product.images.length > 0 ? product.images[0].url : '/placeholder.svg'}
                        alt={product.images && product.images.length > 0 ? (product.images[0].alt || product.name) : product.name}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                        fallbackSrc="/placeholder.svg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        {product.sku && (
                          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-sm">
                            Rs {product.salePrice || product.regularPrice}
                          </span>
                          {product.salePrice && (
                            <span className="text-xs text-gray-500 line-through">
                              Rs {product.regularPrice}
                            </span>
                          )}
                          <Chip
                            size="sm"
                            color={product.stockStatus === 'IN_STOCK' ? 'success' : 'warning'}
                            variant="flat"
                          >
                            {product.stockStatus.replace('_', ' ')}
                          </Chip>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedProduct?.id === product.id}
                        onChange={() => handleProductSelect(product)}
                        className="h-5 w-5 rounded border-gray-300"
                      />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {/* Selected Product Configuration */}
          {selectedProduct && (
            <div className="mt-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-medium mb-3">Configure Selected Product</h4>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0].url : '/placeholder.svg'}
                  alt={selectedProduct.name}
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
                <div>
                  <h5 className="font-medium">{selectedProduct.name}</h5>
                  <p className="text-sm text-gray-600">
                    Default Price: Rs {selectedProduct.salePrice || selectedProduct.regularPrice}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Quantity"
                  min="1"
                  value={quantity.toString()}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useCustomPrice}
                      onChange={(e) => setUseCustomPrice(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Use custom price</span>
                  </label>
                  {useCustomPrice && (
                    <Input
                      type="number"
                      label="Custom Price"
                      min="0"
                      step="0.01"
                      value={customPrice.toString()}
                      onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleAddProduct}
            isDisabled={!selectedProduct}
            startContent={<Plus className="h-4 w-4" />}
          >
            Add to Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}