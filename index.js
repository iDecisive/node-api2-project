const express = require('express');

const postsRouter = require('./postsRouter.js');

const server = express();

server.use(express.json());

const PORT = 8000;

server.use("/api/posts", postsRouter);


server.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

})