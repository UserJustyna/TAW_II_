// AdminPanel.js
import React, { useEffect, useState } from "react";
import AddArticle from "../components/AddArticle";
import axios from "axios";

const EducationalPanel = () => {
  const [article, setArticle] = useState([]);

  const getArticles = () => {
    axios
      .get("http://localhost:3000/api/article/getAll", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setArticle(response.data);
      });
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div>
      <h1>Panel Edukacyjny</h1>
      <h2>Article</h2>
      <ul>
        {article.map((article, index) => (
          <li key={index}>
            {article.title && (
              <h3>
                <strong>{article.title}</strong>
              </h3>
            )}
            <p>{article.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EducationalPanel;
