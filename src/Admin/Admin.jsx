import React, { useState, useEffect } from 'react';
import supabase from '../Supabase'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [formData, setFormData] = useState({
        city: '',
        country: '',
        'official-site': '',
        'image-id': '',
        'img-ext': '',
        'img-alt': '',
        continent: '',
        note: '',
        'note-link': '',
        shortened: ''
    });
    const [file, setFile] = useState(null);
    const [thumb, setThumb] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                const loginResult = await handleLogin();
                if (!loginResult) {
                    navigate('/');
                }
            } else {
                setSession(session);
            }
        };

        checkSession();

        // Handle session change using onAuthStateChange
        const subscription = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setSession(session);
            } else {
                navigate('/');
            }
        });

        // Clean up by returning an empty function when the component unmounts
        return () => {
            // React will handle cleanup automatically
        };
    }, [navigate]);

    const handleLogin = async () => {
        const email = prompt('Enter admin email:');
        const password = prompt('Enter password:');

        if (!email || !password) {
            return false;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert('Login failed: ' + error.message);
            return false;
        }

        return true;
    };

    // Auto-generate Image ID from the city name
    useEffect(() => {
        if (formData.city) {
            const imageId = formData.city.toLowerCase().replace(/\s+/g, '_');
            setFormData(prev => ({
                ...prev,
                'image-id': imageId
            }));
        }
    }, [formData.city]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            // Extract the file extension from the selected image
            const ext = selectedFile.name.split('.').pop().toLowerCase();

            // Ensure the file extension is only set once for the main image
            if (!formData['img-ext']) {
                setFormData(prev => ({
                    ...prev,
                    'img-ext': ext  // Set the extension for the first image only
                }));
            }
        }
    };

    const uploadThumbnail = async (modifiedFile) => {
        try {
            const { error: uploadError } = await supabase.storage
                .from('cities_maps')
                .upload(modifiedFile.name, modifiedFile);

            if (uploadError) throw uploadError;

            // Optionally, you can return a message or log that the thumbnail was uploaded successfully
            setMessage('Thumbnail uploaded successfully!');
        } catch (error) {
            setMessage(`Thumbnail upload failed: ${error.message}`);
        }
    };

    const handleFileChangeThumb = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setThumb(selectedFile);  // Store the thumbnail in the `thumb` state

            // Force the thumbnail to always be 'webp', without affecting the main image extension
            const newFileName = `${formData['image-id']}_thumb.webp`;

            // Set the extension for the thumbnail only in storage (but not in form data)
            const modifiedFile = new File([selectedFile], newFileName, { type: 'image/webp' });

            // Upload the thumbnail separately to Supabase storage
            uploadThumbnail(modifiedFile);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setMessage('');

        try {
            // Upload the main image if selected
            if (file) {
                const fileExt = formData['img-ext'];  // The main file extension
                const fileName = `${formData['image-id']}.${fileExt}`;  // Full name for main image

                // Upload the main image to Supabase storage
                const { error: uploadError } = await supabase.storage
                    .from('cities_maps')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;
            }

            // Insert the form data (excluding the file itself) into the 'cities' table
            const { error: insertError } = await supabase
                .from('cities')
                .insert([formData]);

            if (insertError) throw insertError;

            setMessage('City added successfully!');
            setFormData({
                city: '',
                country: '',
                'official-site': '',
                'image-id': '',
                'img-ext': '',
                'img-alt': '',
                continent: '',
                note: '',
                'note-link': '',
                'shortened': ''
            });
            setFile(null);
            setThumb(null);  // Reset the thumbnail after successful upload

        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };


    if (!session) {
        return null; // Don't render anything while checking auth
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Add New City Map</h1>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* City Name */}
                <div>
                    <label className="block text-white mb-2">City Name</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>

                {/* Country */}
                <div>
                    <label className="block text-white mb-2">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>

                {/* Official Site */}
                <div>
                    <label className="block text-white mb-2">Official Site</label>
                    <input
                        type="url"
                        name="official-site"
                        value={formData['official-site']}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>

                {/* Image ID (auto-generated but editable) */}
                <div>
                    <label className="block text-white mb-2">Image ID (auto-generated)</label>
                    <input
                        type="text"
                        name="image-id"
                        value={formData['image-id']}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-white mb-2">Image File</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-white mb-2">Image Thumbnail</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChangeThumb}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>

                {/* Image Extension (auto-detected) */}
                <div>
                    <label className="block text-white mb-2">Image Extension (auto-detected)</label>
                    <input
                        type="text"
                        name="img-ext"
                        value={formData['img-ext']}
                        readOnly
                        className="w-full p-2 rounded bg-gray-700 text-white opacity-50"
                    />
                </div>

                {/* Image Alt Text */}
                <div>
                    <label className="block text-white mb-2">Image Alt Text</label>
                    <input
                        type="text"
                        name="img-alt"
                        value={formData['img-alt']}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>

                {/* Continent */}
                <div>
                    <label className="block text-white mb-2">Continent</label>
                    <select
                        name="continent"
                        value={formData.continent}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    >
                        <option value="">Select Continent</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="North America">North America</option>
                        <option value="South America">South America</option>
                        <option value="Africa">Africa</option>
                        <option value="Australia">Australia</option>
                        <option value="Antarctica">Antarctica</option>
                    </select>
                </div>

                {/* Note */}
                <div>
                    <label className="block text-white mb-2">Note</label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        rows="3"
                    />
                </div>

                {/* Note Link */}
                <div>
                    <label className="block text-white mb-2">Note Link</label>
                    <input
                        type="url"
                        name="note-link"
                        value={formData['note-link']}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                {/* Shortened */}
                <div>
                    <label className="block text-white mb-2">Shortened</label>
                    <input
                        type="text"
                        name="shortened"
                        value={formData['shortened']}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isUploading}
                    className={`w-full p-3 rounded font-bold text-white ${isUploading
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                >
                    {isUploading ? 'Uploading...' : 'Add City Map'}
                </button>
            </form>
        </div>
    );
}
