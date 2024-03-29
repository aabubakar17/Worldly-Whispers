const db = require("../db/connection");
const fs = require("fs/promises");
const { sort } = require("../db/data/test-data/articles");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchEndpoints = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf8").then((data) => {
    return JSON.parse(data);
  });
};

exports.findArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.article_id, articles.topic, articles.title, articles.created_at, articles.author, articles.votes, articles.article_img_url,articles.body, COUNT(*) AS comment_count FROM comments RIGHT JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id, articles.topic, articles.title, articles.created_at, articles.author, articles.votes, articles.article_img_url, articles.body;",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "Not Found" });
      } else {
        return rows[0];
      }
    });
};

exports.fetchArticles = (topic, sort_by = "created_at", order = "DESC") => {
  let queryStr =
    "SELECT articles.article_id, articles.topic, articles.title, articles.created_at, articles.author, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER)AS comment_count FROM comments RIGHT JOIN articles ON comments.article_id = articles.article_id";

  const queryValues = [];

  if (topic) {
    queryStr += " WHERE articles.topic = $1";
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id, articles.topic, articles.title, articles.created_at, articles.author, articles.votes, articles.article_img_url ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.findCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (article_id, newComment) => {
  ///const created_at = new Date();

  return db
    .query(
      "INSERT INTO comments (body, votes, author, article_id, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [newComment.body, 0, newComment.username, article_id, new Date()]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleById = (article_id, newVote) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [newVote, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "Comment Not Found" });
      }
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};
