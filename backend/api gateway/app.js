require("dotenv").config();
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

var restream = function(proxyReq, req, res, options) {
  if (req.body) {
      let bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type','application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
  }
}


const ProxyMiddlewareTweet = () => {
  return (req, res, next) => {
    let { variable1 } = req.params;
    if (variable1 === "like" || variable1 === "retweet") {
      createProxyMiddleware({
        target: process.env.TWEET,
        changeOrigin: true,
        pathRewrite: {
          '^/tweet/': '/tweet/'
        },
        onProxyReq: restream, 
      })(req, res, next);
    } else {
      createProxyMiddleware({
        target: process.env.TWEET,
        changeOrigin: true,
        pathRewrite: {
          '^/tweet/': '/tweet/'
        },
      })(req, res, next);
    }
  };
};


app.use('/tweet/:variable1/:variable2', ProxyMiddlewareTweet());

app.use('/tweet/:variable', createProxyMiddleware({
    target: `${process.env.TWEET}`,
    changeOrigin: true,
    pathRewrite: {
      '^/tweet/': '/tweet/' 
    },
}));

const ProxyMiddlewareUser = () => {
  return (req, res, next) => {
    if (req.params.variable === "login-user" || req.params.variable === "add-user") {

      createProxyMiddleware({
        target: `${process.env.USER}`,
        changeOrigin: true,
        pathRewrite: {
          '^/user/': '/user/' 
        },
        onProxyReq: restream,
      })(req, res, next); 
    } else {
      createProxyMiddleware({
        target: `${process.env.USER}`,
        changeOrigin: true,
        pathRewrite: {
          '^/user/': '/user/' 
        },
      })(req, res, next);
    }
  };
};
app.use('/user/:variable', ProxyMiddlewareUser());


app.use('/follow/:variable', createProxyMiddleware({
    target: `${process.env.FOLLOW}`,
    changeOrigin: true,
    pathRewrite: {
      '^/follow/': '/follow/' 
    },
    onProxyReq: restream,
}));

app.use('/follow/', createProxyMiddleware({
  target: `${process.env.FOLLOW}`,
  changeOrigin: true,
  pathRewrite: {
    '^/follow/': '/follow/' 
  },
  onProxyReq: restream,
}));

app.use('/feed/:variable', createProxyMiddleware({
    target: `${process.env.FEED}`,
    changeOrigin: true,
    pathRewrite: {
      '^/feed/': '/feed/' 
    },
    onProxyReq: restream,
}));

app.use('/feed/', createProxyMiddleware({
  target: `${process.env.FEED}`,
  changeOrigin: true,
  pathRewrite: {
    '^/feed/': '/feed/' 
  },
  onProxyReq: restream,
}));

app.use('/explore/:variable', createProxyMiddleware({
    target: `${process.env.EXPLORE}`,
    changeOrigin: true,
    pathRewrite: {
      '^/explore/': '/explore/' 
    }
}));

app.use('/explore/', createProxyMiddleware({
  target: `${process.env.EXPLORE}`,
  changeOrigin: true,
  pathRewrite: {
    '^/explore/': '/explore/' 
  }
}));

app.use('/bookmarks/:variable', createProxyMiddleware({
    target: `${process.env.BOOKMARKS}`,
    changeOrigin: true,
    pathRewrite: {
      '^/bookmarks/': '/bookmarks/' 
    },
    onProxyReq: restream,
}));

app.use('/bookmarks/', createProxyMiddleware({
  target: `${process.env.BOOKMARKS}`,
  changeOrigin: true,
  pathRewrite: {
    '^/bookmarks/': '/bookmarks/' 
  }
}));

app.get("/",async(req,res)=>{
  res.send({success: true});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
