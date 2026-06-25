import type {MetaFunction} from '@shopify/remix-oxygen';
import {data as json} from '@shopify/remix-oxygen';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router';
import { BLOG_ARTICLE_QUERY } from '~/graphql/queries';
import invariant from 'tiny-invariant';
import ShareButton from '../components/blog/ShareButton';
import CommentForm from '../components/blog/CommentForm';
import { Fragment, useCallback, useState } from 'react';
import { mergeMeta } from '~/lib/meta';
import { getSeoMetaFromMatches } from '~/lib/seo';
import { seoPayload } from '~/lib/seo.server';

export const meta: MetaFunction<typeof loader> = mergeMeta(({ matches }) =>
  getSeoMetaFromMatches(matches),
);

export async function loader({
  params,
  context,
  request
}: {
  params: { blogHandle: string; articleHandle: string };
  context: any;
  request: Request
}) {
  const { blogHandle, articleHandle } = params;
  const { storefront } = context;

  invariant(blogHandle, 'Missing blog handle');
  invariant(articleHandle, 'Missing article handle');
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const { blog } = await storefront.query(BLOG_ARTICLE_QUERY, {
    variables: { blogHandle, articleHandle, first: 10 * page },
  });

  if (!blog?.articleByHandle) {
    throw new Response('Article not found', { status: 404 });
  }

  const seo = seoPayload.blog({
    blog: {
      title: articleHandle,
      seo: {
        title: blog.articleByHandle?.seo?.title || blog.articleByHandle?.title,
        description: blog.articleByHandle?.seo?.description || ""
      }
    },
    url: request.url
  });

  return json({ currentPage: page, blog: blog, article: blog.articleByHandle, blogHandle, articleHandle, blogId: blog.id, seo });
}

export default function BlogDetail() {
  const { article, articleHandle, blog, blogId, blogHandle, currentPage } = useLoaderData<typeof loader>();
  const commentCount = article.comments.edges.length;
  const [page, setPage] = useState<number>(currentPage);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoadMore = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const nextPage = page + 1;
    setPage(nextPage);
    const existingValues = params.getAll("page");
    if (existingValues) {
      params.delete("page");
    }
    params.append("page", nextPage?.toString());
    navigate(`${location.pathname}?${params.toString()}`, {
      replace: true,
      preventScrollReset: true
    });
  }, [page]);
  return (
    <div className="container">
      <div className="blog-detail">
        <div className='flex items-center md:space-x-4 space-x-2 mt-[30px]'>
          <Link className="hover:underline text-black text-sm font-medium" to={`/homepage`}>Home </Link>
          <div className="flex items-center">
            <span className="h-5 w-5 flex-shrink-0 text-black">
              /
            </span>
            <Link className="hover:underline text-black text-sm font-medium" to={`/blogs/${blogHandle}`}> {blog.title} </Link>
          </div>
          <p className="flex items-center">
            <span className="h-5 w-5 flex-shrink-0 text-black">
              /
            </span>
            <span className="text-sm font-medium !text-primaryGreen tracking-[1px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[95px] md:max-w-max">
              {article.title}
            </span>
          </p>
        </div>
        <h1 className="py-6 text-[32px]">{article.title}</h1>
        {article.image && (
          <img src={article.image.url} alt={article.image.altText || article.title} />
        )}
        <div className="flex my-4">
          <p>Published on: {new Date(article.publishedAt).toLocaleDateString()}</p>
          <ShareButton title={article.title} />
        </div>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        ></div>

        {/* Comments Section */}
        <div className="comments-section mt-[30px] hidden">
          <h4 className="text-[20px] my-4">
            Comments ({commentCount})
          </h4>
          {commentCount > 0 ? (
            <Fragment>
              <ul>
                {article.comments.edges.map(({ node }: any, index: number) => (
                  <li key={index} className="mb-2">
                    <p>
                      <strong>{node.author.name}:</strong> {node.content}
                    </p>
                  </li>
                ))}
              </ul>
              {article?.comments?.pageInfo?.hasNextPage && (
                <div className="load-more-container text-center py-6">
                  <button
                    onClick={handleLoadMore}
                    className="load-more-btn px-4 py-2 bg-white text-primaryGreen hover:bg-primaryGreen hover:text-white duration-500 border border-primaryGreen uppercase text-[13px] w-[300px] h-[47px]"
                  >
                    Load More
                  </button>
                </div>
              )}
            </Fragment>
          ) : (
            <span className="block mb-2">No comments yet</span>
          )}
        </div>
        <CommentForm blogHandle={blogHandle} blogId={blogId} articleId={article.id} articleHandle={articleHandle} />
      </div>
    </div>
  );
}
