import Joi from 'joi';

// Custom error messages
const messages = {
  'string.empty': '{{#label}} cannot be empty',
  'any.required': '{{#label}} is required',
  'number.base': '{{#label}} must be a number',
  'number.empty': '{{#label}} cannot be empty',
  'number.min': '{{#label}} must be at least {{#limit}}',
  'string.base': '{{#label}} must be text'
};

// Item schema
const itemSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().required().min(1).messages(messages),
  description: Joi.string().required().min(1).messages(messages),
  price: Joi.number().required().min(0).messages(messages),
  isVeg: Joi.boolean().default(true),
  tax: Joi.number().min(0).max(100).default(5),
  preparation_time: Joi.number().required().min(1).messages({
    'number.min': 'Preparation time must be at least 1 minute',
    ...messages
  }),
  image: Joi.string().allow('').optional(),
  isAvailable: Joi.boolean().default(true),
  popular: Joi.boolean().default(false),
  operationGroups: Joi.array().default([]),
  isPopular: Joi.boolean().default(false)
});

// Category schema
const categorySchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().required().min(1).messages(messages),
  description: Joi.string().required().min(1).messages(messages),
  isActive: Joi.boolean().default(true),
  items: Joi.array().items(itemSchema).default([])
});

// Main menu schema
const menuSchema = Joi.object({
  _id: Joi.string().optional(),
  rest_id: Joi.string().required().messages(messages),
  restaurant_name: Joi.string().allow('').optional(),
  isActive: Joi.boolean().default(true),
  categories: Joi.array().items(categorySchema).default([])
});

// Validation function
export const validateMenu = (menuData) => {
  return menuSchema.validate(menuData, { abortEarly: false });
};

// Validate a single category
export const validateCategory = (categoryData) => {
  return categorySchema.validate(categoryData, { abortEarly: false });
};

// Validate a single item
export const validateItem = (itemData) => {
  return itemSchema.validate(itemData, { abortEarly: false });
};

// Format validation errors for display
export const formatValidationErrors = (error) => {
  if (!error) return null;
  
  return error.details.reduce((acc, curr) => {
    const path = curr.path.join('.');
    acc[path] = curr.message;
    return acc;
  }, {});
};