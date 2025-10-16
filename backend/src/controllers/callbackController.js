import CallbackRequest from "../models/CallbackRequest.js";

// Create callback request
export const createCallbackRequest = async (req, res) => {
  console.log('📩 Callback request received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { userId, customerName, phoneNumber, preferredDate, preferredTime, reason } = req.body;
    
    // Validation
    if (!userId || !customerName || !phoneNumber || !preferredDate || !preferredTime || !reason) {
      const missing = [];
      if (!userId) missing.push('userId');
      if (!customerName) missing.push('customerName');
      if (!phoneNumber) missing.push('phoneNumber');
      if (!preferredDate) missing.push('preferredDate');
      if (!preferredTime) missing.push('preferredTime');
      if (!reason) missing.push('reason');
      
      return res.status(400).json({ 
        message: `Missing required fields: ${missing.join(', ')}` 
      });
    }
    
    const callback = new CallbackRequest(req.body);
    const savedCallback = await callback.save();
    
    console.log('✅ Callback created successfully:', savedCallback.callbackID);
    res.status(201).json({
      message: 'Callback request created successfully',
      callback: savedCallback
    });
  } catch (error) {
    console.error('❌ Callback creation error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all callbacks with filters
export const getCallbackRequests = async (req, res) => {
  try {
    const filters = {};
    if (req.query.userId) filters.userId = req.query.userId;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.assignedStaffId) filters.assignedStaffId = req.query.assignedStaffId;

    const callbacks = await CallbackRequest.find(filters).sort({ createdAt: -1 });
    
    console.log(`✅ Retrieved ${callbacks.length} callbacks`);
    res.json(callbacks);
  } catch (error) {
    console.error('❌ Error fetching callbacks:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get callback by ID
export const getCallbackRequestById = async (req, res) => {
  try {
    const callback = await CallbackRequest.findById(req.params.id);
    if (!callback) {
      return res.status(404).json({ message: "Callback request not found" });
    }
    res.json(callback);
  } catch (error) {
    console.error('❌ Error fetching callback:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update callback
export const updateCallbackRequest = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };
    
    // If status is Completed, set completedAt
    if (req.body.status === 'Completed' && !req.body.completedAt) {
      updateData.completedAt = Date.now();
    }
    
    const callback = await CallbackRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!callback) {
      return res.status(404).json({ message: "Callback request not found" });
    }
    
    console.log('✅ Callback updated:', callback.callbackID);
    res.json({
      message: 'Callback updated successfully',
      callback
    });
  } catch (error) {
    console.error('❌ Error updating callback:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete callback
export const deleteCallbackRequest = async (req, res) => {
  try {
    const callback = await CallbackRequest.findByIdAndDelete(req.params.id);
    if (!callback) {
      return res.status(404).json({ message: "Callback request not found" });
    }
    
    console.log('✅ Callback deleted:', callback.callbackID);
    res.json({ 
      message: "Callback request deleted successfully",
      callbackID: callback.callbackID
    });
  } catch (error) {
    console.error('❌ Error deleting callback:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get customer callbacks
export const getCustomerCallbacks = async (req, res) => {
  try {
    const { userId } = req.params;
    const callbacks = await CallbackRequest.find({ userId }).sort({ createdAt: -1 });
    
    console.log(`✅ Retrieved ${callbacks.length} callbacks for user:`, userId);
    res.json(callbacks);
  } catch (error) {
    console.error('❌ Error fetching customer callbacks:', error);
    res.status(500).json({ error: error.message });
  }
};
