const mongoose = require("mongoose");

const productSchema =new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter Product Name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"],
    },
    price: {
        type: Number,
        required: [true, "please Enter Price"],
        maxLength: [8, "price Can not exceed 8 Characters"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            publicId: {
                type: String,
                required: true,
            },
            Url: {
                type: String,
                required: true,
            },
        },
    ],
    Stock: {
        type: Number,
        required: [true, "please enter products Stock"],
        maxLength: [4, "Stock can not Exceed 4 charactor"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
        },
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Products',productSchema)