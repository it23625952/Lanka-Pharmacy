import Feedback from "../models/Feedback.js";

export const submitFeedback = async (req, res) => {
  console.log('📩 Feedback received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { rating, category, feedbackText } = req.body;
    
    // Validation
    if (!rating || !category || !feedbackText) {
      return res.status(400).json({ 
        message: 'Rating, category, and feedback text are required' 
      });
    }
    
    const feedback = new Feedback(req.body);
    await feedback.save();
    
    console.log('✅ Feedback saved successfully');
    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedback 
    });
  } catch (error) {
    console.error('❌ Feedback error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
