import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { AlertTriangle, Calendar, DollarSign, Package, Trash2, ArrowLeft, Download, Filter, RefreshCw } from 'lucide-react';
import api from '../lib/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const WasteDashboard = () => {
    const [wasteData, setWasteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchWasteData();
    }, []);

    const fetchWasteData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/waste/analytics');
            setWasteData(response.data);
        } catch (error) {
            console.error('Error fetching waste data:', error);
            setError('Failed to load waste analytics data. Please check if the backend is running.');
            toast.error('Failed to load waste data');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkWasted = async (productId, quantity) => {
        if (window.confirm('Mark this product as wasted? This action cannot be undone.')) {
            try {
                await api.post('/waste/mark-wasted', {
                    productId,
                    wastedQuantity: quantity,
                    reason: 'Expired'
                });
                toast.success('Product marked as wasted successfully');
                fetchWasteData(); // Refresh data
            } catch (error) {
                console.error('Error marking as wasted:', error);
                toast.error('Failed to mark product as wasted');
            }
        }
    };

    const getFilteredProducts = () => {
        if (!wasteData) return [];
        
        switch (filter) {
            case 'expired':
                return wasteData.expiredProducts.products;
            case 'critical':
                return wasteData.criticalExpiry.products;
            case 'warning':
                return wasteData.warningExpiry.products;
            default:
                return [
                    ...wasteData.expiredProducts.products,
                    ...wasteData.criticalExpiry.products,
                    ...wasteData.warningExpiry.products
                ];
        }
    };

    const generateReport = () => {
        const products = getFilteredProducts();
        if (products.length === 0) {
            toast.error('No products to export');
            return;
        }

        const csvContent = [
            ['Product Name', 'Batch Number', 'Stock', 'Expiry Date', 'Status', 'Potential Loss (LKR)'],
            ...products.map(product => {
                const today = new Date();
                const expiry = new Date(product.expiryDate);
                const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                let status = 'Warning';
                if (daysUntilExpiry <= 0) status = 'Expired';
                else if (daysUntilExpiry <= 30) status = 'Critical';

                return [
                    product.name,
                    product.batchNumber,
                    product.stock,
                    new Date(product.expiryDate).toLocaleDateString(),
                    status,
                    (product.retailPrice * product.stock).toFixed(2)
                ];
            })
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `waste-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Report exported successfully');
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading waste analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md">
                        <AlertTriangle className="size-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Data</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={fetchWasteData}
                            className="btn bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className="size-4" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const filteredProducts = getFilteredProducts();

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <Navbar />
            
            <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        <Link to="/admin" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                            <ArrowLeft className="size-5" />
                            <span>Back to Admin</span>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Waste Management Dashboard</h1>
                            <p className="text-gray-600">Monitor and manage expired or near-expiry products</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="select select-bordered"
                        >
                            <option value="all">All Products at Risk</option>
                            <option value="expired">Expired Only</option>
                            <option value="critical">Critical (0-30 days)</option>
                            <option value="warning">Warning (31-60 days)</option>
                        </select>
                        
                        <button 
                            onClick={generateReport}
                            disabled={filteredProducts.length === 0}
                            className="btn bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Download className="size-4" />
                            Export Report
                        </button>

                        <button 
                            onClick={fetchWasteData}
                            className="btn btn-outline flex items-center gap-2"
                        >
                            <RefreshCw className="size-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <SummaryCard
                        title="Expired"
                        count={wasteData.summary.expiredCount}
                        value={wasteData.expiredProducts.totalValue}
                        color="red"
                        icon={AlertTriangle}
                    />
                    
                    <SummaryCard
                        title="Critical"
                        count={wasteData.summary.criticalCount}
                        value={wasteData.criticalExpiry.totalValue}
                        color="orange"
                        icon={Calendar}
                    />

                    <SummaryCard
                        title="Warning"
                        count={wasteData.summary.warningCount}
                        value={wasteData.warningExpiry.totalValue}
                        color="yellow"
                        icon={Package}
                    />

                    <SummaryCard
                        title="Total At Risk"
                        count={wasteData.summary.totalAtRisk}
                        value={wasteData.summary.totalWasteValue}
                        color="gray"
                        icon={DollarSign}
                    />
                </div>

                {/* Products List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Products at Risk ({filteredProducts.length})
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Package className="size-12 mx-auto mb-4 text-gray-300" />
                                <p>No products found for the selected filter</p>
                                <p className="text-sm">All products are properly managed!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredProducts.map((product) => (
                                    <ProductWasteItem 
                                        key={product._id} 
                                        product={product} 
                                        onMarkWasted={handleMarkWasted}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// SummaryCard and ProductWasteItem components remain the same as previous example...

const SummaryCard = ({ title, count, value, color, icon: Icon }) => {
    const colorClasses = {
        red: 'bg-red-50 border-red-200 text-red-700',
        orange: 'bg-orange-50 border-orange-200 text-orange-700',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        gray: 'bg-gray-50 border-gray-200 text-gray-700'
    };

    return (
        <div className={`border rounded-xl p-6 ${colorClasses[color]}`}>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Icon className={`size-6`} />
                </div>
                <div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="font-medium">{title}</div>
                    <div className="text-sm opacity-80">
                        LKR {value?.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductWasteItem = ({ product, onMarkWasted }) => {
    const getStatusInfo = () => {
        const today = new Date();
        const expiry = new Date(product.expiryDate);
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 0) {
            return { status: 'Expired', color: 'text-red-600', bg: 'bg-red-100' };
        } else if (daysUntilExpiry <= 30) {
            return { status: 'Critical', color: 'text-orange-600', bg: 'bg-orange-100' };
        } else {
            return { status: 'Warning', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        }
    };

    const statusInfo = getStatusInfo();
    const daysUntilExpiry = Math.ceil((new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <div className="font-medium text-gray-800">{product.name}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.status}
                    </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                    <div>Batch: {product.batchNumber} • Stock: {product.stock} units</div>
                    <div>Expiry: {new Date(product.expiryDate).toLocaleDateString()} 
                         {daysUntilExpiry > 0 && ` (in ${daysUntilExpiry} days)`}
                    </div>
                    <div>Category: {product.category}</div>
                </div>
            </div>
            
            <div className="text-right space-y-2">
                <div className="font-semibold text-red-600 text-lg">
                    LKR {(product.retailPrice * product.stock).toFixed(2)}
                </div>
                <button
                    onClick={() => onMarkWasted(product._id, product.stock)}
                    className="btn btn-sm btn-outline btn-error flex items-center gap-1"
                >
                    <Trash2 className="size-3" />
                    Mark Wasted
                </button>
            </div>
        </div>
    );
};

export default WasteDashboard;