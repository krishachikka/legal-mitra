import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const LawyersForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [noOfCasesSolved, setNoOfCasesSolved] = useState("");
  const [educationCertificate, setEducationCertificate] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 1) {
        if (acceptedFiles[0].type.startsWith("image/")) {
          setProfilePhoto(acceptedFiles[0]);
        } else {
          setEducationCertificate(acceptedFiles[0]);
        }
      }
    },
    multiple: false,
    accept: "image/*,application/pdf", // Accept both image and PDF
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !email || !contactNo || !noOfCasesSolved || !educationCertificate || !profilePhoto) {
      setUploadMessage("Please fill in all fields and upload the required files.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("contactNo", contactNo);
    formData.append("noOfCasesSolved", noOfCasesSolved);
    formData.append("files", educationCertificate);
    formData.append("files", profilePhoto);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/lawyers-directory/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.data) {
        setUploadedUrls([response.data.data.profilePhoto, response.data.data.educationCertificate]);
        setUploadMessage("Lawyer details uploaded successfully!");
      }
    } catch (error) {
      console.error(error);
      setUploadMessage("Something went wrong while uploading the details.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Lawyer Details Upload</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact No:</label>
          <input
            type="text"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Cases Solved:</label>
          <input
            type="number"
            value={noOfCasesSolved}
            onChange={(e) => setNoOfCasesSolved(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Education Certificate:</label>
          <div {...getRootProps({ className: "dropzone mt-1 border-dashed border-2 border-gray-400 rounded-md p-4 text-center cursor-pointer" })}>
            <input {...getInputProps()} />
            <p className="text-gray-500">Drag & Drop or Click to Upload Education Certificate (PDF only)</p>
          </div>
          {educationCertificate && <p className="mt-2 text-sm text-gray-600">{educationCertificate.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Photo:</label>
          <div {...getRootProps({ className: "dropzone mt-1 border-dashed border-2 border-gray-400 rounded-md p-4 text-center cursor-pointer" })}>
            <input {...getInputProps()} />
            <p className="text-gray-500">Drag & Drop or Click to Upload Profile Photo (Image only)</p>
          </div>
          {profilePhoto && <p className="mt-2 text-sm text-gray-600">{profilePhoto.name}</p>}
        </div>

        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Upload Lawyer Details
        </button>
      </form>

      {uploadMessage && <p className="mt-4 text-sm text-center text-red-500">{uploadMessage}</p>}

      {uploadedUrls.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
          <p>
            Profile Photo: <a href={uploadedUrls[0]} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">View</a>
          </p>
          <p>
            Education Certificate: <a href={uploadedUrls[1]} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">View</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default LawyersForm;