import { useState, useEffect } from "react";

export default function AdminEvents() {
  const [showForm, setShowForm] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    capacity: "",
    category: "",
    eventImage: null,
    accountName: "", // Add these
    accountNumber: "",
    bankName: "",
  });

  useEffect(() => {
    // Get user info from localStorage
    const adminInfo = JSON.parse(localStorage.getItem("tix-user"));
    if (adminInfo) {
      setUserInfo(adminInfo);
    }
  }, []);

  const handleNewEvent = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      price: "",
      capacity: "",
      category: "",
      eventImage: null,
      accountName: "", // Add these
      accountNumber: "",
      bankName: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      setFormData((prev) => ({
        ...prev,
        eventImage: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async () => {
    // Enhanced validation
    if (
      !formData.title ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.capacity
    ) {
      alert("Please fill in all required fields (including capacity)");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("date", formData.date);
    submitData.append("time", formData.time);
    submitData.append("location", formData.location);
    submitData.append("price", formData.price || "0");
    submitData.append("tickets", formData.capacity); // Changed from capacity to tickets
    submitData.append("category", formData.category || "other");
    submitData.append("adminId", userInfo?.id);

    // Add required payment fields with defaults
    submitData.append("accountName", "Event Organizer");
    submitData.append("accountNumber", "1234567890");
    submitData.append("bankName", "Sample Bank");

    if (selectedImage) {
      submitData.append("image", selectedImage);
    }

    try {
      const response = await fetch("http://localhost:8080/api/events", {
        method: "POST",
        body: submitData,
        // Don't set Content-Type header - let browser set it with boundary
      });

      // Check response status first
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create event");
      }

      const result = await response.json();
      alert(result.message || "Event created successfully!");
      handleCloseForm();
    } catch (error) {
      console.error("Error creating event:", error);
      alert(error.message || "Failed to create event. Please try again.");
    }
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
    },
    header: {
      width: "100%",
      height: "60px",
      borderBottom: "1px solid rgba(0,0,0,.1)",
      background: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px",
      boxSizing: "border-box",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    userAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#4CAF50",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
    },
    userDetails: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    userName: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
    },
    userRole: {
      fontSize: "12px",
      color: "#666",
      textTransform: "capitalize",
    },
    createButton: {
      padding: "12px 20px",
      border: "none",
      borderRadius: "6px",
      color: "white",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "14px",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    formContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "30px",
      width: "90%",
      maxWidth: "700px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    },
    formTitle: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#333",
      textAlign: "center",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    formGroupFull: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      gridColumn: "1 / -1",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
    },
    input: {
      padding: "12px",
      border: "2px solid #e1e5e9",
      borderRadius: "6px",
      fontSize: "14px",
      transition: "border-color 0.3s ease",
      outline: "none",
    },
    textarea: {
      padding: "12px",
      border: "2px solid #e1e5e9",
      borderRadius: "6px",
      fontSize: "14px",
      resize: "vertical",
      minHeight: "100px",
      fontFamily: "inherit",
      transition: "border-color 0.3s ease",
      outline: "none",
    },
    select: {
      padding: "12px",
      border: "2px solid #e1e5e9",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "white",
      cursor: "pointer",
      transition: "border-color 0.3s ease",
      outline: "none",
    },
    fileInput: {
      padding: "12px",
      border: "2px dashed #e1e5e9",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
      textAlign: "center",
      transition: "all 0.3s ease",
      backgroundColor: "#f9f9f9",
    },
    fileInputActive: {
      borderColor: "#667eea",
      backgroundColor: "#f0f4ff",
    },
    imagePreview: {
      width: "100%",
      maxHeight: "200px",
      objectFit: "cover",
      borderRadius: "6px",
      marginTop: "10px",
      border: "2px solid #e1e5e9",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      justifyContent: "flex-end",
      marginTop: "30px",
    },
    cancelButton: {
      padding: "12px 20px",
      border: "2px solid #ddd",
      borderRadius: "6px",
      backgroundColor: "white",
      color: "#666",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s ease",
    },
    submitButton: {
      padding: "12px 20px",
      border: "none",
      borderRadius: "6px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s ease",
    },
    content: {
      padding: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 60px)",
      color: "#666",
    },
    dashboardHeader: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "10px",
      color: "#333",
      textAlign: "center",
    },
    dashboardSubheader: {
      fontSize: "16px",
      color: "#666",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>
            {userInfo?.firstname?.charAt(0) || "U"}
          </div>
          <div style={styles.userDetails}>
            <div style={styles.userName}>
              {userInfo?.firstname} {userInfo?.lastname}
            </div>
            <div style={styles.userRole}>{userInfo?.role || "user"}</div>
          </div>
        </div>
        <button
          style={styles.createButton}
          onClick={handleNewEvent}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
          }}
        >
          Create Event +
        </button>
      </div>

      <div style={styles.content}>
        {!showForm && (
          <div>
            <h2 style={styles.dashboardHeader}>Welcome to Events Dashboard</h2>
            <p style={styles.dashboardSubheader}>
              Click "Create Event" to add a new event
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Create New Event</h2>
            <div>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Title *</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    style={styles.select}
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
                  >
                    <option value="">Select Category</option>
                    <option value="music">Music</option>
                    <option value="sports">Sports</option>
                    <option value="theater">Theater</option>
                    <option value="conference">Conference</option>
                    <option value="festival">Festival</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date *</label>
                  <input
                    style={styles.input}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Time *</label>
                  <input
                    style={styles.input}
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location *</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price ($)</label>
                  <input
                    style={styles.input}
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Capacity</label>
                  <input
                    style={styles.input}
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
                  />
                </div>
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.label}>Event Image</label>
                <div style={styles.fileInput}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="eventImage"
                  />
                  <label htmlFor="eventImage" style={{ cursor: "pointer" }}>
                    {selectedImage
                      ? selectedImage.name
                      : "Click to select an image (Max 5MB)"}
                  </label>
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Event Preview"
                    style={styles.imagePreview}
                  />
                )}
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.textarea}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description..."
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
                />
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={handleCloseForm}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f5f5f5";
                    e.target.style.borderColor = "#bbb";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.borderColor = "#ddd";
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={styles.submitButton}
                  onClick={handleSubmit}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
