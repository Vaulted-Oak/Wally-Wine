import { Link } from "react-router";

interface BlogCardProps {
  article: {
    id: string;
    title: string;
    handle: string;
    excerpt: string;
    publishedAt: string;
    contentHtml?: string;
    tags?: [string]
    image?: {
      url: string;
      altText: string;
    };
  };
  blogHandle: string;
}

const stripHtmlAndTruncate = (maxLength: number, html?: string) => {
  const text = html?.replace(/<[^>]*>/g, ""); // Remove HTML tags
  return text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export default function BlogCard({ article, blogHandle }: BlogCardProps) {
  return (
    <div className="blog-card w-[100%] md:w-[50%] px-[0] md:px-[10px] mb-[20px]">
      <Link to={`/blog/${blogHandle}/${article.handle}`}>
        {article.image && (
          <img className="w-full h-[250px] md:h-[350px] xl:h-[500px] object-cover" src={article.image.url} alt={article.image.altText || article.title} />
        )}
        <div>
          <h2 className="text-primaryGreen text-lg my-4 min-h-[22px] line-clamp-1">
            {article.title}
          </h2>
          <p className="hidden">{article?.tags?.join(", ")}</p>
          <p className="mb-4">Published on: {new Date(article.publishedAt).toLocaleDateString()}</p>
          <p className="mb-2">{article.excerpt}</p>
          <Link className="inline-block duration-500 border border-primaryGreen py-3 px-6 hover:bg-primaryGreen hover:text-white uppercase text-primaryGreen" to={`/blog/${blogHandle}/${article.handle}`}>Read More</Link>
        </div>
      </Link>
    </div>
  );
}
