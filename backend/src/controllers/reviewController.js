import Review from "../models/Review.js";
import Product from "../models/Product.js";

export async function createReview(req, res) {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id; // From authentication middleware

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            return res.status(400).json({ 
                "message": "You have already reviewed this product" 
            });
        }

        const review = new Review({
            productId,
            userId,
            rating,
            comment,
            verifiedPurchase: true // You can implement purchase verification logic
        });

        await review.save();

        // Update product average rating
        await updateProductRating(productId);

        res.status(201).json(review);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ "message": "Server error" });
    }
}

export async function getProductReviews(req, res) {
    try {
        const { productId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ productId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ productId });

        res.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ "message": "Server error" });
    }
}

export async function getProductRatingSummary(req, res) {
    try {
        const { productId } = req.params;

        const summary = await Review.aggregate([
            { $match: { productId: mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: '$productId',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    ratingDistribution: {
                        $push: '$rating'
                    }
                }
            }
        ]);

        const ratingDist = [0, 0, 0, 0, 0];
        if (summary.length > 0 && summary[0].ratingDistribution) {
            summary[0].ratingDistribution.forEach(rating => {
                if (rating >= 1 && rating <= 5) {
                    ratingDist[rating - 1]++;
                }
            });
        }

        res.json({
            averageRating: summary.length > 0 ? summary[0].averageRating : 0,
            totalReviews: summary.length > 0 ? summary[0].totalReviews : 0,
            ratingDistribution: ratingDist
        });
    } catch (error) {
        console.error("Error fetching rating summary:", error);
        res.status(500).json({ "message": "Server error" });
    }
}

async function updateProductRating(productId) {
    const summary = await Review.aggregate([
        { $match: { productId: mongoose.Types.ObjectId(productId) } },
        {
            $group: {
                _id: '$productId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    if (summary.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            averageRating: Math.round(summary[0].averageRating * 10) / 10,
            reviewCount: summary[0].reviewCount
        });
    }
};