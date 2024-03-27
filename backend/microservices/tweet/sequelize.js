const { Sequelize } = require("sequelize");


const TweetModel = require("./models/Tweet");
const RetweetModel = require("./models/Retweet");
const LikeModel = require("./models/Like");
const FollowerModel = require("./models/Follower");
const BookmarkModel = require("./models/Bookmark");
const CommentModel = require("./models/Comment");
const UserModel = require("./models/User");

// Connect to database
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
});
(async () => {
  try {
    const res = await sequelize.sync();
  } catch (err) {
    console.log(err);
  }
})();

const Tweet = TweetModel(sequelize);
const Follower = FollowerModel(sequelize);
const Retweet = RetweetModel(sequelize);
const Like = LikeModel(sequelize);
const Bookmark = BookmarkModel(sequelize);
const Comment = CommentModel(sequelize);
const User = UserModel(sequelize);

// User -> Tweet association
User.hasMany(Tweet, { foreignKey: "userId" });
// User -> Like association
User.hasMany(Like, { foreignKey: "userId" });
// User -> Retweet association
User.hasMany(Retweet, { foreignKey: "userId" });
// Tweet -> Like association
Tweet.hasMany(Like, { foreignKey: "tweetId" });
// Tweet -> Retweet association
Tweet.hasMany(Retweet, { foreignKey: "tweetId" });
// User -> Comment association
User.hasMany(Comment, { foreignKey: "userId" });
// Tweet -> Bookmark association
Tweet.hasMany(Bookmark, { foreignKey: "tweetId" });
User.hasMany(Bookmark, { foreignKey: "userId" });



module.exports = {
  User,
  Follower,
  Tweet,
  Retweet,
  Like,
  Comment,
  Bookmark,
  sequelize,
};
