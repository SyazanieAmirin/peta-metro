import React, { useEffect } from 'react';

const AdSenseAd = () => {
    useEffect(() => {
        const scriptId = 'adsbygoogle-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.async = true;
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            script.setAttribute('data-ad-client', 'ca-pub-5336437476198786');
            document.body.appendChild(script);
        }

        // Ensure AdSense ads are rendered
        if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
            window.adsbygoogle.push({});
        }
    }, []);

    return (
        <div className="w-full flex justify-center my-5">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-5336437476198786"
                data-ad-slot="6571727952"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default AdSenseAd;
