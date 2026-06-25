import {useEffect, useState} from 'react';
import type {Cart as CartType} from '@shopify/hydrogen/storefront-api-types';
import {CartForm} from '@shopify/hydrogen';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';
import {IconRemove} from '../icons/IconRemove';
import {Button} from '../ui/Button';
import {Input} from '../ui/Input';
import {IconLoader} from '../icons/IconLoader';

export function CartNotes({
  note,
  layout,
}: {
  note: CartType['note'];
  layout: 'drawer' | 'page';
}) {
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.NoteUpdate);
  const cartIsLoading = Boolean(addToCartFetchers.length);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noteIsAdded, setNoteIsAdded] = useState<boolean>(false);
  const [noteInput, setNoteInput] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleValidation = async () => {
    if (!noteInput) {
      setErrorMessage('Note cannot be empty');
      return false;
    } else {
      setErrorMessage(null);
      setSuccessMessage('Note is added successfully');
      return true;
    }
  };

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 5000);
      if (successMessage) {
        setNoteInput('');
      }
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return note ? (
    <dl className={'grid'}>
      {successMessage && (
        <div className="mt-2 text-[#00461C]">{successMessage}</div>
      )}
      <div className="flex items-center justify-between font-medium">
        <span>Note</span>
        <div className="flex items-center justify-between">
          <UpdateNoteForm>
            <button
              className="[&>*]:pointer-events-none"
              disabled={cartIsLoading}
            >
              {cartIsLoading && !errorMessage ? (
                <IconLoader className="size-5 animate-spin" />
              ) : (
                <IconRemove
                  aria-hidden="true"
                  style={{height: 18, marginRight: 4}}
                />
              )}
            </button>
          </UpdateNoteForm>
          <span>{note}</span>
        </div>
      </div>
    </dl>
  ) : (
    <>
      {errorMessage && <div className="mt-2 text-red-500">{errorMessage}</div>}
      <UpdateNoteForm note={note as string}>
        <div
          className={cn(
            'flex',
            layout === 'page' && 'flex-col flex-wrap lg:flex-row',
            'items-center justify-between gap-4',
          )}
        >
          <Input
            className="h-[48px] rounded-none !border !border-[#D0D0D0] ring-0"
            name="note"
            placeholder={'Note'}
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
          <Button
            className={cn(
              'duration-3000 w-[210px] !border !border-primaryGreen bg-white text-[13px] font-normal uppercase text-primaryGreen hover:!bg-primaryGreen hover:!text-white',
              layout === 'page' && 'w-full',
            )}
            variant="outline"
            onClick={async () => {
              const isValid = await handleValidation();
              if (isValid) {
                setNoteIsAdded(true);
              } else {
                return;
              }
            }}
          >
            {cartIsLoading && !errorMessage ? (
              <IconLoader className="size-5 animate-spin" />
            ) : (
              <span>Add Note</span>
            )}
          </Button>
        </div>
      </UpdateNoteForm>
    </>
  );
}

function UpdateNoteForm({
  children,
  note,
}: {
  children: React.ReactNode;
  note?: string;
}) {
  const cartPath = useLocalePath({path: '/cart'});
  return (
    <CartForm
      action={CartForm.ACTIONS.NoteUpdate}
      inputs={{
        note: note || '',
      }}
      route={cartPath}
    >
      {children}
    </CartForm>
  );
}
