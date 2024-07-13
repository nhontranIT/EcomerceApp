import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Pagination, Table } from 'react-bootstrap';

const ProductCrudComponent = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        quantity: 1, // You can set default values here
        information: '',
        status: true,
        productCategoryId: 1
    });
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);// State to store selected product
    const [modalAction, setModalAction] = useState('Create');
    const pageSize = 10;

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/api/Products?page=${currentPage}&pageSize=${pageSize}`);
            setProducts(response.data.results);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowModalDetail(false);
        setSelectedProduct(null); // Clear selected product
        setProduct({
            name: '',
            description: '',
            price: 0,
            quantity: 1,
            information: '',
            status: true,
            productCategoryId: 1
        }); // Reset product form fields
        setImages([]); // Clear images array
        setModalAction('Create'); // Reset modal action to 'Create'
    };

    const handleShowCreateModal = () => {
        setModalAction('Create');
        setShowModal(true);
    };

    const handleCloseModalDetails = () => {
        setShowModalDetail(false);
        setSelectedProductDetails(null); // Clear selected product
    };

    const handleShowModalDetails = (product) => {
        setSelectedProductDetails(product);
        setShowModalDetail(true);
    };

    const handleShowEditModal = (product) => {
        setModalAction('Edit');
        setSelectedProduct(product);
        setProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            information: product.information,
            status: product.status,
            productCategoryId: product.productCategoryId
        });
        setImages(product.images.map(img => img.imageUrl));
        setShowModal(true);
    };

    const handleCreateProduct = async () => {
        try {
            const productData = {
                product,
                images: images.map(url => ({ imageUrl: url }))
            };

            const response = await axios.post('/api/Products', productData);
            console.log('Product created:', response.data);

            handleCloseModal();
            fetchProducts(); // Reload products after creation
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleEditProduct = async () => {
        try {
            const productData = {
                product,
                images: images.map(url => ({ imageUrl: url }))
            };

            const response = await axios.put(`/api/Products/${selectedProduct.id}`, productData);
            console.log('Product updated:', response.data);

            handleCloseModal();
            fetchProducts(); // Reload products after edit
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`/api/Products/${productId}`);
            fetchProducts(); // Reload products after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleUpdateProductStatus = async (productId) => {
        try {
            await axios.patch(`/api/Products/${productId}/status`);
            // Update products array after successful status update
            const updatedProducts = products.map(product => {
                if (product.id === productId) {
                    return {
                        ...product,
                        status: !product.status // Toggle status
                    };
                }
                return product;
            });
            setProducts(updatedProducts); // Update state with updated products array
        } catch (error) {
            console.error('Error updating product status:', error);
        }
    };




    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            <Button variant="primary" onClick={handleShowCreateModal}>
                Create Product
            </Button>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{modalAction === 'Create' ? 'Create Product' : 'Edit Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                value={product.name}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="productDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter product description"
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="productPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter product price"
                                value={product.price}
                                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="productQuantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter product quantity"
                                value={product.quantity}
                                onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="productInformation">
                            <Form.Label>Information</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter product information"
                                value={product.information}
                                onChange={(e) => setProduct({ ...product, information: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="productStatus">
                            <Form.Check
                                type="switch"
                                id="productStatusSwitch"
                                label="Status"
                                checked={product.status}
                                onChange={(e) => setProduct({ ...product, status: e.target.checked })}
                            />
                        </Form.Group>
                        <Form.Group controlId="productImages">
                            <Form.Label>Images</Form.Label>
                            {images.map((image, index) => (
                                <div key={index}>
                                    <img src={image} alt={`Product ${index}`} style={{ width: '100px', margin: '10px' }} />
                                </div>
                            ))}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    {modalAction === 'Create' ? (
                        <Button variant="primary" onClick={handleCreateProduct}>
                            Create
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleEditProduct}>
                            Save Changes
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <Modal show={showModalDetail} onHide={handleCloseModalDetails} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Product Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProductDetails && (
                        <div>
                            <h4>{selectedProductDetails.name}</h4>
                            <p><strong>Description:</strong> {selectedProductDetails.description}</p>
                            <p><strong>Price:</strong> ${selectedProductDetails.price}</p>
                            <p><strong>Quantity:</strong> {selectedProductDetails.quantity}</p>
                            <p><strong>Category:</strong> {selectedProductDetails.productCategoryName}</p>
                            <p><strong>Status:</strong> {selectedProductDetails.status ? "Deactive" : "Active"}</p>
                            <p><strong>Information:</strong> {selectedProductDetails.product.information}</p>
                            <div className="d-flex justify-content-center">
                                {selectedProductDetails.images.map((image, index) => (
                                    <img key={index} src={image.imageUrl} alt={`Product ${index}`} style={{ width: '100px', margin: '10px' }} />
                                ))}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="mt-3">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Images</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img src={product.images[0]?.imageUrl} alt={`Product ${product.id}`} style={{ width: '100px' }} />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>${product.price}</td>
                                <td>{product.productCategoryName}</td>
                                <td>{product.status ? "Deactive" : "Active"}</td>
                                <td className="d-flex flex-column gap-2">
                                    <Button variant="warning" onClick={() => handleShowEditModal(product)}>
                                        Edit
                                    </Button>

                                    <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                                        Delete
                                    </Button>

                                    <Button variant="success" onClick={() => handleUpdateProductStatus(product.id)}>
                                        {product.status ? "Active" : "Deactivate"}
                                    </Button>

                                    <Button variant="info" onClick={() => handleShowModalDetails(product)}>
                                        Detail
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Pagination className="mt-3">
                {[...Array(totalPages).keys()].map(page => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
};

export default ProductCrudComponent;