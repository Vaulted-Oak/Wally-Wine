import type {MetaFunction} from '@shopify/remix-oxygen';
import {data as json} from '@shopify/remix-oxygen';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router';
import { BLOG_ARTICLES_QUERY } from '~/graphql/queries';
import BlogCard from '../components/blog/BlogCard';
import { useCallback, useState } from 'react';
import { mergeMeta } from '~/lib/meta';
import { getSeoMetaFromMatches } from '~/lib/seo';
import { seoPayload } from '~/lib/seo.server';

export const meta: MetaFunction<typeof loader> = mergeMeta(({ matches }) =>
  getSeoMetaFromMatches(matches),
);
export async function loader({ params, context, request }: { params: { blogHandle: string; }; context: any, request: Request }) {
  const { storefront } = context;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const { blog } = await storefront.query(BLOG_ARTICLES_QUERY, {
    variables: { handle: params.blogHandle, first: 4 * page },
  });

  if (!blog) {
    throw new Response('Blog not found', { status: 404 });
  }
  const seo = seoPayload.blog({
    blog: {
      title: params.blogHandle,
      seo: {
        title: blog.seo?.title || blog.title,
        description: blog.seo?.description || ""
      }
    },
    url: request.url
  });

  return json({ blog, seo, currentPage: page });
}

export default function BlogListing() {
  const { blog, currentPage } = useLoaderData<typeof loader>();
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
      <div className="blog-listing">
        <div className='flex items-center md:space-x-4 space-x-2 mt-[30px]'>
          <Link className="hover:underline text-black text-sm font-medium" to={`/homepage`}>Home </Link>
          <p className="flex items-center">
            <span className="h-5 w-5 flex-shrink-0 text-black">
              /
            </span>
            <span className="text-sm font-medium !text-primaryGreen tracking-[1px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[95px] md:max-w-max">
              {blog.title}
            </span>
          </p>
        </div>
        <h1 className="py-6 text-[32px]">{blog.title}</h1>
        <div className="blog-articles flex w-full flex-wrap mx-[0] md:mx-[-10px]">
          {blog.articles.edges.map(({ node }: any) => (
            <BlogCard key={node.id} article={node} blogHandle={blog.handle} />
          ))}
        </div>
        {blog.articles.pageInfo.hasNextPage && (
          <div className="load-more-container text-center py-6">
            <button
              onClick={handleLoadMore}
              className="load-more-btn px-4 py-2 bg-white text-primaryGreen hover:bg-primaryGreen hover:text-white duration-500 border border-primaryGreen uppercase text-[13px] w-[300px] h-[47px]"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
