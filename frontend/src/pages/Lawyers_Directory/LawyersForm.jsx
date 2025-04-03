import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const LawyersForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [noOfCasesSolved, setNoOfCasesSolved] = useState("");
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("");
  const [bio, setBio] = useState("");
  const [languageSpoken, setLanguageSpoken] = useState("");
  const [education, setEducation] = useState("");
  const [educationCertificate, setEducationCertificate] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");

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

    if (
      !name ||
      !email ||
      !contactNo ||
      !noOfCasesSolved ||
      !location ||
      !specialization ||
      !yearsOfExperience ||
      !description ||
      !availability ||
      !bio ||
      !languageSpoken ||
      !education ||
      !educationCertificate ||
      !profilePhoto
    ) {
      alert("Please fill in all fields and upload the required files.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("contactNo", contactNo);
    formData.append("noOfCasesSolved", noOfCasesSolved);
    formData.append("location", location);
    formData.append("specialization", specialization);
    formData.append("yearsOfExperience", yearsOfExperience);
    formData.append("description", description);
    formData.append("availability", availability);
    formData.append("bio", bio);
    formData.append("languageSpoken", languageSpoken);
    formData.append("education", education);
    formData.append("files", educationCertificate);
    formData.append("files", profilePhoto);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/lawyers-directory/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.data) {
        alert("Lawyer details uploaded successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while uploading the details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-red-900/90 to-gray-200 shadow-lg flex items-center justify-center">
      <div className="w-full max-w-5xl  bg-red-50/80 backdrop-blur-sm bg-red-50/80 rounded-xl shadow-2xl p-8 mt-12">
        <h2 className="text-black text-3xl font-bold mb-6 text-center">Lawyer Details Upload</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6 p-4 bg-red-950/10 rounded-xl shadow-lg">
            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-14 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Contact No</label>
              <input
                type="text"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                required
                className="w-full h-14 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Enter your contact number"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full h-14 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Enter your location"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
                className="w-full h-14 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Enter your area of specialization"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Years of Experience</label>
              <input
                type="number"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                required
                className="w-full h-14 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Enter your years of experience"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 p-4 bg-red-950/10 rounded-xl shadow-lg">
            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Number of Cases Solved</label>
              <input
                type="number"
                value={noOfCasesSolved}
                onChange={(e) => setNoOfCasesSolved(e.target.value)}
                required
                className="w-full h-14 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Enter number of cases solved"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full h-32 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Write a brief description of yourself"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Availability</label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                required
                className="w-full h-14 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Enter your availability (e.g., Full-time, Part-time)"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="w-full h-32 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Write a short bio"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Languages Spoken</label>
              <input
                type="text"
                value={languageSpoken}
                onChange={(e) => setLanguageSpoken(e.target.value)}
                required
                className="w-full h-14 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Enter languages spoken"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                required
                className="w-full h-14 px-4 bg-[#f3ece8]  rounded-2xl focus:ring-2 focus:ring-red-900 text-[#1b130e] placeholder-[#966c4f] focus:outline-none shadow-lg"
                placeholder="Enter your education qualification"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Education Certificate (PDF)</label>
              <div
                {...getRootProps({
                  className: "w-full h-14 bg-[#f3ece8]  rounded-2xl cursor-pointer text-center flex items-center justify-center",
                })}
              >
                <input {...getInputProps()} />
                <p className="text-[#966c4f] text-sm">Drag & Drop or Click to Upload Education Certificate (PDF only)</p>
              </div>
              {educationCertificate && <p className="mt-2 text-sm text-[#1b130e]">{educationCertificate.name}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#1b130e] font-medium mb-2">Profile Photo (Image)</label>
              <div
                {...getRootProps({
                  className: "w-full h-14 bg-[#f3ece8]  rounded-2xl cursor-pointer text-center flex items-center justify-center",
                })}
              >
                <input {...getInputProps()} />
                <p className="text-[#966c4f] text-sm">Drag & Drop or Click to Upload Profile Photo (Image only)</p>
              </div>
              {profilePhoto && <p className="mt-2 text-sm text-[#1b130e]">{profilePhoto.name}</p>}
            </div>
          </div>

          <div className="w-full py-4">
            <button
              type="submit"
              className="w-full py-3 bg-red-800 text-white text-sm font-semibold rounded-3xl hover:bg-red-900 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2 shadow-lg"
            >
              Upload Lawyer Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LawyersForm;
