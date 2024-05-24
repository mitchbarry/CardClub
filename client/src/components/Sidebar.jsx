import { useState, useEffect } from "react";
import styles from "../css/components/Sidebar.module.css";

const Sidebar = () => {

    const [bannerAd, setBannerAd] = useState(1);

    useEffect(() => {
        setBannerAd(Math.floor(Math.random() * 6) + 1); // Generate a random bannerAd when the component mounts
    }, []);

    return (
        <div className={styles.sidebar}>
            {bannerAd === 1 && <img className={styles.sidebarAd} src="/assets/bluePerfumeSkyscraperBanner.png" alt="Blue Perfume Banner Ad"></img>}
            {bannerAd === 2 && <img className={styles.sidebarAd} src="/assets/creativeCodingSkyscraperBanner.png" alt="Creative Coding Banner Ad"></img>}
            {bannerAd === 3 && <img className={styles.sidebarAd} src="/assets/freshPizzaSkyscraperBanner.png" alt="Fresh Pizza Banner Ad"></img>}
            {bannerAd === 4 && <img className={styles.sidebarAd} src="/assets/healthySupplementsSkyscraperBanner.png" alt="Healthy Supplements Banner Ad"></img>}
            {bannerAd === 5 && <img className={styles.sidebarAd} src="/assets/photoSaleSkyscraperBanner.png" alt="Photo Sales Banner Ad"></img>}
            {bannerAd === 6 && <img className={styles.sidebarAd} src="/assets/productLaunchSkyscraperBanner.png" alt="Product Launch Banner Ad"></img>}
        </div>
    )
}

export default Sidebar;