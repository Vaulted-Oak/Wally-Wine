import {useRootLoaderData} from '~/root';

import {CmsSection} from '../CmsSection';
import {Image, Script} from '@shopify/hydrogen';

export function Footer() {
  const rootData = useRootLoaderData();
  const {sanityRoot, env} = rootData || {};
  const data = sanityRoot?.data;
  const footerSections = data?.footer?.sections;
  const footer = data?.footer?.footer;

  return (
    <>
      {/* Sections */}
      {footerSections && footerSections.length > 0
        ? footerSections.map((section, index) => (
            <CmsSection data={section} index={index} key={section._key} />
          ))
        : null}
      {/* Footer Section */}
      {footer ? (
        <CmsSection data={footer} key={footer._key} type="footer" />
      ) : null}

      {/* LinkedIn Tracking Script */}
      {env?.LINKEDIN_PARTNER_ID && (
        <>
          <Script
            defer
            rel="preload"
            dangerouslySetInnerHTML={{
              __html: `
                _linkedin_partner_id = "${env.LINKEDIN_PARTNER_ID}";
                window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                window._linkedin_data_partner_ids.push(_linkedin_partner_id);
              `,
            }}
          />
          <Script
            defer
            rel="preload"
            dangerouslySetInnerHTML={{
              __html: `
                (function(l) {
                  if (!l) {
                    window.lintrk = function(a, b) {
                      window.lintrk.q.push([a, b]);
                    };
                    window.lintrk.q = [];
                  }
                  var s = document.getElementsByTagName("script")[0];
                  var b = document.createElement("script");
                  b.type = "text/javascript";
                  b.async = true;
                  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                  s.parentNode.insertBefore(b, s);
                })(window.lintrk);
              `,
            }}
          />
        </>
      )}
      {env?.BING_TAG_ID && (
        <Script
          defer
          rel="preload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,t,r,u) {
                var f,n,i;
                w[u]=w[u]||[],f=function() {
                  var o={ti:"${env.BING_TAG_ID}"};
                  o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")
                },
                n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function() {
                  var s=this.readyState; s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)
                },
                i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)
              })(window,document,"script","//bat.bing.com/bat.js","uetq");
            `,
          }}
        />
      )}
      {env?.LINKEDIN_PARTNER_ID && (
        <noscript>
          <Image
            height="1"
            width="1"
            style={{display: 'none'}}
            alt=""
            src={`https://px.ads.linkedin.com/collect/?pid=${env.LINKEDIN_PARTNER_ID}&fmt=gif`}
          />
        </noscript>
      )}
      {/* Facebook Pixel Code */}
      {env?.FB_PIXEL_ID && (
        <>
          <Script
            defer
            rel="preload"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                document,'script','https://connect.facebook.net/en_US/fbevents.js');
               
                fbq('init', '${env.FB_PIXEL_ID}');
                fbq('track', "PageView");
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{display: 'none'}}
              alt=""
              src={`https://www.facebook.com/tr?id=${env.FB_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}
    </>
  );
}
