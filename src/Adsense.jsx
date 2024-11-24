import { useEffect } from 'react';

const AdSenseAd = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error(e);
        }
    }, []);

    return (
        <ins className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-5336437476198786"
            data-ad-slot="6571727952"
            data-ad-format="auto"
            data-full-width-responsive="true">
        </ins>
    );
};

export default AdSenseAd;