const express = require('express');

const postsRouter = require('./postsRouter.js');

const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter);

const PORT = 8000;


server.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

})