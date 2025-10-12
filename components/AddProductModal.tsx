import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Product, ProductCategory } from '../types';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon, Spinner } from './icons';
import { CATEGORIES } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'seller'>) => void;
}

const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [mimeInfo, base64Data] = result.split(',', 2);
      resolve({ base64: base64Data, mimeType: mimeInfo.split(':')[1].split(';')[0] });
    };
    reader.onerror = (error) => reject(error);
  });
};


const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const resetForm = useCallback(() => {
    setName('');
    setPrice('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setIsGenerating(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        handleClose();
       }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, handleClose]);
  
  const handleGenerateDescription = async () => {
    if (!name || !imageFile) {
      setError('Please provide a product name and image first.');
      return;
    }
    setError(null);
    setIsGenerating(true);
    setDescription('Generating with AI...');
    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const generatedDesc = await generateDescription(name, base64, mimeType);
      setDescription(generatedDesc);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setDescription('');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description || !imagePreview || !category) {
      setError('Please fill all fields, select a category and upload an image.');
      return;
    }
    
    const newProductData = {
      name,
      price: parseFloat(price),
      description,
      imageUrl: imagePreview,
      category,
    };
    onSave(newProductData);
    handleClose();
  };

  return (
    <div 
        className={`fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
        onClick={handleClose}
    >
        <div 
            className={`bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            onClick={e => e.stopPropagation()}
        >
            <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start">
                    <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-gray-900">Add a New Product</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full" aria-label="Close modal">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input type="text" id="product-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (ZAR)</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                    </div>
                    </div>

                    <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Image</label>
                        <div className="mt-2">
                        {imagePreview ? (
                            <div className="relative group">
                                <img src={imagePreview} alt="Product Preview" className="w-full h-40 sm:h-64 object-contain rounded-md bg-gray-50 p-1 border border-gray-200" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center rounded-md">
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        setImagePreview(null);
                                        setImageFile(null);
                                        if(fileInputRef.current) fileInputRef.current.value = "";
                                      }}
                                      className="bg-white rounded-full py-2 px-4 text-sm font-medium text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                      aria-label="Remove image"
                                    >
                                      Change Image
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                        <span>Upload an image</span>
                                        <input id="file-upload" name="file-upload" type="file" ref={fileInputRef} className="sr-only" accept="image/*" onChange={handleImageChange} required />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <button
                          type="button"
                          onClick={handleGenerateDescription}
                          disabled={isGenerating || !name || !imageFile}
                          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {isGenerating ? (
                            <Spinner className="w-4 h-4 mr-2" />
                          ) : (
                            <SparklesIcon className="w-4 h-4 mr-1" />
                          )}
                          Generate with AI
                        </button>
                      </div>
                      <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Describe your product..." required></textarea>
                    </div>
                    
                    {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

                    <div className="pt-5 border-t border-gray-200">
                      <div className="flex justify-end space-x-3">
                        <button type="button" onClick={handleClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                          Cancel
                        </button>
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                          Save Product
                        </button>
                      </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default AddProductModal;