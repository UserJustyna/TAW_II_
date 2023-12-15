// AddArticle.js
import React, { useState } from "react";
import axios from "axios";

const AddArticle = ({ onAddArticle }) => {
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [error, setError] = useState("");

  const handleAddArticle = () => {
    if (!articleTitle || !articleContent) {
      setError("Uzupełnij pola Tytułu oraz Treści artykułu.");
      return;
    }

    const newArticle = {
      title: articleTitle,
      content: articleContent,
    };

    axios({
      method: "post",
      url: "http://localhost:3000/api/article/create",
      data: newArticle,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        onAddArticle();
      })
      .catch((error) => console.log(error));

    // Clear the form and error after adding the article
    setArticleTitle("");
    setArticleContent("");
    setError("");
  };

  return (
    <div>
      <h2>Add Article</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        value={articleTitle}
        onChange={(e) => setArticleTitle(e.target.value)}
        placeholder="Article Title"
      />
      <textarea
        value={articleContent}
        onChange={(e) => setArticleContent(e.target.value)}
        placeholder="Type your article here..."
        rows="10"
        cols="50"
        maxLength="5000"
      />
      <button onClick={handleAddArticle}>Add Article</button>
    </div>
  );
};

export default AddArticle;
