import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const generateDummyPost = () => {
    const randomTitle = `Dummy Post ${Math.floor(Math.random() * 100)}`;
    const randomContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${Math.random()}`;
    return { title: randomTitle, content: randomContent, _id: Math.random() };
  };

  const fetchPosts = () => {
    try {
      const newPosts = Array.from({ length: 5 }, generateDummyPost);

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching dummy posts:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-semibold mb-4">MelodyVerse Posts</h2>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<h4 className="text-gray-600">Loading...</h4>}
        className="flex flex-wrap -mx-4"
      >
        {posts.map((post) => (
          <div key={post._id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
            <div className="bg-white p-6 rounded-md shadow-md">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-700">{post.content}</p>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PostList;
