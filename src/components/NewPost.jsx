import { useState } from "react";
import "../styles/newpost.css";

const URL = "https://ticket-server-e4r3.onrender.com/api/news";

export default function NewPost() {
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState(null);

  const handleNewPost = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the file and other data
    const formData = new FormData();
    formData.append("body", postContent);
    if (image) {
      formData.append("image", image); // Append the image file
    }

    try {
      const res = await fetch(URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      const data = await res.json();
      console.log("Post created successfully:", data);
      alert("Post created successfully!");

      // Clear the form
      setPostContent("");
      setImage(null);
      document.getElementById("image").value = ""; // Clear the file input
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <form className="newPost" onSubmit={handleNewPost}>
      <div className="main-post-container">
        <h3
          style={{
            textAlign: "center",
            fontSize: "30px",
            marginTop: "-100px",
            fontWeight: "500",
          }}
        >
          What's in your mind...
        </h3>
        <textarea
          name="body"
          id="body"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        ></textarea>

        <div style={{ display: "flex", margin: "20px auto" }}>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="submit-button">
          Post
        </button>
      </div>{" "}
    </form>
  );
}
