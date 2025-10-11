import { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNo: '',
    email: '',
    experience: '',
    location: '',
    totalCases: '',
    topCases: [{ caseName: '', rating: '' }],
    image: null,
    certificate: null,
    idProof: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTopCaseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTopCases = [...formData.topCases];
    updatedTopCases[index][name] = value;
    setFormData({ ...formData, topCases: updatedTopCases });
  };

  const addTopCase = () => {
    setFormData({
      ...formData,
      topCases: [...formData.topCases, { caseName: '', rating: '' }],
    });
  };

  const removeTopCase = (index) => {
    const updatedTopCases = formData.topCases.filter((_, i) => i !== index);
    setFormData({ ...formData, topCases: updatedTopCases });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const uploadFileToCloudinary = async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my files'); // Replace with your Cloudinary upload preset
    formData.append('folder', folder);

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dlm5kk4l1/image/upload', // Replace with your Cloudinary cloud name
        formData
      );
      const fileUrl = response.data.secure_url; // Return the secure URL of the uploaded file
      alert(`${folder} uploaded successfully: ${fileUrl}`); // Alert with file URL
      return fileUrl;
    } catch (error) {
      throw new Error(`Error uploading file to Cloudinary: ${folder}`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload the files to Cloudinary and get the URLs
    try {
      const imageUrl = formData.image ? await uploadFileToCloudinary(formData.image, 'user_images') : null;
      const certificateUrl = formData.certificate ? await uploadFileToCloudinary(formData.certificate, 'user_certificates') : null;
      const idProofUrl = formData.idProof ? await uploadFileToCloudinary(formData.idProof, 'user_id_proof') : null;

      // Include the URLs in the form data
      const data = { ...formData, imageUrl, certificateUrl, idProofUrl };

      // Make the API request to submit the data
      const response = await axios.post(`${import.meta.env.VITE_NODE_BACKEND_URL}/api/users`, data);
      console.log('User created:', response.data);

      // Show alert after successful submission
      alert('User created successfully!');

      // Reset the form after submission
      setFormData({
        name: '',
        mobileNo: '',
        email: '',
        experience: '',
        location: '',
        totalCases: '',
        topCases: [{ caseName: '', rating: '' }],
        image: null,
        certificate: null,
        idProof: null,
      });
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Error creating user. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Create User</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
          />
        </div>

        {/* Mobile No Input */}
        <div>
          <label htmlFor="mobileNo" className="block text-lg font-medium text-gray-700">Mobile No</label>
          <input
            type="text"
            id="mobileNo"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter mobile number"
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
          />
        </div>

        {/* Experience Input */}
        <div>
          <label htmlFor="experience" className="block text-lg font-medium text-gray-700">Experience</label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter experience details"
          />
        </div>

        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-lg font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter location"
          />
        </div>

        {/* Total Cases Input */}
        <div>
          <label htmlFor="totalCases" className="block text-lg font-medium text-gray-700">Total Cases</label>
          <input
            type="text"
            id="totalCases"
            name="totalCases"
            value={formData.totalCases}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter total cases"
          />
        </div>

        {/* File Upload Fields */}
        <div>
          <div>
            <label htmlFor="image" className="block text-lg font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              accept="image/*"
            />
          </div>

          <div>
            <label htmlFor="certificate" className="block text-lg font-medium text-gray-700">Certificate (PDF)</label>
            <input
              type="file"
              id="certificate"
              name="certificate"
              onChange={handleFileChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              accept="application/pdf"
            />
          </div>

          <div>
            <label htmlFor="idProof" className="block text-lg font-medium text-gray-700">ID Proof (PDF)</label>
            <input
              type="file"
              id="idProof"
              name="idProof"
              onChange={handleFileChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              accept="application/pdf"
            />
          </div>
        </div>

        {/* Top Cases Section */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Top Cases</label>
          {formData.topCases.map((caseData, index) => (
            <div key={index} className="flex space-x-4 items-center">
              <input
                type="text"
                name="caseName"
                value={caseData.caseName}
                onChange={(e) => handleTopCaseChange(index, e)}
                placeholder="Case Name"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                name="rating"
                value={caseData.rating}
                onChange={(e) => handleTopCaseChange(index, e)}
                placeholder="Rating"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeTopCase(index)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTopCase}
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 mt-4"
          >
            Add Top Case
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
