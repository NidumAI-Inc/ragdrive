// import Script from 'next/script';

function GoogleAnalytics() {
  // let gId = "G-98PNYYVMV9"
  return (
    <>
      {/* <Script
        strategy='lazyOnload'
        src={`https://www.googletagmanager.com/gtag/js?id=${gId}`}
      />

      <Script id='' strategy='lazyOnload'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gId}', {
          page_path: window.location.pathname,
          });
        `}
      </Script> */}
    </>
  )
}

export default GoogleAnalytics
