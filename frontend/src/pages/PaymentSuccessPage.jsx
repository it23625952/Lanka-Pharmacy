<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React from 'react';
>>>>>>> cb342fb30c9b2af0b979105c26e931b71a185019
import { useNavigate, Link } from 'react-router';
import { CheckCircle, Package, Truck, Home, ShoppingBag, Clock, Mail, Phone, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const [isDownloading, setIsDownloading] = useState(false);
  const [order, setOrder] = useState(null);

  // Load order data from localStorage on component mount
  useEffect(() => {
    const orderData = localStorage.getItem('pendingOrder');
    if (orderData) {
      try {
        setOrder(JSON.parse(orderData));
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
  }, []);
=======
  const order = JSON.parse(localStorage.getItem('pendingOrder'));
>>>>>>> cb342fb30c9b2af0b979105c26e931b71a185019

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

<<<<<<< HEAD
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');
  };

=======
>>>>>>> cb342fb30c9b2af0b979105c26e931b71a185019
  const totalAmount = order?.items?.reduce((sum, item) => {
    const price = item.productId?.retailPrice || item.price || 0;
    return sum + price * item.quantity;
  }, 0) || 0;

<<<<<<< HEAD
  const taxAmount = totalAmount * 0.05; // 5% tax
  const finalTotal = totalAmount + taxAmount;

  // Method 1: Simple Payment Receipt
  const generateSimplePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, 210, 30, 'F');
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('PAYMENT RECEIPT', 105, 12, { align: 'center' });
    doc.setFontSize(10);
    doc.text('LANKA PHARMACY', 105, 20, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    let yPosition = 40;

    // Receipt Details
    doc.setFont(undefined, 'bold');
    doc.text('Receipt Details', 20, yPosition);
    yPosition += 8;

    doc.setFont(undefined, 'normal');
    doc.text(`Date: ${getCurrentDate()}`, 20, yPosition);
    doc.text(`Receipt No: ${order.orderNumber || 'PAID'}`, 120, yPosition);
    yPosition += 6;

    doc.text(`Received from: ${order.name}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Amount: LKR ${totalAmount.toFixed(2)}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Payment method: Credit Card`, 20, yPosition);
    yPosition += 6;

    doc.text(`Received by: Lanka Pharmacy`, 20, yPosition);
    yPosition += 15;

    // Thank you message
    doc.setFont(undefined, 'italic');
    doc.setTextColor(100);
    doc.text('Thank you for your payment!', 105, yPosition, { align: 'center' });
    yPosition += 6;

    doc.text('This receipt acknowledges your payment to Lanka Pharmacy.', 105, yPosition, { align: 'center' });
    yPosition += 15;

    // Terms
    doc.setFontSize(8);
    doc.text('Terms: Goods sold are not returnable. For queries contact +94 51 222 5523', 105, 280, { align: 'center' });

    return doc;
  };

  // Method 2: Detailed Invoice Receipt
  const generateDetailedPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE RECEIPT', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('LANKA PHARMACY - Your Trusted Healthcare Partner', 105, 25, { align: 'center' });
=======
  const handleDownloadReceipt = () => {
    if (!order) return;

    const doc = new jsPDF();

    // Header
    doc.setFillColor(5, 150, 105); // Emerald color
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('LANKA PHARMACY', 105, 15, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Payment Receipt', 105, 25, { align: 'center' });
>>>>>>> cb342fb30c9b2af0b979105c26e931b71a185019

    // Order Information
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
<<<<<<< HEAD
    let yPosition = 45;

    // Customer & Date Info
    doc.text(`Date: ${getCurrentDate()}`, 20, yPosition);
    doc.text(`Invoice No: ${order.orderNumber || 'INV-PAID'}`, 150, yPosition);
    yPosition += 6;

    doc.text(`Customer: ${order.name}`, 20, yPosition);
    doc.text(`Phone: ${order.phoneNo}`, 150, yPosition);
    yPosition += 6;

    doc.text(`Address: ${order.address}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Location: ${order.location}`, 20, yPosition);
    yPosition += 15;

    // Items Purchased Header
    doc.setFont(undefined, 'bold');
    doc.text('ITEMS PURCHASED:', 20, yPosition);
    yPosition += 8;

    // Items List
    doc.setFont(undefined, 'normal');
    order.items.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      const name = item.productId?.name || item.name || 'Unnamed Product';
      const price = item.productId?.retailPrice || item.price || 0;
      const subtotal = price * item.quantity;

      // Truncate long product names
      const truncatedName = name.length > 35 ? name.substring(0, 35) + '...' : name;

      doc.text(`${index + 1}. ${truncatedName}`, 25, yPosition);
      doc.text(`x ${item.quantity}`, 140, yPosition);
      doc.text(`LKR ${price.toFixed(2)} each`, 160, yPosition);
      yPosition += 5;
      doc.text(`Subtotal: LKR ${subtotal.toFixed(2)}`, 160, yPosition);
      yPosition += 8;
    });

    // Calculations
    yPosition += 5;
    doc.setFont(undefined, 'bold');
    doc.text('CALCULATIONS:', 20, yPosition);
    yPosition += 8;

    doc.setFont(undefined, 'normal');
    doc.text(`Subtotal:`, 120, yPosition);
    doc.text(`LKR ${totalAmount.toFixed(2)}`, 180, yPosition, { align: 'right' });
    yPosition += 6;

    doc.text(`Tax (5%):`, 120, yPosition);
    doc.text(`LKR ${taxAmount.toFixed(2)}`, 180, yPosition, { align: 'right' });
    yPosition += 6;

    doc.text(`Discount:`, 120, yPosition);
    doc.text(`LKR 0.00`, 180, yPosition, { align: 'right' });
    yPosition += 8;

    // Total
    doc.setFont(undefined, 'bold');
    doc.text(`Total:`, 120, yPosition);
    doc.text(`LKR ${finalTotal.toFixed(2)}`, 180, yPosition, { align: 'right' });
    yPosition += 15;

    // Payment Information
    doc.setFont(undefined, 'bold');
    doc.text('PAYMENT INFORMATION:', 20, yPosition);
    yPosition += 8;

    doc.setFont(undefined, 'normal');
    doc.text(`Payment method: Credit Card`, 25, yPosition);
    yPosition += 6;
    doc.text(`Received by: Lanka Pharmacy`, 25, yPosition);
    yPosition += 6;
    doc.text(`Payment Status: Paid`, 25, yPosition);
    yPosition += 15;

    // Delivery Information
    doc.setFont(undefined, 'bold');
    doc.text('DELIVERY INFORMATION:', 20, yPosition);
    yPosition += 8;

    doc.setFont(undefined, 'normal');
    doc.text(`Estimated Delivery: ${getEstimatedDelivery()}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Delivery Address: ${order.address}, ${order.location}`, 25, yPosition);
    yPosition += 15;

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Thank you for choosing Lanka Pharmacy. For any queries, contact us at:', 105, 270, { align: 'center' });
    doc.text('Phone: +94 51 222 5523 | Email: lp.hatton.sup@gmail.com', 105, 275, { align: 'center' });
    doc.text('Returns Policy: Medicines are not returnable for safety reasons.', 105, 280, { align: 'center' });
    doc.text('This is a computer-generated invoice.', 105, 285, { align: 'center' });

    return doc;
  };

  const handleDownloadReceipt = async (method = 'simple') => {
    console.log('Download button clicked, method:', method);
    
    if (!order) {
      alert('No order data found. Please try again.');
      return;
    }

    try {
      setIsDownloading(true);
      console.log('Starting PDF generation...');

      let doc;
      
      if (method === 'simple') {
        doc = generateSimplePDF();
      } else {
        doc = generateDetailedPDF();
      }

      const fileName = method === 'simple' 
        ? `Payment_Receipt_${order.orderNumber || 'PAID'}.pdf`
        : `Invoice_${order.orderNumber || 'INV-PAID'}.pdf`;
      
      console.log('Saving PDF as:', fileName);
      
      doc.save(fileName);
      console.log('PDF saved successfully');

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // If no order data, show error message
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Order Data Found</h1>
          <p className="text-gray-600 mb-6">Unable to load order information. Please return to home.</p>
          <Link 
            to="/"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

=======
    const orderInfo = [
      [`Order Number: ${order.orderNumber || 'PAID'}`, `Date: ${new Date().toLocaleDateString()}`],
      [`Customer: ${order.name}`, `Phone: ${order.phoneNo}`],
      [`Address: ${order.address}`, `Location: ${order.location}`],
      [`Estimated Delivery: ${getEstimatedDelivery()}`, 'Payment: Credit Card']
    ];

    let yPosition = 50;
    orderInfo.forEach(([left, right]) => {
      doc.text(left, 14, yPosition);
      doc.text(right, 140, yPosition);
      yPosition += 6;
    });

    // Table
    const tableData = order.items.map((item, idx) => {
      const name = item.productId?.name || item.name || 'Unnamed Product';
      const price = item.productId?.retailPrice || item.price || 0;
      const subtotal = price * item.quantity;
      return [idx + 1, name, item.quantity, `LKR ${price.toFixed(2)}`, `LKR ${subtotal.toFixed(2)}`];
    });

    autoTable(doc, {
      startY: yPosition + 10,
      head: [['#', 'Product', 'Qty', 'Unit Price', 'Subtotal']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [5, 150, 105],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 3
      }
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Amount: LKR ${totalAmount.toFixed(2)}`, 14, finalY);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing Lanka Pharmacy - Your Trusted Healthcare Partner', 105, 280, { align: 'center' });
    doc.text('Contact: +94 51 222 5523 | Email: lp.hatton.sup@gmail.com', 105, 285, { align: 'center' });

    doc.save(`Receipt_${order.orderNumber || 'PAID'}_${new Date().getTime()}.pdf`);
  };

>>>>>>> cb342fb30c9b2af0b979105c26e931b71a185019
  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
      <div className='flex-1 container mx-auto px-4 py-8 max-w-4xl'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle className="size-12 text-white" />
          </div>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
            Payment Successful!
          </h1>
          <p className='text-gray-600 text-xl'>Your order has been confirmed and payment processed</p>
        </div>

        {/* Main Success Card */}
        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8'>
          {/* Success Header */}
          <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6'>
            <div className='flex items-center gap-4'>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <Package className="size-7 text-white" />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-white'>Order #{order?.orderNumber || 'PAID'}</h2>
                <p className='text-emerald-100'>Payment confirmed • Order processing</p>
              </div>
            </div>
          </div>

          <div className='p-8'>
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Delivery Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-4">
                  <Truck className="size-6 text-emerald-600" />
                  Delivery Details
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <p className="font-semibold text-emerald-800">{order?.name}</p>
                    <p className="text-emerald-700">{order?.address}</p>
                    <p className="text-emerald-700">{order?.location}</p>
                    <p className="text-emerald-700 mt-2">📞 {order?.phoneNo}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="size-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Estimated Delivery</span>
                    </div>
                    <p className="text-blue-700">{getEstimatedDelivery()}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-4">
                  <ShoppingBag className="size-6 text-emerald-600" />
                  Order Summary
                </h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {order?.items?.map((item, idx) => {
                    const name = item.productId?.name || item.name || 'Unnamed Product';
                    const price = item.productId?.retailPrice || item.price || 0;
                    const subtotal = price * item.quantity;

                    return (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{name}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity} × LKR {price.toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-emerald-600">LKR {subtotal.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-800">Total Paid:</span>
                  <span className="text-xl font-bold text-emerald-600">LKR {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-3">
                <CheckCircle className="size-6" />
                What Happens Next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="size-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-800 mb-2">Order Processing</h4>
                  <p className="text-sm text-emerald-700">We're preparing your medications</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="size-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-800 mb-2">Quality Check</h4>
                  <p className="text-sm text-emerald-700">Pharmacy verification in progress</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="size-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-800 mb-2">Delivery</h4>
                  <p className="text-sm text-emerald-700">Your order will be delivered soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Order Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <Phone className="size-8 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Call Us</h4>
              <p className="text-gray-600 mb-3">Speak directly with our pharmacy team</p>
              <a href="tel:+94512225523" className="text-emerald-600 font-semibold hover:text-emerald-700">
                +94 51 222 5523
              </a>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <Mail className="size-8 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Email Support</h4>
              <p className="text-gray-600 mb-3">Get help via email</p>
              <a href="mailto:lp.hatton.sup@gmail.com" className="text-emerald-600 font-semibold hover:text-emerald-700">
                lp.hatton.sup@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
<<<<<<< HEAD
            onClick={() => handleDownloadReceipt('simple')}
            disabled={isDownloading}
            className={`flex-1 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-lg ${
              isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
            }`}
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="size-6" />
                Download Payment Receipt
              </>
            )}
          </button>

          <button
            onClick={() => handleDownloadReceipt('detailed')}
            disabled={isDownloading}
            className={`flex-1 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-lg ${
              isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
            }`}
          >
            <Download className="size-6" />
            Download Detailed Invoice
          </button>
          
=======
            onClick={handleDownloadReceipt}
            className="flex-1 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-lg"
          >
            <Download className="size-6" />
            Download Receipt
          </button>
>>>>>>> cb342fb30c9b2af0b979105c26e931b71a185019
          <Link 
            to="/"
            className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg text-center"
          >
            <Home className="size-6" />
            Back to Home
          </Link>
<<<<<<< HEAD
=======
          <Link 
            to="/my-orders"
            className="flex-1 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-lg text-center"
          >
            <ShoppingBag className="size-6" />
            View My Orders
          </Link>
>>>>>>> cb342fb30c9b2af0b979105c26e931b71a185019
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-8 text-gray-600 text-lg">
          <p>🎉 Thank you for your payment! Your order is being processed securely.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;