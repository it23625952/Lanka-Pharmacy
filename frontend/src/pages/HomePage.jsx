import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import api from '../lib/axios';
import { Search, Package, Filter, Grid, List } from 'lucide-react';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Fetch products on component mount
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get('/products');
        console.log(res.data);
        setProducts(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching products: ", error);

        // Handle rate limiting specifically
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load products");
        }
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
      <Navbar />

      {/* Display rate limit warning if applicable */}
      {isRateLimited && <RateLimitedUI />}

      <div className='flex-1 container mx-auto px-4 py-8 max-w-7xl'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
            Our Pharmacy Products
          </h1>
          <p className='text-gray-600 text-xl max-w-2xl mx-auto'>
            Discover our wide range of healthcare products, medications, and wellness solutions
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8'>
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
            <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-auto'>
              <div className='relative w-full sm:w-80 lg:w-96'>
                <input 
                  type='text' 
                  placeholder='Search products by name, description, or category...' 
                  className='input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12' 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <button className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors duration-200'>
                  <Search className='size-5' />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select className='select select-lg border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 text-gray-800'>
                  <option>All Categories</option>
                  <option>Prescription</option>
                  <option>Over-the-Counter</option>
                  <option>Wellness</option>
                  <option>Personal Care</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-white hover:text-emerald-600'
                }`}
              >
                <Grid className="size-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-white hover:text-emerald-600'
                }`}
              >
                <List className="size-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <div className="text-gray-600">
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading our products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
            <Package className="size-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No products found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm 
                ? `No products match "${searchTerm}". Try a different search term.`
                : "We're currently updating our product catalog. Please check back soon."
              }
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="btn bg-gradient-to-r from-emerald-600 to-emerald-700 border-none text-white hover:from-emerald-700 hover:to-emerald-800 px-8 py-3"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Call to Action Section */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Need Prescription Medications?</h3>
              <p className="text-emerald-100 text-lg mb-6 max-w-2xl mx-auto">
                Upload your prescription and let our pharmacy team prepare your medications for you
              </p>
              <a 
                href="/upload-prescription" 
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Upload Prescription
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage;