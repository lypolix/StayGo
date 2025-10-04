CREATE TABLE user_reviews (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, review_id)
);
