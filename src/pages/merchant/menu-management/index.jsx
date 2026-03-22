// src/pages/MenuManagement.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMenu, useCreateMenu, useUpdateMenu } from "../../../hooks";
import { useForm, useFieldArray } from "react-hook-form";
import { validateMenu, formatValidationErrors, validateCategory, validateItem } from "../../../validations";

/* ---------------- ICONS ---------------- */

const Icons = {
  add: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  delete: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0h10"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  veg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-600"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="12" cy="12" r="4" fill="white"/></svg>,
  nonVeg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="12" cy="12" r="4" fill="white"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  save: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  drag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
};

/* ---------------- COMPONENTS ---------------- */

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-gray-900' : 'bg-gray-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const ImageUpload = ({ image, onImageChange }) => (
  <div className="relative w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden group cursor-pointer">
    {image ? (
      <>
        <img src={image} alt="Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs">Change</span>
        </div>
      </>
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        {Icons.image}
      </div>
    )}
    <input
      type="file"
      className="absolute inset-0 opacity-0 cursor-pointer"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => onImageChange(reader.result);
          reader.readAsDataURL(file);
        }
      }}
    />
  </div>
);

const ItemModal = ({ isOpen, onClose, item, categoryName, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isVeg: true,
    price: '',
    tax: 5,
    preparation_time: '',
    image: '',
    isAvailable: true,
    isPopular: false,       // ✅ renamed from "popular" to match API
    operationGroups: []
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        isVeg: item.isVeg ?? true,
        price: item.price ?? '',
        tax: item.tax ?? 5,
        preparation_time: item.preparation_time ?? '',
        image: item.image || '',
        isAvailable: item.isAvailable ?? true,
        isPopular: item.isPopular ?? false,   // ✅ read isPopular from item
        operationGroups: item.operationGroups || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        isVeg: true,
        price: '',
        tax: 5,
        preparation_time: '',
        image: '',
        isAvailable: true,
        isPopular: false,                     // ✅ default false for new item
        operationGroups: []
      });
    }
    setErrors({});
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const { error } = validateItem(formData);
    if (error) {
      const formattedErrors = formatValidationErrors(error);
      setErrors(formattedErrors);
      return;
    }
    setIsSaving(true);
    onSave(formData);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-gray-900">
            {item ? 'Edit' : 'Add'} Item {categoryName && `- ${categoryName}`}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            {Icons.close}
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-3">
              Item Image
            </label>
            <ImageUpload
              image={formData.image}
              onImageChange={(img) => setFormData({ ...formData, image: img })}
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: null });
                }}
                className={`w-full px-4 py-2 rounded-xl border ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                } text-[14px] focus:outline-none focus:border-gray-400`}
                placeholder="Add item name here"
              />
              {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  setErrors({ ...errors, price: null });
                }}
                className={`w-full px-4 py-2 rounded-xl border ${
                  errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'
                } text-[14px] focus:outline-none focus:border-gray-400`}
                placeholder="Add price here"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-red-500 text-[11px] mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setErrors({ ...errors, description: null });
              }}
              rows={2}
              className={`w-full px-4 py-2 rounded-xl border ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
              } text-[14px] focus:outline-none focus:border-gray-400`}
              placeholder="Add item description here"
            />
            {errors.description && <p className="text-red-500 text-[11px] mt-1">{errors.description}</p>}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Preparation Time (min) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.preparation_time}
                onChange={(e) => {
                  setFormData({ ...formData, preparation_time: e.target.value });
                  setErrors({ ...errors, preparation_time: null });
                }}
                className={`w-full px-4 py-2 rounded-xl border ${
                  errors.preparation_time ? 'border-red-300 bg-red-50' : 'border-gray-200'
                } text-[14px] focus:outline-none focus:border-gray-400`}
                placeholder="Add time here"
                min="1"
              />
              {errors.preparation_time && <p className="text-red-500 text-[11px] mt-1">{errors.preparation_time}</p>}
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Tax (%)
              </label>
              <input
                type="number"
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-gray-400"
                placeholder="Add tax here"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-gray-700">Vegetarian</span>
              <Toggle
                enabled={formData.isVeg}
                onChange={() => setFormData({ ...formData, isVeg: !formData.isVeg })}
              />
            </div>

            {/* ✅ Available toggle — maps to isAvailable */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-gray-700">Available</span>
              <Toggle
                enabled={formData.isAvailable}
                onChange={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
              />
            </div>

            {/* ✅ Mark as Popular toggle — maps to isPopular */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-gray-700">Mark as Popular</span>
              <Toggle
                enabled={formData.isPopular}
                onChange={() => setFormData({ ...formData, isPopular: !formData.isPopular })}
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-900 text-white text-[13px] rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {Icons.save}
            {isSaving ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        isActive: category.isActive ?? true
      });
    } else {
      setFormData({ name: '', description: '', isActive: true });
    }
    setErrors({});
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const { error } = validateCategory(formData);
    if (error) {
      const formattedErrors = formatValidationErrors(error);
      setErrors(formattedErrors);
      return;
    }
    setIsSaving(true);
    onSave(formData);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-gray-900">
            {category ? 'Edit' : 'Add'} Category
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            {Icons.close}
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: null });
              }}
              className={`w-full px-4 py-2 rounded-xl border ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
              } text-[14px] focus:outline-none focus:border-gray-400`}
              placeholder="Add category name here"
            />
            {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setErrors({ ...errors, description: null });
              }}
              rows={2}
              className={`w-full px-4 py-2 rounded-xl border ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
              } text-[14px] focus:outline-none focus:border-gray-400`}
              placeholder="Add category description here"
            />
            {errors.description && <p className="text-red-500 text-[11px] mt-1">{errors.description}</p>}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[14px] text-gray-700">Active</span>
            <Toggle
              enabled={formData.isActive}
              onChange={() => setFormData({ ...formData, isActive: !formData.isActive })}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-900 text-white text-[13px] rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {Icons.save}
            {isSaving ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ ItemCard uses isPopular (matches API) and eye button correctly toggles isAvailable
const ItemCard = ({ item, categoryName, onEdit, onDelete, onToggleAvailability }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: `opacity .3s ease, transform .3s ease`
      }}
    >
      <div className="flex gap-3">
        {/* Item Image */}
        <div className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              {Icons.image}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {item.isVeg ? Icons.veg : Icons.nonVeg}
                <h4 className="text-[14px] font-medium text-gray-900 truncate">
                  {item.name}
                </h4>
                {/* ✅ use isPopular (not popular) */}
                {item.isPopular && (
                  <span className="px-1.5 py-0.5 bg-yellow-50 text-yellow-600 text-[9px] font-medium rounded">
                    Popular
                  </span>
                )}
                {/* ✅ visual indicator when item is unavailable */}
                {!item.isAvailable && (
                  <span className="px-1.5 py-0.5 bg-red-50 text-red-500 text-[9px] font-medium rounded">
                    Unavailable
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 line-clamp-1">{item.description}</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {/* ✅ Eye button toggles isAvailable via onToggleAvailability */}
              <button
                onClick={() => onToggleAvailability(item.id)}
                title={item.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                className={`p-1.5 rounded-lg hover:bg-gray-50 transition-colors ${
                  item.isAvailable ? 'text-gray-400 hover:text-gray-600' : 'text-red-400 hover:text-red-600'
                }`}
              >
                {item.isAvailable ? Icons.eye : Icons.eyeOff}
              </button>
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
              >
                {Icons.edit}
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
              >
                {Icons.delete}
              </button>
            </div>
          </div>

          {/* Price & Time */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              {Icons.dollar}
              <span>₹{item.price}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              {Icons.clock}
              <span>{item.preparation_time} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({ category, onEdit, onDelete, onAddItem, onEditItem, onDeleteItem, onToggleItemAvailability, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 70);
    return () => clearTimeout(t);
  }, [index]);

  if (!category.isActive) return null;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .45s ease ${index * 70}ms, transform .45s ease ${index * 70}ms`
      }}
    >
      {/* Category Header */}
      <div
        className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-600">
            <span style={{ transform: `rotate(${isExpanded ? 90 : 0}deg)`, display: 'inline-block', transition: 'transform .3s' }}>
              {Icons.chevron}
            </span>
          </button>
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">{category.name}</h3>
            <p className="text-[11px] text-gray-400">{category.description}</p>
          </div>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded-full">
            {category.items?.length || 0} items
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onAddItem(); }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
          >
            {Icons.add}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(category); }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
          >
            {Icons.edit}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(category.id); }}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
          >
            {Icons.delete}
          </button>
        </div>
      </div>

      {/* Items Grid */}
      {isExpanded && (
        <div className="p-6">
          {category.items && category.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {category.items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  categoryName={category.name}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                  onToggleAvailability={onToggleItemAvailability}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[12px] text-gray-400">No items in this category</p>
              <button
                onClick={onAddItem}
                className="mt-3 text-[12px] text-gray-900 hover:text-gray-700 font-medium"
              >
                + Add your first item
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function MenuManagement() {
  const { rest_id } = useParams();
  const [time, setTime] = useState(new Date());
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  const { data: menuData, isLoading, error, refetch, isFetching } = useMenu(rest_id);
  const createMenuMutation = useCreateMenu();
  const updateMenuMutation = useUpdateMenu();

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      _id: null,
      rest_id: rest_id || "",
      restaurant_name: "",
      isActive: true,
      categories: []
    }
  });

  const {
    fields: categories,
    append: appendCategory,
    remove: removeCategory,
    update: updateCategory
  } = useFieldArray({ control, name: "categories" });

  const formValues = watch();
  const generateId = useCallback(() => Math.random().toString(36).substr(2, 9), []);

  const transformApiDataToForm = useCallback((apiMenu) => {
    if (!apiMenu) return null;
    return {
      ...apiMenu,
      categories: (apiMenu.categories || []).map(cat => ({
        ...cat,
        id: cat._id || cat.id || generateId(),
        items: (cat.items || []).map(item => ({
          ...item,
          id: item._id || item.id || generateId(),
          isAvailable: item.isAvailable ?? true,   // ✅ preserve from API
          isPopular: item.isPopular ?? false,        // ✅ preserve from API
        }))
      }))
    };
  }, [generateId]);

  const handleBack = () => navigate(`/merchant/${rest_id}`);

  // ✅ transformFormToApiData now correctly sends isPopular and isAvailable to the backend
  const transformFormToApiData = useCallback((formData) => {
    return {
      ...(formData._id && { _id: formData._id }),
      rest_id: formData.rest_id || rest_id,
      restaurant_name: formData.restaurant_name || "",
      isActive: formData.isActive ?? true,
      categories: (formData.categories || []).map(cat => ({
        name: cat.name || "",
        description: cat.description || "",
        isActive: cat.isActive ?? true,
        items: (cat.items || []).map(item => ({
          name: item.name || "",
          description: item.description || "",
          isVeg: item.isVeg ?? true,
          price: Number(item.price) || 0,
          tax: Number(item.tax) || 0,
          preparation_time: Number(item.preparation_time) || 0,
          image: item.image || "",
          isAvailable: item.isAvailable ?? true,   // ✅ was already correct
          isPopular: item.isPopular ?? false,        // ✅ fixed: was missing entirely
          operationGroups: item.operationGroups || []
        }))
      }))
    };
  }, [rest_id]);

  useEffect(() => {
    if (menuData?.data) {
      const transformedMenu = transformApiDataToForm(menuData.data);
      reset(transformedMenu);
      setIsInitialized(true);
    } else if (!isLoading && !menuData?.data && rest_id) {
      reset({ rest_id, restaurant_name: "", isActive: true, categories: [] });
      setIsInitialized(true);
    }
  }, [menuData, isLoading, rest_id, transformApiDataToForm, reset]);

  useEffect(() => {
    if (rest_id) {
      setIsInitialized(false);
      refetch();
    }
  }, [rest_id, refetch]);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSaveCategory = useCallback((categoryData) => {
    if (editingCategory) {
      const categoryIndex = categories.findIndex(c => c.id === editingCategory.id);
      if (categoryIndex !== -1) {
        updateCategory(categoryIndex, {
          ...categories[categoryIndex],
          ...categoryData,
          items: categories[categoryIndex].items || []
        });
      }
    } else {
      appendCategory({ id: generateId(), ...categoryData, items: [] });
    }
  }, [editingCategory, categories, appendCategory, updateCategory, generateId]);

  const handleDeleteCategory = useCallback((categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      if (categoryIndex !== -1) removeCategory(categoryIndex);
    }
  }, [categories, removeCategory]);

  const handleSaveItem = useCallback((itemData) => {
    if (!selectedCategory) return;
    const categoryIndex = categories.findIndex(c => c.id === selectedCategory.id);
    if (categoryIndex === -1) return;

    const currentCategory = categories[categoryIndex];
    const updatedItems = [...(currentCategory.items || [])];

    if (editingItem) {
      const itemIndex = updatedItems.findIndex(i => i.id === editingItem.id);
      if (itemIndex !== -1) {
        updatedItems[itemIndex] = { ...editingItem, ...itemData };
      }
    } else {
      updatedItems.push({ id: generateId(), ...itemData });
    }

    updateCategory(categoryIndex, { ...currentCategory, items: updatedItems });
  }, [selectedCategory, editingItem, categories, updateCategory, generateId]);

  const handleDeleteItem = useCallback((categoryId, itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      if (categoryIndex === -1) return;
      const currentCategory = categories[categoryIndex];
      updateCategory(categoryIndex, {
        ...currentCategory,
        items: (currentCategory.items || []).filter(i => i.id !== itemId)
      });
    }
  }, [categories, updateCategory]);

  // ✅ toggles isAvailable on the item — driven by the eye button in ItemCard
  const handleToggleItemAvailability = useCallback((categoryId, itemId) => {
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    const currentCategory = categories[categoryIndex];
    updateCategory(categoryIndex, {
      ...currentCategory,
      items: currentCategory.items.map(i =>
        i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i
      )
    });
  }, [categories, updateCategory]);

  const onSubmit = useCallback(async (data) => {
    try {
      const apiData = transformFormToApiData(data);
      if (data._id) {
        await updateMenuMutation.mutateAsync(apiData);
        alert('Menu updated successfully!');
      } else {
        await createMenuMutation.mutateAsync(apiData);
        alert('Menu created successfully!');
      }
      await refetch();
    } catch (error) {
      console.error('Error saving menu:', error);
      alert(error.message || 'Failed to save menu. Please try again.');
    }
  }, [transformFormToApiData, updateMenuMutation, createMenuMutation, refetch]);

  if (isLoading || isFetching || !isInitialized) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading menu: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={handleBack}
              className="w-12 h-12 rounded-full bg-gray-200 border border-gray-200 hover:bg-gray-100 hover:shadow-md flex items-center justify-center text-black transition-all duration-200"
              title="Go to Dashboard"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="w-8 h-8 rounded-[10px] bg-gray-900 flex items-center justify-center text-white">
              📋
            </div>
            <p className="font-bold text-gray-900">Menu Management</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-400 tabular-nums">
              {time.toLocaleTimeString()}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white flex items-center justify-center text-xs font-bold">
              MM
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-start gap-4 mb-8">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {formValues?.restaurant_name || "No restaurant name"}
              </p>
              <h2 className="text-[34px] font-bold text-gray-900">Menu Editor</h2>
              <p className="text-gray-400 text-[14px] mt-1">
                Manage your categories and menu items.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsCategoryModalOpen(true);
              }}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {Icons.add}
              Add Category
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={createMenuMutation.isPending || updateMenuMutation.isPending}
              className="px-4 py-2 bg-gray-900 text-white text-[13px] rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {Icons.save}
              {createMenuMutation.isPending || updateMenuMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Restaurant Status */}
        <div className="mb-6 flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-gray-600">Restaurant Status:</span>
            <Toggle
              enabled={formValues?.isActive}
              onChange={() => setValue('isActive', !formValues?.isActive)}
            />
            <span className={`text-[12px] font-medium ${formValues?.isActive ? 'text-green-600' : 'text-gray-400'}`}>
              {formValues?.isActive ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {categories
            .filter(c => c.isActive)
            .map((category, index) => (
              <CategorySection
                key={category.id}
                category={category}
                index={index}
                onEdit={(cat) => {
                  setEditingCategory(cat);
                  setIsCategoryModalOpen(true);
                }}
                onDelete={handleDeleteCategory}
                onAddItem={() => {
                  setSelectedCategory(category);
                  setEditingItem(null);
                  setIsItemModalOpen(true);
                }}
                onEditItem={(item) => {
                  setSelectedCategory(category);
                  setEditingItem(item);
                  setIsItemModalOpen(true);
                }}
                onDeleteItem={(itemId) => handleDeleteItem(category.id, itemId)}
                onToggleItemAvailability={(itemId) => handleToggleItemAvailability(category.id, itemId)}
              />
            ))}
        </div>

        {/* Empty State */}
        {categories.filter(c => c.isActive).length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              📋
            </div>
            <p className="text-gray-400 text-[14px] mb-4">No categories yet</p>
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsCategoryModalOpen(true);
              }}
              className="px-4 py-2 bg-gray-900 text-white text-[13px] rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              {Icons.add}
              Create your first category
            </button>
          </div>
        )}

        {/* Modals */}
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          category={editingCategory}
          onSave={handleSaveCategory}
        />

        <ItemModal
          isOpen={isItemModalOpen}
          onClose={() => {
            setIsItemModalOpen(false);
            setEditingItem(null);
            setSelectedCategory(null);
          }}
          item={editingItem}
          categoryName={selectedCategory?.name}
          onSave={handleSaveItem}
        />
      </main>
    </div>
  );
}