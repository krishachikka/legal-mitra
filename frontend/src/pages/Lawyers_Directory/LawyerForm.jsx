import React, { useState } from 'react';
import axios from 'axios';

const LawyerForm = ({ showModal, handleModalToggle }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile_no: '',
    email: '',
    // ratings: 0,
    image: null,
    certificate: null,
    idProof: null,
    // total_cases: 0,
    top_cases: [{ case_name: '', rating: 0 }],
    experience: '',
    location: ''
  });

  const [filesUploaded, setFilesUploaded] = useState(false);

  // Function to upload file to Cloudinary
  const uploadFileToCloudinary = async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my files');  // Replace with your upload preset
    formData.append('folder', folder);

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dlm5kk4l1/image/upload', // Replace with your Cloudinary cloud name
        formData
      );
      return response.data.secure_url; // Return the secure URL of the uploaded file
    } catch (error) {
      throw new Error('Error uploading file to Cloudinary');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleTopCaseChange = (index, e) => {
    const { name, value } = e.target;
    const newTopCases = [...formData.top_cases];
    newTopCases[index][name] = value;
    setFormData({ ...formData, top_cases: newTopCases });
  };

  const addTopCase = () => {
    setFormData({
      ...formData,
      top_cases: [...formData.top_cases, { case_name: '', rating: 0 }]
    });
  };

  const removeTopCase = (index) => {
    const newTopCases = formData.top_cases.filter((_, i) => i !== index);
    setFormData({ ...formData, top_cases: newTopCases });
  };

  const validateFiles = () => {
    return formData.image && formData.certificate && formData.idProof;
  };

  const handleFileUploadSubmit = async (e) => {
    e.preventDefault();
    if (validateFiles()) {
      try {
        // Upload the files to Cloudinary
        const imageUrl = await uploadFileToCloudinary(formData.image, 'lawyer_images');
        const certificateUrl = await uploadFileToCloudinary(formData.certificate, 'lawyer_certificates');
        const idProofUrl = await uploadFileToCloudinary(formData.idProof, 'lawyer_id_proof');
  
        // After successful uploads, set the file URLs and show the rest of the form
        // setFormData({
        //   ...formData,
        //   image: imageUrl,
        //   certificate: certificateUrl,
        //   idProof: idProofUrl
        // });
  
        // Log the URLs to the console
        console.log('Image URL:', imageUrl);
        console.log('Certificate URL:', certificateUrl);
        console.log('ID Proof URL:', idProofUrl);
  
        // Show success message
        alert('Files uploaded successfully!');
  
        setFilesUploaded(true); // Files are uploaded, show remaining fields
      } catch (err) {
        alert('Error uploading files to Cloudinary');
        console.error(err);
      }
    } else {
      alert('Please upload all required files (image, certificate, and ID proof).');
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Log the form data to the console for debugging
    console.log('Form Data Before Submission:', formData);
  
    const data = new FormData();
    // Append basic fields
    data.append('name', formData.name);
    data.append('mobile_no', formData.mobile_no);
    data.append('email', formData.email);
    // data.append('ratings', formData.ratings);
    data.append('experience', formData.experience);
    data.append('location', formData.location);
    // data.append('total_cases', formData.total_cases);  // Adding total_cases properly
  
    // Append top_cases (proper nested structure for top_cases)
    formData.top_cases.forEach((topCase, index) => {
      data.append(`top_cases[${index}][case_name]`, topCase.case_name);
      data.append(`top_cases[${index}][rating]`, topCase.rating);
    });
  
    // Append file URLs after successful upload
    if (formData.image) data.append('image', formData.image);  // Image URL
    if (formData.certificate) data.append('certificate', formData.certificate);  // Certificate URL
    if (formData.idProof) data.append('idProof', formData.idProof);  // ID Proof URL
  
    try {
      // Log data being sent to the server
      console.log('Sending the following data to server:', data);
  
      // Make the actual POST request to submit the form data
      const response = await axios.post('http://localhost:3000/api/v1/lawyers-directory/become-a-lawyer', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Handle the response after successful submission
      console.log('Response from server:', response);  // Log response for further debugging
      alert('Lawyer registration successful!');
      handleModalToggle();
  
      // Reset the form after submission
      setFormData({
        name: '',
        mobile_no: '',
        email: '',
        // ratings: 0,
        image: null,
        certificate: null,
        idProof: null,
        // total_cases: 0,
        top_cases: [{ case_name: '', rating: 0 }],
        experience: '',
        location: '',
      });
  
      setFilesUploaded(false); // Reset the file upload state
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form.');
    }
  };
   
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Become a Lawyer</h2>

        <form onSubmit={filesUploaded ? handleFormSubmit : handleFileUploadSubmit}>
          {!filesUploaded && (
            <div>
              {/* File Upload Fields */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-semibold text-[#1b130e] mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                  accept="image/*"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="certificate" className="block text-sm font-semibold text-[#1b130e] mb-2">
                  Certificate (PDF)
                </label>
                <input
                  type="file"
                  id="certificate"
                  name="certificate"
                  onChange={handleFileChange}
                  className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                  accept="application/pdf"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="idProof" className="block text-sm font-semibold text-[#1b130e] mb-2">
                  ID Proof (PDF)
                </label>
                <input
                  type="file"
                  id="idProof"
                  name="idProof"
                  onChange={handleFileChange}
                  className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                  accept="application/pdf"
                  required
                />
              </div>
            </div>
          )}

          {filesUploaded && (
            <div>
              {/* Other Input Fields */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-semibold text-[#1b130e] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="mobile_no" className="block text-sm font-semibold text-[#1b130e] mb-2">
                  Mobile No
                </label>
                <input
                  type="text"
                  id="mobile_no"
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold text-[#1b130e] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="experience" className="block text-sm font-semibold text-[#1b130e] mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-semibold text-[#1b130e] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                  required
                />
              </div>

              {/* Top Cases */}
              <div className="mb-4">
                {formData.top_cases.map((topCase, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-[#1b130e] mb-2">
                        Case Name
                      </label>
                      <input
                        type="text"
                        name="case_name"
                        value={topCase.case_name}
                        onChange={(e) => handleTopCaseChange(index, e)}
                        className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-[#1b130e] mb-2">
                        Rating
                      </label>
                      <input
                        type="number"
                        name="rating"
                        value={topCase.rating}
                        onChange={(e) => handleTopCaseChange(index, e)}
                        className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                        min="0"
                        max="5"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTopCase(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-full"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTopCase}
                  className="text-sm text-[#e36c1c] hover:underline mb-4"
                >
                  Add another top case
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-[#e36c1c] text-white rounded-xl font-semibold"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Close Modal */}
        <button
          onClick={handleModalToggle}
          className="absolute top-2 right-2 text-white text-lg font-semibold"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default LawyerForm;
