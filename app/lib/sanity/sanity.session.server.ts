import type {Session, SessionStorage} from '@shopify/remix-oxygen';

import {createCookieSessionStorage} from '@shopify/remix-oxygen';

export class SanitySession {
  get has() {
    return this.#session.has;
  }
  get set() {
    return this.#session.set;
  }

  #session;

  #sessionStorage;

  constructor(sessionStorage: SessionStorage, session: Session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }

  static async init(request: Request, secrets: string[]) {
    // Check if we're on localhost (development) or production
    const url = new URL(request.url);
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    
    const storage = createCookieSessionStorage({
      cookie: {
        httpOnly: true,
        name: 'sanityPreview',
        // samesite must be none so Sanity Studio can access the cookie in iframe
        sameSite: 'none',
        secrets,
        // Only require secure in production (HTTPS), allow insecure on localhost
        secure: !isLocalhost,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new this(storage, session);
  }

  commit() {
    return this.#sessionStorage.commitSession(this.#session);
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }
}
