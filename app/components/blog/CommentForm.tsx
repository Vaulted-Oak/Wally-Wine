import { useFetcher, useLocation, useNavigate, useRevalidator } from "react-router";
import { useCallback, useEffect, useRef } from "react";

interface CommentFormProps {
  blogHandle: string;
  articleHandle: string;
  blogId: string;
  articleId: string;
}

interface CommentsResponse {
  success: boolean;
  errors?: {
    email?: string;
    author?: string;
    body?: string;
  };
}
export default function CommentForm({ articleId, blogId, blogHandle, articleHandle }: CommentFormProps) {
  const { Form, ...fetcher } = useFetcher<CommentsResponse>();
  const { data } = fetcher;
  const subscribeSuccess = data?.success;
  const extractId = useCallback((gid: string) => gid?.split('/').pop(), []);
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (subscribeSuccess) {
      formRef.current?.reset();
      navigate(location.pathname, {
        replace: true,
        preventScrollReset: true
      });
    }
  }, [subscribeSuccess]);

  return (
    <Form
      method="POST"
      action={`/blogComments`}
      className="comment-form hidden max-w-[500px] mt-[30px]"
      ref={formRef}
      key={subscribeSuccess ? 'success' : 'default'}
    >
      <h4 className="text-[20px] border-b-[1px] border-[#cccccc] pb-2 mb-4">Leave a Comment</h4>
      {subscribeSuccess ? (
        <p style={{ color: 'green' }}>
          Your comment was posted successfully! Thank you!
        </p>
      ) : null}
      <input type="hidden" name="form_type" value="new_comment" />
      <input type="hidden" name="utf8" value="✓" />
      <input type="hidden" name="blogId" value={Number(extractId(blogId))} />
      <input type="hidden" name="articleId" value={Number(extractId(articleId))} />
      <div className="mb-6">
        <label>
          <span className="block mb-2">Name<em className="text-primaryRed">*</em></span>
          <input className="border-[1px] border-[#cccccc] p-4 w-full" type="text" name="author" />
          {data?.errors?.author ? (
              <em className="text-primaryRed mt-[10px] block">{data?.errors.author}</em>
          ) : null}
        </label>
      </div>
      <div className="mb-6">
        <label>
          <span className="block mb-2">Email<em className="text-primaryRed">*</em></span>
          <input className="border-[1px] border-[#cccccc] p-4 w-full" type="text" name="email" />
          {data?.errors?.email ? (
              <em className="text-primaryRed mt-[10px] block">{data?.errors.email}</em>
          ) : null}
        </label>
      </div>
      <div className="mb-6">
        <label>
          <span className="block mb-2">Comment<em className="text-primaryRed">*</em></span>
          <textarea className="border-[1px] border-[#cccccc] p-2 w-full h-[100px]" name="body"></textarea>
          {data?.errors?.body ? (
              <em className="text-primaryRed mt-[10px] block">{data?.errors.body}</em>
          ) : null}
        </label>
      </div>
      <button type="submit" className="border border-primaryGreen py-4 px-8 hover:bg-primaryGreen hover:text-white uppercase text-primaryGreen">Submit</button>
    </Form>
  );
}
