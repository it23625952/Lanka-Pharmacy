import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag, Clock, Mail, Phone, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem('pendingOrder'));

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

  const totalAmount = order?.items?.reduce((sum, item) => {
    const price = item.productId?.retailPrice || item.price || 0;
    return sum + price * item.quantity;
  }, 0) || 0;

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

    // Order Information
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
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
            onClick={handleDownloadReceipt}
            className="flex-1 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-lg"
          >
            <Download className="size-6" />
            Download Receipt
          </button>
          <Link 
            to="/"
            className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg text-center"
          >
            <Home className="size-6" />
            Back to Home
          </Link>
          <Link 
            to="/my-orders"
            className="flex-1 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-lg text-center"
          >
            <ShoppingBag className="size-6" />
            View My Orders
          </Link>
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