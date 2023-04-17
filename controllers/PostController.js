import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()
        const tags = posts
            .map((obg) => obg.tags)
            .flat()
            .slice(0, 5)
        res.json(tags)
    } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Failed to retrieve tags'
            });
    }
}

export const  getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({path:'user', select: '-passwordHash'}).exec()
        res.json(posts)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve articles'
        });
    }
};

export const getOne = async (req, res) => {
    try {
      const postId = req.params.id;
      const doc = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { viewsCount: 1 },
        },
        {
          new: true
        }
      ).populate("user");
  
      if (!doc) {
        return res.status(404).json({
          message: 'Not found articles'
        });
      }
  
      res.json(doc);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Failed to retrieve articles'
      });
    }
};
  

export const  create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(',').map((tag)=>tag.trim()),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })

        const post = await doc.save()
        res.json(post)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create article'
        });
    }
};

export const remove = async (req, res) => {
    try {
      const postId = req.params.id;
      const deletedPost = await PostModel.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.json({ message: 'Post deleted successfully', deletedPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete post' });
    }
};

  export const  update = async (req, res) => {
    try {
            const postId = req.params.id;

            await PostModel.updateOne(
                {
                    _id: postId,
                },
                {
                    title: req.body.title,
                    text: req.body.text,
                    tags: req.body.tags.split(',').map((tag)=>tag.trim()),
                    imageUrl: req.body.imageUrl,
                    user: req.userId,
                }
            )
        
            res.json({
                success: true,
            })
        } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create update'
        });
    }
};