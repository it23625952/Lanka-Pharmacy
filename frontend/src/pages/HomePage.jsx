import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'
import axios from 'axios';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/products');
        console.log(res.data);
        setProducts(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching products: ", error);

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

  return (
    <div className='min-h-screen'>
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className='max-width-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-10'>Loading Products...</div>}

        {products.length > 0 && !isRateLimited && (
          <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4'>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage