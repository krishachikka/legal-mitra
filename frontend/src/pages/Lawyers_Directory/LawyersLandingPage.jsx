import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LawyersLandingPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile_no: '',
    email: '',
    experience: '',
    location: '',
    image: null,
    certificate: null,
    idProof: null,
    total_cases: '',
    top_cases: [{ case_name: '', rating: '' }],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/v1/lawyers-directory/lawyers');
        const fetchedLawyers = Array.isArray(response.data) ? response.data : [];
        setLawyers(fetchedLawyers);
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  const handleConnectClick = (lawyerId) => {
    navigate(`/lawyer-details/${lawyerId}`);
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
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
      top_cases: [...formData.top_cases, { case_name: '', rating: '' }],
    });
  };

  const removeTopCase = (index) => {
    const newTopCases = formData.top_cases.filter((_, i) => i !== index);
    setFormData({ ...formData, top_cases: newTopCases });
  };

  const validateForm = () => {
    if (!formData.image) {
      alert('Please upload a profile image.');
      return false;
    }
    if (!formData.certificate) {
      alert('Please upload your certificate.');
      return false;
    }
    if (!formData.idProof) {
      alert('Please upload your ID proof.');
      return false;
    }

    // Validate file types
    if (formData.image && !['image/jpeg', 'image/png'].includes(formData.image.type)) {
      alert('Please upload a JPEG or PNG image for your profile image.');
      return false;
    }
    if (formData.certificate && formData.certificate.type !== 'application/pdf') {
      alert('Please upload a PDF for your certificate.');
      return false;
    }
    if (formData.idProof && formData.idProof.type !== 'application/pdf') {
      alert('Please upload a PDF for your ID Proof.');
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent form from submitting in the default way.

    // Validate before submitting
    if (!validateForm()) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('mobile_no', formData.mobile_no);
    data.append('email', formData.email);
    data.append('experience', formData.experience);
    data.append('location', formData.location);
    data.append('total_cases', formData.total_cases);

    // Append top cases
    formData.top_cases.forEach((topCase, index) => {
      data.append(`top_cases[${index}][case_name]`, topCase.case_name);
      data.append(`top_cases[${index}][rating]`, topCase.rating);
    });

    // Append files if they are present
    if (formData.image) {
      data.append('image', formData.image);
    }
    if (formData.certificate) {
      data.append('certificate', formData.certificate);
    }
    if (formData.idProof) {
      data.append('idProof', formData.idProof);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/v1/lawyers-directory/become-a-lawyer', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Lawyer registration successful!');
      setShowModal(false);
      setFormData({
        name: '',
        mobile_no: '',
        email: '',
        experience: '',
        location: '',
        image: null,
        certificate: null,
        idProof: null,
        total_cases: '',
        top_cases: [{ case_name: '', rating: '' }],
      }); // Reset the form after successful submission
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[#fbfaf8] font-[Public Sans], sans-serif">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#f3ece8] px-10 py-8">
        <div className="flex items-center gap-4 text-[#1b130e]"></div>
        <div className="flex gap-4">
          <button
            onClick={handleModalToggle}
            className="flex items-center justify-center px-4 py-3 rounded-xl bg-[#e36c1c] text-[#fbfaf8] text-sm font-bold"
          >
            Become a Lawyer
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-40 py-5">
        <div className="max-w-[960px] mx-auto">
          <h1 className="text-4xl font-black text-[#1b130e] mb-4">Find a Lawyer</h1>

          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="What type of lawyer do you need?"
              className="w-full h-14 p-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
            />
          </div>

          {/* Featured Lawyers */}
          <h3 className="text-lg font-bold text-[#1b130e] mb-4">Featured Lawyers</h3>
          <div className="space-y-4">
            {lawyers.map((lawyer) => (
              <div key={lawyer._id} className="flex items-center justify-between bg-[#fbfaf8] p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 bg-cover rounded-full"
                    style={{ backgroundImage: `url(${lawyer.image})` }}
                  ></div>
                  <div>
                    <h4 className="text-xl font-semibold">{lawyer.name}</h4>
                    <p className="text-sm text-[#9b9b9b]">{lawyer.experience} years of experience</p>
                    <p className="text-sm text-[#9b9b9b]">{lawyer.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleConnectClick(lawyer._id)}
                  className="px-6 py-2 bg-[#e36c1c] text-white rounded-full font-semibold"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>

          {/* Become a Lawyer Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto">
                <h2 className="text-2xl font-bold text-center mb-4">Become a Lawyer</h2>
                <form onSubmit={handleFormSubmit}>
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
                      Experience (years)
                    </label>
                    <input
                      type="number"
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

                  {/* File Inputs */}
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
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="total_cases" className="block text-sm font-semibold text-[#1b130e] mb-2">
                      Total Cases Handled
                    </label>
                    <input
                      type="text"
                      id="total_cases"
                      name="total_cases"
                      value={formData.total_cases}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                    />
                  </div>

                  {/* Top Cases */}
                  {formData.top_cases.map((topCase, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between gap-4">
                        <div className="w-full">
                          <label className="block text-sm font-semibold text-[#1b130e] mb-2">
                            Case Name
                          </label>
                          <input
                            type="text"
                            name="case_name"
                            value={topCase.case_name}
                            onChange={(e) => handleTopCaseChange(index, e)}
                            className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                          />
                        </div>
                        <div className="w-full">
                          <label className="block text-sm font-semibold text-[#1b130e] mb-2">
                            Rating
                          </label>
                          <input
                            type="text"
                            name="rating"
                            value={topCase.rating}
                            onChange={(e) => handleTopCaseChange(index, e)}
                            className="w-full h-12 px-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeTopCase(index)}
                        className="mt-2 text-red-600 font-semibold"
                      >
                        Remove Case
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addTopCase}
                    className="text-[#e36c1c] font-semibold"
                  >
                    + Add Top Case
                  </button>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#e36c1c] text-[#fbfaf8] py-3 rounded-xl text-lg font-bold mt-6"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyersLandingPage;
