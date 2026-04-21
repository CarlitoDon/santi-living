import Script from 'next/script';

const CLARITY_PROJECT_ID = 'v77usjos99';

export function ClarityScript() {
  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function() {
          // Respect developer mode
          if (typeof window !== "undefined" && localStorage.getItem("developer_mode") === "true") {
            console.log("🛠️ Developer Mode Active: Microsoft Clarity disabled.");
            return;
          }

          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=npm";
            t.id="clarity-script";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${CLARITY_PROJECT_ID}");
        })();
      `}
    </Script>
  );
}
