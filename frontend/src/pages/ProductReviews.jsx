import React, { useState, useEffect } from 'react';
import { Star, Check, ThumbsUp } from 'lucide-react';
import api from '../lib/axios';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [ratingSummary, setRatingSummary] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchReviews();
        fetchRatingSummary();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/reviews/product/${productId}`);
            setReviews(response.data.reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const fetchRatingSummary = async () => {
        try {
            const response = await api.get(`/reviews/product/${productId}/summary`);
            setRatingSummary(response.data);
        } catch (error) {
            console.error('Error fetching rating summary:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reviews', {
                productId,
                rating: newReview.rating,
                comment: newReview.comment
            });
            setShowReviewForm(false);
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
            fetchRatingSummary();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const renderStars = (rating, interactive = false, onRate = null) => {
        return Array.from({ length: 5 }, (_, index) => (
            <button
                key={index}
                type={interactive ? "button" : "span"}
                onClick={interactive ? () => onRate(index + 1) : undefined}
                className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} ${
                    index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
            >
                <Star className="size-5" />
            </button>
        ));
    };

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            {ratingSummary && (
                <div className="bg-white rounded-xl p-6 shadow-lg border">
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gray-800">
                                {ratingSummary.averageRating.toFixed(1)}
                            </div>
                            <div className="flex justify-center mt-2">
                                {renderStars(Math.round(ratingSummary.averageRating))}
                            </div>
                            <div className="text-gray-600 mt-1">
                                {ratingSummary.totalReviews} reviews
                            </div>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = ratingSummary.ratingDistribution[star - 1] || 0;
                                const percentage = ratingSummary.totalReviews > 0 ? 
                                    (count / ratingSummary.totalReviews) * 100 : 0;
                                
                                return (
                                    <div key={star} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 w-4">{star}</span>
                                        <Star className="size-4 text-yellow-400 fill-yellow-400" />
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-yellow-400 h-2 rounded-full transition-all" 
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-12">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setShowReviewForm(true)}
                        className="mt-4 btn bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        Write a Review
                    </button>
                </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <div className="bg-white rounded-xl p-6 shadow-lg border">
                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Your Rating</label>
                            <div className="flex gap-1">
                                {renderStars(newReview.rating, true, (rating) => 
                                    setNewReview(prev => ({ ...prev, rating }))
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Your Review</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                className="textarea textarea-bordered w-full"
                                rows="4"
                                placeholder="Share your experience with this product..."
                                maxLength="500"
                            />
                            <div className="text-right text-sm text-gray-500 mt-1">
                                {newReview.comment.length}/500
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(false)}
                                className="btn btn-outline flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn bg-emerald-600 text-white hover:bg-emerald-700 flex-1"
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-xl p-6 shadow-lg border">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="font-semibold text-emerald-600">
                                        {review.userId?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-800">
                                        {review.userId?.name || 'Anonymous'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {renderStars(review.rating)}
                                        </div>
                                        {review.verifiedPurchase && (
                                            <span className="flex items-center gap-1 text-emerald-600 text-sm">
                                                <Check className="size-3" />
                                                Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{review.comment}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:text-emerald-600">
                                <ThumbsUp className="size-4" />
                                Helpful ({review.helpful})
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReviews;