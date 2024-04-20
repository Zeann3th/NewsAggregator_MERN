import mongoose from "mongoose";
import Category from "../models/CategoryModel.js";
import { Redis } from "ioredis";

/***********************************Get categories****************************************/
const getCategories = async (req, res) => {
    // Redis instance
    const redis = new Redis(process.env.REDIS_URL);
    const categoriesCache = await redis.get("categories_content");
    // Cache hit
    if (categoriesCache) {
        console.log("Fetching categories from cache");
        return res.status(200).json(JSON.parse(categoriesCache));
    }
    // Cache miss
    try {
        console.log("Fetching categories from database");
        const categories = await Category.find().populate("articles");
        const count = categories.length;
        const [{ _id, category, articles }] = categories;
        redis.set("categories_content", JSON.stringify({ count, categories: [{ _id, category, articles }] }), "EX", 600);
        res.status(200).json({ count, categories: [{ _id, category, articles }] });
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
}

/***********************************Search categories****************************************/
const searchCategories = async (req, res) => {
    const text = req.query.text;
    if (!text) {
        return res.status(400).json({ error: "text must not be empty!"})
    }
    try {
        const category1 = await Category.findOne({ category: { $regex: req.query.text } }).populate("articles");
        const { _id, category, articles } = category1;
        res.status(200).json({ category: { _id, category, articles } });
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
}
export { getCategories, searchCategories } 